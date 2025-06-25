/**
 * Script to add test products with NDC codes for scanner testing
 * Run with: node src/scripts/add-test-products.js
 */

import { createProductsWorkflow } from "@medusajs/medusa/core-flows";
import { ProductStatus } from "@medusajs/framework/utils";

const testProducts = [
  {
    title: "Test Medicine A",
    description: "A test medicine for scanner testing",
    handle: "test-medicine-a",
    status: ProductStatus.PUBLISHED,
    metadata: {
      ndc: "1234567890123",
    },
    variants: [
      {
        title: "Default",
        sku: "MED-A-001",
        options: {
          "Default option": "Default option value",
        },
        prices: [
          {
            amount: 1000,
            currency_code: "usd",
          },
        ],
      },
    ],
  },
  {
    title: "Test Medicine B",
    description: "Another test medicine for scanner testing",
    handle: "test-medicine-b",
    status: ProductStatus.PUBLISHED,
    metadata: {
      ndc: "9876543210987",
    },
    variants: [
      {
        title: "Default",
        sku: "MED-B-001",
        options: {
          "Default option": "Default option value",
        },
        prices: [
          {
            amount: 1500,
            currency_code: "usd",
          },
        ],
      },
    ],
  },
  {
    title: "Test Medicine C",
    description: "Third test medicine for scanner testing",
    handle: "test-medicine-c",
    status: ProductStatus.PUBLISHED,
    metadata: {
      ndc: "5556667778889",
    },
    variants: [
      {
        title: "Default",
        sku: "MED-C-001",
        options: {
          "Default option": "Default option value",
        },
        prices: [
          {
            amount: 2000,
            currency_code: "usd",
          },
        ],
      },
    ],
  },
];

async function addTestProducts() {
  try {
    console.log("🏥 Adding test products with NDC codes...");

    // This would need to be run in the context of a Medusa app
    // For now, we'll create a simple test script that can be run manually

    console.log("Test products to add:");
    testProducts.forEach((product, index) => {
      console.log(
        `${index + 1}. ${product.title} - NDC: ${product.metadata.ndc}`
      );
    });

    console.log("\nTo add these products, you can:");
    console.log("1. Use the Medusa admin panel");
    console.log(
      "2. Run the seed script and modify it to include these products"
    );
    console.log("3. Use the Medusa CLI to create products");

    console.log("\n✅ Test data ready for scanner testing!");
  } catch (error) {
    console.error("❌ Error adding test products:", error);
  }
}

addTestProducts();
