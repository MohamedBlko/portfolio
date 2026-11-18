# State-feedback crane control

ELE8202, academic team project, fall 2025.

## Objective

Move a cart with a suspended load while limiting residual swing and actuator
command. The cart displacement and load oscillation form a coupled system.

## Methods documented in the project

- Dynamic-model identification and state-space discretization.
- State feedback using pole placement and LQR.
- Sensitivity studies for physical parameter changes.
- Reference-trajectory generation.
- State estimation with a Kalman observer.

## Design targets

The report lists response time below 4 seconds, swing below 0.3 radians and
command within +/-24 V. These are targets, not independently confirmed results
for every configuration shown on the website.

## Public evidence

The figures are original saved images: a response for R = 1.00 and two
pole-placement parameter sweeps labeled with cable lengths of 0.1 m and 1 m.
They come from the project archive and were not regenerated for the portfolio.
Do not infer that the three figures share all initial conditions or tuning.

The MATLAB download is an excerpt from compute_Kr.m. It requires the plant's
F and G matrices, the sample period and Control System Toolbox. It is not a
complete plant simulation or a standalone controller deployment.

## Contribution

The original report identifies a team project. This summary does not claim
sole authorship of the modeling, code, experiments or report.
