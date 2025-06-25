import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { 
  IProductModuleService, 
  IInventoryService
} from "@medusajs/types"
import { ModuleRegistrationName, ContainerRegistrationKeys } from "@medusajs/utils"
import ScannerModuleService from "../../../../modules/scanner/service"
import { SCANNER_MODULE_KEY } from "../../../../modules/scanner"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { sku, locationId, previousQuantity, logId } = req.body as { 
      sku?: string, 
      locationId?: string, 
      previousQuantity?: number,
      logId?: string
    }

    if (!sku) {
      res.status(400).json({
        success: false,
        message: "SKU is required",
        error: "MISSING_SKU"
      })
      return
    }

    if (!locationId) {
      res.status(400).json({
        success: false,
        message: "Location ID is required",
        error: "MISSING_LOCATION_ID"
      })
      return
    }

    if (previousQuantity === undefined || previousQuantity === null) {
      res.status(400).json({
        success: false,
        message: "Previous quantity is required",
        error: "MISSING_PREVIOUS_QUANTITY"
      })
      return
    }

    console.log(`=== REVERT SCAN DEBUG ===`)
    console.log(`Reverting SKU: ${sku}`)
    console.log(`Location ID: ${locationId}`)
    console.log(`Restoring to quantity: ${previousQuantity}`)

    // Get required services
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const inventoryService: IInventoryService = req.scope.resolve(ModuleRegistrationName.INVENTORY)
    const scannerService: ScannerModuleService = req.scope.resolve(SCANNER_MODULE_KEY)

    // Get inventory item by SKU
    const { data: allInventoryItems } = await query.graph({
      entity: "inventory_item",
      fields: [
        "id",
        "sku",
        "title",
        "stocked_quantity"
      ]
    })

    // Find the specific inventory item
    const inventoryItems = allInventoryItems?.filter(item => item.sku === sku) || []

    if (!inventoryItems || inventoryItems.length === 0) {
      res.status(404).json({
        success: false,
        message: `No inventory item found with SKU: ${sku}`,
        error: "INVENTORY_ITEM_NOT_FOUND"
      })
      return
    }

    if (inventoryItems.length > 1) {
      res.status(400).json({
        success: false,
        message: `Multiple inventory items found with SKU: ${sku}. This is a data integrity issue.`,
        error: "MULTIPLE_INVENTORY_ITEMS_FOUND"
      })
      return
    }

    const inventoryItem = inventoryItems[0]
    console.log(`Found inventory item: ID=${inventoryItem.id}, SKU=${inventoryItem.sku}, Title=${inventoryItem.title}`)

    // Get current inventory level for this item at the specific location
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

    const inventoryLevels = allInventoryLevels?.filter(level => 
      level.inventory_item_id === inventoryItem.id && 
      level.location_id === locationId
    ) || []

    if (!inventoryLevels || inventoryLevels.length === 0) {
      res.status(404).json({
        success: false,
        message: `Inventory item with SKU ${sku} has no inventory at location: ${locationId}`,
        error: "NO_INVENTORY_AT_LOCATION"
      })
      return
    }

    const inventoryLevel = inventoryLevels[0]
    const currentQuantity = inventoryLevel.stocked_quantity || 0

    console.log(`Current quantity: ${currentQuantity}, Restoring to: ${previousQuantity}`)

    // Update inventory level to the previous quantity
    await inventoryService.updateInventoryLevels([
      {
        inventory_item_id: inventoryItem.id,
        location_id: locationId,
        stocked_quantity: previousQuantity
      }
    ])

    // Mark scan log as reverted if logId is provided
    if (logId) {
      try {
        await scannerService.markScanLogReverted(logId, req.scope)
        console.log(`Marked scan log ${logId} as reverted`)
      } catch (logError) {
        console.log(`Failed to mark scan log as reverted: ${logError.message}`)
      }
    }

    console.log(`=== REVERT COMPLETE ===`)

    res.status(200).json({
      success: true,
      message: `Successfully reverted inventory for ${inventoryItem.title}`,
      product: {
        id: inventoryItem.id,
        title: inventoryItem.title,
        sku: inventoryItem.sku,
        previousQuantity: currentQuantity,
        currentQuantity: previousQuantity
      }
    })

  } catch (error) {
    console.log(`=== REVERT ERROR ===`)
    console.log(`Error: ${error.message}`)
    res.status(500).json({
      success: false,
      message: `Error reverting scan: ${error.message}`,
      error: "REVERT_ERROR"
    })
  }
} 