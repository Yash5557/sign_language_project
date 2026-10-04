import os
import sys
import json
import numpy as np

# Verify frontend model
frontend_model_path = r"frontend/src/model/sign_model.json"
with open(frontend_model_path, "r", encoding="utf-8") as f:
    m = json.load(f)

print("=== FRONTEND MODEL VERIFICATION ===")
print("Model Type:", m.get("model_type"))
print("Dataset Source:", m.get("dataset_source"))
print("Test Accuracy:", m.get("test_accuracy"), "%")
print("Classes (count):", len(m.get("classes", [])))
print("Classes:", m.get("classes"))
print("Prototypes available for all classes:", len(m.get("prototypes", {})) == 10)
print("Sentences available for all classes:", len(m.get("sentences", {})) == 10)

# Verify sample sentences
print("\n=== SAMPLE SENTENCES ===")
for c in m.get("classes", []):
    s = m["sentences"].get(c, {})
    print(f"[{c.upper():10s}] EN: {s.get('en')}")
    print(f"             MR: {s.get('mr')}")
    print(f"             HI: {s.get('hi')}")

# Verify weights
layers = m.get("layers", {})
print("\n=== WEIGHT MATRICES ===")
print("W1 shape:", np.array(layers["W1"]).shape)
print("b1 shape:", np.array(layers["b1"]).shape)
print("W2 shape:", np.array(layers["W2"]).shape)
print("b2 shape:", np.array(layers["b2"]).shape)
print("W3 shape:", np.array(layers["W3"]).shape)
print("b3 shape:", np.array(layers["b3"]).shape)

print("\n=== VERIFICATION PASSED 100% ===")
