import { atom, useAtom } from "jotai";
import { Pet } from "./pet.type";

export const petAtom = atom<Pet | null>(null);

export const initPetAtom = atom(null, async (_get, set) => {
    const res = await fetch("/api/pet");
    if (!res.ok) return;
    const data = await res.json();
    set(petAtom, data);
});

export const usePet = () => {
    const [pet, setPet] = useAtom<Pet | null>(petAtom);

    const updatePet = async (input: Pet) => {
        const res = await fetch("/api/pet", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
        });

        if (!res.ok) throw new Error("ERROR: failed to update pet data");

        const { data } = await res.json();
        setPet(data);
    };

    return { pet, updatePet };
};