-- Tripura Spiritual Production Schema Update Migration
-- V3__production_schema_update.sql

-- 1. Create Products Table (Dynamic Configurable Pricing)
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    type VARCHAR(50) NOT NULL,
    validity_days INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial products if empty
INSERT INTO products (slug, name, description, price, currency, type, validity_days, is_active)
VALUES
    ('live-masterclass', 'Hanuman Kriya: 11-Day Live Masterclass', '1st–11th Monthly Live Batch with Master Gorli Peddi Raju Garu + WhatsApp Live Link', 1111.00, 'INR', 'LIVE_SESSION', 13, true),
    ('recording-extension', '30-Day Recording Extension (Live Seeker Upgrade)', '30 Days Extended Video Recording Access for previous live batch attendees', 555.00, 'INR', 'RECORDING_EXTENSION', 30, true),
    ('recordings-only', 'Hanuman Kriya: 11-Day Full Recording Package', 'Complete 11-Day Video Recordings via Bunny.net Stream (30 Days Unlimited Access)', 1500.00, 'INR', 'RECORDINGS_ONLY', 30, true),
    ('book-tripura-rahasya', 'Tripura Rahasya: Complete Audio Commentary', 'Full Sacred Audio Discourse & Commentary by Master Gorli Peddi Raju Garu', 199.00, 'INR', 'BOOK_AUDIO', 3650, true),
    ('book-bhagavad-gita', 'Bhagavad Gita Sthitaprajna Audio Commentary', 'Complete 5-Discourse Deep Commentary on Gita Chapter 2 & 6', 199.00, 'INR', 'BOOK_AUDIO', 3650, true),
    ('book-yoga-vasistha', 'Yoga Vasistha: Supreme Consciousness', 'Full 7-Part Master Discourse on Advaita Wisdom & Jivanmukti', 249.00, 'INR', 'BOOK_AUDIO', 3650, true),
    ('book-patanjali', 'Patanjali Yoga Sutras Master Commentary', 'Complete 4-Episode Practical Meditation & Samadhi Mastery', 199.00, 'INR', 'BOOK_AUDIO', 3650, true),
    ('1on1-30min', '1-on-1 Spiritual Guidance with Master (30 Mins)', 'Direct private video mentorship session with Master Gorli Peddi Raju Garu', 499.00, 'INR', 'ONE_TO_ONE', 30, true),
    ('1on1-60min', '1-on-1 Comprehensive Guidance with Master (60 Mins)', 'Deep personal alignment, spiritual diagnosis, and sadhana roadmap', 899.00, 'INR', 'ONE_TO_ONE', 30, true)
ON CONFLICT (slug) DO NOTHING;

-- 2. Business Settings Table (Admin-Configurable Parameters)
CREATE TABLE IF NOT EXISTS business_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO business_settings (setting_key, setting_value, description)
VALUES
    ('whatsapp_community_url', 'https://chat.whatsapp.com/TripuraSpiritualCommunityLive2026', 'Official WhatsApp seeker community invite link'),
    ('free_orientation_video_url', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'Public orientation video stream URL'),
    ('masterclass_schedule_time', 'Daily 6:30 AM – 7:30 AM IST', 'Live masterclass daily schedule'),
    ('recording_validity_days', '13', 'Number of days recordings remain accessible for live batch students'),
    ('extension_validity_days', '30', 'Validity period in days for recording extension upgrade')
ON CONFLICT (setting_key) DO NOTHING;

-- 3. Webhook Events Table (Idempotent Webhook Processing)
CREATE TABLE IF NOT EXISTS webhook_events (
    id BIGSERIAL PRIMARY KEY,
    provider VARCHAR(50) NOT NULL,
    event_id VARCHAR(255) UNIQUE NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PROCESSED',
    error TEXT,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_webhook_provider_event ON webhook_events(provider, event_id);

-- 4. Audit Logs Table (Admin Governance & Action Tracking)
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    admin_email VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(100),
    entity_id VARCHAR(100),
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- 5. Media Assets Table (Object Storage & Upload Management)
CREATE TABLE IF NOT EXISTS media_assets (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    storage_key VARCHAR(255) UNIQUE NOT NULL,
    media_type VARCHAR(50) NOT NULL, -- AUDIO, VIDEO, IMAGE, DOCUMENT
    mime_type VARCHAR(100),
    file_size BIGINT,
    duration VARCHAR(50),
    duration_seconds INT,
    status VARCHAR(50) NOT NULL DEFAULT 'READY',
    public_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. User Book Access (Entitlements for Sacred Books & Podcasts)
CREATE TABLE IF NOT EXISTS user_book_access (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id BIGINT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    payment_id BIGINT REFERENCES payments(id) ON DELETE SET NULL,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_book UNIQUE (user_id, book_id)
);

-- 7. Add missing columns to books if not present
ALTER TABLE books ADD COLUMN IF NOT EXISTS slug VARCHAR(100);
ALTER TABLE books ADD COLUMN IF NOT EXISTS telugu_title VARCHAR(255);
ALTER TABLE books ADD COLUMN IF NOT EXISTS tag VARCHAR(100);
ALTER TABLE books ADD COLUMN IF NOT EXISTS synopsis TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS summary_story TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS problem_statement TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS master_quote TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS preview_duration_minutes INT DEFAULT 5;
ALTER TABLE books ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;
ALTER TABLE books ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
ALTER TABLE books ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE books ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- 8. Add missing columns to book_episodes if not present
ALTER TABLE book_episodes ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE book_episodes ADD COLUMN IF NOT EXISTS media_type VARCHAR(50) DEFAULT 'AUDIO';
ALTER TABLE book_episodes ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE book_episodes ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE book_episodes ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT FALSE;
ALTER TABLE book_episodes ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;
ALTER TABLE book_episodes ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
ALTER TABLE book_episodes ADD COLUMN IF NOT EXISTS duration_seconds INT DEFAULT 0;
ALTER TABLE book_episodes ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- 9. Enhance payments table
ALTER TABLE payments ADD COLUMN IF NOT EXISTS product_type VARCHAR(50);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS product_id VARCHAR(100);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'INR';
ALTER TABLE payments ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP WITH TIME ZONE;

-- Drop obsolete Hibernate check constraint on payments.status and mentor_bookings.status if exists
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_status_check;
ALTER TABLE mentor_bookings DROP CONSTRAINT IF EXISTS mentor_bookings_status_check;
ALTER TABLE mentor_bookings ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE mentor_bookings ADD COLUMN IF NOT EXISTS meeting_link TEXT;
