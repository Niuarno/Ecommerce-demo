"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Star,
  Loader2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

interface PaymentsClientProps {
  paymentMethods: any[];
}

const cardBrands: Record<string, { color: string; label: string }> = {
  visa: { color: "bg-blue-600", label: "Visa" },
  mastercard: { color: "bg-orange-500", label: "Mastercard" },
  amex: { color: "bg-blue-400", label: "American Express" },
  discover: { color: "bg-orange-600", label: "Discover" },
};

export function PaymentsClient({ paymentMethods: initialPaymentMethods }: PaymentsClientProps) {
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate card detection
      let brand = "visa";
      if (formData.number.startsWith("4")) brand = "visa";
      else if (formData.number.startsWith("5")) brand = "mastercard";
      else if (formData.number.startsWith("3")) brand = "amex";
      else if (formData.number.startsWith("6")) brand = "discover";

      const last4 = formData.number.slice(-4);
      const [expiryMonth, expiryYear] = formData.expiry.split("/");

      const response = await fetch("/api/user/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "card",
          provider: "stripe",
          label: `${cardBrands[brand]?.label || "Card"} ****${last4}`,
          last4,
          brand,
          expiryMonth: parseInt(expiryMonth),
          expiryYear: 2000 + parseInt(expiryYear),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add payment method");
      }

      const savedPayment = await response.json();
      setPaymentMethods([savedPayment, ...paymentMethods]);
      setIsDialogOpen(false);
      setFormData({ number: "", name: "", expiry: "", cvv: "" });
      toast.success("Payment method added successfully!");
    } catch (error) {
      toast.error("Failed to add payment method");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment method?")) return;

    try {
      const response = await fetch(`/api/user/payments/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete payment method");
      }

      setPaymentMethods(paymentMethods.filter((p) => p.id !== id));
      toast.success("Payment method deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete payment method");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const response = await fetch(`/api/user/payments/${id}/default`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to set default payment method");
      }

      setPaymentMethods(
        paymentMethods.map((p) => ({
          ...p,
          isDefault: p.id === id,
        }))
      );
      toast.success("Default payment method updated!");
    } catch (error) {
      toast.error("Failed to set default payment method");
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Payment Methods</h1>
            <p className="text-muted-foreground">
              Manage your saved payment methods
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-bg">
                <Plus className="h-4 w-4 mr-2" />
                Add Card
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Card</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddCard} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="number">Card Number</Label>
                  <Input
                    id="number"
                    placeholder="1234 5678 9012 3456"
                    value={formData.number}
                    onChange={(e) =>
                      setFormData({ ...formData, number: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name on Card</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={(e) =>
                        setFormData({ ...formData, expiry: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) =>
                        setFormData({ ...formData, cvv: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  Your card information is secure and encrypted
                </div>
                <Button
                  type="submit"
                  className="w-full gradient-bg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Add Card"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {paymentMethods.length === 0 ? (
          <div className="text-center py-16">
            <CreditCard className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No payment methods saved</h2>
            <p className="text-muted-foreground mb-6">
              Add a payment method for faster checkout.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <Card key={method.id} className="relative overflow-hidden">
                {method.isDefault && (
                  <Badge className="absolute top-4 right-4 gradient-bg">
                    Default
                  </Badge>
                )}
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-10 rounded-lg ${
                        cardBrands[method.brand]?.color || "bg-gray-600"
                      } flex items-center justify-center`}
                    >
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{method.label}</p>
                      <p className="text-sm text-muted-foreground">
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!method.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(method.id)}
                        >
                          <Star className="h-3 w-3 mr-1" />
                          Set Default
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDelete(method.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* PayPal section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Digital Wallets</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                    PayPal
                  </div>
                  <div>
                    <p className="font-semibold">PayPal</p>
                    <p className="text-sm text-muted-foreground">
                      Not connected
                    </p>
                  </div>
                </div>
                <Button variant="outline">Connect</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
