import { useContext, useLayoutEffect } from "react";
import {BrowserRouter} from "react-router-dom"
import { UserContext } from "./authentication/UserContextProvider";
import NavRoutes from "./NavRoutes";
import LoginAndSignup from "./authentication/LoginAndSignup";

export default function Rider() {

  const {nameofUser} = useContext(UserContext);
  console.log("The name of the user is: ",nameofUser);

  useLayoutEffect(() => {
    if (nameofUser) {
      // Replace the current history entry with the root path
      window.history.replaceState(null, '', '/');
    }
  }, [nameofUser]);

  return (
    <BrowserRouter>
    <div>
    {(nameofUser)?(<NavRoutes/>):(<LoginAndSignup/>)}
     </div>
    </BrowserRouter>
  )
}
