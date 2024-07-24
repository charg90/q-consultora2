"use client";
import Image from "next/image";
import React, { useState } from "react";
import Economy1 from "../../public/Economy1.jpg";
import Gestion from "../../public/gestion2.jpg";
import Inversion from "../../public/inversion3.jpg";
import EconomiaModal from "../../public/EconomiaModal.jpeg";
import GestionModal from "../../public/GestionModal.jpeg";
import InversionModal from "../../public/InversionModal.jpeg";
import { IoClose } from "react-icons/io5";

const EconomGestion = () => {
  const [modalOpenEconomy, setModalOpenEconomy] = useState(false);
  const [modalOpenGestion, setModalOpenGestion] = useState(false);
  const [modalOpenInversion, setModalOpenInversion] = useState(false);

  const handleImageClick = (imageType: string) => {
    switch (imageType) {
      case "economy":
        setModalOpenEconomy(true);
        break;
      case "gestion":
        setModalOpenGestion(true);
        break;
      case "inversion":
        setModalOpenInversion(true);
        break;
      default:
        break;
    }
  };
  return (
    <div className="flex flex-col sm:flex-row h-full max-h-[700px]  w-full ">
      <div
        className="flex relative justify-center w-full "
        onClick={() => handleImageClick("economy")}
      >
        <div className="absolute z-50 top-[02%] text-black p-4 cursor-pointer">
          <p className="text-[60px] font-bold">Economia</p>
          <p className="text-xl">Leer Mas</p>
        </div>

        <Image
          src={Economy1}
          alt="Economy"
          style={{ filter: "grayscale(100%)", width: "100%" }}
          className="w-full"
          onMouseOver={(e) => (e.currentTarget.style.filter = "grayscale(0%)")}
          onMouseOut={(e) => (e.currentTarget.style.filter = "grayscale(100%)")}
        />
      </div>
      <div
        className="flex relative justify-center w-full "
        onClick={() => handleImageClick("gestion")}
      >
        <div className="absolute z-50 top-[02%]">
          <p
            className="text-white text-[60px] font-bold"
            style={{ color: "#000" }}
          >
            Gestion
          </p>
          <p className="text-white text-xl font-bold ">Leer Mas</p>
        </div>
        <Image
          src={Gestion}
          alt="Economy"
          style={{ filter: "grayscale(100%)", width: "100%" }}
          className="w-full"
          onMouseOver={(e) => (e.currentTarget.style.filter = "grayscale(0%)")}
          onMouseOut={(e) => (e.currentTarget.style.filter = "grayscale(100%)")}
        />
      </div>
      <div
        className="flex relative justify-center  w-full"
        onClick={() => handleImageClick("inversion")}
      >
        <div className="absolute z-50 top-[5%] text-white ">
          <p className="text-xl font-bold">Inversion</p>
          <p className="text-xl font-bold">Leer Mas</p>
        </div>
        <Image
          src={Inversion}
          alt="Economy"
          style={{ filter: "grayscale(100%)", width: "100%" }}
          className="w-full"
          onMouseOver={(e) => (e.currentTarget.style.filter = "grayscale(0%)")}
          onMouseOut={(e) => (e.currentTarget.style.filter = "grayscale(100%)")}
        />
      </div>
      {modalOpenEconomy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative">
            <div className="h-50vh w-full  sm:w-90vw">
              <Image
                src={EconomiaModal}
                alt="Economy"
                width={550}
                className="object-cover"
              />
            </div>

            <button
              onClick={() => setModalOpenEconomy(false)}
              className="text-blue-500 mt-14 absolute top-0 right-0"
            >
              <IoClose size={34} />
            </button>
          </div>
        </div>
      )}
      {modalOpenGestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative">
            <div className="h-20vh w-full  sm:w-90vw">
              <Image
                src={GestionModal}
                alt="Economy"
                width={550}
                className="object-cover"
              />
            </div>
            <button
              onClick={() => setModalOpenGestion(false)}
              className="text-blue-500 mt-32 absolute top-0 right-0"
            >
              <IoClose size={34} />
            </button>
          </div>
        </div>
      )}
      {modalOpenInversion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative">
            <div className="h-[500px] w-[500px] absolute bottom-[0px] ">
              <Image
                src={InversionModal}
                alt="Economy"
                width={500}
                height={100}
                className="object-contain"
              />
            </div>
            <button
              onClick={() => setModalOpenInversion(false)}
              className="text-blue-500 mt-14 absolute top-0 right-0"
            >
              <IoClose size={34} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EconomGestion;
