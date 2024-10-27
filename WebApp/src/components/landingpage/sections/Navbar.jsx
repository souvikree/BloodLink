"use client";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full bg-[#F4F4ED] shadow-sm z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center pl-8">
                        <a href="/" className="text-2xl font-bold text-red-600">
                            BloodLink
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a
                            href="/about"
                            className="text-gray-600 hover:text-red-600 transition"
                        >
                            About
                        </a>
                        <a
                            href="/donate"
                            className="text-gray-600 hover:text-red-600 transition"
                        >
                            Donate
                        </a>
                        <a
                            href="/request"
                            className="text-gray-600 hover:text-red-600 transition"
                        >
                            Request
                        </a>
                        <a
                            href="/contact"
                            className="text-gray-600 hover:text-red-600 transition"
                        >
                            Contact
                        </a>
                        <Link href="/signup" className="text-gray-600 hover:text-red-600 transition">
                            <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                            Sign Up
                        </button>
                        </Link>
                        <Link href="/login" className="text-gray-600 hover:text-red-600 transition">
                            <button className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition">
                            Log In
                        </button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-600 hover:text-red-600 focus:outline-none"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden pb-4">
                        <div className="flex flex-col space-y-4">
                            <a
                                href="/about"
                                className="text-gray-600 hover:text-red-600 transition px-2 py-1"
                            >
                                About
                            </a>
                            <a
                                href="/donate"
                                className="text-gray-600 hover:text-red-600 transition px-2 py-1"
                            >
                                Donate
                            </a>
                            <a
                                href="/request"
                                className="text-gray-600 hover:text-red-600 transition px-2 py-1"
                            >
                                Request
                            </a>
                            <a
                                href="/contact"
                                className="text-gray-600 hover:text-red-600 transition px-2 py-1"
                            >
                                Contact
                            </a>
                            <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition w-full">
                                Sign Up
                            </button>
                            <button className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition w-full">
                                Log In
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};


