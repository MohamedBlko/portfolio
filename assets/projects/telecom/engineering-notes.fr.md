# Communications et codage de canal

Systèmes de communication | Correction d'erreurs | Modèles et scripts

## Objectif
Explorer une chaîne de communication, de la génération et de l'analyse spectrale au décodage par blocs.

## Travail d'ingénierie
- Organiser un modèle Simulink d'analyse de signaux et ses paramètres.
- Préparer des flux de bits pour le décodage par blocs.
- Regrouper les données reçues en mots de sept bits.
- Utiliser le décodeur de Hamming puis reconstituer le flux décodé.

## Résultat
L'archive comprend des modèles de simulation et des fonctions MATLAB. Un schéma de l'énoncé explique le montage d'analyse attendu; il est identifié comme une référence, pas comme le résultat d'une expérience terminée.

## Portée et limites
Les modèles et le matériel radio n'ont pas été exécutés pour le portfolio. La fonction de décodage suppose le format de trame et la longueur d'en-tête de l'exercice. Ce n'est pas un récepteur radio généraliste.

## Références
Fonction MATLAB de décodage archivée et énoncé du TP3 d'ELE3701A. Les schémas de référence sont explicitement identifiés.
