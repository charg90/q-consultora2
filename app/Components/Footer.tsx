"use client";
import React, { useRef, useState } from "react";
import Input from "./input/Input";
import emailjs from "@emailjs/browser";
import Contacto from "@/public/contacto.jpeg";
import Image from "next/image";
import { IoMail } from "react-icons/io5";
import { FaInstagramSquare, FaLinkedin } from "react-icons/fa";
import { TfiWorld } from "react-icons/tfi";

const Footer = () => {
  const [loading, setLoading] = useState(false);
  const form = useRef<HTMLFormElement | null>(null);

  const submitform = async (e: any) => {
    e.preventDefault();

    if (!form.current) return;
    console.log(form.current);

    try {
      setLoading(true);
      const result = await emailjs.sendForm(
        "service_8nnq1ai",
        "template_kk9r5ji",
        form.current,
        {
          publicKey: "n4WX9Oyn3Wg_n7Fqh",
        }
      );
      form.current.reset();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <div
      className=" flex w-full justify-center   flex-col p-4"
      style={{
        boxShadow: "0px 0px 15px #00000029",
        backdropFilter: "blur(50px)",
        backgroundColor: "rgba(17,0,158,0.8)",
        color: "#fff",
        display: "flex",
      }}
    >
      <div className="w-full flex justify-center mb-4 text-3xl ">
        <p className="align-middle">Contactanos</p>
      </div>
      <div className="flex ">
        <div className="w-full">
          <div className="flex items-center gap-4">
            <IoMail size={50} />
            <p className="text-2xl">qcapitalconsultora@gmail.com</p>
          </div>
          <div className="flex items-center gap-4">
            <FaLinkedin size={50} />
            <p className="text-2xl">https://www.linkedin.com/in/damianquiros</p>
          </div>
          <div className="flex items-center gap-4">
            <FaInstagramSquare size={50} />
            <p className="text-2xl">@qcapitalconsultora</p>
          </div>

          <div className="flex items-center gap-4">
            <TfiWorld size={50} />
            <p className="text-2xl">www.qcapitalconsulting.com.ar</p>
          </div>
        </div>
        <form
          className="flex flex-col gap-2 w-full"
          ref={form}
          onSubmit={(e) => submitform(e)}
        >
          <Input label="Nombre" type="text" name="name" className="w[250px]" />
          <Input label="email" type="email" name="email" />
          <textarea
            className="border-white border-2 bg-transparent rounded-xl p-2 w-full h-20"
            placeholder="Mensaje"
            name="message"
          ></textarea>
          <button>{loading ? "Enviando" : "Enviar"}</button>
        </form>
      </div>
    </div>
  );
};

export default Footer;
