import os
import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

model_path = os.path.join(os.path.dirname(__file__), "hand_landmarker.task")

base_options = python.BaseOptions(model_asset_path=model_path)
options = vision.HandLandmarkerOptions(base_options=base_options, num_hands=2)
detector = vision.HandLandmarker.create_from_options(options)

# Test on one image from hello
test_img_path = r"C:\Users\Karan Chimote\Downloads\archive (1)\sign_language\hello\hello1.jpg"
image = mp.Image.create_from_file(test_img_path)
detection_result = detector.detect(image)

print("Test image:", test_img_path)
print("Hands detected:", len(detection_result.hand_landmarks))
if detection_result.hand_landmarks:
    print("Hand 0 landmarks count:", len(detection_result.hand_landmarks[0]))
    print("Landmark 0 (wrist):", detection_result.hand_landmarks[0][0])
