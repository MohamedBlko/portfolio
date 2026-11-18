# Mesure de chaussures par caméra

Prototype utilisant Python, OpenCV, NumPy et PySide6.

## Chaîne de traitement
1. Acquérir une image d'une caméra USB.
2. Détecter un marqueur ArUco de taille connue.
3. Estimer les pixels par centimètre à partir de la moyenne de ses côtés.
4. Segmenter l'objet et analyser le contour.
5. Appliquer l'étalonnage puis sauvegarder une image annotée et des données JSON.

Le marqueur de référence a un côté de 5 cm. L'interface permet de sélectionner la
caméra et les profils de mesure. Les données comprennent dimensions, échelle et
coordonnées du contour.

## Éléments publics
Captures de mesure enregistrées et vue d'analyse du contour. Les valeurs affichées
sont des sorties du prototype, pas une référence indépendante ni une certification.

## Limites
L'éclairage, la segmentation, l'alignement, la distorsion optique et la hauteur de
l'objet par rapport au marqueur influencent les mesures. La longueur extérieure
d'une chaussure ne détermine pas sa longueur intérieure ni une pointure garantie.
Aucune distribution d'erreur validée n'est revendiquée.

Le calculateur du site illustre uniquement la conversion pixels-centimètres. Il
n'accède pas à la caméra et n'exécute pas la segmentation.

L'extrait Python conserve la fonction d'échelle de main.py et ses imports, pas
l'application complète. Il suppose une taille de marqueur positive et nécessite
OpenCV contrib et NumPy.
