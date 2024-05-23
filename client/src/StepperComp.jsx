import { Link } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect } from "react";
import { UserContext } from "./authentication/UserContextProvider";

const steps = [
  { title: "Money", link: "/money" },
  { title: "Classes", link: "/classes" },
  { title: "Location", link: "/location" },
];

let array = [];

export default function StepperComp() {
  const { moneyConfirm, classesConfirm, nameofUser } = useContext(UserContext);

  useEffect(() => {
    axios.get("http://localhost:3000/getstatus").then((res) => {
      array = res.data;
    });
  }, [moneyConfirm, classesConfirm]);

  const checkUser = (nameofUser, title) => {
    title = title.toLowerCase();
    const personData = array.find((user) => user.username === nameofUser);

    if (personData && personData.progress && personData.progress.length > 0) {
      const progressData = personData.progress[0]; // Assuming there is only one object in the progress array
      return progressData[title]; // Access the property value directly
    }

    return false;
  };

  return (
    <div className="mt-10 flex flex-col items-center">
      {steps.map((step, index) => (
        <Link to={step.link} key={index}>
          <div className="flex items-center space-x-4 py-4">
            <div
              className={`${
                checkUser(nameofUser, step.title) ? "bg-green-500" : "bg-gray-200"
              } rounded-full w-8 h-8 flex items-center justify-center`}
            >
              {checkUser(nameofUser, step.title) ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : null}
            </div>
            <div className="text-lg font-semibold">{step.title}</div>
          </div>
        </Link> 
      ))}
    </div>
  );
}
