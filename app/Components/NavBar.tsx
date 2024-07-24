import React from "react";
import Logo from "@/public/Dark_Blue_Cyan_Red_Modern_Tech_Tech_News_Instagram_Reel_Video-removebg-preview.png";
import Image from "next/image";
import Link from "next/link";
const NavBar = () => {
  return (
    <div
      className="h-20 flex items-center p-12 bg-opacity-30 fixed w-full  "
      style={{
        position: "fixed",
        boxShadow: "0px 0px 15px #00000029",
        backdropFilter: "blur(50px)",
        backgroundColor: "rgba(17,0,158,0.8)",
        color: "#fff",
        zIndex: 100000,
        display: "flex",
        paddingBlock: 2,
      }}
    >
      <div>
        <Image src={Logo} width={70} height={70} alt="Logo" />
      </div>
      <div className="w-full flex justify-end gap-6">
        <Link href="#ECONOMIA">Economia</Link>
        <Link href="#QUALITY">Calidad</Link>
        <Link href="#ECONOMIAGESTION">Economia y Gestion</Link>
        <Link href="#CONTENIDO">Contenido</Link>
        <Link href="#NOSOTROS">Nosotros</Link>
      </div>
    </div>
  );
};

export default NavBar;
