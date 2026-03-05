import './App.css'
import { Routes, Route } from 'react-router-dom'
import Homepage from './components/Homepage'
import Dashboard from './components/Dashboard'
import NavBar from './components/NavBar'
import { ThemeProvider } from './components/ThemeProvider'


function App() {
   return (
    <ThemeProvider>
    <div> 
    <NavBar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
    </ThemeProvider>
  )
}

export default App
