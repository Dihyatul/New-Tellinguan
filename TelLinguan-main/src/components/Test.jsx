import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const fetchQuestions = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:5000/api/questions/test", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setError("Failed to load questions.");
          return;
        }

        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        setError("Cannot connect to server.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleAnswer = (questionId, selected) => {
    setAnswers((prev) => {
      const existing = prev.findIndex((a) => a.questionId === questionId);
      if (existing !== -1) {
        const updated = [...prev];
        updated[existing] = { questionId, selected };
        return updated;
      }
      return [...prev, { questionId, selected }];
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const token = localStorage.getItem("token");

    // Retrieve analysis from localStorage (set by Analysis.jsx)
    const savedAnalysis = JSON.parse(localStorage.getItem("analysis")) || {
      goal: "Improve EPrT score",
      duration: "2 hours/day",
      days: ["Monday", "Wednesday", "Friday"],
      time: "Night",
    };

    try {
      const res = await fetch("http://localhost:5000/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers, analysis: savedAnalysis }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Submit failed.");
        return;
      }

      navigate("/Hasil");
    } catch (err) {
      alert("Cannot connect to server.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = (selected) => {
    if (selected !== null && selected !== undefined) {
      handleAnswer(currentQuestion.id, selected);
    }

    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const renderQuestion = () => {
    if (!currentQuestion) return <p>No question available.</p>;

    const props = {
      data: currentQuestion,
      onNext: handleNext,
      isLast: isLastQuestion,
    };

    switch (currentQuestion.type) {
      case "grammar":  return <Grammar key={currentQuestion.id} {...props} />;
      case "listening": return <Listening key={currentQuestion.id} {...props} />;
      case "reading":  return <Reading key={currentQuestion.id} {...props} />;
      default:         return null;
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">

      <div className="absolute -top-72 w-[150%] h-175 rounded-[50%] bg-linear-to-br from-[#871117] to-[#ED1E28]" />

      <div className="relative z-10 w-full flex justify-center">
        <div className="w-[90vw] max-w-291.25 aspect-1165/619 bg-linear-to-r from-[#ED1E28] to-[#871117] p-1.5 rounded-3xl">
          <div className="relative bg-white rounded-3xl h-full w-full p-14 text-center shadow-xl flex flex-col justify-center items-center">

            <div className="absolute top-6 left-6 w-12 h-12 bg-gray-200 shadow-md rounded-full flex items-center justify-center font-bold text-red-700">
              {currentIndex + 1}
            </div>

            <div className="w-full mb-8 mt-8">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600 font-medium">
                  Question {currentIndex + 1} of {questions.length}
                </p>
                <span className="text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full bg-red-100 text-red-700 capitalize">
                  {currentQuestion?.type} Section
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-600 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {renderQuestion()}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
