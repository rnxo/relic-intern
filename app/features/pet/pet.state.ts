import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Pet, UpdatePetType } from "./pet.type";

export const petQueryKey = ["pet"] as const;

export const usePetQuery = (options? : { initialData: Pet }) => {
    return useQuery({
        queryKey: petQueryKey,
        queryFn: async (): Promise<Pet | null> => {
            const res = await fetch("/api/pet");
            if (!res.ok) return null;
            return res.json() as Promise<Pet>;
        },
        initialData: options?.initialData,
    });
};

export const useUpdatePet = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (input: UpdatePetType) => {
            const res = await fetch("/api/pet", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(input),
            });
            if (!res.ok) throw new Error("Failed to update pet");
            const { data } = await res.json();
            return data as Pet;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: petQueryKey });
        },
    });
};

export const usePet = () => {
    const { data: pet = null } = usePetQuery();
    const { mutateAsync: updatePet } = useUpdatePet();
    return { pet, updatePet };
};
