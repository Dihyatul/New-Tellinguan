import React, { useState, useMemo } from "react";
import { shuffleOptions } from "../utils/shuffleOptions";

const Reading = ({ data, onNext, isLast }) => {
    const [currentPara, setCurrentPara] = useState(0);
    const [selected, setSelected] = useState(null);
    const options = useMemo(() => shuffleOptions(data.options), [data.id]);

    const passages = data.passages || [];
    const totalPara = passages.length;

    const nextPara = () => {
        if (currentPara < totalPara - 1) {
            setCurrentPara(prev => prev + 1);
        }
    };

    const prevPara = () => {
        if (currentPara > 0) {
            setCurrentPara(prev => prev - 1);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto min-h-100 flex flex-col justify-between">

            {/* CONTENT */}
            <div className="grid md:grid-cols-2 gap-6 items-start">

                {/* LEFT: Passage */}
                <div className="border-2 border-red-700 rounded-xl p-4 h-80 flex flex-col justify-between">
                    
                    {/* Paragraph */}
                    <div className="overflow-y-auto">
                        <p className="text-sm leading-relaxed">
                            {passages[currentPara]}
                        </p>
                    </div>

                    {/* Navigation paragraf */}
                    <div className="flex items-center justify-between mt-4">
                        <button
                            onClick={prevPara}
                            disabled={currentPara === 0}
                            className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Prev
                        </button>

                        <span className="text-sm">
                            Paragraf {currentPara + 1} / {totalPara}
                        </span>

                        <button
                            onClick={nextPara}
                            disabled={currentPara === totalPara - 1}
                            className="px-4 py-1 bg-red-700 text-white rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>

                {/* RIGHT: Question */}
                <div>
                    <h2 className="mb-4 font-semibold text-left">
                        {data.question}
                    </h2>

                    <div className="space-y-3">
                        {options.map((opt, i) => (
                            <label key={i} className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    name="answer"
                                    checked={selected === i}
                                    onChange={() => setSelected(i)}
                                />
                                {opt.text}
                            </label>
                        ))}
                    </div>
                </div>

            </div>

            {/* BUTTON (SELALU DI BAWAH) */}
            <div className="w-full flex justify-end mt-6">
                <button
                    onClick={() => onNext(selected === null ? null : options[selected].originalIndex)}
                    disabled={selected === null}
                    className="bg-red-700 hover:bg-red-800 disabled:bg-gray-400 text-white px-8 py-4 rounded-xl font-semibold transition"
                >
                    {isLast ? "Finish" : "Next"}
                </button>
            </div>

        </div>
    );
};

export default Reading;