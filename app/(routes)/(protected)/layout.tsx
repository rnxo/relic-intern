import { profileService } from "@/app/features/profile/profile.service";
import Sidebar from "./_components/Sidebar";
import JotaiHydrator from "./_components/JotaiHydrator";

export default async function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let profile = null;
  try {
    profile = await profileService.get();
  } catch {}

  return (
    <div>
      <Sidebar />
      <JotaiHydrator profile={profile}>
        {children}
      </JotaiHydrator>
    </div>
  );
}
