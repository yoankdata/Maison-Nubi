"use client";

import { useState, useEffect } from "react";
import { Clock, Loader2, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOpeningHoursAction, updateOpeningHoursAction } from "@/app/actions/hours";

interface DaySchedule {
    day_of_week: number;
    open_time: string;
    close_time: string;
    is_closed: boolean;
}

const DAYS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

export function HoursEditor({ profileId }: { profileId: string }) {
    const [schedule, setSchedule] = useState<DaySchedule[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Initialiser le planning par défaut si vide
    const defaultSchedule = DAYS.map((_, index) => ({
        day_of_week: index,
        open_time: "09:00",
        close_time: "19:00",
        is_closed: index === 0, // Fermé le dimanche par défaut
    }));

    useEffect(() => {
        async function loadHours() {
            setIsLoading(true);
            try {
                const result = await getOpeningHoursAction(profileId);
                if (result.success && result.data && result.data.length > 0) {
                    // Mapper les données reçues ou compléter avec les jours manquants
                    const loadedSchedule = defaultSchedule.map(day => {
                        const existing = (result.data as any[]).find((d: any) => d.day_of_week === day.day_of_week);
                        return existing ? {
                            day_of_week: existing.day_of_week,
                            open_time: existing.open_time || "09:00",
                            close_time: existing.close_time || "19:00",
                            is_closed: existing.is_closed
                        } : day;
                    });
                    setSchedule(loadedSchedule);
                } else {
                    setSchedule(defaultSchedule);
                }
            } catch (err) {
                console.error("Erreur chargement:", err);
                setError("Impossible de charger les horaires.");
            } finally {
                setIsLoading(false);
            }
        }
        loadHours();
    }, [profileId]);

    const handleUpdate = (dayIndex: number, field: keyof DaySchedule, value: string | boolean) => {
        setSchedule(prev => prev.map(day =>
            day.day_of_week === dayIndex ? { ...day, [field]: value } : day
        ));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const result = await updateOpeningHoursAction(schedule);
            if (result.success) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            } else {
                setError(result.error || "Erreur lors de la sauvegarde");
            }
        } catch (err) {
            setError("Une erreur inattendue est survenue");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-gold" />
            </div>
        );
    }

    return (
        <Card className="border shadow-none">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-serif">Horaires d'ouverture</CardTitle>
                {success && (
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full animate-in fade-in">
                        <CheckCircle2 className="h-4 w-4" />
                        Sauvegardé
                    </div>
                )}
            </CardHeader>
            <CardContent className="space-y-6">
                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    {schedule.map((day) => (
                        <div key={day.day_of_week} className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                            <div className="min-w-[100px] font-medium text-anthracite flex items-center gap-2">
                                <span className={day.is_closed ? "text-muted-foreground" : ""}>
                                    {DAYS[day.day_of_week]}
                                </span>
                            </div>

                            <div className="flex items-center gap-4 flex-1">
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={!day.is_closed}
                                        onCheckedChange={(checked) => handleUpdate(day.day_of_week, "is_closed", !checked)}
                                    />
                                    <span className="text-sm text-muted-foreground w-16">
                                        {day.is_closed ? "Fermé" : "Ouvert"}
                                    </span>
                                </div>

                                {!day.is_closed && (
                                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                        <Input
                                            type="time"
                                            value={day.open_time}
                                            onChange={(e) => handleUpdate(day.day_of_week, "open_time", e.target.value)}
                                            className="w-24 bg-white"
                                        />
                                        <span className="text-muted-foreground">-</span>
                                        <Input
                                            type="time"
                                            value={day.close_time}
                                            onChange={(e) => handleUpdate(day.day_of_week, "close_time", e.target.value)}
                                            className="w-24 bg-white"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-4 flex justify-end">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-gold hover:bg-gold-dark text-white rounded-full min-w-[140px]"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Enregistrement...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Enregistrer
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
