"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { getOpeningHoursAction } from "@/app/actions/hours";

const DAYS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

interface ViewHoursProps {
    profileId: string;
}

export function ViewHours({ profileId }: ViewHoursProps) {
    const [hours, setHours] = useState<any[]>([]);
    const [status, setStatus] = useState<"loading" | "open" | "closed">("loading");
    const [nextOpening, setNextOpening] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            const { data } = await getOpeningHoursAction(profileId);
            if (data) {
                setHours(data);
                checkStatus(data);
            }
        }
        load();
    }, [profileId]);

    const checkStatus = (schedule: any[]) => {
        const now = new Date();
        const currentDayIndex = now.getDay();
        const currentTime = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

        const todaySchedule = schedule.find((d: any) => d.day_of_week === currentDayIndex);

        if (todaySchedule && !todaySchedule.is_closed) {
            if (currentTime >= todaySchedule.open_time && currentTime <= todaySchedule.close_time) {
                setStatus("open");
                return;
            }
        }
        setStatus("closed");
    };

    if (hours.length === 0) return null;

    return (
        <div className="flex gap-4">
            <div className="h-8 w-8 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0">
                <Clock className="h-4 w-4" />
            </div>
            <div className="text-sm w-full">
                <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-anthracite">Horaires</p>
                    {status === "open" ? (
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Ouvert</span>
                    ) : (
                        <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Fermé</span>
                    )}
                </div>

                <div className="grid grid-cols-[1fr_auto] gap-x-8 gap-y-1.5 text-gray-500">
                    {DAYS.map((dayName, index) => {
                        // Commencer par Lundi (index 1) pour l'affichage, donc on remappe
                        // L'ordre voulu : Lun, Mar, Mer, Jeu, Ven, Sam, Dim
                        // index 0 de la loop sera Lundi

                        const reorderedIndex = (index + 1) % 7;
                        const dayData = hours.find((h: any) => h.day_of_week === reorderedIndex);
                        const isToday = new Date().getDay() === reorderedIndex;

                        return (
                            <div key={reorderedIndex} className={`contents ${isToday ? "font-medium text-anthracite" : ""}`}>
                                <span>{DAYS[reorderedIndex]}</span>
                                <span className={dayData?.is_closed ? "text-red-400" : "text-anthracite"}>
                                    {dayData?.is_closed
                                        ? "Fermé"
                                        : `${dayData?.open_time?.slice(0, 5)} - ${dayData?.close_time?.slice(0, 5)}`
                                    }
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
