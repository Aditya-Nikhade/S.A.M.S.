import axios from "axios";
import { createContext,useEffect,useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({children}) {

  const [uniqueID,setUniqueID] = useState(null);
  const [nameofUser,setNameofUser] = useState(null);
  const hierarchy = [["DeanWelfare","DeanAcademics","Director"],["GSec","DeanAcademics","DeanWelfare"]]
  const [moneyConfirm,setmoneyConfirm] = useState(false);
  const [classesConfirm,setClassesConfirm] = useState(false);
  const [locationConfirm,setLocationConfirm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (token) {
        axios.post('http://localhost:3000/validateToken', { token })
            .then(response => {
                if (response.data.valid) {
                    setUniqueID(response.data.uniqueID);
                    setNameofUser(response.data.nameofUser);
                } else {
                    localStorage.removeItem("jwtToken");
                }
            })
            .catch(() => {
                localStorage.removeItem("jwtToken");
            });
    }
}, []);

  return (
    <UserContext.Provider value={{uniqueID,setUniqueID,nameofUser,setNameofUser,hierarchy,moneyConfirm,setmoneyConfirm,classesConfirm,setClassesConfirm,locationConfirm,setLocationConfirm}}>
        {children}
    </UserContext.Provider>
  )
}
