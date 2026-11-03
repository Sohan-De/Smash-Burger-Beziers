# O'Stud · Template 2

Site vitrine statique pour le snack O'Stud, 3 rue de Jussieu, 34500 Béziers.
HTML5, CSS3 et JavaScript vanilla. Aucun framework, aucun build, aucune dépendance, aucune requête externe à l'exécution.

## Structure

```
o-stud-template-2/
├── index.html
├── mentions-legales.html
├── README.md
└── assets/
    ├── css/styles.css
    ├── js/main.js
    ├── img/
    │   ├── favicon.svg          (fourni)
    │   ├── logo-mark.svg        (fourni)
    │   ├── hero.jpg             (à ajouter)
    │   ├── signature.jpg        (à ajouter)
    │   ├── gallery-1.jpg        (à ajouter)
    │   ├── gallery-2.jpg        (à ajouter)
    │   ├── gallery-3.jpg        (fourni)
    │   ├── gallery-4.jpg        (à ajouter)
    │   └── map.png              (fourni)
    └── fonts/
        ├── bricolage-grotesque-latin-wght-normal.woff2   (à ajouter)
        └── figtree-latin-wght-normal.woff2               (à ajouter)
```

## Placeholders à remplacer

Chaque valeur manquante est affichée en surbrillance jaune (`.placeholder`). Recherchez `[` dans les fichiers pour tout retrouver.

**`index.html`**

| Élément | Valeur à mettre |
|---|---|
| Barre du haut, drawer, bandeau, CTA, pied de page | `[TÉLÉPHONE]` : numéro réel. Mettez aussi le `href="#infos"` des liens « Appeler » en `href="tel:+33XXXXXXXXX"` |
| Hero | `[SLOGAN À COMPLÉTER]`, `[NOTE]`, `[NOMBRE]` (avis) |
| Bandeau « Services » et carte « Adresse et contact » | `[SERVICES À CONFIRMER]` et les puces `[SUR PLACE]`, `[À EMPORTER]`, `[LIVRAISON]`, `[HALAL]`, `[CB ACCEPTÉE]` : ne gardez que les services confirmés, supprimez les autres |
| Carte | Toute la carte est indicative : `[NOM DU SNACK]`, `[PRIX]`, `[Description courte]`, etc. Remplacez les `<li>` par vos plats. Le bandeau « CARTE INDICATIVE » est à supprimer une fois la carte réelle en place |
| Formules signature | `[NOM DE LA FORMULE 1/2]`, `[Composition]`, `[PRIX]` |
| Section Signature | Texte des 4 atouts (« Cuisson à la commande », « Produits frais », « Sauces maison », « Des prix doux »). Ce sont des affirmations marketing à confirmer ou réécrire |
| Galerie | `alt` et `data-caption` (« Façade », « Le comptoir », « En cuisine », « Une assiette ») à adapter à vos photos |
| Avis | 3 cartes `[AVIS À REMPLACER]`, `[PRÉNOM]`, `[DATE]`. Note et nombre d'avis dans la carte « Avis » |
| Horaires | Remplissez `data-open="HH:MM"` et `data-close="HH:MM"` sur chaque `<li data-day>`. Pour une fermeture après minuit, mettez par exemple `data-close="02:00"`. Le statut « Ouvert / Fermé » se calcule automatiquement. Tant que les attributs sont vides, le site affiche `[HORAIRES]` et « Horaires à compléter » |
| Métadonnées | `[URL DU SITE]` dans les balises `og:url`, `og:image` et `twitter:image` |
| Pied de page | `[RÉSEAUX SOCIAUX À AJOUTER]` : ajoutez les liens Instagram, Facebook ou TikTok réels, ou supprimez la ligne |

**`mentions-legales.html`** : toutes les valeurs à compléter sont des `<em class="placeholder">`. Il y en a dans les sections 01 à 06 (éditeur, SIRET, TVA, directeur de publication, hébergeur, développeur, crédits photos, e-mail RGPD) et la date de mise à jour.

Renseigné avec les données de la fiche Google Business : nom, adresse, téléphone (+33 9 56 18 71 81), note (4,9 sur 239 avis), gamme de prix (€1–€10), catégorie « Fast food », horaires (midi et soir du lundi au vendredi, samedi soir, dimanche fermé), services (sur place, drive-through, livraison), lien Uber Eats (domaine seulement, à remplacer par l'URL de la page du snack) et lien Google Business pour les avis.

Les horaires sont saisis avec deux créneaux par jour : `data-open` / `data-close` pour le premier, `data-open-2` / `data-close-2` pour le second. Un créneau qui passe minuit (ex. `18:00` → `02:00`) est géré automatiquement.

Les avis (texte, auteur, date) ne figurent pas dans la fiche copiée : ils restent des placeholders. Le JSON-LD ne contient pas `aggregateRating` : Google exige que la note structurée corresponde aux avis visibles sur la page, à ajouter une fois les vrais avis en place. Les noms des clients de la fiche ne sont pas repris sur le site.

## Images à ajouter

Les images sont référencées par leur nom final. Tant qu'elles n'existent pas, la zone affiche un fond vert et le texte `alt`. Le navigateur signale des erreurs 404 dans la console : c'est normal avant l'ajout des fichiers.

| Fichier | Emplacement | Taille recommandée | Usage |
|---|---|---|---|
| `hero.jpg` | `assets/img/` | 1600 × 1000 px (paysage, sujet centré) | Plein écran du hero |
| `signature.jpg` | `assets/img/` | 960 × 1200 px (portrait 4:5) | Plat signature |
| `gallery-1.jpg` | `assets/img/` | 1200 × 900 px | Façade, grande vignette |
| `gallery-2.jpg` | `assets/img/` | 800 × 800 px (carré) | Comptoir |
| `gallery-3.jpg` | `assets/img/` | 800 × 800 px (carré) | Cuisine |
| `gallery-4.jpg` | `assets/img/` | 800 × 800 px (carré) | Assiette |
| `map.jpg` | `assets/img/` | 960 × 600 px | Capture de carte statique (Google Maps, sans iframe) |

Poids conseillé : moins de 200 Ko par photo (JPEG, qualité 75 à 80). Pour la carte, faites une capture d'écran de Google Maps centrée sur la rue de Jussieu et vérifiez les droits d'usage.

## Polices à télécharger

Les deux polices sont sous licence SIL Open Font License (OFL), gratuite pour un usage commercial.

1. **Bricolage Grotesque** (titres) : [fonts.google.com/specimen/Bricolage+Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque). Téléchargez le fichier WOFF2 du sous-ensemble `latin`, axe de graisse variable (`wght`). Renommez-le `bricolage-grotesque-latin-wght-normal.woff2`.
2. **Figtree** (texte) : [fonts.google.com/specimen/Figtree](https://fonts.google.com/specimen/Figtree). Même procédé, renommé `figtree-latin-wght-normal.woff2`.

Déposez les deux fichiers dans `assets/fonts/`. Sans eux, le site utilise les polices système (`Arial Black`, `Helvetica Neue`, `system-ui`) grâce à la pile de repli définie dans `styles.css` et `font-display: swap`.

Le site contient déjà les `<link rel="preload">` et les `@font-face`. Tant que les fichiers manquent, la console affiche une erreur 404 pour chacun.

## Aperçu local

- Double-cliquez sur `index.html` pour l'ouvrir dans le navigateur.
- Ou, depuis ce dossier : `npx serve` (puis ouvrez l'adresse affichée).

Dans un navigateur, le fonctionnement est identique. Certaines fonctions comme la galerie utilisent `<dialog>`, pris en charge par tous les navigateurs modernes.

## Checklist avant mise en ligne

- [ ] Renseigner le SIRET, le nom du gérant et le statut juridique (auprès du client)
- [ ] Remplacer toutes les images placeholder par de vraies photos, dans les tailles indiquées
- [ ] Saisir les horaires réels (`data-open` / `data-close`) et tester le statut « Ouvert / Fermé » un jour de semaine, un dimanche et après minuit
- [ ] Remplacer les avis placeholder par de vrais avis, ou retirer la section
- [ ] Vérifier la note Google et le nombre d'avis avant publication
- [ ] Vérifier les liens « Itinéraire » et « Voir les avis sur Google » sur un téléphone
- [ ] Renseigner l'hébergeur et l'éditeur dans les mentions légales, puis retirer tous les marqueurs `placeholder`
- [ ] Ajouter les liens de livraison (Uber Eats, Deliveroo) si le snack en propose
- [ ] Tester sur un vrai téléphone, en mode portrait et paysage
- [ ] Vérifier la fiche Google Business : téléphone, horaires, site, photos
- [ ] Ajouter le site à Google Search Console et soumettre le sitemap si besoin
- [ ] Vérifier les polices : aucune erreur 404 dans la console du navigateur
