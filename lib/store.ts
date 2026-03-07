"use client";

import type { UserProfile, TravelPlan, TravelAnalysis, RealtimeShare } from "./types";

const STORAGE_KEYS = {
  user: "safetrax_user",
  plans: "safetrax_plans",
  analysis: "safetrax_analysis",
  share: "safetrax_share",
} as const;

function getJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function setJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getStoredUser(): UserProfile | null {
  return getJson<UserProfile>(STORAGE_KEYS.user);
}

export function setStoredUser(user: UserProfile): void {
  setJson(STORAGE_KEYS.user, user);
}

export function getStoredPlans(): TravelPlan[] {
  return getJson<TravelPlan[]>(STORAGE_KEYS.plans) ?? [];
}

export function setStoredPlans(plans: TravelPlan[]): void {
  setJson(STORAGE_KEYS.plans, plans);
}

export function getStoredAnalysis(planId: string): TravelAnalysis | null {
  const all = getJson<Record<string, TravelAnalysis>>(STORAGE_KEYS.analysis) ?? {};
  return all[planId] ?? null;
}

export function setStoredAnalysis(planId: string, analysis: TravelAnalysis): void {
  const all = getJson<Record<string, TravelAnalysis>>(STORAGE_KEYS.analysis) ?? {};
  all[planId] = analysis;
  setJson(STORAGE_KEYS.analysis, all);
}

export function getStoredShare(): RealtimeShare | null {
  return getJson<RealtimeShare>(STORAGE_KEYS.share);
}

export function setStoredShare(share: RealtimeShare | null): void {
  if (share) setJson(STORAGE_KEYS.share, share);
  else if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEYS.share);
}
