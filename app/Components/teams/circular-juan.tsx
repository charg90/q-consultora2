import Image from "next/image";
import Juan from "@/public/juan.jpg";
export default function CircularImageJuan() {
  return (
    <div className="relative w-64 h-64 overflow-hidden rounded-full">
      <Image
        src={Juan}
        alt="Profile image"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 256px"
      />
      <p>
        Juan Manuel Fabbro es un profesional con una sólida formación en
        análisis económico, comercio internacional y estrategia empresarial,
        especializado en el desarrollo y expansión de empresas y startups en
        mercados globales. Su enfoque combina conocimientos avanzados en
        macroeconomía, finanzas y gestión de riesgos con una visión estratégica
        para la internacionalización de negocios y el crecimiento sostenible. En
        su rol dentro Q | Capital Economic Consulting, lidera la planificación y
        ejecución de estrategias de desarrollo corporativo, brindando
        asesoramiento integral a empresas emergentes y consolidadas. Su
        expertise le permite identificar oportunidades de inversión, evaluar la
        viabilidad de nuevos mercados y diseñar modelos de negocio que optimicen
        la competitividad en entornos dinámicos.
      </p>
      <p>Lic.Juan Manuel Fabrro</p>
      <p>Director Estrategias Corporativas</p>
    </div>
  );
}
