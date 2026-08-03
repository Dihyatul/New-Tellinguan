import React, { useState, useEffect } from "react";
import { API_URL } from "../config.js";
import { useNavigate } from "react-router-dom";
import Grammar from "./Grammar";
import Listening from "./Listening";
import Reading from "./Reading";

const Test = () => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ================= TIMER =================
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 menit

  // ================= FETCH QUESTIONS =================
  useEffect(() => {
    const fetchQuestions = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_URL}/api/questions`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setError("Failed to load questions.");
          return;
        }

        const data = await res.json();
        const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
        const pick = (type) => shuffle(data.filter((q) => q.type === type)).slice(0, 10);
        const ordered = [...pick("listening"), ...pick("grammar"), ...pick("reading")];
        setQuestions(ordered);
      } catch (err) {
        setError("Cannot connect to server.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // ================= AUTO TIMER =================
  useEffect(() => {
    if (loading || submitting) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading, submitting]);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  // ================= FORMAT TIMER =================
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  // ================= SAVE ANSWER =================
  // Returns the updated array immediately (not just via state) so a
  // same-tick submit (last question) doesn't read stale `answers`.
  const handleAnswer = (questionId, selected) => {
    const existing = answers.findIndex((a) => a.questionId === questionId);
    let updated;

    if (existing !== -1) {
      updated = [...answers];
      updated[existing] = { questionId, selected };
    } else {
      updated = [...answers, { questionId, selected }];
    }

    setAnswers(updated);
    return updated;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (answersToSubmit = answers) => {
    if (submitting) return;

    setSubmitting(true);

    const token = localStorage.getItem("token");

    const savedAnalysis =
      JSON.parse(localStorage.getItem("analysis")) || {
        goal: "Improve EPrT score",
        duration: "2 hours/day",
        days: ["Monday", "Wednesday", "Friday"],
        time: "Night",
      };

    try {
      const res = await fetch(`${API_URL}/api/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers: answersToSubmit, analysis: savedAnalysis }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Submit failed.");
        return;
      }

      alert("Test submitted successfully!");

      navigate("/Hasil");
    } catch (err) {
      alert("Cannot connect to server.");
    } finally {
      setSubmitting(false);
    }
  };

  // ================= NEXT QUESTION =================
  const handleNext = (selected) => {
    const updatedAnswers =
      selected !== null && selected !== undefined
        ? handleAnswer(currentQuestion.id, selected)
        : answers;

    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleSubmit(updatedAnswers);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading questions...</p>
      </div>
    );
  }

  // ================= ERROR =================
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // ================= RENDER QUESTION =================
  const renderQuestion = () => {
    if (!currentQuestion) return <p>No question available.</p>;

    const props = {
      data: currentQuestion,
      onNext: handleNext,
      isLast: isLastQuestion,
    };

    switch (currentQuestion.type) {
      case "grammar": return <Grammar key={currentIndex} {...props} />;
      case "listening": return <Listening key={currentIndex} {...props} />;
      case "reading": return <Reading key={currentIndex} {...props} />;
      default: return null;
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">

      {/* Background */}
      <div className="absolute -top-72 w-[150%] h-175 rounded-[50%] bg-linear-to-br from-[#871117] to-[#ED1E28]" />

      <div className="relative z-10 w-full flex justify-center">

        {/* CARD WRAPPER */}
        <div className="w-[90vw] max-w-291.25 aspect-1165/619 bg-linear-to-r from-[#ED1E28] to-[#871117] p-1.5 rounded-3xl">


          <div className="relative bg-white rounded-3xl h-full w-full p-14 text-center shadow-xl flex flex-col justify-center items-center">

            <div className="absolute top-6 left-6 w-12 h-12 bg-gray-200 shadow-md rounded-full flex items-center justify-center font-bold text-red-700">
              {currentIndex + 1}
            </div>

            {/* Timer */}
            <div
              className={`absolute top-6 right-6 px-5 py-2 rounded-full shadow-lg font-semibold text-lg transition-all duration-300 ${timeLeft <= 60
                  ? "bg-red-700 text-white animate-pulse"
                  : "bg-red-600 text-white"
                }`}
            >
              {minutes}:{seconds}
            </div>

            {/* Progress */}
            <div className="w-full mb-8 mt-8">
              <p className="text-left text-gray-600 font-medium mb-2">
                Question {currentIndex + 1} of {questions.length}
              </p>

              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-600 transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / questions.length) * 100
                      }%`,
                  }}
                />
              </div>
            </div>

            {/* Question Component */}
            {renderQuestion()}

            {/* Submitting */}
            {submitting && (
              <div className="mt-4 text-red-600 font-semibold">
                Submitting...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;