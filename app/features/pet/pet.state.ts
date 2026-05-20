import { atom, useAtom } from "jotai";
import { Pet } from "./pet.type";

const res = await fetch('api/pet');
const initPetData: Pet= await res.json();
const petAtom = atom<Pet>(initPetData);

export const usePet = () => {
    const [ pet, setPet ] = useAtom<Pet>(petAtom);
    
    // useEffect(() => {
    //     fetch('api\pet')
    //         .then(res => res.json())
    //         .then(setPet)
    // },[]);

    const updatePet = async (input: Pet) => {
        const res = await fetch('api/pet', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(input),
        });

        if(!res.ok) throw new Error("ERROR: failed to upadate pet data");

        const updatedPet = await res.json();
        setPet(updatedPet);
    }
    return { pet, updatePet};
}