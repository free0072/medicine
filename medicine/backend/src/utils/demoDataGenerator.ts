import { faker } from '@faker-js/faker';
import User from '../models/User';
import Category from '../models/Category';
import Product from '../models/Product';
import Order from '../models/Order';
import Review from '../models/Review';
import mongoose from 'mongoose';

// Medical/pharmaceutical specific data
const MEDICAL_CONDITIONS = [
  'Diabetes', 'Hypertension', 'Asthma', 'Arthritis', 'Depression', 'Anxiety',
  'High Cholesterol', 'Migraine', 'Insomnia', 'Allergies', 'Heart Disease',
  'Osteoporosis', 'Thyroid Disorder', 'Epilepsy', 'Psoriasis'
];

const ALLERGIES = [
  'Penicillin', 'Sulfa drugs', 'Aspirin', 'Ibuprofen', 'Codeine', 'Morphine',
  'Latex', 'Peanuts', 'Shellfish', 'Eggs', 'Milk', 'Wheat', 'Soy'
];

const MEDICATION_CATEGORIES = [
  'Pain Relief', 'Antibiotics', 'Diabetes Management', 'Cardiovascular',
  'Respiratory', 'Mental Health', 'Digestive Health', 'Skin Care',
  'Vitamins & Supplements', 'First Aid', 'Women\'s Health', 'Men\'s Health',
  'Children\'s Health', 'Elderly Care', 'Emergency Medicine'
];

const MEDICATION_SUBCATEGORIES = {
  'Pain Relief': ['Headache', 'Muscle Pain', 'Joint Pain', 'Fever', 'Migraine'],
  'Antibiotics': ['Bacterial Infections', 'Skin Infections', 'Respiratory Infections'],
  'Diabetes Management': ['Insulin', 'Oral Medications', 'Blood Sugar Monitoring'],
  'Cardiovascular': ['Blood Pressure', 'Cholesterol', 'Heart Disease', 'Blood Thinners'],
  'Respiratory': ['Asthma', 'Allergies', 'Cough & Cold', 'Bronchodilators'],
  'Mental Health': ['Antidepressants', 'Anti-anxiety', 'Sleep Aids', 'Mood Stabilizers'],
  'Digestive Health': ['Acid Reflux', 'Constipation', 'Diarrhea', 'Nausea'],
  'Skin Care': ['Acne', 'Eczema', 'Psoriasis', 'Antifungal', 'Wound Care'],
  'Vitamins & Supplements': ['Multivitamins', 'Minerals', 'Herbal Supplements', 'Protein'],
  'First Aid': ['Bandages', 'Antiseptics', 'Pain Relief', 'Emergency Kits'],
  'Women\'s Health': ['Birth Control', 'Fertility', 'Menopause', 'Pregnancy'],
  'Men\'s Health': ['Prostate Health', 'Erectile Dysfunction', 'Hair Loss'],
  'Children\'s Health': ['Fever & Pain', 'Cough & Cold', 'Vitamins', 'First Aid'],
  'Elderly Care': ['Joint Health', 'Memory Support', 'Bone Health', 'Heart Health'],
  'Emergency Medicine': ['Epinephrine', 'Nitroglycerin', 'Glucagon', 'Emergency Kits']
};

const MEDICATION_BRANDS = [
  'Pfizer', 'Johnson & Johnson', 'Novartis', 'Roche', 'Merck', 'GlaxoSmithKline',
  'Sanofi', 'AstraZeneca', 'Bayer', 'Eli Lilly', 'Abbott', 'Bristol-Myers Squibb',
  'Amgen', 'Gilead Sciences', 'Biogen', 'Regeneron', 'Moderna', 'BioNTech'
];

const MEDICATION_NAMES = [
  // Pain Relief
  'Acetaminophen', 'Ibuprofen', 'Naproxen', 'Aspirin', 'Tramadol', 'Codeine',
  // Antibiotics
  'Amoxicillin', 'Azithromycin', 'Ciprofloxacin', 'Doxycycline', 'Penicillin',
  // Diabetes
  'Metformin', 'Insulin Glargine', 'Insulin Lispro', 'Glipizide', 'Sitagliptin',
  // Cardiovascular
  'Lisinopril', 'Amlodipine', 'Atorvastatin', 'Metoprolol', 'Losartan',
  // Respiratory
  'Albuterol', 'Fluticasone', 'Montelukast', 'Ipratropium', 'Theophylline',
  // Mental Health
  'Sertraline', 'Fluoxetine', 'Escitalopram', 'Bupropion', 'Trazodone',
  // Digestive
  'Omeprazole', 'Ranitidine', 'Lansoprazole', 'Pantoprazole', 'Famotidine',
  // Skin
  'Hydrocortisone', 'Clotrimazole', 'Mupirocin', 'Benzoyl Peroxide', 'Tretinoin'
];

const DOSAGE_FORMS = ['tablet', 'capsule', 'liquid', 'cream', 'ointment', 'injection', 'inhaler', 'drops', 'suppository', 'patch'];

const STRENGTHS = ['5mg', '10mg', '20mg', '25mg', '50mg', '100mg', '200mg', '250mg', '500mg', '1000mg'];

const STORAGE_CONDITIONS = [
  'Store at room temperature (20-25°C)',
  'Store in refrigerator (2-8°C)',
  'Store in freezer (-20°C)',
  'Keep away from heat and light',
  'Store in a dry place'
];

const SIDE_EFFECTS = [
  'Nausea', 'Dizziness', 'Headache', 'Drowsiness', 'Diarrhea', 'Constipation',
  'Rash', 'Itching', 'Stomach upset', 'Dry mouth', 'Insomnia', 'Anxiety',
  'Increased heart rate', 'Decreased appetite', 'Weight gain', 'Weight loss'
];

const CONTRAINDICATIONS = [
  'Pregnancy', 'Breastfeeding', 'Liver disease', 'Kidney disease', 'Heart disease',
  'Allergy to medication', 'Under 18 years old', 'Over 65 years old'
];

const DRUG_INTERACTIONS = [
  'Blood thinners', 'Antidepressants', 'Blood pressure medications',
  'Diabetes medications', 'Pain medications', 'Antibiotics'
];

export class DemoDataGenerator {
  private generatedCategories: mongoose.Types.ObjectId[] = [];
  private generatedUsers: mongoose.Types.ObjectId[] = [];
  private generatedProducts: mongoose.Types.ObjectId[] = [];

  async generateUsers(quantity: number): Promise<void> {
    console.log(`Generating ${quantity} users...`);
    
    for (let i = 0; i < quantity; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      
      const user = new User({
        firstName,
        lastName,
        email: faker.internet.email({ firstName, lastName }),
        password: 'password123', // Will be hashed by the model
        phone: faker.phone.number('(###) ###-####'),
        address: {
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          zipCode: faker.location.zipCode(),
          country: 'United States'
        },
        dateOfBirth: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }),
        medicalConditions: faker.helpers.arrayElements(MEDICAL_CONDITIONS, { min: 0, max: 3 }),
        allergies: faker.helpers.arrayElements(ALLERGIES, { min: 0, max: 2 }),
        prescriptions: faker.helpers.arrayElements(
          MEDICATION_NAMES.slice(0, 10).map(med => ({
            medication: med,
            dosage: faker.helpers.arrayElement(STRENGTHS),
            frequency: faker.helpers.arrayElement(['Once daily', 'Twice daily', 'Three times daily', 'As needed']),
            startDate: faker.date.past(),
            endDate: faker.date.future()
          })), 
          { min: 0, max: 2 }
        ),
        isVerified: faker.datatype.boolean(0.8), // 80% verified
        avatar: faker.image.avatar()
      });

      const savedUser = await user.save();
      this.generatedUsers.push(savedUser._id);
    }
    
    console.log(`Generated ${quantity} users successfully`);
  }

  async generateCategories(quantity: number): Promise<void> {
    console.log(`Generating ${quantity} categories...`);
    
    // Generate main categories
    const mainCategories = faker.helpers.arrayElements(MEDICATION_CATEGORIES, Math.min(quantity, MEDICATION_CATEGORIES.length));
    
    for (const categoryName of mainCategories) {
      // Generate a unique slug
      const baseSlug = categoryName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Check if slug already exists and make it unique
      let slug = baseSlug;
      let counter = 1;
      while (await Category.findOne({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      const category = new Category({
        name: categoryName,
        slug: slug,
        description: faker.lorem.sentence(),
        image: faker.image.urlLoremFlickr({ category: 'medical' }),
        isActive: true,
        sortOrder: faker.number.int({ min: 1, max: 100 }),
        metaTitle: `${categoryName} - Medical Supplies`,
        metaDescription: faker.lorem.sentence(),
        icon: faker.helpers.arrayElement(['💊', '🩺', '🏥', '💉', '🩹', '🌡️', '💊', '🔬'])
      });

      const savedCategory = await category.save();
      this.generatedCategories.push(savedCategory._id);

      // Generate subcategories for this category
      const subcategoryNames = MEDICATION_SUBCATEGORIES[categoryName as keyof typeof MEDICATION_SUBCATEGORIES] || [];
      const subcategoriesToGenerate = faker.helpers.arrayElements(subcategoryNames, { min: 1, max: Math.min(3, subcategoryNames.length) });
      
      for (const subcategoryName of subcategoriesToGenerate) {
        // Generate a unique slug for subcategory
        const subBaseSlug = subcategoryName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        
        let subSlug = subBaseSlug;
        let subCounter = 1;
        while (await Category.findOne({ slug: subSlug })) {
          subSlug = `${subBaseSlug}-${subCounter}`;
          subCounter++;
        }

        const subcategory = new Category({
          name: subcategoryName,
          slug: subSlug,
          description: faker.lorem.sentence(),
          image: faker.image.urlLoremFlickr({ category: 'medical' }),
          parent: savedCategory._id,
          isActive: true,
          sortOrder: faker.number.int({ min: 1, max: 50 }),
          metaTitle: `${subcategoryName} - ${categoryName}`,
          metaDescription: faker.lorem.sentence(),
          icon: faker.helpers.arrayElement(['💊', '🩺', '🏥', '💉', '🩹', '🌡️', '💊', '🔬'])
        });

        const savedSubcategory = await subcategory.save();
        this.generatedCategories.push(savedSubcategory._id);
      }
    }
    
    console.log(`Generated ${this.generatedCategories.length} categories successfully`);
  }

  async generateProducts(quantity: number): Promise<void> {
    console.log(`Generating ${quantity} products...`);
    
    // If no categories are tracked locally, fetch them from database
    if (this.generatedCategories.length === 0) {
      console.log('No categories tracked locally, fetching from database...');
      const existingCategories = await Category.find({});
      if (existingCategories.length === 0) {
        throw new Error('No categories found in database. Please generate categories first.');
      }
      this.generatedCategories = existingCategories.map(cat => cat._id);
      console.log(`Found ${this.generatedCategories.length} existing categories`);
    }

    for (let i = 0; i < quantity; i++) {
      const medicationName = faker.helpers.arrayElement(MEDICATION_NAMES);
      const brand = faker.helpers.arrayElement(MEDICATION_BRANDS);
      const strength = faker.helpers.arrayElement(STRENGTHS);
      const dosageForm = faker.helpers.arrayElement(DOSAGE_FORMS);
      
      const productName = `${medicationName} ${strength}`;
      const isPrescriptionRequired = faker.datatype.boolean(0.6); // 60% require prescription
      const isControlledSubstance = faker.datatype.boolean(0.1); // 10% are controlled substances
      
      // Generate a unique slug for the product
      const baseSlug = productName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      let slug = baseSlug;
      let counter = 1;
      while (await Product.findOne({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      const basePrice = faker.number.float({ min: 5, max: 200, fractionDigits: 2 });
      const comparePrice = faker.datatype.boolean(0.3) ? basePrice * faker.number.float({ min: 1.1, max: 1.5, fractionDigits: 2 }) : undefined;
      
      // Ensure we have valid category IDs
      const categoryId = faker.helpers.arrayElement(this.generatedCategories);
      const subcategoryId = faker.datatype.boolean(0.7) ? faker.helpers.arrayElement(this.generatedCategories) : undefined;
      
      const product = new Product({
        name: productName,
        slug: slug,
        description: faker.lorem.paragraphs(2),
        shortDescription: faker.lorem.sentence(),
        brand,
        category: categoryId,
        subcategory: subcategoryId,
        images: [
          faker.image.urlLoremFlickr({ category: 'medical', width: 400, height: 400 }),
          faker.image.urlLoremFlickr({ category: 'medical', width: 400, height: 400 }),
          faker.image.urlLoremFlickr({ category: 'medical', width: 400, height: 400 })
        ],
        price: basePrice,
        comparePrice,
        costPrice: basePrice * faker.number.float({ min: 0.3, max: 0.7, fractionDigits: 2 }),
        sku: faker.string.alphanumeric(8).toUpperCase(),
        barcode: faker.string.numeric(12),
        stockQuantity: faker.number.int({ min: 0, max: 500 }),
        lowStockThreshold: faker.number.int({ min: 5, max: 20 }),
        weight: faker.number.float({ min: 0.1, max: 2, fractionDigits: 2 }),
        dimensions: {
          length: faker.number.float({ min: 2, max: 10, fractionDigits: 1 }),
          width: faker.number.float({ min: 2, max: 10, fractionDigits: 1 }),
          height: faker.number.float({ min: 0.5, max: 3, fractionDigits: 1 })
        },
        // Medical specific fields
        activeIngredient: medicationName,
        strength,
        dosageForm,
        prescriptionRequired: isPrescriptionRequired,
        controlledSubstance: isControlledSubstance,
        expiryDate: faker.date.future({ years: 3 }),
        storageConditions: faker.helpers.arrayElement(STORAGE_CONDITIONS),
        sideEffects: faker.helpers.arrayElements(SIDE_EFFECTS, { min: 2, max: 6 }),
        contraindications: faker.helpers.arrayElements(CONTRAINDICATIONS, { min: 1, max: 4 }),
        drugInteractions: faker.helpers.arrayElements(DRUG_INTERACTIONS, { min: 1, max: 3 }),
        pregnancyCategory: faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'X', 'N/A']),
        // Product status
        isActive: faker.datatype.boolean(0.9), // 90% active
        isFeatured: faker.datatype.boolean(0.2), // 20% featured
        isOnSale: faker.datatype.boolean(0.15), // 15% on sale
        salePercentage: faker.datatype.boolean(0.15) ? faker.number.int({ min: 10, max: 50 }) : undefined,
        // SEO
        metaTitle: `${productName} - ${brand}`,
        metaDescription: faker.lorem.sentence(),
        // Tags
        tags: faker.helpers.arrayElements(['pain relief', 'fever', 'inflammation', 'headache', 'muscle pain'], { min: 1, max: 3 }),
        // Shipping
        requiresColdStorage: faker.datatype.boolean(0.1), // 10% require cold storage
        fragile: faker.datatype.boolean(0.05) // 5% are fragile
      });

      const savedProduct = await product.save();
      this.generatedProducts.push(savedProduct._id);
    }
    
    console.log(`Generated ${quantity} products successfully`);
  }

  async generateOrders(quantity: number): Promise<void> {
    console.log(`Generating ${quantity} orders...`);
    
    // If no users are tracked locally, fetch them from database
    if (this.generatedUsers.length === 0) {
      console.log('No users tracked locally, fetching from database...');
      const existingUsers = await User.find({ role: 'user' });
      if (existingUsers.length === 0) {
        throw new Error('No users found in database. Please generate users first.');
      }
      this.generatedUsers = existingUsers.map(user => user._id);
      console.log(`Found ${this.generatedUsers.length} existing users`);
    }

    // If no products are tracked locally, fetch them from database
    if (this.generatedProducts.length === 0) {
      console.log('No products tracked locally, fetching from database...');
      const existingProducts = await Product.find({});
      if (existingProducts.length === 0) {
        throw new Error('No products found in database. Please generate products first.');
      }
      this.generatedProducts = existingProducts.map(prod => prod._id);
      console.log(`Found ${this.generatedProducts.length} existing products`);
    }

    const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const paymentMethods = ['credit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'];
    const paymentStatuses = ['pending', 'paid', 'failed'];

    for (let i = 0; i < quantity; i++) {
      const user = faker.helpers.arrayElement(this.generatedUsers);
      const numItems = faker.number.int({ min: 1, max: 5 });
      const items = [];
      let subtotal = 0;

      // Generate order items
      for (let j = 0; j < numItems; j++) {
        const product = faker.helpers.arrayElement(this.generatedProducts);
        const quantity = faker.number.int({ min: 1, max: 3 });
        
        // Get product details
        const productDoc = await Product.findById(product);
        if (!productDoc) continue;
        
        const price = productDoc.price;
        const total = price * quantity;
        subtotal += total;

        items.push({
          product: product,
          quantity,
          price,
          total
        });
      }

      const tax = subtotal * 0.08; // 8% tax
      const shipping = faker.number.float({ min: 5, max: 15, fractionDigits: 2 });
      const total = subtotal + tax + shipping;

      const order = new Order({
        user,
        items,
        subtotal,
        tax,
        shipping,
        total,
        status: faker.helpers.arrayElement(orderStatuses),
        paymentStatus: faker.helpers.arrayElement(paymentStatuses),
        paymentMethod: faker.helpers.arrayElement(paymentMethods),
        shippingAddress: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          zipCode: faker.location.zipCode(),
          country: 'United States',
          phone: faker.phone.number('(###) ###-####')
        },
        billingAddress: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          zipCode: faker.location.zipCode(),
          country: 'United States'
        },
        notes: faker.datatype.boolean(0.3) ? faker.lorem.sentence() : undefined,
        prescriptionRequired: faker.datatype.boolean(0.3), // 30% require prescription
        prescriptionImage: faker.datatype.boolean(0.3) ? faker.image.urlLoremFlickr({ category: 'medical' }) : undefined,
        prescriptionApproved: faker.datatype.boolean(0.7) // 70% approved
      });

      await order.save();
    }
    
    console.log(`Generated ${quantity} orders successfully`);
  }

  async generateReviews(quantity: number): Promise<void> {
    console.log(`Generating ${quantity} reviews...`);
    
    // If no users are tracked locally, fetch them from database
    if (this.generatedUsers.length === 0) {
      console.log('No users tracked locally, fetching from database...');
      const existingUsers = await User.find({ role: 'user' });
      if (existingUsers.length === 0) {
        throw new Error('No users found in database. Please generate users first.');
      }
      this.generatedUsers = existingUsers.map(user => user._id);
      console.log(`Found ${this.generatedUsers.length} existing users`);
    }

    // If no products are tracked locally, fetch them from database
    if (this.generatedProducts.length === 0) {
      console.log('No products tracked locally, fetching from database...');
      const existingProducts = await Product.find({});
      if (existingProducts.length === 0) {
        throw new Error('No products found in database. Please generate products first.');
      }
      this.generatedProducts = existingProducts.map(prod => prod._id);
      console.log(`Found ${this.generatedProducts.length} existing products`);
    }

    const reviewTitles = [
      'Great medication', 'Effective treatment', 'Works as expected', 'Highly recommended',
      'Good quality', 'Fast relief', 'Easy to use', 'Worth the price', 'Reliable product',
      'Excellent results', 'Satisfied customer', 'Good value', 'Quick delivery',
      'Professional service', 'Quality product'
    ];

    const reviewComments = [
      'This medication has been very effective for my condition.',
      'I\'ve been using this for a while and it works great.',
      'Fast acting and reliable medication.',
      'Good quality product, would recommend.',
      'Helps with my symptoms effectively.',
      'Easy to take and no side effects.',
      'Great value for the money.',
      'Professional packaging and delivery.',
      'Works exactly as described.',
      'Very satisfied with this product.',
      'Good customer service and fast shipping.',
      'Quality medication at a reasonable price.',
      'Helped me manage my condition better.',
      'Reliable and consistent results.',
      'Excellent product, highly recommend.'
    ];

    for (let i = 0; i < quantity; i++) {
      const user = faker.helpers.arrayElement(this.generatedUsers);
      const product = faker.helpers.arrayElement(this.generatedProducts);
      const rating = faker.number.int({ min: 1, max: 5 });
      
      const review = new Review({
        user,
        product,
        rating,
        title: faker.helpers.arrayElement(reviewTitles),
        comment: faker.helpers.arrayElement(reviewComments),
        isVerified: faker.datatype.boolean(0.8) // 80% verified
      });

      try {
        await review.save();
      } catch (error) {
        // Skip if user already reviewed this product (unique constraint)
        console.log('Skipping duplicate review');
      }
    }
    
    console.log(`Generated ${quantity} reviews successfully`);
  }

  async generateAll(quantities: {
    users: number;
    categories: number;
    products: number;
    orders: number;
    reviews: number;
  }): Promise<void> {
    console.log('Starting demo data generation...');
    
    try {
      // Generate in order of dependencies
      await this.generateCategories(quantities.categories);
      await this.generateUsers(quantities.users);
      await this.generateProducts(quantities.products);
      await this.generateOrders(quantities.orders);
      await this.generateReviews(quantities.reviews);
      
      console.log('Demo data generation completed successfully!');
    } catch (error) {
      console.error('Error generating demo data:', error);
      throw error;
    }
  }

  async clearAllData(): Promise<void> {
    console.log('Clearing all demo data...');
    
    try {
      await Review.deleteMany({});
      await Order.deleteMany({});
      await Product.deleteMany({});
      await Category.deleteMany({});
      await User.deleteMany({ role: 'user' }); // Keep admin users
      
      // Reset arrays
      this.generatedCategories = [];
      this.generatedUsers = [];
      this.generatedProducts = [];
      
      console.log('All demo data cleared successfully!');
    } catch (error) {
      console.error('Error clearing demo data:', error);
      throw error;
    }
  }
}

export default DemoDataGenerator; 