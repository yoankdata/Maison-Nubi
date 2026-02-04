"use client";

import Link from "next/link";
import { CheckCircle2, Circle, ArrowRight, LayoutDashboard, Calendar, Image as ImageIcon, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OnboardingStep {
    id: string;
    label: string;
    description: string;
    isCompleted: boolean;
    href: string;
    icon: any;
}

interface OnboardingChecklistProps {
    profile: {
        avatar_url: string | null;
        category: string;
        city: string;
        neighborhood: string | null;
    };
    hasServices: boolean;
    hasHours: boolean;
    hasPhotos: boolean;
}

export function OnboardingChecklist({
    profile,
    hasServices,
    hasHours,
    hasPhotos,
}: OnboardingChecklistProps) {

    const steps: OnboardingStep[] = [
        {
            id: "profile",
            label: "Compléter mon profil",
            description: "Photo de profil, quartier, bio",
            isCompleted: !!(profile.avatar_url && profile.city && profile.neighborhood),
            href: "/espace-pro/profil",
            icon: LayoutDashboard,
        },
        {
            id: "services",
            label: "Ajouter mes services",
            description: "Au moins un service avec prix",
            isCompleted: hasServices,
            href: "/espace-pro/services",
            icon: Briefcase,
        },
        {
            id: "hours",
            label: "Définir mes horaires",
            description: "Jours et heures d'ouverture",
            isCompleted: hasHours,
            href: "/espace-pro/horaires",
            icon: Calendar,
        },
        {
            id: "photos",
            label: "Ajouter des photos",
            description: "Au moins une photo dans la galerie",
            isCompleted: hasPhotos,
            href: "/espace-pro/galerie",
            icon: ImageIcon,
        },
    ];

    const completedCount = steps.filter((s) => s.isCompleted).length;
    const progress = (completedCount / steps.length) * 100;
    const isFullyComplete = completedCount === steps.length;

    return (
        <Card className="border-gold/20 shadow-lg shadow-gold/5 overflow-hidden">
            <div className="h-2 bg-gray-100 w-full">
                <div
                    className="h-full bg-gold transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-xl font-serif text-anthracite">
                            {isFullyComplete ? "Profil complet ! 🚀" : "Complétez votre profil"}
                        </CardTitle>
                        <CardDescription>
                            Un profil complet est 5x plus visible et inspire confiance aux clients.
                        </CardDescription>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-bold text-gold">{completedCount}/{steps.length}</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className={`flex items-center p-3 rounded-lg border transition-all duration-200 ${step.isCompleted
                                ? "bg-green-50/50 border-green-100"
                                : "bg-white border-gray-100 hover:border-gold/30 hover:shadow-sm"
                                }`}
                        >
                            <div
                                className={`flex items-center justify-center h-10 w-10 rounded-full mr-4 shrink-0 ${step.isCompleted ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
                                    }`}
                            >
                                {step.isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <step.icon className="h-5 w-5" />}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className={`font-medium ${step.isCompleted ? "text-green-900" : "text-gray-900"}`}>
                                    {step.label}
                                </h4>
                                <p className="text-sm text-muted-foreground truncate">
                                    {step.description}
                                </p>
                            </div>

                            {!step.isCompleted && (
                                <Button asChild size="sm" variant="ghost" className="shrink-0 text-gold hover:text-gold hover:bg-gold/10">
                                    <Link href={step.href}>
                                        Go <ArrowRight className="ml-1 h-3 w-3" />
                                    </Link>
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                {isFullyComplete && (
                    <div className="mt-4 p-4 bg-gold/10 rounded-lg text-center text-sm text-anthracite">
                        <span className="font-semibold text-gold">Conseil :</span> Votre profil est optimisé pour attirer un maximum de clients !
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
