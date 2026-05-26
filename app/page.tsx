"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSetAtom } from "jotai";
import { useProfile, initProfileAtom } from "./features/profile/profile.state";

export default function WelcomePage() {
  const { profile } = useProfile();
  const initProfile = useSetAtom(initProfileAtom);

  useEffect(() => {
    initProfile();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-lumi-base">
      <h1 className="text-2xl font-bold text-lumi-primary">
        ようこそ、{profile?.userName}
      </h1>
      <Link className="text-lumi-primary hover:underline" href={"/dashboard"}>
        メールの承認をしてLumiを始めよう!!
      </Link>
    </div>
  );
}
