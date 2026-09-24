-- Tripura Spiritual Initial Seed Data
-- V2__seed_initial_data.sql

-- 1. Initial Masterclass Session
INSERT INTO sessions (id, title, subtitle, description, start_date, end_date, live_price, extension_price, recordings_only_price, status)
VALUES (
    1,
    'Hanuman Kriya & Sundarakanda 11-Day Masterclass',
    'Conducted by Master Gorli Peddi Raju Garu',
    'Experience divine energy, mental clarity, and spiritual awakening through powerful daily Kriya and discourse.',
    '2026-10-01',
    '2026-10-11',
    1111.00,
    555.00,
    1500.00,
    'UPCOMING'
) ON CONFLICT (id) DO NOTHING;

-- 2. Sacred Books Seed
INSERT INTO books (id, slug, title, telugu_title, author, tag, synopsis, master_quote, price, cover_image_url)
VALUES 
(
    1,
    'tripura-rahasya',
    'Tripura Rahasya (The Mystery Beyond Trinity)',
    'త్రిపుర రహస్యం (ఆత్మజ్ఞాన రహస్యాలు)',
    'Lord Dattatreya & Parasurama',
    'Advaita Non-Duality',
    'The crowning jewel of Advaita Vedanta philosophy revealed by Lord Dattatreya to Parasurama.',
    'The world is nothing but pure consciousness reflected within itself.',
    199.00,
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
),
(
    2,
    'bhagavad-gita-sthitaprajna',
    'Bhagavad Gita: The Sthitaprajna State',
    'భగవద్గీత: స్థితప్రజ్ఞ లక్షణాలు',
    'Maharshi Vedavyasa & Master Commentary',
    'Karma & Jnana Yoga',
    'A deep master discourse on Chapter 2 & Chapter 6 describing the unshakable serene state of consciousness.',
    'One whose mind remains undisturbed amidst sorrow and without desire in pleasure is a Sthitaprajna.',
    199.00,
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80'
) ON CONFLICT (id) DO NOTHING;
