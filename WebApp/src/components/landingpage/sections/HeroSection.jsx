import Image from 'next/image';
import "@fontsource/poppins"; 
import "@fontsource/roboto"; 

export default function HeroSection() {
  return (
    <div className="bg-gradient-to-r from-[#F4F4ED] to-[#EAE9E4] min-h-screen flex items-center">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Text Content */}
          <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0 pl-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 " style={{ fontFamily: "Poppins, sans-serif" }}>
              Giving blood creates new connections
            </h1>
            <p className="text-lg md:text-lg text-gray-600 mb-8 leading-relaxed" style={{ fontFamily: "Roboto, sans-serif" }}>
              Join BloodLink to streamline the donation process. Connect patients with donors and save lives.
            </p>
            <div className="space-x-4">
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md shadow-lg transition duration-300 transform hover:scale-105">
                Donate Now
              </button>
              <button className="text-red-600 border border-red-600 hover:bg-red-50 px-6 py-3 rounded-md transition duration-300 transform hover:scale-105">
                Request Blood
              </button>
            </div>
          </div>

          {/* Image Section */}
          <div className="md:w-1/2">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <Image
                src="/hero.png"
                alt="Blood Donation Illustration"
                layout='fill'
                objectFit="cover"
                className="rounded-3xl shadow-2xl transition-transform transform hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
