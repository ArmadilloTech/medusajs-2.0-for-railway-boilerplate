# Scanner Module

This module provides API endpoints for scanning products by NDC (National Drug Code) and automatically decrementing their inventory quantities. It's designed for use with barcode scanners in pharmacy or medical supply environments.

## Features

- **Single Product Scan**: Scan one product by NDC code and decrement inventory by 1
- **Product Lookup**: Get product information by NDC code without modifying inventory
- **Bulk Scanning**: Process multiple NDC codes at once
- **Inventory Management**: Automatic inventory decrementation with validation

## API Endpoints

### 1. Scan Product (Decrement Inventory)

**POST** `/store/scanner`

Scans a product by NDC code and decrements its inventory by 1.

**Request Body:**
```json
{
  "ndcCode": "1234567890123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully scanned and decremented inventory for Product Name",
  "product": {
    "id": "prod_123",
    "title": "Product Name",
    "sku": "PROD-001",
    "ndc": "1234567890123",
    "currentQuantity": 99,
    "previousQuantity": 100
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "No product found with NDC code: 1234567890123",
  "error": "PRODUCT_NOT_FOUND"
}
```

### 2. Get Product Information

**GET** `/store/scanner?ndc=1234567890123`

Gets product information by NDC code without modifying inventory.

**Response:**
```json
{
  "success": true,
  "message": "Product found: Product Name",
  "product": {
    "id": "prod_123",
    "title": "Product Name",
    "sku": "PROD-001",
    "ndc": "1234567890123",
    "currentQuantity": 100,
    "previousQuantity": 100
  }
}
```

### 3. Bulk Scan

**POST** `/store/scanner/bulk`

Processes multiple NDC codes at once.

**Request Body:**
```json
{
  "ndcCodes": ["1234567890123", "9876543210987", "5556667778889"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Processed 3 NDC codes",
  "results": [
    {
      "success": true,
      "message": "Successfully scanned and decremented inventory for Product 1",
      "product": {
        "id": "prod_123",
        "title": "Product 1",
        "sku": "PROD-001",
        "ndc": "1234567890123",
        "currentQuantity": 99,
        "previousQuantity": 100
      }
    },
    {
      "success": false,
      "message": "No product found with NDC code: 9876543210987",
      "error": "PRODUCT_NOT_FOUND"
    },
    {
      "success": true,
      "message": "Successfully scanned and decremented inventory for Product 3",
      "product": {
        "id": "prod_456",
        "title": "Product 3",
        "sku": "PROD-003",
        "ndc": "5556667778889",
        "currentQuantity": 49,
        "previousQuantity": 50
      }
    }
  ]
}
```

## Error Codes

- `MISSING_NDC_CODE`: NDC code is required but not provided
- `MISSING_NDC_CODES`: NDC codes array is required but not provided
- `PRODUCT_NOT_FOUND`: No product found with the given NDC code
- `NO_VARIANTS`: Product found but has no variants
- `NO_INVENTORY_ITEMS`: Product variant has no inventory items
- `OUT_OF_STOCK`: Product is out of stock (quantity is 0)
- `PROCESSING_ERROR`: Error occurred while processing the scan
- `RETRIEVAL_ERROR`: Error occurred while retrieving product information
- `INTERNAL_ERROR`: Internal server error

## Setup

### 1. Product Configuration

To use this scanner, products must have NDC codes stored in their metadata. You can add NDC codes to products through the admin panel or by updating product metadata programmatically.

Example product metadata:
```json
{
  "ndc": "1234567890123"
}
```

### 2. Inventory Management

Products must have:
- At least one variant
- Inventory items associated with variants
- Inventory levels with stocked quantities

### 3. Usage Examples

#### Using a Barcode Scanner

Most barcode scanners work as keyboard input devices. When a barcode is scanned, it sends the NDC code followed by a newline character. You can integrate this with a simple web application:

```javascript
// Example frontend integration
const scanProduct = async (ndcCode) => {
  try {
    const response = await fetch('/store/scanner', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ndcCode })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log(`Scanned: ${result.product.title} - Quantity: ${result.product.currentQuantity}`);
    } else {
      console.error(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error('Scan failed:', error);
  }
};

// Listen for barcode scanner input
document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const ndcCode = getCurrentInputValue(); // Get the scanned NDC code
    scanProduct(ndcCode);
  }
});
```

#### Mobile App Integration

For mobile applications, you can use the camera to scan barcodes and then call the API:

```javascript
// Example mobile app integration
const scanWithCamera = async () => {
  // Use a barcode scanning library to get NDC code
  const ndcCode = await scanBarcode();
  
  const response = await fetch('/store/scanner', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ndcCode })
  });
  
  return await response.json();
};
```

## Security Considerations

- The scanner endpoints are available on the store API, which means they're publicly accessible
- Consider implementing authentication/authorization if needed
- Validate NDC codes format before processing
- Log all scanning activities for audit purposes

## Troubleshooting

### Product Not Found
- Ensure the product has the correct NDC code in its metadata
- Check that the NDC code format matches exactly
- Verify the product is published and available

### Inventory Issues
- Ensure the product has inventory items and levels configured
- Check that the stock location is properly set up
- Verify inventory quantities are greater than 0

### API Errors
- Check the server logs for detailed error messages
- Verify all required services are running
- Ensure the database connection is working properly 