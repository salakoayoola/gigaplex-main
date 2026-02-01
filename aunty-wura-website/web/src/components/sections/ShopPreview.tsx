import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { products } from "@/data/shop";

export function ShopPreview() {
  const featuredProducts = products.slice(0, 3);

  return (
    <section className="py-24 bg-warm-cream relative overflow-hidden">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ 
          backgroundImage: 'radial-gradient(#A0522D 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }}>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-2xl">
             <h2 className="font-display text-3xl md:text-4xl font-bold text-deep-forest mb-4">
              Bring the Classroom Home
            </h2>
            <p className="text-lg text-charcoal/80">
              Beautifully illustrated books, flashcards, and resources designed to make learning Yoruba a joy.
            </p>
          </div>
          <Link href="/shop">
            <Button variant="link" className="gap-2 text-terracotta">
              Visit the Shop <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <div 
              key={product.id}
              className="group flex flex-col rounded-2xl border border-warm-sand/20 bg-white shadow-sm transition-all hover:shadow-md hover:border-terracotta/30"
            >
              {/* Image */}
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

              {/* Content */}
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
      </div>
    </section>
  );
}
