from flask import Flask, request, jsonify
import os
import cv2
import csv
import numpy as np
from datetime import datetime
from flask_cors import CORS
from detect import match_faces, verify_spoof  # DeepFace + MediaPipe functions

app = Flask(__name__)
CORS(app)

# === Directory Paths ===
FACES_DB = "faces_db"
TEMP_DIR = "temp"
ADMIT_DB = "admit_cards"
RECORDING_DIR = "recordings"
CHEATING_LOG_CSV = os.path.join(TEMP_DIR, "cheating_logs.csv")

# Create necessary folders
os.makedirs(FACES_DB, exist_ok=True)
os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(ADMIT_DB, exist_ok=True)
os.makedirs(RECORDING_DIR, exist_ok=True)


def decode_image(file_storage):
    try:
        image_bytes = np.frombuffer(file_storage.read(), np.uint8)
        img = cv2.imdecode(image_bytes, cv2.IMREAD_COLOR)
        if img is None or len(img.shape) != 3 or img.shape[2] != 3:
            raise ValueError("Decoded image is not a valid color image")
        return img
    except Exception as e:
        print(f"❌ Image decode error: {e}")
        return None


# === Register Face API ===
@app.route('/api/register-face', methods=['POST'])
def register_face():
    email = request.form.get('email')
    face_file = request.files.get('live_image')
    admit_file = request.files.get('admit_card')

    if not email or not face_file or not admit_file:
        return jsonify({'success': False, 'message': 'Email, live image, and admit card are required'}), 400

    try:
        face_filename = email.replace('@', '_at_') + ".jpg"
        admit_filename = email.replace('@', '_at_') + "_admit.jpg"

        face_path = os.path.join(FACES_DB, face_filename)
        admit_path = os.path.join(ADMIT_DB, admit_filename)

        face_file.save(face_path)
        admit_file.save(admit_path)

        print(f"✅ Face saved: {face_path}")
        print(f"✅ Admit card saved: {admit_path}")

        return jsonify({'success': True, 'message': 'Face and admit card saved successfully'})

    except Exception as e:
        print(f"❌ Error saving images: {e}")
        return jsonify({'success': False, 'message': 'Failed to save images', 'error': str(e)}), 500


# === Initial Login Verification ===
@app.route('/api/verify-login', methods=['POST'])
def verify_login_initial():
    return handle_verification('Initial Login')


# === During Exam Verification ===
@app.route('/api/verify-during-exam', methods=['POST'])
def verify_login_during_exam():
    return handle_verification('During Exam')


# === Shared Handler ===
def handle_verification(context_label):
    email = request.form.get('email')
    face_file = request.files.get('live_image')

    if not email or not face_file:
        return jsonify({'success': False, 'message': 'Email and live image are required'}), 400

    admit_path = os.path.join(ADMIT_DB, email.replace('@', '_at_') + "_admit.jpg")
    if not os.path.exists(admit_path):
        return jsonify({'success': False, 'match': False, 'message': 'Admit card not found for this email'}), 404

    img = decode_image(face_file)
    if img is None:
        return jsonify({'success': False, 'message': 'Uploaded image is invalid'}), 400

    try:
        print(f"📝 {context_label} - Verifying login for {email}")
        match_result = match_faces(admit_path, img)
        if not match_result or not match_result.get('success'):
            return jsonify({'success': False, 'message': 'Face match failed', 'error': match_result.get('error')}), 500

        matched = match_result['match']
        distance = match_result.get('distance')
        spoof_result, spoof_message = verify_spoof(img)

        print(f"🔍 Match={matched} | Spoof={spoof_result} | Distance={distance}")

        if matched and spoof_result:
            return jsonify({
                'success': True,
                'match': True,
                'spoof': True,
                'distance': distance,
                'spoof_message': spoof_message,
                'message': f'{context_label}: Verification passed'
            })
        else:
            return jsonify({
                'success': False,
                'match': matched,
                'spoof': spoof_result,
                'distance': distance,
                'spoof_message': spoof_message,
                'message': f'{context_label}: Verification failed (Mismatch or Spoof)'
            }), 401

    except Exception as e:
        print(f"❌ {context_label} verification error: {e}")
        return jsonify({'success': False, 'message': 'Internal verification error', 'error': str(e)}), 500


# === Spoof Check Only ===
@app.route('/api/verify-spoof-only', methods=['POST'])
def verify_spoof_only():
    face_file = request.files.get('live_image')
    if not face_file:
        return jsonify({'success': False, 'message': 'No live image provided'}), 400

    img = decode_image(face_file)
    if img is None:
        return jsonify({'success': False, 'message': 'Invalid image uploaded'}), 400

    try:
        spoof_result, spoof_message = verify_spoof(img)
        print(f"🧠 Spoof Check: {spoof_message}")
        return jsonify({'success': True, 'spoof': spoof_result, 'spoof_message': spoof_message})
    except Exception as e:
        print(f"❌ Spoof check error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


# === Log Cheating ===
@app.route('/api/log-cheating', methods=['POST'])
def log_cheating():
    try:
        data = request.get_json()
        print(f"📥 Incoming cheating log data: {data}")
        email = data.get('email')
        reason = data.get('reason')
        timestamp = data.get('timestamp') or datetime.now().isoformat()

        if not email or not reason:
            return jsonify({'success': False, 'message': 'Missing email or reason'}), 400

        with open(CHEATING_LOG_CSV, mode='a', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([email, reason, timestamp])

        print(f"🚨 Cheating logged: {email} - {reason} at {timestamp}")
        return jsonify({'success': True, 'message': 'Cheating attempt logged'})

    except Exception as e:
        print(f"❌ Cheating log error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500
        


# === Upload Recording ===
@app.route('/api/upload-recording', methods=['POST'])
def upload_recording():
    try:
        email = request.form.get('email')
        video_file = request.files.get('recording')

        if not email or not video_file:
            return jsonify({'success': False, 'message': 'Missing email or recording'}), 400

        filename = email.replace('@', '_at_') + "_recording.webm"
        save_path = os.path.join(RECORDING_DIR, filename)
        video_file.save(save_path)

        print(f"🎥 Recording saved for {email} at {save_path}")
        return jsonify({'success': True, 'message': 'Recording uploaded'})

    except Exception as e:
        print(f"❌ Recording upload error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


# === Run Flask App ===
if __name__ == '__main__':
    app.run(port=5002, debug=True)
