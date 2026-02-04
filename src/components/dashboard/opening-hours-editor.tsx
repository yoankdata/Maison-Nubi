"use client";

import { useState } from "react";
import { Loader2, Save, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { updateOpeningHoursAction } from "@/app/actions/hours";
import type { OpeningHour } from "@/lib/database.types";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
// Map day index (0-6 where 0 is Monday in our UI loop, but checks DB day_of_week)
// DB: 0=Sunday, 1=Monday... 
// Let's map 0(Mon) -> 1, 1(Tue) -> 2, ..., 5(Sat) -> 6, 6(Sun) -> 0

const HOURS = Array.from({ length: 24 * 2 }).map((_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${minute}`;
});

interface OpeningHoursEditorProps {
    initialHours: OpeningHour[];
}

export function OpeningHoursEditor({ initialHours }: OpeningHoursEditorProps) {
    const { toast } = useToast();
    const [saving, setSaving] = useState(false);

    // Initialiser l'état local avec les horaires existants ou par défaut
    const [hoursState, setHoursState] = useState(() => {
        return DAYS.map((dayName, index) => {
            // Conversion index UI (0=Lundi) vers DB (1=Lundi, ..., 0=Dimanche)
            const dbDayIndex = index < 6 ? index + 1 : 0;

            const existingHour = initialHours.find(h => h.day_of_week === dbDayIndex);

            return {
                day_of_week: dbDayIndex,
                dayName,
                is_closed: existingHour ? existingHour.is_closed : false,
                open_time: existingHour?.open_time?.slice(0, 5) || "09:00",
                close_time: existingHour?.close_time?.slice(0, 5) || "19:00",
            };
        });
    });

    const handleUpdate = (index: number, field: string, value: any) => {
        const newHours = [...hoursState];
        newHours[index] = { ...newHours[index], [field]: value };
        setHoursState(newHours);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = hoursState.map(h => ({
                day_of_week: h.day_of_week,
                is_closed: h.is_closed,
                open_time: h.is_closed ? null : h.open_time,
                close_time: h.is_closed ? null : h.close_time,
            }));

            const result = await updateOpeningHoursAction(payload);

            if (result.success) {
                toast({
                    title: "Horaires mis à jour",
                    description: "Vos horaires ont été enregistrés avec succès.",
                });
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de mettre à jour les horaires.",
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card className="border-gold/20">
            <CardHeader>
                <CardTitle className="font-serif text-2xl text-anthracite">Définir vos horaires</CardTitle>
                <CardDescription>
                    Indiquez vos jours et heures d'ouverture pour que vos clients sachent quand vous visiter.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    {hoursState.map((day, index) => (
                        <div key={day.dayName} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                            <div className="flex items-center justify-between min-w-[150px]">
                                <span className="font-medium text-anthracite">{day.dayName}</span>
                                <div className="flex items-center gap-2">
                                    <Label htmlFor={`closed-${index}`} className="text-xs text-muted-foreground w-12 text-right">
                                        {day.is_closed ? "Fermé" : "Ouvert"}
                                    </Label>
                                    <Switch
                                        id={`closed-${index}`}
                                        checked={!day.is_closed}
                                        onCheckedChange={(checked) => handleUpdate(index, "is_closed", !checked)}
                                        className="data-[state=checked]:bg-gold"
                                    />
                                </div>
                            </div>

                            {!day.is_closed && (
                                <div className="flex items-center gap-2 flex-1 animate-in fade-in slide-in-from-left-2 duration-300">
                                    <Select
                                        value={day.open_time}
                                        onValueChange={(val) => handleUpdate(index, "open_time", val)}
                                    >
                                        <SelectTrigger className="w-[100px] border-slate-200">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {HOURS.map(h => (
                                                <SelectItem key={`open-${h}`} value={h}>{h}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <span className="text-slate-400">à</span>
                                    <Select
                                        value={day.close_time}
                                        onValueChange={(val) => handleUpdate(index, "close_time", val)}
                                    >
                                        <SelectTrigger className="w-[100px] border-slate-200">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {HOURS.map(h => (
                                                <SelectItem key={`close-${h}`} value={h}>{h}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-anthracite hover:bg-anthracite/90 text-white min-w-[150px]"
                    >
                        {saving ? (
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
