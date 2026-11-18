"""Selected function from the shoe-measurement prototype, not a complete app.

Requires opencv-contrib-python and numpy. marker_size_cm must be positive.
"""

import cv2
import numpy as np

OVERLAY_BLUE = (0, 165, 255)


def find_scale_and_markers(
    frame: np.ndarray, marker_size_cm: float
) -> tuple[float | None, np.ndarray, list[np.ndarray]]:
    dictionary = cv2.aruco.getPredefinedDictionary(cv2.aruco.DICT_4X4_50)
    detector = cv2.aruco.ArucoDetector(dictionary, cv2.aruco.DetectorParameters())
    corners, ids, _ = detector.detectMarkers(frame)
    overlay = frame.copy()

    if ids is None:
        return None, overlay, []

    cv2.aruco.drawDetectedMarkers(overlay, corners, ids, OVERLAY_BLUE)
    marker = corners[0].reshape(4, 2)
    side_lengths = [np.linalg.norm(marker[i] - marker[(i + 1) % 4]) for i in range(4)]
    marker_regions = [detected.reshape(4, 2) for detected in corners]
    return float(np.mean(side_lengths) / marker_size_cm), overlay, marker_regions
