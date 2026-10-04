import os
import tensorflow as tf

def export_tflite():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    h5_path = os.path.join(script_dir, "sign_model.h5")
    target_dir = os.path.abspath(os.path.join(script_dir, "../frontend/assets/models"))
    os.makedirs(target_dir, exist_ok=True)
    tflite_path = os.path.join(target_dir, "sign_model.tflite")

    if not os.path.exists(h5_path):
        raise FileNotFoundError(f"Trained model not found at {h5_path}. Run 2_train_model.py first.")

    print(f"Loading Keras model from {h5_path}...")
    model = tf.keras.models.load_model(h5_path)

    print("Converting model to TensorFlow Lite format...")
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    converter.target_spec.supported_ops = [
        tf.lite.OpsSet.TFLITE_BUILTINS,
        tf.lite.OpsSet.SELECT_TF_OPS
    ]
    converter._experimental_lower_tensor_list_ops = False

    tflite_model = converter.convert()

    with open(tflite_path, "wb") as f:
        f.write(tflite_model)

    print(f"Successfully exported TFLite model to: {tflite_path}")

if __name__ == "__main__":
    export_tflite()
