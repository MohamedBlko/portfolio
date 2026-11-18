# Échiquier mécanique

Mécatronique | Commande de mouvement | Conception et essais de sous-systèmes

## Objectif
Développer un échiquier physique permettant une expérience de jeu en solo grâce à la détection, à la logique du jeu et aux mouvements mécaniques.

## Travail d'ingénierie
- Spécifier la détection des cases occupées par des capteurs magnétiques.
- Décomposer la détection, l'affichage et le mouvement en modules fonctionnels.
- Explorer les entrées par registre à décalage et la sortie sur matrice DEL.
- Préparer des plans de plateau et des modèles mécaniques pour le mécanisme proposé.

## Résultat
Le programme Wokwi original combine huit registres d'entrée pour 64 capteurs, l'affichage matriciel DEL, les appels au moteur d'échecs et la commande des trois axes. Les schémas et fichiers mécaniques archivés documentent la conception d'ensemble.

## Portée et limites
Cette animation est un modèle visuel de positionnement, pas un émulateur Arduino ni une reproduction du moteur Micro-Max original. La précision matérielle, le dégagement des pièces et le fonctionnement autonome complet ne sont pas validés indépendamment ici.

## Références
Programme de commande Wokwi original, spécifications fonctionnelles, schémas du plateau et essais Arduino des registres d'entrée. Le programme distingue le moteur d'échecs réutilisé du travail sur les capteurs, l'affichage et la commande des moteurs.
