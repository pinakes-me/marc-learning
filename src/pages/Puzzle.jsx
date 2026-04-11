import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DndContext,
  MouseSensor,
  pointerWithin,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { recordResult } from '../utils/storage.js'

const puzzleDataKCR4 = [
  { id: 'kcr4-100', tag: '100', answer: '$a 홍길동 지음' },
  { id: 'kcr4-245', tag: '245', answer: '$a 도서관과 디지털 인문학 / $d 홍길동 지음' },
  { id: 'kcr4-260', tag: '260', answer: '$a 서울 : $b 한국도서관협회, $c 2023' },
  { id: 'kcr4-300', tag: '300', answer: '$a 256 p. ; $c 23 cm' },
  { id: 'kcr4-650', tag: '650', answer: '$a 디지털 인문학' },
  { id: 'kcr4-700', tag: '700', answer: '$a 김철수 공저' },
]

const puzzleDataKCR5 = [
  { id: 'kcr5-245', tag: '245', answer: '$a 디지털 인문학 입문 = $x Digital humanities / $d 김현, $e 임영상, $e 김바로 공저' },
  { id: 'kcr5-260', tag: '260', answer: '$a 서울 : $b Huebooks : $b 한국외국어대학교 지식출판원, $c 2016' },
  { id: 'kcr5-300', tag: '300', answer: '$a 510 p. : $b 삽화, 도표, 초상 ; $c 23 cm' },
  { id: 'kcr5-650', tag: '650', answer: '$a 인문 과학' },
  { id: 'kcr5-700-1', tag: '700', answer: '$a 김현' },
  { id: 'kcr5-700-2', tag: '700', answer: '$a 임영상' },
  { id: 'kcr5-700-3', tag: '700', answer: '$a 김바로' },
]

function shuffle(array) {
  const a = [...array]
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function DraggableCard({ item, disabled }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    disabled,
  })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={[
        'rounded-xl border border-border bg-white p-3 shadow-sm',
        'cursor-grab select-none',
        isDragging ? 'opacity-50' : '',
      ].join(' ')}
    >
      <div className="min-w-0">
        <div className="text-sm text-muted">{item.answer}</div>
      </div>
    </div>
  )
}

function DropZoneRow({ zoneId, tag, filledCard, checked, isCorrect, onClear }) {
  const { isOver, setNodeRef } = useDroppable({ id: `drop:${zoneId}` })

  const borderClass = checked
    ? isCorrect
      ? 'border-[rgba(38,166,154,0.45)]'
      : 'border-red-300'
    : isOver
      ? 'border-accent'
      : 'border-border'

  return (
    <div className="grid grid-cols-[72px_1fr] items-start gap-3">
      <div className="pt-3 font-mono text-xl text-accent">{tag}</div>

      <div
        ref={setNodeRef}
        className={[
          'rounded-xl border bg-white shadow-sm',
          filledCard ? 'p-3' : 'border-dashed p-4',
          borderClass,
        ].join(' ')}
      >
        {!filledCard ? (
          <div className="text-sm text-muted">여기에 드래그하세요</div>
        ) : (
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm text-muted">{filledCard.answer}</div>
            </div>
            <button
              type="button"
              onClick={onClear}
              className="shrink-0 rounded-lg border border-border bg-white px-2 py-1 text-xs text-muted hover:shadow-sm"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Puzzle() {
  const navigate = useNavigate()
  const [seed, setSeed] = useState(0)
  const [screen, setScreen] = useState('select') // 'select' | 'playing' | 'result'
  const [mode, setMode] = useState(null) // null | 'KCR4' | 'KCR5'
  const data = mode === 'KCR5' ? puzzleDataKCR5 : mode === 'KCR4' ? puzzleDataKCR4 : null
  const cards = useMemo(() => (data ? shuffle(data) : []), [data, seed])

  const dropZones = useMemo(
    () => (data ? data.map((x, i) => ({ id: `zone-${i}`, expectedTag: x.tag })) : []),
    [data],
  )
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))
  const [assignments, setAssignments] = useState({})
  const [checked, setChecked] = useState(false)

  const assignedIds = useMemo(() => new Set(Object.values(assignments).filter(Boolean)), [assignments])
  const remaining = useMemo(() => cards.filter((c) => !assignedIds.has(c.id)), [cards, assignedIds])

  const allFilled = dropZones.length > 0 && dropZones.every((z) => assignments[z.id])
  const correctCount = dropZones.reduce((acc, z) => {
    const cardId = assignments[z.id]
    if (!cardId) return acc
    const card = data?.find((x) => x.id === cardId)
    return acc + (card?.tag === z.expectedTag ? 1 : 0)
  }, 0)
  const allCorrect = allFilled && correctCount === dropZones.length

  function getCard(cardId) {
    return data?.find((x) => x.id === cardId) || null
  }

  function clearTag(zoneId) {
    if (checked) return
    setAssignments((prev) => ({ ...prev, [zoneId]: null }))
  }

  function start(selectedMode) {
    const selectedData = selectedMode === 'KCR5' ? puzzleDataKCR5 : puzzleDataKCR4
    const selectedDropZones = selectedData.map((x, i) => ({ id: `zone-${i}`, expectedTag: x.tag }))

    setMode(selectedMode)
    setScreen('playing')
    setChecked(false)
    setAssignments(
      selectedDropZones.reduce((acc, z) => {
        acc[z.id] = null
        return acc
      }, {}),
    )
    setSeed((s) => s + 1)
  }

  function retry() {
    setChecked(false)
    setScreen('playing')
    setAssignments(
      dropZones.reduce((acc, z) => {
        acc[z.id] = null
        return acc
      }, {}),
    )
    setSeed((s) => s + 1)
  }

  function goBack() {
    if (screen === 'select') {
      navigate('/training')
      return
    }
    setScreen('select')
    setMode(null)
    setChecked(false)
    setAssignments({})
  }

  function onDragEnd(event) {
    if (checked) return
    if (!data) return

    const draggedId = event.active?.id
    const overId = event.over?.id
    if (!draggedId || !overId) return
    if (typeof overId !== 'string' || !overId.startsWith('drop:')) return

    const zoneId = overId.replace('drop:', '')
    if (!dropZones.some((z) => z.id === zoneId)) return

    setAssignments((prev) => {
      const next = { ...prev }

      for (const z of dropZones) {
        if (next[z.id] === draggedId) next[z.id] = null
      }

      next[zoneId] = draggedId
      return next
    })
  }

  return (
    <div className="fade-up mx-auto max-w-[480px] p-6 pb-24 pt-10">
      <header className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={goBack}
          className="rounded-xl border border-border bg-white px-3 py-2 text-sm shadow-sm hover:shadow-md transition-shadow"
        >
          ←
        </button>

        <div className="min-w-0 flex-1">
          <div className="text-2xl font-bold tracking-tight text-text">퍼즐 모드</div>
          <div className="mt-1 text-sm text-muted">태그에 맞는 필드 내용을 드래그하세요</div>
        </div>
      </header>

      {screen === 'select' ? (
        <section className="mt-6">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="text-2xl font-bold tracking-tight text-text">어떤 방식으로 풀까요?</div>
            <div className="mt-2 text-sm text-muted">
              두 가지 방식 중 선택하세요
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div
              className="cursor-pointer rounded-2xl border border-border bg-white p-6 shadow-sm transition-colors hover:border-accent"
              role="button"
              tabIndex={0}
              onClick={() => start('KCR4')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') start('KCR4')
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-bold text-text">기본표목(100) 사용 방식</div>
                </div>
                <span className="inline-flex items-center rounded-full border border-[rgba(92,107,192,0.25)] bg-[rgba(92,107,192,0.08)] px-2 py-0.5 font-mono text-xs text-accent2">
                  예전 방식
                </span>
              </div>
            </div>

            <div
              className="cursor-pointer rounded-2xl border border-border bg-white p-6 shadow-sm transition-colors hover:border-accent"
              role="button"
              tabIndex={0}
              onClick={() => start('KCR5')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') start('KCR5')
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-bold text-text">기본표목 없이 245부터 시작</div>
                </div>
                <span className="inline-flex items-center rounded-full border border-[rgba(92,107,192,0.25)] bg-[rgba(92,107,192,0.08)] px-2 py-0.5 font-mono text-xs text-accent2">
                  현행 방식
                </span>
              </div>
            </div>
          </div>
        </section>
      ) : screen === 'playing' ? (
        <>
          <DndContext
            sensors={sensors}
            collisionDetection={pointerWithin}
            onDragEnd={onDragEnd}
          >
            <section className="mt-6">
              <div className="mb-2 font-mono text-xs tracking-widest text-muted uppercase">
                // 매칭 영역
              </div>

              <div className="space-y-3">
                {dropZones.map((z) => {
                  const filledId = assignments[z.id]
                  const filledCard = filledId ? getCard(filledId) : null
                  const isCorrect = filledCard?.tag === z.expectedTag
                  return (
                    <DropZoneRow
                      key={z.id}
                      zoneId={z.id}
                      tag={z.expectedTag}
                      filledCard={filledCard}
                      checked={checked}
                      isCorrect={isCorrect}
                      onClear={() => clearTag(z.id)}
                    />
                  )
                })}
              </div>
            </section>

            <section className="mt-6">
              <div className="mb-2 font-mono text-xs tracking-widest text-muted uppercase">
                // 카드
              </div>

              <div className="grid grid-cols-1 gap-3">
                {remaining.map((item) => (
                  <DraggableCard key={item.id} item={item} disabled={checked} />
                ))}
              </div>
            </section>
          </DndContext>

          <section className="mt-6">
            <button
              type="button"
              disabled={!allFilled}
              onClick={() => {
                dropZones.forEach((z) => {
                  const cardId = assignments[z.id]
                  const card = cardId ? data?.find((x) => x.id === cardId) : null
                  const isCorrect = card?.tag === z.expectedTag
                  recordResult(z.expectedTag, isCorrect)
                })
                setChecked(true)
                setScreen('result')
              }}
              className={[
                'w-full rounded-2xl px-4 py-3 font-semibold shadow-sm transition-all',
                allFilled
                  ? 'bg-accent text-white hover:shadow-md'
                  : 'bg-border text-muted cursor-not-allowed',
              ].join(' ')}
            >
              정답 확인
            </button>
          </section>
        </>
      ) : (
        <section className="mt-6">
          {allCorrect ? (
            <div className="rounded-2xl border border-border bg-[rgba(38,166,154,0.10)] p-6 text-center shadow-sm">
              <div className="text-2xl font-bold text-success">🎉 완벽해요!</div>
              <div className="mt-2 text-sm text-muted">모든 태그를 정확히 매칭했어요.</div>
              <button
                type="button"
                onClick={retry}
                className="mt-5 w-full rounded-2xl bg-success px-4 py-3 font-semibold text-white shadow-sm hover:shadow-md transition-shadow"
              >
                다시 도전
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-white p-6 text-center shadow-sm">
              <div className="text-xl font-bold text-text">
                {correctCount} / {dropZones.length} 맞았어요!
              </div>
              <div className="mt-2 text-sm text-muted">
                빨간색으로 표시된 줄을 다시 확인해보세요.
              </div>
              <button
                type="button"
                onClick={retry}
                className="mt-5 w-full rounded-2xl border border-border bg-white px-4 py-3 font-semibold text-muted shadow-sm hover:shadow-md transition-shadow"
              >
                다시 도전
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  )
}

