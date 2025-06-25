import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import ScannerModuleService from "../../../../modules/scanner/service"
import { SCANNER_MODULE_KEY } from "../../../../modules/scanner"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { logId } = req.body as { logId?: string }

    if (!logId) {
      res.status(400).json({
        success: false,
        message: "Log ID is required",
        error: "MISSING_LOG_ID"
      })
      return
    }

    console.log(`=== UNDO SCAN DEBUG ===`)
    console.log(`Undoing scan log: ${logId}`)

    // Resolve scanner service from container
    const scannerService: ScannerModuleService = req.scope.resolve(SCANNER_MODULE_KEY)

    // Undo the scan
    const result = await scannerService.undoScan(logId, req.scope)

    if (result.success) {
      res.status(200).json(result)
    } else {
      res.status(404).json(result)
    }

  } catch (error) {
    console.error('Error in undo route:', error)
    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
      error: "INTERNAL_ERROR"
    })
  }
} 