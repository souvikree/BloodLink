import Image from 'next/image';
import "@fontsource/poppins"; 
import "@fontsource/roboto"; 

export default function HeroSection() {
  return (
    <div className="relative bg-[#F4F4ED] min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/hero1.jpeg"
          alt="Blood Donation Illustration"
          layout="fill"
          objectFit="cover"
          className="animate-zoom rounded-3xl"
          priority
        />
        <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay */}
      </div>

      {/* Text Content */}
      <div className="relative container mx-auto px-12 py-16 md:py-24 z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-3/4 lg:w-1/2 text-center md:text-left">
            <h1
              className="text-4xl md:text-5xl font-extrabold text-white mb-4"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Giving blood creates new connections
            </h1>
            <p
              className="text-lg md:text-lg text-gray-200 mb-8 leading-relaxed"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              Join BloodLink to streamline the donation process. Connect patients with donors and save lives.
            </p>
            <div className="space-x-4">
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md shadow-lg">
                Donate Now
              </button>
              <button className="text-white border border-red-600 hover:bg-red-50 hover:text-red-400 px-6 py-3 rounded-md shadow-lg">
                Request Blood
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
