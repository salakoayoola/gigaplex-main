import { Button } from "@/components/ui/Button";
import { Mail } from "lucide-react";

export function Newsletter() {
  return (
    <section className="bg-terracotta py-24 text-white relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-deep-forest/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
          <div className="rounded-full bg-white/10 p-4 mb-2">
            <Mail className="h-8 w-8 text-wura-gold" />
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Join the Family
          </h2>
          
          <p className="text-lg text-warm-cream/90">
            Get free worksheets, new video alerts, and language tips delivered straight to your inbox. No spam, just learning.
          </p>

          <form className="w-full max-w-md flex flex-col sm:flex-row gap-3 mt-4">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 rounded-xl bg-white/10 border border-white/20 px-5 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-wura-gold focus:bg-white/20 transition-all"
            />
            <Button size="lg" className="bg-wura-gold text-deep-forest hover:bg-white font-bold">
              Subscribe
            </Button>
          </form>
          
          <p className="text-xs text-warm-cream/60 pt-2">
            Join 5,000+ parents and learners. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
