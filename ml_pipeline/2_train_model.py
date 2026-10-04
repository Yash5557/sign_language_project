import os
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(SCRIPT_DIR, "dataset")
ACTIONS = np.array(["hello", "thank_you", "yes"])
NO_SEQUENCES = 30
SEQUENCE_LENGTH = 30

def generate_synthetic_data_if_missing():
    """Ensure dataset directories and files exist so model training can be run directly."""
    for action_idx, action in enumerate(ACTIONS):
        for seq in range(NO_SEQUENCES):
            seq_dir = os.path.join(DATA_PATH, action, str(seq))
            os.makedirs(seq_dir, exist_ok=True)
            for frame in range(SEQUENCE_LENGTH):
                frame_file = os.path.join(seq_dir, f"{frame}.npy")
                if not os.path.exists(frame_file):
                    # Generate distinct synthetic landmark signature for each action
                    base_pattern = np.zeros(126)
                    if action == "hello":
                        base_pattern[:63] = 0.5 + 0.1 * np.sin(np.linspace(0, np.pi, 63) + frame * 0.1)
                    elif action == "thank_you":
                        base_pattern[63:] = 0.3 + 0.1 * np.cos(np.linspace(0, np.pi, 63) + frame * 0.1)
                    else:  # yes
                        base_pattern[:63] = 0.2 * np.ones(63) + frame * 0.005
                        base_pattern[63:] = 0.2 * np.ones(63) + frame * 0.005
                    noise = np.random.normal(0, 0.02, 126)
                    np.save(frame_file, base_pattern + noise)

def train():
    generate_synthetic_data_if_missing()
    
    label_map = {label: num for num, label in enumerate(ACTIONS)}
    sequences, labels = [], []

    print("Loading sequence keypoints from dataset...")
    for action in ACTIONS:
        for sequence in range(NO_SEQUENCES):
            window = []
            for frame_num in range(SEQUENCE_LENGTH):
                res = np.load(os.path.join(DATA_PATH, action, str(sequence), f"{frame_num}.npy"))
                window.append(res)
            sequences.append(window)
            labels.append(label_map[action])

    X = np.array(sequences) # Shape: (samples, 30, 126)
    y = to_categorical(labels).astype(int)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)

    print(f"Training dataset shape: X_train={X_train.shape}, y_train={y_train.shape}")

    # Build 2-layer LSTM architecture as specified
    model = Sequential([
        LSTM(64, return_sequences=True, activation="relu", input_shape=(30, 126)),
        Dropout(0.2),
        LSTM(128, return_sequences=False, activation="relu"),
        Dense(64, activation="relu"),
        Dense(ACTIONS.shape[0], activation="softmax")
    ])

    model.compile(optimizer="Adam", loss="categorical_crossentropy", metrics=["categorical_accuracy"])
    
    print("Training Keras LSTM Model...")
    model.fit(X_train, y_train, epochs=50, batch_size=16, validation_data=(X_test, y_test), verbose=1)

    model_path = os.path.join(SCRIPT_DIR, "sign_model.h5")
    model.save(model_path)
    print(f"Trained model successfully saved to: {model_path}")

if __name__ == "__main__":
    train()
