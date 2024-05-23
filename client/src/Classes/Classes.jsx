import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../authentication/UserContextProvider";
import Stepper from "../Stepper2";

export default function Classes() {

  const [reason, setReason] = useState("");
  const [date, setDate] = useState(new Date());
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const { nameofUser,hierarchy } = useContext(UserContext);
  const [index,setIndex] = useState(0);

  const recipient = "GSec";
  const array = hierarchy[1];

  useEffect(()=>{
    axios.get("http://localhost:3000/classes/status/"+nameofUser).then((res)=>{
      setIndex(res.data);
      console.log("This is the index value: ",res.data);
    }).catch((err)=>{
      console.log("There was an error in getting the index: ",err);
    })
  },[])


  const submitClassesForm = (e) => {
    e.preventDefault();
    const origin = nameofUser;
    const data = {
      reason,
      date,
      fromTime,
      toTime,
      nameofUser,
      recipient,
      origin
    };

    axios.post("http://localhost:3000/classes/submitted", data)
      .then((res) => {
        console.log("Classes form submission works");
        console.log(res);
      })
      .catch((err) => {
        alert("Classes form submission doesn't work", err);
      });

    setToTime("");
    setDate(new Date());
    setFromTime("");
  };

  return (
    <div className="mt-10 flex flex-col items-center">
      <h1 className="text-3xl font-semibold mb-6">Classes Permission</h1>
      <form onSubmit={submitClassesForm} className="space-y-4">
        <input
          type="text"
          placeholder="Enter reason..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="border rounded px-4 py-2 w-80 focus:outline-none focus:border-blue-500"
        />
        <input
          type="date"
          value={date?.toISOString().slice(0, 10)}
          onChange={(e) => setDate(new Date(e.target.value))}
          className="border rounded px-4 py-2 w-80 focus:outline-none focus:border-blue-500"
        />
        <input
          type="time"
          placeholder="From?"
          value={fromTime}
          onChange={(e) => setFromTime(e.target.value)}
          className="border rounded px-4 py-2 w-80 focus:outline-none focus:border-blue-500"
        />
        <input
          type="time"
          placeholder="To?"
          value={toTime}
          onChange={(e) => setToTime(e.target.value)}
          className="border rounded px-4 py-2 w-80 focus:outline-none focus:border-blue-500"
        />
        <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 cursor-pointer">
          Submit
        </button>
      </form>
      <div className="mt-32">
      {(index === array.length) && (
        <div className="text-green-600 font-bold">Class cancellation request accepted</div>
      )}
    </div>
    <Stepper totalSteps={array.length} currentStep={index} labels={array} />
      
    </div>
  );
}
