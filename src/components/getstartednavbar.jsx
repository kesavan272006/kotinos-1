import gsap from 'gsap';
import { useRef,useLayoutEffect } from 'react';
import logo from '../assets/logo.png';
import '../App.css';
import { Link } from 'react-router-dom';
function Navbarout() {
  const comp=useRef(null);
  
  useLayoutEffect(() =>{
    let ctx=gsap.context(()=>{
      const t1=gsap.timeline()
      t1.from(["#kotinos-nav","#navbar-components"],{
          opacity:0,
          duration:1.5,
          stagger:0.2,
        })
      
    },comp)

    

    return()=>ctx.revert()
  },[])


    return (
      <div ref={comp} className=" py-7 ">
        <nav className='flex items-center justify-between'>
          <div className="left flex items-center md:text-6xl text-3xl ml-4 md:ml-10 gap-5">
            {/* <Link to='/about'><img src={logo} className='logo md:block md:h-20 md:w-20 hidden rounded-full' /></Link> */}
            <Link to='/about'><h1 id='kotinos-nav' style={{}} className='gradient-text russo pt-3 hover:scale-105 transition-all md:text-5xl text-4xl'>KOTINOS</h1></Link>
            
          </div>
          <div id="navbar-components" className="ul">
            <ul className='flex mr-4 md:text-2xl text-l gap-6 mt-4 md:pr-10 md:mt-5'>
              <Link to='/about' className='md:ml-10 ml-4 russo hover:scale-110 transition-all cursor-pointer text-white'>About</Link>
              <Link to={'/about'} className='md:ml-10 ml-4 russo hover:scale-110 transition-all cursor-pointer text-white'>Contact Us</Link>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
  
  export default Navbarout;
  