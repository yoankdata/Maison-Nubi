"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Plus,
    Trash2,
    Loader2,
    AlertCircle,
    Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import type { Service } from "@/lib/database.types";

// Schéma de validation du service
const serviceSchema = z.object({
    title: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
    price: z.number().min(0, "Le prix doit être positif"),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

/**
 * Page de gestion des services
 * CRUD complet avec Dialog pour l'ajout
 */
export default function ServicesPage() {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ServiceFormData>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            title: "",
            price: 0,
        },
    });

    // Récupérer l'utilisateur et ses services
    const { data: services, isLoading } = useQuery<Service[]>({
        queryKey: ["services"],
        queryFn: async () => {
            if (!supabase) throw new Error("Supabase non configuré");

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Non connecté");

            const { data, error } = await supabase
                .from("services")
                .select("*")
                .eq("profile_id", user.id)
                .order("created_at", { ascending: false });

            if (error) throw error;
            // Cast vers Service[] - Correspond à database.types.ts
            return (data ?? []) as Service[];
        },
    });

    // Mutation pour ajouter un service
    const addService = useMutation({
        mutationFn: async (data: ServiceFormData) => {
            if (!supabase) throw new Error("Supabase non configuré");

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Non connecté");

            const { error } = await supabase
                .from("services")
                .insert({
                    profile_id: user.id,
                    title: data.title,
                    price: data.price,
                } as never);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services"] });
            setIsDialogOpen(false);
            reset();
            setError(null);
        },
        onError: (err) => {
            setError(err instanceof Error ? err.message : "Erreur lors de l'ajout");
        },
    });

    // Mutation pour supprimer un service
    const deleteService = useMutation({
        mutationFn: async (serviceId: string) => {
            if (!supabase) throw new Error("Supabase non configuré");

            const { error } = await supabase
                .from("services")
                .delete()
                .eq("id", serviceId);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services"] });
        },
        onError: (err) => {
            setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
        },
    });

    const onSubmit = (data: ServiceFormData) => {
        addService.mutate(data);
    };

    return (
        <div className="space-y-6 max-w-2xl">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-2xl font-bold text-anthracite">
                        Mes Services
                    </h1>
                    <p className="text-muted-foreground">
                        Gérez vos prestations et tarifs
                    </p>
                </div>

                {/* Bouton Ajouter */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-full bg-gold hover:bg-gold-dark text-white">
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Ajouter un service</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Titre */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nom du service</label>
                                <Input
                                    placeholder="Ex: Tresses collées"
                                    {...register("title")}
                                />
                                {errors.title && (
                                    <p className="text-xs text-red-500">{errors.title.message}</p>
                                )}
                            </div>

                            {/* Prix */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Prix (FCFA)</label>
                                <Input
                                    type="number"
                                    placeholder="15000"
                                    {...register("price", { valueAsNumber: true })}
                                />
                                {errors.price && (
                                    <p className="text-xs text-red-500">{errors.price.message}</p>
                                )}
                            </div>

                            <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">
                                        Annuler
                                    </Button>
                                </DialogClose>
                                <Button
                                    type="submit"
                                    disabled={addService.isPending}
                                    className="bg-gold hover:bg-gold-dark text-white"
                                >
                                    {addService.isPending ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        "Ajouter"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Message d'erreur */}
            {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {error}
                </div>
            )}

            {/* Liste des services */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Vos prestations</CardTitle>
                    <CardDescription>
                        Ces services seront affichés sur votre profil public
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-gold" />
                        </div>
                    ) : services && services.length > 0 ? (
                        <div className="divide-y divide-border">
                            {services.map((service) => (
                                <div
                                    key={service.id}
                                    className="flex items-center justify-between py-3"
                                >
                                    <div>
                                        <p className="font-medium text-anthracite">{service.title}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold text-gold">
                                            {formatPrice(service.price)}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-red-500"
                                            onClick={() => deleteService.mutate(service.id)}
                                            disabled={deleteService.isPending}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground">
                                Aucun service ajouté
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Cliquez sur &quot;Ajouter&quot; pour créer votre première prestation
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
