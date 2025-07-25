"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  BarChartIcon as ChartBar,
  Brain,
  Briefcase,
  BarChart3,
} from "lucide-react";

export default function ComprehensiveServices() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20,
      },
    },
  };

  const services = [
    {
      title: "Gestion Empresarial",
      icon: ChartBar,
      items: [
        "Implementación y Seguimiento de Sistemas de Gestión, y Optimización de Procesos Productivos y Administrativos, potenciados por algoritmos de IA para maximizar la eficiencia y la toma de decisiones estratégicas",
      ],
    },
    {
      title: "Economia",
      icon: Brain,
      items: [
        "Nuestros servicios de Economía se centran en la Inteligencia Macroeconómica Avanzada, brindando una visión generativa, predictiva y profunda, a través de análisis de datos masivos impulsados por IA y estrategias de competitividad sectorial.",
      ],
    },
    {
      title: "Inversión Futura",
      icon: Briefcase,
      items: [
        " Estudios de Mercado, con la IA analizando tendencias y comportamientos para identificar las oportunidades de inversión más rentables y facilitar el acceso a instrumentos financieros globales de manera ágil. Nuestro potencial basado en IA, nos permite detectar lo que no es obvio para el ojo humano antes de tiempo.",
      ],
    },
  ];

  return (
    <div
      ref={ref}
      className="bg-black text-white min-h-screen w-full py-16 px-4 "
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-6xl mx-auto space-y-16"
      >
        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold text-center tracking-wider mb-12"
        >
          Our Services
        </motion.h2>

        {services.map((service, index) => (
          <motion.div key={index} variants={itemVariants} className="space-y-6">
            <motion.div
              className="flex s items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <service.icon className="w-8 h-8 text-blue-400" />
              <h3 className="text-2xl md:text-3xl font-semibold">
                {service.title}
              </h3>
            </motion.div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.items.map((item, itemIndex) => (
                <motion.li
                  key={itemIndex}
                  variants={itemVariants}
                  custom={itemIndex}
                  className="flex items-start space-x-2"
                >
                  <motion.div
                    className="mt-1"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.2 + itemIndex * 0.1,
                    }}
                  >
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                  </motion.div>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.2 + itemIndex * 0.1,
                    }}
                  >
                    {item}
                  </motion.span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
