import { profileRepository } from "./profile.repository";
import { UpdateProfileInput } from "./profile.type";

export const profileService = {
  get: async () => await profileRepository.get(),
  update: async (input: UpdateProfileInput) => await profileRepository.update(input),
}