import React from "react";
// import "@fontsource/poppins"; 
// import "@fontsource/roboto";  

const services = [
  { 
    title: "Find Blood Faster, Save Lives", 
    description: "Instantly check real-time blood availability and nearby blood banks, ensuring efficient searches during emergencies.",
    bgColor: "#F9F2E7",
    colSpan: "col-span-12 md:col-span-8",
    rowSpan: "row-span-1",
    imgSrc: "\image1.png" 
  },
  { 
    title: "Manage Donations & Supplies Seamlessly", 
    description: "Blood banks and donors get dedicated dashboards to manage supplies and respond to requests effectively.",
    bgColor: "#F9E7F2",
    colSpan: "col-span-6 md:col-span-4",
    rowSpan: "row-span-2",
    imgSrc: "\image5.1.svg"
  },
  { 
    title: "Locate Help Nearby", 
    description: "View the nearest blood banks and donors within a 7 km radius, enabling faster access to blood sources.",
    bgColor: "#F2E7F9",
    colSpan: "col-span-6 md:col-span-4",
    rowSpan: "row-span-2",
    imgSrc: "\image3.png"
  },
  
  { 
    title: "Your Health, Protected", 
    description: "BloodLink keeps patient data secure with high-level encryption, ensuring privacy and trust.",
    bgColor: "#E7F9E9",
    colSpan: "col-span-6 md:col-span-4",
    rowSpan: "row-span-1",
    imgSrc: "\image9.png"
  },
  
  { 
    title: "Filter & Find the Right Blood Match", 
    description: "Quickly locate the required blood type with advanced filters by type and RH factor.", 
    bgColor: "#E7F2F9",
    colSpan: "col-span-6 md:col-span-8",
    rowSpan: "row-span-1",
    imgSrc: "\image2.png"
  },
  
  { 
    title: "Order Blood & Track Every Step", 
    description: "Track your blood order from request to delivery, receiving status updates along the way.",
    bgColor: "#E7F9F2",
    colSpan: "col-span-12 md:col-span-8",
    rowSpan: "row-span-1",
    imgSrc: "\image4a.png"
  },
  { 
    title: "Fast, Reliable Blood Delivery", 
    description: "BloodLink's admin-coordinated delivery ensures timely, secure blood transport by dedicated personnel.",
    bgColor: "#F2F9E7",
    colSpan: "col-span-6 md:col-span-4",
    rowSpan: "row-span-2",
    imgSrc: "\image6.png"
  },
  
  { 
    title: "Empowering Donors to Save Lives", 
    description: "Donors can manage availability, respond to requests, and help patients in need directly from their app.",
    bgColor: "#E7E7F9",
    colSpan: "col-span-12 md:col-span-6",
    rowSpan: "row-span-1",
    imgSrc: "/path/to/image7.jpg"
  },
  { 
    title: "Join a Life-Saving Community", 
    description: "",
    bgColor: "#F2E7E7",
    colSpan: "col-span-6 md:col-span-2",
    rowSpan: "row-span-1",
    imgSrc: "\image8.png"
  },
  
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#F4F4ED]">
      <div className="container mx-auto px-4 md:px-12 py-12 md:py-20">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10 text-[#333333]" style={{ fontFamily: "Poppins, sans-serif" }}>
          Our Services
        </h2>
        
        <div className="grid grid-cols-12 gap-6 auto-rows-[200px] md:auto-rows-[300px]">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
}

const ServiceCard = ({ service }) => (
  <div 
    className={`
      ${service.colSpan} ${service.rowSpan}
      p-5 rounded-2xl shadow-md transition-all duration-300
      hover:shadow-xl     
    `}
    style={{ backgroundColor: service.bgColor }}
  >
    <img 
      src={service.imgSrc} 
      alt={service.title} 
      className="w-full h-3/4 rounded-t-2xl object-cover"
    />
    <div className="h-1/4 flex flex-col justify-center text-center py-3">
      <h3 className="text-lg md:text-xl font-semibold text-[#222222] mb-2" 
      style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {service.title}
      </h3>
      <p className="text-gray-600 text-sm md:text-base leading-relaxed" 
      style={{ fontFamily: "Roboto, sans-serif" }}
      >
        {service.description}
      </p>
    </div>
  </div>
);