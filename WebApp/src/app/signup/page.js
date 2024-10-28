"use client";
import React, { useState } from "react";
import { FaGoogle, FaApple } from "react-icons/fa";
import { SiMicrosoft } from "react-icons/si";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFDEE9] to-[#B5FFF5] p-6">
      <div className="flex flex-col md:flex-row bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-4xl">
        
        {/* Image Section */}
        <div className="hidden md:block md:w-1/2 bg-cover bg-center relative" style={{ backgroundImage: "url('/path/to/your-image.jpg')" }}>
          <div className="absolute inset-0 bg-black opacity-20 rounded-l-3xl"></div>
        </div>
        
        {/* Form Section */}
        <div className="p-8 md:w-1/2 flex flex-col justify-center items-center space-y-6">
          <h2 className="text-4xl font-extrabold text-gray-800">Join BloodLink</h2>
          <p className="text-gray-600 text-center mb-4 text-lg">Become a hero! Sign up to save lives and make a difference.</p>
          <form className="w-full max-w-sm space-y-5">
            <FloatingLabelInput label="Full Name" type="text" />
            <FloatingLabelInput label="Email" type="email" />
            <FloatingLabelInput label="Password" type="password" />
            {/* <FloatingLabelInput label="Phone No." type="tel" /> */}
            <button 
              type="submit" 
              className="w-full py-3 bg-gradient-to-r from-[#FF4B4B] to-[#FF7A7A] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300"
            >
              Sign Up Now
            </button>
          </form>

          {/* Social Login Options */}
          <p className="text-gray-600 text-center mt-6">Or connect with:</p>
          <div className="flex items-center justify-center space-x-6 mt-4">
            <a href="#" className="text-red-500 hover:scale-110 transition-transform duration-200">
              <FaGoogle size={30} />
            </a>
            <a href="#" className="text-blue-600 hover:scale-110 transition-transform duration-200">
              <SiMicrosoft size={30} />
            </a>
            <a href="#" className="text-black hover:scale-110 transition-transform duration-200">
              <FaApple size={30} />
            </a>
          </div>

          <p className="text-gray-600 text-sm text-center mt-4">
            Already a member? <a href="/login" className="text-[#FF4B4B] font-medium hover:underline">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}

function FloatingLabelInput({ label, type }) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");

  return (
    <div className="relative w-full">
      <input 
        type={type} 
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(value !== "")}
        onChange={(e) => setValue(e.target.value)}
        className={`w-full h-12 p-3 bg-gray-50 border border-gray-300 rounded-md focus:border-[#FF4B4B] focus:ring-2 focus:ring-[#FF4B4B] text-gray-800 placeholder-transparent transition duration-200 ${focused || value ? "pt-6" : "pt-3"}`}
      />
      <label 
        className={`absolute left-4 text-gray-500 transition-all duration-200 pointer-events-none ${focused || value ? "text-xs -top-2 bg-white px-1" : "text-base top-3"}`}
      >
        {label}
      </label>
    </div>
  );
}
