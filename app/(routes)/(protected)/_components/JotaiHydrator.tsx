"use client";

import { useHydrateAtoms } from "jotai/utils";
import { profileAtom } from "@/app/features/profile/profile.state";
import type { Profile } from "@/app/features/profile/profile.type";

type Props = {
  profile: Profile | null;
  children: React.ReactNode;
};

export default function JotaiHydrator({ profile, children }: Props) {
  useHydrateAtoms([
    [profileAtom, profile],
  ]);

  return <>{children}</>;
}
