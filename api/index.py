import sys
import os

# Add repo root to sys.path so 'backend' and 'ml_pipeline' are discoverable
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from backend.main import app
