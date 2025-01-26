import logo from '../assets/logo.png';
import '../App.css';
function Navbarout() {
    return (
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
    );
  }
  
  export default Navbarout;
  