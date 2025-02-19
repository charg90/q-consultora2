"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function FinancialSectorResponsibility() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <div
      ref={ref}
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
          económico-financiero de las empresas, estableciendo relaciones basadas
          en compromiso y sinergia. Contamos con un equipo de especialistas
          apasionados por la macroeconomía, que brindan soporte estratégico a
          cada unidad de negocio dentro de nuestra familia de clientes.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
          className="text-xl md:text-2xl leading-relaxed"
        >
          Nuestra experiencia y dedicación nos permiten construir una sólida
          alianza con nuestros clientes, facilitando un crecimiento sostenido y
          alcanzable. Conscientes de que el tiempo es un recurso valioso,
          implementamos sistemas y estructuras de análisis diseñados para ser
          los más eficientes y efectivos del mercado.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.5, duration: 1.5, ease: "easeOut" }}
          className="text-xl md:text-2xl leading-relaxed"
        >
          De esta manera, optimizamos los recursos necesarios para alcanzar los
          objetivos planteados, asegurando resultados concretos y alineados con
          las metas de nuestros clientes.
        </motion.p>
      </div>
    </div>
  );
}
