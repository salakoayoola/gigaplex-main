"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { products } from "@/data/shop";
import { Button } from "@/components/ui/Button";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const shopCategories = [
  { id: 'all', label: 'All Products' },
  { id: 'books', label: 'Books' },
  { id: 'flashcards', label: 'Flashcards' },
  { id: 'worksheets', label: 'Worksheets' },
  { id: 'bundles', label: 'Bundles' },
  { id: 'merch', label: 'Merch' },
];

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProducts = activeCategory === "all"
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-warm-cream">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-deep-forest">
              Shop
            </h1>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {shopCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-bold transition-all",
                    activeCategory === cat.id
                      ? "bg-terracotta text-white shadow-md"
                      : "bg-white text-deep-forest hover:bg-terracotta/10 border border-warm-sand/20"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              className="group flex flex-col rounded-2xl border border-warm-sand/20 bg-white shadow-sm transition-all hover:shadow-md hover:border-terracotta/30"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-t-2xl bg-stone-100 relative">
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                 {product.category === 'bundles' && (
                  <div className="absolute top-4 left-4 bg-wura-gold text-deep-forest text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    Best Value
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-gray">
                  {product.category}
                </div>
                
                <h3 className="font-heading text-xl font-bold text-deep-forest mb-1">
                  {product.title}
                </h3>
                {product.yoruba_title && (
                   <p className="font-display text-terracotta italic mb-3">{product.yoruba_title}</p>
                )}
                
                <p className="mb-6 text-sm text-charcoal/70 line-clamp-2">
                  {product.description}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-warm-sand/10 pt-4">
                  <span className="font-bold text-lg text-deep-forest">
                    ₦{product.price.toLocaleString()}
                  </span>
                  <Button size="sm" variant="ghost" className="gap-2 text-terracotta hover:text-terracotta hover:bg-terracotta/5">
                    <ShoppingBag className="h-4 w-4" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
          {filteredProducts.length === 0 && (
             <div className="text-center py-20">
                <p className="text-lg text-stone-gray">No products found in this category yet.</p>
                <button 
                  onClick={() => setActiveCategory("all")}
                  className="mt-4 text-terracotta font-bold hover:underline"
                >
                  View all products
                </button>
             </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
