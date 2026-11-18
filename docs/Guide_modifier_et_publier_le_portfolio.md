# Modifier et publier ton portfolio

Guide pratique pour Mohamed Marou Belko · Version du 18 novembre 2026

## 1. La routine à retenir

Ce guide correspond au portfolio présent dans ce dossier. Il ne nécessite ni Codex, ni abonnement à un assistant. Les chemins et les exceptions décrits ici sont propres à cette version du site.

- Dossier local : `C:\Users\moham\OneDrive\Documents\Porfolio`
- Dépôt : [MohamedBlko/portfolio](https://github.com/MohamedBlko/portfolio)
- Site public : [mohamedblko.github.io/portfolio](https://mohamedblko.github.io/portfolio/)
- Versions : ajouter `?lang=fr` ou `?lang=en` à l'adresse du site.

**Pour une modification ordinaire :** récupérer la dernière version, modifier les sources, générer les pages, tester, regarder le résultat, puis publier. Enregistrer un fichier ne le publie pas sur Internet.

Ouvre PowerShell dans le dossier du projet. Lance les commandes suivantes **une par une**. Arrête-toi dès qu'une commande affiche une erreur : ne publie pas tant qu'elle n'est pas comprise et corrigée.

```powershell
cd "C:\Users\moham\OneDrive\Documents\Porfolio"
node scripts/build-case-studies.mjs
node scripts/build-translations.mjs
py -3 scripts/prepare-site.py
node scripts/check-case-studies.mjs
node scripts/test-portfolio.mjs
node scripts/test-project-models.mjs
node scripts/test-chess-controller.mjs
py -3 scripts/audit-portfolio.py
```

Les trois premières commandes fabriquent et harmonisent les fichiers à publier. Les suivantes vérifient le site. PowerShell peut continuer après l'échec d'un programme : c'est pourquoi il faut contrôler chaque résultat.

**Règle essentielle :** modifier une page générée directement peut sembler fonctionner, puis disparaître à la prochaine génération. La carte des fichiers, au chapitre 3, indique les bonnes sources.

**Avant tout :** garde les documents originaux et les archives confidentielles hors du dépôt public. GitHub Pages ne constitue pas un espace privé de stockage.

<!-- PAGEBREAK -->

## 2. Préparer ton ordinateur

Installe un éditeur comme Visual Studio Code, Node.js en version LTS, Python 3 et GitHub Desktop. Git est nécessaire seulement si tu souhaites aussi utiliser les commandes Git du chapitre 9. Aucun `npm install` n'est requis pour ce site statique dans son état actuel.

Téléchargements officiels : [VS Code](https://code.visualstudio.com/), [Node.js](https://nodejs.org/), [Python](https://www.python.org/downloads/windows/), [GitHub Desktop](https://desktop.github.com/), [Git pour Windows](https://git-scm.com/downloads/win).

Après installation, ferme puis rouvre PowerShell. Vérifie :

```powershell
node --version
py -3 --version
py -3 -m pip install --user lxml
```

`lxml` sert aux scripts Python de préparation et d'audit. Si `py` n'est pas reconnu mais que `python --version` fonctionne avec Python 3, remplace partout `py -3` par `python`. N'utilise pas les chemins internes de l'application Codex : ton installation doit rester indépendante.

### Ouvrir le bon projet

Dans VS Code, choisis **Fichier > Ouvrir un dossier**, puis le dossier `Porfolio`. Le terminal intégré s'ouvre avec **Terminal > Nouveau terminal**. Vérifie qu'il contient bien `index.html`, `case-studies.json` et le dossier `scripts`.

Dans GitHub Desktop, ajoute ce dépôt local existant avec **File > Add local repository**. Ne clone pas un autre dépôt par-dessus ce dossier. Vérifie le dépôt `MohamedBlko/portfolio` et la branche `main`.

### Sauvegarder avant d'éditer

Si aucun changement local n'est en attente, utilise **Fetch origin**, puis **Pull origin** si proposé. Si des changements existent déjà, sauvegarde-les ou fais un commit cohérent avant de récupérer des modifications distantes. Ne les efface pas pour débloquer l'opération.

Pour une grosse modification, une copie de sécurité datée du dossier, conservée ailleurs, est utile. Ne place pas cette copie dans le dépôt lui-même et ne la publie pas.

### Bien enregistrer les fichiers

Utilise UTF-8 pour les accents. En JSON : guillemets doubles, aucune virgule après le dernier élément, aucun commentaire. Les apostrophes sont autorisées dans une chaîne entre guillemets doubles. Fais de petites modifications et teste régulièrement.

<!-- PAGEBREAK -->

## 3. Où modifier quoi ?

### Sources à modifier

- `index.html` : accueil, présentation et compteur de projets.
- `about.html`, `skills.html`, `process.html`, `timeline.html`, `contact.html` : pages principales écrites à la main.
- `case-studies.json` : contenu anglais des projets.
- `locales/case-studies.fr.json` : contenu français, classé par identifiant de projet.
- `locales/fr.json` : traduction des textes communs et des pages manuelles.
- `assets/projects/media-index.json` : liste des images et vidéos de chaque projet.
- `locales/media.fr.json` : traduction des légendes.
- `styles.css` : apparence générale ; `case-study.css` : pages de projets et simulations.
- `script.js` : accueil 3D, menu, formulaire et comportements communs.
- `case-study.js` : galerie et interactions parking, palan et mesure de chaussures.
- `scripts/prepare-site.py` : éléments partagés, notamment le pied de page.

### Fichiers générés : ne pas modifier directement

`projects.html`, `translations.js` et la plupart des `project-*.html` sont reconstruits par les scripts. Les notes techniques `engineering-notes.md` et `engineering-notes.fr.md` des projets générés le sont aussi.

### Trois exceptions importantes

`project-parking.html`, `project-palan.html` et `project-shoe.html` sont des pages particulières écrites à la main. Leur contenu principal se modifie directement, ainsi que leurs notes techniques EN/FR si nécessaire. Cependant, leur galerie reste générée : ne modifie pas le bloc compris entre ces marqueurs :

```html
<!-- ARCHIVE_MEDIA_START -->
<!-- ARCHIVE_MEDIA_END -->
```

La liste des médias et leurs légendes se modifient dans les fichiers JSON, même pour ces trois projets. Le registre des projets doit aussi rester cohérent avec les titres de leurs pages manuelles.

### Pourquoi relancer la préparation ?

`prepare-site.py` harmonise navigation et pied de page, et ajoute des versions de cache `?v=...` aux scripts et styles. Relance-le après une modification CSS ou JavaScript, puis publie aussi les HTML modifiés. Sinon, certains visiteurs peuvent conserver l'ancienne apparence.

<!-- PAGEBREAK -->

## 4. Textes, langues, contact et CV

### Modifier un texte et sa traduction

Les pages sources utilisent l'anglais. Pour un paragraphe dans `about.html`, modifie le texte anglais puis sa correspondance dans `locales/fr.json`. La clé doit correspondre au texte anglais affiché, après normalisation des espaces.

Exemple d'entrée à insérer dans l'objet JSON, avec une virgule si une autre entrée suit :

```json
"Available for site visits and field work.":
  "Disponible pour les visites de site et le travail terrain."
```

Si la phrase anglaise change, l'ancienne clé ne traduira plus la nouvelle phrase. Regénère avec la routine du chapitre 1 et vérifie les deux langues. Pour un projet généré, modifie plutôt les deux registres de projets. Pour une légende, utilise `locales/media.fr.json`.

Le choix de langue est mémorisé dans le navigateur ; utilise explicitement `?lang=fr` et `?lang=en` pour contrôler les deux versions. Les textes intégrés dans une image ne sont pas traduits automatiquement.

### Coordonnées et formulaire

Modifie les coordonnées dans `contact.html`. Pour les coordonnées du pied de page de toutes les pages, modifie la constante `FOOTER` dans `scripts/prepare-site.py`, puis regénère. Une modification directe d'un pied de page HTML sera écrasée.

Le formulaire utilise `https://formspree.io/f/xppdpvbw`. Le destinataire des messages se règle dans le compte Formspree associé. Changer un lien `mailto:` ne change pas ce destinataire. Préserve les attributs `id`, `name` et les classes du formulaire : le code JavaScript peut en dépendre. Ne mets jamais de clé privée ou de mot de passe dans le site.

### Remplacer le CV

Le plus simple est de remplacer le PDF anglais en gardant son nom exact :

```text
assets/CV_Mohamed_Marou_Belko_Generic.pdf
```

Si tu changes ce nom, adapte aussi les liens sources et les références dans `prepare-site.py`, puis teste le téléchargement. Le bouton FR précise actuellement que le CV est en anglais : changer de langue ne crée pas un CV français. Un véritable CV français demande un second PDF et l'adaptation des liens par langue.

**Changer ton nom :** il n'existe pas de champ central unique. Recherche l'ancien nom dans VS Code. Les pages manuelles et l'en-tête de `project-parking.html` doivent être cohérents ; ce dernier est repris par le générateur. Le pied de page vient de `FOOTER`.

<!-- PAGEBREAK -->

## 5. Modifier ou ajouter un projet

### Modifier un projet existant

Dans `case-studies.json`, retrouve son `slug`, par exemple `plc`. Modifie son titre, résumé, objectif, travaux et résultats. Modifie ensuite l'objet `plc` dans `locales/case-studies.fr.json`. Pour commencer, copie la structure d'un projet généré existant plutôt que d'inventer des champs.

Principaux champs : `title` = titre ; `category` = domaine ; `context` = contexte ; `status` = état ; `summary` = résumé ; `objective` = objectif ; `work` = travaux ; `outcome` = résultat ; `limits` = limites ; `sources` = références. Garde les types existants : un tableau reste un tableau, une chaîne reste une chaîne.

Les tableaux `tags`, `work` et `flow` doivent avoir la même longueur et le même ordre en EN et FR. Une traduction manquante ou un nombre d'éléments différent peut arrêter la génération.

Utilise des titres descriptifs sans sigle de cours. Ajoute seulement des chiffres et responsabilités vérifiables. Une simulation illustrative n'est pas une validation industrielle.

### Ajouter un nouveau projet généré

1. Ajoute un objet au tableau anglais en conservant les champs requis du modèle existant.
2. Choisis un `slug` unique, en minuscules sans accents, par exemple `controle-moteur`. Il donnera `project-controle-moteur.html`.
3. Ajoute le même identifiant dans le registre français et traduis tous les champs correspondants.
4. Ajoute les médias et légendes si disponibles, selon le chapitre 6. Le champ optionnel `cover` choisit l'image de couverture.
5. Dans `scripts/check-case-studies.mjs`, adapte le nombre attendu : `assert.equal(projects.length, 19);` devient 20 si tu ajoutes un vingtième projet.
6. Actualise aussi le compteur affiché dans `index.html`. Les compteurs documentaires éventuels ne sont pas tous automatiques.
7. Exécute la routine complète. La nouvelle page HTML sera créée automatiquement ; contrôle-la avant de publier.

N'ajoute pas `authored: true` : ce mode est réservé aux trois pages particulières. `generic: true` désigne une présentation confidentielle sans médias d'origine ; conserve cette protection pour les projets concernés.

### Retirer un projet

Retire ses entrées EN/FR et ajuste les compteurs. Corrige les liens qui le visent, notamment dans les pages manuelles. Le générateur ne supprime pas l'ancien HTML : après sauvegarde, retire aussi les fichiers publics devenus inutiles. Sans cela, l'ancienne URL reste accessible. Supprimer un fichier ne supprime pas ses anciennes versions de l'historique Git.

<!-- PAGEBREAK -->

## 6. Images, vidéos et figures de PDF

Place uniquement les médias publiables dans `assets/projects/<slug>/`. Utilise des noms simples, minuscules, sans espaces ni accents. Respecte exactement les majuscules/minuscules : une erreur tolérée par Windows peut produire une image absente sur GitHub.

### Ajouter une image

Prépare une image lisible, par exemple de 1600 à 2200 pixels de large, et une miniature d'environ 500 à 600 pixels. Ce sont des repères, pas des dimensions imposées. Ajoute ensuite un objet dans le tableau du bon projet de `assets/projects/media-index.json` :

```json
{
  "path": "assets/projects/plc/prototype-front.jpg",
  "thumb": "assets/projects/plc/thumbs/prototype-front.jpg",
  "caption": "Front view of the prototype",
  "kind": "image",
  "width": 1600,
  "height": 900
}
```

Ce fragment n'est pas un fichier complet : insère-le dans le tableau `plc`, avec les virgules nécessaires. Crée réellement les deux fichiers et indique leurs dimensions correctes. Les chemins utilisent `/`, jamais `C:\` ou `D:\`.

Dans `locales/media.fr.json`, ajoute la correspondance :

```json
"Front view of the prototype": "Vue de face du prototype"
```

Choisis une légende simple. Évite de recopier les suffixes d'archives ou numéros automatiques des anciennes légendes. Pour remplacer une photo, remplace également sa miniature, sinon l'aperçu reste ancien. Une couverture se choisit avec `cover` dans le registre du projet ; pour les trois pages manuelles, adapte aussi leur image principale HTML.

### Vidéos et rapports

Pour une vidéo, utilise une entrée similaire avec `kind: "video"`, le chemin MP4 et une image JPEG d'aperçu dans `thumb`. Préfère une vidéo courte, sans piste audio inutile, avec les dimensions réelles. Regénère puis vérifie les commandes de lecture et le poids du fichier.

Pour une figure de PDF, ouvre le rapport et exporte ou capture uniquement le schéma utile à une résolution lisible. Recadre, prépare la miniature et référence cette image comme ci-dessus. Le simple ajout d'un PDF ne crée pas de galerie.

**Avant publication :** retire noms de collègues, matricules, signatures, notes, données clients et métadonnées sensibles. Vérifie droits sur photos, visages et voix. Pour les contenus NDA, conserve une explication générique et des illustrations non confidentielles ; n'importe pas les originaux dans le dépôt.

<!-- PAGEBREAK -->

## 7. Apparence et animations

### Apparence générale

Modifie `styles.css` pour l'ensemble du site et `case-study.css` pour les études de cas. Cherche la règle réellement appliquée : plusieurs ajustements historiques peuvent redéfinir la même propriété plus loin dans le fichier. Les couleurs de la scène 3D sont aussi définies dans `script.js`, dans `initHero3d` ; changer une variable CSS ne recolore pas forcément les objets 3D.

Préserve des tailles de texte lisibles, une navigation visible sur mobile et des contenus qui ne se chevauchent pas. Après une retouche, teste au moins l'accueil, un projet et le contact.

### Parking : A1 à D4

`case-study.js` contient l'état initial : 16 valeurs booléennes, dans l'ordre A1, A2, A3, A4, B1…D4. `true` signifie occupé ; `false` signifie libre. Les fonctions de calcul sont dans `project-models.js`.

Contrôles utiles : tout libre donne A1 ; seule B3 libre donne B3 ; tout occupé indique qu'aucune place n'est disponible. Ne remplace pas ces codes par des numéros de niveaux seuls. Changer la capacité demanderait une adaptation conjointe des boucles, styles, traductions et tests.

### Échiquier mécanique

- `templates/chess-motion.html` : structure visible de l'animation.
- `chess-demo.js` : commandes, vitesse, séquence de coups.
- `project-models.js` : coordonnées et déplacements mécaniques.
- `case-study.css` : présentation de l'ensemble.

La séquence actuelle commence par `e2e4`, `d7d5`, `e4d5`. Chaque coup doit rester légal. Les tests supposent certains états finaux et captures : si tu changes la séquence, actualise ces attentes de manière justifiée. Ne contourne pas simplement les erreurs.

Les bibliothèques tierces sont déjà intégrées au dépôt : ne modifie pas leurs fichiers ni leurs licences pour ajuster l'animation. Ce modèle reste une démonstration, pas la preuve d'un pilotage matériel réel.

### Palan et mesure de chaussures

Les graphiques du palan sont des résultats enregistrés, pas un calcul MATLAB exécuté en direct. Préserve les attributs de sélection des figures. Pour la mesure de chaussures, le repère de 5 cm intervient dans le calcul JavaScript et dans les explications : changer cette valeur demande de modifier le calcul, les textes et les vérifications ensemble.

Après toute modification fonctionnelle, utilise tous les tests du chapitre 1 et vérifie l'interaction à la souris comme au toucher.

<!-- PAGEBREAK -->

## 8. Vérifier avant de publier

### Voir le site sur ton ordinateur

Après la génération et les tests, démarre un serveur local dans le dossier du portfolio :

```powershell
py -3 -m http.server 8000 --bind 127.0.0.1
```

Ouvre [la prévisualisation locale](http://127.0.0.1:8000/), puis teste aussi les variantes `?lang=fr` et `?lang=en`. Laisse ce terminal ouvert. Arrête le serveur avec **Ctrl+C**. Si le port est occupé, utilise 8001 et adapte l'adresse. Ce serveur ne publie pas le site sur Internet.

Ouvrir directement `index.html` convient à certains contrôles, mais un serveur local reproduit mieux la navigation web. La scène 3D et les polices externes peuvent nécessiter Internet même pendant la prévisualisation.

### Checklist visuelle et fonctionnelle

- Accueil : nom et liens corrects, scène 3D visible, structures cliquables.
- Mobile : menu fermé lisible, menu ouvert sans texte qui se mélange au contenu ; aucun titre coupé ou débordement horizontal.
- Largeurs : environ 320 px, 390 px et 1440 px, via le mode appareil des outils de développement du navigateur.
- Navigation : chaque lien mène à la bonne page ; retour vers les projets possible.
- Langues : mêmes informations en FR/EN, titres et légendes traduits, pas de phrase française isolée dans la version anglaise.
- Galerie : miniature, image agrandie, fermeture, précédent/suivant et vidéo fonctionnent.
- Parking : tout libre, tout occupé et uniquement B3 libre.
- Échiquier : lecture, pause, pas suivant, capture et remise à zéro.
- CV : le PDF s'ouvre et contient bien la dernière version.
- Contact : champs invalides refusés ; adresse et liens corrects.

Les tests automatiques ne remplacent pas cette inspection et n'envoient pas de vrai courriel. Pour confirmer Formspree, envoie toi-même un message de test identifiable et vérifie sa réception ainsi que le dossier indésirable. Évite les envois répétés inutiles.

### Dernière revue

Dans GitHub Desktop, regarde les différences fichier par fichier. Vérifie qu'aucune archive privée, capture temporaire, donnée NDA, clé ou dossier d'environnement Python n'a été ajouté. Les fichiers générés changent parfois en nombre : c'est normal, mais chaque changement doit avoir une raison.

<!-- PAGEBREAK -->

## 9. Publier sur GitHub Pages

### Avec GitHub Desktop, méthode conseillée

1. Sélectionne le dépôt `MohamedBlko/portfolio`, branche `main`.
2. Après les tests, ouvre **Changes** et relis les différences.
3. Coche les sources modifiées ET leurs sorties générées : HTML, traductions, notes, médias et miniatures nécessaires. Ne publie pas seulement le JSON.
4. Saisis un résumé clair, par exemple `Update PLC case study and French captions`, puis clique sur **Commit to main**.
5. Clique sur **Push origin**. Un commit seul reste local. Si une autre branche ou un autre dépôt apparaît, vérifie avant de poursuivre.
6. Sur GitHub, regarde l'onglet **Actions** et attends la réussite du déploiement Pages. Puis ouvre le site public et refais un contrôle rapide.

Le réglage prévu est **Settings > Pages > Deploy from a branch > main > / (root)**. Il n'est pas à refaire à chaque mise à jour. Avec ce fonctionnement, GitHub publie les fichiers préparés ; il n'exécute pas automatiquement tes scripts Node/Python locaux.

### En ligne de commande, alternative

Si tu maîtrises Git, commence avec un dossier sans changements en attente :

```powershell
git status
git pull --ff-only origin main
```

Effectue ensuite tes modifications, la génération et les tests. Ajoute explicitement chaque fichier concerné ; exemple à compléter selon les différences :

```powershell
git add -- case-studies.json locales/case-studies.fr.json
git add -- projects.html project-plc.html translations.js
git diff --cached --stat
git diff --cached
git commit -m "Update PLC case study"
git push origin main
```

Cet exemple n'est pas une liste universelle : les notes, médias et autres HTML modifiés peuvent aussi être nécessaires. Préfère GitHub Desktop si la sélection est difficile. Évite `git add .`, qui peut inclure des fichiers privés ou temporaires.

**Le résultat n'apparaît pas ?** Vérifie d'abord le succès du déploiement, le bon dépôt et la bonne URL. Recharge avec Ctrl+F5 ou une fenêtre privée. Vérifie que `prepare-site.py` a été exécuté et que ses HTML ont été publiés. Ne change pas manuellement les versions `?v=` des scripts.

<!-- PAGEBREAK -->

## 10. Dépanner et revenir en arrière

### Erreurs fréquentes

- **Commande inconnue** : installer l'outil concerné, rouvrir PowerShell, vérifier sa version.
- **No module named lxml** : installer `lxml` avec le même Python que celui utilisé pour le script.
- **Erreur JSON** : vérifier guillemets, virgules et crochets à la ligne indiquée ; ne pas ajouter de commentaires.
- **Translation length mismatch** : comparer les tableaux EN/FR, leur longueur et leur ordre.
- **Traduction absente** : vérifier la clé anglaise exacte, puis regénérer `translations.js`.
- **Nombre 19 attendu** : après un ajout volontaire, adapter le test de compteur et le chiffre de l'accueil, sans supprimer les autres contrôles.
- **Image absente** : vérifier fichier réel, chemin, extension, casse et miniature ; confirmer leur présence dans le commit.
- **Modification effacée** : tu as probablement édité une sortie générée ; corriger sa source puis reconstruire.
- **Pages non publié** : vérifier Push origin et le journal Actions ; ne pas modifier le domaine au hasard.

### Annuler une mise à jour déjà publiée

Sauvegarde d'abord tout travail local en cours. Pour une annulation Git simple, inspecte l'historique, choisis le commit fautif et crée un commit inverse :

```powershell
git status
git log --oneline -5
$commit = Read-Host "Identifiant du commit a annuler"
git revert --no-edit $commit
git push origin main
```

Relis le résultat et vérifie le nouveau déploiement. Si Git signale un conflit, arrête-toi et demande de l'aide ; ne force pas la publication et n'efface pas tes fichiers. N'utilise pas `git reset --hard` ou un push forcé comme méthode de dépannage.

Une donnée secrète déjà publiée doit être traitée à part : supprimer ou annuler le fichier ne l'efface pas de l'historique ni des copies externes. Révoque immédiatement le secret concerné et fais traiter l'historique si nécessaire.

### Références et limites du guide

Le plan des fichiers et les commandes proviennent du dépôt local inspecté. Si son architecture change, actualise ce guide. Les intitulés des interfaces peuvent évoluer ; la documentation officielle fait référence.

- [GitHub Pages : choisir la source de publication](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Documentation GitHub Desktop](https://docs.github.com/en/desktop)
- [Documentation Git : revert](https://git-scm.com/docs/git-revert)

**Mémo final : sources → génération → tests → prévisualisation → commit → push → contrôle en ligne.**
