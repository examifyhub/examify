import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import "../styles/Dashboard.css";
import studentImg from "../assets/student-profile.png";

// ✅ Register Chart Elements
ChartJS.register(ArcElement, Tooltip, Legend);

// ✅ Define `examData`
const examData = [
  {
    title: "WBJEE",
    image: "https://source.unsplash.com/300x200/?math,physics",
    subjects: ["Math", "Physics", "Chemistry"],
    subjectScores: [35, 40, 25],
    colors: ["#ff6384", "#36a2eb", "#ffce56"],
  },
  {
    title: "JEE Main",
    image: "https://source.unsplash.com/300x200/?engineering,study",
    subjects: ["Math", "Physics", "Chemistry"],
    subjectScores: [40, 35, 25],
    colors: ["#4bc0c0", "#ff9f40", "#9966ff"],
  },
];

// ✅ Define `studentExams`
const studentExams = ["JEE Main", "WBJEE"];

const Dashboard = () => {
  const filteredExams = examData.filter((exam) =>
    studentExams.includes(exam.title)
  );

  return (
    <div className="dashboard-container">
      {/* ✅ Student Info Section */}
      <div className="student-info">
        <img src={studentImg} alt="Student" className="student-img" />
        <div className="student-details">
          <h2 className="student-name">John Doe</h2>
          <p>Email: <span>johndoe@example.com</span></p>
          <p>Exam ID: <span>EXM12345</span></p>
          <p>Last Attempted Exam: <span>JEE Mains</span></p>
        </div>
      </div>

      {/* ✅ Pie Charts for Each Exam */}
      <div className="chart-section">
        <h2>Exam Subject Distribution</h2>
        <div className="chart-list">
          {filteredExams.map((exam, index) => (
            <div key={index} className="chart-card">
              <h3>{exam.title}</h3>
              <Pie
                data={{
                  labels: exam.subjects,
                  datasets: [
                    {
                      data: exam.subjectScores,
                      backgroundColor: exam.colors,
                      hoverOffset: 10,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        font: {
                          size: 14,
                          weight: "bold",
                        },
                        color: "#444",
                      },
                    },
                  },
                }}
              />

              {/* ✅ Progress Bars for Subjects */}
              <div className="progress-bars">
                {exam.subjects.map((subject, subIndex) => (
                  <div key={subIndex} className="progress-container">
                    <span>{subject}</span>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${exam.subjectScores[subIndex]}%`,
                          backgroundColor: exam.colors[subIndex],
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
