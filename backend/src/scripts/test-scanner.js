/**
 * Test script for the Scanner API
 *
 * This script demonstrates how to use the scanner endpoints
 * Run with: node src/scripts/test-scanner.js
 */

const BASE_URL = process.env.BACKEND_URL || "http://localhost:9000";

async function testScannerAPI() {
  console.log("🧪 Testing Scanner API...\n");

  // Test 1: Get product information (without modifying inventory)
  console.log("1. Testing GET /store/scanner (product lookup)");
  try {
    const response = await fetch(`${BASE_URL}/store/scanner?ndc=1234567890123`);
    const result = await response.json();
    console.log("Response:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  }
  console.log("");

  // Test 2: Scan product (decrement inventory)
  console.log("2. Testing POST /store/scanner (scan and decrement)");
  try {
    const response = await fetch(`${BASE_URL}/store/scanner`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ndcCode: "1234567890123",
      }),
    });
    const result = await response.json();
    console.log("Response:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  }
  console.log("");

  // Test 3: Bulk scan
  console.log("3. Testing POST /store/scanner/bulk (bulk scan)");
  try {
    const response = await fetch(`${BASE_URL}/store/scanner/bulk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ndcCodes: ["1234567890123", "9876543210987", "5556667778889"],
      }),
    });
    const result = await response.json();
    console.log("Response:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  }
  console.log("");

  // Test 4: Error handling - missing NDC code
  console.log("4. Testing error handling - missing NDC code");
  try {
    const response = await fetch(`${BASE_URL}/store/scanner`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    const result = await response.json();
    console.log("Response:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  }
  console.log("");

  console.log("✅ Scanner API tests completed!");
}

// Run the tests
testScannerAPI().catch(console.error);
