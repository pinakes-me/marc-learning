import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">페이지를 찾을 수 없어요</h1>
      <p className="text-muted">주소가 잘못됐거나, 페이지가 이동됐을 수 있어요.</p>
      <Link to="/" className="inline-flex rounded-lg bg-accent px-3 py-2 text-bg">
        홈으로
      </Link>
    </section>
  )
}

