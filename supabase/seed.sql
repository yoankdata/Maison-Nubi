-- =============================================
-- DONNÉES DE SEED ORÉA
-- 5 profils réalistes d'Abidjan avec services
-- =============================================

-- Note importante : Dans Supabase, les profils sont liés à auth.users
-- Pour le seed, nous allons d'abord créer des utilisateurs "fake" via auth
-- puis insérer les profils correspondants

-- =============================================
-- PROFIL 1 : SALON NAYA (PREMIUM - Coiffure)
-- =============================================
INSERT INTO public.profiles (
  id, email, full_name, slug, category, city, neighborhood, 
  bio, whatsapp, instagram_handle, avatar_url, is_premium, rating, review_count, status
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'contact@salon-naya.ci',
  'Salon Naya',
  'salon-naya',
  'coiffure',
  'Abidjan',
  'Cocody Angré',
  'Le Salon Naya, c''est 15 ans d''expertise en coiffure africaine. Spécialistes des tresses, tissages et locks, nous sublimens votre beauté naturelle dans un cadre luxueux et climatisé. Notre équipe de 5 coiffeuses certifiées vous accueille du lundi au samedi.',
  '+22507 08 09 10 11',
  'salon_naya_abj',
  NULL,
  true,
  4.9,
  156,
  'active'
);

INSERT INTO public.services (profile_id, title, price) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Tresses Fulani', 15000),
  ('11111111-1111-1111-1111-111111111111', 'Box Braids (mi-longs)', 25000),
  ('11111111-1111-1111-1111-111111111111', 'Box Braids (longs)', 35000),
  ('11111111-1111-1111-1111-111111111111', 'Tissage complet', 30000),
  ('11111111-1111-1111-1111-111111111111', 'Locks départ', 40000),
  ('11111111-1111-1111-1111-111111111111', 'Entretien Locks', 15000),
  ('11111111-1111-1111-1111-111111111111', 'Coupe + Brushing', 8000);

INSERT INTO public.portfolio_images (profile_id, image_url) VALUES
  ('11111111-1111-1111-1111-111111111111', '/demo/naya-1.jpg'),
  ('11111111-1111-1111-1111-111111111111', '/demo/naya-2.jpg'),
  ('11111111-1111-1111-1111-111111111111', '/demo/naya-3.jpg');

-- =============================================
-- PROFIL 2 : DIVINE BRAIDS (PREMIUM - Coiffure)
-- =============================================
INSERT INTO public.profiles (
  id, email, full_name, slug, category, city, neighborhood, 
  bio, whatsapp, instagram_handle, avatar_url, is_premium, rating, review_count, status
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  'divine.braids@gmail.com',
  'Divine Braids by Awa',
  'divine-braids',
  'coiffure',
  'Abidjan',
  'Marcory Zone 4',
  'Je suis Awa, tresseuse passionnée depuis 8 ans. Ma spécialité ? Les tresses tendances et les coiffures protectrices qui durent. Je me déplace aussi à domicile dans tout Abidjan. Réservez vite, mon agenda se remplit rapidement !',
  '+22505 12 34 56 78',
  'divine_braids_',
  NULL,
  true,
  4.8,
  98,
  'active'
);

INSERT INTO public.services (profile_id, title, price) VALUES
  ('22222222-2222-2222-2222-222222222222', 'Knotless Braids', 35000),
  ('22222222-2222-2222-2222-222222222222', 'Goddess Locs', 45000),
  ('22222222-2222-2222-2222-222222222222', 'Passion Twists', 30000),
  ('22222222-2222-2222-2222-222222222222', 'Cornrows simples', 10000),
  ('22222222-2222-2222-2222-222222222222', 'Cornrows fantaisie', 20000),
  ('22222222-2222-2222-2222-222222222222', 'Déplacement domicile', 5000);

INSERT INTO public.portfolio_images (profile_id, image_url) VALUES
  ('22222222-2222-2222-2222-222222222222', '/demo/divine-1.jpg'),
  ('22222222-2222-2222-2222-222222222222', '/demo/divine-2.jpg'),
  ('22222222-2222-2222-2222-222222222222', '/demo/divine-3.jpg'),
  ('22222222-2222-2222-2222-222222222222', '/demo/divine-4.jpg'),
  ('22222222-2222-2222-2222-222222222222', '/demo/divine-5.jpg');

-- =============================================
-- PROFIL 3 : GLAM BY FATOUMATA (Gratuit - Makeup)
-- =============================================
INSERT INTO public.profiles (
  id, email, full_name, slug, category, city, neighborhood, 
  bio, whatsapp, instagram_handle, avatar_url, is_premium, rating, review_count, status
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  'fatou.glam@yahoo.fr',
  'Glam by Fatoumata',
  'glam-fatoumata',
  'makeup',
  'Abidjan',
  'Plateau',
  'Maquilleuse professionnelle formée à Paris. Je réalise vos looks pour mariages, shootings photos, soirées VIP et événements corporate. Produits haut de gamme (MAC, Fenty, NARS). Devis gratuit sur demande.',
  '+22501 23 45 67 89',
  'glam_by_fatou',
  NULL,
  false,
  4.7,
  67,
  'active'
);

INSERT INTO public.services (profile_id, title, price) VALUES
  ('33333333-3333-3333-3333-333333333333', 'Maquillage Mariée', 75000),
  ('33333333-3333-3333-3333-333333333333', 'Maquillage Soirée', 35000),
  ('33333333-3333-3333-3333-333333333333', 'Maquillage Naturel', 20000),
  ('33333333-3333-3333-3333-333333333333', 'Cours de maquillage (2h)', 50000),
  ('33333333-3333-3333-3333-333333333333', 'Pack Mariage (mariée + 2 témoins)', 150000);

INSERT INTO public.portfolio_images (profile_id, image_url) VALUES
  ('33333333-3333-3333-3333-333333333333', '/demo/fatou-1.jpg'),
  ('33333333-3333-3333-3333-333333333333', '/demo/fatou-2.jpg'),
  ('33333333-3333-3333-3333-333333333333', '/demo/fatou-3.jpg');

-- =============================================
-- PROFIL 4 : NAILS QUEEN ABIDJAN (Gratuit - Ongles)
-- =============================================
INSERT INTO public.profiles (
  id, email, full_name, slug, category, city, neighborhood, 
  bio, whatsapp, instagram_handle, avatar_url, is_premium, rating, review_count, status
) VALUES (
  '44444444-4444-4444-4444-444444444444',
  'nailsqueen.abj@gmail.com',
  'Nails Queen Abidjan',
  'nails-queen',
  'ongles',
  'Abidjan',
  'Riviera Faya',
  'Votre institut spécialisé ongles à Riviera Faya ! Pose gel, acrylique, nail art créatif... Nous réalisons tous vos désirs. Hygiène irréprochable, matériel stérilisé. Sur RDV uniquement.',
  '+22507 87 65 43 21',
  'nailsqueen_abj',
  NULL,
  false,
  4.6,
  45,
  'active'
);

INSERT INTO public.services (profile_id, title, price) VALUES
  ('44444444-4444-4444-4444-444444444444', 'Pose gel complète', 15000),
  ('44444444-4444-4444-4444-444444444444', 'Pose acrylique', 20000),
  ('44444444-4444-4444-4444-444444444444', 'Remplissage gel', 8000),
  ('44444444-4444-4444-4444-444444444444', 'Nail art simple', 5000),
  ('44444444-4444-4444-4444-444444444444', 'Nail art élaboré', 10000),
  ('44444444-4444-4444-4444-444444444444', 'Vernis semi-permanent', 7000),
  ('44444444-4444-4444-4444-444444444444', 'Manucure classique', 5000);

INSERT INTO public.portfolio_images (profile_id, image_url) VALUES
  ('44444444-4444-4444-4444-444444444444', '/demo/nails-1.jpg'),
  ('44444444-4444-4444-4444-444444444444', '/demo/nails-2.jpg'),
  ('44444444-4444-4444-4444-444444444444', '/demo/nails-3.jpg');

-- =============================================
-- PROFIL 5 : ZEN SPA COCODY (Gratuit - Soins)
-- =============================================
INSERT INTO public.profiles (
  id, email, full_name, slug, category, city, neighborhood, 
  bio, whatsapp, instagram_handle, avatar_url, is_premium, rating, review_count, status
) VALUES (
  '55555555-5555-5555-5555-555555555555',
  'contact@zenspa.ci',
  'Zen Spa Cocody',
  'zen-spa-cocody',
  'soins',
  'Abidjan',
  'Cocody Danga',
  'Évadez-vous au Zen Spa ! Massages relaxants, soins du visage, gommages corps... Notre équipe d''esthéticiennes diplômées vous offre une parenthèse de bien-être au cœur de Cocody. Forfaits duo disponibles.',
  '+22527 22 33 44 55',
  'zenspa_cocody',
  NULL,
  false,
  4.5,
  38,
  'active'
);

INSERT INTO public.services (profile_id, title, price) VALUES
  ('55555555-5555-5555-5555-555555555555', 'Massage relaxant (1h)', 25000),
  ('55555555-5555-5555-5555-555555555555', 'Massage aux pierres chaudes', 35000),
  ('55555555-5555-5555-5555-555555555555', 'Soin visage complet', 20000),
  ('55555555-5555-5555-5555-555555555555', 'Gommage corps', 15000),
  ('55555555-5555-5555-5555-555555555555', 'Forfait Détente (2h)', 45000),
  ('55555555-5555-5555-5555-555555555555', 'Forfait Duo (massage couple)', 50000);

INSERT INTO public.portfolio_images (profile_id, image_url) VALUES
  ('55555555-5555-5555-5555-555555555555', '/demo/zen-1.jpg'),
  ('55555555-5555-5555-5555-555555555555', '/demo/zen-2.jpg'),
  ('55555555-5555-5555-5555-555555555555', '/demo/zen-3.jpg');

-- =============================================
-- VÉRIFICATION
-- =============================================
-- Tu peux vérifier avec ces requêtes :
-- SELECT * FROM public.profiles;
-- SELECT p.full_name, s.title, s.price FROM public.profiles p JOIN public.services s ON p.id = s.profile_id;
