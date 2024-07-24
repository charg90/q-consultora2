"use client";
import { useRef, useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

interface props {
  type: string;
  label: string;
  className?: string;
  onChange?: (value: string) => void;
  error?: string | null;
  value?: string | number;
  name?: string;
}

export default function Input({
  type,
  className,
  label,
  onChange,
  value,
  error,
  name,
}: props) {
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
    passwordRef.current?.focus();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <>
      <div
        className={`flex justify-between items-center border-2 border-white rounded-full relative ${
          error ? "border-red-500 text-red-500" : ""
        }`}
      >
        <input
          ref={type === "password" ? passwordRef : null}
          type={type === "password" ? (showPassword ? "text" : type) : type}
          className={` p-2 flex-1 bg-transparent text-white ${className}`}
          onChange={handleInputChange}
          placeholder={label}
          value={value && `${value}`}
          name={name}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={handleShowPassword}
            className=" absolute right-4 top-3 hover:visible  peer-focus:visible "
          >
            {showPassword ? (
              <IoMdEyeOff style={{ color: "white" }} />
            ) : (
              <IoMdEye style={{ color: "white" }} />
            )}
          </button>
        )}
      </div>
    </>
  );
}
