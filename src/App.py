from flask import Flask, jsonify
import cv2
import numpy as np
import pyaudio
import os

app = Flask(__name__)

# Function to detect if the student is looking at the screen
def detect_eye_movements():
    cap = cv2.VideoCapture(0)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_eye.xml")
    
    _, frame = cap.read()
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    
    eye_detected = False
    for (x, y, w, h) in faces:
        roi_gray = gray[y:y + h, x:x + w]
        eyes = eye_cascade.detectMultiScale(roi_gray)
        if len(eyes) > 0:
            eye_detected = True
            break

    cap.release()
    return eye_detected

# Function to detect suspicious sounds
def detect_sound():
    chunk = 1024
    format = pyaudio.paInt16
    channels = 1
    rate = 44100
    record_seconds = 2
    
    audio = pyaudio.PyAudio()
    stream = audio.open(format=format, channels=channels,
                        rate=rate, input=True,
                        frames_per_buffer=chunk)
    
    frames = []
    for _ in range(0, int(rate / chunk * record_seconds)):
        data = stream.read(chunk)
        frames.append(data)

    stream.stop_stream()
    stream.close()
    audio.terminate()

    volume = np.frombuffer(b''.join(frames), dtype=np.int16).mean()
    return volume > 500  # Noise threshold

# Function to detect nearby unauthorized devices
def detect_nearby_devices():
    devices = os.popen("arp -a").read()
    return "Multiple devices detected!" if len(devices.split("\n")) > 5 else "No extra devices detected."

# API Endpoint to check cheating activities
@app.route("/start-proctoring", methods=["GET"])
def start_proctoring():
    eye_status = detect_eye_movements()
    sound_status = detect_sound()
    device_status = detect_nearby_devices()
    
    return jsonify({
        "eye_tracking": "OK" if eye_status else "Warning: Look at the screen!",
        "sound_detection": "OK" if not sound_status else "Warning: Background noise detected!",
        "device_detection": device_status
    })

if __name__ == "__main__":
    app.run(debug=True)
