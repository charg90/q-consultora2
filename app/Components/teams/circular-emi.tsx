import Image from "next/image";
import Emi from "@/public/emi.jpg";
export default function CircularImageEmi() {
  return (
    <div className="relative w-64 h-64 overflow-hidden rounded-full">
      <Image
        src={Emi}
        alt="Profile image"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 256px"
      />
      <p>
        Emiliano Getar es un destacado Macroeconomista y líder empresarial,
        especializado en contextos geopolíticos. Con más de 10 años de
        experiencia en diferentes entidades internacionales, Emiliano ha
        perfeccionado en profundidad temas de alta sensibilidad a nivel
        económico mundial. La formación académica de Emiliano incluye una
        Licenciatura en Economía. También ha realizado cursos avanzados en
        operaciones de Management y gestión empresarial. Su larga trayectoria en
        industrias internacionales, lo ubican entre una de las personas más
        destacadas en áreas estratégicas de profunda competitividad.
      </p>
      <p>Lic.Emiliano Getar</p>
      <p>Director Unidad Macroeconomía Internacional</p>
    </div>
  );
}
