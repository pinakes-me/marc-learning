import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Training from './pages/Training.jsx'
import Flashcard from './pages/Flashcard.jsx'
import Puzzle from './pages/Puzzle.jsx'
import Write from './pages/Write.jsx'
import Judge from './pages/Judge.jsx'
import Weak from './pages/Weak.jsx'
import Analytics from './pages/Analytics.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/training" element={<Training />} />
          <Route path="/training/flashcard" element={<Flashcard />} />
          <Route path="/training/puzzle" element={<Puzzle />} />
          <Route path="/training/write" element={<Write />} />
          <Route path="/training/judge" element={<Judge />} />
          <Route path="/weak" element={<Weak />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
