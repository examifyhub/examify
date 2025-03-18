import cv2
import dlib
import time
from flask import Flask, jsonify

app = Flask(_name_)
detector = dlib.get_frontal_face_detector()
cap = cv2.VideoCapture(0)

eye_movement_count = 0
start_time = time.time()

@app.route('/eye_tracking')
def eye_tracking():
    global eye_movement_count
    _, frame = cap.read()
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = detector(gray)

    if not faces:
        eye_movement_count += 1
    
    if eye_movement_count > 10:
        return jsonify({"message": "⚠️ Suspicious eye movement detected!"})
    
    return jsonify({"message": "✅ Normal Eye Movement"})

if _name_ == "_main_":
    app.run(debug=True, port=5001)