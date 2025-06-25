/**
 * Internal test script for the Scanner API
 * This script tests the scanner functionality directly within the Medusa context
 * Run with: medusa exec ./src/scripts/test-scanner-internal.js
 */

module.exports = async function testScannerInternal({ container }) {
  console.log("🧪 Testing Scanner Module Internally...\n");

  try {
    // Resolve the scanner service
    const scannerService = container.resolve("scannerModuleService");
    console.log("✅ Scanner service resolved successfully");

    // Test 1: Get product information (without modifying inventory)
    console.log("\n1. Testing getProductByNDC (product lookup)");
    try {
      const result = await scannerService.getProductByNDC(
        "1234567890123",
        container
      );
      console.log("Response:", JSON.stringify(result, null, 2));
    } catch (error) {
      console.error("Error:", error.message);
    }

    // Test 2: Scan product (decrement inventory)
    console.log("\n2. Testing scanProductByNDC (scan and decrement)");
    try {
      const result = await scannerService.scanProductByNDC(
        "1234567890123",
        container
      );
      console.log("Response:", JSON.stringify(result, null, 2));
    } catch (error) {
      console.error("Error:", error.message);
    }

    // Test 3: Bulk scan
    console.log("\n3. Testing bulkScan (bulk scan)");
    try {
      const result = await scannerService.bulkScan(
        ["1234567890123", "9876543210987", "5556667778889"],
        container
      );
      console.log("Response:", JSON.stringify(result, null, 2));
    } catch (error) {
      console.error("Error:", error.message);
    }

    // Test 4: Error handling - missing NDC code
    console.log("\n4. Testing error handling - invalid NDC code");
    try {
      const result = await scannerService.getProductByNDC(
        "INVALID-NDC-CODE",
        container
      );
      console.log("Response:", JSON.stringify(result, null, 2));
    } catch (error) {
      console.error("Error:", error.message);
    }

    console.log("\n✅ Internal scanner tests completed!");
  } catch (error) {
    console.error("❌ Error testing scanner:", error);
  }
};
