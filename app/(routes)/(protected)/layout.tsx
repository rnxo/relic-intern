import { profileService } from "@/app/features/profile/profile.service";
import { petService } from "@/app/features/pet/pet.service";
import Sidebar from "./_components/Sidebar";
import JotaiHydrator from "./_components/JotaiHydrator";

export default async function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [profileResult, petResult] = await Promise.allSettled([
    profileService.get(),
    petService.get(),
  ]);

  const profile =
    profileResult.status === "fulfilled" ? profileResult.value : null;
  const pet = petResult.status === "fulfilled" ? petResult.value : null;

  return (
    <div>
      <Sidebar />
      <JotaiHydrator profile={profile} pet={pet}>
        {children}
      </JotaiHydrator>
    </div>
  );
}
