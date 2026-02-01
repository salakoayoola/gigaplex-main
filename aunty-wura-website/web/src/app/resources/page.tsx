import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ResourcesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-warm-cream">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-deep-forest mb-8">
            Resources
          </h1>
          <p className="text-lg text-charcoal">Coming soon! Free worksheets and guides for parents.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
