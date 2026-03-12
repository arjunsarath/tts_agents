import { useState, useEffect } from 'react'
import { Blocks, Zap, Loader2 } from 'lucide-react'

const CATEGORY_STYLES = {
  'AI Assistants':            'bg-purple-50 text-purple-700',
  'Research & Analysis':      'bg-blue-50 text-blue-700',
  'Presentations & Documents':'bg-accent-light/40 text-accent',
  'Visual & Creative':        'bg-pink-50 text-pink-700',
  'Marketing & Content':      'bg-amber-50 text-amber-700',
  'Audio & Video':            'bg-indigo-50 text-indigo-700',
  'Data & Analytics':         'bg-cyan-50 text-cyan-700',
  'Automation & Integration': 'bg-orange-50 text-orange-700',
  'Developer Tools':          'bg-gray-100 text-gray-600',
}

export default function ApprovedStack() {
  const [tools, setTools] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/copilot/tools')
      .then((res) => res.json())
      .then((data) => { setTools(data); setLoading(false) })
      .catch(() => { setTools([]); setLoading(false) })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 text-accent animate-spin" />
      </div>
    )
  }

  const grouped = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = []
    acc[tool.category].push(tool)
    return acc
  }, {})

  return (
    <div className="px-8 py-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-heading text-2xl font-bold">Approved Stack</h1>
          <p className="text-body text-sm mt-1">
            {tools.length} AI tools approved for use across TTS
          </p>
        </div>
        <span className="shrink-0 px-3 py-1 rounded-full bg-accent-light/30 text-accent text-xs font-medium flex items-center gap-1.5">
          <Blocks className="w-3.5 h-3.5" />
          {Object.keys(grouped).length} categories
        </span>
      </div>

      {Object.entries(grouped).map(([category, catTools]) => (
        <div key={category}>
          <h3 className="text-heading font-semibold text-sm mb-3 flex items-center gap-2">
            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${CATEGORY_STYLES[category] || 'bg-gray-100 text-gray-600'}`}>
              {category}
            </span>
            <span className="text-muted text-xs font-normal">{catTools.length} tools</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            {catTools.map((tool) => (
              <div
                key={tool.name}
                className="bg-white border border-border rounded-xl p-4 flex items-start gap-3.5"
              >
                <div className="w-9 h-9 rounded-lg bg-accent-light/30 flex items-center justify-center shrink-0">
                  <Zap size={16} className="text-accent" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-heading font-semibold text-sm">{tool.name}</h4>
                  <p className="text-body text-xs mt-0.5 leading-relaxed">{tool.description}</p>
                  <p className="text-muted text-xs mt-1.5">
                    Best for: {tool.best_for}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
