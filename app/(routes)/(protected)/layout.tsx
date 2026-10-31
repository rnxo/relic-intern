import { profileService } from "@/app/features/profile/profile.service";
import JotaiHydrator from "./_components/JotaiHydrator";
import { Analytics } from "@vercel/analytics/next";

// ログイン後の全ページ共通レイアウト（ナビの有無は子のルートグループで決める）
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
    <JotaiHydrator profile={profile}>
      {children}
      <Analytics />
    </JotaiHydrator>
  );
}
