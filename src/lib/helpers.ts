import { db } from "./db";

// Generate unique order number
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `VXL-${timestamp}-${random}`;
}

// Generate unique SKU
export function generateSKU(prefix: string = "PRD"): string {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${random}`;
}

// Generate slug from name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Format currency
export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

// Format date
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

// Format date with time
export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

// Calculate cart totals
export interface CartCalculation {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

export async function calculateCartTotals(
  items: { productId: string; variantId?: string; quantity: number }[],
  couponCode?: string
): Promise<CartCalculation> {
  let subtotal = 0;

  for (const item of items) {
    const product = await db.product.findUnique({
      where: { id: item.productId },
      include: { variants: true },
    });

    if (product) {
      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        subtotal += (variant?.price || product.price) * item.quantity;
      } else {
        subtotal += product.price * item.quantity;
      }
    }
  }

  let discount = 0;
  if (couponCode) {
    const coupon = await db.coupon.findUnique({
      where: { code: couponCode },
    });

    if (coupon && coupon.isActive) {
      if (coupon.type === "PERCENTAGE") {
        discount = subtotal * (coupon.value / 100);
        if (coupon.maxDiscount) {
          discount = Math.min(discount, coupon.maxDiscount);
        }
      } else {
        discount = coupon.value;
      }
    }
  }

  // Free shipping over $100
  const shipping = subtotal > 100 ? 0 : 9.99;

  // Tax (8.5%)
  const tax = subtotal * 0.085;

  const total = subtotal - discount + shipping + tax;

  return {
    subtotal,
    discount,
    shipping,
    tax,
    total,
  };
}

// Validate coupon
export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<{ valid: boolean; message: string; discount?: number }> {
  const coupon = await db.coupon.findUnique({
    where: { code },
  });

  if (!coupon) {
    return { valid: false, message: "Invalid coupon code" };
  }

  if (!coupon.isActive) {
    return { valid: false, message: "This coupon is no longer active" };
  }

  if (coupon.expiresAt && new Date() > coupon.expiresAt) {
    return { valid: false, message: "This coupon has expired" };
  }

  if (coupon.startsAt && new Date() < coupon.startsAt) {
    return { valid: false, message: "This coupon is not yet active" };
  }

  if (coupon.minOrder && subtotal < coupon.minOrder) {
    return {
      valid: false,
      message: `Minimum order amount is ${formatCurrency(coupon.minOrder)}`,
    };
  }

  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    return { valid: false, message: "This coupon has reached its usage limit" };
  }

  let discount = 0;
  if (coupon.type === "PERCENTAGE") {
    discount = subtotal * (coupon.value / 100);
    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
  } else {
    discount = coupon.value;
  }

  return { valid: true, message: "Coupon applied!", discount };
}

// Get order status color
export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    CONFIRMED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    PROCESSING: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    SHIPPED: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    OUT_FOR_DELIVERY: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    DELIVERED: "bg-green-500/10 text-green-500 border-green-500/20",
    CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
    RETURNED: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    REFUNDED: "bg-pink-500/10 text-pink-500 border-pink-500/20",
  };
  return colors[status] || "bg-gray-500/10 text-gray-500 border-gray-500/20";
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

// Sleep utility
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Random ID generator
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
