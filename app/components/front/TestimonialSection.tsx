"use client";
import React, { useState } from "react";
import { Card } from "../ui/front/card";

export default function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState(1); // Start with Faculty card active 

  const testimonials = [
    {
      id: 0,
      name: "Dr. Sarah Chen",
      role: "PhD Students",
      logo: "P",
      backgroundImage: "/d1.avif",
      description: "Get comprehensive research topic evaluation and grant guidance.",
      quote: "Dessert Scaffold helped me identify the perfect research gap and secure a $150K NSF grant. The grant potential analysis was spot-on and saved me months of research.",
      attribution: "Dr. Sarah Chen",
      position: "PhD Candidate, MIT"
    },
    {
      id: 1,
      name: "Prof. Maria Rodriguez",
      role: "Faculty",
      logo: "F",
      backgroundImage: "/d2.avif",
      description: "Evaluate research proposals and guide student projects effectively.",
      quote: "As a faculty advisor, Dessert Scaffold helps me quickly assess student research proposals and provide targeted guidance. The methodology complexity analysis is invaluable.",
      attribution: "Prof. Maria Rodriguez",
      position: "Professor, Stanford University"
    },
    {
      id: 2,
      name: "Dr. James Wilson",
      role: "Grant Writers",
      logo: "G",
      backgroundImage: "/d3.avif",
      description: "Maximize grant success with data-driven proposal strategies.",
      quote: "Dessert Scaffold transformed our grant writing process. We now have a 85% success rate with federal grants. The trend analysis and funding alignment features are game-changers.",
      attribution: "Dr. James Wilson",
      position: "Research Director, Johns Hopkins"
    },
    {
      id: 3,
      name: "Dr. Lisa Park",
      role: "Postdocs",
      logo: "PD",
      backgroundImage: "/d4.avif",
      description: "Navigate career transitions with research impact insights.",
      quote: "Dessert Scaffold helped me pivot my research focus and secure a tenure-track position. The impact assessment and novelty scoring gave me the confidence to pursue innovative directions.",
      attribution: "Dr. Lisa Park",
      position: "Assistant Professor, UC Berkeley"
    }
  ];

  return (
    <div className=" hidden sm:block py-12 sm:py-16 md:py-20">
      <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Trusted by Researchers <br className="hidden sm:block" /> worldwide
          </h2>
        </div>
      <div className="max-w-fit bg-white rounded-2xl sm:rounded-3xl md:rounded-4xl shadow-sm mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 lg:py-10">
        {/* Header */}
        

        {/* Main Content Container */}
        <div className="flex flex-col lg:flex-row items-start justify-center gap-4 sm:gap-6 md:gap-8">
          {/* Cards Container */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-4">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="flex flex-col lg:flex-row items-center gap-2 sm:gap-4">
                {/* Card */}
                <div className="flex flex-col items-center">
                  <div
                    className={`cursor-pointer transition-all duration-300 ${
                      activeIndex === testimonial.id
                        ? "scale-105"
                        : "hover:scale-102"
                    }`}
                    onClick={() => setActiveIndex(testimonial.id)}
                  >
                    <Card className={`w-36 h-48 sm:w-44 sm:h-56 md:w-48 md:h-64 overflow-hidden border-0 shadow-lg rounded-xl sm:rounded-2xl ${
                      activeIndex === testimonial.id ? "ring-2 sm:ring-4 ring-blue-500" : ""
                    }`}>
                      <div 
                        className="h-full relative bg-cover bg-center bg-no-repeat"
                        style={{
                          backgroundImage: `url(${testimonial.backgroundImage})`
                        }}
                      >
                        <div className="absolute inset-0 bg-black/40"></div>
                        
                      
                        
                        {/* Logo */}
                        <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-white/20 w-6 h-6 sm:w-8 sm:h-8 rounded flex items-center justify-center text-white backdrop-blur-sm">
                          <span className="text-xs sm:text-sm font-bold">{testimonial.logo}</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                  
                 
                </div>

                {/* Quote Box - Show right beside the active card */}
                {activeIndex === testimonial.id && (
                  <div className="bg-purple-800 text-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl w-full sm:w-80 md:w-96 lg:w-[400px] h-64 sm:h-72 md:h-80 flex flex-col justify-center">
                    <p className="text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div className="text-xs sm:text-sm opacity-90 mt-auto">
                      <p className="font-medium">{testimonial.attribution}</p>
                      <p>{testimonial.position}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
