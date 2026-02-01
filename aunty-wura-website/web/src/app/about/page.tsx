import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-warm-cream">
        <div className="container mx-auto px-4 md:px-6 py-12 max-w-3xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-deep-forest mb-6">
            About Aunty Wúrà
          </h1>
          <div className="prose prose-lg prose-stone">
             <p className="text-xl leading-relaxed">
               Aunty Wúrà is preserved to share African languages through engaging, well-crafted learning experiences that connect learners to their heritage while exploring the natural world.
             </p>
             <h2 className="font-heading text-2xl font-bold mt-8 mb-4">Our Vision</h2>
             <p>
               African children fluent in their mother tongues, curious about nature, and confident in their cultural identity.
             </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
