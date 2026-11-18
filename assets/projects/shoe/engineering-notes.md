# Camera-based shoe measurement

Measurement prototype using Python, OpenCV, NumPy and PySide6.

## Pipeline

1. Capture an image from a USB camera.
2. Detect an ArUco marker of known physical size.
3. Estimate pixels per centimeter from the marker's mean edge length.
4. Segment the object and analyze the contour.
5. Apply calibration and save an annotated image with structured JSON data.

The reference marker described by the prototype documentation has a 5 cm edge.
The desktop interface supports camera selection and measurement profiles.
The stored data includes dimensions, scale and contour coordinates.

## Evidence

Two recorded measurement captures and a contour-analysis view are included.
The numeric overlays are outputs of the prototype, not independent ground
truth or an accuracy certification.

## Limits

Lighting, segmentation, camera alignment, lens distortion and the object's
height relative to the marker affect the measurement. Shoe exterior length
does not directly establish usable interior length or a guaranteed size.
No validated measurement-error distribution is claimed here.

The browser calculator demonstrates only a pixel-to-centimeter scale
conversion. It does not access the camera or execute the segmentation pipeline.

The Python download preserves the marker-scale function from main.py with its
imports. It is not the entire desktop application and assumes a positive
marker size. OpenCV contrib and NumPy are required.
