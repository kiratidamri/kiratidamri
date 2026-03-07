"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { UserProfile, EmergencyContact } from "@/lib/types";
import { HEALTH_CONCERNS_CHECKLIST } from "@/lib/types";
import { setStoredUser } from "@/lib/store";

const emptyEmergency: EmergencyContact = { name: "", phone: "" };
const initialHealth: Record<string, boolean> = Object.fromEntries(
  HEALTH_CONCERNS_CHECKLIST.map((k) => [k, false])
);

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    dateOfBirth: "",
    address: "",
    phone: "",
    email: "",
    emergencyContact: { ...emptyEmergency },
    citizenship: "",
    height: "",
    weight: "",
    bloodType: "",
    race: "",
    healthConcerns: { ...initialHealth },
    vaccinationHistory: "",
    additionalNote: "",
    consentSigned: false,
    consentDate: "",
    signature: "",
  });

  const update = (key: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateEmergency = (key: keyof EmergencyContact, value: string) => {
    setForm((prev) => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [key]: value },
    }));
  };

  const toggleHealth = (key: string) => {
    setForm((prev) => ({
      ...prev,
      healthConcerns: { ...prev.healthConcerns, [key]: !prev.healthConcerns[key] },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
      return;
    }
    const user: UserProfile = {
      id: crypto.randomUUID(),
      name: form.name,
      dateOfBirth: form.dateOfBirth,
      address: form.address,
      phone: form.phone,
      email: form.email,
      emergencyContact: form.emergencyContact,
      citizenship: form.citizenship,
      height: form.height,
      weight: form.weight,
      bloodType: form.bloodType,
      race: form.race,
      healthConcerns: form.healthConcerns,
      vaccinationHistory: form.vaccinationHistory,
      additionalNote: form.additionalNote,
      consentSigned: form.consentSigned,
      consentDate: form.consentDate,
      createdAt: new Date().toISOString(),
    };
    setStoredUser(user);
    router.push("/itinerary");
  };

  const steps = [
    { num: 1, title: "Personal & contact" },
    { num: 2, title: "Physical & citizenship" },
    { num: 3, title: "Health & vaccination" },
    { num: 4, title: "Consent & sign" },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-3xl font-semibold text-white">Register</h1>
      <p className="mt-2 text-slate-400">Create your SafeTraX profile for travel safety.</p>

      <div className="mt-8 flex gap-2">
        {steps.map((s) => (
          <button
            key={s.num}
            type="button"
            onClick={() => setStep(s.num)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              step === s.num ? "bg-safetrax-teal text-white" : "bg-slate-700/50 text-slate-400"
            }`}
          >
            {s.num}. {s.title}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="card mt-6 space-y-6 p-6">
        {step === 1 && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-300">Full name *</label>
              <input
                type="text"
                required
                className="input-field mt-1"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Date of birth *</label>
              <input
                type="date"
                required
                className="input-field mt-1"
                value={form.dateOfBirth}
                onChange={(e) => update("dateOfBirth", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Address *</label>
              <input
                type="text"
                required
                className="input-field mt-1"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Phone number *</label>
              <input
                type="tel"
                required
                className="input-field mt-1"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Email *</label>
              <input
                type="email"
                required
                className="input-field mt-1"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>
            <div className="rounded-lg border border-slate-600 bg-slate-800/30 p-4">
              <h3 className="text-sm font-medium text-slate-300">Emergency contact</h3>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Name"
                  className="input-field"
                  value={form.emergencyContact.name}
                  onChange={(e) => updateEmergency("name", e.target.value)}
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  className="input-field"
                  value={form.emergencyContact.phone}
                  onChange={(e) => updateEmergency("phone", e.target.value)}
                />
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-300">Citizenship *</label>
              <input
                type="text"
                required
                className="input-field mt-1"
                placeholder="e.g. United States"
                value={form.citizenship}
                onChange={(e) => update("citizenship", e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-300">Height</label>
                <input
                  type="text"
                  className="input-field mt-1"
                  placeholder="e.g. 5 ft 10 in"
                  value={form.height}
                  onChange={(e) => update("height", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">Weight</label>
                <input
                  type="text"
                  className="input-field mt-1"
                  placeholder="e.g. 70 kg"
                  value={form.weight}
                  onChange={(e) => update("weight", e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-300">Blood type</label>
                <select
                  className="input-field mt-1"
                  value={form.bloodType}
                  onChange={(e) => update("bloodType", e.target.value)}
                >
                  <option value="">Select</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">Race / ethnicity</label>
                <input
                  type="text"
                  className="input-field mt-1"
                  placeholder="Optional"
                  value={form.race}
                  onChange={(e) => update("race", e.target.value)}
                />
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div>
              <h3 className="text-sm font-medium text-slate-300">Health concerns (check all that apply)</h3>
              <ul className="mt-3 space-y-2">
                {HEALTH_CONCERNS_CHECKLIST.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`health-${item}`}
                      checked={form.healthConcerns[item] ?? false}
                      onChange={() => toggleHealth(item)}
                      className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-safetrax-teal focus:ring-safetrax-teal"
                    />
                    <label htmlFor={`health-${item}`} className="text-sm text-slate-300">{item}</label>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Vaccination history</label>
              <textarea
                className="input-field mt-1 min-h-[100px]"
                placeholder="List vaccines and dates (e.g. COVID-19 booster 2024, flu 2024)"
                value={form.vaccinationHistory}
                onChange={(e) => update("vaccinationHistory", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Additional note</label>
              <textarea
                className="input-field mt-1 min-h-[80px]"
                placeholder="Any other health or travel notes"
                value={form.additionalNote}
                onChange={(e) => update("additionalNote", e.target.value)}
              />
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
              <h3 className="font-medium text-amber-200">Consent & knowledge</h3>
              <p className="mt-2 text-sm text-slate-300">
                I understand that SafeTraX provides context-aware travel risk and health advisory based on my profile and itinerary. 
                This app analyzes health data to offer recommendations and may show relevant services (e.g. vaccine providers, hospitals, drug stores). 
                I consent to this analysis and the use of my data for these purposes.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="consent"
                required
                checked={form.consentSigned}
                onChange={(e) => {
                  update("consentSigned", e.target.checked);
                  if (e.target.checked && !form.consentDate) update("consentDate", new Date().toISOString().slice(0, 10));
                }}
                className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-safetrax-teal"
              />
              <label htmlFor="consent" className="text-sm text-slate-300">I agree and consent (digital signature) *</label>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Consent date *</label>
              <input
                type="date"
                required
                className="input-field mt-1"
                value={form.consentDate}
                onChange={(e) => update("consentDate", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Full name (digital signature) *</label>
              <input
                type="text"
                required
                className="input-field mt-1"
                placeholder="Type your full name to sign"
                value={form.signature}
                onChange={(e) => update("signature", e.target.value)}
              />
            </div>
          </>
        )}

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className="btn-secondary"
            disabled={step === 1}
          >
            Back
          </button>
          <button type="submit" className="btn-primary">
            {step === 4 ? "Complete registration" : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
}
