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
function App() {
  return (
    <div>
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
      </Routes>
    </div>
  );
}

export default App;
