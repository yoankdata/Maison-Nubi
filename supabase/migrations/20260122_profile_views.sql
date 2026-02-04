-- Migration: Create profile_views table for tracking profile visits
-- This enables the "Views Dashboard" feature for prestataires

-- =============================================================================
-- TABLE: profile_views
-- Tracks each view of a provider's profile with deduplication support
-- =============================================================================

CREATE TABLE IF NOT EXISTS profile_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    viewer_fingerprint TEXT NOT NULL,  -- Hash of IP + User-Agent for dedup
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast count queries by profile
CREATE INDEX IF NOT EXISTS idx_profile_views_profile_id ON profile_views(profile_id);

-- Index for time-based queries (last 7 days, last 30 days)
CREATE INDEX IF NOT EXISTS idx_profile_views_created_at ON profile_views(created_at);

-- Composite index for deduplication queries (checking if view already exists)
CREATE INDEX IF NOT EXISTS idx_profile_views_dedup ON profile_views(profile_id, viewer_fingerprint, created_at DESC);

-- =============================================================================
-- TABLE: whatsapp_clicks (for future "Contact Reveal" feature)
-- Tracks clicks on the WhatsApp button - Premium feature
-- =============================================================================

CREATE TABLE IF NOT EXISTS whatsapp_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    clicked_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_clicks_profile_id ON whatsapp_clicks(profile_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_clicks_clicked_at ON whatsapp_clicks(clicked_at);

-- =============================================================================
-- RLS Policies
-- =============================================================================

-- Enable RLS on profile_views
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a view (public tracking)
CREATE POLICY "Anyone can insert profile views" ON profile_views
    FOR INSERT
    WITH CHECK (true);

-- Only the profile owner can read their own views
-- Note: profiles.id IS the auth user ID (not a separate user_id column)
CREATE POLICY "Profile owners can read their views" ON profile_views
    FOR SELECT
    USING (profile_id = auth.uid());

-- Enable RLS on whatsapp_clicks
ALTER TABLE whatsapp_clicks ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a click (public tracking)
CREATE POLICY "Anyone can insert whatsapp clicks" ON whatsapp_clicks
    FOR INSERT
    WITH CHECK (true);

-- Only the profile owner can read their own clicks
CREATE POLICY "Profile owners can read their clicks" ON whatsapp_clicks
    FOR SELECT
    USING (profile_id = auth.uid());
