import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, ShieldCheck, Sparkles, BookOpen, FileText, Blocks, LogOut } from 'lucide-react'

const navItems = [
  { label: 'Navigation', type: 'section' },
  { to: '/', icon: LayoutDashboard, label: 'Overview' },
  { to: '/compliance', icon: ShieldCheck, label: 'Compliance Agent' },
  { to: '/copilot', icon: Sparkles, label: 'Adoption Copilot' },
  { label: 'Resources', type: 'section' },
  { to: '/docs', icon: BookOpen, label: 'Documentation' },
  { to: '/knowledge', icon: FileText, label: 'Knowledge Base' },
  { to: '/stack', icon: Blocks, label: 'Approved Stack' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="w-64 h-screen bg-white border-r border-border flex flex-col shrink-0">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <div>
            <div className="font-bold text-heading text-sm">TapTap Send</div>
            <div className="text-xs text-accent">AI Platform</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item, i) => {
          if (item.type === 'section') {
            return (
              <div key={i} className="px-3 pt-4 pb-1 text-xs font-semibold text-muted uppercase tracking-wider">
                {item.label}
              </div>
            )
          }
          const Icon = item.icon
          if (item.external) {
            return (
              <a
                key={i}
                href={item.to}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-body hover:bg-surface transition-colors"
              >
                <Icon size={18} className="text-muted" />
                {item.label}
              </a>
            )
          }
          return (
            <NavLink
              key={i}
              to={item.to}
              end={item.to === '/copilot'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-surface font-medium text-heading'
                    : 'text-body hover:bg-surface'
                }`
              }
            >
              <Icon size={18} className="text-muted" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-sm font-medium text-body">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="text-sm font-medium text-heading">{user?.name || 'User'}</div>
              <div className="text-xs text-muted">{user?.username}@taptapsend.com</div>
            </div>
          </div>
          <button onClick={logout} className="p-1.5 rounded-md hover:bg-surface text-muted">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}
