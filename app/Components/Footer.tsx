"use client";
import React, { useRef } from "react";
import Input from "./input/Input";
import emailjs from "@emailjs/browser";

const Footer = () => {
  const form = useRef<HTMLFormElement | null>(null);

  const submitform = async (e: any) => {
    e.preventDefault();

    if (!form.current) return;
    console.log(form.current);

    try {
      const result = await emailjs.sendForm(
        "service_8nnq1ai",
        "template_kk9r5ji",
        form.current,
        {
          publicKey: "n4WX9Oyn3Wg_n7Fqh",
        }
      );

      console.log(result.text);
    } catch (error) {
      console.log(error);
    }

    console.log("submit1");
  };
  return (
    <div
      className="h-[300px] flex w-full justify-center items-center"
      style={{
        boxShadow: "0px 0px 15px #00000029",
        backdropFilter: "blur(50px)",
        backgroundColor: "rgba(17,0,158,0.8)",
        color: "#fff",
        display: "flex",
      }}
    >
      <p>Contacto</p>
      <div>
        <form
          className="flex flex-col gap-2"
          ref={form}
          onSubmit={(e) => submitform(e)}
        >
          <Input label="Nombre" type="text" name="name" />
          <Input label="email" type="email" name="email" />
          <textarea
            className="border-white border-2 bg-transparent rounded-xl p-2 w-full h-20"
            placeholder="Mensaje"
            name="message"
          ></textarea>
          <button>Enviar</button>
        </form>
      </div>
    </div>
  );
};

export default Footer;
