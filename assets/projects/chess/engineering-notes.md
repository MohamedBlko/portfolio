# Mechanical chess board

Mechatronics | Motion control | Design and subsystem tests

## Objective
Develop a physical board capable of supporting a solo chess experience through sensing, game logic and mechanical movement.

## Engineering work
- Specify occupied-square sensing with magnetic sensors.
- Break down sensing, display and motion into functional modules.
- Explore shift-register inputs and LED-matrix output.
- Prepare board layouts and mechanical models for the proposed mechanism.

## Outcome
The original Wokwi sketch combines eight input registers for 64 sensors, LED-matrix updates, chess-engine calls and three-axis motor commands. The archived diagrams and mechanical files document the wider design.

## Limits
This animation is a visual positioning model, not an Arduino firmware emulator or a reproduction of the original Micro-Max engine. Hardware accuracy, collision clearance and full autonomous operation have not been independently validated here.

## Evidence
Original Wokwi control sketch, functional specifications, board diagrams and archived Arduino input-register tests. The source sketch identifies the inherited chess engine separately from the sensor, display and motor-control work.
