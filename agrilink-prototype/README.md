# AgriLink — Prototype complet (mobile-first)

Ce dossier contient une base sérieuse pour lancer une marketplace agricole **sans IA** orientée Mauritanie.

## 1) Ce qui est livré

- **Prototype front fonctionnel**: `index.html`, `styles.css`, `app.js`
- **Architecture produit et technique**: `architecture.md`
- **Modèle de données backend**: `data-model.md` + `schema.sql`
- **Parcours utilisateurs**: `user-flows.md`
- **Jeu de données réaliste**: `seed-data.json`
- **Roadmap d’implémentation**: `roadmap.md`

## 2) Démarrage rapide

```bash
cd agrilink-prototype
python3 -m http.server 4173
# puis ouvrir http://localhost:4173
```

## 3) Fonctionnalités clés déjà couvertes

- Authentification de base (prototype local)
- Profils vendeur/acheteur
- Catalogue produits + filtres (recherche, catégorie, ville, tri)
- Système d’offres (montant, quantité, message, statuts)
- Négociation simple (accepter/refuser)
- Messagerie simple
- Favoris
- Dashboard vendeur/acheteur

## 4) Évolutivité

La structure de données et les documents backend sont prêts pour une implémentation API (Node.js/NestJS, Laravel ou Django) + base PostgreSQL.
