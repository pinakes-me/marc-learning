import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadStats } from '../utils/storage.js'

const DAYS_KEY = 'marcStudyDays'
function recordStudyDay() {
  try {
    const today = new Date().toISOString().slice(0, 10)
    const raw = localStorage.getItem(DAYS_KEY)
    const days = raw ? JSON.parse(raw) : []
    if (!days.includes(today)) {
      days.push(today)
      localStorage.setItem(DAYS_KEY, JSON.stringify(days))
    }
    return days.length
  } catch {
    return 0
  }
}

export default function Home() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({})

  useEffect(() => {
    setStats(loadStats())
  }, [])

  const allFields = Object.values(stats)
  const totalCorrect = allFields.reduce((sum, s) => sum + s.correct, 0)
  const totalAttempts = allFields.reduce((sum, s) => sum + s.correct + s.wrong, 0)
  const avgPct = totalAttempts === 0 ? 0 : Math.round((totalCorrect / totalAttempts) * 100)

  const weakCount = Object.values(stats).filter((s) => s.wrong > 0).length

  const [studyDays, setStudyDays] = useState(0)
  useEffect(() => {
    setStudyDays(recordStudyDay())
  }, [])

  const marcPreview = [
    { field: '245', ind: '00', sub: '$a', val: '디지털 인문학 입문 =' },
    { field: '260', ind: '  ', sub: '$a', val: '서울 :' },
    { field: '300', ind: '  ', sub: '$a', val: '510 p. :' },
    { field: '700', ind: '1 ', sub: '$a', val: '김현' },
  ]

  return (
    <div className="fade-up mx-auto max-w-[480px] p-6 pb-24 pt-10">
      <header className="space-y-2">
        <div className="font-mono text-xs tracking-widest text-accent uppercase">
          // MARC Learning System
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          안녕하세요, <span className="text-accent">사서</span> 지망생님 👋
        </h1>
        <p className="text-sm text-muted">오늘도 MARC 필드를 정복해볼까요?</p>
      </header>

      <section className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <div className="text-center font-mono text-3xl text-accent">{studyDays}</div>
          <div className="mt-1 text-center text-xs text-muted">학습일수</div>
        </div>
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <div className="text-center font-mono text-3xl text-accent">{avgPct}%</div>
          <div className="mt-1 text-center text-xs text-muted">평균 정답률</div>
        </div>
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <div className="text-center font-mono text-3xl text-accent">{weakCount}</div>
          <div className="mt-1 text-center text-xs text-muted">약점 필드</div>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-text">빠른 시작</h2>
        <div className="grid grid-cols-2 gap-3">
          <div
            className="min-h-36 cursor-pointer rounded-2xl border border-border bg-white p-6 shadow-sm transition-colors hover:border-accent"
            onClick={() => navigate('/training/flashcard')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') navigate('/training/flashcard')
            }}
          >
            <div className="text-3xl">🃏</div>
            <div className="mt-2 font-medium">플래시카드</div>
            <div className="mt-1 text-sm text-muted">필드 의미 기초 암기</div>
          </div>
          <div
            className="min-h-36 cursor-pointer rounded-2xl border border-border bg-white p-6 shadow-sm transition-colors hover:border-accent"
            onClick={() => navigate('/training/puzzle')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') navigate('/training/puzzle')
            }}
          >
            <div className="text-3xl">🧩</div>
            <div className="mt-2 font-medium">퍼즐 모드</div>
            <div className="mt-1 text-sm text-muted">필드 순서 맞추기</div>
          </div>
          <div
            className="min-h-36 cursor-pointer rounded-2xl border border-border bg-white p-6 shadow-sm transition-colors hover:border-accent"
            onClick={() => navigate('/training/write')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') navigate('/training/write')
            }}
          >
            <div className="text-3xl">✏️</div>
            <div className="mt-2 font-medium">작성 훈련</div>
            <div className="mt-1 text-sm text-muted">서브필드 직접 입력</div>
          </div>
          <div
            className="min-h-36 cursor-pointer rounded-2xl border border-border bg-white p-6 shadow-sm transition-colors hover:border-accent"
            onClick={() => navigate('/training/judge')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') navigate('/training/judge')
            }}
          >
            <div className="text-3xl">⚖️</div>
            <div className="mt-2 font-medium">판단 퀴즈</div>
            <div className="mt-1 text-sm text-muted">100 vs 700 필드 선택</div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-white p-4 shadow-sm">
        <div className="font-mono text-sm text-accent">// 오늘의 MARC 미리보기</div>
        <div className="mt-3 space-y-2 font-mono text-sm">
          {marcPreview.map((row) => (
            <div key={`${row.field}-${row.ind}-${row.sub}-${row.val}`}>
              <span className="text-accent2">{row.field}</span> {row.ind}{' '}
              <span className="text-accent">{row.sub}</span> <span className="text-text">{row.val}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

