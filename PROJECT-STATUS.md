# ESSENCE — Reprendre le projet

## État actuel

Interface de boutique de parfums en français, en crème et vert olive. Le catalogue, les prix et les images sont illustratifs.

Fonctionnalités réalisées : filtres par catégorie et famille olfactive, recherche, fiches produits avec formats 50/100 ml, favoris, panier local, gestion des quantités, téléchargement de la sélection, FAQ et navigation Liquid Glass adaptée au mobile.

Le dernier `npm run build` a réussi. La page a été ouverte et inspectée dans Chrome. Les parcours interactifs n’ont pas tous été vérifiés automatiquement.

## Reprendre sur cet ordinateur ou un autre

1. Ouvrir ou cloner le dépôt dans un dossier.
2. Installer les dépendances avec `npm install`.
3. Lancer `npm run dev`, puis ouvrir http://localhost:3000.
4. Pour vérifier une modification : `npm run build`.

Sur PowerShell, utiliser `npm.cmd` si `npm.ps1` est bloqué.

Lire `AGENTS.md` et les guides de la version de Next.js installée avant de modifier le code.

## Fichiers principaux

- `app/page.tsx` : catalogue et interactions.
- `app/globals.css` : apparence et adaptation aux écrans.
- `components/hero-video.tsx` et `public/videos/perfume-water.mp4` : film fourni par l’utilisateur dans la première section, lecture muette, bouton pause et respect de la réduction des animations.
- `components/ui/liquid-glass-navbar.tsx` : navigation animée Nimbus UI fournie, adaptée à la boutique ; aucune dépendance supplémentaire.
- `app/layout.tsx` : langue, titre et description.
- `public/images/` : images intégrées au projet.
- `ASSETS.md` : provenance et prompts des visuels.

## Prochaines étapes avant la vente

- Fournir le vrai catalogue, les prix, les stocks et les photos.
- Renseigner le nom commercial, les coordonnées et les conditions de vente.
- Choisir les zones et tarifs de livraison, puis les moyens de paiement.
- Ajouter une base de données, la gestion des commandes et une administration protégée.
- Vérifier les parcours d’achat, puis déployer avec un domaine.

Il n’existe actuellement ni serveur de commande ni paiement. Les favoris et le panier sont conservés dans le navigateur du visiteur ; ils ne sont pas enregistrés sur GitHub.

## Sauvegarde

Le projet dispose également d’une configuration Vercel (`vercel.json`, `.vercelignore`, Node.js 24.x). Voir `DEPLOYMENT.md` pour importer le dépôt `bouganekhalid10-web/perfume-store`. La présence de ces fichiers ne confirme pas un transfert sur GitHub ou un déploiement : il faut vérifier ces opérations séparément.

Le code et les images doivent être enregistrés dans le dépôt. Ne pas y inclure `node_modules`, `.next`, les sauvegardes ZIP, les fichiers `.env` ni les secrets. Le fichier `.gitignore` les exclut pour un enregistrement avec Git.
