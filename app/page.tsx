import EconomySection from "./Components/economy-section/economy-section";
import Soluciones from "./Components/soluciones/soluciones";
import QCapitalBackground from "./Components/background/background";
import GlobalDiversification from "./Components/global-diversification/global-diversifaction";
import FinancialSectorResponsibility from "./Components/financial-sector/financial-sector";
import ComprehensiveResearch from "./Components/comprehensive/comprehensive";
import ComprehensiveServices from "./Components/comprehensive-services/comprehensive-services";
import { Metadata } from "next";
import CircularImage from "./Components/teams/circular-image";
import CircularImageEmi from "./Components/teams/circular-emi";
import CircularImageJuan from "./Components/teams/circular-juan";
import { TeamSection } from "./Components/teams/team-section";
import GoDeeper from "./Components/go-depper/go-depper";

export const metadata: Metadata = {
  title: "Q | Capital Group",
  description:
    "Q | Capital Group - Soluciones Empresariales y Consultoría Económica",
  icons: {
    icon: "/QCapitalICO.ico",
  },
};

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

      <GoDeeper />

      <TeamSection />
      {/* <div id="NOSOTROS">
        <Image src={Nosotros} alt="Economy" />
      </div> */}
      <div>{/* <Footer /> */}</div>
    </div>
  );
}
