import React from "react";
import { FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-[#000000] text-white py-10">
            <div className="container mx-auto px-6 md:px-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
                    {/* Left Section */}
                    <div className="mb-8 md:mb-0 md:w-1/3">
                        <h3 className="text-2xl font-semibold mb-6">Need Help?</h3>
                        <p className="text-gray-400 mb-6">
                            If you have further questions or need any assistance, please get in touch with our team, and we will gladly assist you.
                        </p>
                        <button className="px-6 py-2 border border-white rounded-full hover:bg-gray-800 transition duration-300 flex items-center space-x-2">
                            <span>Contact us</span>
                            <span className="ml-2">→</span>
                        </button>
                    </div>

                    {/* Right Section */}
                    <div>
                        <h3 className="text-2xl font-semibold mb-6">Stay in Touch</h3>
                        <p className="text-gray-400 mb-6">
                            Subscribe to our newsletter to receive news, updates, and hear about incredible stories from recipients.
                        </p>
                        <div className="flex items-center border border-gray-700 rounded-full overflow-hidden">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="px-4 py-2 w-full bg-black text-white outline-none"
                            />
                            <button className="px-6 py-2 bg-gray-700 hover:bg-gray-600 transition duration-300">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-700 mb-8" />

                {/* Bottom Links Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Companies</h4>
                        <ul className="text-gray-400 space-y-2">
                            <li><a href="#">Our Services</a></li>
                            <li><a href="#">Our Partners</a></li>
                            <li><a href="#">Corporate Gift Cards</a></li>
                            <li><a href="#">Partner with us</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">About us</h4>
                        <ul className="text-gray-400 space-y-2">
                            <li><a href="#">Our mission</a></li>
                            <li><a href="#">Our team</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Awards</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Support</h4>
                        <ul className="text-gray-400 space-y-2">
                            <li><a href="#">FAQs</a></li>
                            <li><a href="#">Contact Us</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Service</a></li>
                        </ul>
                    </div>

                    <div className="flex flex-col items-center md:items-start">
                        <h4 className="text-lg font-semibold mb-4">Social Media</h4>
                        <div className="flex space-x-4 text-gray-400">
                            <a href="#" className="hover:text-gray-200"><FaInstagram size={20} /></a>
                            <a href="#" className="hover:text-gray-200"><FaTwitter size={20} /></a>
                            <a href="#" className="hover:text-gray-200"><FaWhatsapp size={20} /></a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}