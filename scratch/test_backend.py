import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import backend.main as b

print("Backend imported successfully!")
print("Model loaded:", b.MODEL_LOADED)
print("Classes count:", len(b.MODEL_DATA.get("classes", [])))
print("Classes:", b.MODEL_DATA.get("classes", []))
print("Test accuracy:", b.MODEL_DATA.get("test_accuracy"))
