import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { SCANNER_MODULE_KEY } from "../../../../modules/scanner"
import ScannerModuleService from "../../../../modules/scanner/service"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { skus } = req.body as { skus?: string[] }

    if (!skus || !Array.isArray(skus) || skus.length === 0) {
      res.status(400).json({
        success: false,
        message: "SKUs array is required",
        error: "MISSING_SKUS"
      })
      return
    }

    // Resolve scanner service from container
    const scannerService: ScannerModuleService = req.scope.resolve(SCANNER_MODULE_KEY)

    // Bulk scan the products
    const results = await scannerService.bulkScan(skus, "sloc_01JXDNTH9DZ0RG8X40884Z9AKT", req.scope)

    res.status(200).json({
      success: true,
      message: `Processed ${skus.length} SKUs`,
      results
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
      error: "INTERNAL_ERROR"
    })
  }
} 