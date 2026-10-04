import sys
import types
import os

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

print("Vision imported successfully!")
print("Checking HandLandmarker...")
