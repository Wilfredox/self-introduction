import { AdminSession, MockDatabase } from "../types/content";
import { seedDatabase } from "./mockSeed";

export const STORAGE_KEY = "portfolio-site-db";
export const SESSION_KEY = "portfolio-admin-session";
export const UPDATE_EVENT = "portfolio-data-updated";

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readDatabase(): MockDatabase {
  if (!canUseStorage()) {
    return clone(seedDatabase);
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    const fresh = clone(seedDatabase);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }

  try {
    return JSON.parse(stored) as MockDatabase;
  } catch {
    const fresh = clone(seedDatabase);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }
}

export function writeDatabase(database: MockDatabase) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: { at: database.contentVersion } }));
}

export function updateDatabase(updater: (database: MockDatabase) => MockDatabase) {
  const current = readDatabase();
  const next = updater(clone(current));
  next.contentVersion = new Date().toISOString();
  writeDatabase(next);
  return next;
}

export function readSession(): AdminSession | null {
  if (!canUseStorage()) {
    return null;
  }

  const stored = window.localStorage.getItem(SESSION_KEY);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as AdminSession;
  } catch {
    return null;
  }
}

export function writeSession(session: AdminSession) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
}
