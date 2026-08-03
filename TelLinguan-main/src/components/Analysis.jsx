import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveAnalysisAPI } from "../api/analysis";

import icon1 from "../assets/eprt.png";
import icon2 from "../assets/simulasi.png";
import icon3 from "../assets/kampus.png";
import icon4 from "../assets/strategi.png";
import listeningImg from "../assets/1.1.png";
import writingImg from "../assets/3.3.png";
import readingImg from "../assets/2.2.png";
import speakingImg from "../assets/4.4.png";
import morningIcon from "../assets/sun.png";
import afternoonIcon from "../assets/sunrise.png";
import eveningIcon from "../assets/sunset.png";
import nightIcon from "../assets/moon.png";

const steps = ["Goal", "Time", "Schedule", "Speed", "Result"];

const Analysis = () => {
  const [step, setStep] = useState(0);
  const [animatedStep, setAnimatedStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setAnimatedStep(step + 1);
    }, 100);
  }, []);

  // STATE
  const [goalsSelected, setGoalsSelected] = useState([]);
  const [daysSelected, setDaysSelected] = useState([]);
  const [timesSelected, setTimesSelected] = useState([]);
  const minuteOptions = [
    0, 1, 2, 3, 5,
    10, 15, 20, 25, 30,
    35, 40, 45, 50, 55,
    60, 65, 70, 75, 80,
    85, 90, 95, 100, 105,
    110, 115, 120
  ];
  const [minutesIndex, setMinutesIndex] = useState(0);
  const [weeks, setWeeks] = useState(1);
  const minutes = minuteOptions[minutesIndex];
  const [speed, setSpeed] = useState("");

  const toggleGoal = (text) => {
    if (goalsSelected.includes(text)) {
      setGoalsSelected(goalsSelected.filter((g) => g !== text));
    } else {
      setGoalsSelected([...goalsSelected, text]);
    }
  };

  const toggleDay = (d) => {
    if (daysSelected.includes(d)) {
      setDaysSelected(daysSelected.filter((item) => item !== d));
    } else {
      setDaysSelected([...daysSelected, d]);
    }
  };

  const toggleTime = (t) => {
    if (timesSelected.includes(t.label)) {
      setTimesSelected(timesSelected.filter((item) => item !== t.label));
    } else {
      setTimesSelected([...timesSelected, t.label]);
    }
  };

  // DATA
  const goals = [
    { text: "Meningkatkan Skor EPRT", icon: icon1 },
    { text: "Berlatih Simulasi Tes dan Time Management", icon: icon2 },
    { text: "Persiapan Khusus untuk Kebutuhan Kampus / Kelulusan", icon: icon3 },
    { text: "Menguatkan Strategi Pengerjaan Tes EPrT", icon: icon4 },
  ];

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const times = [
    {
      label: "Morning",
      range: "07.00 - 11.00",
      icon: morningIcon,
    },
    {
      label: "Afternoon",
      range: "11.00 - 15.00",
      icon: afternoonIcon,
    },
    {
      label: "Evening",
      range: "15.00 - 19.00",
      icon: eveningIcon,
    },
    {
      label: "Night",
      range: "19.00 - 23.00",
      icon: nightIcon,
    },
  ];

  const speedOptions = [
    {
      title: "Relax",
      desc: "Study at a relaxed pace",
    },
    {
      title: "Moderate",
      desc: "A balance between studying and resting",
    },
    {
      title: "Intensive",
      desc: "Study with maximum focus",
    },
  ];

  const cards = [
    { img: listeningImg },
    { img: writingImg },
    { img: readingImg },
    { img: speakingImg },
  ];

  // NEXT
  const next = async () => {
    if (step === 0 && goalsSelected.length === 0) {
      alert("Pilih minimal 1 goal dulu!");
      return;
    } else if (step === 1 && (daysSelected.length < 2 || timesSelected.length === 0)) {
      alert("Pilih minimal 2 hari dan 1 waktu!");
      return;
    } else if (step === 3 && !speed) {
      alert("Pilih salah satu learning speed!");
      return;
    }

    if (step < steps.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      setAnimatedStep(nextStep + 1);
    } else {
      const analysisData = {
        goals: goalsSelected,
        days: daysSelected,
        times: timesSelected,
        hours: minutes === 0 ? 0 : Math.max(1, Math.round(minutes / 60)),
        weeks,
        speed,
      };

      // Save to localStorage for Test.jsx
      localStorage.setItem(
        "analysis",
        JSON.stringify({
          goal: goalsSelected[0] || "",
          duration: `${minutes} minutes/day`,
          days: daysSelected,
          time: timesSelected[0] || "",
        })
      );

      // Save to backend
      await saveAnalysisAPI(analysisData);

      navigate("/IntroPlacement");
    }
  };

  return (
    <section className="relative min-h-150 flex flex-col items-center justify-center px-6 bg-white overflow-hidden">
      <div className="absolute -left-60 top-1/2 -translate-y-1/2 w-96 h-60 bg-[#B6252A] opacity-50 blur-[50px] rounded-full"></div>
      <div className="absolute -right-60 top-1/2 -translate-y-1/2 w-96 h-60 bg-[#B6252A] opacity-50 blur-[50px] rounded-full"></div>

      {/* PROGRESS */}
      <div className="w-full max-w-xl mb-8 z-10">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span className="font-medium">
            Analysis {step + 1} of {steps.length}
          </span>
          <span>
            {Math.round(((step + 1) / steps.length) * 100)}%
          </span>
        </div>

        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-[#ED1E28] to-[#B6252A] rounded-full transition-[width] duration-700 ease-out"
            style={{ width: `${(animatedStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className="w-full max-w-xl">

        {/* STEP 1 */}
        {step === 0 && (
          <>
            <h1 className="text-2xl font-bold text-red-700 mb-6 text-left">
              What is your goal in learning EPrT using this platform?
            </h1>

            <div className="space-y-3">
              {goals.map((g, i) => {
                const selected = goalsSelected.includes(g.text);

                return (
                  <button
                    key={i}
                    onClick={() => toggleGoal(g.text)}
                    className={`w-full flex items-center justify-between p-3 rounded border transition ${selected
                      ? "bg-gray-200 border-red-500"
                      : "bg-gray-100"
                      }`}
                  >
                    {/* LEFT */}
                    <div className="flex items-center gap-3">
                      <img src={g.icon} className="w-7 h-7" />
                      <span className="text-sm md:text-base">
                        {g.text}
                      </span>
                    </div>

                    {/* RIGHT CHECKBOX */}
                    <div
                      className={`w-5 h-5 border rounded flex items-center justify-center ${selected
                        ? "bg-red-600 border-red-600"
                        : "bg-white"
                        }`}
                    ></div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* STEP 2 */}
        {step === 1 && (
          <>
            <h1 className="text-2xl font-bold text-red-700 mb-6 text-left">
              How much time would you like to spend on this course?
            </h1>

            {/* DAYS */}
            <div className="flex flex-wrap gap-2 mb-6">
              {days.map((d) => {
                const selected = daysSelected.includes(d);

                return (
                  <button
                    key={d}
                    onClick={() => toggleDay(d)}
                    className={`px-4 py-2 border rounded-lg transition ${selected ? "bg-red-100 border-red-500" : "bg-gray-100"
                      }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>

            {/* TIMES */}
            <div className="grid grid-cols-2 gap-3">
              {times.map((t) => {
                const selected = timesSelected.includes(t.label);

                return (
                  <button
                    key={t.label}
                    onClick={() => toggleTime(t)}
                    className={`flex items-center gap-3 p-3 border rounded-xl transition ${selected
                      ? "bg-red-100 border-red-500"
                      : "bg-gray-100"
                      }`}
                  >
                    <img src={t.icon} className="w-6 h-6" />

                    <div className="text-left">
                      <p className="font-medium">{t.label}</p>
                      <p className="text-xs text-gray-500">{t.range}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 2 && (
          <>
            <h1 className="text-2xl font-bold text-red-700 mb-6 text-left">
              How many minutes can you dedicate to learning each day?
            </h1>

            <label className="block mb-4">
              Study Time: {minutes} min/day

              <input
                type="range"
                min="0"
                max={minuteOptions.length - 1}
                value={minutesIndex}
                onChange={(e) => setMinutesIndex(Number(e.target.value))}
                className="w-full"
              />

              <div className="text-sm text-gray-500 mt-1">
                Selected: {minutes} minutes
              </div>
            </label>

            <label className="block">
              Duration: {weeks} weeks

              <input
                type="range"
                min="1"
                max="20"
                value={weeks}
                onChange={(e) => setWeeks(Number(e.target.value))}
                className="w-full"
              />
            </label>
          </>
        )}

        {/* STEP 4 */}
        {step === 3 && (
          <>
            <h1 className="text-2xl font-bold text-red-700 mb-2 text-left">
              What's your preferred study schedule?
            </h1>

            <p className="mb-4 text-gray-600">
              Learning Speed
            </p>

            <div className="space-y-3">
              {speedOptions.map((item) => {
                const selected = speed === item.title;

                return (
                  <button
                    key={item.title}
                    onClick={() => setSpeed(item.title)}
                    className={`w-full flex items-center justify-between p-4 rounded-lg border transition ${selected
                      ? "bg-gray-200 border-red-500"
                      : "bg-gray-100"
                      }`}
                  >
                    {/* LEFT TEXT */}
                    <div className="text-left">
                      <span className="font-semibold mr-2">
                        {item.title}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {item.desc}
                      </span>
                    </div>

                    {/* RIGHT CHECKBOX */}
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center ${selected
                        ? "bg-red-600 border-red-600"
                        : "bg-white"
                        }`}
                    />
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* STEP 5 (RESULT) */}
        {step === 4 && (
          <>
            <h1 className="text-3xl font-bold text-red-700 text-left mb-6">
              Analyze Data
            </h1>

            <div className="grid grid-cols-2 gap-4 place-items-center mb-6">
              {cards.map((c, i) => (
                <img
                  key={i}
                  src={c.img}
                  alt=""
                  className="w-32 md:w-60 hover:scale-110 transition"
                />
              ))}
            </div>
          </>
        )}

        {/* BUTTON */}
        <button
          onClick={next}
          className="mt-8 w-full bg-red-600 text-white py-3 rounded hover:bg-red-700"
        >
          {step === steps.length - 1 ? "CONTINUE" : "Next"}
        </button>

      </div>
    </section>
  );
};

export default Analysis;