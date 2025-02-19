"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Compre from "@/public/comprehensive.jpg";

export default function ComprehensiveResearch() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ minHeight: "90vh" }}
    >
      {/* Contenedor de la imagen */}
      <div className="absolute inset-0">
        <Image
          src={Compre || "/placeholder.svg"}
          alt="Comprehensive Research Background"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="z-0"
        />
        {/* Overlay para mejorar la legibilidad */}
        <div className="absolute inset-0 bg-black opacity-70 z-10"></div>
      </div>

      {/* Contenido */}
      <div className="relative z-20 min-h-[90vh] w-full flex items-center justify-center py-12 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 text-white">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center tracking-wider mb-6 sm:mb-8"
          >
            Our Comprehensive Research
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
            className="text-base sm:text-lg md:text-xl leading-relaxed"
          >
            En Q | Capital Group entendemos que la macroeconomía no es solo una
            cuestión de cifras, sino un análisis integral de todos los aspectos
            que conforman una organización. Más allá de los balances contables,
            evaluamos detalladamente los procesos productivos, la eficiencia
            operativa y la gestión de la mano de obra, tanto directa como
            indirecta. Este enfoque holístico nos permite identificar cómo cada
            engranaje del sistema impacta en la economía global de la empresa.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
            className="text-base sm:text-lg md:text-xl leading-relaxed"
          >
            Creemos firmemente que el éxito sostenible de una organización
            depende de la alineación de todas sus partes. Por ello, diseñamos
            estrategias personalizadas que optimizan recursos, mejoran la
            productividad y fortalecen las bases económicas de la empresa,
            asegurando su correcto funcionamiento a largo plazo. Nuestro
            objetivo es transformar el todo en un ecosistema eficiente, capaz de
            adaptarse y prosperar en un entorno dinámico y competitivo.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
