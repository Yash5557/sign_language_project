import os
import math
import json
import numpy as np
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

# Classes in dataset
CLASSES = ['family', 'hello', 'help', 'house', 'i_love_you', 'no', 'please', 'sorry', 'thankyou', 'yes']

def compute_angle(a, b, c):
    """Compute 3D angle at vertex b between vectors (a - b) and (c - b) in degrees."""
    ba = a - b
    bc = c - b
    norm_ba = np.linalg.norm(ba)
    norm_bc = np.linalg.norm(bc)
    if norm_ba < 1e-7 or norm_bc < 1e-7:
        return 0.0
    cosine = np.dot(ba, bc) / (norm_ba * norm_bc)
    cosine = np.clip(cosine, -1.0, 1.0)
    return float(np.degrees(np.arccos(cosine)))

def extract_hand_features(landmarks):
    """
    Extract 93 canonical, translation and scale-invariant features from 21 landmarks:
    - 63 normalized coords (centered on wrist, divided by wrist->middle_mcp distance)
    - 15 joint angles (MCP, PIP, DIP for all 5 fingers)
    - 12 normalized fingertip distances
    - 3 palm normal vector
    """
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

    # 12 normalized distances
    # tips: thumb=4, index=8, middle=12, ring=16, pinky=20
    dist_pairs = [
        (4, 8), (4, 12), (4, 16), (4, 20),
        (8, 12), (12, 16), (16, 20),
        (0, 4), (0, 8), (0, 12), (0, 16), (0, 20)
    ]
    dists_feat = [float(np.linalg.norm(pts_norm[a] - pts_norm[b])) for (a, b) in dist_pairs]

    # Palm normal vector: cross product of (index_mcp - wrist) and (pinky_mcp - wrist)
    v1 = pts_centered[5]
    v2 = pts_centered[17]
    normal = np.cross(v1, v2)
    norm_val = np.linalg.norm(normal)
    if norm_val > 1e-6:
        normal = normal / norm_val
    normal_feat = normal.tolist()

    return coords_feat + angles_feat + dists_feat + normal_feat  # 63 + 15 + 12 + 3 = 93

def extract_full_sample(hand_landmarks_list):
    """
    Extract unified feature vector from 1 or 2 hands.
    Total features: 190
    - is_two_hands (1)
    - hand0_features (93)
    - hand1_features (93)
    - inter_hand_distance / vector (3)
    """
    zeros93 = [0.0] * 93
    if not hand_landmarks_list:
        return [0.0] + zeros93 + zeros93 + [0.0, 0.0, 0.0]

    n_hands = len(hand_landmarks_list)
    h0_feat = extract_hand_features(hand_landmarks_list[0])

    if n_hands >= 2:
        h1_feat = extract_hand_features(hand_landmarks_list[1])
        # Vector between wrists
        w0 = np.array([hand_landmarks_list[0][0].x, hand_landmarks_list[0][0].y, hand_landmarks_list[0][0].z])
        w1 = np.array([hand_landmarks_list[1][0].x, hand_landmarks_list[1][0].y, hand_landmarks_list[1][0].z])
        diff = (w1 - w0).tolist()
        return [1.0] + h0_feat + h1_feat + diff
    else:
        return [0.0] + h0_feat + zeros93 + [0.0, 0.0, 0.0]

print("Feature extractor defined. Total feature dimension:", 1 + 93 + 93 + 3)
