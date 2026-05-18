import React from "react";
import x12 from "../assets/1 2.png";

const About = () => {
  const AboutContent = [
    {
      title: "TelLinguan",
      description:
        "TelLinguan merupakan sebuah platform yang dikembangkan sebagai bagian dari Tugas Akhir dengan judul “Sistem Placement Test Adaptif Berbasis Naive Bayes Classifiers untuk Layanan Kursus Bahasa Inggris“. Platform ini dirancang untuk membantu menentukan level kemampuan bahasa peserta secara lebih akurat melalui pendekatan adaptif yang responsif terhadap performa pengguna untuk kursus EPrT® Preparation.",
    },
  ];

  return (
    <section className="w-full py-20 bg-white px-4">
      <div className="max-w-6xl mx-auto relative mb-24">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-[95%] h-24 bg-[#4B4D52] rounded-t-3xl -z-10 shadow-lg"></div>

        {AboutContent.map((content, index) => (
          <div
            key={index}
            className="bg-[#9DA0A4] rounded-2xl p-10 md:p-16 flex flex-col md:flex-row items-center gap-10 shadow-2xl"
          >
            <div className="shrink-0">
              <div className="relative w-50 h-50 flex items-center justify-center">
                <div className="text-8xl transform hover:scale-110 transition-transform">
                   <img
                      src={x12}
                      alt="TelLinguan Logo"
                      className="h-38 md:h-42 w-auto cursor-pointer"
                    />
                </div>
              </div>
            </div>

            <div className="text-white mx-auto md:mx-10 max-w-3xl">
              <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-center">
                {content.title}
              </h2>
              <p className="text-lg md:text-xl leading-relaxed font-medium text-gray-100">
                {content.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* STAKEHOLDERS SECTION */}
      <div className="w-full max-w-285 mx-auto mt-32">
        <h2 className="text-4xl md:text-5xl font-bold text-left leading-tight md:leading-snug bg-linear-to-r from-red-600 to-red-800 bg-clip-text text-transparent pb-2 mb-12">
          Project Stakeholders
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card name="Indi Viska Rahmasari" number="1101223028" role="Front-end Developer" />
          <Card name="M. Faturohman Tohiri" number="1101222048" role="Machine Learning" />
          <Card name="Dihyatul Qalbi Syamsur" number="1101223391" role="Back-end Developer" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto">
          <Card name="Favian Dewanta" number="15870022" role="Supervisor 1" />
          <Card name="Retno Hendriyanti" number="99740041" role="Supervisor 2" />
        </div>

        <div className="flex justify-center mt-12">
          <div className="w-full md:w-1/3">
            <Card name="LAC Telkom University" role="Partner" />
          </div>
        </div>
      </div>
    </section>
  );
};

const Card = ({ name, number, role }) => {
  return (
    <div className="bg-white shadow-lg border border-gray-100 rounded-2xl p-8 text-center hover:-translate-y-2 transition-all duration-300">
      <h3 className="font-bold text-xl text-gray-800">{name}</h3>
      <h3 className="text-gray-500 font-medium">{number}</h3>
      <div className="w-12 h-1 bg-red-600 mx-auto my-4 rounded-full"></div>
      <p className="text-gray-500 font-medium">{role}</p>
    </div>
  );
};

export default About;