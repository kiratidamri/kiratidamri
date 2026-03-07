"use client";

import type { SubRegionRisk } from "@/lib/types";

const DEFAULT_CENTER = { lat: 39.8283, lng: -98.5795 };
const DEFAULT_ZOOM = 4;

interface RiskMapProps {
  subRegions: SubRegionRisk[];
  center?: { lat: number; lng: number };
  className?: string;
}

function getRiskColor(score: number): string {
  if (score <= 3) return "rgba(34, 197, 94, 0.4)";
  if (score <= 6) return "rgba(234, 179, 8, 0.4)";
  if (score <= 9) return "rgba(249, 115, 22, 0.4)";
  return "rgba(34, 197, 94, 0.5)";
}

function getRiskLabel(score: number): string {
  if (score <= 3) return "0–3 Lower safe – revise plans";
  if (score <= 6) return "4–6 Intermediate – be cautious";
  if (score <= 9) return "7–9 Higher safe – follow law/regs";
  return "10 Highest – no concerns";
}

export function RiskMap({ subRegions, center = DEFAULT_CENTER, className = "" }: RiskMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className={`overflow-hidden rounded-xl border border-slate-600 bg-slate-800/50 ${className}`}>
        <div className="flex h-[400px] flex-col items-center justify-center gap-2 p-6 text-center">
          <p className="text-slate-400">Map placeholder (add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY for Google Maps)</p>
          <div className="flex flex-wrap justify-center gap-2">
            {subRegions.map((r) => (
              <span
                key={r.id}
                className="risk-badge"
                style={{
                  backgroundColor: getRiskColor(r.riskScore),
                  color: "#fff",
                  padding: "4px 10px",
                  borderRadius: "9999px",
                }}
              >
                {r.name}: {r.riskScore}/10
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="overflow-hidden rounded-xl border border-slate-600 bg-slate-800/50">
        <iframe
          title="Risk map"
          width="100%"
          height="400"
          style={{ border: 0 }}
          src={`https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${center.lat},${center.lng}&zoom=${subRegions.length ? 6 : DEFAULT_ZOOM}`}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {subRegions.map((r) => (
          <span
            key={r.id}
            className={`risk-badge ${
              r.riskScore <= 3
                ? "risk-0-3"
                : r.riskScore <= 6
                ? "risk-4-6"
                : r.riskScore <= 9
                ? "risk-7-9"
                : "risk-10"
            }`}
          >
            {r.name}: {r.riskScore}/10 — {getRiskLabel(r.riskScore).split(" – ")[0]}
          </span>
        ))}
      </div>
    </div>
  );
}
