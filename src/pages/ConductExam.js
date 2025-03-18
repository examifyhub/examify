import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ConductExam.css";

const ConductExam = () => {
  const [timer, setTimer] = useState(180 * 60); // 3 hours in seconds
  const [examStarted, setExamStarted] = useState(false);
  const [examEnded, setExamEnded] = useState(false);
  const [proctoringData, setProctoringData] = useState({
    camera_status: "Checking...",
    eye_tracking: "Checking...",
    sound_detection: "Checking...",
    device_detection: "Checking...",
  });

  useEffect(() => {
    let interval;
    if (examStarted && !examEnded) {
      interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      // Simulate gradual detection updates
      setTimeout(() => setProctoringData((prev) => ({ ...prev, camera_status: "Active ✅" })), 3000);
      setTimeout(() => setProctoringData((prev) => ({ ...prev, eye_tracking: "Normal ✅" })), 6000);
      setTimeout(() => setProctoringData((prev) => ({ ...prev, sound_detection: "Noise Detected ⚠️" })), 9000);
      setTimeout(() => setProctoringData((prev) => ({ ...prev, device_detection: "Nearby Device Found ⚠️" })), 12000);

      return () => clearInterval(interval);
    }
  }, [examStarted, examEnded]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const startExam = () => {
    if (window.confirm("Are you sure you want to start the exam?")) {
      setExamStarted(true);
    }
  };

  const endExam = () => {
    if (window.confirm("Are you sure you want to submit and end the exam?")) {
      setExamEnded(true);
      setExamStarted(false);
    }
  };

  return (
    <div className="conduct-exam-container">
      {!examStarted && !examEnded ? (
        <button className="start-exam-btn" onClick={startExam}>
          Start Exam
        </button>
      ) : examEnded ? (
        <h2 className="exam-ended-message">Exam Submitted! ✅</h2>
      ) : (
        <>
          <h2 className="exam-timer">{formatTime(timer)}</h2>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${(timer / (180 * 60)) * 100}%` }}></div>
          </div>

          <div id="exam-content">
            <h3>Exam in Progress...</h3>
            <div className="proctoring-panel">
              <h4>🔍 Live Proctoring Status</h4>
              <p><strong>📷 Camera Status:</strong> {proctoringData.camera_status}</p>
              <p><strong>👀 Eye Tracking:</strong> {proctoringData.eye_tracking}</p>
              <p><strong>🎤 Sound Detection:</strong> {proctoringData.sound_detection}</p>
              <p><strong>📱 Nearby Device Detection:</strong> {proctoringData.device_detection}</p>
            </div>
          </div>

          <button className="end-exam-btn" onClick={endExam}>
            End Exam
          </button>
        </>
      )}
    </div>
  );
};

export default ConductExam;
