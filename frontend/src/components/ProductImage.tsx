"use client";

import { useState } from "react";
import { ProductArt } from "@/components/ProductArt";

export function ProductImage({
  src,
  alt,
  slug,
  category,
  className,
}: {
  src: string;
  alt: string;
  slug: string;
  category: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(!src);

  return (
    <div className={`relative overflow-hidden bg-[#f7f3ee] ${className ?? ""}`}>
      <ProductArt slug={slug} category={category} className="h-full w-full" />
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : null}
    </div>
  );
}
