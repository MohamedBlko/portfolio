# Odroid C2 Linux build environment

ELE4205 | 2025 | Build archive

## Objective
Configure and organize an embedded Linux environment for an Odroid C2 target.

## Engineering work
- Maintain a course-specific BitBake layer and recipe search paths.
- Associate the layer with the Yocto release used by the environment.
- Separate build configuration from generated target images.
- Document the boundary between the operating-system build and the application.

## Outcome
The archive contains Poky, meta-openembedded, a meta-ele4205 layer and target image artifacts. The public configuration excerpt is drawn from the actual layer file.

## Limits
The final camera-security application source was not identified. Buildroot, a completed QR reader and a fully reproducible application release are not claimed by this case study.

## Evidence
Archived meta-ele4205 layer configuration and Odroid C2 build artifacts. The cover is a typeset excerpt of a real file, not a fabricated IDE screenshot.
