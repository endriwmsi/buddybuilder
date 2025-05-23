"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export function PartnersCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationId: number;
    let position = 0;
    const speed = 0.5;
    const totalWidth = container.scrollWidth;
    const viewportWidth = container.offsetWidth;

    const animate = () => {
      position -= speed;

      // Reset position when all logos have scrolled
      if (Math.abs(position) >= totalWidth / 2) {
        position = 0;
      }

      if (container) {
        container.style.transform = `translateX(${position}px)`;
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  const partners = [
    { name: "OpenAI", logo: "/placeholder-logo.svg" },
    { name: "Amazon", logo: "/placeholder-logo.svg" },
    { name: "Tesla", logo: "/placeholder-logo.svg" },
    { name: "XP Inc", logo: "/placeholder-logo.svg" },
    { name: "Google", logo: "/placeholder-logo.svg" },
    { name: "Microsoft", logo: "/placeholder-logo.svg" },
    { name: "Meta", logo: "/placeholder-logo.svg" },
    { name: "Apple", logo: "/placeholder-logo.svg" },
  ];

  // Duplicate the partners array to create a seamless loop
  const allPartners = [...partners, ...partners];

  return (
    <div className="w-full overflow-hidden">
      <div
        ref={containerRef}
        className="flex items-center gap-12 transition-transform duration-1000 ease-linear"
      >
        {allPartners.map((partner, index) => (
          <div key={`${partner.name}-${index}`} className="flex-shrink-0">
            <Image
              src={partner.logo || "/placeholder.svg"}
              alt={partner.name}
              width={120}
              height={40}
              className="h-8 w-auto object-contain opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
