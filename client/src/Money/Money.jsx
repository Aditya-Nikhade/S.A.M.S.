import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../authentication/UserContextProvider";
import Stepper from "../Stepper2";

export default function Money() {

  const [desc, setDesc] = useState("");
  const [date, setDate] = useState(new Date());
  const [number, setNumber] = useState("");
  const [index,setIndex] = useState(0);
  const { nameofUser,hierarchy } = useContext(UserContext);
  
  const recipient = "DeanWelfare";
  const array = hierarchy[0];

  useEffect(()=>{
    axios.get("http://localhost:3000/money/status/"+nameofUser).then((res)=>{
       if(res.data === -1){
        setIndex(0);
       }
       else{
        setIndex(res.data);
       }
      
      console.log("This is the index value: ",res.data);
    }).catch((err)=>{
      console.log("There was an error in getting the index: ",err);
    })
  },[])
  

  const submitMoneyForm = (e) => {
    e.preventDefault();
    // Add form submission logic here
    // WRITING TWO RES.JSON OR WHATEVER IN A SERVER CODE IS PROBLEMATIC
    const origin = nameofUser;
    const data = {
        desc,
        date,
        number,
        nameofUser,
        recipient,
        origin
    };
    axios.post("http://localhost:3000/user/money/submitted", data)
      .then(() => {
         console.log("Money form submission works");
      })
      .catch((err) => {
         alert("Money form submission doesn't work", err);
         console.log("Error");
      });

    setDesc("");
    setDate(new Date());
    setNumber("");
  };



  return (
    <div className="mt-10 flex flex-col items-center">
      <h1 className="text-3xl font-semibold mb-6">Money Permission</h1>
      <form onSubmit={submitMoneyForm} className="space-y-4">
        <input
          type="text"
          placeholder="Enter topic..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="border rounded px-4 py-2 w-80 focus:outline-none focus:border-blue-500"
        />
        <input
          type="date"
          value={date?.toISOString().slice(0, 10)}
          onChange={(e) => setDate(new Date(e.target.value))}
          className="border rounded px-4 py-2 w-80 focus:outline-none focus:border-blue-500"
        />
        <input
          type="number"
          placeholder="Enter a number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="border rounded px-4 py-2 w-80 focus:outline-none focus:border-blue-500"
        />
        <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 cursor-pointer">
          Submit
        </button>
      </form>
      <div className="mt-32">
      {(index === array.length) && (
        <div className="text-green-600 font-bold">Money request accepted</div>
      )}
    </div>
    <Stepper totalSteps={array.length} currentStep={index} labels={array} />
    </div>
  );
}
