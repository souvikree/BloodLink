
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NavbarPublic = () => {
    return (
        <header className="h-16 flex items-center border-b border-border bg-white/80 backdrop-blur-sm px-4 sticky top-0 z-30">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-bloodlink-50 rounded border border-bloodlink-100 flex items-center justify-center">
                        <span className="text-bloodlink-600 font-semibold text-lg">B</span>
                    </div>
                    <span className="font-semibold text-lg">Bloodlink</span>
                </Link>

                <div className="flex items-center space-x-2">
                    <Link to="/login">
                        <Button variant="outline" className="border-bloodlink-200 text-bloodlink-600 hover:bg-bloodlink-50 hover:text-bloodlink-700">
                            Login
                        </Button>
                    </Link>

                    <Link to="/register">
                        <Button className="bg-bloodlink-600 hover:bg-bloodlink-700 text-white">
                            Register
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default NavbarPublic;