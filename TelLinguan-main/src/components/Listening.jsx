import React, { useState } from "react";

const Listening = ({ data, onNext, isLast }) => {
    const [selected, setSelected] = useState(null);

    return (
        <div className="w-full max-w-5xl mx-auto min-h-100 flex flex-col justify-between">

            {/* AUDIO */}
            <div>
                <div className="bg-gray-200 p-4 rounded-lg mb-6">
                    <audio controls className="w-full">
                        <source src={data.audio} type="audio/mpeg" />
                    </audio>
                </div>

                {/* QUESTION */}
                <h2 className="mb-4 font-semibold text-left">
                    {data.question}
                </h2>

                {/* OPTIONS */}
                <div className="space-y-3">
                    {data.options.map((opt, i) => (
                        <label key={i} className="flex items-center gap-3">
                            <input
                                type="radio"
                                name="answer"
                                checked={selected === i}
                                onChange={() => setSelected(i)}
                            />
                            {opt}
                        </label>
                    ))}
                </div>
            </div>

            {/* BUTTON */}
            <div className="w-full flex justify-end mt-6">
                <button
                    onClick={() => onNext(selected)}
                    disabled={selected === null}
                    className="bg-red-700 hover:bg-red-800 disabled:bg-gray-400 text-white px-8 py-4 rounded-xl font-semibold transition"
                >
                    {isLast ? "Finish" : "Next"}
                </button>
            </div>

        </div>
    );
};

export default Listening;