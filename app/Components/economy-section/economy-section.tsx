import Image from "next/image";
import {
  Target,
  Handshake,
  Calendar,
  Landmark,
  ChartNoAxesCombined,
} from "lucide-react";
import Bull from "@/public/bull.jpg";

export default function EconomySection() {
  return (
    <section
      id="ECONOMIA"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <Image
          src={Bull}
          alt="Mountain landscape"
          fill
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="mb-6 text-5xl font-bold md:text-6xl lg:text-7xl">
          Establecidos en 2022
        </h1>
        <p className="mx-auto mb-20 max-w-3xl text-lg md:text-xl">
          Q | Capital Group redefine la consultoría económica, integrando la
          Inteligencia Artificial (IA) para transformar el &rdquo;ruido&rdquo;
          de la economía y los mercados en calma estratégica y soluciones a
          largo plazo.
        </p>

        <div className="grid w-full gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center justify-between h-full">
            <div className="rounded-full bg-white/10 p-4 mb-6">
              <Landmark className="h-8 w-8" />
            </div>
            <div className="flex flex-col items-center flex-grow justify-center">
              <h3 className="text-2xl font-semibold mb-4 text-center">
                Macro-Economia
              </h3>
              <p className="mx-auto max-w-xs">
                {/* This emphasis results in a candid and precise product. */}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between h-full">
            <div className="rounded-full bg-white/10 p-4 mb-6">
              <Handshake className="h-8 w-8" />
            </div>
            <div className="flex flex-col items-center flex-grow justify-center">
              <h3 className="text-2xl font-semibold mb-4">Management</h3>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between h-full">
            <div className="rounded-full bg-white/10 p-4 mb-6">
              <ChartNoAxesCombined className="h-8 w-8" />
            </div>
            <div className="flex flex-col items-center flex-grow justify-center">
              <h3 className="text-2xl font-semibold mb-4">Investment</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
