"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  ChevronRight,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  PackageOpen,
  TruckIcon,
  XCircle,
} from "lucide-react";
import { formatCurrency, formatDate, formatDateTime, getOrderStatusColor } from "@/lib/helpers";

interface OrderDetailClientProps {
  order: any;
}

const trackingSteps = [
  { status: "PENDING", label: "Order Placed", icon: Clock },
  { status: "CONFIRMED", label: "Confirmed", icon: CheckCircle },
  { status: "PROCESSING", label: "Processing", icon: PackageOpen },
  { status: "SHIPPED", label: "Shipped", icon: Truck },
  { status: "DELIVERED", label: "Delivered", icon: CheckCircle },
];

export function OrderDetailClient({ order }: OrderDetailClientProps) {
  const shippingAddress = JSON.parse(order.shippingAddress);
  const currentStepIndex = trackingSteps.findIndex(
    (step) => step.status === order.status
  );

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link href="/account" className="text-muted-foreground hover:text-primary">
            Account
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link href="/account/orders" className="text-muted-foreground hover:text-primary">
            Orders
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">#{order.orderNumber}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
            <p className="text-muted-foreground">
              Placed on {formatDateTime(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getOrderStatusColor(order.status)}>
              {order.status}
            </Badge>
            <Badge variant="outline">
              {order.paymentStatus}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Order Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Progress bar */}
                  <div className="absolute top-5 left-5 right-5 h-0.5 bg-muted">
                    <div
                      className="h-full gradient-bg transition-all duration-500"
                      style={{
                        width: `${
                          currentStepIndex >= 0
                            ? (currentStepIndex / (trackingSteps.length - 1)) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>

                  {/* Steps */}
                  <div className="relative flex justify-between">
                    {trackingSteps.map((step, index) => {
                      const Icon = step.icon;
                      const isCompleted = index <= currentStepIndex;
                      const isCurrent = index === currentStepIndex;

                      return (
                        <div
                          key={step.status}
                          className="flex flex-col items-center"
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                              isCompleted
                                ? "gradient-bg text-white"
                                : "bg-muted text-muted-foreground"
                            } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <p
                            className={`text-xs mt-2 text-center ${
                              isCompleted ? "font-medium" : "text-muted-foreground"
                            }`}
                          >
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tracking timeline */}
                {order.tracking.length > 0 && (
                  <div className="mt-8 space-y-4">
                    <h4 className="font-medium">Tracking History</h4>
                    <div className="space-y-3">
                      {order.tracking.map((track: any, index: number) => (
                        <div
                          key={track.id}
                          className="flex items-start gap-3 text-sm"
                        >
                          <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                          <div>
                            <p className="font-medium">{track.message}</p>
                            <p className="text-muted-foreground">
                              {formatDateTime(track.createdAt)}
                              {track.location && ` • ${track.location}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex gap-4">
                      <Link
                        href={`/products/${item.product?.slug}`}
                        className="w-20 h-20 rounded-lg bg-muted overflow-hidden shrink-0"
                      >
                        <img
                          src={
                            item.image ||
                            item.product?.images?.[0]?.url ||
                            "/placeholder.png"
                          }
                          alt={item.productName}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.product?.slug}`}
                          className="font-medium hover:text-primary line-clamp-2"
                        >
                          {item.productName}
                        </Link>
                        {item.variantName && (
                          <p className="text-sm text-muted-foreground">
                            {item.variantName}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          SKU: {item.sku}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatCurrency(item.price)} × {item.quantity}
                        </p>
                        <p className="font-semibold text-primary">
                          {formatCurrency(item.total)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {order.shipping === 0 ? "Free" : formatCurrency(order.shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {shippingAddress.firstName} {shippingAddress.lastName}
                  <br />
                  {shippingAddress.address}
                  {shippingAddress.apartment && (
                    <>
                      <br />
                      {shippingAddress.apartment}
                    </>
                  )}
                  <br />
                  {shippingAddress.city}, {shippingAddress.state}{" "}
                  {shippingAddress.postalCode}
                  <br />
                  {shippingAddress.country}
                  <br />
                  {shippingAddress.phone}
                </p>
              </CardContent>
            </Card>

            {/* Payment method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm capitalize">
                  {order.paymentMethod || "Card"}
                </p>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-2">
              <Button className="w-full gradient-bg">Track Package</Button>
              <Button variant="outline" className="w-full">
                Need Help?
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
