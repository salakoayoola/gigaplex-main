"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { videos } from "@/data/videos";
import { cn } from "@/lib/utils";

export function VideoCarousel() {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-16 bg-white relative">
      <div className="container mx-auto px-4 md:px-6 mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-deep-forest mb-2">
            Featured Videos
          </h2>
          <p className="text-charcoal/70">
            Stories, songs, and lessons for the whole family.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => scroll("left")}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => scroll("right")}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Carousel Container */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-6 px-4 md:px-6 pb-8 scrollbar-hide snap-x snap-mandatory"
      >
        {videos.map((video) => (
          <Link 
            key={video.id} 
            href={`/videos/${video.id}`}
            className="group relative flex-none w-[280px] md:w-[350px] snap-center"
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
        
        {/* "See All" Card */}
        <Link 
            href="/videos"
            className="flex-none w-[200px] snap-center flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-warm-sand/50 bg-warm-sand/10 hover:bg-warm-sand/20 transition-colors group text-center p-6"
          >
            <div className="mb-4 rounded-full bg-terracotta/10 p-4 text-terracotta group-hover:bg-terracotta group-hover:text-white transition-colors">
              <ChevronRight className="h-6 w-6" />
            </div>
            <span className="font-heading font-bold text-deep-forest">View All Videos</span>
        </Link>
      </div>
    </section>
  );
}
