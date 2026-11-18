function [Kr_table, eig_table] = compute_Kr(F, G, Tech, R_values)
% Project excerpt. Header and comments condensed.
% F: 4x4 discrete state matrix; G: 4x1 input matrix.
% Tech: sampling period in seconds; R_values: desired pole radii.
% Requires MATLAB Control System Toolbox. The plant model is not included.

R_values = R_values(:)';
nR = length(R_values);
Kr_table = zeros(nR, 4);
eig_table = zeros(nR, 4);

for i = 1:nR
    R = R_values(i);
    s_des = [-R, -R, ...
             -R*cosd(45) + 1j*R*sind(45), ...
             -R*cosd(45) - 1j*R*sind(45)];
    z_des = exp(s_des * Tech);
    Kr = acker(F, G, z_des);
    Kr_table(i,:) = Kr;
    eig_table(i,:) = eig(F - G*Kr);
end
end
