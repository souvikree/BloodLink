import "@fontsource/poppins";
import "@fontsource/roboto";
export default function WhatIsBloodLink() {
    return (
        <section className="bg-gray-50 py-16 text-gray-900">
            <div className="container mx-auto px-12">
                <h2 className="text-4xl font-bold text-center mb-12" style={{ fontFamily: "Poppins, sans-serif" }}>
                    How to Join BloodLink?
                </h2>

                {/* Top Horizontal Section for Hospitals */}
                <div
                    className="relative bg-[#F4F4ED] p-6  rounded-lg mb-8 flex flex-col items-center text-center md:flex-row md:text-left shadow-lg "
                    style={{
                        backgroundImage: "url('/hospital1.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        height: 350,
                    }}
                >
                    <div className="absolute inset-0 bg-black opacity-30 rounded-lg"></div> {/* Backdrop overlay */}
                    <div className="relative z-10 md:w-1/2 mb-4 md:mb-0 text-center md:text-left">
                        <h3 className="text-3xl font-bold mb-2 text-white">Hospitals & Blood Banks</h3>
                        <p className="text-white text-lg mb-4">
                            Hospitals and blood banks can register with BloodLink to connect with donors and ensure timely blood donations.
                        </p>
                        <button className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow-md transition duration-200">
                            Register Now
                        </button>
                    </div>
                </div>

                {/* Grid for Donors and Patients */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Donors */}
                    <div
                        className="relative flex flex-col items-center justify-center h-full bg-[#F4F4ED] p-6 rounded-lg text-center shadow-lg "
                        style={{
                            backgroundImage: "url('/donar1.jpg')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        <div className="absolute inset-0 bg-black opacity-30 rounded-lg"></div> {/* Transparent overlay */}
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold mb-2 text-white">Donors</h3>
                            <p className="text-white text-lg mb-4">
                                Donors can easily register and donate blood to save lives. Join the movement today.
                            </p>
                            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow-md transition duration-200">
                                Donate Now
                            </button>
                        </div>
                    </div>

                    {/* Patients */}
                    <div className="relative flex flex-col items-center justify-center h-full bg-[#F4F4ED] p-6 rounded-lg text-center shadow-lg "
                        style={{
                            backgroundImage: "url('/patient1.jpg')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            height: 400,
                        }}
                    >
                        <div className="absolute inset-0 bg-black opacity-30 rounded-lg"></div> {/* Transparent overlay */}
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold mb-2 text-white">Patients</h3>
                            <p className="text-white text-lg mb-4">
                                Patients can request blood when needed. BloodLink helps connect patients with donors.
                            </p>
                            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow-md transition duration-200">
                                Request Blood
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
