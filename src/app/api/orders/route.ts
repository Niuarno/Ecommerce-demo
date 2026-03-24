import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/helpers";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { items, shipping, payment, subtotal, discount, shippingCost, tax, total, couponCode } = body;

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create shipping address JSON
    const shippingAddress = JSON.stringify({
      firstName: shipping.firstName,
      lastName: shipping.lastName,
      address: shipping.address,
      apartment: shipping.apartment,
      city: shipping.city,
      state: shipping.state,
      postalCode: shipping.postalCode,
      country: shipping.country,
      phone: shipping.phone,
    });

    // Create order with items in a transaction
    const order = await db.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: session.user.id,
          status: "PENDING",
          paymentStatus: "PENDING",
          paymentMethod: payment.method,
          subtotal,
          discount,
          shipping: shippingCost,
          tax,
          total,
          shippingAddress,
          customerNote: "",
        },
      });

      // Create order items
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            variantId: item.variantId,
            productName: product.name,
            sku: product.sku,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
            image: product.images[0]?.url || null,
          },
        });

        // Update stock
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Create initial tracking entry
      await tx.orderTracking.create({
        data: {
          orderId: newOrder.id,
          status: "PENDING",
          message: "Order placed successfully",
        },
      });

      // Update coupon usage if applicable
      if (couponCode) {
        await tx.coupon.update({
          where: { code: couponCode },
          data: { usageCount: { increment: 1 } },
        });
      }

      return newOrder;
    });

    return NextResponse.json({
      message: "Order created successfully",
      orderId: order.id,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;
    const skip = (page - 1) * limit;

    const where: any = { userId: session.user.id };
    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                include: { images: { take: 1 } },
              },
            },
          },
          tracking: { orderBy: { createdAt: "desc" } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
