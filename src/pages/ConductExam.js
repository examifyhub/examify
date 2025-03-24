import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";  // 🚀 Import useLocation to get exam title
import "../styles/ConductExam.css";

const ConductExam = () => {
  const [timer, setTimer] = useState(180 * 60); // 3 hours in seconds
  const [examStarted, setExamStarted] = useState(false);
  const [examEnded, setExamEnded] = useState(false);
  const [soundDetected, setSoundDetected] = useState(false);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);

  // ✅ Get exam title from location state
  const location = useLocation();
  const examTitle = location.state?.examTitle || "Unknown Exam";  // Fallback if undefined

  useEffect(() => {
    let interval;
    if (examStarted && !examEnded) {
      interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [examStarted, examEnded]);

  useEffect(() => {
    if (examStarted && !examEnded) {
      startSoundDetection();
    } else {
      stopSoundDetection();
    }
    return () => stopSoundDetection();
  }, [examStarted, examEnded]);

  const startSoundDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      const microphone = audioCtx.createMediaStreamSource(stream);
      const scriptProcessor = audioCtx.createScriptProcessor(2048, 1, 1);

      microphone.connect(analyser);
      analyser.connect(scriptProcessor);
      scriptProcessor.connect(audioCtx.destination);

      scriptProcessor.onaudioprocess = () => {
        const buffer = new Float32Array(analyser.fftSize);
        analyser.getFloatTimeDomainData(buffer);

        // ✅ Simple sound detection logic (no dB calculation)
        const hasSound = buffer.some((sample) => Math.abs(sample) > 0.01);  
        setSoundDetected(hasSound);
      };

      // Store references for cleanup
      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;
      microphoneRef.current = microphone;

    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopSoundDetection = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

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
        <>
          <h1 className="exam-title">Exam Title: {examTitle}</h1>
          <button className="start-exam-btn" onClick={startExam}>
            Start Exam
          </button>
        </>
      ) : examEnded ? (
        <h2 className="exam-ended-message">Exam Submitted! ✅</h2>
      ) : (
        <>
          <h1 className="exam-title">Exam Title: {examTitle}</h1>
          <h2 className="exam-timer">{formatTime(timer)}</h2>

          <div className="progress-bar">
            <div className="progress" style={{ width: `${(timer / (180 * 60)) * 100}%` }}></div>
          </div>

          <div id="exam-content">
            <h3>Exam in Progress...</h3>

            {/* 🎤 Real-Time Sound Detection */}
            <div className="sound-detection-panel">
              <h4>🔊 Real-Time Sound Detection</h4>
              <p style={{ color: soundDetected ? "red" : "green" }}>
                {soundDetected ? "⚠️ Sound Detected!" : "✅ No Sound"}
              </p>
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
