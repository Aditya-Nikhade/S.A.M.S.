import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../authentication/UserContextProvider";
import {Slide, ToastContainer,toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';



export default function MoneyTask() {
    const [arr, setArr] = useState([]);
    const [arr2, setArr2] = useState([]);
    const [arr3, setArr3] = useState([]);
    const {nameofUser, hierarchy, setmoneyConfirm, setClassesConfirm, setLocationConfirm } = useContext(UserContext);
    const tempArr = hierarchy[0];
    const tempArr2 = hierarchy[1];
    const tempo = (nameofUser==='CRCInCharge')?("CRCInCharge"):("MaintenanceHead");
    let tempArr3 = [tempo];
    const [flag,setFlag] = useState(false);
    console.log(tempArr3)

    useEffect(() => {
        fetchMessages();
        console.log("Fetching messages...")
    }, [flag]);

    const fetchMessages = () => {
        axios.get(`http://localhost:3000/extuser/money/submitted/${nameofUser}`).then(async (res) => {
            setArr(res.data);
        });
        axios.get(`http://localhost:3000/extuser/classes/submitted/${nameofUser}`).then(async (res) => {
            setArr2(res.data);
        });
        axios.get(`http://localhost:3000/extuser/location/${nameofUser}`).then(async(res)=>{
            setArr3(res.data);
            console.log("Form submission works");
        }).catch((err)=>{
            console.error("Error fetching the location requests", err);
        })
    };

    const handleSubmit = (index, messageID) => {
        const newIndex = index + 1;
        if (newIndex < tempArr.length) {
            const sender = nameofUser;
            const reciever = tempArr[newIndex];
            const data = { sender, reciever, messageID, newIndex };

            axios.put("http://localhost:3000/extuser/money/forward", data)
                .then(() => console.log("Forwarded successfully"))
                .catch((err) => console.log('There was an error:', err));
        } else {
            axios.delete(`http://localhost:3000/extuser/money/delete/${messageID}`)
                .then(() => {
                    console.log("Message deleted successfully..");
                    setmoneyConfirm((prev) => !prev);
                });
        }
        toast.success('Request Accepted', {
            position: "bottom-right",autoClose: 5000,hideProgressBar: false,closeOnClick: true,
            pauseOnHover: false,draggable: true,progress: undefined,theme: "light",transition: Slide,});
        setFlag((prev)=>(!prev));
    };

    const handleSubmit2 = (index, messageID) => {
        const newIndex = index + 1;
        if (newIndex < tempArr2.length) {
            const sender = nameofUser;
            const reciever = tempArr2[newIndex];
            const data = { sender, reciever, messageID, newIndex };

            axios.put("http://localhost:3000/extuser/classes/forward", data)
                .then(() => console.log("Forwarded successfully"))
                .catch((err) => console.log('There was an error:', err));
        } else {
            axios.delete(`http://localhost:3000/extuser/classes/delete/${messageID}`)
                .then(() => {
                    console.log("Message deleted successfully..");
                    setClassesConfirm((prev) => !prev);
                });
        }
        toast.success('Request Accepted', {
            position: "bottom-right",autoClose: 5000,hideProgressBar: false,closeOnClick: true,
            pauseOnHover: false,draggable: true,progress: undefined,theme: "light",transition: Slide,});
        setFlag((prev)=>(!prev));
    };

    const handleSubmit3 = (index,messageID)=>{
        const newIndex = index + 1;
        if(newIndex >= tempArr3.length){
            axios.delete(`http://localhost:3000/extuser/location/delete/${messageID}`)
                .then(() => {
                    console.log("Loaction Message deleted successfully..");
                    setLocationConfirm((prev) => !prev);
                });
        }
        toast.success('Request Accepted', {
            position: "bottom-right",autoClose: 5000,hideProgressBar: false,closeOnClick: true,
            pauseOnHover: false,draggable: true,progress: undefined,theme: "light",transition: Slide,});
        setFlag((prev)=>(!prev));
    }

    return (
        <div className="p-4">
            <div className="font-bold text-lg">Requests</div>
            <div className="mt-4">
                {arr.map((element) => (
                    <div key={element._id} className="border p-4 mb-4 flex justify-between items-center rounded-md shadow-md bg-green-50">
                        <div>
                            <span className="mr-4">From: {element.origin}</span><span>Type: Money</span>
                            <div>Reason: {element.description}</div>
                            <div>Request Date: {element.date.split('T')[0]}</div>
                            <div>Money requested: ₹{element.money}</div>
                        </div>
                        <div className="space-x-2">
                            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700" onClick={() => handleSubmit(element.index, element._id)}>Yes</button>
                            <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">No</button>
                        </div>
                    </div>
                ))}
                {arr2.map((element) => (
                    <div key={element._id} className="border p-4 mb-4 flex justify-between items-center rounded-md shadow-md bg-blue-50">
                        <div>
                            <span className="mr-4">From: {element.origin}</span><span>Type: Classes Cancel</span>
                            <div>{element.reason}</div>
                            <div>Date requested: {element.day.split('T')[0].split('-').reverse().join('-')}</div>
                            <div>From: {element.fromTime}</div>
                            <div>To: {element.toTime}</div>
                        </div>
                        <div className="space-x-2">
                            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700" onClick={() => handleSubmit2(element.index, element._id)}>Yes</button>
                            <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">No</button>
                        </div>
                    </div>
                ))}
                {arr3.map((element) => (
                <div key={element._id} className="border p-4 mb-4 flex justify-between items-center rounded-md shadow-md">
                    <div>
                        <span className="mr-4">From: {element.origin}</span><span>Type: Location</span>
                        <div>Location requested: {element.location}</div>
                        <div>{element.reason}</div>
                        <div>From: {element.fromTime}</div>
                        <div>To: {element.toTime}</div>
                    </div>
                    <div className="space-x-2">
                        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700" onClick={() => handleSubmit3(element.index, element._id)}>Yes</button>
                        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">No</button>
                    </div>
                </div>
                ))}
            </div>
            <ToastContainer
position="bottom-right"
autoClose={2000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light" transition="Slide"
/>
        </div>    
    );
    
}
