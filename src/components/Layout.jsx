import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav.jsx'

export default function Layout() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="mx-auto w-full max-w-[480px]">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  )
}

