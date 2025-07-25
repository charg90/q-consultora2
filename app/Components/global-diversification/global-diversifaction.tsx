"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import GD from "@/public/globalDiversification.jpg";

export default function GlobalDiversification() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div
      ref={ref}
      className="relative h-[90vh] w-full overflow-hidden bg-black"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70"
        style={{
          backgroundImage: `url(${GD.src})`,
        }}
      >
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/50" />
      </div>

      {/* Contenido */}
      <div className="relative h-full flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-bold text-white tracking-wider"
          >
            DIVERSIFICAR GLOBALMENTE
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
            className="text-xl md:text-2xl text-gray-200 leading-relaxed"
          >
            Con Q | Capital Group, la IA simplifica y acelera el análisis de
            instrumentos financieros globales, permitiendo a nuestros clientes
            más destacados anticiparse y ganar tiempo para invertir y
            diversificar su capital en un extenso mercado con agilidad y
            precisión
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1.6, duration: 1.5, ease: "easeOut" }}
            className="text-xl md:text-2xl text-gray-300 leading-relaxed"
          >
            La Inteligencia Macroeconómica Avanzada y nuestros sistemas
            analíticos nos permiten identificar las mejores oportunidades de
            diversificación, transformar datos complejos en información simple y
            comparativa en un ámbito donde la celeridad es fundamental para una
            toma de decisión eficaz y eficiente.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
