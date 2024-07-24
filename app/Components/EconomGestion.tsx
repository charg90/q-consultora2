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

  const closeModal = (
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col sm:flex-row h-full max-h-[700px] w-full ">
      <div
        className="flex relative justify-center w-full "
        onClick={() => handleImageClick("economy")}
      >
        <div className="absolute z-50 top-[45%] text-black p-4 cursor-pointer">
          <p className="text-[60px] font-bold">Economia</p>
          <p className="text-black text-xl font-bold">Leer Mas</p>
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
        <div className="absolute z-50 top-[45%]">
          <p className="text-black text-[60px] font-bold">Gestion</p>
          <p className="text-black text-xl font-bold ">Leer Mas</p>
        </div>
        <Image
          src={Gestion}
          alt="Gestion"
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
        <div className="absolute z-50 top-[45%] text-white ">
          <p className="text-black text-[60px] font-bold">Inversion</p>
          <p className="text-black text-xl font-bold ">Leer Mas</p>
        </div>
        <Image
          src={Inversion}
          alt="Inversion"
          style={{ filter: "grayscale(100%)", width: "100%" }}
          className="w-full"
          onMouseOver={(e) => (e.currentTarget.style.filter = "grayscale(0%)")}
          onMouseOut={(e) => (e.currentTarget.style.filter = "grayscale(100%)")}
        />
      </div>
      {modalOpenEconomy && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => closeModal(setModalOpenEconomy)}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal content from closing the modal
          >
            <div className="h-50vh w-full sm:w-90vw">
              <Image
                src={EconomiaModal}
                alt="Economia Modal"
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => closeModal(setModalOpenGestion)}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal content from closing the modal
          >
            <div className="h-20vh w-full sm:w-90vw">
              <Image
                src={GestionModal}
                alt="Gestion Modal"
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => closeModal(setModalOpenInversion)}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal content from closing the modal
          >
            <div className="h-[500px] w-[500px] absolute bottom-[0px] ">
              <Image
                src={InversionModal}
                alt="Inversion Modal"
                width={500}
                height={100}
                className="object-contain"
              />
            </div>
            {/* <button
              onClick={() => setModalOpenInversion(false)}
              className="text-blue-500 mt-14 absolute top-0 right-0"
            >
              <IoClose size={34} />
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default EconomGestion;
