import type { User } from "../types";

const KEY = "wa_user";

export function getCurrentUser(): User | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User) {
  sessionStorage.setItem(KEY, JSON.stringify(user));
}

export function logoutCurrentUser() {
  sessionStorage.removeItem(KEY);
}
