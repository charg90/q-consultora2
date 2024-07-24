import Image from "next/image";
import EconomyImage from "../public/economy.png";
import Quality from "../public/quality.png";
import Soluciones from "../public/solucionesEmpresariales.png";
import Contenido from "../public/nuestro contenido.jpeg";
import Nosotros from "../public/nosotros.jpeg";
import EconomGestion from "./Components/EconomGestion";
import Footer from "./Components/Footer";

export default function Home() {
  return (
    <div className="w-full ">
      <div id="ECONOMIA">
        <Image src={EconomyImage} alt="Economy" />
      </div>
      <div id="QUALITY">
        <Image src={Quality} alt="Quality" />
      </div>
      <div id="ECONOMIAGESTION">
        <EconomGestion />
      </div>
      <div id="SOLUCIONES">
        <Image src={Soluciones} alt="Economy" />
      </div>
      <div id="CONTENIDO">
        <Image src={Contenido} alt="Economy" />
      </div>
      <div id="NOSOTROS">
        <Image src={Nosotros} alt="Economy" />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
