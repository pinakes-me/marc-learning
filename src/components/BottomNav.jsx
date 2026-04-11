import { Link, useLocation } from 'react-router-dom'

const TABS = [
  { to: '/', icon: '🏠', label: '홈' },
  { to: '/training', icon: '📚', label: 'MARC 훈련' },
  { to: '/weak', icon: '🎯', label: '약점 필드' },
  { to: '/analytics', icon: '📊', label: '학습 분석' },
]

function isActivePath(pathname, to) {
  if (to === '/') return pathname === '/'
  return pathname === to || pathname.startsWith(`${to}/`)
}

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto w-full max-w-[480px] border-t border-border bg-white">
        <div className="grid grid-cols-4">
          {TABS.map((tab) => {
            const active = isActivePath(location.pathname, tab.to)
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={[
                  'relative flex flex-col items-center justify-center gap-1 px-2 py-3 text-xs',
                  active ? 'text-accent' : 'text-muted',
                ].join(' ')}
              >
                {active && <span className="absolute left-0 right-0 top-0 h-0.5 bg-accent" />}
                <span className="text-lg leading-none">{tab.icon}</span>
                <span className="leading-none">{tab.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

