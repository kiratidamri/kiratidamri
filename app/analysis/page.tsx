"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { RiskMap } from "@/components/RiskMap";
import type { TravelPlan, TravelAnalysis, SubRegionRisk } from "@/lib/types";
import { getStoredUser, getStoredPlans, getStoredAnalysis, setStoredAnalysis } from "@/lib/store";

const EXTERNAL_LINKS = [
  { label: "CDC Travel Health", url: "https://wwwnc.cdc.gov/travel" },
  { label: "WHO Travel advice", url: "https://www.who.int/emergencies/diseases/novel-coronavirus-2019/travel-advice" },
  { label: "US State Dept travel", url: "https://travel.state.gov/content/travel/en/international-travel.html" },
];

function generateMockSubRegions(plan: TravelPlan): SubRegionRisk[] {
  const regions: SubRegionRisk[] = [];
  plan.destinations.forEach((d, i) => {
    const baseLat = 39 + (i * 2) + Math.random() * 2;
    const baseLng = -98 + (i * 5) + Math.random() * 4;
    for (let j = 0; j < 3; j++) {
      regions.push({
        id: `${d.id}-${j}`,
        name: `${d.city} area ${j + 1}`,
        lat: baseLat + (j * 0.3),
        lng: baseLng + (j * 0.3),
        riskScore: Math.floor(Math.random() * 11) as SubRegionRisk["riskScore"],
        radiusMiles: 30 + j * 20,
        sources: EXTERNAL_LINKS.slice(0, 2),
      });
    }
  });
  return regions.length ? regions : [
    { id: "default", name: "Trip area", lat: 39.8283, lng: -98.5795, riskScore: 5, radiusMiles: 100, sources: EXTERNAL_LINKS },
  ];
}

function getRiskBand(score: number): string {
  if (score <= 3) return "0–3: Lower safe — must revise your plans";
  if (score <= 6) return "4–6: Intermediate safe — be cautious";
  if (score <= 9) return "7–9: Higher safe — must follow law and regulation";
  return "10: Highest — no concerns";
}

export default function AnalysisPage() {
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId");
  const [user, setUser] = useState(getStoredUser());
  const [plans, setPlans] = useState<TravelPlan[]>([]);
  const [analysis, setAnalysisState] = useState<TravelAnalysis | null>(null);

  const plan = useMemo(() => (planId ? plans.find((p) => p.id === planId) ?? null : plans[0]), [planId, plans]);

  useEffect(() => {
    setUser(getStoredUser());
    setPlans(getStoredPlans());
  }, []);

  useEffect(() => {
    if (!plan) return;
    let a = getStoredAnalysis(plan.id);
    if (!a) {
      const subRegions = generateMockSubRegions(plan);
      const overall = Math.round(
        subRegions.reduce((s, r) => s + r.riskScore, 0) / subRegions.length
      ) as TravelAnalysis["overallRiskScore"];
      a = {
        planId: plan.id,
        overallRiskScore: overall,
        subRegions,
        recommendations: [
          "Check CDC and WHO links below for your destinations.",
          "Ensure vaccinations are up to date per local requirements.",
          "Subscribe to 2-hour notifications to verify compliance.",
        ],
        verifiedChecklist: {},
        followUpServices: [
          { id: "v1", type: "Vaccine provider", name: "Local travel clinic (example)", link: "#" },
          { id: "c1", type: "Car rental", name: "Rental options at destination", link: "#" },
          { id: "h1", type: "Hospitals", name: "Nearest emergency facilities", link: "#" },
          { id: "d1", type: "Drug stores", name: "Pharmacy locator", link: "#" },
        ],
        notificationEnabled: false,
        updatedAt: new Date().toISOString(),
      };
      setStoredAnalysis(plan.id, a);
    }
    setAnalysisState(a);
  }, [plan]);

  const toggleNotification = () => {
    if (!plan || !analysis) return;
    const next = {
      ...analysis,
      notificationEnabled: !analysis.notificationEnabled,
      lastNotifiedAt: !analysis.notificationEnabled ? new Date().toISOString() : analysis.lastNotifiedAt,
      updatedAt: new Date().toISOString(),
    };
    setStoredAnalysis(plan.id, next);
    setAnalysisState(next);
  };

  const toggleVerified = (key: string) => {
    if (!plan || !analysis) return;
    const next = {
      ...analysis,
      verifiedChecklist: {
        ...analysis.verifiedChecklist,
        [key]: !analysis.verifiedChecklist[key],
      },
      updatedAt: new Date().toISOString(),
    };
    setStoredAnalysis(plan.id, next);
    setAnalysisState(next);
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-slate-400">Please register first.</p>
        <Link href="/register" className="btn-primary mt-4 inline-block">Register</Link>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-slate-400">No travel plan selected. Create one from the Itinerary page.</p>
        <Link href="/itinerary" className="btn-primary mt-4 inline-block">Itinerary</Link>
      </div>
    );
  }

  if (!analysis) {
    return <div className="mx-auto max-w-2xl px-4 py-12 text-center text-slate-400">Loading analysis…</div>;
  }

  const mapCenter = analysis.subRegions.length
    ? {
        lat: analysis.subRegions.reduce((s, r) => s + r.lat, 0) / analysis.subRegions.length,
        lng: analysis.subRegions.reduce((s, r) => s + r.lng, 0) / analysis.subRegions.length,
      }
    : undefined;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-display text-3xl font-semibold text-white">Recommendation (Analysis)</h1>
      <p className="mt-2 text-slate-400">Risk score and sub-regions within ~100 miles of your travel plan.</p>

      <div className="card mt-8 p-6">
        <h2 className="text-lg font-medium text-slate-200">Overall risk score</h2>
        <div className="mt-2 flex items-baseline gap-3">
          <span
            className={`text-4xl font-bold ${
              analysis.overallRiskScore <= 3
                ? "text-green-400"
                : analysis.overallRiskScore <= 6
                ? "text-amber-400"
                : analysis.overallRiskScore <= 9
                ? "text-orange-400"
                : "text-emerald-400"
            }`}
          >
            {analysis.overallRiskScore}
          </span>
          <span className="text-slate-400">/ 10</span>
        </div>
        <p className="mt-1 text-sm text-slate-400">{getRiskBand(analysis.overallRiskScore)}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-medium text-slate-200">Map — risk by area (within ~100 mi of epicenter)</h2>
        <RiskMap subRegions={analysis.subRegions} center={mapCenter} className="mt-3" />
      </div>

      <div className="card mt-6 p-6">
        <h2 className="text-lg font-medium text-slate-200">Supporting links</h2>
        <ul className="mt-3 space-y-2">
          {EXTERNAL_LINKS.map(({ label, url }) => (
            <li key={url}>
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-safetrax-teal hover:underline">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="card mt-6 p-6">
        <h2 className="text-lg font-medium text-slate-200">Verify checklists & recommendations</h2>
        <p className="mt-1 text-sm text-slate-400">Confirm which items you have completed.</p>
        <ul className="mt-4 space-y-2">
          {analysis.recommendations.map((rec, i) => (
            <li key={i} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`rec-${i}`}
                checked={!!analysis.verifiedChecklist[`rec-${i}`]}
                onChange={() => toggleVerified(`rec-${i}`)}
                className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-safetrax-teal"
              />
              <label htmlFor={`rec-${i}`} className="text-sm text-slate-300">{rec}</label>
            </li>
          ))}
        </ul>
      </div>

      <div className="card mt-6 p-6">
        <h2 className="text-lg font-medium text-slate-200">Follow-up services (recommendations)</h2>
        <p className="mt-1 text-sm text-slate-400">Partners that may help: vaccine providers, car, hospitals, drug stores.</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {analysis.followUpServices.map((s) => (
            <li key={s.id} className="rounded-lg border border-slate-600 bg-slate-800/30 px-3 py-2">
              <span className="text-xs text-slate-500">{s.type}</span>
              <a href={s.link ?? "#"} className="block font-medium text-safetrax-teal hover:underline">{s.name}</a>
            </li>
          ))}
        </ul>
      </div>

      <div className="card mt-6 p-6">
        <h2 className="text-lg font-medium text-slate-200">Real-time notifications</h2>
        <p className="mt-1 text-sm text-slate-400">Get reminders every 2 hours to verify compliance and that your plans remain correct.</p>
        <div className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="notify"
            checked={analysis.notificationEnabled}
            onChange={toggleNotification}
            className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-safetrax-teal"
          />
          <label htmlFor="notify" className="text-sm text-slate-300">Enable 2-hour notifications</label>
        </div>
        {analysis.notificationEnabled && analysis.lastNotifiedAt && (
          <p className="mt-2 text-xs text-slate-500">Last notified: {new Date(analysis.lastNotifiedAt).toLocaleString()}</p>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <Link href="/dashboard" className="btn-primary">Open dashboard & share</Link>
        <Link href="/itinerary" className="btn-secondary">Back to itinerary</Link>
      </div>
    </div>
  );
}
