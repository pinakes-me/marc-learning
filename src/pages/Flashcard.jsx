import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { flashcards } from '../data/flashcards.js'
import { recordResult } from '../utils/storage.js'

export default function Flashcard() {
  const navigate = useNavigate()
  const [cards, setCards] = useState(() => [...flashcards].sort(() => Math.random() - 0.5))
  const total = cards.length

  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [completed, setCompleted] = useState(false)

  const current = cards[index]
  const currentNumber = Math.min(index + 1, total)
  const progressPct = total === 0 ? 0 : Math.round((index / total) * 100)

  function nextCard(wasCorrect) {
    setFlipped(false)
    if (wasCorrect) setCorrectCount((c) => c + 1)

    const nextIndex = index + 1
    if (nextIndex >= total) {
      setCompleted(true)
      return
    }
    setIndex(nextIndex)
  }

  function restart() {
    setCards(() => [...flashcards].sort(() => Math.random() - 0.5))
    setIndex(0)
    setFlipped(false)
    setCorrectCount(0)
    setCompleted(false)
  }

  return (
    <div className="fade-up mx-auto max-w-[480px] p-6 pb-24 pt-10">
      <style>{`
        .flip-scene { perspective: 1200px; }
        .flip-card {
          position: relative;
          transform-style: preserve-3d;
          transition: transform 420ms cubic-bezier(.2,.8,.2,1);
        }
        .flip-card.is-flipped { transform: rotateY(180deg); }
        .flip-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .flip-back { transform: rotateY(180deg); }
      `}</style>

      <header className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate('/training')}
          className="rounded-xl border border-border bg-white px-3 py-2 text-sm shadow-sm hover:shadow-md transition-shadow"
        >
          ←
        </button>

        <div className="min-w-0 flex-1 text-center">
          <div className="text-lg font-bold text-text">기초 암기</div>
        </div>

        <div className="w-[72px] text-right font-mono text-sm text-muted">
          {completed ? `${total} / ${total}` : `${currentNumber} / ${total}`}
        </div>
      </header>

      <div className="mt-4 h-1 w-full rounded-full bg-border">
        <div
          className="h-1 rounded-full bg-accent transition-all"
          style={{
            width: completed ? '100%' : `${progressPct}%`,
          }}
        />
      </div>

      {completed ? (
        <section className="mt-6 rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
          <div className="text-3xl">🎉 완료!</div>
          <div className="mt-3 text-sm text-muted">
            총 {total}개 중 {correctCount}개 맞았어요
          </div>
          <button
            type="button"
            onClick={restart}
            className="mt-6 w-full rounded-2xl bg-accent px-4 py-3 font-semibold text-white shadow-sm hover:shadow-md transition-shadow"
          >
            다시 하기
          </button>
        </section>
      ) : (
        <>
          <section className="mt-6 flip-scene">
            <button
              type="button"
              onClick={() => setFlipped((v) => !v)}
              className="w-full text-left"
            >
              <div
                key={current.id}
                className={[
                  'flip-card min-h-64 w-full rounded-2xl border border-border bg-white shadow-sm',
                  flipped ? 'is-flipped' : '',
                ].join(' ')}
              >
                <div className="flip-face flex min-h-64 flex-col items-center justify-center p-6">
                  <div className="text-center text-lg text-text">{current.front}</div>
                  <div className="mt-4 text-center text-xs text-muted">탭하여 뒤집기</div>
                </div>

                <div className="flip-face flip-back flex min-h-64 flex-col items-center justify-center p-6">
                  <div className="font-mono text-6xl text-accent">{current.back}</div>
                  <div className="mt-4 text-center text-sm text-muted">{current.sub}</div>
                </div>
              </div>
            </button>
          </section>

          {flipped && (
            <section className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  recordResult(cards[index].back, true)
                  nextCard(true)
                }}
                className="rounded-2xl bg-success px-4 py-3 font-semibold text-white shadow-sm hover:shadow-md transition-shadow"
              >
                ✅ 알았어요
              </button>
              <button
                type="button"
                onClick={() => {
                  recordResult(cards[index].back, false)
                  nextCard(false)
                }}
                className="rounded-2xl border border-border bg-white px-4 py-3 font-semibold text-muted shadow-sm hover:shadow-md transition-shadow"
              >
                ❌ 다시 볼게요
              </button>
            </section>
          )}
        </>
      )}
    </div>
  )
}

