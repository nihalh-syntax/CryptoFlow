import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import Homepage from './components/Homepage'
import NavBar from './components/NavBar'
import { ThemeProvider } from './components/ThemeProvider'
import Dashboard from './components/Dashboard'


function App() {
  const location = useLocation()

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen overflow-hidden">
        <NavBar />
        <main className="flex-1 min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              className="h-full"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Routes location={location}>
                <Route path="/" element={<Homepage />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
