-- =============================================
-- Migration : Système de Boost Premium 7 jours
-- Date : 2026-01-24
-- =============================================

-- Ajout de champs pour gérer le boost temporaire dans la table profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS premium_boost_end_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS premium_boost_activated_at TIMESTAMPTZ;

COMMENT ON COLUMN public.profiles.premium_boost_end_at IS 'Date de fin du boost premium actif (NULL si pas de boost actif)';
COMMENT ON COLUMN public.profiles.premium_boost_activated_at IS 'Date d''activation du dernier boost premium';

-- Index pour optimiser les requêtes de recherche des boosts actifs
CREATE INDEX IF NOT EXISTS idx_profiles_premium_boost_end_at ON public.profiles(premium_boost_end_at) 
WHERE premium_boost_end_at IS NOT NULL;

-- =============================================
-- Table pour historique des achats de boost
-- =============================================
CREATE TABLE public.boost_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Détails paiement
    provider TEXT NOT NULL, -- 'stripe', 'wave', 'orange', 'mtn'
    amount INTEGER NOT NULL DEFAULT 5000,
    currency TEXT DEFAULT 'XOF',
    status TEXT NOT NULL, -- 'succeeded', 'pending', 'failed'
    
    -- Stripe specific
    stripe_payment_intent_id TEXT,
    
    -- Dates
    activated_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX idx_boost_purchases_profile_id ON public.boost_purchases(profile_id);
CREATE INDEX idx_boost_purchases_status ON public.boost_purchases(status);
CREATE INDEX idx_boost_purchases_created_at ON public.boost_purchases(created_at DESC);

-- =============================================
-- RLS Policies pour boost_purchases
-- =============================================
ALTER TABLE public.boost_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Utilisateur peut voir ses boosts"
    ON public.boost_purchases FOR SELECT
    USING (auth.uid() = profile_id);

-- =============================================
-- Fonction utilitaire pour vérifier si premium actif
-- Retourne TRUE si abonnement actif OU boost actif
-- =============================================
CREATE OR REPLACE FUNCTION is_premium_active(p_profile_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_has_active_subscription BOOLEAN;
    v_has_active_boost BOOLEAN;
BEGIN
    -- Vérifier abonnement actif
    SELECT EXISTS(
        SELECT 1 FROM public.subscriptions
        WHERE profile_id = p_profile_id 
        AND status = 'active'
        AND current_period_end > NOW()
    ) INTO v_has_active_subscription;
    
    -- Vérifier boost actif
    SELECT EXISTS(
        SELECT 1 FROM public.profiles
        WHERE id = p_profile_id 
        AND premium_boost_end_at IS NOT NULL
        AND premium_boost_end_at > NOW()
    ) INTO v_has_active_boost;
    
    RETURN v_has_active_subscription OR v_has_active_boost;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION is_premium_active IS 'Vérifie si un profil a un statut premium actif (abonnement ou boost)';

-- =============================================
-- Commentaires pour documentation
-- =============================================
COMMENT ON TABLE public.boost_purchases IS 'Historique des achats de boost premium 7 jours';
