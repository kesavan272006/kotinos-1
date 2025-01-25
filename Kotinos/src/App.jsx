import { useEffect, useState } from 'react'
import logo from './assets/logo.png'
import './App.css'

function App() {

  return (
    <>
      <div className="bg-white py-7 navbar">
        <nav className='flex items-center justify-between'>
          <div className="left flex items-center md:text-6xl text-3xl ml-4 md:ml-10 gap-5">
            <img src={logo} className='logo md:block md:h-20 md:w-20 hidden rounded-full' />
            <h1 className='russo pt-3'>KOTINOS</h1>
          </div>
          <div className="ul">
            <ul className='flex mr-4 md:text-2xl text-l mt-4 md:pr-10 md:mt-5'>
              <li className='md:ml-10 ml-4 russo hover:scale-110 transition-all cursor-pointer'>About</li>
              <li className='md:ml-10 ml-4 russo hover:scale-110 transition-all cursor-pointer'>Contact Us</li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="main-head flex items-center justify-center flex-col  russo text-[28px] pt-40  pt-30 md:text-[64px] md:pt-32"><div className=''>Empowering <span className='text-[#2BCEE0]'>Athletes</span>.</div>
        <div>
          <span className='text-[#2BCEE0]'>Elevating</span> Performance.
        </div>
      </div>
      <div className="desc md:flex md:items-center md:justify-center m-3 md:m-8 md:mt-12 text-center text-[#848282] md:text-3xl">
        <div className='md:w-[50%]'>Streamline team operations, manage schedules, and track performance all in one powerful platform.</div>
      </div>

      <div className="join-now-text flex flex-col justify-center items-center md:text-2xl mt-28 gap-5  ">
        <div className=' text-[#787777]'>Start Your Sports Journey <span className='text-[#2BCEE0] hover:underline'>Today</span></div>
        <div>
          <button className='rounded-[5px] px-5 py-2 bg-black text-white russo text-[17px] hover:scale-110 transition-all'>Get Started</button>
        </div>
      </div>
      <hr className='line' />
      <footer className='bg-black text-white text-center py-5'>
        <div className="icons flex justify-center gap-5 items-center m-14">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-instagram cursor-pointer hover:scale-125 transition-all" viewBox="0 0 16 16">
            <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope cursor-pointer hover:scale-125 transition-all" viewBox="0 0 16 16">
            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
          </svg>
        </div>
        <div className='md:text-2xl text-lg'>© 2025 Kotinos. All rights reserved.</div>
      </footer>


    </>
  )
}

export default App
