import os
import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

model_path = os.path.join(os.path.dirname(__file__), "hand_landmarker.task")
base_options = python.BaseOptions(model_asset_path=model_path)
options = vision.HandLandmarkerOptions(base_options=base_options, num_hands=2, min_hand_detection_confidence=0.05)
detector = vision.HandLandmarker.create_from_options(options)

base_dir = r"C:\Users\Karan Chimote\Downloads\archive (1)\sign_language"

for c in ['house', 'sorry']:
    c_dir = os.path.join(base_dir, c)
    for f in os.listdir(c_dir):
        if not f.lower().endswith(('.jpg', '.jpeg', '.png')):
            continue
        p = os.path.join(c_dir, f)
        mp_img = mp.Image.create_from_file(p)
        res = detector.detect(mp_img)
        if not res.hand_landmarks:
            print(f"Undetected: {c}/{f}")
