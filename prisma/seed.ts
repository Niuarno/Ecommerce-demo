import { PrismaClient } from '@prisma/client'
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting seed...")

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@voxel.store" },
    update: {},
    create: {
      email: "admin@voxel.store",
      name: "Admin User",
      password: adminPassword,
      role: "SUPER_ADMIN",
    },
  })
  console.log("✅ Created admin user:", admin.email)

  // Create test customer
  const customerPassword = await bcrypt.hash("user123", 12)
  const customer = await prisma.user.upsert({
    where: { email: "user@voxel.store" },
    update: {},
    create: {
      email: "user@voxel.store",
      name: "Test Customer",
      password: customerPassword,
      role: "CUSTOMER",
    },
  })
  console.log("✅ Created customer user:", customer.email)

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "electronics" },
      update: {},
      create: {
        name: "Electronics",
        slug: "electronics",
        description: "Latest gadgets and electronic devices",
        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800",
      },
    }),
    prisma.category.upsert({
      where: { slug: "fashion" },
      update: {},
      create: {
        name: "Fashion",
        slug: "fashion",
        description: "Trendy clothing and accessories",
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800",
      },
    }),
    prisma.category.upsert({
      where: { slug: "home-living" },
      update: {},
      create: {
        name: "Home & Living",
        slug: "home-living",
        description: "Furniture and home decor",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
      },
    }),
    prisma.category.upsert({
      where: { slug: "sports" },
      update: {},
      create: {
        name: "Sports & Fitness",
        slug: "sports",
        description: "Sports equipment and activewear",
        image: "https://images.unsplash.com/photo-1461896836934-voices?w=800",
      },
    }),
  ])
  console.log(`✅ Created ${categories.length} categories`)

  // Sample products
  const products = [
    {
      name: "Wireless Bluetooth Headphones",
      slug: "wireless-bluetooth-headphones",
      sku: "ELEC-001",
      description: "Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio quality.",
      shortDesc: "Premium ANC headphones",
      price: 199.99,
      comparePrice: 249.99,
      stock: 50,
      categoryId: categories[0].id,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      ],
    },
    {
      name: "Smart Watch Pro",
      slug: "smart-watch-pro",
      sku: "ELEC-002",
      description: "Advanced smartwatch with health monitoring and GPS tracking.",
      shortDesc: "Health tracking smartwatch",
      price: 349.99,
      comparePrice: 399.99,
      stock: 35,
      categoryId: categories[0].id,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
      ],
    },
    {
      name: "Minimalist Leather Backpack",
      slug: "minimalist-leather-backpack",
      sku: "FASH-001",
      description: "Handcrafted genuine leather backpack with laptop compartment.",
      shortDesc: "Premium leather backpack",
      price: 159.99,
      comparePrice: 199.99,
      stock: 25,
      categoryId: categories[1].id,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
      ],
    },
    {
      name: "Modern Table Lamp",
      slug: "modern-table-lamp",
      sku: "HOME-001",
      description: "Contemporary LED table lamp with adjustable brightness.",
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
      name: "Yoga Mat Premium",
      slug: "yoga-mat-premium",
      sku: "SPORT-001",
      description: "Non-slip eco-friendly yoga mat with alignment lines.",
      shortDesc: "Eco-friendly yoga mat",
      price: 59.99,
      comparePrice: 79.99,
      stock: 75,
      categoryId: categories[3].id,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800",
      ],
    },
  ]

  for (const product of products) {
    const { images, ...productData } = product
    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: productData,
      create: productData,
    })

    await prisma.productImage.deleteMany({
      where: { productId: created.id },
    })

    for (let i = 0; i < images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: created.id,
          url: images[i],
          alt: product.name,
          order: i,
          isPrimary: i === 0,
        },
      })
    }
  }
  console.log(`✅ Created ${products.length} products`)

  // Create coupon
  await prisma.coupon.upsert({
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
  })
  console.log("✅ Created coupon: VOXEL10")

  console.log("🎉 Seed completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
