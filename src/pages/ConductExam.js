import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "../styles/ConductExam.css";

const ConductExam = () => {
  const [examStarted, setExamStarted] = useState(false);
  const [examEnded, setExamEnded] = useState(false);
  const [faceAlert, setFaceAlert] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const verificationIntervalRef = useRef(null);
  const spoofCountRef = useRef(0);

  const location = useLocation();
  const examTitle = location.state?.examTitle;

  const rawEmail = localStorage.getItem("examify_email");
  const email = rawEmail || "unknown_user";

  useEffect(() => {
    if (!rawEmail) {
      alert("❌ Email not found. Please login again.");
      window.location.href = "/";
    }

    if (!examTitle || examTitle === "Unknown Exam") {
      alert("⚠️ No exam selected. Redirecting...");
      window.location.href = "/recommendation"; // ⬅️ Change if your exam list route differs
    }
  }, []);

  useEffect(() => {
    if (showPreview || examStarted) startCamera();
  }, [showPreview, examStarted]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert(`Camera error: ${err.message}`);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) stream.getTracks().forEach((track) => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const clearVerificationInterval = () => {
    if (verificationIntervalRef.current) {
      clearInterval(verificationIntervalRef.current);
      verificationIntervalRef.current = null;
    }
  };

  const captureAndVerify = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, width, height);

    const cropSize = Math.min(width, height) * 0.5;
    const cropX = (width - cropSize) / 2;
    const cropY = (height - cropSize) / 2;

    const croppedCanvas = document.createElement("canvas");
    croppedCanvas.width = 300;
    croppedCanvas.height = 300;
    const croppedCtx = croppedCanvas.getContext("2d");
    croppedCtx.drawImage(canvas, cropX, cropY, cropSize, cropSize, 0, 0, 300, 300);

    croppedCanvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("live_image", blob, `${email}_exam.jpg`);

      try {
        const res = await fetch("http://127.0.0.1:5002/api/verify-login", {
          method: "POST",
          body: formData,
        });

        const result = await res.json();
        console.log("🧠 Verification Result:", result);

        if (result.success && result.spoof === true) {
          if (!examStarted) {
            alert("✅ Real face detected. Starting exam...");
            setExamStarted(true);
            setShowPreview(false);
            verificationIntervalRef.current = setInterval(captureAndVerify, 30000);
          }
          setFaceAlert(null);
          spoofCountRef.current = 0;
        } else if (result.success && result.spoof === false) {
          setFaceAlert("❌ Spoof detected.");
          spoofCountRef.current += 1;

          if (spoofCountRef.current >= 3) {
            alert("🚨 Multiple spoof attempts detected. Exam will be ended.");
            endExam();
          }
        } else {
          setFaceAlert("❌ Verification failed.");
        }
      } catch (err) {
        alert("❌ Verification error. Try again.");
        console.error(err);
      }
    }, "image/jpeg", 0.95);
  };

  const endExam = () => {
    if (window.confirm("Submit and end the exam?")) {
      setExamEnded(true);
      setExamStarted(false);
      stopCamera();
      clearVerificationInterval();
    }
  };

  const cancelExam = () => {
    stopCamera();
    clearVerificationInterval();
    setShowPreview(false);
  };

  return (
    <div className="conduct-exam-container">
      {(examStarted || showPreview) && (
        <>
          <video ref={videoRef} autoPlay muted className="camera-view" />
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </>
      )}

      {!examStarted && !examEnded ? (
        <div className="exam-init">
          <h1 className="exam-title">📘 Exam: {examTitle}</h1>
          {!showPreview ? (
            <button className="start-exam-btn" onClick={() => setShowPreview(true)}>
              Enter
            </button>
          ) : (
            <div className="verification-buttons">
              <button onClick={captureAndVerify} className="start-exam-btn">
                Verify & Start
              </button>
              <button onClick={cancelExam} className="end-exam-btn">
                Cancel & End
              </button>
              {faceAlert && <p className="face-alert">{faceAlert}</p>}
            </div>
          )}
        </div>
      ) : examEnded ? (
        <div className="exam-ended-message">✅ Exam Submitted Successfully</div>
      ) : (
        <div className="exam-ongoing">
          <h1 className="exam-title">{examTitle}</h1>
          {faceAlert && <p className="face-alert">{faceAlert}</p>}
          <button className="end-exam-btn" onClick={endExam}>
            End Exam
          </button>
        </div>
      )}
    </div>
  );
};

export default ConductExam;
