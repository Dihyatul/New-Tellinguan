import React from 'react'

const Skors = () => {
  const tableData = [
    {
      level: "CEFR A1",
      score: "0-7 / 30",
      description: [
        "● Can understand and use familiar everyday expressions and very basic phrases.",
        "● Can introduce yourself and ask/answer questions about personal details.",
        "● Can interact in a simple way if the other person talks slowly and clearly.",
      ],
    },
    {
      level: "CEFR A2",
      score: "8-15 / 30",
      description: [
        "● Can understand sentences and frequently used expressions related to immediate needs.",
        "● Can communicate in simple routine tasks and describe in simple terms aspects of your background.",
        "● Can handle short social exchanges and basic directions.",
      ],
    },
    {
      level: "CEFR B1",
      score: "16-22 / 30",
      description: [
        "● Can understand the main points of clear standard input on familiar matters.",
        "● Can deal with most situations likely to arise while traveling.",
        "● Can produce simple connected text on familiar topics and describe experiences.",
      ],
    },
    {
      level: "CEFR B2",
      score: "23-30 / 30",
      description: [
        "● Can understand the main ideas of complex text on both concrete and abstract topics.",
        "● Can interact with a degree of fluency and spontaneity without much strain.",
        "● Can produce clear, detailed text on a wide range of subjects.",
      ],
    },
  ];

  return (
    <section className="w-full max-w-275 mx-auto mt-32">
      {/* Heading */}
      <h2 className="text-4xl md:text-5xl font-bold text-center leading-tight md:leading-snug bg-linear-to-r from-red-600 to-red-800 bg-clip-text text-transparent pb-2">
        Placement Results: Your CEFR Level
      </h2>

      <p className="text-2xl text-center font-semibold mb-16">
        Don&apos;t worry about choosing a level! <br />
        After the placement test, we&apos;ll guide you to the level that matches your current skills.
      </p>

      {/* Table */}
      <div className="border border-[#b9b9b9] rounded overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[150px_250px_1fr] bg-white font-medium text-lg border-b border-[#b9b9b9]">
          <div className="p-4 border-r border-[#b9b9b9]">Level</div>
          <div className="p-4 border-r border-[#b9b9b9] text-center">
            Skor Placement Tes
          </div>
          <div className="p-4">Deskripsi Kompetensi</div>
        </div>

        {/* Rows */}
        {tableData.map((row, index) => (
          <div
            key={index}
            className={`grid grid-cols-[150px_250px_1fr] border-b border-[#b9b9b9] ${
              index % 2 === 0 ? "bg-[#ececec]" : "bg-white"
            }`}
          >
            <div className="p-4 border-r border-[#b9b9b9]">
              {row.level}
            </div>

            <div className="p-4 border-r border-[#b9b9b9] text-center">
              {row.score}
            </div>

            <div className="p-4">
              {row.description.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Skors
