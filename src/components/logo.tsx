import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

export default function Logo({ className }: { className?: string }) {
  const src = "/images/logo_pm.png";
  return (
    <motion.div className={className} whileHover={{ scale: 1.03 }} transition={{ duration: 0.18 }}>
      <Image
        src={src}
        alt="Brasão PMESP"
        width={120}
        height={120}
        sizes="(max-width: 640px) 72px, 120px"
        priority
        className="mx-auto"
      />
    </motion.div>
  );
}

