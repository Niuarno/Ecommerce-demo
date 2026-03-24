import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { WishlistClient } from "./wishlist-client";

export default async function WishlistPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/account/wishlist");
  }

  const wishlist = await db.wishlist.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: {
          category: true,
          images: { orderBy: { order: "asc" }, take: 1 },
          reviews: { select: { rating: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return <WishlistClient wishlist={wishlist} />;
}
