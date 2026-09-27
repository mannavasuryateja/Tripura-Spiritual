-- Tripura Spiritual PostgreSQL Schema Migration
-- V1__init_schema.sql

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_SEEKER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. Sessions Table (Masterclasses & Immersions)
CREATE TABLE IF NOT EXISTS sessions (
    id BIGSERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    price_live NUMERIC(10, 2) DEFAULT 1111.00,
    price_recordings NUMERIC(10, 2) DEFAULT 1500.00,
    price_extension NUMERIC(10, 2) DEFAULT 555.00,
    whatsapp_community_url VARCHAR(255),
    active BOOLEAN DEFAULT TRUE
);

-- 3. Recordings Table (Bunny.net Stream / Local HLS Linked)
CREATE TABLE IF NOT EXISTS recordings (
    id BIGSERIAL PRIMARY KEY,
    session_id BIGINT REFERENCES sessions(id) ON DELETE CASCADE,
    day_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    duration VARCHAR(50),
    bunny_video_id VARCHAR(100),
    hls_stream_url TEXT,
    embed_url TEXT,
    description TEXT,
    release_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_recordings_session_day ON recordings(session_id, day_number);

-- 4. Enrollments Table
CREATE TABLE IF NOT EXISTS enrollments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id BIGINT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    enrollment_type VARCHAR(50) NOT NULL, -- LIVE_MASTERCLASS, RECORDING_EXTENSION, RECORDINGS_ONLY
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    expires_at TIMESTAMP WITH TIME ZONE,
    valid_until TIMESTAMP WITH TIME ZONE,
    unlocked_until_day INT DEFAULT 11,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_session ON enrollments(session_id);

-- 5. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id BIGINT REFERENCES sessions(id) ON DELETE SET NULL,
    razorpay_order_id VARCHAR(100) UNIQUE,
    razorpay_payment_id VARCHAR(100) UNIQUE,
    razorpay_signature VARCHAR(255),
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(50) NOT NULL,
    purpose VARCHAR(255),
    product_type VARCHAR(50),
    product_id VARCHAR(100),
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Mentor Bookings (1-on-1 Consultations)
CREATE TABLE IF NOT EXISTS mentor_bookings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(100),
    duration_minutes INT DEFAULT 30,
    primary_date DATE NOT NULL,
    secondary_date DATE NOT NULL,
    preferred_time_slot VARCHAR(50) NOT NULL,
    amount NUMERIC(10, 2) DEFAULT 499.00,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    notes TEXT,
    meeting_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Sacred Book Library
CREATE TABLE IF NOT EXISTS books (
    id BIGSERIAL PRIMARY KEY,
    slug VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    telugu_title VARCHAR(255),
    author VARCHAR(255) NOT NULL,
    tag VARCHAR(100),
    description TEXT,
    synopsis TEXT,
    summary_story TEXT,
    problem_statement TEXT,
    master_quote TEXT,
    master_commentary_summary TEXT,
    price NUMERIC(10, 2) DEFAULT 199.00,
    cover_image VARCHAR(255),
    episodes_count INT DEFAULT 0,
    preview_duration_minutes INT DEFAULT 5,
    is_published BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Book Episodes
CREATE TABLE IF NOT EXISTS book_episodes (
    id BIGSERIAL PRIMARY KEY,
    book_id BIGINT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    episode_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration VARCHAR(50),
    duration_seconds INT DEFAULT 0,
    media_type VARCHAR(50) DEFAULT 'AUDIO',
    audio_url TEXT,
    video_url TEXT,
    thumbnail_url TEXT,
    is_free BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
