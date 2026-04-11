import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import writeQuestions from '../data/writeQuestions.js'
import { recordResult } from '../utils/storage.js'

function normalize(s) {
  return String(s || '').trim().toLowerCase()
}

function normalizeForCompare(s) {
  // trim(), toLowerCase() 유지 + 구두점은 비교에서 무시
  return normalize(s).replace(/[.,;:/]/g, '')
}

function isPartialCorrect(inputValue, correctValue) {
  const input = normalizeForCompare(inputValue)
  const correct = normalizeForCompare(correctValue)

  // 정답에서 식별기호($a 등)를 찾아냄
  const subfieldMatch = correct.match(/\$[a-z0-9]/);
  
  if (subfieldMatch) {
    const subfield = subfieldMatch[0];
    // 사용자가 입력한 값에 해당 식별기호가 없으면 바로 오답
    if (!input.includes(subfield)) return false;
  }

  return correct.includes(input);
}

export default function Write() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState(() => [...writeQuestions].sort(() => Math.random() - 0.5))
  const total = questions.length

  const bookTitle = '디지털 인문학 입문 = Digital humanities'
  const bookAuthor = '김현, 임영상, 김바로 공저'
  const bookPublication = '서울 : Huebooks : 한국외국어대학교 지식출판원, 2016'
  const bookPhysical = '510 p. : 삽화, 도표, 초상 ; 23 cm'
  const bookSubject = '인문 과학'
  const bookIsbn = '9791159010873'
  const marcRecord = [
    { field: '020', ind: '  ', value: '$a 9791159010873' },
    { field: '245', ind: '00', value: '$a 디지털 인문학 입문 = $x Digital humanities / $d 김현, $e 임영상, $e 김바로 공저' },
    { field: '260', ind: '  ', value: '$a 서울 : $b Huebooks : $b 한국외국어대학교 지식출판원, $c 2016' },
    { field: '300', ind: '  ', value: '$a 510 p. : $b 삽화, 도표, 초상 ; $c 23 cm' },
    { field: '650', ind: ' 8', value: '$a 인문 과학' },
    { field: '700', ind: '1 ', value: '$a 김현' },
    { field: '700', ind: '1 ', value: '$a 임영상' },
    { field: '700', ind: '1 ', value: '$a 김바로' },
  ]

  const [idx, setIdx] = useState(0)
  const [inputs, setInputs] = useState({})
  const [hintOpen, setHintOpen] = useState(false)
  const [checked, setChecked] = useState(false)
  const [blankResults, setBlankResults] = useState({}) // { [blankIndex]: boolean }
  const [finished, setFinished] = useState(false)
  const [resultsById, setResultsById] = useState({}) // { [questionId]: boolean }

  const q = questions[idx]

  function blankKeyAt(i) {
    return String(i)
  }

  function initInputsForQuestion(question) {
    const next = {}
    question.blanks.forEach((_, i) => {
      next[blankKeyAt(i)] = ''
    })
    return next
  }

  useEffect(() => {
    if (!q) return
    setInputs(initInputsForQuestion(q))
    setHintOpen(false)
    setChecked(false)
    setBlankResults({})
  }, [idx])

  const progressPct = total === 0 ? 0 : Math.round((idx / total) * 100)
  const questionNumber = Math.min(idx + 1, total)

  const canCheck = q && q.blanks.length > 0

  function checkAnswer() {
    if (!q) return
    if (!canCheck) return

    const nextResults = {}
    let allCorrect = true

    q.blanks.forEach((b, i) => {
      const key = blankKeyAt(i)
      const ok = isPartialCorrect(inputs[key], b.answer)
      nextResults[key] = ok
      if (!ok) allCorrect = false
    })

    setBlankResults(nextResults)
    setChecked(true)
    setResultsById((prev) => ({ ...prev, [q.id]: allCorrect }))
    recordResult(q.field, allCorrect)
  }

  function nextQuestion() {
    if (!checked) return
    const allBlanksCorrect = q.blanks.every((_, i) => blankResults[blankKeyAt(i)])
    if (!allBlanksCorrect) return

    if (idx + 1 >= total) {
      setFinished(true)
      return
    }

    setIdx((n) => n + 1)
  }

  function restart() {
    const nextQuestions = [...writeQuestions].sort(() => Math.random() - 0.5)
    setQuestions(nextQuestions)
    setIdx(0)
    setHintOpen(false)
    setChecked(false)
    setBlankResults({})
    setResultsById({})
    setFinished(false)
    setInputs(nextQuestions[0] ? initInputsForQuestion(nextQuestions[0]) : {})
  }

  if (!q) return null

  if (finished) {
    const correctTotal = Object.values(resultsById).filter(Boolean).length
    const renderMarcValue = (value) => {
      const parts = String(value).split(/(\$[a-z0-9])/gi).filter(Boolean)
      return parts.map((p, i) =>
        /^\$[a-z0-9]$/i.test(p) ? (
          <span key={i} className="text-accent2">
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
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
            <div className="text-lg font-bold text-text">작성 훈련</div>
          </div>
          <div className="w-[72px] text-right font-mono text-sm text-muted">완료</div>
        </header>

        <section className="mt-6 rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
          <div className="text-3xl">🎉 완료!</div>
          <div className="mt-3 text-sm text-muted">
            {correctTotal} / {total} 정답
          </div>
          <button
            type="button"
            onClick={restart}
            className="mt-6 w-full rounded-2xl bg-accent px-4 py-3 font-semibold text-white shadow-sm hover:shadow-md transition-shadow"
          >
            다시 하기
          </button>
        </section>

        <section className="mt-4 rounded-2xl border border-border bg-surface p-4">
          <div className="font-mono text-xs text-muted">// 완성된 MARC 레코드</div>
          <div className="mt-3">
            {marcRecord.map((row, i) => (
              <div
                key={`${row.field}-${row.ind}-${row.value}`}
                className={[
                  'flex gap-2',
                  'py-2',
                  i === marcRecord.length - 1 ? '' : 'border-b border-border',
                ].join(' ')}
              >
                <div className="w-10 font-mono text-accent">{row.field}</div>
                <div className="w-6 font-mono text-xs text-muted">{row.ind}</div>
                <div className="text-sm text-text">{renderMarcValue(row.value)}</div>
              </div>
            ))}
          </div>
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
          <div className="text-lg font-bold text-text">작성 훈련</div>
        </div>

        <div className="w-[72px] text-right font-mono text-sm text-muted">
          {questionNumber} / {total}
        </div>
      </header>

      <div className="mt-4 h-1 w-full rounded-full bg-border">
        <div className="h-1 rounded-full bg-accent transition-all" style={{ width: `${progressPct}%` }} />
      </div>

      <section className="mt-6 rounded-xl bg-surface p-4 text-sm shadow-sm">
        <div className="font-semibold text-text">📖 {bookTitle}</div>
        <div className="mt-3 space-y-2">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-muted text-xs">저자:</span>
            <span className="text-text text-sm">{bookAuthor}</span>
          </div>

          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-muted text-xs">발행:</span>
            <span className="text-text text-sm">{bookPublication}</span>
          </div>

          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-muted text-xs">형태:</span>
            <span className="text-text text-sm">{bookPhysical}</span>
          </div>

          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-muted text-xs">주제:</span>
            <span className="text-text text-sm">{bookSubject}</span>
          </div>

          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-muted text-xs">ISBN:</span>
            <span className="text-text text-sm">{bookIsbn}</span>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-white p-5 shadow-sm">
        <div className="font-mono text-accent text-sm">
          {q.field} {q.indicators}
        </div>

        <div className="mt-2 text-base font-semibold text-text">{q.title}</div>

        <div className="mt-4 space-y-3">
          {q.blanks.map((b, i) => {
            const key = blankKeyAt(i)
            const ok = blankResults[key]
            const showState = checked
            const borderClass = showState
              ? ok
                ? 'border-success bg-[rgba(67,217,173,0.10)]'
                : 'border-red-400 bg-[rgba(239,68,68,0.08)]'
              : 'border-border'

            return (
              <label key={key} className="block">
                <div className="mb-1 font-mono text-sm text-muted">{b.label}</div>
                <input
                  value={inputs[key] ?? ''}
                  onChange={(e) => {
                    const v = e.target.value
                    setInputs((prev) => ({ ...prev, [key]: v }))
                    if (checked) {
                      setChecked(false)
                      setBlankResults({})
                      setResultsById((prev) => {
                        const next = { ...prev }
                        delete next[q.id]
                        return next
                      })
                    }
                  }}
                  className={[
                    'w-full border rounded-lg p-2 font-mono text-sm outline-none',
                    borderClass,
                  ].join(' ')}
                />
              </label>
            )
          })}
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {hintOpen && (
            <div className="rounded-lg border border-border bg-surface p-3 text-sm text-muted">
              <span className="font-mono text-accent">// hint</span>
              <div className="mt-2">{q.hint}</div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setHintOpen((v) => !v)}
              className="flex-1 rounded-2xl border border-border bg-white px-4 py-3 font-semibold text-text shadow-sm hover:shadow-md transition-shadow"
            >
              {hintOpen ? '🙈 힌트 감추기' : '💡 힌트 보기'}
            </button>

            {!checked ? (
              <button
                type="button"
                disabled={!canCheck}
                onClick={checkAnswer}
                className="flex-1 rounded-2xl bg-accent px-4 py-3 font-semibold text-white shadow-sm hover:shadow-md transition-shadow"
              >
                정답 확인
              </button>
            ) : q.blanks.every((_, i) => blankResults[blankKeyAt(i)]) ? (
              <button
                type="button"
                onClick={nextQuestion}
                className={[
                  'flex-1 rounded-2xl px-4 py-3 font-semibold shadow-sm transition-shadow',
                  'bg-accent text-white hover:shadow-md',
                ].join(' ')}
              >
                다음 문제 →
              </button>
            ) : (
              <button
                type="button"
                onClick={checkAnswer}
                className="flex-1 rounded-2xl bg-accent px-4 py-3 font-semibold text-white shadow-sm hover:shadow-md transition-shadow"
              >
                정답 확인
              </button>
            )}
          </div>

          {checked && !q.blanks.every((_, i) => blankResults[blankKeyAt(i)]) && (
            <div className="text-xs text-muted">
              입력값을 정답에 포함되게 더 정확히 작성해보세요.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

