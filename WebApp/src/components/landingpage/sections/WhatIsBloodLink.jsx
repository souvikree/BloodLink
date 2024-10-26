
export default function WhatIsBloodLink() {
    return (
        <section className="bg-white py-16 text-gray-900">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-12">
                    What is BloodLink?
                </h2>

                {/* Top Horizontal Section for Hospitals */}
                <div
                    className="relative bg-[#F4F4ED] p-6 rounded-lg mb-8 flex flex-col items-center text-center md:flex-row md:text-left"
                    style={{
                        backgroundImage: "url('/hospitals.png')", // Replace with the actual path of your image
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        height:350
                    }}
                >
                    <div className="absolute inset-0 bg-[#F4F4ED] opacity-70 rounded-lg"></div> {/* Backdrop overlay */}
                    <div className="relative z-10 md:w-1/2 mb-4 md:mb-0">
                        <h3 className="text-3xl font-bold mb-2 text-black">Hospitals & Blood Banks</h3>
                        <p className="text-lg text-gray-600">
                            Hospitals and blood banks can register with BloodLink to connect with donors and ensure timely blood donations.
                        </p>
                        <button className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg">
                            Register Now
                        </button>
                    </div>
                </div>



                {/* Grid for Donors and Patients */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Donors */}
                    <div
                        className="relative flex flex-col items-center justify-center h-full bg-[#F4F4ED] p-6 rounded-lg text-center"
                        style={{
                            backgroundImage: "url('/donors.webp')", // Replace with your image path
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        <div className="absolute inset-0 bg-[#F4F4ED] opacity-70 rounded-lg"></div> {/* Transparent overlay */}
                        <div className="relative z-10 ">
                            <h3 className="text-2xl font-bold mb-2 text-black">Donors</h3>
                            <p className="text-gray-800 mb-4">
                                Donors can easily register and donate blood to save lives. Join the movement today.
                            </p>
                            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg">
                                Donate Now
                            </button>
                        </div>
                    </div>


                    {/* Patients */}
                    <div className="relative flex flex-col items-center justify-center h-full bg-[#F4F4ED] p-6 rounded-lg text-center"
                        style={{
                            backgroundImage: "url('/patient.png')", // Replace with your image path
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            height: 400,

                            //className: "mx-auto mb-4",
                        }}>
                        <div className="absolute inset-0 bg-[#F4F4ED] opacity-60 rounded-lg"></div> {/* Transparent overlay */}
                        <div className="relative z-10 ">
                            <h3 className="text-2xl font-bold mb-2">Patients</h3>
                            <p className="text-gray-600 font-semibold text-xl mb-4">
                                Patients can request blood when needed. BloodLink helps connect patients with donors.
                            </p>
                            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg">
                                Request Blood
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
