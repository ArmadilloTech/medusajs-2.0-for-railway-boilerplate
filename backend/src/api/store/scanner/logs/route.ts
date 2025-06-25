import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import ScannerModuleService from "../../../../modules/scanner/service"
import { SCANNER_MODULE_KEY } from "../../../../modules/scanner"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { limit = "100" } = req.query
    const limitNum = parseInt(limit as string, 10) || 100

    // Get scan logs from database
    const scannerService: ScannerModuleService = req.scope.resolve(SCANNER_MODULE_KEY)
    const logs = await scannerService.getScanLogs(limitNum, req.scope)

    res.status(200).json({
      success: true,
      logs: logs
    })

  } catch (error) {
    console.log("Error getting scan logs:", error)
    res.status(500).json({
      success: false,
      message: `Error retrieving scan logs: ${error.message}`,
      error: "RETRIEVAL_ERROR"
    })
  }
}

export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    // Clear all scan logs from database
    const scannerService: ScannerModuleService = req.scope.resolve(SCANNER_MODULE_KEY)
    await scannerService.clearScanLogs(req.scope)

    res.status(200).json({
      success: true,
      message: "All scan logs cleared successfully"
    })

  } catch (error) {
    console.log("Error clearing scan logs:", error)
    res.status(500).json({
      success: false,
      message: `Error clearing scan logs: ${error.message}`,
      error: "CLEAR_ERROR"
    })
  }
} 