import { useState, useEffect, useRef } from 'react'
import { FileText, FolderOpen, Upload, Trash2, Loader2, X, CheckCircle2 } from 'lucide-react'

const BADGE_STYLES = {
  accent: 'bg-accent-light/30 text-accent',
  green: 'bg-emerald-50 text-emerald-700',
  blue: 'bg-blue-50 text-blue-700',
}

const UPLOAD_STEPS = [
  { key: 'upload', label: 'Uploading document to server' },
  { key: 'parse', label: 'Extracting text content from document' },
  { key: 'chunk', label: 'Splitting into semantic chunks (800 tokens, 150 overlap)' },
  { key: 'embed', label: 'Generating vector embeddings (all-MiniLM-L6-v2)' },
  { key: 'index', label: 'Indexing in ChromaDB vector store' },
]

function UploadProgressPanel({ currentStep, fileName, done, error }) {
  return (
    <div className="rounded-xl border border-border bg-white p-5 mb-6">
      <div className="flex items-center gap-3 mb-4">
        {done ? (
          <CheckCircle2 size={20} className="text-emerald-600" />
        ) : (
          <Loader2 size={20} className="text-accent animate-spin" />
        )}
        <div>
          <h3 className="text-heading font-semibold text-sm">
            {error ? 'Upload failed' : done ? 'Document indexed successfully' : `Processing ${fileName}`}
          </h3>
          <p className="text-muted text-xs mt-0.5">RAG ingestion pipeline</p>
        </div>
      </div>
      <div className="space-y-2.5">
        {UPLOAD_STEPS.map((step, i) => {
          const isActive = i === currentStep && !done && !error
          const isComplete = done || i < currentStep
          const isPending = !done && i > currentStep
          return (
            <div key={step.key} className="flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                {isComplete ? (
                  <CheckCircle2 size={16} className="text-emerald-600" />
                ) : isActive ? (
                  <Loader2 size={16} className="text-accent animate-spin" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-gray-200" />
                )}
              </div>
              <span className={`text-sm ${isActive ? 'text-heading font-medium' : isComplete ? 'text-body' : 'text-muted'}`}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
      {error && (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

function DocumentPreviewModal({ doc, onClose }) {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/knowledge/documents/${encodeURIComponent(doc.source)}/content`)
      .then((res) => res.json())
      .then((data) => { setContent(data.content); setLoading(false) })
      .catch(() => { setContent('Failed to load document content.'); setLoading(false) })
  }, [doc.source])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-accent-light/30 flex items-center justify-center shrink-0">
              <FileText size={18} className="text-accent" />
            </div>
            <div className="min-w-0">
              <h2 className="text-heading font-semibold text-sm truncate">{doc.title}</h2>
              <p className="text-muted text-xs">{doc.type} &middot; {doc.pages} pages</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-surface text-muted">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={20} className="text-accent animate-spin" />
            </div>
          ) : (
            <pre className="text-sm text-body whitespace-pre-wrap font-sans leading-relaxed">{content}</pre>
          )}
        </div>
      </div>
    </div>
  )
}

function DocumentCard({ doc, onDelete, onPreview }) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!confirm(`Delete "${doc.title}"? This will rebuild the vector store.`)) return
    setDeleting(true)
    try {
      await fetch(`/api/knowledge/documents/${encodeURIComponent(doc.source)}`, {
        method: 'DELETE',
      })
    } catch {
      alert('Failed to delete document.')
    } finally {
      setDeleting(false)
      onDelete()
    }
  }

  return (
    <div
      onClick={() => onPreview(doc)}
      className="bg-white border border-border rounded-xl p-4 flex items-start gap-3.5 hover:shadow-sm transition-shadow group cursor-pointer"
    >
      <div className="w-10 h-10 rounded-lg bg-accent-light/30 flex items-center justify-center shrink-0">
        <FileText size={20} className="text-accent" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-heading font-semibold text-sm leading-snug">{doc.title}</h3>
        <p className="text-muted text-xs mt-0.5">{doc.type} &middot; {doc.source}</p>
        <div className="flex items-center gap-2 mt-2.5">
          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${BADGE_STYLES[doc.badgeColor] || BADGE_STYLES.accent}`}>
            {doc.badge}
          </span>
          {doc.pages && <span className="text-muted text-xs">{doc.pages} pages</span>}
        </div>
      </div>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-50 text-muted hover:text-red-600 transition-all shrink-0"
        title="Delete document"
      >
        {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
      </button>
    </div>
  )
}

export default function KnowledgeBase() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploadState, setUploadState] = useState(null) // { step, fileName, done, error }
  const [previewDoc, setPreviewDoc] = useState(null)
  const fileInputRef = useRef(null)

  const fetchDocuments = () => {
    fetch('/api/knowledge/documents')
      .then((res) => res.json())
      .then((data) => {
        setDocuments(data.documents || [])
        setLoading(false)
      })
      .catch(() => {
        setDocuments([])
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileName = file.name
    setUploadState({ step: 0, fileName, done: false, error: null })

    const formData = new FormData()
    formData.append('file', file)

    // Advance steps on a timer to show pipeline visually
    // Steps: upload(0) -> parse(1) -> chunk(2) -> embed(3) -> index(4)
    let stepTimer
    let currentStep = 0
    const advanceStep = () => {
      stepTimer = setInterval(() => {
        currentStep++
        if (currentStep < UPLOAD_STEPS.length) {
          setUploadState((prev) => prev && !prev.done ? { ...prev, step: currentStep } : prev)
        } else {
          clearInterval(stepTimer)
        }
      }, 800)
    }

    // Start advancing after brief initial delay
    setTimeout(advanceStep, 400)

    try {
      const res = await fetch('/api/knowledge/upload', {
        method: 'POST',
        body: formData,
      })
      clearInterval(stepTimer)

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setUploadState({ step: currentStep, fileName, done: false, error: err.detail || 'Upload failed.' })
      } else {
        // Show all steps as complete
        setUploadState({ step: UPLOAD_STEPS.length, fileName, done: true, error: null })
        fetchDocuments()
        // Auto-dismiss after 3s
        setTimeout(() => setUploadState(null), 3000)
      }
    } catch {
      clearInterval(stepTimer)
      setUploadState({ step: currentStep, fileName, done: false, error: 'Upload failed. Check that the backend is running.' })
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const isUploading = uploadState && !uploadState.done && !uploadState.error

  return (
    <div className="h-full bg-surface">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-heading font-bold text-[28px] leading-tight">Knowledge Base</h1>
            <p className="text-body text-sm mt-1">Regulatory documents and data sources powering the AI agents</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt"
              onChange={handleUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 shrink-0"
            >
              <Upload size={14} />
              Upload Document
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-border text-sm shrink-0">
              <span className="flex items-center gap-1.5 text-body">
                <FolderOpen size={14} className="text-muted" />
                {documents.length} loaded
              </span>
              {documents.length > 0 ? (
                <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-muted font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  Empty
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Upload progress */}
        {uploadState && (
          <UploadProgressPanel
            currentStep={uploadState.step}
            fileName={uploadState.fileName}
            done={uploadState.done}
            error={uploadState.error}
          />
        )}

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={24} className="text-accent animate-spin mb-3" />
            <p className="text-muted text-sm">Loading documents...</p>
          </div>
        ) : documents.length === 0 && !uploadState ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white border border-border flex items-center justify-center mb-4">
              <FileText size={28} className="text-muted" />
            </div>
            <h3 className="text-heading font-semibold text-base">No documents yet</h3>
            <p className="text-muted text-sm mt-1 max-w-sm">
              Upload regulatory documents to power the AI agents. Supported formats: PDF, TXT.
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
            >
              <Upload size={14} />
              Upload your first document
            </button>
          </div>
        ) : documents.length > 0 ? (
          <>
            <p className="text-muted text-sm mb-4">{documents.length} documents</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <DocumentCard key={doc.source} doc={doc} onDelete={fetchDocuments} onPreview={setPreviewDoc} />
              ))}
            </div>
          </>
        ) : null}
      </div>

      {/* Preview modal */}
      {previewDoc && (
        <DocumentPreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />
      )}
    </div>
  )
}
