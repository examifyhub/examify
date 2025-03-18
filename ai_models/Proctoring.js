import * as faceapi from 'face-api.js';
import { useEffect, useRef } from 'react';

const Proctoring = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    };

    startCamera();
  }, []);

  return (
    <div>
      <h1>Proctoring Active</h1>
      <video ref={videoRef} autoPlay muted></video>
    </div>
  );
};

export default Proctoring;
