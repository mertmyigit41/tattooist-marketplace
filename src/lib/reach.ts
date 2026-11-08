import { FALLBACK_PROFILE_AVAILABILITY } from "./seed";
import { IS_LIVE } from "./mode";
import type { Profile } from "./types";

export function studioReach(profiles: Profile[], style: string) {
  const matching = profiles.filter(
    (profile) =>
      profile.role === "artist" &&
      (!IS_LIVE || profile.approved === true) &&
      profile.styles?.includes(style),
  );
  const hours = matching
    .map(
      (profile) =>
        profile.responseHours ??
        FALLBACK_PROFILE_AVAILABILITY[profile.id]?.responseHours,
    )
    .filter((value): value is number => typeof value === "number")
    .sort((a, b) => a - b);
  const median = hours.length
    ? hours[Math.floor((hours.length - 1) / 2)]
    : null;
  return { count: matching.length, medianResponseHours: median };
}
