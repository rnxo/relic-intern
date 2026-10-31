import Navigationbar from "../_components/Navigationbar";

// ボトムナビを表示するページ用のレイアウト（相談室など全画面のページはこのグループに入れない）
export default function WithNavLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navigationbar />
      {/* モバイル: サイドバーは非表示（ボトムナビ）なので余白なし
          lg以上: 左サイドバー(w-20)分だけ本文をずらす */}
      <div className="lg:ml-20 pb-16 lg:pb-0">{children}</div>
    </div>
  );
}
