"use client";

import { Truck, CreditCard, ShieldCheck, HeadphonesIcon, RotateCcw, Sparkles } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free shipping on all orders over $100. Fast and reliable delivery worldwide.",
  },
  {
    icon: CreditCard,
    title: "Secure Payment",
    description: "Multiple payment options with SSL encryption. Your data is always safe.",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day hassle-free returns. No questions asked if you change your mind.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Guarantee",
    description: "All products are verified for quality. Shop with complete confidence.",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Round-the-clock customer support. We're always here to help you.",
  },
  {
    icon: Sparkles,
    title: "Exclusive Deals",
    description: "Members get exclusive access to sales, discounts, and new arrivals.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-12 border-y bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="text-center group">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed hidden md:block">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
