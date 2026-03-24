import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Starting seed...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await db.user.upsert({
    where: { email: "admin@voxel.store" },
    update: {},
    create: {
      email: "admin@voxel.store",
      name: "Admin User",
      password: adminPassword,
      role: "SUPER_ADMIN",
    },
  });
  console.log("✅ Created admin user:", admin.email);

  // Create test customer
  const customerPassword = await bcrypt.hash("user123", 12);
  const customer = await db.user.upsert({
    where: { email: "user@voxel.store" },
    update: {},
    create: {
      email: "user@voxel.store",
      name: "Test Customer",
      password: customerPassword,
      role: "CUSTOMER",
    },
  });
  console.log("✅ Created customer user:", customer.email);

  // Create categories
  const categories = await Promise.all([
    db.category.upsert({
      where: { slug: "electronics" },
      update: {},
      create: {
        name: "Electronics",
        slug: "electronics",
        description: "Latest gadgets and electronic devices",
        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800",
      },
    }),
    db.category.upsert({
      where: { slug: "fashion" },
      update: {},
      create: {
        name: "Fashion",
        slug: "fashion",
        description: "Trendy clothing and accessories",
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800",
      },
    }),
    db.category.upsert({
      where: { slug: "home-living" },
      update: {},
      create: {
        name: "Home & Living",
        slug: "home-living",
        description: "Furniture and home decor",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
      },
    }),
    db.category.upsert({
      where: { slug: "sports" },
      update: {},
      create: {
        name: "Sports & Fitness",
        slug: "sports",
        description: "Sports equipment and activewear",
        image: "https://images.unsplash.com/photo-1461896836934-voices?w=800",
      },
    }),
    db.category.upsert({
      where: { slug: "beauty" },
      update: {},
      create: {
        name: "Beauty & Care",
        slug: "beauty",
        description: "Skincare, makeup, and personal care",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800",
      },
    }),
  ]);
  console.log(`✅ Created ${categories.length} categories`);

  // Sample products
  const products = [
    {
      name: "Wireless Bluetooth Headphones",
      slug: "wireless-bluetooth-headphones",
      sku: "ELEC-001",
      description: "Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio quality. Perfect for music lovers and professionals.",
      shortDesc: "Premium ANC headphones with 30h battery",
      price: 199.99,
      comparePrice: 249.99,
      stock: 50,
      categoryId: categories[0].id,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
      ],
    },
    {
      name: "Smart Watch Pro",
      slug: "smart-watch-pro",
      sku: "ELEC-002",
      description: "Advanced smartwatch with health monitoring, GPS tracking, and seamless smartphone integration. Water-resistant up to 50m.",
      shortDesc: "Health tracking & GPS smartwatch",
      price: 349.99,
      comparePrice: 399.99,
      stock: 35,
      categoryId: categories[0].id,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
        "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800",
      ],
    },
    {
      name: "Minimalist Leather Backpack",
      slug: "minimalist-leather-backpack",
      sku: "FASH-001",
      description: "Handcrafted genuine leather backpack with laptop compartment. Perfect for work or travel. Available in multiple colors.",
      shortDesc: "Premium leather backpack for everyday",
      price: 159.99,
      comparePrice: 199.99,
      stock: 25,
      categoryId: categories[1].id,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
      ],
    },
    {
      name: "Classic Denim Jacket",
      slug: "classic-denim-jacket",
      sku: "FASH-002",
      description: "Timeless denim jacket with modern fit. Made from premium quality denim with vintage wash. A wardrobe essential.",
      shortDesc: "Timeless denim classic",
      price: 89.99,
      comparePrice: null,
      stock: 100,
      categoryId: categories[1].id,
      isFeatured: false,
      images: [
        "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800",
      ],
    },
    {
      name: "Modern Table Lamp",
      slug: "modern-table-lamp",
      sku: "HOME-001",
      description: "Contemporary LED table lamp with adjustable brightness and color temperature. Touch control and USB charging port.",
      shortDesc: "LED lamp with touch control",
      price: 79.99,
      comparePrice: 99.99,
      stock: 40,
      categoryId: categories[2].id,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800",
      ],
    },
    {
      name: "Cozy Throw Blanket",
      slug: "cozy-throw-blanket",
      sku: "HOME-002",
      description: "Ultra-soft microfiber throw blanket. Perfect for couch or bed. Machine washable and available in 10 colors.",
      shortDesc: "Super soft & machine washable",
      price: 49.99,
      comparePrice: null,
      stock: 200,
      categoryId: categories[2].id,
      isFeatured: false,
      images: [
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
      ],
    },
    {
      name: "Yoga Mat Premium",
      slug: "yoga-mat-premium",
      sku: "SPORT-001",
      description: "Non-slip eco-friendly yoga mat with alignment lines. 6mm thickness for joint protection. Includes carrying strap.",
      shortDesc: "Eco-friendly non-slip yoga mat",
      price: 59.99,
      comparePrice: 79.99,
      stock: 75,
      categoryId: categories[3].id,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800",
      ],
    },
    {
      name: "Resistance Bands Set",
      slug: "resistance-bands-set",
      sku: "SPORT-002",
      description: "Complete set of 5 resistance bands with different strengths. Perfect for home workouts. Includes workout guide.",
      shortDesc: "5-piece workout bands set",
      price: 29.99,
      comparePrice: null,
      stock: 150,
      categoryId: categories[3].id,
      isFeatured: false,
      images: [
        "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800",
      ],
    },
  ];

  for (const product of products) {
    const { images, ...productData } = product;
    const created = await db.product.upsert({
      where: { slug: product.slug },
      update: productData,
      create: productData,
    });

    // Delete existing images for this product
    await db.productImage.deleteMany({
      where: { productId: created.id },
    });

    // Create images
    for (let i = 0; i < images.length; i++) {
      await db.productImage.create({
        data: {
          productId: created.id,
          url: images[i],
          alt: product.name,
          order: i,
          isPrimary: i === 0,
        },
      });
    }
  }
  console.log(`✅ Created ${products.length} products`);

  // Create coupon
  await db.coupon.upsert({
    where: { code: "VOXEL10" },
    update: {},
    create: {
      code: "VOXEL10",
      name: "Welcome Discount",
      description: "10% off your first order",
      type: "PERCENTAGE",
      value: 10,
      minOrder: 50,
      maxDiscount: 50,
      isActive: true,
    },
  });
  console.log("✅ Created coupon: VOXEL10");

  console.log("🎉 Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
