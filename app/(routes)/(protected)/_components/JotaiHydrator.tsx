"use client";

import { useHydrateAtoms } from "jotai/utils";
import { petAtom } from "@/app/features/pet/pet.state";
import { profileAtom } from "@/app/features/profile/profile.state";
import type { Pet } from "@/app/features/pet/pet.type";
import type { Profile } from "@/app/features/profile/profile.type";

type Props = {
  profile: Profile | null;
  pet: Pet | null;
  children: React.ReactNode;
};

export default function JotaiHydrator({ profile, pet, children }: Props) {
  useHydrateAtoms([
    [profileAtom, profile],
    [petAtom, pet],
  ]);

  return <>{children}</>;
}
