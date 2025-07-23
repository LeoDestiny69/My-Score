// Header.jsx
import React from "react";
import logoImg from "../assets/background.jpg";

const Header = () => {
  return (
    <div className="relative w-full max-w-fit mx-auto rounded-b-2xl shadow-md overflow-hidden">
      <img
        src={logoImg}
        alt="Banner"
        className="block max-w-full h-auto" 
      />
      {/* Soft overlay for text readability */}
      <div className="absolute inset-0" />

      {/* Centered Text */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
      </div>
    </div>
  );
};

export default Header;