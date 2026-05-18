import React from "react";
import { Link } from "react-router-dom";

const Achiev = () => {
  const levelDescriptions = [
    {
      level: "EPRT® Level 1",
      description: `Setelah menyelesaikan program pada level ini, peserta mampu:
        1. menggunakan frasa dan ekspresi dalam percakapan terkait kebutuhan sehari-hari;
        2. menggunakan bentuk kata kerja "past" dengan tepat dan menyusun kata-kata dalam kalimat sederhana dalam konteks yang sederhana, dan
        3. mengidentifikasi ide/gagasan pokok dalam teks dengan konteks sehari-hari dan akrab.`,
    },
    {
      level: "EPRT® Level 2",
      description: `Setelah menyelesaikan program pada level ini, peserta mampu:
        1. menggunakan frasa dan ekspresi dalam percakapan terkait kebutuhan sehari-hari;
        2. menggunakan bentuk kata kerja "past" dengan tepat dan menyusun kata-kata dalam kalimat majemuk sederhana dalam konteks yang sederhana, dan
        3. mengidentifikasi informasi spesifik dalam teks dengan konteks sehari-hari dan akrab.`,
    },
    {
      level: "EPRT® Level 3",
      description: `Setelah menyelesaikan program pada level ini, peserta mampu:
        1. menggunakan frasa dan ekspresi dalam percakapan terkait kebutuhan sehari-hari;
        2. menggunakan bentuk kata kerja "future" dengan tepat dan menyusun kata-kata dalam kalimat majemuk sederhana dalam konteks yang sederhana, dan
        3. mengidentifikasi informasi rinci dalam teks dengan konteks sehari-hari dan akrab.`,
    },
    {
      level: "EPRT® Level 4",
      description: `Setelah menyelesaikan program pada level ini, peserta mampu:
        1. menggunakan frasa dan ekspresi yang akrab dalam percakapan dalam konteks akademik;
        2. menyimpulkan makna dari kosakata dalam konteks sederhana, dan
        3. menggunakan kata kerja yang tepat sesuai dengan tenses umum yang digunakan (present, past, future) dan menyusun klausa atau kalimat.`,
    },
    {
      level: "EPRT® Level 5",
      description: `Setelah menyelesaikan program pada level ini, peserta mampu:
        1. menggunakan frasa dan ekspresi yang akrab dalam percakapan dalam konteks akademik;
        2. menyimpulkan makna dari kosakata berdasarkan konteks yang diberikan;
        3. menggunakan kata kerja yang tepat sesuai tenses umum yang digunakan – termasuk bentuk pasif – dan
        4. menyusun klausa atau kalimat menggunakan infinitives, gerunds dan klausa "that" secara efektif.`,
    },
  ];

  return (
    <>
      <section className="w-full max-w-275 mx-auto mt-32">
        <h2 className="text-4xl md:text-5xl font-bold text-center leading-tight md:leading-snug bg-linear-to-r from-red-600 to-red-800 bg-clip-text text-transparent pb-2">
          Ready to grow?
        </h2>

        <p className="text-2xl text-center font-semibold mb-16">
          Discover the personalized learning journey designed based on your placement results.
        </p>

        {levelDescriptions.map((level, index) => (
          <div
            key={index}
            className="rounded-2xl shadow-md bg-linear-to-r from-gray-100 to-gray-300 p-6 mb-8 over:shadow-lg transition-shadow"
          >
            <h3 className="text-center font-semibold text-xl mb-4">
              {level.level}
            </h3>

            <p className="text-base whitespace-pre-line">
              {level.description}
            </p>
          </div>
        ))}
      </section>

      {/* ALUR PENDAFTARAN */}
      <section className="w-full max-w-275 mx-auto mt-32">
        <h2 className="text-4xl md:text-5xl font-bold text-center leading-tight md:leading-snug bg-linear-to-r from-red-600 to-red-800 bg-clip-text text-transparent pb-2">
          Alur Pendaftaran
        </h2>

        <div className="space-y-4 text-lg">
          <p>1. Mengisi formulir pendaftaran sebelum melakukan Placement Test.</p>
          <p>2. Melakukan Personal Analysis untuk menentukan jadwal pembelajaran.</p>
          <p>3. Melakukan Placement Test di{" "}
            <Link
              to="/Placement"
              className="text-red-600 font-semibold underline hover:text-red-800"
            >
              Placement Test
            </Link>.
          </p>
          <p>
            4. Mulai perjalanan belajarmu dengan menjadi subscriber dan mengikuti panduan yang tersedia.
          </p>
          <p>5. Mengikuti kursus sesuai jadwal yang telah dipilih.</p>
        </div>

        <div className="rounded-2xl bg-linear-to-r from-red-600 to-red-800 p-8 mt-12">
          <p className="font-bold text-white text-xl text-center">
            “Daftar sekarang dan nikmati pengalaman belajar yang fleksibel!
            Personal analysis akan membantu menyusun jadwal yang paling cocok
            dengan rutinitasmu.”
          </p>
        </div>
      </section>
    </>
  );
};

export default Achiev;