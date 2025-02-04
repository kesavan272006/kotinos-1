import { Route, Routes } from 'react-router-dom';
import Signin from './pages/signin';
import Getstarted from './pages/Getstarted';
import Signup from './pages/signup';
import Generaluser from './pages/generalusersignin';
import Organization from './pages/organization';
import About from './pages/about';
import Athleteinfo from './pages/athleteinfo';
import Emaillogin from './pages/emaillogin';
import Coachpage from './pages/coachpage';
import Profile from './pages/profile';
import Navbar from './components/navbar';
import Home from './pages/home';
import Messages from './pages/messages';
import Notification from './pages/notification';
import { UserProvider } from '../src/components/UserContext';
import Sidebar from './components/sidebar';
import Middle from './components/middle';
import Rightbar from './components/rightbar';
import Connection from './components/connection';
import Invitation from './components/invitation';
import Network from './components/network';
import { RequestProvider } from './context/RequestContext';
function App() {
  return (
    <div>
      <RequestProvider>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Getstarted />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/generaluser" element={<Generaluser />} />
          <Route path="/organization" element={<Organization />} />
          <Route path="/about" element={<About />} />
          <Route path="/athleteinfo" element={<Athleteinfo />} />
          <Route path="/emaillogin" element={<Emaillogin />} />
          <Route path="/coachpage" element={<Coachpage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/home" element={<Home />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/sidebar" element={<Sidebar />} />
          <Route path="/middle" element={<Middle />} />
          <Route path="/rightbar" element={<Rightbar />} />
          <Route path="/connection" element={<Connection />} />
          <Route path="/invitation" element={<Invitation />} />
          <Route path="/network" element={<Network />} />
        </Routes>
      </UserProvider>
      </RequestProvider>
    </div>
  );
}

export default App;
