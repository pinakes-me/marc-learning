import { useNavigate } from 'react-router-dom'

const MODES = [
  {
    icon: '🃏',
    title: '기초 암기',
    description: '플래시카드로 MARC 필드 번호와 의미를 학습해요',
    badge: { text: 'flashcard', color: 'accent' },
    to: '/training/flashcard',
    iconBg: 'bg-[rgba(33,150,243,0.10)]',
  },
  {
    icon: '🧩',
    title: '퍼즐 모드',
    description: '드래그 앤 드롭으로 필드 순서를 맞춰요',
    badge: { text: 'drag & drop', color: 'accent2' },
    to: '/training/puzzle',
    iconBg: 'bg-[rgba(92,107,192,0.12)]',
  },
  {
    icon: '✏️',
    title: '작성 훈련',
    description: '빈칸에 서브필드를 직접 입력해 실력을 키워요',
    badge: { text: 'input', color: 'success' },
    to: '/training/write',
    iconBg: 'bg-[rgba(38,166,154,0.12)]',
  },
  {
    icon: '⚖️',
    title: '판단 퀴즈',
    description: '헷갈리는 필드를 골라내는 선택형 문제예요',
    badge: { text: 'multiple choice', color: 'accent2' },
    to: '/training/judge',
    iconBg: 'bg-[rgba(92,107,192,0.12)]',
  },
]

function Badge({ text, color }) {
  const colorClass =
    color === 'accent'
      ? 'text-accent border-[rgba(33,150,243,0.25)] bg-[rgba(33,150,243,0.08)]'
      : color === 'success'
        ? 'text-success border-[rgba(38,166,154,0.25)] bg-[rgba(38,166,154,0.08)]'
        : 'text-accent2 border-[rgba(92,107,192,0.25)] bg-[rgba(92,107,192,0.08)]'

  return (
    <span
      className={[
        'inline-flex w-fit items-center rounded-full border px-2 py-0.5',
        'font-mono text-xs',
        colorClass,
      ].join(' ')}
    >
      {text}
    </span>
  )
}

export default function Training() {
  const navigate = useNavigate()

  return (
    <div className="fade-up mx-auto max-w-[480px] p-6 pb-24 pt-10">
      <header className="space-y-2">
        <div className="font-mono text-xs text-accent2">// MARC_TRAINING</div>
        <h1 className="text-3xl font-bold tracking-tight">MARC 훈련</h1>
        <p className="text-sm text-muted">4가지 모드로 MARC 필드를 단계적으로 학습해요</p>
      </header>

      <section className="mt-6 space-y-3">
        {MODES.map((mode) => (
          <div
            key={mode.to}
            role="button"
            tabIndex={0}
            onClick={() => navigate(mode.to)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') navigate(mode.to)
            }}
            className={[
              'cursor-pointer select-none',
              'w-full rounded-2xl border border-border bg-white p-5 shadow-sm',
              'transition-all hover:border-accent hover:shadow-md',
              'flex items-start gap-4',
            ].join(' ')}
          >
            <div
              className={[
                'flex h-11 w-11 items-center justify-center rounded-2xl',
                mode.iconBg,
              ].join(' ')}
            >
              <span className="text-xl leading-none">{mode.icon}</span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-text">{mode.title}</div>
                  <div className="mt-1 text-sm text-muted">{mode.description}</div>
                </div>
                <div className="pt-0.5 text-muted">›</div>
              </div>

              <div className="mt-3">
                <Badge text={mode.badge.text} color={mode.badge.color} />
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

