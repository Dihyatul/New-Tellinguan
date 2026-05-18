import React from 'react'

const Skors = () => {
  const tableData = [
    {
      level: "EPrT® Level 1",
      score: "370-399",
      description: [
        "● Can use phrases and expressions in dialogues related to daily needs.",
        "● Can use present verb form, and order the words in simple sentences in simple context.",
        "● Can identify the main idea in both very familiar and everyday context.",
      ],
    },
    {
      level: "EPrT® Level 2",
      score: "400-424",
      description: [
        "● Can use phrases and expressions in dialogues related to daily needs.",
        "● Can use the appropriate past verb form, and order the words in compound sentences in simple context.",
        "● Can identify some basic specific information in both very familiar and everyday context.",
      ],
    },
    {
      level: "EPrT® Level 3",
      score: "425-449",
      description: [
        "● Can use phrases and expressions in dialogues related to daily needs.",
        "● Can use the appropriate future verb form, passive form, and order the words in complex sentences in simple context.",
        "● Can identify some basic detail information in both very familiar and everyday context.",
      ],
    },
    {
      level: "EPrT® Level 4",
      score: "450-474",
      description: [
        "● Can use familiar phrases and expressions in dialogues in common academic setting.",
        "● Can infer meaning of vocabulary from simple context.",
        "● Can use appropriate verbs in common tenses (Present, past, future) and structure a sentence or clause.",
      ],
    },
    {
      level: "EPrT® Level 5",
      score: "475-499",
      description: [
        "● Can use familiar phrases and expressions in dialogues in some unfamiliar academic setting.",
        "● Can infer meaning of vocabulary from the given context.",
        '● Can use appropriate verbs in common tenses — including passive forms — as well as common linking verbs and expletives such as "there is."',
        '● Can structure a sentence or clause and use infinitives, gerunds and "that" clauses effectively.',
      ],
    },
  ];

  return (
    <section className="w-full max-w-275 mx-auto mt-32">
      {/* Heading */}
      <h2 className="text-4xl md:text-5xl font-bold text-center leading-tight md:leading-snug bg-linear-to-r from-red-600 to-red-800 bg-clip-text text-transparent pb-2">
        Placement Results: Your Learning Level
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
