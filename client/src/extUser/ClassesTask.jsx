// //this is when the person who is approving the money wala task is viewing his inbox
// import axios from "axios"
// import { useContext, useEffect, useState } from "react"
// import { UserContext } from "../authentication/UserContextProvider";

// export default function ClassesTask() {

//     const [arr,setArr] = useState([]);//if you pass moneyConfirm below as a context, its a constant, as children 
//     //cannot modify whatever is given to them, unless setSomething is provided.
//     const {nameofUser,hierarchy,setmoneyConfirm} = useContext(UserContext);
//     const tempArr = hierarchy[1];
//     console.log("This is temp array: ",tempArr)

//     useEffect(()=>{
//         fetchMessages();
//     },[])

//     const fetchMessages = ()=>{
//         axios.get("http://localhost:3000/extuser/classes/submitted"+nameofUser).then(async(res)=>{
//             setArr(res.data);
//         })
//     }

//     const handleSubmit = (index,messageID)=>{
//         console.log('Forward form is being sent');
//         const newIndex = index+1;
//         if(newIndex < tempArr.length){
//             const sender = nameofUser;
//             const reciever = tempArr[newIndex];
    
//             const data = {
//                 sender,reciever,messageID,newIndex
//             }
    
//             axios.put("http://localhost:3000/extuser/classes/forward",data).then(()=>{
//                 console.log("Forwarded successfully");
//             }).catch((err)=>{
//                 console.log('There was an error:',err);
//             })
            
//             console.log('Forward form sent and recieved');
//         }
//         else{
//             axios.delete("http://localhost:3000/extuser/classes/delete/"+messageID).then(()=>{
//                 console.log("Message deleted succesfully..");
//                 setmoneyConfirm(true);
//             })
//         }
        
//     }

//   return (
//     <div>
//         <div>HIII</div>
//         <div style={{marginTop: "200px"}}>
//         {arr.map((element)=>{
//             return(
//                 <div key={element._id}>
//                     <div>{element.description}</div>
//                     <div>{element.date}</div>
//                     <div>{element.money}</div>
//                     <span><button onClick={()=>(handleSubmit(element.index,element._id))}>Yes</button></span>
//                     <span><button>No</button></span>
//                 </div>
//             )
//         })}
//         </div>        
//     </div>
//   )
// }
