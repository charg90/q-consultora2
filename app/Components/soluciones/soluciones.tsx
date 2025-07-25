import Bull from "@/public/qSoluciones.jpg";
import Image from "next/image";

export default function Soluciones() {
  return (
    <section
      id="soluciones"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden py-16 sm:py-24"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={Bull || "/placeholder.svg"}
          alt="Mountain landscape"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center text-white">
        <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
          SOLUCIONES EMPRESARIALES
        </h1>
        <p className="mx-auto mb-8 sm:mb-12 md:mb-16 lg:mb-20 max-w-4xl text-base sm:text-lg md:text-xl leading-relaxed">
          En Q | Capital Group, entendemos que la macroeconomía es un análisis
          integral impulsado por la IA, que trasciende las cifras para evaluar
          cada aspecto que conforma una organización
        </p>
        <p className="mx-auto max-w-4xl text-base sm:text-lg md:text-xl leading-relaxed">
          Nuestros programas de Inteligencia Macroeconómica Avanzada nos
          permiten ir más allá de los balances contables, analizando
          detalladamente los procesos productivos, la eficiencia operativa y la
          gestión de la mano de obra, tanto directa como indirecta Este enfoque
          holístico, potenciado por la IA, nos permite identificar cómo cada
          engranaje del sistema impacta en la economía global de la empresa
          Diseñamos estrategias personalizadas donde la IA optimiza recursos y
          mejora la productividad, transformando la organización en un
          ecosistema eficiente, capaz de adaptarse y prosperar en un entorno
          dinámico y competitivo
        </p>
      </div>
    </section>
  );
}
