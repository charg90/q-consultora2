import Image from "next/image";
import Quality from "../public/quality.png";

import Contenido from "../public/nuestro contenido.jpeg";
import Nosotros from "../public/nosotros.jpeg";
import EconomGestion from "./Components/EconomGestion";
import Footer from "./Components/Footer";
import EconomySection from "./Components/economy-section/economy-section";
import Soluciones from "./Components/soluciones/soluciones";
import QCapitalBackground from "./Components/background/background";
import GlobalDiversification from "./Components/global-diversification/global-diversifaction";
import FinancialSectorResponsibility from "./Components/financial-sector/financial-sector";
import ComprehensiveResearch from "./Components/comprehensive/comprehensive";
import ComprehensiveServices from "./Components/comprehensive-services/comprehensive-services";
import NavBar from "./Components/NavBar";

export default function Home() {
  return (
    <div className="w-full ">
      <EconomySection />

      <QCapitalBackground />

      <Soluciones />

      <FinancialSectorResponsibility />

      <GlobalDiversification />

      <ComprehensiveResearch />

      <ComprehensiveServices />
      {/* <div id="NOSOTROS">
        <Image src={Nosotros} alt="Economy" />
      </div> */}
      <div>{/* <Footer /> */}</div>
    </div>
  );
}
