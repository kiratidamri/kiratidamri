"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { RealtimeShare } from "@/lib/types";
import { getStoredUser, getStoredPlans, getStoredAnalysis, getStoredShare, setStoredShare } from "@/lib/store";

const CONCERN_KEYS = ["food", "water", "airPollution", "noisePollution", "unrest", "disasters"] as const;
const CONCERN_LABELS: Record<string, string> = {
  food: "Food safety",
  water: "Water quality",
  airPollution: "Air pollution",
  noisePollution: "Noise pollution",
  unrest: "Unrest / security",
  disasters: "Disasters / hazards",
};

const defaultConcerns = Object.fromEntries(CONCERN_KEYS.map((k) => [k, ""]));

export default function DashboardPage() {
  const [user, setUser] = useState(getStoredUser());
  const [plans, setPlans] = useState(getStoredPlans());
  const [share, setShareState] = useState<RealtimeShare | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    sharedWith: [] as { email: string; label: string }[],
    concerns: { ...defaultConcerns } as Record<string, string>,
    additionalNote: "",
  });
  const [newShareEmail, setNewShareEmail] = useState("");
  const [newShareLabel, setNewShareLabel] = useState("");

  const currentPlan = plans[0];
  const analysis = currentPlan ? getStoredAnalysis(currentPlan.id) : null;

  useEffect(() => {
    setUser(getStoredUser());
    setPlans(getStoredPlans());
    setShareState(getStoredShare());
  }, []);

  useEffect(() => {
    if (share) {
      setForm({
        sharedWith: share.sharedWith,
        concerns: share.concerns,
        additionalNote: share.additionalNote,
      });
    }
  }, [share]);

  const saveShare = () => {
    const profile = getStoredUser();
    if (!profile || !currentPlan || !analysis) return;
    const next: RealtimeShare = {
      id: share?.id ?? crypto.randomUUID(),
      userId: profile.id,
      planId: currentPlan.id,
      sharedWith: form.sharedWith,
      riskScore: analysis.overallRiskScore,
      weather: share?.weather ?? {
        temp: 72,
        condition: "Partly cloudy",
        location: currentPlan.destinations[0]?.city ?? "Destination",
      },
      concerns: form.concerns,
      additionalNote: form.additionalNote,
      updatedAt: new Date().toISOString(),
    };
    setStoredShare(next);
    setShareState(next);
    setEditing(false);
  };

  const addSharedWith = () => {
    if (!newShareEmail.trim()) return;
    setForm((prev) => ({
      ...prev,
      sharedWith: [...prev.sharedWith, { email: newShareEmail.trim(), label: newShareLabel.trim() || "Family/Friend" }],
    }));
    setNewShareEmail("");
    setNewShareLabel("");
  };

  const removeSharedWith = (index: number) => {
    setForm((prev) => ({
      ...prev,
      sharedWith: prev.sharedWith.filter((_, i) => i !== index),
    }));
  };

  const riskScore = share?.riskScore ?? analysis?.overallRiskScore ?? 0;
  const riskClass =
    riskScore <= 3 ? "text-green-400" : riskScore <= 6 ? "text-amber-400" : riskScore <= 9 ? "text-orange-400" : "text-emerald-400";

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-slate-400">Please register first.</p>
        <Link href="/register" className="btn-primary mt-4 inline-block">Register</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-3xl font-semibold text-white">Real-time dashboard</h1>
      <p className="mt-2 text-slate-400">Share risk, weather, and concerns with family, friends, or your government.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-lg font-medium text-slate-200">Risk score (live)</h2>
          <p className={`mt-2 text-4xl font-bold ${riskClass}`}>{riskScore} / 10</p>
          <p className="mt-1 text-sm text-slate-400">Based on your current travel plan and analysis.</p>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-medium text-slate-200">Real-time weather</h2>
          <p className="mt-2 text-2xl font-semibold text-slate-100">
            {share?.weather?.temp ?? "72"}°F
          </p>
          <p className="text-slate-400">
            {share?.weather?.condition ?? "Partly cloudy"} · {share?.weather?.location ?? currentPlan?.destinations[0]?.city ?? "Destination"}
          </p>
        </div>
      </div>

      <div className="card mt-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-slate-200">Concerns</h2>
          <button
            type="button"
            onClick={() => setEditing(!editing)}
            className="text-sm text-safetrax-teal hover:underline"
          >
            {editing ? "Cancel" : "Edit"}
          </button>
        </div>
        <p className="mt-1 text-sm text-slate-400">Food, water, air, noise, unrest, disasters — add notes for real-time situations.</p>
        <ul className="mt-4 space-y-3">
          {CONCERN_KEYS.map((key) => (
            <li key={key} className="flex items-start gap-2">
              <span className="w-32 shrink-0 text-sm text-slate-500">{CONCERN_LABELS[key]}</span>
              {editing ? (
                <input
                  type="text"
                  className="input-field flex-1 text-sm"
                  placeholder="e.g. Low risk / No issues"
                  value={form.concerns[key] ?? ""}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      concerns: { ...p.concerns, [key]: e.target.value },
                    }))
                  }
                />
              ) : (
                <span className="text-slate-300">{(share?.concerns ?? form.concerns)[key] || "—"}</span>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <label className="block text-sm text-slate-500">Additional note (real-time)</label>
          {editing ? (
            <textarea
              className="input-field mt-1 min-h-[80px]"
              value={form.additionalNote}
              onChange={(e) => setForm((p) => ({ ...p, additionalNote: e.target.value }))}
            />
          ) : (
            <p className="mt-1 text-slate-300">{(share?.additionalNote ?? form.additionalNote) || "—"}</p>
          )}
        </div>
        {editing && (
          <button type="button" onClick={saveShare} className="btn-primary mt-4">
            Save updates
          </button>
        )}
      </div>

      <div className="card mt-6 p-6">
        <h2 className="text-lg font-medium text-slate-200">Share with others</h2>
        <p className="mt-1 text-sm text-slate-400">Family, friends, or government — they can see risk score, weather, and concerns.</p>
        <ul className="mt-4 space-y-2">
          {(share?.sharedWith ?? form.sharedWith)?.map((s, i) => (
            <li key={i} className="flex items-center justify-between rounded-lg bg-slate-800/50 px-3 py-2">
              <span className="text-slate-300">{s.label}: {s.email}</span>
              {editing && (
                <button
                  type="button"
                  onClick={() => removeSharedWith(i)}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
        {editing && (
          <div className="mt-4 flex gap-2">
            <input
              type="email"
              placeholder="Email"
              className="input-field flex-1"
              value={newShareEmail}
              onChange={(e) => setNewShareEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Label (e.g. Family)"
              className="input-field w-32"
              value={newShareLabel}
              onChange={(e) => setNewShareLabel(e.target.value)}
            />
            <button type="button" onClick={addSharedWith} className="btn-secondary">
              Add
            </button>
          </div>
        )}
        {!editing && (share?.sharedWith ?? form.sharedWith)?.length === 0 && (
          <p className="mt-2 text-sm text-slate-500">Click Edit above to add contacts to share with.</p>
        )}
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setEditing(true);
              if (!share && currentPlan && analysis) {
                const profile = getStoredUser();
                if (profile) {
                  const newShare: RealtimeShare = {
                    id: crypto.randomUUID(),
                    userId: profile.id,
                    planId: currentPlan.id,
                    sharedWith: [],
                    riskScore: analysis.overallRiskScore,
                    weather: {
                      temp: 72,
                      condition: "Partly cloudy",
                      location: currentPlan.destinations[0]?.city ?? "Destination",
                    },
                    concerns: defaultConcerns,
                    additionalNote: "",
                    updatedAt: new Date().toISOString(),
                  };
                  setStoredShare(newShare);
                  setShareState(newShare);
                  setForm({
                    sharedWith: [],
                    concerns: defaultConcerns,
                    additionalNote: "",
                  });
                }
              }
            }}
            className="btn-primary"
          >
            {share ? "Edit & share" : "Create share"}
          </button>
          {share && (
            <button
              type="button"
              onClick={saveShare}
              className="btn-secondary"
            >
              Save
            </button>
          )}
        </div>
      </div>

      <p className="mt-6 text-xs text-slate-500">
        Last updated: {share?.updatedAt ? new Date(share.updatedAt).toLocaleString() : "—"}
      </p>

      <div className="mt-6 flex gap-3">
        <Link href="/analysis" className="btn-secondary">Analysis</Link>
        <Link href="/itinerary" className="btn-secondary">Itinerary</Link>
      </div>
    </div>
  );
}
