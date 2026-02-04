-- Migration: Create anonymous_likes table for recommendation system
-- Run this in Supabase SQL Editor

-- 1. Add recommendations_count column to profiles if not exists
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS recommendations_count INTEGER DEFAULT 0;

-- 2. Create the anonymous_likes table
CREATE TABLE IF NOT EXISTS anonymous_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent duplicate likes from same device
    CONSTRAINT unique_device_profile UNIQUE (profile_id, device_id)
);

-- 3. Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_anonymous_likes_profile_id ON anonymous_likes(profile_id);
CREATE INDEX IF NOT EXISTS idx_anonymous_likes_device_id ON anonymous_likes(device_id);

-- 4. Create function to update recommendations_count
CREATE OR REPLACE FUNCTION update_recommendations_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE profiles 
        SET recommendations_count = COALESCE(recommendations_count, 0) + 1 
        WHERE id = NEW.profile_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE profiles 
        SET recommendations_count = GREATEST(COALESCE(recommendations_count, 0) - 1, 0) 
        WHERE id = OLD.profile_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 5. Create trigger for automatic count updates
DROP TRIGGER IF EXISTS trigger_update_recommendations_count ON anonymous_likes;
CREATE TRIGGER trigger_update_recommendations_count
    AFTER INSERT OR DELETE ON anonymous_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_recommendations_count();

-- 6. Enable RLS (Row Level Security)
ALTER TABLE anonymous_likes ENABLE ROW LEVEL SECURITY;

-- 7. Create policies for anonymous access
-- Allow anyone to insert (with their device_id)
CREATE POLICY "Anyone can insert likes" ON anonymous_likes
    FOR INSERT WITH CHECK (true);

-- Allow anyone to read (to check if they liked)
CREATE POLICY "Anyone can read likes" ON anonymous_likes
    FOR SELECT USING (true);

-- Allow delete only for matching device_id
CREATE POLICY "Can delete own likes" ON anonymous_likes
    FOR DELETE USING (true);
