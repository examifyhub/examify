import cv2
import mediapipe as mp
import numpy as np
from scipy.spatial import distance
import time
import os
from deepface import DeepFace

# === EAR calculation for blink detection ===
def eye_aspect_ratio(eye):
    A = distance.euclidean(eye[1], eye[5])
    B = distance.euclidean(eye[2], eye[4])
    C = distance.euclidean(eye[0], eye[3])
    return (A + B) / (2.0 * C)

# === Fake Skin Detection ===
def detect_fake_skin(face_region):
    face_region = cv2.resize(face_region, (200, 200))
    hsv = cv2.cvtColor(face_region, cv2.COLOR_BGR2HSV)
    std_dev = np.std(hsv[:, :, 1])  # saturation channel
    print(f"📊 Saturation Std Dev: {std_dev:.2f}")
    return std_dev < 15  # low variation = possible spoof

def verify_spoof(image):
    try:
        h, w = image.shape[:2]
        rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        with mp.solutions.face_mesh.FaceMesh(
            static_image_mode=True,
            max_num_faces=1,
            refine_landmarks=True
        ) as face_mesh:

            results = face_mesh.process(rgb)
            if not results.multi_face_landmarks:
                debug_path = "temp/debug_no_face.jpg"
                cv2.imwrite(debug_path, image)
                print(f"❌ No face detected — saved to {debug_path}")
                return False, "No face detected"

            landmarks = results.multi_face_landmarks[0].landmark
            x_coords = [int(l.x * w) for l in landmarks]
            y_coords = [int(l.y * h) for l in landmarks]
            x_min, x_max = max(min(x_coords), 0), min(max(x_coords), w)
            y_min, y_max = max(min(y_coords), 0), min(max(y_coords), h)
            face_crop = image[y_min:y_max, x_min:x_max]

            if face_crop.size == 0 or face_crop.shape[0] < 10 or face_crop.shape[1] < 10:
                return False, "Invalid face crop for spoof detection"

            # New check: brightness
            brightness = np.mean(cv2.cvtColor(face_crop, cv2.COLOR_BGR2GRAY))
            if brightness < 40:
                return False, "Image too dark to verify"

            # New check: blur detection
            lap_var = cv2.Laplacian(cv2.cvtColor(face_crop, cv2.COLOR_BGR2GRAY), cv2.CV_64F).var()
            if lap_var < 15:
                return False, "Image too blurry to verify"

            is_fake = detect_fake_skin(face_crop)
            return (False, "Spoof detected (photo/screen)") if is_fake else (True, "Real face detected (live)")

    except Exception as e:
        print(f"❌ Spoof detection error: {e}")
        return False, f"Error during spoof check: {str(e)}"

# === DeepFace Matching ===
def match_faces(admit_card_path, live_image_array, threshold=0.9):
    try:
        temp_live_path = "temp/temp_live.jpg"
        os.makedirs("temp", exist_ok=True)
        cv2.imwrite(temp_live_path, live_image_array)

        print(f"📂 Matching faces using ArcFace...")
        print(f"📘 Admit Path: {admit_card_path}")
        print(f"📷 Live Temp Path: {temp_live_path}")

        result = DeepFace.verify(
            img1_path=admit_card_path,
            img2_path=temp_live_path,
            model_name="ArcFace",
            detector_backend="retinaface",
            enforce_detection=False
        )

        distance = result.get("distance", -1)
        match = result.get("verified", False)

        print(f"🎯 DeepFace Distance: {distance:.4f}, Match: {match}")

        if distance > threshold:
            print(f"❌ Distance too high: {distance:.4f} > {threshold}")
            match = False

        return {
            "success": True,
            "match": match,
            "distance": round(float(distance), 4)
        }

    except Exception as e:
        print(f"❌ DeepFace Match Error: {str(e)}")
        return {
            "success": False,
            "error": str(e),
            "match": False,
            "distance": None
        }

# === LIVE DETECTION ===
if __name__ == '__main__':
    LEFT_EYE = [33, 160, 158, 133, 153, 144]
    RIGHT_EYE = [362, 385, 387, 263, 373, 380]
    POSE_POINTS = [33, 263, 1, 61, 291, 199]

    EAR_THRESHOLD = 0.21
    CONSEC_FRAMES = 2
    YAW_THRESHOLD = 20
    YAW_FRAMES_REQUIRED = 5
    CHALLENGE_TIMEOUT = 5

    blink_counter = total_blinks = 0
    real_detected = real_announced = False
    head_challenge_required = head_turn_detected = spoof_announced = False
    challenge_start_time = initial_yaw = None
    yaw_sequence = []
    prompt_given = False

    face_mesh = mp.solutions.face_mesh.FaceMesh(static_image_mode=False, max_num_faces=1, refine_landmarks=True)
    cap = cv2.VideoCapture(0)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        h, w = frame.shape[:2]
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = face_mesh.process(rgb)
        face_visible = results.multi_face_landmarks is not None

        if not face_visible:
            blink_counter = total_blinks = 0
            real_detected = real_announced = head_challenge_required = head_turn_detected = False
            challenge_start_time = initial_yaw = None
            yaw_sequence = []
            prompt_given = spoof_announced = False
            label, color = "No Face Detected", (128, 128, 128)
            cv2.putText(frame, label, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)
            cv2.imshow("Examify - Anti-Spoof", frame)
            if cv2.waitKey(1) & 0xFF == ord("q"): break
            continue

        is_real, spoof_message = verify_spoof(frame)
        spoof = not is_real
        print(f"🧠 Spoof Check: {spoof_message}")

        landmarks = results.multi_face_landmarks[0].landmark
        left_eye = [(int(landmarks[i].x * w), int(landmarks[i].y * h)) for i in LEFT_EYE]
        right_eye = [(int(landmarks[i].x * w), int(landmarks[i].y * h)) for i in RIGHT_EYE]
        ear = (eye_aspect_ratio(left_eye) + eye_aspect_ratio(right_eye)) / 2.0

        if ear < EAR_THRESHOLD:
            blink_counter += 1
        else:
            if blink_counter >= CONSEC_FRAMES:
                total_blinks += 1
                real_detected = True
            blink_counter = 0

        if not real_detected and total_blinks == 0:
            head_challenge_required = True

        x_coords = [int(l.x * w) for l in landmarks]
        y_coords = [int(l.y * h) for l in landmarks]
        x_min, x_max = max(min(x_coords), 0), min(max(x_coords), w)
        y_min, y_max = max(min(y_coords), 0), min(max(y_coords), h)
        face_crop = frame[y_min:y_max, x_min:x_max]
        photo_spoof = detect_fake_skin(face_crop)

        if head_challenge_required:
            if challenge_start_time is None:
                challenge_start_time = time.time()
                initial_yaw = None
                yaw_sequence = []
                prompt_given = False

            if not prompt_given:
                speak("Please turn your head to the right")
                prompt_given = True

            elapsed_time = time.time() - challenge_start_time
            if elapsed_time <= CHALLENGE_TIMEOUT:
                try:
                    image_points = [(int(landmarks[i].x * w), int(landmarks[i].y * h)) for i in POSE_POINTS]
                    model_points = np.array([
                        (-30, 0, -30), (30, 0, -30), (0, 0, 0),
                        (-25, -30, -15), (25, -30, -15), (0, -60, -5)
                    ])
                    camera_matrix = np.array([[w, 0, w/2], [0, w, h/2], [0, 0, 1]], dtype="double")
                    dist_coeffs = np.zeros((4, 1))
                    success, rvec, tvec = cv2.solvePnP(model_points, np.array(image_points, dtype="double"), camera_matrix, dist_coeffs)
                    if success:
                        rmat, _ = cv2.Rodrigues(rvec)
                        proj_matrix = np.hstack((rmat, tvec))
                        _, _, _, _, _, _, euler_angles = cv2.decomposeProjectionMatrix(proj_matrix)
                        yaw = euler_angles[1][0]
                        if initial_yaw is None:
                            initial_yaw = yaw
                        yaw_sequence.append(yaw)
                        if len(yaw_sequence) >= YAW_FRAMES_REQUIRED:
                            diff = [y - initial_yaw for y in yaw_sequence[-YAW_FRAMES_REQUIRED:]]
                            if all(d > YAW_THRESHOLD for d in diff):
                                real_detected = True
                                head_challenge_required = False
                except:
                    pass
            else:
                head_challenge_required = False
                if not spoof_announced:
                    speak("You are detected as a spoof")
                    spoof_announced = True

        # === Final Display Status ===
        if real_detected:
            label, color = "REAL (blink/head/skin)", (0, 255, 0)
            if not real_announced:
                speak("Verification successful")
                real_announced = True
        elif not real_detected and photo_spoof:
            label, color = "SPOOF (photo detected)", (0, 0, 255)
            if not spoof_announced:
                speak("You are detected as a spoof")
                spoof_announced = True
        elif head_challenge_required:
            label, color = "SPOOF? Turn head right", (0, 140, 255)
        else:
            label, color = "SPOOF (no blink)", (0, 0, 255)

        cv2.putText(frame, label, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)
        cv2.imshow("Examify - Anti-Spoof", frame)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()
