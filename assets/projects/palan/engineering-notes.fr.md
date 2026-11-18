# Commande d'un palan par retour d'état

ELE8202, projet universitaire en équipe, automne 2025.

## Objectif
Déplacer un chariot avec charge suspendue en limitant l'oscillation résiduelle et
la commande. Le déplacement et l'oscillation forment un système couplé.

## Méthodes documentées
- Identification du modèle dynamique et discrétisation d'état.
- Retour d'état par placement de pôles et LQR.
- Sensibilité aux paramètres physiques.
- Génération de trajectoires de référence.
- Estimation d'état avec un observateur de Kalman.

## Objectifs de conception
Temps de réponse inférieur à 4 s, oscillation inférieure à 0,3 rad et commande
dans la plage +/-24 V. Ce sont des objectifs, pas des résultats indépendamment
confirmés pour chaque configuration présentée.

## Éléments publics
Les figures sauvegardées comprennent une réponse pour R = 1,00 et deux balayages
de paramètres pour des câbles de 0,1 m et de 1 m. Elles ne sont pas régénérées ici.
Leurs conditions initiales et réglages ne sont pas nécessairement identiques.

L'extrait MATLAB provient de compute_Kr.m. Il nécessite les matrices F et G, la
période d'échantillonnage et la Control System Toolbox. Ce n'est pas une simulation
complète ni une commande prête à déployer.

## Contribution
Travail d'équipe. Ce résumé ne revendique pas une réalisation individuelle de la
modélisation, du code, des expériences ou du rapport.
