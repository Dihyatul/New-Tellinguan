import React from 'react'
import x11 from '../assets/1 1.png'

const Hero = () => {
  return (
    <section
      className="w-full bg-linear-to-r from-red-600 to-red-800 py-16 md:py-15"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">

          {/* Text Content */}
          <div className="md:w-1/2 text-white">
            <h1
              id="hero-heading"
              className="text-3xl md:text-4xl font-bold leading-tight mb-6"
            >
              Tingkatkan kemampuan bahasa Inggrismu dengan program yang dirancang lebih personal!
            </h1>

            <p className="text-lg md:text-xl leading-relaxed text-red-100">
              Website ini menyediakan placement test untuk menentukan level kemampuanmu secara akurat. 
              Berdasarkan hasil tersebut, kamu akan mendapatkan course yang disesuaikan dengan levelmu, 
              sehingga proses belajar jadi lebih efektif dan terarah. <br />
              <br />
              Selain itu, sistem juga menggunakan Course Time Analysis Results dari masing-masing individu 
              untuk menyesuaikan durasi dan strategi pembelajaran. Dengan pendekatan ini, setiap peserta 
              mendapatkan pengalaman belajar yang benar-benar personal, adaptif, dan optimal sesuai kebutuhan mereka.
            </p>
          </div>

          {/* Image */}
          <div className="md:w-1/2 flex justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <img
                src={x11}
                alt="EPrT Course Illustration"
                className="w-full max-w-sm h-auto"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Hero
