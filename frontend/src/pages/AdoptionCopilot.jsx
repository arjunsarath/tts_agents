import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Sparkles,
  Bot,
  ArrowRight,
  BookOpen,
  Wrench,
  WandSparkles,
  Loader2,
  CheckCircle2,
  Zap,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const CATEGORIES = ['All', 'Compliance', 'Operations', 'Finance', 'Growth', 'Research', 'General']

const CATEGORY_STYLES = {
  Compliance: 'bg-accent-light/40 text-accent',
  Operations: 'bg-blue-50 text-blue-700',
  Finance:    'bg-green-50 text-green-700',
  Growth:     'bg-accent-light/40 text-accent',
  Research:   'bg-blue-50 text-blue-700',
  General:    'bg-gray-100 text-gray-600',
}

/* ------------------------------------------------------------------ */
/*  Tabs config                                                        */
/* ------------------------------------------------------------------ */

const TABS = [
  { key: 'prompts',  label: 'Prompt Library',    icon: BookOpen },
  { key: 'tools',    label: 'Tool Recommender',  icon: Wrench },
  { key: 'improver', label: 'Prompt Improver',   icon: WandSparkles },
]


/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function PromptLibraryTab() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [prompts, setPrompts] = useState([])

  useEffect(() => {
    fetch('/api/copilot/prompts')
      .then((res) => res.json())
      .then((data) => setPrompts(data))
      .catch(() => setPrompts([]))
  }, [])

  const filtered =
    activeFilter === 'All'
      ? prompts
      : prompts.filter((p) => p.category === activeFilter)

  return (
    <div className="space-y-6">
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter prompts by category">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
              activeFilter === cat
                ? 'bg-accent text-white'
                : 'bg-surface text-body hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Prompt cards grid */}
      {prompts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center mb-4">
            <BookOpen className="w-7 h-7 text-muted" />
          </div>
          <h3 className="text-heading font-semibold text-base">No prompts available</h3>
          <p className="text-muted text-sm mt-1 max-w-sm">
            Prompt library will be populated by the admin.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((prompt) => (
            <article
              key={prompt.title}
              className="bg-white border border-border rounded-xl p-5 flex flex-col hover:shadow-md transition-shadow"
            >
              <span
                className={`inline-block self-start px-3 py-0.5 rounded-full text-xs font-medium mb-3 ${
                  CATEGORY_STYLES[prompt.category] || 'bg-gray-100 text-gray-600'
                }`}
              >
                {prompt.category}
              </span>
              <h3 className="text-heading font-semibold text-base mb-1.5">{prompt.title}</h3>
              <p className="text-body text-sm leading-relaxed line-clamp-2 flex-1">
                {prompt.description}
              </p>
              <button className="mt-4 inline-flex items-center gap-1 text-accent text-sm font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded self-start">
                Use prompt <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

function ToolRecommenderTab() {
  const [task, setTask] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!task.trim() || loading) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/copilot/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: task.trim() }),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      setResult({ error: 'Failed to get recommendations. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Input section */}
      <div className="space-y-2">
        <label htmlFor="task-description" className="block text-heading text-sm font-medium">
          Describe your task
        </label>
        <p className="text-muted text-sm">
          Tell us what you need to accomplish and we'll recommend the best AI tools from our approved stack.
        </p>
        <textarea
          id="task-description"
          rows={3}
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none"
          style={{ height: 80 }}
          placeholder="I need to analyze customer support tickets to find common complaints and categorize them by severity..."
        />
        <button
          onClick={handleSubmit}
          disabled={!task.trim() || loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-heading text-white text-sm font-medium hover:bg-heading/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-heading/30 focus-visible:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? 'Analyzing...' : 'Get Recommendations'}
        </button>
      </div>

      {/* Result or empty state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Loader2 className="w-8 h-8 text-accent animate-spin mb-4" />
          <p className="text-muted text-sm">Analyzing your task...</p>
        </div>
      ) : result ? (
        <div className="space-y-4">
          <hr className="border-border" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent-light/40 flex items-center justify-center">
              <Bot className="w-4.5 h-4.5 text-accent" />
            </div>
            <h3 className="text-heading font-semibold text-base">Agent Recommendation</h3>
          </div>

          {result.error ? (
            <p className="text-red-600 text-sm">{result.error}</p>
          ) : result.raw_response ? (
            <div className="rounded-xl border border-border bg-white p-5 text-sm text-body whitespace-pre-wrap">
              {result.raw_response}
            </div>
          ) : (
            <>
              {/* Tool cards */}
              {result.recommendations?.map((tool, i) => (
                <div
                  key={i}
                  className={`rounded-xl border p-5 ${
                    tool.role === 'primary'
                      ? 'border-accent-light bg-accent-light/20'
                      : 'border-border bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        tool.role === 'primary' ? 'bg-accent-light/40' : 'bg-blue-50'
                      }`}>
                        <Zap className={`w-5 h-5 ${tool.role === 'primary' ? 'text-accent' : 'text-blue-600'}`} />
                      </div>
                      <div>
                        <h4 className="text-heading font-semibold text-sm">{tool.name}</h4>
                        <p className="text-body text-sm mt-0.5">{tool.description}</p>
                      </div>
                    </div>
                    <span className={`shrink-0 px-3 py-0.5 rounded-full text-xs font-medium ${
                      tool.role === 'primary'
                        ? 'bg-accent-light/40 text-accent'
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      {tool.role === 'primary' ? 'Primary' : 'Supporting'}
                    </span>
                  </div>
                </div>
              ))}

              {/* Approach */}
              {result.approach?.length > 0 && (
                <div className="rounded-xl bg-surface p-5 space-y-3">
                  <h4 className="text-heading font-semibold text-sm">Suggested Approach</h4>
                  <ol className="space-y-2.5 text-sm text-body list-none">
                    {result.approach.map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="shrink-0 w-6 h-6 rounded-full bg-heading text-white text-xs font-medium flex items-center justify-center mt-0.5">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                  {result.estimated_time_saved && (
                    <p className="text-green-600 text-sm font-medium flex items-center gap-1.5 pt-1">
                      <Sparkles className="w-4 h-4" />
                      Estimated time saved: {result.estimated_time_saved}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center mb-4">
            <Bot className="w-7 h-7 text-muted" />
          </div>
          <h3 className="text-heading font-semibold text-base">No recommendations yet</h3>
          <p className="text-muted text-sm mt-1 max-w-sm">
            Describe your task above and the agent will recommend the best AI tools from the approved stack.
          </p>
        </div>
      )}
    </div>
  )
}

const SECTION_COLORS = {
  purple: 'bg-purple-50 text-purple-700',
  blue: 'bg-blue-50 text-blue-700',
  green: 'bg-green-50 text-green-700',
  amber: 'bg-amber-50 text-amber-700',
}

function PromptImproverTab() {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleImprove = async () => {
    if (!prompt.trim() || loading) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/copilot/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      setResult({ error: 'Failed to improve prompt. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left -- user prompt */}
        <div className="space-y-3">
          <h3 className="text-heading font-semibold text-base">Your Prompt</h3>
          <textarea
            aria-label="Your prompt input"
            rows={10}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none"
            placeholder="Summarize these support tickets and tell me what the main issues are"
          />
        </div>

        {/* Right -- improved prompt or empty state */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-heading font-semibold text-base">Improved Prompt</h3>
            {result?.sections && (
              <span className="px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                AI-enhanced
              </span>
            )}
          </div>

          {loading ? (
            <div className="rounded-xl border border-border bg-surface p-4 text-sm min-h-[240px] flex flex-col items-center justify-center text-center">
              <Loader2 className="w-8 h-8 text-accent animate-spin mb-3" />
              <p className="text-muted text-sm">Improving your prompt...</p>
            </div>
          ) : result?.sections ? (
            <div className="rounded-xl border border-border bg-surface p-4 text-sm space-y-4 min-h-[240px]">
              {result.sections.map((section, i) => (
                <div key={i}>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-1.5 ${
                    SECTION_COLORS[section.color] || 'bg-gray-50 text-gray-700'
                  }`}>
                    {section.label}
                  </span>
                  <p className="text-heading leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>
          ) : result?.raw_response ? (
            <div className="rounded-xl border border-border bg-surface p-4 text-sm min-h-[240px] whitespace-pre-wrap text-body">
              {result.raw_response}
            </div>
          ) : result?.error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm min-h-[240px] flex items-center justify-center text-red-600">
              {result.error}
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-surface p-4 text-sm min-h-[240px] flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-3">
                <WandSparkles className="w-6 h-6 text-muted" />
              </div>
              <p className="text-heading font-semibold text-sm">No improved prompt yet</p>
              <p className="text-muted text-xs mt-1 max-w-[220px]">
                Write your prompt on the left and click Improve to get an AI-enhanced version.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Improve button */}
      <div className="flex justify-center">
        <button
          onClick={handleImprove}
          disabled={!prompt.trim() || loading}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-heading text-white text-sm font-medium hover:bg-heading/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-heading/30 focus-visible:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? 'Improving...' : 'Improve Prompt'}
        </button>
      </div>

      {/* Tag chips -- shown only when we have improvements */}
      {result?.improvements && (
        <div className="flex flex-wrap justify-center gap-2">
          {result.improvements.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function AdoptionCopilot() {
  const { tab } = useParams()
  const navigate = useNavigate()
  const activeTab = tab || 'prompts'

  return (
    <div className="px-8 py-8 max-w-6xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-heading text-2xl font-bold">AI Adoption Copilot</h1>
          <p className="text-body text-sm mt-1">
            Prompt library, tool recommendations, and prompt improver for every team
          </p>
        </div>
        <span className="shrink-0 px-3 py-1 rounded-full bg-accent-light/30 text-accent text-xs font-medium">
          Powered by Claude Sonnet
        </span>
      </div>

      {/* Tab bar */}
      <nav
        className="inline-flex items-center gap-1 p-1 rounded-full bg-[#F5F5F5]"
        role="tablist"
        aria-label="Copilot sections"
      >
        {TABS.map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key
          return (
            <button
              key={key}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${key}`}
              onClick={() => navigate(`/copilot/${key}`)}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
                isActive
                  ? 'bg-white text-heading shadow-sm'
                  : 'text-body hover:text-heading'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          )
        })}
      </nav>

      {/* Tab panels */}
      <section
        id={`panel-${activeTab}`}
        role="tabpanel"
        aria-label={TABS.find((t) => t.key === activeTab)?.label}
      >
        {activeTab === 'prompts' && <PromptLibraryTab />}
        {activeTab === 'tools' && <ToolRecommenderTab />}
        {activeTab === 'improver' && <PromptImproverTab />}
      </section>
    </div>
  )
}
