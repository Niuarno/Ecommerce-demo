import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { AdminDashboard } from "./admin-dashboard-client";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role || "")) {
    redirect("/");
  }

  // Fetch dashboard stats
  const [
    totalProducts,
    totalOrders,
    totalUsers,
    totalRevenue,
    recentOrders,
    topProducts,
    ordersByStatus,
  ] = await Promise.all([
    // Total products
    db.product.count({ where: { isActive: true } }),
    
    // Total orders
    db.order.count(),
    
    // Total users
    db.user.count({ where: { role: "CUSTOMER" } }),
    
    // Total revenue
    db.order.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { total: true },
    }),
    
    // Recent orders
    db.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        items: { take: 1 },
      },
    }),
    
    // Top selling products
    db.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
    
    // Orders by status
    db.order.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
  ]);

  // Get product details for top products
  const topProductsWithDetails = await Promise.all(
    topProducts.map(async (item) => {
      const product = await db.product.findUnique({
        where: { id: item.productId },
        include: { images: { take: 1 } },
      });
      return {
        ...product,
        totalSold: item._sum.quantity,
      };
    })
  );

  const stats = {
    totalProducts,
    totalOrders,
    totalUsers,
    totalRevenue: totalRevenue._sum.total || 0,
  };

  return (
    <AdminDashboard
      stats={stats}
      recentOrders={recentOrders}
      topProducts={topProductsWithDetails}
      ordersByStatus={ordersByStatus}
    />
  );
}
