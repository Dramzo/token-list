# Modèle de données (sans IA)

## Entités

- `users`: compte de connexion
- `profiles`: infos métier et contact
- `categories`: taxonomie produits
- `products`: annonces vendeurs
- `product_images`: photos d’annonce
- `offers`: offres acheteur -> vendeur
- `offer_events`: historique de négociation
- `conversations`: discussion privée
- `messages`: messages texte
- `favorites`: favoris acheteurs
- `notifications`: notifications in-app
- `admin_actions`: journal de modération

## Règles métier

1. Seuls les `seller` créent des `products`.
2. Seuls les `buyer` créent des `offers`.
3. Statuts offre: `pending`, `accepted`, `rejected`, `countered`, `expired`, `cancelled`.
4. Statuts produit: `available`, `reserved`, `sold`, `paused`, `expired`.
5. Plusieurs offres par produit; une seule retenue pour conclure la vente.

## Indices clés

- `products(category_id, city, status, published_at DESC)`
- `offers(product_id, status, created_at DESC)`
- `messages(conversation_id, created_at DESC)`
- `favorites(user_id, product_id)` unique
