import Image from "next/image";
import React from "react";

export default function Logo({ className }: { className?: string }) {
  const src = "/images/logo_pm.png";
  return (
    <div className={className}>
      <Image
        src={src}
        alt="Brasão PMESP"
        width={120}
        height={120}
        sizes="(max-width: 640px) 72px, 120px"
        priority
        className="mx-auto"
      />
    </div>
  );
}

