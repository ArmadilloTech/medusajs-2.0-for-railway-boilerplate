import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { SCANNER_MODULE_KEY } from "../../../../modules/scanner"
import ScannerModuleService from "../../../../modules/scanner/service"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { ndcCodes } = req.body as { ndcCodes?: string[] }

    if (!ndcCodes || !Array.isArray(ndcCodes) || ndcCodes.length === 0) {
      res.status(400).json({
        success: false,
        message: "NDC codes array is required",
        error: "MISSING_NDC_CODES"
      })
      return
    }

    // Resolve scanner service from container
    const scannerService: ScannerModuleService = req.scope.resolve(SCANNER_MODULE_KEY)

    // Bulk scan the products
    const results = await scannerService.bulkScan(ndcCodes, "sloc_01JXDNTH9DZ0RG8X40884Z9AKT", req.scope)

    res.status(200).json({
      success: true,
      message: `Processed ${ndcCodes.length} NDC codes`,
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