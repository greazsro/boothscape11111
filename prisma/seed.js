const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Resetting database...");
  await prisma.order.deleteMany();  // Deletes all orders
  await prisma.variant.deleteMany();  // Deletes all variants
  await prisma.items.deleteMany();   // Deletes all items

  console.log("✅ Old data deleted. Seeding new data...");

  // Sample data for seeding
  const data = [
    { 
      name: "Blazing Corn", 
      quantity: 100, 
      units: "piece", 
      price: 25, 
      imageSlug: "blazingcorn",
      updatedAt: new Date()  // Add updatedAt field
    },
    { 
      name: "Fan", 
      quantity: 100, 
      units: "kilo", 
      price: 90, 
      imageSlug: "fan",
      updatedAt: new Date()  // Add updatedAt field
    },
    { 
      name: "Tissue", 
      quantity: 100, 
      units: "kilo", 
      price: 95, 
      imageSlug: "tissue",
      updatedAt: new Date()  // Add updatedAt field
    },
    { 
      name: "Umbrella", 
      quantity: 100, 
      units: "kilo", 
      price: 95, 
      imageSlug: "umbrella",
      updatedAt: new Date()  // Add updatedAt field
    },
  ];

  // Seed the items into the database
  await prisma.items.createMany({ data });

  console.log("✅ Seeding completed!");
}

main()
  .catch(e => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
