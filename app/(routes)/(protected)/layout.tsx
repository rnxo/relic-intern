import { profileService } from "@/app/features/profile/profile.service";
import Sidebar from "./_components/Sidebar";
import JotaiHydrator from "./_components/JotaiHydrator";
import { Analytics } from "@vercel/analytics/next";

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
      {/* モバイル: サイドバーは非表示（ボトムナビ）なので余白なし
          lg以上: 左サイドバー(w-20)分だけ本文をずらす */}
      <JotaiHydrator profile={profile}>
        <body className="lg:ml-20 pb-16 lg:pb-0">
          {children}
          <Analytics />
        </body>
      </JotaiHydrator>
    </div>
  );
}
