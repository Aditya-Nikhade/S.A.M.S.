import { useContext, useState } from 'react';
import axios from "axios";
import picture from './VNIT_logo.jpeg';
import { UserContext } from './UserContextProvider';
import { useNavigate } from 'react-router-dom';

export default function LoginAndSignup() {
  const [selectedOption, setSelectedOption] = useState("");
  const [password, setPassword] = useState("");
  const [actionType, setActionType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const { setUniqueID, setNameofUser } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = actionType === 'login' ? 'login' : 'signup';

    const [userID, username] = selectedOption.split("-");
    axios.post("http://localhost:3000/" + url, { username, userID, password }).then((res) => {

        localStorage.setItem("jwtToken", res.data.token);

        setUniqueID(res.data?.id);
        setNameofUser(res.data?.username);

        setSelectedOption("");
        setPassword("");
        setErrorMessage(""); // Clear any previous error messages

        window.history.replaceState(null, '', '/');
        navigate('/');

      })
      .catch((err) => {
        setErrorMessage(err.response?.data?.error || "An unexpected error occurred");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          <img src={picture} alt="VNIT Logo" className="w-20 h-20 mb-4" />
          <h1 className="text-2xl font-bold text-gray-700 mb-6 text-center">Sign in to<br />S.A.M.S</h1>
          {errorMessage && <div className="mb-4 text-red-500">{errorMessage}</div>}
          <select 
            value={selectedOption} 
            onChange={(e) => setSelectedOption(e.target.value)} 
            required 
            className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="username"
          >
            <option value="">Select an option</option>
            <option value="1-Director">Director</option>
            <option value="2-DeanAcademics">DeanAcademics</option>
            <option value="3-DeanWelfare">DeanWelfare</option>
            <option value="4-AarohiHead">AarohiHead</option>
            <option value="5-ECellHead">ECellHead</option>
            <option value="6-DeanSWF">DeanSWF</option>
            <option value="7-GSec">GSec</option>
            <option value="8-CRCInCharge">CRCInCharge</option>
            <option value="9-MaintenanceHead">MaintenanceHead</option>
          </select>
          <input 
            type="password" 
            placeholder="Enter password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete={actionType === 'signup' ? "new-password" : "current-password"}
          />
          <div className="w-full flex justify-between">
            <button 
              type="submit" 
              onClick={() => setActionType('login')} 
              className="w-1/2 mr-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700"
            >
              Sign In
            </button>
            <button 
              type="submit" 
              onClick={() => setActionType('signup')} 
              className="w-1/2 ml-2 bg-green-500 text-white p-2 rounded-lg hover:bg-green-700"
            >
              Sign Up
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
