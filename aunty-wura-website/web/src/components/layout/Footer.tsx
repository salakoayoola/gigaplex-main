import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Footer() {
  return (
    <footer className="bg-deep-forest text-warm-cream">
      <div className="container mx-auto px-4 py-16 md:px-6">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="font-display text-3xl font-bold text-warm-cream">
              Aunty Wúrà
            </Link>
            <p className="text-warm-cream/80 max-w-xs">
              Preserving African languages through engaging stories, songs, and nature.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-wura-gold transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-wura-gold transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-wura-gold transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-wura-gold transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4 text-wura-gold">Explore</h3>
            <ul className="space-y-3">
              <li><Link href="/videos" className="hover:text-white transition-colors">Videos</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">Shop</Link></li>
              <li><Link href="/resources" className="hover:text-white transition-colors">Resources</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4 text-wura-gold">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4 text-wura-gold">Stay Connected</h3>
            <p className="mb-4 text-sm text-warm-cream/80">
              Join our community for new lessons and updates.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-lg bg-deep-forest/50 border border-warm-cream/20 px-4 py-2 text-warm-cream placeholder:text-warm-cream/50 focus:outline-none focus:ring-2 focus:ring-wura-gold"
              />
              <Button className="w-full bg-wura-gold text-deep-forest hover:bg-white">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        
        <div className="mt-16 border-t border-warm-cream/10 pt-8 text-center text-sm text-warm-cream/60">
          <p>© {new Date().getFullYear()} Aunty Wúrà. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
