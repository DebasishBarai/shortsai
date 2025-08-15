"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ThreeDMarqueeProps {
  images: string[];
  className?: string;
}

export function ThreeDMarquee({ images, className }: ThreeDMarqueeProps) {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const scrollPercent = Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight));
        setScrollY(scrollPercent);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-full overflow-hidden", className)}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative w-full h-full"
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: `rotateX(${scrollY * 20}deg) rotateY(${scrollY * 10}deg)`,
              transition: "transform 0.1s ease-out",
            }}
          >
            <div className="flex gap-4 animate-marquee">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative w-32 h-32 md:w-48 md:h-48 flex-shrink-0"
                  style={{
                    transform: `translateZ(${Math.sin(index * 0.5) * 50}px)`,
                  }}
                >
                  <img
                    src={image}
                    alt={`Marquee image ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                    style={{
                      transform: `rotateY(${index * 15}deg)`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}