-- =============================================
-- Migration : Tables Stripe pour gestion des abonnements
-- Date : 2026-01-23
-- =============================================

-- Table subscriptions : Gestion des abonnements Stripe
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Stripe IDs
    stripe_customer_id TEXT UNIQUE NOT NULL,
    stripe_subscription_id TEXT UNIQUE,
    stripe_price_id TEXT,
    
    -- Statut
    status TEXT NOT NULL, -- 'active', 'canceled', 'past_due', 'incomplete'
    
    -- Détails abonnement
    plan_type TEXT NOT NULL, -- 'monthly' ou 'annual'
    amount INTEGER NOT NULL, -- Montant en FCFA
    currency TEXT DEFAULT 'XOF',
    
    -- Dates
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    canceled_at TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX idx_subscriptions_profile_id ON public.subscriptions(profile_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON public.subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);

-- Trigger pour updated_at
CREATE TRIGGER trigger_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- =============================================
-- RLS Policies pour subscriptions
-- =============================================
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Lecture : Utilisateur peut voir son propre abonnement
CREATE POLICY "Utilisateur peut voir son abonnement"
    ON public.subscriptions FOR SELECT
    USING (auth.uid() = profile_id);

-- =============================================
-- Table payment_history : Historique des paiements
-- =============================================
CREATE TABLE public.payment_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Type de paiement
    provider TEXT NOT NULL, -- 'stripe', 'wave', 'orange', 'mtn'
    
    -- Stripe specific
    stripe_payment_intent_id TEXT,
    stripe_invoice_id TEXT,
    
    -- Détails
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'XOF',
    plan_type TEXT NOT NULL, -- 'monthly', 'annual', 'onetime'
    status TEXT NOT NULL, -- 'succeeded', 'pending', 'failed'
    
    -- Metadata
    description TEXT,
    receipt_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_payment_history_profile_id ON public.payment_history(profile_id);
CREATE INDEX idx_payment_history_provider ON public.payment_history(provider);
CREATE INDEX idx_payment_history_created_at ON public.payment_history(created_at DESC);

-- RLS
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Utilisateur peut voir son historique"
    ON public.payment_history FOR SELECT
    USING (auth.uid() = profile_id);

-- =============================================
-- Ajout champ Stripe à la table profiles
-- =============================================
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE;

COMMENT ON COLUMN public.profiles.stripe_customer_id IS 'ID client Stripe pour ce prestataire';

CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON public.profiles(stripe_customer_id);

-- =============================================
-- Commentaires pour documentation
-- =============================================
COMMENT ON TABLE public.subscriptions IS 'Gestion des abonnements Stripe des prestataires';
COMMENT ON TABLE public.payment_history IS 'Historique de tous les paiements (Stripe et Mobile Money)';
