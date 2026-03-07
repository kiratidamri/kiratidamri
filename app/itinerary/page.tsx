"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { TravelPlan, Destination } from "@/lib/types";
import { getStoredUser, getStoredPlans, setStoredPlans } from "@/lib/store";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming", "District of Columbia",
];

export default function ItineraryPage() {
  const router = useRouter();
  const [user, setUser] = useState<ReturnType<typeof getStoredUser>>(null);
  const [plans, setPlansState] = useState<TravelPlan[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<TravelPlan>>({
    destinations: [],
    primaryTransportation: "",
    checklist: {
      immigration: false,
      healthRegulations: false,
      lawRegulations: false,
      weather: false,
      other: "",
    },
  });

  useEffect(() => {
    setUser(getStoredUser());
    setPlansState(getStoredPlans());
  }, []);

  const addDestination = (type: "us" | "international") => {
    const dest: Destination = {
      id: crypto.randomUUID(),
      type,
      city: "",
      arrivalDate: "",
      departureDate: "",
      ...(type === "us" ? { usState: "" } : { country: "" }),
    };
    setForm((prev) => ({
      ...prev,
      destinations: [...(prev.destinations ?? []), dest],
    }));
  };

  const updateDestination = (id: string, patch: Partial<Destination>) => {
    setForm((prev) => ({
      ...prev,
      destinations: (prev.destinations ?? []).map((d) =>
        d.id === id ? { ...d, ...patch } : d
      ),
    }));
  };

  const removeDestination = (id: string) => {
    setForm((prev) => ({
      ...prev,
      destinations: (prev.destinations ?? []).filter((d) => d.id !== id),
    }));
  };

  const savePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const userProfile = getStoredUser();
    if (!userProfile) {
      router.push("/register");
      return;
    }
    const plan: TravelPlan = {
      id: editingId ?? crypto.randomUUID(),
      userId: userProfile.id,
      destinations: form.destinations ?? [],
      primaryTransportation: form.primaryTransportation ?? "",
      checklist: form.checklist ?? {
        immigration: false,
        healthRegulations: false,
        lawRegulations: false,
        weather: false,
        other: "",
      },
      createdAt: editingId
        ? (plans.find((p) => p.id === editingId)?.createdAt ?? new Date().toISOString())
        : new Date().toISOString(),
    };
    const next = editingId
      ? plans.map((p) => (p.id === editingId ? plan : p))
      : [...plans, plan];
    setStoredPlans(next);
    setPlansState(next);
    setEditingId(null);
    setForm({
      destinations: [],
      primaryTransportation: "",
      checklist: {
        immigration: false,
        healthRegulations: false,
        lawRegulations: false,
        weather: false,
        other: "",
      },
    });
  };

  const startEdit = (plan: TravelPlan) => {
    setEditingId(plan.id);
    setForm({
      destinations: plan.destinations,
      primaryTransportation: plan.primaryTransportation,
      checklist: plan.checklist,
    });
  };

  if (user === null) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-slate-400">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-slate-400">Please register first.</p>
        <button onClick={() => router.push("/register")} className="btn-primary mt-4">
          Register
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-3xl font-semibold text-white">Travel plan (Itinerary)</h1>
      <p className="mt-2 text-slate-400">Add destinations, dates, transport and checklists.</p>

      <form onSubmit={savePlan} className="card mt-8 space-y-6 p-6">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-slate-200">Destinations</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => addDestination("us")}
                className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-700"
              >
                + US
              </button>
              <button
                type="button"
                onClick={() => addDestination("international")}
                className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-700"
              >
                + International
              </button>
            </div>
          </div>
          <ul className="mt-4 space-y-4">
            {(form.destinations ?? []).map((d) => (
              <li key={d.id} className="rounded-lg border border-slate-600 bg-slate-800/30 p-4">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">
                    {d.type === "us" ? "US" : "International"}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeDestination(d.id)}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="City"
                    className="input-field"
                    value={d.city}
                    onChange={(e) => updateDestination(d.id, { city: e.target.value })}
                  />
                  {d.type === "us" ? (
                    <select
                      className="input-field"
                      value={d.usState ?? ""}
                      onChange={(e) => updateDestination(d.id, { usState: e.target.value })}
                    >
                      <option value="">Select state</option>
                      {US_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="Country"
                      className="input-field"
                      value={d.country ?? ""}
                      onChange={(e) => updateDestination(d.id, { country: e.target.value })}
                    />
                  )}
                  <input
                    type="date"
                    placeholder="Arrival"
                    className="input-field"
                    value={d.arrivalDate}
                    onChange={(e) => updateDestination(d.id, { arrivalDate: e.target.value })}
                  />
                  <input
                    type="date"
                    placeholder="Departure"
                    className="input-field"
                    value={d.departureDate}
                    onChange={(e) => updateDestination(d.id, { departureDate: e.target.value })}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300">Primary transportation</label>
          <select
            className="input-field mt-1"
            value={form.primaryTransportation}
            onChange={(e) => setForm((p) => ({ ...p, primaryTransportation: e.target.value }))}
          >
            <option value="">Select</option>
            <option value="Flight">Flight</option>
            <option value="Car">Car</option>
            <option value="Train">Train</option>
            <option value="Bus">Bus</option>
            <option value="Ship">Ship</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="rounded-lg border border-slate-600 bg-slate-800/30 p-4">
          <h3 className="text-sm font-medium text-slate-300">Checklist — immigration, health, law, weather</h3>
          <ul className="mt-3 space-y-2">
            {[
              { key: "immigration", label: "Immigration requirements checked" },
              { key: "healthRegulations", label: "Health regulations (vaccines, etc.) checked" },
              { key: "lawRegulations", label: "Local law regulations checked" },
              { key: "weather", label: "Weather / seasonal risks checked" },
            ].map(({ key, label }) => (
              <li key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`check-${key}`}
                  checked={form.checklist?.[key as keyof typeof form.checklist] as boolean ?? false}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      checklist: {
                        ...p.checklist!,
                        [key]: e.target.checked,
                      },
                    }))
                  }
                  className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-safetrax-teal"
                />
                <label htmlFor={`check-${key}`} className="text-sm text-slate-300">{label}</label>
              </li>
            ))}
            <li className="mt-2">
              <label className="block text-sm text-slate-400">Other notes</label>
              <input
                type="text"
                className="input-field mt-1"
                placeholder="Other checklist items"
                value={form.checklist?.other ?? ""}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    checklist: { ...p.checklist!, other: e.target.value },
                  }))
                }
              />
            </li>
          </ul>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn-primary">
            {editingId ? "Update plan" : "Save plan"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({
                  destinations: [],
                  primaryTransportation: "",
                  checklist: {
                    immigration: false,
                    healthRegulations: false,
                    lawRegulations: false,
                    weather: false,
                    other: "",
                  },
                });
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {plans.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-medium text-slate-200">Saved plans</h2>
          <ul className="mt-4 space-y-3">
            {plans.map((plan) => (
              <li key={plan.id} className="card flex items-center justify-between p-4">
                <div>
                  <span className="text-slate-300">
                    {plan.destinations.map((d) => `${d.city}${d.usState ? `, ${d.usState}` : d.country ? `, ${d.country}` : ""}`).join(" → ")}
                  </span>
                  <span className="ml-2 text-sm text-slate-500">{plan.primaryTransportation}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(plan)}
                    className="btn-secondary text-sm"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push(`/analysis?planId=${plan.id}`)}
                    className="btn-primary text-sm"
                  >
                    Analyze
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
