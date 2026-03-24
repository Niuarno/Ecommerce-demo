"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ChevronRight,
} from "lucide-react";
import { formatCurrency, formatDate, getOrderStatusColor } from "@/lib/helpers";

interface OrdersListClientProps {
  orders: any[];
}

const statusFilters = [
  { value: "all", label: "All", icon: Package },
  { value: "PENDING", label: "Pending", icon: Clock },
  { value: "PROCESSING", label: "Processing", icon: Package },
  { value: "SHIPPED", label: "Shipped", icon: Truck },
  { value: "DELIVERED", label: "Delivered", icon: CheckCircle },
  { value: "CANCELLED", label: "Cancelled", icon: XCircle },
];

export function OrdersListClient({ orders }: OrdersListClientProps) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredOrders =
    activeFilter === "all"
      ? orders
      : orders.filter((order) => order.status === activeFilter);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" asChild>
            <Link href="/account">
              <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
              Back to Account
            </Link>
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-6">My Orders</h1>

        {/* Status filter tabs */}
        <Tabs value={activeFilter} onValueChange={setActiveFilter} className="mb-6">
          <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent">
            {statusFilters.map((filter) => (
              <TabsTrigger
                key={filter.value}
                value={filter.value}
                className="data-[state=active]:gradient-bg"
              >
                <filter.icon className="h-4 w-4 mr-2" />
                {filter.label}
                <span className="ml-2 bg-muted rounded-full px-2 text-xs">
                  {filter.value === "all"
                    ? orders.length
                    : orders.filter((o) => o.status === filter.value).length}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Orders list */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders found</h2>
            <p className="text-muted-foreground mb-6">
              {activeFilter === "all"
                ? "You haven't placed any orders yet."
                : `No ${activeFilter.toLowerCase()} orders.`}
            </p>
            <Button asChild className="gradient-bg">
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Link key={order.id} href={`/account/orders/${order.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Product images */}
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 4).map((item: any, index: number) => (
                          <div
                            key={item.id}
                            className="w-14 h-14 rounded-lg bg-muted border-2 border-background overflow-hidden"
                            style={{ zIndex: 4 - index }}
                          >
                            <img
                              src={
                                item.image ||
                                item.product?.images?.[0]?.url ||
                                "/placeholder.png"
                              }
                              alt={item.productName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {order.items.length > 4 && (
                          <div className="w-14 h-14 rounded-lg bg-muted border-2 border-background flex items-center justify-center font-medium">
                            +{order.items.length - 4}
                          </div>
                        )}
                      </div>

                      {/* Order info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold">#{order.orderNumber}</p>
                          <Badge
                            variant="outline"
                            className={getOrderStatusColor(order.status)}
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(order.createdAt)} • {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""}
                        </p>
                      </div>

                      {/* Total */}
                      <div className="text-right">
                        <p className="font-semibold text-lg">
                          {formatCurrency(order.total)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.paymentStatus}
                        </p>
                      </div>

                      {/* View button */}
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
