import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/storefront/header";
import { Footer } from "@/components/storefront/footer";
import { CartDrawer } from "@/components/storefront/cart-drawer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "VOXEL - Modern E-Commerce Platform",
    template: "%s | VOXEL",
  },
  description: "Discover the future of shopping with VOXEL. A modern, fast, and beautiful e-commerce experience.",
  keywords: ["ecommerce", "shopping", "modern", "online store", "VOXEL"],
  authors: [{ name: "VOXEL Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "VOXEL - Modern E-Commerce",
    description: "The future of online shopping",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <div className="relative min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
