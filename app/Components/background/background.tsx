"use client";

import { useRef } from "react";
import { BarChart3, ShieldCheck, TrendingUp } from "lucide-react";
import { motion, useInView } from "framer-motion";

export default function QCapitalBackground() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div
      ref={ref}
      className="min-h-screen bg-black flex items-center justify-center p-4"
      id="QCapitalBackground"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl p-10 space-y-12"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-center text-white"
        >
          Q | Capital Economic Consulting
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-2xl text-center text-gray-300 italic"
        >
          La economía y los mercados son ruidosos. Creamos calma y brindamos
          soluciones estratégicas a largo plazo
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          {[
            {
              icon: BarChart3,
              title: "Apoyo Macroeconómico",
              description: "Impecable soporte en back & front office",
            },
            {
              icon: ShieldCheck,
              title: "Confianza Empresarial",
              description: "Explore nuevas oportunidades con soporte confiable",
            },
            {
              icon: TrendingUp,
              title: "Crecimiento Extraordinario",
              description: "Orientación personalizada para su éxito",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.9 + index * 0.2, duration: 0.8 }}
              className="flex flex-col items-center text-center"
            >
              <item.icon className="w-16 h-16 text-white mb-6" />
              <h2 className="text-xl font-semibold mb-3 text-white">
                {item.title}
              </h2>
              <p className="text-lg text-gray-300">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-center text-xl text-gray-300 mt-12"
        >
          Q | Capital Group permite a sus clientes centrarse en su actividad
          principal, ofreciendo transacciones fluidas y un crecimiento
          extraordinario.
        </motion.p>
      </motion.div>
    </div>
  );
}
