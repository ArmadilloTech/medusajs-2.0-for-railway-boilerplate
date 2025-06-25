import { 
  IProductModuleService, 
  IInventoryService
} from "@medusajs/types"
import { ContainerRegistrationKeys, ModuleRegistrationName } from "@medusajs/framework/utils"
import ScanLogService from "./scan-log-service"

export interface ScanResult {
  success: boolean
  message: string
  product?: {
    id: string
    title: string
    sku: string
    currentQuantity: number
    previousQuantity: number
  }
  logId?: string
  error?: string
}

export interface ScanLog {
  id: string
  sku: string
  locationId: string
  locationName: string
  productTitle: string
  previousQuantity: number
  currentQuantity: number
  success: boolean
  message: string
  timestamp: Date
  reverted: boolean
  revertedAt?: Date
}

export default class ScannerModuleService {
  /**
   * Get required services from container
   */
  protected getServices(container: any) {
    return {
      productService: container.resolve(ModuleRegistrationName.PRODUCT) as IProductModuleService,
      inventoryService: container.resolve(ModuleRegistrationName.INVENTORY) as IInventoryService,
      query: container.resolve(ContainerRegistrationKeys.QUERY),
      scanLogService: new ScanLogService(container)
    }
  }

  /**
   * Save scan log to database
   */
  async saveScanLog(scanData: Omit<ScanLog, 'id' | 'timestamp'>, container: any): Promise<string> {
    const { scanLogService } = this.getServices(container)
    
    const log = await scanLogService.create({
      sku: scanData.sku,
      locationId: scanData.locationId,
      locationName: scanData.locationName,
      productTitle: scanData.productTitle,
      previousQuantity: scanData.previousQuantity,
      currentQuantity: scanData.currentQuantity,
      success: scanData.success,
      message: scanData.message,
      reverted: scanData.reverted || false,
      revertedAt: scanData.revertedAt
    })
    
    return log.id
  }

  /**
   * Get scan logs from database
   */
  async getScanLogs(limit: number = 100, container: any): Promise<ScanLog[]> {
    const { scanLogService } = this.getServices(container)
    return await scanLogService.list(limit)
  }

  /**
   * Mark scan log as reverted
   */
  async markScanLogReverted(logId: string, container: any): Promise<void> {
    const { scanLogService } = this.getServices(container)
    await scanLogService.update(logId, {
      reverted: true,
      revertedAt: new Date()
    })
  }

  /**
   * Clear all scan logs
   */
  async clearScanLogs(container: any): Promise<void> {
    const { scanLogService } = this.getServices(container)
    await scanLogService.delete()
  }

  /**
   * Scan a product by SKU and decrement its inventory by 1 at a specific location
   */
  async scanProductBySKU(sku: string, locationId: string, container: any): Promise<ScanResult> {
    try {
      const { query, inventoryService } = this.getServices(container)

      console.log(`=== SCANNER DEBUG ===`)
      console.log(`Looking for SKU: ${sku}`)
      console.log(`Location ID: ${locationId}`)

      // Get inventory item directly by SKU
      const { data: allInventoryItems } = await query.graph({
        entity: "inventory_item",
        fields: [
          "id",
          "sku",
          "title",
          "stocked_quantity"
        ]
      })

      // Manually filter for exact SKU match
      const inventoryItems = allInventoryItems?.filter(item => item.sku === sku) || []

      console.log(`Found ${inventoryItems?.length || 0} inventory items with SKU "${sku}"`)

      if (!inventoryItems || inventoryItems.length === 0) {
        // Save failed scan log
        const logId = await this.saveScanLog({
          sku: sku,
          locationId: locationId,
          locationName: "Unknown",
          productTitle: "Unknown",
          previousQuantity: 0,
          currentQuantity: 0,
          success: false,
          message: `No inventory item found with SKU: ${sku}`,
          reverted: false
        }, container)

        return {
          success: false,
          message: `No inventory item found with SKU: ${sku}`,
          error: "INVENTORY_ITEM_NOT_FOUND",
          logId: logId
        }
      }

      // If multiple inventory items found with same SKU, that's an error
      if (inventoryItems.length > 1) {
        console.log(`ERROR: Multiple inventory items found with SKU "${sku}":`)
        inventoryItems.forEach((item, i) => {
          console.log(`  ${i + 1}: ID=${item.id}, SKU=${item.sku}, Title=${item.title}`)
        })
        return {
          success: false,
          message: `Multiple inventory items found with SKU: ${sku}. This is a data integrity issue.`,
          error: "MULTIPLE_INVENTORY_ITEMS_FOUND"
        }
      }

      const inventoryItem = inventoryItems[0]
      console.log(`Selected inventory item: ID=${inventoryItem.id}, SKU=${inventoryItem.sku}, Title=${inventoryItem.title}`)
      
      // Get inventory levels for this item at the specific location
      const { data: allInventoryLevels } = await query.graph({
        entity: "inventory_level",
        fields: [
          "id",
          "inventory_item_id",
          "location_id",
          "stocked_quantity",
          "available_quantity"
        ]
      })

      // Manually filter for the specific inventory item and location
      const inventoryLevels = allInventoryLevels?.filter(level => 
        level.inventory_item_id === inventoryItem.id && 
        level.location_id === locationId
      ) || []

      console.log(`Found ${inventoryLevels?.length || 0} inventory levels for item ${inventoryItem.id} at location ${locationId}`)
      
      // Debug: Show all inventory levels for this item
      const allLevelsForItem = allInventoryLevels?.filter(level => level.inventory_item_id === inventoryItem.id) || []
      console.log(`All inventory levels for item ${inventoryItem.id}:`)
      allLevelsForItem.forEach((level, i) => {
        console.log(`  Level ${i + 1}: ID=${level.id}, Location=${level.location_id}, Stocked=${level.stocked_quantity}`)
      })

      if (!inventoryLevels || inventoryLevels.length === 0) {
        return {
          success: false,
          message: `Inventory item with SKU ${sku} has no inventory at location: ${locationId}`,
          error: "NO_INVENTORY_AT_LOCATION"
        }
      }

      const inventoryLevel = inventoryLevels[0]
      const previousQuantity = inventoryLevel.stocked_quantity || 0

      console.log(`Processing inventory level: ID=${inventoryLevel.id}, Previous Quantity=${previousQuantity}`)

      // Decrement inventory by 1
      const newQuantity = Math.max(0, previousQuantity - 1)
      
      // Update inventory level
      await inventoryService.updateInventoryLevels([
        {
          inventory_item_id: inventoryItem.id,
          location_id: locationId,
          stocked_quantity: newQuantity
        }
      ])

      console.log(`Updated inventory: ${previousQuantity} -> ${newQuantity}`)

      // Get location name for logging
      const { data: locations } = await query.graph({
        entity: "stock_location",
        fields: ["id", "name"]
      })
      
      const location = locations?.find(loc => loc.id === locationId)
      const locationName = location?.name || locationId

      // Save successful scan log
      const logId = await this.saveScanLog({
        sku: sku,
        locationId: locationId,
        locationName: locationName,
        productTitle: inventoryItem.title || "Unknown",
        previousQuantity: previousQuantity,
        currentQuantity: newQuantity,
        success: true,
        message: `Successfully scanned SKU: ${sku}`,
        reverted: false
      }, container)

      return {
        success: true,
        message: `Successfully scanned SKU: ${sku}`,
        product: {
          id: inventoryItem.id,
          title: inventoryItem.title || "Unknown",
          sku: inventoryItem.sku,
          currentQuantity: newQuantity,
          previousQuantity: previousQuantity
        },
        logId: logId
      }

    } catch (error) {
      console.error('Error scanning product:', error)
      
      // Save failed scan log
      const logId = await this.saveScanLog({
        sku: sku,
        locationId: locationId,
        locationName: "Unknown",
        productTitle: "Unknown",
        previousQuantity: 0,
        currentQuantity: 0,
        success: false,
        message: `Error scanning product: ${error instanceof Error ? error.message : 'Unknown error'}`,
        reverted: false
      }, container)

      return {
        success: false,
        message: `Error scanning product: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: "SCAN_ERROR",
        logId: logId
      }
    }
  }

  /**
   * Revert a scan by restoring previous inventory quantity
   */
  async revertScan(logId: string, container: any): Promise<ScanResult> {
    try {
      const { query, inventoryService, scanLogService } = this.getServices(container)

      // Get the scan log from database
      const scanLogs = await scanLogService.list(1000) // Get all logs to find the specific one
      const scanLog = scanLogs.find(log => log.id === logId)

      if (!scanLog) {
        return {
          success: false,
          message: `Scan log not found: ${logId}`,
          error: "LOG_NOT_FOUND"
        }
      }

      if (scanLog.reverted) {
        return {
          success: false,
          message: `Scan has already been reverted`,
          error: "ALREADY_REVERTED"
        }
      }

      // Get inventory item by SKU
      const { data: allInventoryItems } = await query.graph({
        entity: "inventory_item",
        fields: ["id", "sku", "title"]
      })

      const inventoryItem = allInventoryItems?.find(item => item.sku === scanLog.sku)

      if (!inventoryItem) {
        return {
          success: false,
          message: `Inventory item not found for SKU: ${scanLog.sku}`,
          error: "INVENTORY_ITEM_NOT_FOUND"
        }
      }

      // Get inventory level
      const { data: allInventoryLevels } = await query.graph({
        entity: "inventory_level",
        fields: ["id", "inventory_item_id", "location_id", "stocked_quantity"]
      })

      const inventoryLevel = allInventoryLevels?.find(level => 
        level.inventory_item_id === inventoryItem.id && 
        level.location_id === scanLog.locationId
      )

      if (!inventoryLevel) {
        return {
          success: false,
          message: `Inventory level not found for item ${scanLog.sku} at location ${scanLog.locationId}`,
          error: "INVENTORY_LEVEL_NOT_FOUND"
        }
      }

      // Restore previous quantity
      await inventoryService.updateInventoryLevels([
        {
          inventory_item_id: inventoryItem.id,
          location_id: scanLog.locationId,
          stocked_quantity: scanLog.previousQuantity
        }
      ])

      // Mark log as reverted
      await this.markScanLogReverted(logId, container)

      return {
        success: true,
        message: `Successfully reverted scan for SKU: ${scanLog.sku}`,
        product: {
          id: inventoryItem.id,
          title: inventoryItem.title || "Unknown",
          sku: inventoryItem.sku,
          currentQuantity: scanLog.previousQuantity,
          previousQuantity: scanLog.currentQuantity
        }
      }

    } catch (error) {
      console.error('Error reverting scan:', error)
      return {
        success: false,
        message: `Error reverting scan: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: "REVERT_ERROR"
      }
    }
  }

  /**
   * Undo a scan by restoring inventory and removing the log
   */
  async undoScan(logId: string, container: any): Promise<ScanResult> {
    try {
      const { query, inventoryService, scanLogService } = this.getServices(container)

      // Get the scan log from database
      const scanLogs = await scanLogService.list(1000) // Get all logs to find the specific one
      const scanLog = scanLogs.find(log => log.id === logId)

      if (!scanLog) {
        return {
          success: false,
          message: `Scan log not found: ${logId}`,
          error: "LOG_NOT_FOUND"
        }
      }

      if (scanLog.reverted) {
        return {
          success: false,
          message: `Scan has already been reverted`,
          error: "ALREADY_REVERTED"
        }
      }

      // Get inventory item by SKU
      const { data: allInventoryItems } = await query.graph({
        entity: "inventory_item",
        fields: ["id", "sku", "title"]
      })

      const inventoryItem = allInventoryItems?.find(item => item.sku === scanLog.sku)

      if (!inventoryItem) {
        return {
          success: false,
          message: `Inventory item not found for SKU: ${scanLog.sku}`,
          error: "INVENTORY_ITEM_NOT_FOUND"
        }
      }

      // Get inventory level
      const { data: allInventoryLevels } = await query.graph({
        entity: "inventory_level",
        fields: ["id", "inventory_item_id", "location_id", "stocked_quantity"]
      })

      const inventoryLevel = allInventoryLevels?.find(level => 
        level.inventory_item_id === inventoryItem.id && 
        level.location_id === scanLog.locationId
      )

      if (!inventoryLevel) {
        return {
          success: false,
          message: `Inventory level not found for item ${scanLog.sku} at location ${scanLog.locationId}`,
          error: "INVENTORY_LEVEL_NOT_FOUND"
        }
      }

      // Restore previous quantity (add back the +1)
      await inventoryService.updateInventoryLevels([
        {
          inventory_item_id: inventoryItem.id,
          location_id: scanLog.locationId,
          stocked_quantity: scanLog.previousQuantity
        }
      ])

      // Remove the log from database
      await scanLogService.deleteLog(logId)

      return {
        success: true,
        message: `Successfully undone scan for SKU: ${scanLog.sku}`,
        product: {
          id: inventoryItem.id,
          title: inventoryItem.title || "Unknown",
          sku: inventoryItem.sku,
          currentQuantity: scanLog.previousQuantity,
          previousQuantity: scanLog.currentQuantity
        }
      }

    } catch (error) {
      console.error('Error undoing scan:', error)
      return {
        success: false,
        message: `Error undoing scan: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: "UNDO_ERROR"
      }
    }
  }
}