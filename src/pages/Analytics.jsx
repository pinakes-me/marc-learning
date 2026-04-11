import { useEffect, useState } from 'react'
import { loadStats } from '../utils/storage.js'

const fields = [
  { field: '245', label: '표제 / 책임표시사항' },
  { field: '246', label: '여러 형식의 표제' },
  { field: '100', label: '기본표목 (저자)' },
  { field: '260', label: '발행사항' },
  { field: '300', label: '형태사항' },
  { field: '650', label: '주제명' },
  { field: '700', label: '부출표목 (저자)' },
]

export default function Analytics() {
  const [stats, setStats] = useState({})

  useEffect(() => {
    setStats(loadStats())
  }, [])

  const rows = fields.map(({ field, label }) => {
    const s = stats[field] || { correct: 0, wrong: 0 }
    const total = s.correct + s.wrong
    const pct = total === 0 ? 0 : Math.round((s.correct / total) * 100)
    return { field, label, pct }
  })

  const hasData = fields.some(({ field }) => {
    const s = stats[field] || { correct: 0, wrong: 0 }
    return s.correct + s.wrong > 0
  })

  return (
    <div className="fade-up mx-auto max-w-[480px] p-6 pb-24 pt-10">
      <header className="space-y-2">
        <div className="font-mono text-xs tracking-widest text-accent2 uppercase">
          // ANALYTICS
        </div>
        <h1 className="text-3xl font-bold tracking-tight">학습 분석</h1>
        <p className="text-sm text-muted">필드별 정답률과 학습 추이를 확인해요</p>
      </header>

      <section className="mt-6">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="font-mono text-xs text-muted">// 필드별 정답률</div>

          <div className="mt-4 space-y-4">
            {rows.map((it) => (
              <div key={it.field}>
                <div className="flex items-baseline justify-between gap-3">
                  <div className="min-w-0">
                    <span className="font-mono text-accent2">{it.field}</span>
                    <span className="ml-2 text-sm text-muted">{it.label}</span>
                  </div>
                  <div className="shrink-0 font-mono text-sm text-accent">{it.pct}%</div>
                </div>

                <div className="mt-2 h-1 w-full rounded-full bg-border">
                  <div
                    className="h-1 rounded-full bg-gradient-to-r from-accent to-accent2"
                    style={{ width: `${it.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {!hasData && (
            <div className="mt-6 text-center text-xs text-muted">
              학습을 시작하면 데이터가 채워져요 📊
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
