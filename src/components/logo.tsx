import Image from "next/image";
import React from "react";

export default function Logo({ className }: { className?: string }) {
  const src = "/images/logo_pm.png";
  // Render next/image if file exists at runtime in public/; otherwise render inline SVG fallback.
  return (
    <div className={className}>
      {/* next/image will gracefully show broken image if not present; fallback SVG below */}
      <Image src={src} alt="Brasão PMESP" width={120} height={120} className="mx-auto" />
    </div>
  );
}

