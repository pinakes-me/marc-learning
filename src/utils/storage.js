const STORAGE_KEY = 'marcWrongAnswers'

// 전체 데이터 불러오기
export function loadStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

// 전체 데이터 저장
function saveStats(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

// 결과 기록 (fieldTag: '245', isCorrect: true/false)
export function recordResult(fieldTag, isCorrect) {
  const stats = loadStats()
  if (!stats[fieldTag]) {
    stats[fieldTag] = { correct: 0, wrong: 0 }
  }
  if (isCorrect) {
    stats[fieldTag].correct += 1
  } else {
    stats[fieldTag].wrong += 1
  }
  saveStats(stats)
}

// 전체 초기화
export function clearStats() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {}
}
