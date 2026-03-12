import { useState, useRef, useEffect } from 'react'
import { ShieldCheck, Send, Bot, User } from 'lucide-react'
import { API_URL } from '../config'

const EXAMPLE_QUERIES = [
  'KYC requirements for Morocco',
  'Compare AML thresholds',
  'FATF Recommendation 16',
]


function formatBotText(text) {
  return text.split('\n').map((line, i) => {
    const parts = []
    const regex = /\*\*(.+?)\*\*/g
    let lastIndex = 0
    let match

    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index))
      }
      parts.push(<strong key={`b-${i}-${match.index}`}>{match[1]}</strong>)
      lastIndex = regex.lastIndex
    }

    if (lastIndex < line.length) {
      parts.push(line.slice(lastIndex))
    }

    if (line.trim() === '') {
      return <br key={i} />
    }

    const isItalic = line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')
    if (isItalic) {
      return (
        <p key={i} className="text-xs text-muted italic mt-3">
          {line.slice(1, -1)}
        </p>
      )
    }

    return (
      <p key={i} className={line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.') || line.startsWith('4.') ? 'ml-1' : ''}>
        {parts.length > 0 ? parts : line}
      </p>
    )
  })
}

export default function ComplianceAgent() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const sendMessage = async (text) => {
    if (!text.trim()) return

    const userMessage = { role: 'user', content: text.trim() }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const res = await fetch(`${API_URL}/api/compliance/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || 'Failed to get response')
      }
      const data = await res.json()
      const sourceLine = data.sources?.length
        ? `\n\n*Sources: ${data.sources.join(', ')}*`
        : ''
      setMessages((prev) => [...prev, { role: 'bot', content: data.reply + sourceLine }])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: `Sorry, I encountered an error: ${err.message}` },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleChipClick = (query) => {
    sendMessage(query)
  }

  const hasMessages = messages.length > 0

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
            <ShieldCheck size={20} className="text-accent" />
          </div>
          <div>
            <h1 className="text-heading font-semibold text-base">Compliance &amp; Regulatory Agent</h1>
            <p className="text-muted text-xs">
              Ask about regulatory research, KYC/AML frameworks, or licensing requirements across corridors
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          Online
        </span>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {!hasMessages ? (
          /* Welcome state */
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
              <Bot size={28} className="text-accent" />
            </div>
            <h2 className="text-heading font-semibold text-lg mb-1">Compliance Research Agent</h2>
            <p className="text-body text-sm max-w-md mb-6">
              Ask me about remittance regulations, KYC/AML frameworks, or licensing requirements across corridors.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {EXAMPLE_QUERIES.map((query) => (
                <button
                  key={query}
                  type="button"
                  onClick={() => handleChipClick(query)}
                  className="px-4 py-2 rounded-full border border-border bg-white text-sm text-body
                    hover:border-accent hover:text-accent hover:bg-accent/5 transition-colors cursor-pointer"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Message list */
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((msg, i) =>
              msg.role === 'user' ? (
                <div key={i} className="flex justify-end">
                  <div className="flex items-start gap-2 max-w-[75%]">
                    <div className="px-4 py-2.5 rounded-2xl rounded-tr-sm bg-heading text-white text-sm leading-relaxed">
                      {msg.content}
                    </div>
                    <div className="w-7 h-7 rounded-full bg-heading/10 flex items-center justify-center shrink-0 mt-0.5">
                      <User size={14} className="text-heading" />
                    </div>
                  </div>
                </div>
              ) : (
                <div key={i} className="flex justify-start">
                  <div className="flex items-start gap-2 max-w-[75%]">
                    <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot size={14} className="text-accent" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white border border-border text-sm text-body leading-relaxed space-y-1">
                      {formatBotText(msg.content)}
                    </div>
                  </div>
                </div>
              )
            )}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={14} className="text-accent" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white border border-border">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-muted animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 rounded-full bg-muted animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 rounded-full bg-muted animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="px-6 py-4 border-t border-border bg-white shrink-0">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about regulations, KYC/AML, licensing..."
            disabled={isTyping}
            className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-surface text-sm text-heading
              placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
              disabled:opacity-50 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
            className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center
              hover:bg-accent-light focus:outline-none focus:ring-2 focus:ring-accent/30 focus:ring-offset-2
              disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  )
}
