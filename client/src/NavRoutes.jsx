import { Routes, Route, Link } from "react-router-dom";
import GenUser from "./User/genUser";
import Money from "./Money/Money";
import MoneyTask from "./extUser/MoneyTask";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "./authentication/UserContextProvider";
import StepperComp from "./StepperComp";
import Classes from "./Classes/Classes";
import Location from "./Location/Location";
import pix from './google_calendar_logo.svg';
import { useNavigate } from "react-router-dom";
import CalendarComp from "./Calendar/CalendarComp";
import ProtectedRoute from "./ProtectedRoute";

export default function NavRoutes() {

  const navigate = useNavigate();
  const { setUniqueID, setNameofUser, nameofUser } = useContext(UserContext);

  const logOut = () => {
    axios.get("http://localhost:3000/logout").then(() => {
      setUniqueID(null);
      setNameofUser(null);
      localStorage.removeItem("jwtToken");
      window.history.replaceState(null, '', '/');
      navigate('/')
    });
  };
  const homeRoute = ()=>{
    navigate('/');
  }
  const calendarRoute = ()=>{
    navigate('/calendar')
  }

  return (
    <div>
      <header className="sticky top-0 bg-white shadow-md z-50">
  <div className="flex items-center justify-between p-4">
    <div className="text-lg font-bold" onClick={homeRoute} style={{ cursor: 'pointer' }}>Home</div>
    <div className="text-sm text-gray-600">{nameofUser}</div>
    <div className="flex items-center space-x-4">
      
      {nameofUser !== 'ECellHead' && nameofUser !== 'AarohiHead' && (
        <Link to="/inbox" className="text-blue-500 hover:text-blue-700">
          Inbox
        </Link>
      )}
      {(nameofUser === 'ECellHead' || nameofUser === 'AarohiHead') && (
        <Link to="/permissions" className="text-blue-500 hover:text-blue-700">
          Permissions
        </Link>
      )}
      <Link to='/calendar'><img src={pix} alt="Calendar" className="w-12 h-auto" style={{ cursor: 'pointer' }} onClick={calendarRoute} /></Link>
      <button
        onClick={logOut}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
      >
        Log Out
      </button>
    </div>
  </div>
</header>

      <main className="p-4">
        <Routes>
          <Route path="/" element={<GenUser />} />
          <Route
            path="/permissions"
            element={
              <ProtectedRoute allowedRoles={['ECellHead', 'AarohiHead']}>
                <StepperComp />
              </ProtectedRoute>
            }
          />
          <Route path="/money" element={<Money />} />
          <Route path="/money/extuser" element={<MoneyTask />} />
          <Route path="/inbox" element={<MoneyTask />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/location" element={<Location />} />
          <Route path='/calendar' element={<CalendarComp/>}/>
        </Routes>
      </main>
    </div>
  );
}
