import React from "react";

const services = [
  { 
    title: "Find Blood Faster, Save Lives", 
    description: "Instantly check real-time blood availability and nearby blood banks, ensuring efficient searches during emergencies.",
    bgColor: "#F9F2E7",
    size: "large" 
  },
  { 
    title: "Filter & Find the Right Blood Match", 
    description: "Quickly locate the required blood type with advanced filters by type and RH factor.", 
    bgColor: "#E7F2F9",
    size: "medium" 
  },
  { 
    title: "Locate Help Nearby", 
    description: "View the nearest blood banks and donors within a 7 km radius, enabling faster access to blood sources.",
    bgColor: "#F2E7F9",
    size: "small"
  },
  { 
    title: "Order Blood & Track Every Step", 
    description: "Track your blood order from request to delivery, receiving status updates along the way.",
    bgColor: "#E7F9F2",
    size: "wide"
  },
  { 
    title: "Manage Donations & Supplies Seamlessly", 
    description: "Blood banks and donors get dedicated dashboards to manage supplies and respond to requests effectively.",
    bgColor: "#F9E7F2",
    size: "medium"
  },
  { 
    title: "Fast, Reliable Blood Delivery", 
    description: "BloodLink's admin-coordinated delivery ensures timely, secure blood transport by dedicated personnel.",
    bgColor: "#F2F9E7",
    size: "medium"
  },
  { 
    title: "Empowering Donors to Save Lives", 
    description: "Donors can manage availability, respond to requests, and help patients in need directly from their app.",
    bgColor: "#E7E7F9",
    size: "tall"
  },
  { 
    title: "Join a Life-Saving Community", 
    description: "Patients, donors, and blood banks enjoy a seamless registration and onboarding experience.",
    bgColor: "#F2E7E7",
    size: "small"
  },
  { 
    title: "Your Health, Protected", 
    description: "BloodLink keeps patient data secure with high-level encryption, ensuring privacy and trust.",
    bgColor: "#E7F9E9",
    size: "medium"
  }
];

export default function ServicesPage() {
    return (
      <div className="min-h-screen bg-[#F4F4ED]">
        <div className="container mx-auto px-10 md:px-20 py-12 md:py-20">
          <h2 className="text-4xl font-bold text-center mb-10 text-gray-900">Our Services</h2>
          
          <div className="grid grid-cols-12 gap-6 justify-items-center">
            {/* First Row */}
            <ServiceCard service={services[0]} className="col-start-1" />
            <ServiceCard service={services[1]} className="col-start-5" />
            <ServiceCard service={services[2]} className="col-start-8" />
  
            {/* Second Row */}
            <ServiceCard service={services[3]} className="col-start-1" />
            <ServiceCard service={services[4]} className="col-start-7" />
  
            {/* Third Row */}
            <ServiceCard service={services[5]} className="col-start-1" />
            <ServiceCard service={services[6]} className="col-start-4" />
            <ServiceCard service={services[7]} className="col-start-7" />
            <ServiceCard service={services[8]} className="col-start-9" />
          </div>
        </div>
      </div>
    );
  }
  
  const ServiceCard = ({ service, className = "" }) => {
    const sizeClassMap = {
      small: "col-span-3 md:col-span-2 min-h-[200px]",
      medium: "col-span-4 md:col-span-3 min-h-[200px]",
      large: "col-span-6 md:col-span-4 min-h-[300px]",
      wide: "col-span-8 md:col-span-6 min-h-[200px]",
      tall: "col-span-4 md:col-span-3 min-h-[300px]"
    };
  
    return (
      <div 
        className={`
          ${sizeClassMap[service.size]}
          ${className}
          p-4 rounded-2xl shadow-lg 
          transition-all duration-300
          hover:shadow-xl hover:-translate-y-1
          overflow-hidden
        `}
        style={{ 
          backgroundColor: service.bgColor,
        }}
      >
        <div className="h-full flex flex-col justify-between">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {service.title}
          </h3>
          <p className="text-gray-600 text-base leading-relaxed line-clamp-3">
            {service.description}
          </p>
        </div>
      </div>
    );
  };
  