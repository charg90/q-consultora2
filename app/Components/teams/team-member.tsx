"use client";

import Image from "next/image";
import { useState } from "react";

interface TeamMemberProps {
  name: string;
  title: string;
  image: string;
  bio: string;
  additionalTitles?: string[];
}

export function TeamMember({
  name,
  title,
  image,
  bio,
  additionalTitles,
}: TeamMemberProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-transparent hover:bg-black/20 transition-colors duration-300 p-4 rounded-lg">
      <div className="text-center space-y-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full group"
        >
          <div className="relative w-64 h-64 overflow-hidden rounded-full mx-auto transition-all duration-300 group-hover:scale-105 ring-2 ring-gray-800 group-hover:ring-gray-700">
            <Image
              src={image || "/placeholder.svg"}
              alt={`Profile image of ${name}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 256px"
            />
          </div>
          <h3 className="text-2xl font-semibold mt-4 text-white group-hover:text-gray-200 transition-colors">
            {name}
          </h3>
          <p className="text-lg text-gray-400 group-hover:text-gray-300 transition-colors">
            {title}
          </p>
          {additionalTitles?.map((additionalTitle, index) => (
            <p
              key={index}
              className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors"
            >
              {additionalTitle}
            </p>
          ))}
        </button>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-500 hover:text-blue-400 transition-colors"
        >
          {isExpanded ? "Close" : `About ${name.split(" ")[0]}`}
        </button>
      </div>
      <div
        className={`text-gray-400 transition-all duration-300 overflow-hidden ${
          isExpanded ? "max-h-[1000px] opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        {bio}
      </div>
    </div>
  );
}
