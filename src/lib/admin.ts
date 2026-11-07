import type { User } from "firebase/auth";

export const ADMIN_EMAILS = ["mertmyigit@gmail.com"] as const;

export function isAdminUser(user: Pick<User, "email" | "emailVerified"> | null | undefined) {
  return user?.emailVerified === true
    && ADMIN_EMAILS.some((email) => email.toLowerCase() === user.email?.toLowerCase());
}
