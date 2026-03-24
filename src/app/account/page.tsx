import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { CustomerDashboard } from "@/components/storefront/customer-dashboard";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/account");
  }

  // Fetch user data
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      addresses: true,
      paymentMethods: true,
      orders: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: {
              product: {
                include: { images: { take: 1 } },
              },
            },
          },
        },
      },
      _count: {
        select: {
          orders: true,
          reviews: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/auth/login");
  }

  return <CustomerDashboard user={user} />;
}
