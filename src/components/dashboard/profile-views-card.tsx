"use client";

import { useEffect, useState } from "react";
import { Eye, TrendingUp, MessageCircle, Loader2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getProfileViewsStats, getDailyViewsStats } from "@/app/actions/tracking";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ProfileViewsCardProps {
    profileId: string;
    isPremium?: boolean;
}

interface ViewStats {
    last7Days: number;
    last30Days: number;
    total: number;
    whatsappClicks7Days: number;
    whatsappClicks30Days: number;
}

interface DailyView {
    date: string;
    views: number;
}

/**
 * Carte affichant les statistiques de vues du profil
 * Pour le dashboard prestataire
 */
export function ProfileViewsCard({ profileId, isPremium = false }: ProfileViewsCardProps) {
    const [stats, setStats] = useState<ViewStats | null>(null);
    const [dailyViews, setDailyViews] = useState<DailyView[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const [statsData, dailyData] = await Promise.all([
                getProfileViewsStats(profileId),
                getDailyViewsStats(profileId),
            ]);
            setStats(statsData);
            setDailyViews(dailyData);
            setLoading(false);
        };
        fetchStats();
    }, [profileId]);

    if (loading) {
        return (
            <Card className="border-gold/20">
                <CardContent className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-gold" />
                </CardContent>
            </Card>
        );
    }

    if (!stats) {
        return (
            <Card className="border-gold/20">
                <CardContent className="py-8 text-center text-muted-foreground">
                    Impossible de charger les statistiques
                </CardContent>
            </Card>
        );
    }

    // Calcul de la tendance (compare 7j vs les 7j d'avant approximativement)
    const previousPeriod = stats.last30Days - stats.last7Days;
    const trend = previousPeriod > 0
        ? Math.round(((stats.last7Days - previousPeriod / 3) / Math.max(previousPeriod / 3, 1)) * 100)
        : 100;
    const trendPositive = trend >= 0;

    // Formatter la date pour l'affichage (juste jour/mois)
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return `${date.getDate()}/${date.getMonth() + 1}`;
    };

    return (
        <Card className="border-gold/20 bg-gradient-to-br from-white to-gold/5 relative overflow-hidden">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg font-serif">
                    <Eye className="h-5 w-5 text-gold" />
                    Visibilité de votre profil
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative">
                {/* Contenu des statistiques */}
                <div className={!isPremium ? 'blur-sm select-none' : ''}>
                    {/* Mini graphique d'évolution */}
                    {dailyViews.length > 0 && (
                        <div className="h-32 w-full mb-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={dailyViews} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={formatDate}
                                        stroke="#94a3b8"
                                        fontSize={11}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px',
                                            fontSize: '12px'
                                        }}
                                        labelFormatter={(label) => formatDate(String(label))}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="views"
                                        stroke="#D4AF37"
                                        strokeWidth={2}
                                        fill="url(#colorViews)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Statistiques principales */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Vues 7 jours */}
                        <div className="bg-white rounded-xl p-4 border border-gold/10 shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-muted-foreground uppercase tracking-wide">7 derniers jours</span>
                                {trendPositive ? (
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                ) : (
                                    <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
                                )}
                            </div>
                            <div className="text-3xl font-bold text-anthracite">{stats.last7Days}</div>
                            <div className={`text-xs font-medium ${trendPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {trendPositive ? '+' : ''}{trend}% vs période précédente
                            </div>
                        </div>

                        {/* Vues 30 jours */}
                        <div className="bg-white rounded-xl p-4 border border-gold/10 shadow-sm">
                            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">30 derniers jours</div>
                            <div className="text-3xl font-bold text-anthracite">{stats.last30Days}</div>
                            <div className="text-xs text-muted-foreground">Total des vues</div>
                        </div>
                    </div>

                    {/* Clics WhatsApp */}
                    <div className="bg-white rounded-xl p-4 border border-gold/10 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <MessageCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-anthracite">Clics WhatsApp</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <div>
                                <div className="text-2xl font-bold text-anthracite">{stats.whatsappClicks7Days}</div>
                                <div className="text-xs text-muted-foreground">Cette semaine</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-anthracite">{stats.whatsappClicks30Days}</div>
                                <div className="text-xs text-muted-foreground">Ce mois</div>
                            </div>
                        </div>
                    </div>

                    {/* Message d'encouragement */}
                    <div className="bg-gold/10 rounded-lg p-3 text-center">
                        <p className="text-sm text-gold-dark font-medium">
                            💡 Astuce : Complétez votre bio et ajoutez des photos pour augmenter vos vues de +40%
                        </p>
                    </div>
                </div>

                {/* Overlay Premium pour utilisateurs gratuits */}
                {!isPremium && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-[2px] rounded-xl">
                        <Sparkles className="h-12 w-12 text-gold mb-4" />
                        <h3 className="text-lg font-bold text-anthracite mb-2">Fonctionnalité Premium</h3>
                        <p className="text-sm text-muted-foreground mb-4 text-center px-6">
                            Passez à l'offre Gold pour voir vos statistiques de visibilité en temps réel
                        </p>
                        <Button asChild className="bg-gold hover:bg-gold/90 text-white">
                            <a href="/espace-pro/abonnement">
                                Passer Gold ✨
                            </a>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
