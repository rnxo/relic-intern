import { Habit } from "./habit";
import { Pet } from "./pet";

export type User = {
    id: string;
    name: string;
    habits: Habit[];
    pet: Pet;
}