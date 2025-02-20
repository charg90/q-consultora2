import Image from "next/image";
import Damian from "@/public/damian.jpg";
export default function CircularImage() {
  return (
    <div className="relative w-64 h-64 overflow-hidden rounded-full">
      <Image
        src={Damian}
        alt="Profile image"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 256px"
      />
      <p>
        Damián Quirós es un destacado experto financiero y líder empresarial,
        especializado en inversiones en el mercado de valores, gestión de
        carteras y operaciones con derivados. Con más de 16 años de experiencia
        en mercados locales e internacionales, Damián ha perfeccionado su
        experiencia en análisis técnico y fundamental a lo largo de una amplia
        gama de instrumentos financieros. La formación académica de Damián
        incluye una Licenciatura en Economía. También ha realizado cursos
        avanzados en operaciones con derivados e inversiones en el mercado de
        valores, lo que refuerza aún más su posición como un destacado educador
        y profesional financiero. Su larga trayectoria en industrias
        internacionales, lo ubican entre una de las personas más destacadas en
        gestión empresarial.
      </p>
      <p>Lic.Damián Quiros</p>
      <p>CEO & Founder Q | Capital Group</p>
      <p>Senior Executive of Argentina Balfour Capital Group</p>
    </div>
  );
}
