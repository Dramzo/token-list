# Architecture proposée

## Frontend mobile-first

- **Stack recommandée**: Next.js + TypeScript + Tailwind (ou React Native plus tard)
- **Navigation**:
  - Public: Landing, Connexion, Inscription, Mot de passe oublié
  - Privé: Dashboard, Annonces, Détail annonce, Créer/éditer annonce, Offres, Messagerie, Favoris, Profil, Paramètres
  - Admin: Dashboard admin, Utilisateurs, Annonces, Catégories, Modération

## Modules front

1. `auth`
2. `profiles`
3. `products`
4. `search`
5. `offers`
6. `messages`
7. `favorites`
8. `notifications`
9. `admin`

## Composants UI réutilisables

- `MobileLayout`
- `TopBar`
- `BottomNav`
- `ProductCard`
- `OfferCard`
- `ConversationListItem`
- `StatusBadge`
- `EmptyState`
- `FilterSheet`
- `PrimaryButton` / `SecondaryButton`
- `Avatar`
- `FormField`

## Backend logique

- **API REST** versionnée (`/api/v1`)
- **Auth** JWT + refresh token
- **RBAC**: buyer, seller, admin
- **Stockage média**: S3 compatible
- **Notifications in-app** via table dédiée

## Endpoints clés

- `POST /auth/register`, `POST /auth/login`, `POST /auth/forgot-password`
- `GET /products`, `POST /products`, `PATCH /products/:id`, `DELETE /products/:id`
- `POST /products/:id/offers`, `PATCH /offers/:id/respond`
- `GET /conversations`, `POST /conversations/:id/messages`
- `POST /favorites/:productId`, `DELETE /favorites/:productId`
- `GET /dashboard/seller`, `GET /dashboard/buyer`
- `GET /admin/users`, `PATCH /admin/users/:id/status`

## Internationalisation

- Langue par défaut: `fr`
- Dossiers prévus: `locales/fr`, `locales/ar`, `locales/en`
