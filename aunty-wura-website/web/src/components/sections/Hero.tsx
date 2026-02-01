import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, PlayCircle } from "lucide-react";
import { videos } from "@/data/videos";

export function Hero() {
  const latestVideo = videos[0]; // Assuming the first video is the latest

  return (
    <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          
          {/* Content */}
          <div className="space-y-6 max-w-2xl">
            {latestVideo && (
              <div className="inline-flex items-center rounded-full border border-terracotta/20 bg-terracotta/5 px-3 py-1 text-sm font-medium text-terracotta">
                <span className="flex h-2 w-2 rounded-full bg-terracotta mr-2 animate-pulse"></span>
                New Release: {latestVideo.title}
              </div>
            )}
            
            <h1 className="font-display text-5xl font-bold leading-[1.1] tracking-tight text-deep-forest sm:text-6xl md:text-7xl">
              Learn Yoruba <br/>
              <span className="text-terracotta italic">Naturally</span>
            </h1>
            
            <p className="text-lg text-charcoal/80 md:text-xl leading-relaxed max-w-lg">
              Preserving African languages through engaging stories, songs, and nature. 
              Join Aunty Wúrà on a journey to connect with your heritage.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/videos">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  <PlayCircle className="h-5 w-5" />
                  Start Watching
                </Button>
              </Link>
              <Link href="/shop">
                <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
                  Browse Shop
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Trust/Social Proof */}
            <div className="pt-8 flex items-center gap-4 text-sm text-stone-gray">
              <div className="flex -space-x-2">
                 {[1,2,3,4].map(i => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-warm-cream bg-terracotta/20" /> 
                 ))}
              </div>
              <p>Trusted by families</p>
            </div>
          </div>

          {/* Visual/Illustration */}
          <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
            {/* Abstract Organic Shapes Background */}
            <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-wura-gold/20 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-terracotta/20 blur-3xl" />
            
            <div className="relative aspect-square overflow-hidden rounded-[2rem] border-8 border-white shadow-2xl rotate-3 transition-transform hover:rotate-0 duration-700 ease-out">
               {/* Placeholder for Aunty Wura Illustration */}
               <div className="absolute inset-0 bg-warm-sand/20 flex items-center justify-center">
                  <span className="font-display text-deep-forest/20 text-4xl">Aunty Wura Illustration</span>
               </div>
               {/* 
                 In a real implementation, this would be:
                 <Image src="/aunty-wura-hero.png" alt="Aunty Wura teaching" fill className="object-cover" />
               */}
               <img 
                 src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1974&auto=format&fit=crop" 
                 alt="Aunty Wura Teaching" 
                 className="h-full w-full object-cover opacity-90 mix-blend-multiply"
               />
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-deep-forest p-4 text-warm-cream flex items-center justify-center text-center text-xs font-bold shadow-lg rotate-12">
              Free <br/> Resources
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
