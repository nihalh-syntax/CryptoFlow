import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Homepage from './components/Homepage'
import NavBar from './components/NavBar'
import { ThemeProvider } from './components/ThemeProvider'


function App() {
   return (
    <ThemeProvider>
    <div className="flex flex-col h-screen overflow-hidden">
      <NavBar />
      <main className="flex-1 min-h-0">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/dashboard" element={<Navigate to="/#dashboard" replace />} />
        </Routes>
      </main>
    </div>
    </ThemeProvider>
  )
}

export default App
