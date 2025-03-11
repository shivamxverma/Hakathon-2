import {
  BrowserRouter, Routes, Route,
} from 'react-router-dom';

import Signup from './components/Signup';
import Login from './components/login';
import Dashboard from './components/Dashboard';
import GroupChat from './components/GroupChat';

function App() {

  return (
    <>
     
     <BrowserRouter>
      <Routes>
        <Route path="/signup" element=<Signup/> />
        <Route path="/login" element=<Login/> />
        <Route path="/dashboard" element=<Dashboard/> />
        <Route path="/GroupChat" element=<GroupChat/> />
      </Routes>
    </BrowserRouter>

    </>
  )
}

export default App
