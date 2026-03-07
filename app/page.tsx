import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-safetrax-navy via-slate-900 to-safetrax-navy" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(13,148,136,0.15),transparent)]" />
      <div className="relative mx-auto max-w-4xl px-4 py-24 text-center">
        <h1 className="font-display text-5xl font-semibold tracking-tight text-white sm:text-6xl">
          SafeTraX
        </h1>
        <p className="mt-4 text-xl text-slate-400">
          Context-aware travel risk and health advisory for travelers
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link href="/register" className="btn-primary">
            Register
          </Link>
          <Link href="/itinerary" className="btn-secondary">
            Plan your trip
          </Link>
          <Link href="/dashboard" className="btn-secondary">
            Live dashboard
          </Link>
        </div>
        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Profile & health", desc: "One-time registration with health and emergency info", href: "/register" },
            { title: "Itinerary", desc: "Destinations, dates, transport & checklists", href: "/itinerary" },
            { title: "Risk analysis", desc: "Scores, map, CDC/WHO links & recommendations", href: "/analysis" },
            { title: "Real-time & share", desc: "Weather, concerns, share with family or government", href: "/dashboard" },
          ].map(({ title, desc, href }) => (
            <Link key={href} href={href} className="card p-5 text-left transition hover:border-safetrax-teal/50">
              <h3 className="font-display text-lg font-medium text-safetrax-mint">{title}</h3>
              <p className="mt-2 text-sm text-slate-400">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
