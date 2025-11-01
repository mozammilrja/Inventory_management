import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import Product, { IProduct } from "../models/Product";
import { connectDB } from "../lib/mongodb";

async function seedProducts() {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // Clear old data
    await (Product as any).deleteMany({});
    console.log("🗑️ Old products removed");

    const products: Partial<IProduct>[] = [];

    const assetTypes = [
      "Laptop",
      "Monitor",
      "Mouse",
      "Keyboard",
      "Headset",
      "Docking Station",
    ];
    const statuses: IProduct["status"][] = [
      "Available",
      "Assigned",
      "Under Repair",
      "Retired",
    ];
    const conditions: IProduct["condition"][] = ["New", "Good", "Fair", "Poor"];
    const departments = [
      "IT",
      "HR",
      "Finance",
      "Marketing",
      "Operations",
      "Support",
    ];
    const locations = ["Bangalore", "Hyderabad", "Delhi", "Mumbai", "Pune"];

    for (let i = 0; i < 2000; i++) {
      const status = faker.helpers.arrayElement(statuses);
      const condition = faker.helpers.arrayElement(conditions);
      const assetType = faker.helpers.arrayElement(assetTypes);
      const department = faker.helpers.arrayElement(departments);
      const location = faker.helpers.arrayElement(locations);

      const product: Partial<IProduct> = {
        name: `${faker.commerce.productAdjective()} ${assetType}`,
        assetType,
        serialNumber: faker.string.alphanumeric(10).toUpperCase(),
        brand: faker.company.name(),
        productModel: faker.commerce.productName(),
        sku: faker.string.uuid(),
        status,
        condition,
        price: Number(faker.commerce.price({ min: 500, max: 2000 })),
        description: faker.commerce.productDescription(),
        image: faker.image.url(), // ✅ Faster & reliable
        notes: faker.lorem.sentence(),
        category: assetType,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        location,
        purchaseDate: faker.date.past({ years: 3 }),
        warrantyExpiry: faker.date.future({ years: 2 }),

        ...(status === "Assigned"
          ? {
              employeeName: faker.person.fullName(),
              employeeId: faker.string.alphanumeric(6).toUpperCase(),
              employeeEmail: faker.internet.email(),
              department,
              assignmentDate: faker.date.past({ years: 1 }),
              returnDate: faker.date.future({ years: 1 }),
            }
          : {}),
      };

      // ✅ Typescript safe push (avoid type error)
      products.push(product as IProduct);
    }

    console.log(`🚀 Seeding ${products.length} products...`);
    await Product.insertMany(products as IProduct[]);
    console.log(`✅ Inserted ${products.length} products successfully.`);
    console.log(`✅ Inserted ${products.length} products successfully.`);
  } catch (error) {
    console.error("❌ Error seeding products:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

seedProducts();
