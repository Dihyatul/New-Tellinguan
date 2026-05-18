import React from "react";
import x13 from "../assets/1 1.png";
import Instagram from "../assets/ins.png";
import Linedln from "../assets/link.png";
import Email from "../assets/em.png";
import Telphone from "../assets/wa.png";

const Footer = () => {
  const socialMediaIcons = [
    { src: Instagram, alt: "Instagram" },
    { src: Linedln, alt: "LinkedIn" },
    { src: Email, alt: "Email" },
    { src: Telphone, alt: "WhatsApp" },
  ];  

  return (
    <footer className="w-full bg-[#969597] py-12 mt-24">
      <div className="max-w-360 mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-10">
        
        {/* LEFT SIDE */}
        <div className="text-center md:text-left">
          <h3 className="font-bold text-white text-xl mb-4">
            CONTACT US ON
          </h3>

          <div className="flex gap-4 justify-center md:justify-start">
            {socialMediaIcons.map((icon, index) => (
              <a
                key={index}
                href="#"
                aria-label={icon.alt}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition duration-300"
              >
                <img
                  src={icon.src}
                  alt={icon.alt}
                  className="w-4 h-4 object-contain"
                />
              </a>
            ))}
          </div>
        </div>

        {/* CENTER */}
        <div className="text-center text-white text-sm">
          ©2025 TA TelLinguan. Designed & Developed by TelLinguan Team.
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="flex justify-center md:justify-end">
          <img
            src={x13}
            alt="Footer decoration"
            className="w-50 object-contain"
          />
        </div>

      </div>
    </footer>
  );
};

export default Footer;