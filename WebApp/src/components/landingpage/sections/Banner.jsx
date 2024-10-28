import Image from 'next/image';

export default function Banner() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white banner-section">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image 
          src="/banner.jpg" // replace with your image path
          alt="Background of children smiling"
          layout="fill"
          objectFit="cover"
          className="opacity-60"
        />
      </div>
      
      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Much in Little
        </h1>
        <p className="text-lg md:text-2xl max-w-lg mb-8">
          Every donation, no matter the size, helps change lives. Join us in making a difference, one step at a time.
        </p>
        <button className="flex items-center mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg">
          Donate Now
          <span className="ml-2">→</span>
        </button>
      </div>
      
      {/* Optional Logo or Signature */}
      {/* <div className="absolute bottom-8 right-8 text-white text-xl flex items-center">
        Kindly
        <span className="ml-2">🤲</span>
      </div> */}
    </div>
  );
}