import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Habit, NewHabitInput } from "./habit.type";
import { petQueryKey } from "@/app/features/pet/pet.state";
import type { Pet } from "@/app/features/pet/pet.type";

export const habitQueryKey = ["habits"] as const;

export const useHabitsQuery = (options?: { initialData? : Habit[] }) => {
    return useQuery({
        queryKey: habitQueryKey,
        queryFn: async (): Promise<Habit[]> => {
            const res = await fetch("/api/habit");
            if (!res.ok) throw new Error("Failed to fetch habits");
            return res.json() as Promise<Habit[]>;
        },
        initialData: options?.initialData,
        refetchOnWindowFocus: true,
        staleTime: 0,
    });
};

export const useHabits = () => {
    const queryClient = useQueryClient();
    const { data: habits = [] } = useHabitsQuery();

    const addMutation = useMutation({
        mutationFn: async (input: NewHabitInput) => {
            const res = await fetch("/api/habit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(input),
            });
            if (!res.ok) throw new Error("Failed to add habit");
            const { data } = await res.json();
            return data as Habit;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: habitQueryKey });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/habit/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete habit");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: habitQueryKey });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, input }: { id: string; input: Partial<Habit> }) => {
            const res = await fetch(`/api/habit/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(input),
            });
            if (!res.ok) throw new Error("Failed to update habit");
            const { data } = await res.json();
            return data as Habit;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: habitQueryKey });
        },
    });

    const completeMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/habit/${id}`, { method: "PATCH" });
            if (!res.ok) throw new Error("Failed to complete habit");
            const { data } = await res.json();
            return data as Habit;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: habitQueryKey });
            if (data.is_completed) {
                // 完了時のjoy表現アニメーション（3秒間）
                queryClient.setQueryData(petQueryKey, (prev: Pet | null | undefined) =>
                    prev ? { ...prev, expression: "joy" as const } : prev
                );
                setTimeout(() => {
                    queryClient.invalidateQueries({ queryKey: petQueryKey });
                }, 3000);
            } else {
                queryClient.invalidateQueries({ queryKey: petQueryKey });
            }
        },
    });

    const addNewHabit = (input: NewHabitInput) => addMutation.mutateAsync(input);
    const deleteHabit = (id: string) => deleteMutation.mutateAsync(id);
    const updateHabit = (id: string, input: Partial<Habit>) => updateMutation.mutateAsync({ id, input });
    const completeHabit = (id: string) => completeMutation.mutateAsync(id);

    return { habits, addNewHabit, deleteHabit, updateHabit, completeHabit };
};
