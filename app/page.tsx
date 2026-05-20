import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-lumi-base">
      <h1 className="text-2xl font-bold text-lumi-primary">
        ようこそ、ユーザーさん
      </h1>
      <Link className="text-lumi-primary hover:underline" href={"/dashboard"}>
        メールの承認をしてLumiを始めよう!!
      </Link>
    </div>
  );
}
