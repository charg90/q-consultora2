"use client";

import { useState, useEffect } from "react";
import Logo from "@/public/Q  Capital.jpg";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { href: "#ECONOMIA", label: "Economia" },
    { href: "#QUALITY", label: "Calidad" },
    { href: "#ECONOMIAGESTION", label: "Economia y Gestion" },
    { href: "#CONTENIDO", label: "Contenido" },
    { href: "#NOSOTROS", label: "Nosotros" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "h-16" : "h-20"
        } flex items-center justify-between px-4 md:px-12 bg-black`}
        style={{
          boxShadow: "0px 0px 15px rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="flex items-center">
          <Image
            src={Logo || "/placeholder.svg"}
            width={160}
            height={160}
            alt="Logo"
            className={`w-auto ${
              scrolled ? "h-10" : "h-12"
            } md:h-16 transition-all duration-300`}
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex justify-end gap-4 lg:gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-white text-sm lg:text-base hover:text-gray-300 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-${
              scrolled ? "16" : "20"
            } left-0 right-0 bg-black z-40`}
          >
            <div className="flex flex-col items-center py-4">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="py-2 text-white hover:text-gray-300 transition-colors text-sm"
                  onClick={toggleMenu}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from being hidden under the navbar */}
      <div className={`h-${scrolled ? "16" : "20"}`}></div>
    </>
  );
};

export default NavBar;
