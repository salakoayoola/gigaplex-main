import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { VideoCarousel } from "@/components/sections/VideoCarousel";
import { ShopPreview } from "@/components/sections/ShopPreview";
import { Newsletter } from "@/components/sections/Newsletter";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <VideoCarousel />
        <ShopPreview />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
