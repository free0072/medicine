import mongoose, { Types } from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import models
import Category from '../src/models/Category';
import Product from '../src/models/Product';

// Import the data directly
const { sampleMedicins } = require('./data.js');

interface MedicineData {
  drugName: string;
  manufacturer: string;
  image: string;
  description: string;
  consumeType: string;
  expirydate: string;
  price: number;
  sideEffects: string;
  disclaimer: string;
  category: string;
  countInStock: number;
}

// Function to create slug from name
const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Function to determine dosage form from consumeType
const getDosageForm = (consumeType: string | undefined): 'tablet' | 'capsule' | 'liquid' | 'cream' | 'ointment' | 'injection' | 'inhaler' | 'drops' | 'suppository' | 'patch' | 'other' => {
  if (!consumeType) return 'other';
  
  const type = consumeType.toLowerCase();
  if (type.includes('oral') || type.includes('tablet')) return 'tablet';
  if (type.includes('capsule')) return 'capsule';
  if (type.includes('liquid') || type.includes('juice')) return 'liquid';
  if (type.includes('cream')) return 'cream';
  if (type.includes('ointment')) return 'ointment';
  if (type.includes('injection')) return 'injection';
  if (type.includes('inhaler') || type.includes('inhalation')) return 'inhaler';
  if (type.includes('drops')) return 'drops';
  if (type.includes('suppository')) return 'suppository';
  if (type.includes('patch')) return 'patch';
  if (type.includes('topical')) return 'cream';
  return 'other';
};

// Function to determine if prescription is required based on category
const isPrescriptionRequired = (category: string): boolean => {
  const prescriptionCategories = [
    'antibiotics', 'blood pressure', 'diabetes', 'depression', 'pain killer',
    'anticonvulsants', 'antihistamine', 'corticosteroid', 'antiplatelet',
    'dermatology', 'dental', 'fracture', 'women care'
  ];
  return prescriptionCategories.some(cat => category.toLowerCase().includes(cat));
};

// Function to determine if it's a controlled substance
const isControlledSubstance = (drugName: string, category: string): boolean => {
  const controlledDrugs = [
    'alprazolam', 'clonazepam', 'zolpidem', 'tramadol', 'oxycodone', 
    'hydrocodone', 'trazodone', 'sertraline', 'fluoxetine', 'duloxetine'
  ];
  return controlledDrugs.some(drug => drugName.toLowerCase().includes(drug));
};

// Function to parse expiry date
const parseExpiryDate = (expiryDate: string): Date | undefined => {
  if (!expiryDate || expiryDate === 'N/A') return undefined;
  
  // Handle different date formats
  const date = new Date(expiryDate);
  if (isNaN(date.getTime())) {
    // Try parsing different formats
    const parts = expiryDate.split('-');
    if (parts.length === 3) {
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    }
  }
  return date;
};

// Main import function
const importData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Extract unique categories
    const categories = new Set<string>();
    sampleMedicins.forEach((medicine: MedicineData) => {
      if (medicine.category) {
        categories.add(medicine.category.trim());
      }
    });

    console.log('Found categories:', Array.from(categories));

    // Create categories
    const categoryMap = new Map<string, Types.ObjectId>();
    const usedSlugs = new Set<string>();
    
    for (const categoryName of categories) {
      let slug = categoryName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Handle duplicate slugs
      let counter = 1;
      let originalSlug = slug;
      while (usedSlugs.has(slug)) {
        slug = `${originalSlug}-${counter}`;
        counter++;
      }
      usedSlugs.add(slug);
        
      const category = new Category({
        name: categoryName,
        slug: slug,
        description: `Products in the ${categoryName} category`,
        isActive: true,
        sortOrder: 0
      });
      
      // Save the category
      const savedCategory = await category.save();
      categoryMap.set(categoryName, savedCategory._id as Types.ObjectId);
      console.log(`Created category: ${categoryName} with slug: ${savedCategory.slug}`);
    }

    // Create products
    let productCount = 0;
    const usedProductSlugs = new Set<string>();
    
    for (const medicine of sampleMedicins) {
      const categoryId = categoryMap.get(medicine.category.trim());
      
      if (!categoryId) {
        console.warn(`Category not found for: ${medicine.drugName}`);
        continue;
      }

      // Generate SKU
      const sku = `MED-${medicine.drugName.replace(/\s+/g, '').toUpperCase()}-${Date.now()}`;

      // Generate slug for product
      let productSlug = medicine.drugName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Handle duplicate product slugs
      let counter = 1;
      let originalProductSlug = productSlug;
      while (usedProductSlugs.has(productSlug)) {
        productSlug = `${originalProductSlug}-${counter}`;
        counter++;
      }
      usedProductSlugs.add(productSlug);

      // Create product
      const product = new Product({
        name: medicine.drugName,
        slug: productSlug,
        description: medicine.description,
        shortDescription: medicine.description.substring(0, 100) + '...',
        brand: medicine.manufacturer || 'Generic',
        category: categoryId,
        images: [medicine.image],
        price: medicine.price,
        stockQuantity: medicine.countInStock || 100,
        lowStockThreshold: 10,
        activeIngredient: medicine.drugName,
        dosageForm: getDosageForm(medicine.consumeType),
        prescriptionRequired: isPrescriptionRequired(medicine.category),
        controlledSubstance: isControlledSubstance(medicine.drugName, medicine.category),
        expiryDate: parseExpiryDate(medicine.expirydate),
        sideEffects: medicine.sideEffects ? [medicine.sideEffects] : [],
        tags: [medicine.category.toLowerCase(), medicine.drugName.toLowerCase()],
        isActive: true,
        isFeatured: Math.random() > 0.8, // 20% chance of being featured
        isOnSale: Math.random() > 0.9, // 10% chance of being on sale
        salePercentage: Math.random() > 0.9 ? Math.floor(Math.random() * 30) + 10 : undefined, // 10-40% discount
        requiresColdStorage: medicine.category.toLowerCase().includes('insulin') || medicine.category.toLowerCase().includes('vaccine'),
        fragile: false,
        sku: sku
      });

      await product.save();
      productCount++;
      
      if (productCount % 10 === 0) {
        console.log(`Created ${productCount} products...`);
      }
    }

    console.log(`\nImport completed successfully!`);
    console.log(`Created ${categoryMap.size} categories`);
    console.log(`Created ${productCount} products`);

    // Disconnect from database
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

// Run the import
importData(); 