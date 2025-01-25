import React from 'react'
import logo from './pictures/logo.png';

const Navbar = () => {
  return (
    <div>
        <nav className='flex justify-between bg-[rgb(40,49,40)] text-white p-4'>
            <div className="logo">
                <img src={logo} alt='Logo' className='w-[200px] mx-9 opacity-80' />
            </div>
            <ul className='flex gap-8 mx-9 mt-3.5'>
                <li className='cursor-pointer hover:font-bold transition-all duration-50'>Home</li>
                <li className='cursor-pointer hover:font-bold transition-all duration-50'>Your Tasks</li>
            </ul>
        </nav>
    </div>
  )
}

export default Navbar
