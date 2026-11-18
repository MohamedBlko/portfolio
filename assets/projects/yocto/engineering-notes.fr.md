# Environnement Linux pour Odroid C2

Linux embarqué | Images cibles | Environnement de compilation

## Objectif
Configurer et organiser un environnement Linux embarqué pour une cible Odroid C2.

## Travail d'ingénierie
- Maintenir une couche BitBake du cours et les chemins de recherche des recettes.
- Associer la couche à la version de Yocto utilisée.
- Séparer la configuration de compilation des images cibles générées.
- Documenter la frontière entre la construction du système et l'application.

## Résultat
L'archive contient Poky, meta-openembedded, une couche meta-ele4205 et des images cibles. L'extrait de configuration public provient du fichier réel de cette couche.

## Portée et limites
Le code final de l'application de caméra de sécurité n'a pas été identifié. Cette étude ne revendique ni une réalisation Buildroot, ni un lecteur QR terminé, ni une version applicative entièrement reproductible.

## Références
Configuration de la couche meta-ele4205 et artefacts Odroid C2 archivés. L'illustration est une mise en forme d'un vrai fichier, pas une fausse capture d'environnement de développement.
