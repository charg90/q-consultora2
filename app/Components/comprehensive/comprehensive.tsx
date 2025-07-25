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
      id="comprehensiveResearch"
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
            Fundamento Analítico y Estratégico: Desde el inicio, nos
            distinguimos por el uso de programas de Inteligencia Macroeconómica
            Avanzada
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
            className="text-base sm:text-lg md:text-xl leading-relaxed"
          >
            Esta tecnología nos permite estar &rdquo;un paso adelante&rdquo; en
            la comprensión de la economía y los mercados, transformando el
            &rdquo;ruido&rdquo; en calma y brindando soluciones estratégicas a
            largo plazo. La IA potencia nuestro análisis integral de todos los
            aspectos que conforman una organización, yendo más allá de los
            balances contables para evaluar procesos productivos, eficiencia
            operativa y gestión de mano de obra.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
