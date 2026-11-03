import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import Inventory from '../models/Inventory.js';
import Pizza from '../models/Pizza.js';

export const seedDatabase = async () => {
  try {
    console.log('🌱 [Seeder] Starting database seeding...');

    // 1. Seed Users (Admin & Demo User)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@pizzacraft.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: process.env.ADMIN_NAME || 'Head Chef & Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        isVerified: true,
        phone: '+91 98765 43210',
        address: 'PizzaCraft HQ, Kitchen Unit 4, Bangalore',
      });
      console.log(`👤 [Seeder] Created Admin user: ${adminEmail}`);
    } else {
      console.log(`ℹ️ [Seeder] Admin user already exists: ${adminEmail}`);
    }

    const demoUserEmail = 'customer@pizzacraft.com';
    const existingDemoUser = await User.findOne({ email: demoUserEmail });
    if (!existingDemoUser) {
      await User.create({
        name: 'Alex Johnson',
        email: demoUserEmail,
        password: 'User@123456',
        role: 'user',
        isVerified: true,
        phone: '+91 91234 56789',
        address: 'Flat 402, Sunshine Heights, Indiranagar, Bangalore',
      });
      console.log(`👤 [Seeder] Created Demo Customer user: ${demoUserEmail}`);
    }

    // 2. Seed Inventory Items
    const inventoryCount = await Inventory.countDocuments();
    if (inventoryCount === 0) {
      const inventoryItems = [
        // 5 Pizza Bases
        {
          name: 'Thin Crust',
          category: 'base',
          stockQuantity: 45,
          threshold: 20,
          unitPrice: 50,
          unit: 'bases',
          description: 'Ultra-crispy hand-stretched dough baked to golden perfection',
          imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'Hand-Tossed Classic',
          category: 'base',
          stockQuantity: 60,
          threshold: 20,
          unitPrice: 70,
          unit: 'bases',
          description: 'Fluffy inside with a traditional crispy, blistered edge',
          imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'Cheese Burst',
          category: 'base',
          stockQuantity: 25,
          threshold: 20,
          unitPrice: 120,
          unit: 'bases',
          description: 'Double-layered crust overflowing with rich, molten mozzarella cream',
          imageUrl: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'Whole Wheat Crust',
          category: 'base',
          stockQuantity: 30,
          threshold: 20,
          unitPrice: 80,
          unit: 'bases',
          description: '100% stoneground whole wheat crust packed with fiber and rustic flavor',
          imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'Gluten-Free Cauliflower Crust',
          category: 'base',
          stockQuantity: 18, // Intentionally near threshold to showcase low-stock indicator
          threshold: 20,
          unitPrice: 130,
          unit: 'bases',
          description: 'Light, guilt-free keto crust seasoned with garlic and Italian oregano',
          imageUrl: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500&auto=format&fit=crop&q=60',
        },

        // 5 Sauces
        {
          name: 'San Marzano Classic Marinara',
          category: 'sauce',
          stockQuantity: 55,
          threshold: 20,
          unitPrice: 30,
          unit: 'portions',
          description: 'Sun-drenched San Marzano Italian tomatoes slow-simmered with sweet basil',
          imageUrl: 'https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'Spicy Peri-Peri',
          category: 'sauce',
          stockQuantity: 40,
          threshold: 20,
          unitPrice: 40,
          unit: 'portions',
          description: 'Zesty bird’s eye chili, paprika, lemon zest, and crushed garlic',
          imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d62810a9?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'Creamy Garlic Alfredo',
          category: 'sauce',
          stockQuantity: 35,
          threshold: 20,
          unitPrice: 45,
          unit: 'portions',
          description: 'Velvety cream sauce infused with roasted garlic and aged parmesan',
          imageUrl: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'Smoky Hickory BBQ',
          category: 'sauce',
          stockQuantity: 42,
          threshold: 20,
          unitPrice: 40,
          unit: 'portions',
          description: 'Deep wood-smoked barbecue sauce with molasses and warm spices',
          imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'Basil & Pine Nut Pesto',
          category: 'sauce',
          stockQuantity: 15, // Low stock demo item
          threshold: 20,
          unitPrice: 50,
          unit: 'portions',
          description: 'Fresh Genovese basil crushed with pine nuts, extra virgin olive oil and pecorino',
          imageUrl: 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=500&auto=format&fit=crop&q=60',
        },

        // Cheeses
        {
          name: '100% Whole Milk Mozzarella',
          category: 'cheese',
          stockQuantity: 50,
          threshold: 20,
          unitPrice: 60,
          unit: 'portions',
          description: 'Classic stretchy, milky mozzarella that bubbles to golden perfection',
          imageUrl: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'Cheddar & Mozzarella Blend',
          category: 'cheese',
          stockQuantity: 48,
          threshold: 20,
          unitPrice: 70,
          unit: 'portions',
          description: 'Sharp yellow cheddar melted harmoniously with mild whole-milk mozzarella',
          imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'Fresh Ricotta & Parmesan',
          category: 'cheese',
          stockQuantity: 32,
          threshold: 20,
          unitPrice: 85,
          unit: 'portions',
          description: 'Creamy dollops of delicate whole-milk ricotta dusted with 24-month Parmigiano',
          imageUrl: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'Smoked Provolone',
          category: 'cheese',
          stockQuantity: 28,
          threshold: 20,
          unitPrice: 80,
          unit: 'portions',
          description: 'Aged curd cheese smoked with beechwood for complex savory depth',
          imageUrl: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'Plant-Based Vegan Mozzarella',
          category: 'cheese',
          stockQuantity: 22,
          threshold: 20,
          unitPrice: 90,
          unit: 'portions',
          description: 'Dairy-free cashew and coconut cream blend that melts beautifully',
          imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60',
        },

        // Vegetables
        {
          name: 'Bell Peppers Trio',
          category: 'vegetable',
          stockQuantity: 65,
          threshold: 20,
          unitPrice: 30,
          unit: 'portions',
          description: 'Crisp green, red, and yellow bell pepper strips cut fresh daily',
          imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'Spanish Black Olives',
          category: 'vegetable',
          stockQuantity: 50,
          threshold: 20,
          unitPrice: 35,
          unit: 'portions',
          description: 'Naturally cured Spanish Hojiblanca olives with rich buttery tang',
          imageUrl: 'https://images.unsplash.com/photo-1589135233689-d56d6168e98f?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'Pickled Hot Jalapeños',
          category: 'vegetable',
          stockQuantity: 45,
          threshold: 20,
          unitPrice: 30,
          unit: 'portions',
          description: 'Tangy, spicy sliced green jalapeño peppers pickled in herb brine',
          imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'Caramelized Red Onions',
          category: 'vegetable',
          stockQuantity: 55,
          threshold: 20,
          unitPrice: 25,
          unit: 'portions',
          description: 'Sweet red onions slow-cooked with balsamic glaze until jammy',
          imageUrl: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'Fresh Button Mushrooms',
          category: 'vegetable',
          stockQuantity: 38,
          threshold: 20,
          unitPrice: 35,
          unit: 'portions',
          description: 'Plump white and cremini mushrooms sautéed lightly in olive oil',
          imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'Sun-dried Tomatoes',
          category: 'vegetable',
          stockQuantity: 24,
          threshold: 20,
          unitPrice: 40,
          unit: 'portions',
          description: 'Intense sweet-tart tomatoes marinated with oregano and olive oil',
          imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'Sweet Golden Corn',
          category: 'vegetable',
          stockQuantity: 50,
          threshold: 20,
          unitPrice: 25,
          unit: 'portions',
          description: 'Steamed tender sweet corn kernels for delicious natural sweetness',
          imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'Baby Spinach Leaves',
          category: 'vegetable',
          stockQuantity: 30,
          threshold: 20,
          unitPrice: 30,
          unit: 'portions',
          description: 'Tender baby spinach leaves wilted on the baking stone',
          imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=60',
        },
      ];

      await Inventory.insertMany(inventoryItems);
      console.log(`📦 [Seeder] Seeded ${inventoryItems.length} inventory items.`);
    } else {
      console.log(`ℹ️ [Seeder] Inventory already populated (${inventoryCount} items).`);
    }

    // 3. Seed Signature Pre-made Pizzas
    const pizzaCount = await Pizza.countDocuments();
    if (pizzaCount === 0) {
      const pizzas = [
        {
          name: 'Margherita Di Bufala',
          description: 'San Marzano marinara, 100% whole milk mozzarella, sun-dried tomatoes, and sweet basil leaves.',
          price: 349,
          image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800&auto=format&fit=crop&q=80',
          isVegetarian: true,
          badge: 'Bestseller',
          base: 'Hand-Tossed Classic',
          sauce: 'San Marzano Classic Marinara',
          cheese: '100% Whole Milk Mozzarella',
          vegetables: ['Sun-dried Tomatoes'],
          rating: 4.9,
          inStock: true,
        },
        {
          name: 'Farmhouse Rustic Supreme',
          description: 'Crisp bell peppers trio, button mushrooms, sweet golden corn, and caramelized red onions on mozzarella.',
          price: 429,
          image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=80',
          isVegetarian: true,
          badge: "Chef's Pick",
          base: 'Thin Crust',
          sauce: 'San Marzano Classic Marinara',
          cheese: '100% Whole Milk Mozzarella',
          vegetables: ['Bell Peppers Trio', 'Fresh Button Mushrooms', 'Sweet Golden Corn', 'Caramelized Red Onions'],
          rating: 4.8,
          inStock: true,
        },
        {
          name: 'Peri-Peri Firecracker',
          description: 'Spicy peri-peri sauce, sharp cheddar & mozzarella blend, pickled hot jalapeños, and crunchy onions.',
          price: 459,
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80',
          isVegetarian: true,
          badge: 'Hot',
          base: 'Cheese Burst',
          sauce: 'Spicy Peri-Peri',
          cheese: 'Cheddar & Mozzarella Blend',
          vegetables: ['Pickled Hot Jalapeños', 'Caramelized Red Onions', 'Bell Peppers Trio'],
          rating: 4.7,
          inStock: true,
        },
        {
          name: 'Truffle & Forest Mushroom',
          description: 'Creamy garlic alfredo sauce, aged smoked provolone, sautéed button mushrooms, and tender baby spinach.',
          price: 499,
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
          isVegetarian: true,
          badge: 'Trending',
          base: 'Hand-Tossed Classic',
          sauce: 'Creamy Garlic Alfredo',
          cheese: 'Smoked Provolone',
          vegetables: ['Fresh Button Mushrooms', 'Baby Spinach Leaves'],
          rating: 4.9,
          inStock: true,
        },
        {
          name: 'Smoky BBQ Harvest',
          description: 'Tangy smoky hickory BBQ sauce with mozzarella, sweet corn, black olives, and bell peppers.',
          price: 449,
          image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&auto=format&fit=crop&q=80',
          isVegetarian: true,
          badge: 'Classic',
          base: 'Whole Wheat Crust',
          sauce: 'Smoky Hickory BBQ',
          cheese: '100% Whole Milk Mozzarella',
          vegetables: ['Sweet Golden Corn', 'Spanish Black Olives', 'Bell Peppers Trio'],
          rating: 4.6,
          inStock: true,
        },
        {
          name: 'Pesto Genovese & Ricotta',
          description: 'Aromatic basil & pine nut pesto base with fresh ricotta, parmesan dusting, black olives, and sun-dried tomatoes.',
          price: 479,
          image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800&auto=format&fit=crop&q=80',
          isVegetarian: true,
          badge: 'New',
          base: 'Gluten-Free Cauliflower Crust',
          sauce: 'Basil & Pine Nut Pesto',
          cheese: 'Fresh Ricotta & Parmesan',
          vegetables: ['Spanish Black Olives', 'Sun-dried Tomatoes', 'Baby Spinach Leaves'],
          rating: 4.9,
          inStock: true,
        },
      ];

      await Pizza.insertMany(pizzas);
      console.log(`🍕 [Seeder] Seeded ${pizzas.length} signature pizzas.`);
    } else {
      console.log(`ℹ️ [Seeder] Pizzas already populated (${pizzaCount} items).`);
    }

    console.log('✅ [Seeder] Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ [Seeder] Error seeding database:', error);
    throw error;
  }
};

// Allow standalone running: node src/seed/seedData.js
if (process.argv[1].endsWith('seedData.js')) {
  (async () => {
    try {
      await connectDB();
      await seedDatabase();
      await disconnectDB();
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  })();
}

