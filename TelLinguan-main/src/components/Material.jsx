import { useState } from "react";
import listeningImg from "../assets/1.png";
import readingImg from "../assets/2.png";
import writingImg from "../assets/3.png";
import speakingImg from "../assets/4.png";

const skillTabs = [
  { id: "listening", label: "Listening" },
  { id: "reading", label: "Reading" },
  { id: "writing", label: "Writing" },
  { id: "speaking", label: "Speaking" },
];

const materialsContent = {
  listening: {
    title: "Cakupan Materi Listening",
    image: listeningImg,
    items: [
      "Ekspresi umum percakapan sehari-hari",
      "Sinonim dan makna tersirat",
      "Menentukan main idea",
      "Menangkap detail penting",
    ],
  },
  reading: {
    title: "Cakupan Materi Reading",
    image: readingImg,
    items: [
      "Identifikasi ide pokok",
      "Menentukan referensi kata",
      "Menyimpulkan teks",
      "Analisis detail informasi",
    ],
  },
  writing: {
    title: "Cakupan Materi Writing",
    image: writingImg,
    items: [
      "Struktur kalimat sederhana & kompleks",
      "Penggunaan tenses",
      "Passive & active voice",
      "Penggunaan conjunction",
    ],
  },
  speaking: {
    title: "Cakupan Materi Speaking",
    image: speakingImg,
    items: [
      "Pronunciation & intonation",
      "Daily conversation practice",
      "Academic discussion",
      "Fluency improvement",
    ],
  },
};

const Material = () => {
  const [activeTab, setActiveTab] = useState("listening");

  return (
    <section id="course" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-center leading-tight md:leading-snug bg-linear-to-r from-red-600 to-red-800 bg-clip-text text-transparent pb-2">
          What will you gain from this program?
        </h2>

        <p className="text-xl text-center font-semibold mb-10">
          Explore the key materials you’ll cover throughout this session.
        </p>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {skillTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg text-lg font-semibold transition ${
                activeTab === tab.id
                  ? "bg-red-600 text-white"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Card */}
        <div className="bg-white shadow-lg rounded-2xl p-10 grid md:grid-cols-2 gap-10 items-center">

          {/* Image */}
          <img
            src={materialsContent[activeTab].image}
            alt={materialsContent[activeTab].title}
            className="w-full max-w-md mx-auto"
          />

          {/* Text */}
          <div>
            <h3 className="text-2xl font-bold mb-6">
              {materialsContent[activeTab].title}
            </h3>

            <ul className="space-y-4">
              {materialsContent[activeTab].items.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-3 h-3 bg-red-600 rounded-full mt-2"></span>
                  <span className="text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Material;