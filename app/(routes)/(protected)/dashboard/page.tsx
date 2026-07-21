import { habitService } from "@/app/features/habit/habit.service";
import { petService } from "@/app/features/pet/pet.service";
import ClientDashBoardPage from "./_components/ClientDashBoardPage";

export default async function DashboardPage() {
    const [ habits, pet ] = await Promise.all([
        habitService.getAll(),
        petService.get(),
    ]);

    return (
        <ClientDashBoardPage initHabits={habits} initPet={pet}/>
    );
}