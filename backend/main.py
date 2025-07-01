import cv2
import time
import threading
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

# Configuration
CAMERA_URL = "http://192.168.1.22:8080/video"
FRAME_WIDTH, FRAME_HEIGHT = 640, 480

latest_detections = []
lock = threading.Lock()

def detect_colors(frame):
    hsvFrame = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    detections = []

    # Red color range
    red_lower = np.array([136, 87, 111], np.uint8)
    red_upper = np.array([180, 255, 255], np.uint8)
    red_mask = cv2.inRange(hsvFrame, red_lower, red_upper)

    # Green color range
    green_lower = np.array([25, 52, 72], np.uint8)
    green_upper = np.array([102, 255, 255], np.uint8)
    green_mask = cv2.inRange(hsvFrame, green_lower, green_upper)

    # Blue color range
    blue_lower = np.array([94, 80, 2], np.uint8)
    blue_upper = np.array([120, 255, 255], np.uint8)
    blue_mask = cv2.inRange(hsvFrame, blue_lower, blue_upper)

    # Dilation kernel
    kernel = np.ones((5, 5), "uint8")

    # Red
    red_mask = cv2.dilate(red_mask, kernel)
    contours, _ = cv2.findContours(red_mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    for contour in contours:
        area = cv2.contourArea(contour)
        if area > 300:
            x, y, w, h = cv2.boundingRect(contour)
            detections.append({
                "id": f"red_{int(time.time()*1000)}",
                "color": "red",
                "confidence": 95.0,
                "x": int(x),
                "y": int(y),
                "width": int(w),
                "height": int(h),
                "timestamp": time.strftime("%H:%M:%S"),
            })

    # Green
    green_mask = cv2.dilate(green_mask, kernel)
    contours, _ = cv2.findContours(green_mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    for contour in contours:
        area = cv2.contourArea(contour)
        if area > 300:
            x, y, w, h = cv2.boundingRect(contour)
            detections.append({
                "id": f"green_{int(time.time()*1000)}",
                "color": "green",
                "confidence": 95.0,
                "x": int(x),
                "y": int(y),
                "width": int(w),
                "height": int(h),
                "timestamp": time.strftime("%H:%M:%S"),
            })

    # Blue
    blue_mask = cv2.dilate(blue_mask, kernel)
    contours, _ = cv2.findContours(blue_mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    for contour in contours:
        area = cv2.contourArea(contour)
        if area > 300:
            x, y, w, h = cv2.boundingRect(contour)
            detections.append({
                "id": f"blue_{int(time.time()*1000)}",
                "color": "blue",
                "confidence": 95.0,
                "x": int(x),
                "y": int(y),
                "width": int(w),
                "height": int(h),
                "timestamp": time.strftime("%H:%M:%S"),
            })

    return detections

def camera_loop():
    cap = cv2.VideoCapture(CAMERA_URL)
    if not cap.isOpened():
        print("❌ Failed to open camera stream:", CAMERA_URL)
        return

    global latest_detections  # Move global declaration to the top of the function

    while True:
        ret, frame = cap.read()
        if not ret:
            time.sleep(0.1)
            # Clear detections if no frame is read
            with lock:
                latest_detections = []
            continue

        frame = cv2.resize(frame, (FRAME_WIDTH, FRAME_HEIGHT))
        detections = detect_colors(frame)

        # Always replace with only current frame's detections
        with lock:
            latest_detections = detections

        time.sleep(0.1)  # adjust FPS

# Start background detection loop
threading.Thread(target=camera_loop, daemon=True).start()

@app.get("/api/detections")
def get_detections():
    with lock:
        return JSONResponse(latest_detections)
