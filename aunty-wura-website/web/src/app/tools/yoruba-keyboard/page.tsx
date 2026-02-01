import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { YorubaKeyboard } from "@/components/tools/YorubaKeyboard";

export const metadata = {
  title: "Online Yoruba Keyboard | Aunty Wúrà",
  description: "Type Yoruba characters and tone marks easily with our free online virtual keyboard. Supports Ẹ, Ọ, Ṣ and all tone marks.",
};

export default function YorubaKeyboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-warm-cream">
        <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-deep-forest mb-4">
              Yoruba Keyboard
            </h1>
            <p className="text-lg text-charcoal/80 max-w-2xl mx-auto">
              Type correctly with ease. Add proper tone marks (àmì) and subdots to your text for emails, social media, or study notes.
            </p>
          </div>
          
          <YorubaKeyboard />
          
          <div className="mt-12 prose prose-stone max-w-none">
            <h2 className="font-heading text-2xl font-bold text-deep-forest">How to use tone marks</h2>
            <p>
              In Yoruba, tone marks determine the meaning of a word. 
              To use this keyboard:
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Type the base letter (e.g., 'a', 'e', 'o').</li>
              <li>Click the tone mark button (Acute ´, Grave `, or Macron ¯) immediately after.</li>
              <li>The mark will appear on top of the letter.</li>
            </ol>
            <p className="mt-4 text-sm text-stone-500">
              Note: This tool uses standard Unicode combining diacritics, compatible with all modern apps and websites.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
