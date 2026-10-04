import os
import cv2
import numpy as np
import mediapipe as mp

# Path configuration
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(SCRIPT_DIR, "dataset")

# 3 Classes, 30 sequences per class, 30 frames per sequence
ACTIONS = np.array(["hello", "thank_you", "yes"])
NO_SEQUENCES = 30
SEQUENCE_LENGTH = 30

# Initialize MediaPipe Holistic
mp_holistic = mp.solutions.holistic
mp_drawing = mp.solutions.drawing_utils

# Create directory tree for datasets
for action in ACTIONS:
    for sequence in range(NO_SEQUENCES):
        os.makedirs(os.path.join(DATA_PATH, action, str(sequence)), exist_ok=True)

def extract_keypoints(results):
    """
    Extracts 21 3D coordinates per hand (x, y, z = 63 values per hand, 126 total per frame).
    """
    lh = (
        np.array([[res.x, res.y, res.z] for res in results.left_hand_landmarks.landmark]).flatten()
        if results.left_hand_landmarks
        else np.zeros(21 * 3)
    )
    rh = (
        np.array([[res.x, res.y, res.z] for res in results.right_hand_landmarks.landmark]).flatten()
        if results.right_hand_landmarks
        else np.zeros(21 * 3)
    )
    return np.concatenate([lh, rh])

def collect_data():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not access webcam.")
        return

    with mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
        for action in ACTIONS:
            for sequence in range(NO_SEQUENCES):
                for frame_num in range(SEQUENCE_LENGTH):
                    ret, frame = cap.read()
                    if not ret:
                        print("Failed to capture frame from webcam.")
                        break

                    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    image.flags.writeable = False
                    results = holistic.process(image)
                    image.flags.writeable = True
                    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

                    # Draw hand landmarks
                    if results.left_hand_landmarks:
                        mp_drawing.draw_landmarks(image, results.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS)
                    if results.right_hand_landmarks:
                        mp_drawing.draw_landmarks(image, results.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS)

                    # Visual prompts for collection transitions
                    if frame_num == 0:
                        cv2.putText(
                            image,
                            f"STARTING COLLECTION: '{action.upper()}' | Sequence #{sequence}",
                            (20, 50),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            0.7,
                            (0, 255, 0),
                            2,
                            cv2.LINE_AA,
                        )
                        cv2.imshow("Webcam Keypoint Recorder", image)
                        cv2.waitKey(1000)
                    else:
                        cv2.putText(
                            image,
                            f"Recording '{action.upper()}' | Seq: {sequence}/{NO_SEQUENCES} | Frame: {frame_num}/{SEQUENCE_LENGTH}",
                            (20, 50),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            0.6,
                            (0, 0, 255),
                            1,
                            cv2.LINE_AA,
                        )
                        cv2.imshow("Webcam Keypoint Recorder", image)

                    keypoints = extract_keypoints(results)
                    npy_path = os.path.join(DATA_PATH, action, str(sequence), f"{frame_num}.npy")
                    np.save(npy_path, keypoints)

                    if cv2.waitKey(10) & 0xFF == ord("q"):
                        print("Collection interrupted by user.")
                        cap.release()
                        cv2.destroyAllWindows()
                        return

    cap.release()
    cv2.destroyAllWindows()
    print("Data collection completed successfully.")

if __name__ == "__main__":
    collect_data()
