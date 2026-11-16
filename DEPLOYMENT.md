# Déploiement sur Vercel

Dépôt cible : https://github.com/bouganekhalid10-web/perfume-store

## Configuration prête

- Framework : Next.js.
- Node.js : 24.x (comme la version utilisée pour valider le build local).
- Installation : `npm ci`, à partir du `package-lock.json` inclus.
- Build : `npm run build`.
- Root Directory : racine du dépôt (`./`).
- Output Directory : conserver la valeur par défaut de Next.js.
- Aucune variable d’environnement n’est nécessaire pour cette version.

`vercel.json` déclare le framework et les commandes. `package.json` déclare Node 24.x. Ne pas remplacer la sortie par `out` : ce projet utilise le build Next.js standard.

## Publier depuis le dépôt

1. S’assurer que le code source et `public/images/` sont présents dans le dépôt GitHub ci-dessus.
2. Ouvrir https://vercel.com/new avec le compte Vercel voulu.
3. Importer `bouganekhalid10-web/perfume-store`. Si le dépôt est privé, autoriser Vercel à y accéder.
4. Vérifier les réglages ci-dessus puis lancer Deploy.
5. Attendre le statut Ready et ouvrir l’adresse retournée par Vercel.

Après le premier déploiement, les commits sur la branche de production connectée déclenchent de nouveaux déploiements.

## Vérification après publication

Vérifier l’accueil et les images, la recherche, les filtres, les formats 50/100 ml, les favoris, le panier et l’affichage sur mobile. Le panier et les favoris sont propres à chaque navigateur.

Le site est une démonstration : la mise en ligne ne crée pas un service de commande, de paiement ou de livraison. Voir `PROJECT-STATUS.md` pour les étapes commerciales restantes.

## Fichiers à conserver sur GitHub

Conserver les sources, les images, les fichiers de configuration et le lockfile. Exclure `node_modules`, `.next`, `.vercel`, `backups` et les secrets via `.gitignore`. Les archives ZIP constituent des sauvegardes ; Vercel doit construire les fichiers source à la racine du dépôt.
