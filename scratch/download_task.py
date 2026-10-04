import urllib.request
import os

url = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
dest = os.path.join(os.path.dirname(__file__), "hand_landmarker.task")

if not os.path.exists(dest):
    print("Downloading hand_landmarker.task...")
    urllib.request.urlretrieve(url, dest)
    print(f"Downloaded! Size: {os.path.getsize(dest)} bytes")
else:
    print(f"Already exists! Size: {os.path.getsize(dest)} bytes")
