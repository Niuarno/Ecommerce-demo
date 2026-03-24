import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { OrderDetailClient } from "./order-detail-client";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const { id } = await params;

  const order = await db.order.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { take: 1 },
              category: true,
            },
          },
        },
      },
      tracking: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return <OrderDetailClient order={order} />;
}
