import { atom, useAtom } from "jotai";
import { Profile, UpdateProfileInput } from "./profile.type";

export const profileAtom = atom<Profile | null>(null);

export const initProfileAtom = atom(null, async (_get, set) => {
  const res = await fetch("/api/user-profile");
  if (!res.ok) return;
  const data = await res.json();
  set(profileAtom, data);
});

export const useProfile = () => {
  const [profile, setProfile] = useAtom<Profile | null>(profileAtom);

  const updateProfile = async (input: UpdateProfileInput) => {
    const res = await fetch("/api/user-profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!res.ok) return;
    const { data } = await res.json();
    setProfile(data);
  };

  return { profile, updateProfile };
};
