import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { 
  IProductModuleService, 
  IInventoryService
} from "@medusajs/types"
import { ModuleRegistrationName, ContainerRegistrationKeys } from "@medusajs/utils"
import ScannerModuleService, { ScanResult } from "../../../modules/scanner/service"
import { SCANNER_MODULE_KEY } from "../../../modules/scanner"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { sku, locationId } = req.body as { sku?: string, locationId?: string }

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

    // Resolve scanner service from container
    const scannerService: ScannerModuleService = req.scope.resolve(SCANNER_MODULE_KEY)

    // Scan the product
    const result = await scannerService.scanProductBySKU(sku, locationId, req.scope)

    if (result.success) {
      res.status(200).json(result)
    } else {
      res.status(404).json(result)
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
      error: "INTERNAL_ERROR"
    })
  }
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    console.log("=== ROUTE GET CALLED ===")
    const { sku, locationId } = req.query
    const skuParam = Array.isArray(sku) ? sku[0] : (sku ? String(sku) : "")
    const locationIdParam = Array.isArray(locationId) ? locationId[0] : (locationId ? String(locationId) : "")

    console.log("SKU:", skuParam)
    console.log("Location ID:", locationIdParam)

    if (!skuParam) {
      res.status(400).json({
        success: false,
        message: "SKU is required as query parameter",
        error: "MISSING_SKU"
      })
      return
    }

    if (!locationIdParam) {
      res.status(400).json({
        success: false,
        message: "Location ID is required as query parameter",
        error: "MISSING_LOCATION_ID"
      })
      return
    }

    // Resolve scanner service from container
    const scannerService: ScannerModuleService = req.scope.resolve(SCANNER_MODULE_KEY)
    console.log("Scanner service resolved:", !!scannerService)

    // Scan the product (this will decrement inventory)
    const result = await scannerService.scanProductBySKU(skuParam as string, locationIdParam as string, req.scope)
    console.log("Result:", result)

    if (result.success) {
      res.status(200).json(result)
    } else {
      res.status(404).json(result)
    }

  } catch (error) {
    console.log("Error in route:", error)
    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
      error: "INTERNAL_ERROR"
    })
  }
} 