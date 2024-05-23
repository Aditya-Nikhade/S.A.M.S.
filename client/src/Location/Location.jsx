import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Autosuggest from "react-autosuggest";
import { UserContext } from "../authentication/UserContextProvider";
import Stepper from "../Stepper2";

export default function Location() {
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const locations = ["CRC", "Laun Tennis Court", "Ground", "Auditorium", "CSE Lawns", "Electrical Lawns"];
  const [reason, setReason] = useState('');
  const [date, setDate] = useState(new Date());
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [flag,setFlag] = useState(false)
  const { nameofUser } = useContext(UserContext);
  const person = nameofUser === "CRCHead" ? "CRCHead" : "MaintenanceHead";
  const array = [person];

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0 ? [] : locations.filter(loc =>
      loc.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = suggestion => suggestion;

  const renderSuggestion = suggestion => (
    <div className="p-2 hover:bg-gray-200 cursor-pointer">
      {suggestion}
    </div>
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const recipient = location === 'CRC' ? "CRCInCharge" : "MaintenanceHead";

    const data = {
      reason: reason,
      day: date,
      fromTime: fromTime,
      toTime: toTime,
      origin: nameofUser,
      location: location,
      sender: nameofUser,
      recipient: recipient
    };
    axios.post('http://localhost:3000/location', data)
      .then(() => {
        console.log("Location added successfully");
      })
      .catch((err) => {
        console.error("Error adding location to database", err);
      });
    setReason("");
    setDate(new Date());
    setFromTime("");
    setToTime("");
    setFlag(false);
  }

  const [dataArray, setDataArray] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/calendar/location");
        setDataArray(res.data);
      } catch (err) {
        console.error("Error fetching the data array for location", err);
      }
    };
      fetchData();
      checkAvailability(location,fromTime,toTime);
  }, [fromTime,toTime]);
  
  const checkAvailability = (location,fromTime,toTime) => {
    const foundMessage = dataArray.find((element) => element.location === location);
    const fromTimeMessage = foundMessage?.fromTime;
    const toTimeMessage = foundMessage?.toTime;
  
    if (
      (fromTime >= fromTimeMessage && fromTime <= toTimeMessage) ||
      (fromTimeMessage >= fromTime && fromTimeMessage <= toTime)
    ) { 
      console.log("Clash")
      console.log(location,date,fromTime,toTime)
      setFlag(false);
    } else {
      console.log("No Clash")
      console.log(location,date,fromTime,toTime)
      setFlag(true);
    }
  };


  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <form className="bg-white p-8 rounded shadow-md max-w-md w-full" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Reason</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter the reason"
            className="mt-1 p-2 border rounded w-full focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="Enter date"
            className="mt-1 p-2 border rounded w-full focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Location</label>
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={{
              placeholder: 'Enter location',
              value: location,
              onChange: (e, { newValue }) => setLocation(newValue),
              className: "mt-1 p-2 border rounded w-full focus:outline-none focus:border-blue-500"
            }}
            theme={{
              container: 'relative',
              suggestionsContainer: 'absolute bg-white border border-gray-300 mt-1 rounded w-full',
              suggestionsList: 'list-none p-0 m-0',
              suggestion: '',
              suggestionHighlighted: 'bg-gray-200'
            }}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">From Time</label>
          <input
            type="time"
            value={fromTime}
            onChange={(e) => setFromTime(e.target.value)}
            className="mt-1 p-2 border rounded w-full focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">To Time</label>
          <input
            type="time"
            value={toTime}
            onChange={(e) => setToTime(e.target.value)}
            className="mt-1 p-2 border rounded w-full focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex justify-between">
          <div className="flex justify-between items-center">
            <span className="ml-2">{(flag) ? 'Available✔️' : 'Not available❌'}</span>
          </div>


          <button
            type="submit"
            className={`bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600d ${((!location || !fromTime || !toTime) || (!flag)) ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!flag} //flag false means ki location is not available
          >
            Submit
          </button>
        </div>
      </form>
      <Stepper totalSteps={array.length} currentStep={0} labels={array} />
    </div>
  );
}
