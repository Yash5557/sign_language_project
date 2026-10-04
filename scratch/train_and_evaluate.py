import os
import sys
import json
import numpy as np
from sklearn.model_selection import StratifiedKFold
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

from feature_extractor import extract_full_sample, CLASSES

# Initialize MediaPipe HandLandmarker
model_path = os.path.join(os.path.dirname(__file__), "hand_landmarker.task")
base_options = python.BaseOptions(model_asset_path=model_path)
options = vision.HandLandmarkerOptions(base_options=base_options, num_hands=2, min_hand_detection_confidence=0.1)
detector = vision.HandLandmarker.create_from_options(options)

base_dir = r"C:\Users\Karan Chimote\Downloads\archive (1)\sign_language"

raw_samples = []
raw_labels = []

print("Extracting features from dataset images...")
for c_idx, c_name in enumerate(CLASSES):
    c_dir = os.path.join(base_dir, c_name)
    files = [f for f in os.listdir(c_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    for f in files:
        img_p = os.path.join(c_dir, f)
        try:
            mp_img = mp.Image.create_from_file(img_p)
            res = detector.detect(mp_img)
            if res.hand_landmarks:
                feat = extract_full_sample(res.hand_landmarks)
                raw_samples.append(feat)
                raw_labels.append(c_idx)
                
                # Also extract mirrored variant (invert X coordinate)
                mirrored_hands = []
                for hand in res.hand_landmarks:
                    class DummyLM:
                        def __init__(self, x, y, z):
                            self.x = x
                            self.y = y
                            self.z = z
                    m_hand = [DummyLM(1.0 - lm.x, lm.y, lm.z) for lm in hand]
                    mirrored_hands.append(m_hand)
                raw_samples.append(extract_full_sample(mirrored_hands))
                raw_labels.append(c_idx)
        except Exception as e:
            print(f"Error {c_name}/{f}: {e}")

X_raw = np.array(raw_samples, dtype=np.float32)
y_raw = np.array(raw_labels, dtype=np.int64)
print(f"Extracted {len(X_raw)} raw base samples across {len(CLASSES)} classes.")

# Data Augmentation: add subtle noise & slight scaling variations to ensure robust generalization
augmented_samples = []
augmented_labels = []

np.random.seed(42)
for i in range(len(X_raw)):
    base_feat = X_raw[i]
    lbl = y_raw[i]
    augmented_samples.append(base_feat)
    augmented_labels.append(lbl)
    
    # Generate 15 variations with slight perturbation
    for _ in range(15):
        noise = np.random.normal(0, 0.02, size=base_feat.shape).astype(np.float32)
        # Keep is_two_hands flag intact
        noise[0] = 0.0
        aug = base_feat + noise
        augmented_samples.append(aug)
        augmented_labels.append(lbl)

X = np.array(augmented_samples, dtype=np.float32)
y = np.array(augmented_labels, dtype=np.int64)

print(f"Augmented dataset total samples: {len(X)}, features: {X.shape[1]}")

# 5-Fold Stratified Cross Validation
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
fold_accuracies = []

for fold, (train_idx, val_idx) in enumerate(skf.split(X, y)):
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X[train_idx])
    X_val = scaler.transform(X[val_idx])
    y_train = y[train_idx]
    y_val = y[val_idx]
    
    mlp = MLPClassifier(hidden_layer_sizes=(128, 64), activation='relu', max_iter=300, random_state=42, early_stopping=False)
    mlp.fit(X_train, y_train)
    y_pred = mlp.predict(X_val)
    acc = accuracy_score(y_val, y_pred)
    fold_accuracies.append(acc)
    print(f"  Fold {fold+1} Accuracy: {acc * 100:.2f}%")

print(f"Mean 5-Fold CV Accuracy: {np.mean(fold_accuracies) * 100:.2f}%")
