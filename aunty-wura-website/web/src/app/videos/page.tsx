"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { videos, categories } from "@/data/videos";
import Link from "next/link";
import { Play } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function VideosPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredVideos = activeCategory === "all" 
    ? videos 
    : videos.filter(v => v.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-warm-cream">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-deep-forest">
              Video Archive
            </h1>
            
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
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
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVideos.map((video) => (
              <Link 
                key={video.id} 
                href={`/videos/${video.id}`}
                className="group relative flex flex-col"
              >
                <div className="relative aspect-video overflow-hidden rounded-xl bg-charcoal shadow-md transition-transform group-hover:-translate-y-1">
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
                       <Play className="h-6 w-6 text-white fill-current" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
                    {video.duration}
                  </div>
                </div>
                
                <div className="pt-4">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="inline-block rounded-full bg-terracotta/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-terracotta">
                      {video.category}
                    </span>
                  </div>
                  <h3 className="font-heading text-lg font-bold leading-tight text-deep-forest group-hover:text-terracotta transition-colors">
                    {video.title}
                  </h3>
                  <p className="mt-1 text-sm text-stone-gray line-clamp-2">
                    {video.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          
          {filteredVideos.length === 0 && (
             <div className="text-center py-20">
                <p className="text-lg text-stone-gray">No videos found in this category yet.</p>
                <button 
                  onClick={() => setActiveCategory("all")}
                  className="mt-4 text-terracotta font-bold hover:underline"
                >
                  View all videos
                </button>
             </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
