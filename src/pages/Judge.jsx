import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { judgeQuestions } from '../data/judgeQuestions.js'
import { recordResult } from '../utils/storage.js'

export default function Judge() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState(() => [...judgeQuestions].sort(() => Math.random() - 0.5))
  const total = questions.length

  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null) // string | null
  const [checked, setChecked] = useState(false)
  const [resultsById, setResultsById] = useState({}) // { [questionId]: boolean }
  const [wrongAnswers, setWrongAnswers] = useState([]) // string[] (field numbers)
  const [finished, setFinished] = useState(false)

  const q = questions[idx]

  useEffect(() => {
    setSelected(null)
    setChecked(false)
  }, [idx])

  const questionNumber = Math.min(idx + 1, total)
  const progressPct = total === 0 ? 0 : Math.round((idx / total) * 100)

  function checkAnswer() {
    if (!q) return
    if (!selected) return
    if (checked) return

    const ok = selected === q.answer
    setChecked(true)
    setResultsById((prev) => ({ ...prev, [q.id]: ok }))
    recordResult(questions[idx].answer, ok)
    if (!ok) setWrongAnswers((prev) => [...prev, q.answer])
  }

  function nextQuestion() {
    if (!checked) return
    if (idx + 1 >= total) {
      setFinished(true)
      return
    }
    setIdx((n) => n + 1)
  }

  function restart() {
    setQuestions(() => [...judgeQuestions].sort(() => Math.random() - 0.5))
    setIdx(0)
    setSelected(null)
    setChecked(false)
    setResultsById({})
    setWrongAnswers([])
    setFinished(false)
  }

  if (!q) return null

  if (finished) {
    const correctTotal = Object.values(resultsById).filter(Boolean).length
    const wrongUnique = Array.from(new Set(wrongAnswers))

    return (
      <div className="fade-up mx-auto max-w-[480px] p-6 pb-24 pt-10">
        <header className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate('/training')}
            className="rounded-xl border border-border bg-white px-3 py-2 text-sm shadow-sm hover:shadow-md transition-shadow"
          >
            ←
          </button>
          <div className="min-w-0 flex-1 text-center">
            <div className="text-lg font-bold text-text">판단 퀴즈</div>
          </div>
          <div className="w-[72px] text-right font-mono text-sm text-muted">완료</div>
        </header>

        <section className="mt-6 rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
          <div className="text-3xl">🎉 완료!</div>
          <div className="mt-3 text-sm text-muted">
            {correctTotal} / {total} 정답
          </div>

          {wrongUnique.length > 0 && (
            <div className="mt-5 rounded-xl bg-surface p-4 text-left">
              <div className="font-mono text-xs text-accent2">// 틀린 문제(정답 필드번호)</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {wrongUnique.map((field) => (
                  <span
                    key={field}
                    className="inline-flex items-center rounded-full border border-border bg-white px-2 py-0.5 font-mono text-xs text-text"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={restart}
            className="mt-6 w-full rounded-2xl bg-accent px-4 py-3 font-semibold text-white shadow-sm hover:shadow-md transition-shadow"
          >
            다시 하기
          </button>
        </section>
      </div>
    )
  }

  return (
    <div className="fade-up mx-auto max-w-[480px] p-6 pb-24 pt-10">
      <header className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate('/training')}
          className="rounded-xl border border-border bg-white px-3 py-2 text-sm shadow-sm hover:shadow-md transition-shadow"
        >
          ←
        </button>

        <div className="min-w-0 flex-1 text-center">
          <div className="text-lg font-bold text-text">판단 퀴즈</div>
        </div>

        <div className="w-[72px] text-right font-mono text-sm text-muted">
          {questionNumber} / {total}
        </div>
      </header>

      <div className="mt-4 h-1 w-full rounded-full bg-border">
        <div className="h-1 rounded-full bg-accent transition-all" style={{ width: `${progressPct}%` }} />
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-white p-5 shadow-sm">
        <div className="inline-flex items-center rounded-full border border-[rgba(92,107,192,0.25)] bg-[rgba(92,107,192,0.08)] px-2 py-0.5 font-mono text-xs text-accent2">
          Q{questionNumber}
        </div>

        <div className="mt-3 text-base font-semibold text-text">{q.question}</div>

        <div className="mt-4 space-y-3">
          {q.options.map((opt) => {
            const isSelected = selected === opt
            const isCorrect = checked && opt === q.answer
            const isWrong = checked && isSelected && opt !== q.answer

            const borderClass = checked
              ? isCorrect
                ? 'border-success bg-[rgba(67,217,173,0.10)]'
                : isWrong
                  ? 'border-red-400 bg-red-50'
                  : 'border-border bg-white'
              : isSelected
                ? 'border-accent2 bg-[rgba(92,107,192,0.10)]'
                : 'border-border bg-white'

            return (
              <button
                key={opt}
                type="button"
                disabled={checked}
                onClick={() => setSelected(opt)}
                className={[
                  'w-full rounded-xl border p-3 text-left shadow-sm transition-colors',
                  'hover:shadow-md',
                  borderClass,
                ].join(' ')}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-mono text-sm text-text">{opt}</div>
                  {checked && isCorrect ? (
                    <div className="shrink-0 text-sm">✅</div>
                  ) : checked && isWrong ? (
                    <div className="shrink-0 text-sm">❌</div>
                  ) : null}
                </div>
              </button>
            )
          })}
        </div>

        {checked && (
          <div className="mt-5 rounded-xl bg-surface p-4 text-sm">
            <div className="font-semibold text-text">💡 해설</div>
            <div className="mt-2 text-muted">{q.explanation}</div>
          </div>
        )}

        <div className="mt-5">
          {!checked ? (
            <button
              type="button"
              disabled={!selected}
              onClick={checkAnswer}
              className={[
                'w-full rounded-2xl px-4 py-3 font-semibold shadow-sm transition-all',
                selected ? 'bg-accent text-white hover:shadow-md' : 'bg-border text-muted cursor-not-allowed',
              ].join(' ')}
            >
              정답 확인
            </button>
          ) : (
            <button
              type="button"
              onClick={nextQuestion}
              className="w-full rounded-2xl bg-accent px-4 py-3 font-semibold text-white shadow-sm hover:shadow-md transition-shadow"
            >
              다음 문제 →
            </button>
          )}
        </div>
      </section>
    </div>
  )
}

