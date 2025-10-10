import { TeamMember } from "./team-member";

export function TeamSection() {
  const teamMembers = [
    {
      name: "Katherine Bilbao",
      title: "Directora de Estrategias Corporativas",
      image: "/kat.jpg",
      bio: "Katherine Bilbao es Directora de Estrategias Corporativas en Q | Capital Economic Consulting, donde lidera la identificación y resolución de problemáticas estructurales en diversos sectores industriales. Su enfoque combina un profundo análisis estratégico con la implementación de tecnologías avanzadas, asegurando el cumplimiento efectivo de los objetivos corporativos de nuestros clientes.Con amplia experiencia en gestión de proyectos y análisis de datos, Katherine asume además la dirección de la estrategia de expansión sectorial interna de la consultora, impulsando el crecimiento sostenible y diversificado de Q | Capital en mercados clave. Su liderazgo integra el trabajo coordinado de equipos multidisciplinarios para diseñar soluciones innovadoras y de alto impacto.En Q | Capital, Katherine es un pilar fundamental para la transformación organizacional, aportando una mirada institucional, profesional y estratégica que potencia la competitividad y la eficiencia operativa en entornos dinámicos.",
      additionalTitles: ["Lic.Katherine Bilbao"],
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
      bio: "Juan Manuel Fabbro es un profesional con una sólida formación en análisis económico, comercio internacional y estrategia empresarial, especializado en el desarrollo inmobiliario con un profundo enfoque en el análisis y expansión en mercados globales. Su experiencia integra conocimientos avanzados en macroeconomía, finanzas y gestión de riesgos, con un énfasis destacado en el estudio y seguimiento sectorial de mercado bursátil. En su rol dentro de Q | Capital Economic Consulting, lidera la planificación y ejecución de estrategias orientadas al desarrollo de proyectos inmobiliarios, ofreciendo asesoramiento integral que incluye la evaluación de oportunidades de inversión y la viabilidad de nuevos mercados. Su expertise permite diseñar modelos de negocio que potencian la competitividad en entornos dinámicos, apoyándose en un análisis riguroso de tendencias financieras y bursátiles.",
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
          {/* <div className="flex flex-col md:flex-row justify-center items-center gap-12"> */}
          {teamMembers.map((member) => (
            <TeamMember key={member.name} {...member} />
          ))}
        </div>
      </div>
    </div>
  );
}
