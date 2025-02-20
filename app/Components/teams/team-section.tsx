import { TeamMember } from "./team-member";

export function TeamSection() {
  const teamMembers = [
    {
      name: "Emiliano Getar",
      title: "Director Unidad Macroeconomía Internacional",
      image: "/emi.jpg",
      bio: "Emiliano Getar es un destacado Macroeconomista y líder empresarial, especializado en contextos geopolíticos. Con más de 10 años de experiencia en diferentes entidades internacionales, Emiliano ha perfeccionado en profundidad temas de alta sensibilidad a nivel económico mundial. La formación académica de Emiliano incluye una Licenciatura en Economía. También ha realizado cursos avanzados en operaciones de Management y gestión empresarial. Su larga trayectoria en industrias internacionales, lo ubican entre una de las personas más destacadas en áreas estratégicas de profunda competitividad.",
      additionalTitles: ["Lic.Emiliano Getar"],
    },
    {
      name: "Damián Quirós",
      title: "CEO & Founder Q | Capital Group",
      image: "/damian.jpg",
      bio: "Damián Quirós es un destacado experto financiero y líder empresarial, especializado en inversiones en el mercado de valores, gestión de carteras y operaciones con derivados. Con más de 16 años de experiencia en mercados locales e internacionales, Damián ha perfeccionado su experiencia en análisis técnico y fundamental a lo largo de una amplia gama de instrumentos financieros. La formación académica de Damián incluye una Licenciatura en Economía. También ha realizado cursos avanzados en operaciones con derivados e inversiones en el mercado de valores, lo que refuerza aún más su posición como un destacado educador y profesional financiero. Su larga trayectoria en industrias internacionales, lo ubican entre una de las personas más destacadas en gestión empresarial.",
      additionalTitles: [
        "Lic.Damián Quiros",
        "Senior Executive of Argentina Balfour Capital Group",
      ],
    },
    {
      name: "Juan Manuel Fabbro",
      title: "Director Estrategias Corporativas",
      image: "/juan.jpg",
      bio: "Juan Manuel Fabbro es un profesional con una sólida formación en análisis económico, comercio internacional y estrategia empresarial, especializado en el desarrollo y expansión de empresas y startups en mercados globales. Su enfoque combina conocimientos avanzados en macroeconomía, finanzas y gestión de riesgos con una visión estratégica para la internacionalización de negocios y el crecimiento sostenible. En su rol dentro Q | Capital Economic Consulting, lidera la planificación y ejecución de estrategias de desarrollo corporativo, brindando asesoramiento integral a empresas emergentes y consolidadas. Su expertise le permite identificar oportunidades de inversión, evaluar la viabilidad de nuevos mercados y diseñar modelos de negocio que optimicen la competitividad en entornos dinámicos.",
      additionalTitles: ["Lic.Juan Manuel Fabrro"],
    },
  ];

  return (
    <div className="bg-gray-900 py-16 px-4" id="team">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-white mb-16 tracking-tight">
          Meet Our Team
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {teamMembers.map((member) => (
            <TeamMember key={member.name} {...member} />
          ))}
        </div>
      </div>
    </div>
  );
}
