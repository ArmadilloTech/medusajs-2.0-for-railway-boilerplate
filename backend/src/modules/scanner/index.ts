import ScannerModuleService from "./service"
import { Module } from "@medusajs/utils"

export const SCANNER_MODULE_KEY = "scannerModuleService"

export default Module(SCANNER_MODULE_KEY, {
  service: ScannerModuleService,
}) 