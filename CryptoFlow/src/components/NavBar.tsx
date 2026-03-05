import { NavLink } from 'react-router-dom'
import { ModeToggle } from './ToggleMode'

const TrendIcon = () => (
  <svg width="32" height="26" viewBox="0 0 32 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-cyan-400 logo-glow" aria-hidden>
    <path d="M2 20L10 12L16 16L24 6L30 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M30 2L26 5M30 2L26 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const NavBar = () => {
  return (
    <div className='flex items-center justify-between px-4 py-5 bg-black'>
        <div className="flex items-center gap-2">
          <TrendIcon />
          <h1 className='text-2xl font-bold bg-linear-to-r from-cyan-600 to-red-500 bg-clip-text text-transparent'>
            CryptoFlow
          </h1>
        </div>
        <ul className='sm:flex hidden items-center gap-5 text-sm text-gray-300'>
            <NavLink to="/" className='flex flex-col items-center gap-2'>
                <p>Home</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-500 hidden' />
            </NavLink>
            <NavLink to="/dashboard" className='flex flex-col items-center gap-2'>
                <p>Dashboard</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-500 hidden' />
            </NavLink>
            <li>
                <ModeToggle />
            </li>
            <li>
                <button className='bg-linear-to-r from-cyan-600 to-red-600 text-white font-semibold px-5 py-2 rounded-full hover:opacity-90 transition-opacity cursor-pointer'>
                    Get Started
                </button>
            </li>
        </ul>
        
    </div>
  )
}

export default NavBar