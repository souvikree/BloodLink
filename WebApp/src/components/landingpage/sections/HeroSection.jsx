import Image from 'next/image';

export default function HeroSection() {
  return (
    <div className="bg-[#F4F4ED] min-h-screen">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Text Content */}
          <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Connecting Lives Through Blood Donation
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Join BloodLink to streamline the donation process. Connect patients with donors and save lives.
            </p>
            <div className="space-x-4">
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md">
                Donate Now
              </button>
              <button className="text-red-600 border border-red-600 hover:bg-red-50 px-6 py-2 rounded-md">
                Request Blood
              </button>
            </div>
          </div>

          {/* Image Section */}
          <div className="md:w-1/2">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <Image
                src="/hero.png"
                alt="Blood Donation Illustration"
                layout='fill'
                objectFit="cover"
                className="rounded-3xl shadow-lg w-12 h-12"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
