import React from "react";
import "../styles/Recommendation.css";

// ✅ Import images correctly
import wbjeeImg from "../assets/wbjee.png";
import jeeMainImg from "../assets/jee main.png";
import jeeAdvancedImg from "../assets/jee advanced.png";
import neetImg from "../assets/neet.png";
import sscImg from "../assets/ssc.png";
import cglImg from "../assets/cgl.png";

const recommendedExams = [
  {
    title: "WBJEE",
    image: wbjeeImg,
    tests: ["Math Mock Test", "Physics Mock Test", "Chemistry Mock Test"],
  },
  {
    title: "JEE Main",
    image: jeeMainImg,
    tests: ["Math Advanced Mock", "Physics Advanced Mock", "Chemistry Advanced Mock"],
  },
  {
    title: "JEE Advanced",
    image: jeeAdvancedImg,
    tests: ["Math Advanced Level", "Physics Advanced Level", "Chemistry Advanced Level"],
  },
  {
    title: "NEET",
    image: neetImg,
    tests: ["Biology Mock Test", "Physics Mock Test", "Chemistry Mock Test"],
  },
  {
    title: "SSC",
    image: sscImg,
    tests: ["English Mock Test", "General Knowledge Mock Test", "Quantitative Aptitude Mock Test"],
  },
  {
    title: "CGL",
    image: cglImg,
    tests: ["Quantitative Aptitude Mock", "Reasoning Mock", "General Awareness Mock"],
  },
];

function Recommendation() {
  return (
    <div className="recommendation-container">
      <h1>Unlock Your Full Potential!</h1>
      <h4>Prepare like a pro with these handpicked mock tests designed to sharpen your skills and boost your confidence before the real exam!</h4>

      <div className="exams-container">
        {recommendedExams.map((exam, index) => (
          <div key={index} className="exam-box">
            <img src={exam.image} alt={exam.title} className="exam-image"/>
            <h3>{exam.title}</h3>
            <ul>
              {exam.tests.map((test, i) => (
                <li key={i}>{test}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recommendation;
