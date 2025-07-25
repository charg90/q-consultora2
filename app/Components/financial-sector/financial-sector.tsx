"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function FinancialSectorResponsibility() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <div
      ref={ref}
      id="financial"
      className="relative h-[80%] w-full bg-black text-white py-16 px-4"
    >
      <div className="max-w-4xl mx-auto space-y-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-bold text-center tracking-wider"
        >
          RESPONSABLE DEL SECTOR FINANCIERO
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
          className="text-xl md:text-2xl leading-relaxed"
        >
          Q | Capital Group se dedica a gestionar y potenciar el bienestar
          económico-financiero de su empresa, forjando alianzas estratégicas
          basadas en el compromiso y la sinergia
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
          className="text-xl md:text-2xl leading-relaxed"
        >
          Nuestro equipo de especialistas apasionados por la macroeconomía,
          apoyado por sistemas de análisis de datos e Inteligencia Artificial,
          brinda soporte estratégico a cada unidad de negocio dentro de nuestra
          familia de clientes
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.5, duration: 1.5, ease: "easeOut" }}
          className="text-xl md:text-2xl leading-relaxed"
        >
          Conscientes de que el tiempo es un recurso valioso, implementamos
          sistemas y estructuras de análisis diseñados con IA para ser los más
          eficientes y efectivos del mercado, optimizando los recursos
          necesarios y asegurando resultados concretos y perfectamente alineados
          con sus metas Esto facilita un crecimiento sostenido y alcanzable,
          impulsado por la precisión y el poder predictivo de la Inteligencia
          Artificial.
        </motion.p>
      </div>
    </div>
  );
}
