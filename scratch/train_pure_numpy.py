import os
import sys
import types
import json
import time
import numpy as np

# Mock tensorflow docs if needed
mock_tf = types.ModuleType("tensorflow")
mock_tools = types.ModuleType("tensorflow.tools")
mock_docs = types.ModuleType("tensorflow.tools.docs")
mock_doc_controls = types.ModuleType("tensorflow.tools.docs.doc_controls")
mock_doc_controls.do_not_generate_docs = lambda x: x
mock_doc_controls.doc_private = lambda x: x
sys.modules["tensorflow"] = mock_tf
sys.modules["tensorflow.tools"] = mock_tools
sys.modules["tensorflow.tools.docs"] = mock_docs
sys.modules["tensorflow.tools.docs.doc_controls"] = mock_doc_controls

import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

# 10 Classes in Dataset
CLASSES = ['family', 'hello', 'help', 'house', 'i_love_you', 'no', 'please', 'sorry', 'thankyou', 'yes']

def compute_angle(a, b, c):
    ba = a - b
    bc = c - b
    norm_ba = np.linalg.norm(ba)
    norm_bc = np.linalg.norm(bc)
    if norm_ba < 1e-7 or norm_bc < 1e-7:
        return 0.0
    cos = np.dot(ba, bc) / (norm_ba * norm_bc)
    cos = np.clip(cos, -1.0, 1.0)
    return float(np.degrees(np.arccos(cos)))

def extract_hand_features(landmarks):
    pts = np.array([[lm.x, lm.y, lm.z] for lm in landmarks], dtype=np.float32)
    wrist = pts[0].copy()
    pts_centered = pts - wrist
    
    # Scale based on distance from wrist (0) to middle MCP (9)
    scale = np.linalg.norm(pts_centered[9])
    if scale < 1e-5:
        scale = 1.0
    pts_norm = pts_centered / scale

    coords_feat = pts_norm.flatten().tolist()  # 63 features

    # 15 joint angles
    joint_indices = [
        # Thumb
        (0, 1, 2), (1, 2, 3), (2, 3, 4),
        # Index
        (0, 5, 6), (5, 6, 7), (6, 7, 8),
        # Middle
        (0, 9, 10), (9, 10, 11), (10, 11, 12),
        # Ring
        (0, 13, 14), (13, 14, 15), (14, 15, 16),
        # Pinky
        (0, 17, 18), (17, 18, 19), (18, 19, 20)
    ]
    angles_feat = [compute_angle(pts[a], pts[b], pts[c]) / 180.0 for (a, b, c) in joint_indices]

    # 12 normalized fingertip distances
    dist_pairs = [
        (4, 8), (4, 12), (4, 16), (4, 20),
        (8, 12), (12, 16), (16, 20),
        (0, 4), (0, 8), (0, 12), (0, 16), (0, 20)
    ]
    dists_feat = [float(np.linalg.norm(pts_norm[a] - pts_norm[b])) for (a, b) in dist_pairs]

    # Palm normal vector
    v1 = pts_centered[5]
    v2 = pts_centered[17]
    normal = np.cross(v1, v2)
    norm_val = np.linalg.norm(normal)
    if norm_val > 1e-6:
        normal = normal / norm_val
    normal_feat = normal.tolist()

    return coords_feat + angles_feat + dists_feat + normal_feat  # 93 features

def extract_sample(hand_landmarks_list):
    zeros93 = [0.0] * 93
    if not hand_landmarks_list:
        return [0.0] + zeros93 + zeros93 + [0.0, 0.0, 0.0]
    
    n_hands = len(hand_landmarks_list)
    h0 = extract_hand_features(hand_landmarks_list[0])
    if n_hands >= 2:
        h1 = extract_hand_features(hand_landmarks_list[1])
        w0 = np.array([hand_landmarks_list[0][0].x, hand_landmarks_list[0][0].y, hand_landmarks_list[0][0].z])
        w1 = np.array([hand_landmarks_list[1][0].x, hand_landmarks_list[1][0].y, hand_landmarks_list[1][0].z])
        diff = (w1 - w0).tolist()
        return [1.0] + h0 + h1 + diff
    else:
        return [0.0] + h0 + zeros93 + [0.0, 0.0, 0.0]

# Initialize detector
task_path = os.path.join(os.path.dirname(__file__), "hand_landmarker.task")
base_options = python.BaseOptions(model_asset_path=task_path)
options = vision.HandLandmarkerOptions(base_options=base_options, num_hands=2, min_hand_detection_confidence=0.1)
detector = vision.HandLandmarker.create_from_options(options)

base_dir = r"C:\Users\Karan Chimote\Downloads\archive (1)\sign_language"

raw_X = []
raw_y = []

print("Extracting features from dataset images...")
for c_idx, c_name in enumerate(CLASSES):
    c_dir = os.path.join(base_dir, c_name)
    files = [f for f in os.listdir(c_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    cnt = 0
    for f in files:
        img_p = os.path.join(c_dir, f)
        try:
            mp_img = mp.Image.create_from_file(img_p)
            res = detector.detect(mp_img)
            if res.hand_landmarks:
                feat = extract_sample(res.hand_landmarks)
                raw_X.append(feat)
                raw_y.append(c_idx)
                cnt += 1
                
                # Invert X for mirroring
                class DummyLM:
                    def __init__(self, x, y, z):
                        self.x = x
                        self.y = y
                        self.z = z
                mirrored = []
                for hand in res.hand_landmarks:
                    m_hand = [DummyLM(1.0 - lm.x, lm.y, lm.z) for lm in hand]
                    mirrored.append(m_hand)
                raw_X.append(extract_sample(mirrored))
                raw_y.append(c_idx)
        except Exception as e:
            print(f"Error {c_name}/{f}: {e}")
    print(f"  {c_name}: {cnt} images detected")

X_base = np.array(raw_X, dtype=np.float32)
y_base = np.array(raw_y, dtype=np.int64)
print(f"\nTotal raw samples (with mirroring): {len(X_base)}, feature dimension: {X_base.shape[1]}")

# Augmentation: 25 noisy variations per sample
augmented_X = []
augmented_y = []
np.random.seed(42)
for i in range(len(X_base)):
    base_feat = X_base[i]
    lbl = y_base[i]
    augmented_X.append(base_feat)
    augmented_y.append(lbl)
    
    for _ in range(25):
        noise = np.random.normal(0, 0.015, size=base_feat.shape).astype(np.float32)
        noise[0] = 0.0  # keep two_hands flag exact
        augmented_X.append(base_feat + noise)
        augmented_y.append(lbl)

X = np.array(augmented_X, dtype=np.float32)
y = np.array(augmented_y, dtype=np.int64)
print(f"Total augmented training samples: {len(X)}")

# Train / Test split (80/20)
indices = np.random.permutation(len(X))
split = int(0.85 * len(X))
train_idx, test_idx = indices[:split], indices[split:]

X_train, y_train = X[train_idx], y[train_idx]
X_test, y_test = X[test_idx], y[test_idx]

mean = X_train.mean(axis=0)
std = X_train.std(axis=0)
std[std < 1e-6] = 1.0

X_train_norm = (X_train - mean) / std
X_test_norm = (X_test - mean) / std

# MLP Architecture: 190 -> 128 -> 64 -> 10
in_dim = X.shape[1]
h1 = 128
h2 = 64
out_dim = len(CLASSES)

W1 = (np.random.randn(in_dim, h1) * np.sqrt(2.0 / in_dim)).astype(np.float32)
b1 = np.zeros(h1, dtype=np.float32)
W2 = (np.random.randn(h1, h2) * np.sqrt(2.0 / h1)).astype(np.float32)
b2 = np.zeros(h2, dtype=np.float32)
W3 = (np.random.randn(h2, out_dim) * np.sqrt(2.0 / h2)).astype(np.float32)
b3 = np.zeros(out_dim, dtype=np.float32)

params = [W1, b1, W2, b2, W3, b3]
m_mom = [np.zeros_like(p) for p in params]
v_mom = [np.zeros_like(p) for p in params]

lr = 0.003
beta1 = 0.9
beta2 = 0.999
eps = 1e-8
batch_size = 64
epochs = 30
num_batches = len(X_train_norm) // batch_size
step = 0

print("\n--- Training Deep Neural Network on Sign Language Dataset ---")
best_acc = 0.0
best_params = None

for epoch in range(epochs):
    perm = np.random.permutation(len(X_train_norm))
    X_s = X_train_norm[perm]
    y_s = y_train[perm]

    for b in range(num_batches):
        step += 1
        xb = X_s[b * batch_size : (b + 1) * batch_size]
        yb = y_s[b * batch_size : (b + 1) * batch_size]

        # Forward
        z1 = xb @ W1 + b1
        a1 = np.maximum(0, z1)
        z2 = a1 @ W2 + b2
        a2 = np.maximum(0, z2)
        z3 = a2 @ W3 + b3

        exp_z = np.exp(z3 - np.max(z3, axis=1, keepdims=True))
        probs = exp_z / np.sum(exp_z, axis=1, keepdims=True)

        # Backward
        dz3 = probs.copy()
        dz3[np.arange(len(yb)), yb] -= 1.0
        dz3 /= len(yb)

        dW3 = a2.T @ dz3
        db3 = np.sum(dz3, axis=0)

        da2 = dz3 @ W3.T
        dz2 = da2 * (z2 > 0)
        dW2 = a1.T @ dz2
        db2 = np.sum(dz2, axis=0)

        da1 = dz2 @ W2.T
        dz1 = da1 * (z1 > 0)
        dW1 = xb.T @ dz1
        db1 = np.sum(dz1, axis=0)

        grads = [dW1, db1, dW2, db2, dW3, db3]

        for i in range(len(params)):
            m_mom[i] = beta1 * m_mom[i] + (1 - beta1) * grads[i]
            v_mom[i] = beta2 * v_mom[i] + (1 - beta2) * (grads[i] ** 2)
            m_hat = m_mom[i] / (1 - beta1 ** step)
            v_hat = v_mom[i] / (1 - beta2 ** step)
            params[i] -= lr * m_hat / (np.sqrt(v_hat) + eps)

    # Validation
    z1_t = np.maximum(0, X_test_norm @ W1 + b1)
    z2_t = np.maximum(0, z1_t @ W2 + b2)
    logits_t = z2_t @ W3 + b3
    preds_t = np.argmax(logits_t, axis=1)
    test_acc = np.mean(preds_t == y_test) * 100

    if test_acc > best_acc:
        best_acc = test_acc
        best_params = [p.copy() for p in params]

    if (epoch + 1) % 5 == 0 or epoch == 0 or epoch == epochs - 1:
        print(f"Epoch {epoch + 1:2d}/{epochs:2d} | Test Accuracy: {test_acc:.2f}% (Best: {best_acc:.2f}%)")

print(f"\nFinal Best Test Accuracy: {best_acc:.2f}%")

# Compute class centroid prototypes for nearest-neighbor verification
prototypes = {}
for c_idx, c_name in enumerate(CLASSES):
    mask = (y_base == c_idx)
    proto = np.mean(X_base[mask], axis=0)
    prototypes[c_name] = proto.tolist()

print(f"Computed prototypes for all {len(CLASSES)} classes.")
