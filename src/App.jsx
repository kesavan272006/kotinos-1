import { Route, Routes } from 'react-router-dom';
import Signin from './pages/signin';
import Getstarted from './pages/Getstarted';
import Signup from './pages/signup';
import Generaluser from './pages/generalusersignin';
import Organization from './pages/organization';
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Getstarted />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/generaluser" element={<Generaluser />} />
        <Route path="/organization" element={<Organization />} />
      </Routes>
    </div>
  );
}

export default App;
