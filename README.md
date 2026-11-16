# ESSENCE — Boutique de parfums

Interface en français réalisée avec Next.js 16 et React 19. Palette crème et olive, visuels originaux, affichage adapté aux mobiles et ordinateurs.

## Démarrage

```bash
npm install
npm run dev
```

Ouvrir http://localhost:3000. Sur PowerShell, utiliser `npm.cmd` si la politique d’exécution bloque `npm.ps1`.

## Fonctionnalités

- Collection filtrable par catégorie ou famille olfactive.
- Recherche par nom ou note, insensible aux accents.
- Fiches avec notes de tête, cœur et fond, et formats 50/100 ml.
- Favoris et panier conservés dans le navigateur avec localStorage.
- Quantités, total, suppression des articles et téléchargement d’un récapitulatif.
- Navigation Liquid Glass adaptée aux mobiles, fenêtres accessibles, FAQ, métadonnées et icône ESSENCE.

## Vérification et production

```bash
npm run build
npm start
```

## Personnalisation

Les produits et prix se trouvent dans `app/page.tsx`, les styles dans `app/globals.css`, les métadonnées dans `app/layout.tsx` et les images dans `public/images/`. Voir `ASSETS.md` pour la direction artistique des images générées.

Le composant React réutilisable `components/ui/liquid-glass-navbar.tsx` suit la convention de dossier de shadcn/ui et utilise uniquement React. Il reprend le composant Nimbus UI « Waterline » fourni, avec navigation au clavier, respect de la réduction des animations et repli CSS lorsque WebGL est indisponible. Il ne nécessite pas de nouvelle dépendance ni de fournisseur de contexte.

## Avant l’ouverture commerciale

Pour la mise en ligne sur Vercel, voir [DEPLOYMENT.md](DEPLOYMENT.md). La configuration Next.js, les commandes de build et Node.js 24.x sont déclarés dans le projet.

Le catalogue est illustratif. Cette version ne transmet aucune commande et n’encaisse aucun paiement. Le récapitulatif téléchargé est une sélection locale, pas une confirmation de commande.

Remplacer les produits, prix et visuels par le catalogue réel ; renseigner les coordonnées et conditions de vente ; connecter le stock, les commandes, la livraison et le paiement avant la mise en vente.
