import os
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

model_path = os.path.join(os.path.dirname(__file__), "hand_landmarker.task")
base_options = python.BaseOptions(model_asset_path=model_path)
options = vision.HandLandmarkerOptions(base_options=base_options, num_hands=2, min_hand_detection_confidence=0.2)
detector = vision.HandLandmarker.create_from_options(options)

base_dir = r"C:\Users\Karan Chimote\Downloads\archive (1)\sign_language"
classes = ['family', 'hello', 'help', 'house', 'i_love_you', 'no', 'please', 'sorry', 'thankyou', 'yes']

total_images = 0
total_detected = 0

print("Scanning dataset classes:")
for c in classes:
    c_dir = os.path.join(base_dir, c)
    files = [f for f in os.listdir(c_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    detected = 0
    hands_dist = {}
    for f in files:
        img_p = os.path.join(c_dir, f)
        try:
            mp_image = mp.Image.create_from_file(img_p)
            res = detector.detect(mp_image)
            n_hands = len(res.hand_landmarks) if res.hand_landmarks else 0
            hands_dist[n_hands] = hands_dist.get(n_hands, 0) + 1
            if n_hands > 0:
                detected += 1
        except Exception as e:
            print(f"Error on {f}: {e}")
    total_images += len(files)
    total_detected += detected
    print(f"  {c:12s}: {detected}/{len(files)} detected. Hands distribution: {hands_dist}")

print(f"\nOverall: {total_detected}/{total_images} detected.")
