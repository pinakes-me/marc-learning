import { useEffect, useState } from 'react'
import { loadStats } from '../utils/storage.js'

const FIELD_LABELS = {
  '020': 'ISBN',
  '100': '기본표목 (저자)',
  '245': '표제 / 책임표시사항',
  '246': '여러 형식의 표제',
  '260': '발행사항',
  '300': '형태사항',
  '500': '일반주기',
  '650': '주제명',
  '700': '부출표목 (저자)',
}

export default function Weak() {
  const [stats, setStats] = useState({})

  useEffect(() => {
    setStats(loadStats())
  }, [])

  const weakFields = Object.entries(stats)
    .filter(([_, s]) => s.wrong > 0)
    .sort((a, b) => b[1].wrong - a[1].wrong)

  const badges = [
    {
      text: '오답 노트',
      className:
        'text-accent2 border-[rgba(92,107,192,0.25)] bg-[rgba(92,107,192,0.08)]',
    },
    {
      text: '필드별 반복',
      className:
        'text-accent border-[rgba(33,150,243,0.25)] bg-[rgba(33,150,243,0.08)]',
    },
    {
      text: '개인화 재출제',
      className:
        'text-success border-[rgba(38,166,154,0.25)] bg-[rgba(38,166,154,0.08)]',
    },
  ]

  return (
    <div className="fade-up mx-auto max-w-[480px] p-6 pb-24 pt-10">
      <header className="space-y-2">
        <div className="font-mono text-xs tracking-widest text-accent2 uppercase">
          // WEAK_TRAINING
        </div>
        <h1 className="text-3xl font-bold tracking-tight">약점 집중 훈련</h1>
        <p className="text-sm text-muted">자주 틀리는 필드를 집중적으로 복습해요</p>
      </header>

      <section className="mt-6">
        {weakFields.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white p-6 text-center shadow-sm">
            <div className="text-4xl">🔍</div>
            <p className="mt-4 whitespace-pre-line text-sm text-muted">
              아직 학습 데이터가 없어요.
              {'\n'}MARC 훈련을 먼저 시작하면
              {'\n'}오답 데이터가 여기에 쌓여요.
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {badges.map((b) => (
                <span
                  key={b.text}
                  className={[
                    'inline-flex items-center rounded-full border px-2 py-0.5',
                    'font-mono text-xs',
                    b.className,
                  ].join(' ')}
                >
                  {b.text}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {weakFields.map(([field, s]) => {
              const total = s.correct + s.wrong
              const pct = total === 0 ? 0 : Math.round((s.correct / total) * 100)
              const label = FIELD_LABELS[field] ?? field
              return (
                <div
                  key={field}
                  className="rounded-2xl border border-border bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="min-w-0">
                      <span className="font-mono text-accent">{field}</span>
                      <span className="ml-2 text-sm text-text">{label}</span>
                    </div>
                    <span className="shrink-0 text-sm text-red-400">{s.wrong}회 틀림</span>
                  </div>
                  <div className="mt-2 text-sm text-muted">정답률: {pct}%</div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
