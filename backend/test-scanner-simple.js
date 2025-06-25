/**
 * Simple test script for the Scanner API
 * This script tests the scanner endpoints using fetch
 * Make sure the backend server is running on localhost:9000
 * Run with: node test-scanner-simple.js
 */

const BASE_URL = "http://localhost:9000";

// Test data
const testNDCCodes = ["1234567890123", "9876543210987", "5556667778889"];

async function testScannerAPI() {
  console.log("🧪 Testing Scanner API...\n");

  // Test 1: Get product information (without modifying inventory)
  console.log("1. Testing GET /store/scanner (product lookup)");
  try {
    const response = await fetch(
      `${BASE_URL}/store/scanner?ndc=${testNDCCodes[0]}`
    );
    if (response.ok) {
      const result = await response.json();
      console.log("✅ Success:", JSON.stringify(result, null, 2));
    } else {
      const error = await response.text();
      console.log("❌ Error:", error);
    }
  } catch (error) {
    console.error("❌ Network Error:", error.message);
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
        ndcCode: testNDCCodes[0],
      }),
    });
    if (response.ok) {
      const result = await response.json();
      console.log("✅ Success:", JSON.stringify(result, null, 2));
    } else {
      const error = await response.text();
      console.log("❌ Error:", error);
    }
  } catch (error) {
    console.error("❌ Network Error:", error.message);
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
        ndcCodes: testNDCCodes,
      }),
    });
    if (response.ok) {
      const result = await response.json();
      console.log("✅ Success:", JSON.stringify(result, null, 2));
    } else {
      const error = await response.text();
      console.log("❌ Error:", error);
    }
  } catch (error) {
    console.error("❌ Network Error:", error.message);
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
    if (response.ok) {
      const result = await response.json();
      console.log("✅ Success:", JSON.stringify(result, null, 2));
    } else {
      const error = await response.text();
      console.log("❌ Error:", error);
    }
  } catch (error) {
    console.error("❌ Network Error:", error.message);
  }
  console.log("");

  console.log("✅ Scanner API tests completed!");
  console.log("\n📝 Note: If you see authentication errors, you may need to:");
  console.log("1. Create a publishable API key in the admin panel");
  console.log("2. Add the key to the request headers: x-publishable-api-key");
  console.log(
    "3. Or configure the scanner endpoints to not require authentication"
  );
}

// Run the tests
testScannerAPI().catch(console.error);
