CREATE TYPE account_role AS ENUM ('buyer', 'seller', 'admin');
CREATE TYPE account_status AS ENUM ('active', 'suspended');
CREATE TYPE product_status AS ENUM ('available', 'reserved', 'sold', 'paused', 'expired');
CREATE TYPE offer_status AS ENUM ('pending', 'accepted', 'rejected', 'countered', 'expired', 'cancelled');

CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(30) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role account_role NOT NULL,
  status account_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(120) NOT NULL,
  city VARCHAR(80) NOT NULL,
  profile_photo_url TEXT,
  company_name VARCHAR(160),
  short_description TEXT,
  activity_summary JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE categories (
  id UUID PRIMARY KEY,
  slug VARCHAR(80) UNIQUE NOT NULL,
  name_fr VARCHAR(120) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE products (
  id UUID PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES users(id),
  category_id UUID NOT NULL REFERENCES categories(id),
  title VARCHAR(180) NOT NULL,
  description TEXT NOT NULL,
  asking_price NUMERIC(12,2) NOT NULL,
  unit VARCHAR(30) NOT NULL,
  quantity_available NUMERIC(12,2) NOT NULL,
  city VARCHAR(80) NOT NULL,
  status product_status NOT NULL DEFAULT 'available',
  published_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP
);

CREATE TABLE product_images (
  id UUID PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE offers (
  id UUID PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES users(id),
  offered_amount NUMERIC(12,2) NOT NULL,
  requested_quantity NUMERIC(12,2) NOT NULL,
  buyer_message TEXT,
  status offer_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE offer_events (
  id UUID PRIMARY KEY,
  offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  actor_user_id UUID NOT NULL REFERENCES users(id),
  event_type VARCHAR(40) NOT NULL,
  event_payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  offer_id UUID REFERENCES offers(id) ON DELETE SET NULL,
  buyer_id UUID NOT NULL REFERENCES users(id),
  seller_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id),
  body TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE favorites (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, product_id)
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(40) NOT NULL,
  title VARCHAR(160) NOT NULL,
  body TEXT,
  payload JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE admin_actions (
  id UUID PRIMARY KEY,
  admin_user_id UUID NOT NULL REFERENCES users(id),
  target_type VARCHAR(40) NOT NULL,
  target_id UUID NOT NULL,
  action VARCHAR(80) NOT NULL,
  reason TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
