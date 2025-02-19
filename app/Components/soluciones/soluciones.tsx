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
          Nuestros servicios se centran en la atención al cliente con relación a
          sus necesidades, asesorando para brindar una ayuda enfocada a una
          mejor toma de decisión con el objetivo de maximizar sus beneficios.
          Contamos con un espíritu de trabajo reflexivo, proactivo y dedicado a
          alcanzar Smart targets. Somos una Consultora de Economía que brinda
          una amplia gama de servicios, utilizamos programas de Inteligencia
          Macroeconómica Avanzada, lo que nos permite estar un paso adelante
          logrando resultados superadores.
        </p>
        <p className="mx-auto max-w-4xl text-base sm:text-lg md:text-xl leading-relaxed">
          Desde su establecimiento Q | Capital Group se ha distinguido como un
          modelo de gestión, atendiendo a una clientela diversa y sofisticada
          que abarca grandes industias internacionales, medianas y pequeñas
          empresas, como asi tambien prestigiosas oficinas familiares. El pilar
          de nuestra firma es nuestro compromiso inquebrantable con un servicio
          al cliente personalizado, alineando meticulosamente nuestras
          estrategias con las aspiraciones y necesidades financieras únicas de
          cada cliente. Nuestro éxito duradero se basa en la solidez de nuestras
          relaciones y en nuestra búsqueda constante de resultados financieros
          superiores.
        </p>
      </div>
    </section>
  );
}
