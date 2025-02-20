"use client";

import { ChevronLeft, ChevronRight, FileDown, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import monImage from "@/public/Q  Capital (2).jpg";
import Lin1 from "@/public/linkedin/linkedin1.jpg";
import Lin2 from "@/public/linkedin/linkedin2.jpg";
import Lin3 from "@/public/linkedin/linkedin3.jpg";
import Lin4 from "@/public/linkedin/linkedin4.jpg";
import Lin5 from "@/public/linkedin/linkedin5.jpg";
import Lin6 from "@/public/linkedin/linkedin6.jpg";

const researchData = [
  {
    image: Lin1,
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7297374267422236673",
  },
  {
    image: Lin2,
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7296253118030188547",
  },
  {
    image: Lin3,
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7285430561983107072",
  },
  {
    image: Lin4,
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7287570908792188929",
  },
  {
    image: Lin5,
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7292498376531628032",
  },
  {
    image: Lin6,
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7288307009370677248",
  },
];

export default function GoDeeper() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState("");

  const handleImageClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/brochure.pdf";
    link.download = "Q_Capital_Brochure.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSlideDirection("slide-left");
    setCurrentIndex((prevIndex) =>
      prevIndex + 3 >= researchData.length ? 0 : prevIndex + 3
    );
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSlideDirection("slide-right");
    setCurrentIndex((prevIndex) =>
      prevIndex - 3 < 0 ? Math.max(researchData.length - 3, 0) : prevIndex - 3
    );
  };
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setSlideDirection("");
      }, 300); // Match this with the transition duration
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  return (
    <section
      className="relative w-full py-24 md:py-32 lg:py-48 overflow-hidden"
      id="goDeeper"
    >
      <div className="absolute inset-0">
        <Image
          src={monImage || "/placeholder.svg"}
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={100}
          placeholder="blur"
        />
      </div>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative container mx-auto px-4 md:px-6 z-10">
        <h2 className="text-4xl font-bold text-center mb-8 text-white">
          Go Deeper
        </h2>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            className="w-full sm:w-auto px-6 py-3 bg-white text-gray-900 font-semibold rounded-md shadow-md hover:bg-gray-100 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={openModal}
          >
            Our Research
          </button>
          <button
            className="w-full sm:w-auto px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-md hover:bg-white/10 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            onClick={handleDownload}
          >
            <FileDown className="inline-block mr-2 h-5 w-5" />
            Brochure (Download PDF)
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4">
          <div className="bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h3 className="text-2xl font-semibold text-white">
                Our Research
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition duration-150 ease-in-out"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 relative overflow-hidden">
              <div
                className={`flex transition-transform duration-300 ease-in-out ${
                  slideDirection === "slide-left"
                    ? "-translate-x-full"
                    : slideDirection === "slide-right"
                    ? "translate-x-full"
                    : ""
                }`}
              >
                {researchData
                  .slice(currentIndex, currentIndex + 3)
                  .map((item, index) => (
                    <div key={index} className="flex-shrink-0 w-1/3 px-2">
                      <div
                        className="cursor-pointer overflow-hidden rounded-lg"
                        onClick={() => handleImageClick(item.url)}
                      >
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={`LinkedIn post ${currentIndex + index + 1}`}
                          width={200}
                          height={150}
                          className="object-cover w-full h-40 hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  ))}
              </div>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full transition-transform duration-150 hover:scale-110 active:scale-95"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full transition-transform duration-150 hover:scale-110 active:scale-95"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
            <div className="flex justify-end p-6 border-t border-gray-700">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition duration-150 ease-in-out"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
