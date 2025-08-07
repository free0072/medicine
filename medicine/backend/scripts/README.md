# Data Import Scripts

This directory contains the essential scripts for importing data into the pharmaceutical ecommerce database.

## Import Medicine Data

The `importData.ts` script imports medicine data from `data.js` into the database, creating categories and products.

### Features

- **Automatic Category Creation**: Extracts unique categories from the medicine data and creates them in the database
- **Product Import**: Creates products with all necessary fields including:
  - Basic product information (name, description, price, etc.)
  - Medical-specific fields (dosage form, prescription requirements, etc.)
  - Stock management (quantity, low stock threshold)
  - SEO fields (tags, meta information)
  - Sale and featured status (randomly assigned)

### Smart Field Mapping

The script intelligently maps data fields:

- **Dosage Form**: Determined from `consumeType` field
- **Prescription Required**: Based on category (antibiotics, blood pressure, etc.)
- **Controlled Substances**: Identified by drug name
- **Expiry Date**: Parsed from various date formats
- **SKU**: Auto-generated unique identifier
- **Slug Generation**: Creates URL-friendly slugs for categories and products

### Usage

1. Make sure your MongoDB connection is configured in `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/your-database-name
   ```

2. Run the import script:
   ```bash
   npm run import:data
   ```

   Or directly with ts-node:
   ```bash
   npx ts-node scripts/importData.ts
   ```

### What the Script Does

1. **Connects to MongoDB** using the connection string from `.env`
2. **Clears existing data** (categories and products) - this can be commented out if you want to keep existing data
3. **Extracts unique categories** from the medicine data
4. **Creates categories** in the database with proper slugs
5. **Creates products** and associates them with the appropriate categories
6. **Reports progress** and final statistics

### Output

The script will show:
- Categories found in the data
- Progress as products are created (every 10 products)
- Final summary with counts of categories and products created

### Data Structure

The script expects the medicine data to have these fields:
- `drugName`: Product name
- `manufacturer`: Brand/manufacturer
- `image`: Product image URL
- `description`: Product description
- `consumeType`: How the medicine is consumed
- `expirydate`: Expiry date
- `price`: Product price
- `sideEffects`: Side effects information
- `disclaimer`: Usage disclaimer
- `category`: Product category
- `countInStock`: Stock quantity

### Error Handling

The script includes error handling for:
- Database connection issues
- Missing categories
- Invalid data formats
- Duplicate slugs (automatically handled)
- General import errors

If any errors occur, the script will log them and exit with a non-zero status code.

### Files in this Directory

- `importData.ts` - Main import script (TypeScript)
- `data.js` - Medicine data source
- `README.md` - This documentation file
- `createAdmin.js` - Admin user creation script (if needed) 