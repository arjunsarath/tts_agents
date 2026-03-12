import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Zap,
  Layers,
  Target,
  ShieldCheck,
  Bot,
  ChevronRight,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const phases = [
  {
    label: 'Phase 1',
    name: 'Quick Wins',
    timeline: 'Weeks 1–4',
    color: 'bg-accent-light/40 text-accent border-accent-light',
    items: [
      'Deploy AI copilots for every team',
      'Build prompt libraries & templates',
      'Automate meeting summaries & action items',
      'Set up Slack-based AI automation',
    ],
  },
  {
    label: 'Phase 2',
    name: 'Workflow Transformation',
    timeline: 'Months 2–3',
    color: 'bg-green-50 text-green-700 border-green-200',
    items: [
      'RAG pipelines over internal knowledge',
      'QA & testing automation',
      'Customer support AI assistants',
      'AI literacy training programme',
    ],
  },
  {
    label: 'Phase 3',
    name: 'Strategic Integration',
    timeline: 'Months 4–6',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    items: [
      'Cross-functional AI agents',
      'Automated reporting dashboards',
      'Third-party AI tool integrations',
      'Transformation KPIs & measurement',
    ],
  },
]

const opportunityRows = [
  {
    fn: 'Compliance',
    current: 'Manual regulatory tracking across 30+ markets',
    opportunity: 'AI-powered regulatory monitoring & alert system',
    impact: 'High',
  },
  {
    fn: 'Operations',
    current: 'Manual transaction monitoring & reconciliation',
    opportunity: 'Automated anomaly detection & workflow orchestration',
    impact: 'High',
  },
  {
    fn: 'Growth & Marketing',
    current: 'Manual market analysis & campaign management',
    opportunity: 'AI-driven corridor analysis & content generation',
    impact: 'Medium',
  },
  {
    fn: 'Finance',
    current: 'Spreadsheet-based forecasting & reporting',
    opportunity: 'Automated financial modelling & variance analysis',
    impact: 'Medium',
  },
  {
    fn: 'Research & Data',
    current: 'Ad-hoc analysis with fragmented data sources',
    opportunity: 'RAG pipelines & natural-language data querying',
    impact: 'High',
  },
  {
    fn: 'Customer Support',
    current: 'Reactive support across multiple channels',
    opportunity: 'AI co-pilot for agents & intelligent ticket routing',
    impact: 'High',
  },
]

const agents = [
  {
    title: 'Compliance & Regulatory Agent',
    description:
      'Ask questions about regulatory requirements across TTS\'s operating markets. Get instant answers grounded in real compliance documentation.',
    to: '/compliance',
    cta: 'Try Agent',
    Icon: ShieldCheck,
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent',
  },
  {
    title: 'AI Adoption Copilot',
    description:
      'Explore AI transformation recommendations tailored to each team. Get actionable adoption playbooks, tool suggestions, and implementation guidance.',
    to: '/copilot',
    cta: 'Try Copilot',
    Icon: Bot,
    iconBg: 'bg-green-500/10',
    iconColor: 'text-green-500',
  },
]

/* ------------------------------------------------------------------ */
/*  SMALL HELPERS                                                      */
/* ------------------------------------------------------------------ */

function Badge({ children, className = '' }) {
  return (
    <span
      className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${className}`}
    >
      {children}
    </span>
  )
}

function ImpactBadge({ level }) {
  const styles = {
    High: 'bg-green-50 text-green-700',
    Medium: 'bg-yellow-50 text-yellow-700',
    Low: 'bg-gray-50 text-gray-500',
  }
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[level] || styles.Low}`}
    >
      {level}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-body">
      {/* ---- NAV ---- */}
      <nav className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" aria-label="TTS home">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <span className="text-sm font-bold text-white">T</span>
            </div>
            <span className="text-heading font-semibold">TTS</span>
          </Link>

          {/* Center links — hidden on small screens */}
          <ul className="hidden items-center gap-8 text-sm font-medium md:flex">
            <li>
              <a href="#top" className="text-body hover:text-heading transition-colors">
                Home
              </a>
            </li>
            <li>
              <a href="#roadmap" className="text-body hover:text-heading transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="#agents" className="text-body hover:text-heading transition-colors">
                Learn More
              </a>
            </li>
          </ul>

          {/* CTA */}
          <Link
            to="/login"
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-light"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ---- HERO ---- */}
      <section
        id="top"
        className="mx-auto max-w-4xl px-6 pb-24 pt-20 text-center md:pt-28"
      >
        <Badge className="mb-6 border-accent/20 bg-accent/5 text-accent">
          AI Transformation Roadmap
        </Badge>

        <h1 className="text-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          Where AI Meets{' '}
          <span className="text-accent">Fintech Operations</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-body">
          A comprehensive AI transformation roadmap for TTS — built to
          show what's possible when AI meets cross-border payments.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#roadmap"
            className="inline-flex items-center gap-2 rounded-full bg-heading px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-heading/90"
          >
            Explore Roadmap
            <ArrowRight size={16} />
          </a>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-heading transition-colors hover:bg-surface"
          >
            Try the Agents
            <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* ---- ROADMAP ---- */}
      <section id="roadmap" className="bg-surface py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-heading text-3xl font-bold tracking-tight sm:text-4xl">
              From Quick Wins to Strategic Integration
            </h2>
            <p className="mt-4 text-body">
              A phased approach that delivers value from week one while building
              toward a fully AI-augmented organisation.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {phases.map((phase) => (
              <div
                key={phase.label}
                className="flex flex-col rounded-xl border border-border bg-white p-6"
              >
                <Badge className={phase.color}>{phase.label}</Badge>

                <h3 className="mt-4 text-lg font-semibold text-heading">
                  {phase.name}
                </h3>
                <p className="mt-1 text-sm text-muted">{phase.timeline}</p>

                <ul className="mt-5 flex-1 space-y-3">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-body">
                      <Zap
                        size={14}
                        className="mt-0.5 shrink-0 text-accent"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- OPPORTUNITY MAP ---- */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-heading text-3xl font-bold tracking-tight sm:text-4xl">
              AI Impact Across Every Function
            </h2>
            <p className="mt-4 text-body">
              Where the biggest opportunities live across TTS's
              operations.
            </p>
          </div>

          {/* Desktop table */}
          <div className="mt-12 hidden overflow-hidden rounded-xl border border-border md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="px-6 py-3 font-semibold text-heading">Function</th>
                  <th className="px-6 py-3 font-semibold text-heading">Current State</th>
                  <th className="px-6 py-3 font-semibold text-heading">AI Opportunity</th>
                  <th className="px-6 py-3 font-semibold text-heading">Impact</th>
                </tr>
              </thead>
              <tbody>
                {opportunityRows.map((row, i) => (
                  <tr
                    key={row.fn}
                    className={i < opportunityRows.length - 1 ? 'border-b border-border' : ''}
                  >
                    <td className="px-6 py-4 font-medium text-heading">{row.fn}</td>
                    <td className="px-6 py-4 text-body">{row.current}</td>
                    <td className="px-6 py-4 text-body">{row.opportunity}</td>
                    <td className="px-6 py-4">
                      <ImpactBadge level={row.impact} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-12 space-y-4 md:hidden">
            {opportunityRows.map((row) => (
              <div
                key={row.fn}
                className="rounded-xl border border-border bg-white p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-heading">{row.fn}</span>
                  <ImpactBadge level={row.impact} />
                </div>
                <p className="mt-2 text-sm text-muted">{row.current}</p>
                <p className="mt-1 text-sm text-body">{row.opportunity}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- AGENTS ---- */}
      <section id="agents" className="bg-[#0A0A0A] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Two Agents You Can Use Today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-[#9CA3AF]">
            Interactive AI tools built specifically for TTS's compliance
            and adoption workflows.
          </p>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {agents.map(({ title, description, to, cta, Icon, iconBg, iconColor }) => (
              <div
                key={title}
                className="flex flex-col rounded-xl border border-white/10 bg-[#1A1A1A] p-6"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-lg ${iconBg}`}
                >
                  <Icon size={22} className={iconColor} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">
                  {title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#9CA3AF]">
                  {description}
                </p>

                <Link
                  to={to}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-light"
                >
                  {cta}
                  <ArrowRight size={15} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA / FOOTER ---- */}
      <footer className="bg-[#0A0A0A] pb-12 pt-16">
        <div className="mx-auto max-w-6xl px-6">
          {/* CTA */}
          <div className="flex flex-col items-center border-t border-white/10 pt-16 text-center">
            <Layers size={32} className="text-accent" />
            <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
              Ready to Transform Your Operations?
            </h2>
            <p className="mt-3 max-w-md text-[#9CA3AF]">
              See how AI can reshape cross-border payments at TTS.
            </p>
            <Link
              to="/login"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-light"
            >
              Request a Demo
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Footer line */}
          <p className="mt-16 text-center text-xs text-[#525252]">
            A TTS AI initiative &middot; Built by Arjun
          </p>
        </div>
      </footer>
    </div>
  )
}
