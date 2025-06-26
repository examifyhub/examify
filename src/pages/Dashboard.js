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

ChartJS.register(ArcElement, Tooltip, Legend);

const examData = [
  {
    title: "WBJEE",
    subjects: ["Math", "Physics", "Chemistry"],
    subjectScores: [35, 40, 25],
    maxMarks: 50,
    colors: ["#ff6384", "#36a2eb", "#ffce56"],
  },
  {
    title: "JEE Main",
    subjects: ["Math", "Physics", "Chemistry"],
    subjectScores: [40, 35, 25],
    maxMarks: 50,
    colors: ["#4bc0c0", "#ff9f40", "#9966ff"],
  },
  {
    title: "JEE Advanced",
    subjects: ["Math", "Physics", "Chemistry"],
    subjectScores: [42, 38, 30],
    maxMarks: 50,
    colors: ["#8e44ad", "#2ecc71", "#f39c12"],
  },
];

const studentExams = ["JEE Main", "WBJEE", "JEE Advanced"];

const Dashboard = () => {
  const filteredExams = examData.filter((exam) =>
    studentExams.includes(exam.title)
  );

  return (
    <div className="dashboard-container">
      {/* ✅ Student Info */}
      <div className="student-info">
        <img src={studentImg} alt="Student" className="student-img" />
        <div className="student-details">
          <h2 className="student-name">John Doe</h2>
          <p>Email: <span>johndoe@example.com</span></p>
          <p>Exam ID: <span>EXM12345</span></p>
          <p>Last Attempted Exam: <span>JEE Advanced</span></p>
        </div>
      </div>

      {/* ✅ Exam Section */}
      <div className="chart-section">
        <h2>📊 Exam Performance Summary</h2>
        <div className="chart-list">
          {filteredExams.map((exam, index) => {
            const total = exam.subjectScores.reduce((a, b) => a + b, 0);
            const maxTotal = exam.maxMarks * exam.subjectScores.length;
            const percentage = ((total / maxTotal) * 100).toFixed(2);

            return (
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
                          color: "#ffffff",
                        },
                      },
                    },
                  }}
                />

                <p className="exam-score-summary">
                  <strong>Total Marks:</strong> {total}/{maxTotal} &nbsp;|&nbsp;
                  <strong>Percentage:</strong> {percentage}%
                </p>

                {/* ✅ Progress Bars with Marks */}
                <div className="progress-bars">
                  {exam.subjects.map((subject, subIndex) => (
                    <div key={subIndex} className="progress-container">
                      <span>
                        {subject}: <strong>{exam.subjectScores[subIndex]}/{exam.maxMarks}</strong>
                      </span>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${(exam.subjectScores[subIndex] / exam.maxMarks) * 100}%`,
                            backgroundColor: exam.colors[subIndex],
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="chart-actions">
          <button className="cta-button">Download Report</button>
          <button className="cta-button secondary">View Analytics</button>
        </div>
      </div>
    </div>
  );
};
 
export default Dashboard;
