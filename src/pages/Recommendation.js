import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Recommendation.css";

// Images
import wbjeeImg from "../assets/wbjee.png";
import jeeMainImg from "../assets/jee main.png";
import jeeAdvancedImg from "../assets/jee advanced.png";
import neetImg from "../assets/neet.png";
import sscImg from "../assets/ssc.png";
import cglImg from "../assets/cgl.png";
import cuetImg from "../assets/cuet.jpg";
import gateImg from "../assets/gate.avif";

// Exam data with official links
const recommendedExams = [
  {
    title: "WBJEE",
    image: wbjeeImg,
    tests: ["Math Mock Test", "Physics Mock Test", "Chemistry Mock Test"],
    rating: 4.5,
    description: "West Bengal Joint Entrance for engineering aspirants in the state.",
    link: "https://wbjeeb.nic.in",
  },
  {
    title: "JEE Main",
    image: jeeMainImg,
    tests: ["Math Advanced Mock", "Physics Advanced Mock", "Chemistry Advanced Mock"],
    rating: 4.8,
    description: "National-level entrance for undergraduate engineering programs.",
    link: "https://jeemain.nta.nic.in",
  },
  {
    title: "JEE Advanced",
    image: jeeAdvancedImg,
    tests: ["Math Advanced Level", "Physics Advanced Level", "Chemistry Advanced Level"],
    rating: 4.7,
    description: "Top-tier exam for entry into IITs, taken after JEE Main.",
    link: "https://jeeadv.ac.in",
  },
  {
    title: "NEET",
    image: neetImg,
    tests: ["Biology Mock Test", "Physics Mock Test", "Chemistry Mock Test"],
    rating: 4.6,
    description: "Medical entrance exam for MBBS/BDS courses across India.",
    link: "https://neet.nta.nic.in",
  },
  {
    title: "SSC",
    image: sscImg,
    tests: ["English Mock Test", "GK Mock Test", "Quantitative Aptitude Mock Test"],
    rating: 4.4,
    description: "Staff Selection Commission exam for various government posts.",
    link: "https://ssc.nic.in",
  },
  {
    title: "CGL",
    image: cglImg,
    tests: ["Quantitative Aptitude", "Reasoning", "General Awareness"],
    rating: 4.3,
    description: "Combined Graduate Level exam for Group B & C posts.",
    link: "https://ssc.nic.in",
  },
  {
    title: "CUET",
    image: cuetImg,
    tests: ["English", "Math", "Domain Subjects"],
    rating: 4.2,
    description: "Entrance exam for central universities in India for UG programs.",
    link: "https://cuet.samarth.ac.in",
  },
  {
    title: "GATE",
    image: gateImg,
    tests: ["Aptitude", "Core Subject", "Engineering Mathematics"],
    rating: 4.6,
    description: "Graduate Aptitude Test in Engineering for PG and PSU jobs.",
    link: "https://gate.iitkgp.ac.in",
  },
];

const Recommendation = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleStartTest = (examTitle) => {
    navigate("/conduct-exam", { state: { examTitle } });
  };

  const handleExploreMore = (url) => {
    window.open(url, "_blank");
  };

  const filteredExams = recommendedExams.filter((exam) =>
    exam.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="recommendation-container">
      <h1>Unlock Your Full Potential!</h1>
      <h4>Prepare like a pro with these handpicked mock tests designed to boost your confidence!</h4>

      <input
        type="text"
        placeholder="🔍 Search exam..."
        className="search-bar"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="exams-container">
        {filteredExams.map((exam, index) => (
          <div key={index} className="flip-card">
            <div className="flip-inner">
              <div className="exam-front">
                <img src={exam.image} alt={exam.title} className="exam-image" />
                <h3>{exam.title}</h3>
                <ul>
                  {exam.tests.map((test, i) => (
                    <li key={i}>{test}</li>
                  ))}
                </ul>
                <div className="star-rating">⭐ {exam.rating}</div>
                <button onClick={() => handleStartTest(exam.title)} className="start-btn">
                  Start Test
                </button>
              </div>

              <div className="exam-back">
                <h3>{exam.title}</h3>
                <p>{exam.description}</p>
                <div className="button-row">
                  <button
                    className="cta-button explore-btn"
                    onClick={() => handleExploreMore(exam.link)}
                  >
                    Explore More
                  </button>
                  <button
                    className="start-btn"
                    onClick={() => handleStartTest(exam.title)}
                  >
                    Start Test
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendation;
