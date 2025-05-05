import React from "react";
import "@fontsource/poppins";
import "@fontsource/roboto";

const works = [
    {
        title: "Emergency Blood Drives",
        description:
            "Organizing emergency blood drives during natural disasters, accidents, or other crises to ensure immediate availability of life-saving blood supplies for hospitals and patients in need.",
        impact: "Rapid response to critical shortages, saving lives in emergencies.",
        imageUrl: "\work1.jpg", // Update with actual image paths
    },
    {
        title: "Support for Underprivileged Patients",
        description:
            "Partnering with hospitals to cover the cost of blood transfusions for low-income patients, ensuring that everyone has access to essential blood supplies regardless of their financial situation.",
        impact: "Providing equitable healthcare access, especially for vulnerable communities.",
        imageUrl: "\work2.jpg",
    },
    {
        title: "Community Health Awareness Programs",
        description:
            "Conducting workshops and seminars to educate communities about the importance of regular blood donation, early detection of diseases, and healthy lifestyles.",
        impact: "Promoting public health and building a culture of regular blood donation.",
        imageUrl: "\work3.jpg",
    },
    {
        title: "Blood Donation Camps in Rural Areas",
        description:
            "Setting up mobile blood donation camps in rural and underserved areas, where access to healthcare and blood supplies can be limited.",
        impact: "Extending healthcare reach, bridging the gap in blood supply in remote regions.",
        imageUrl: "\work4.jpeg",
    },
];

export default function WorkSection() {
    return (
        <section className="bg-[#F4F4ED] text-black py-12 px-6 md:px-10 min-h-screen">
            <div className="container mx-auto " >
                <h2 className="text-3xl font-bold mb-4 text-center" style={{ fontFamily: "Poppins, sans-serif" }}>Our Work</h2>
                <p className="text-black mb-8 text-center" style={{ fontFamily: "Poppins, sans-serif" }}>
                    We engage in various initiatives to support healthcare and blood donation awareness, making a meaningful impact in communities.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {works.map((work, index) => (
                        <div key={index} className="flex bg-[#EAE9E4] rounded-lg overflow-hidden shadow-md">
                            {/* Image Section */}
                            <div className="w-1/3">
                                <img
                                    src={work.imageUrl}
                                    alt={work.title}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            {/* Text Section */}
                            <div className="w-2/3 p-6">
                                <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>{work.title}</h3>
                                <p className="text-gray-700 mb-3"  style={{ fontFamily: "Roboto, sans-serif" }}>{work.description}</p>
                                <p className="text-gray-400 font-semibold">
                                    Impact: <span className="text-gray-600">{work.impact}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
