import Calendar from "./Calendar";
import moment from "moment";
import CustomEvent from "./CustomEvent";
import { useEffect, useState } from "react";
import axios from "axios";

const components = {
  event: CustomEvent
};


export default function BasicCalendar() {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
      try {
        const [classesResponse, locationResponse] = await Promise.all([
          axios.get("http://localhost:3000/calendar/classes"),
          axios.get("http://localhost:3000/calendar/location")
        ]);
        
        const eventsData1 = classesResponse.data.map((event) => {
          const { reason, day, fromTime, toTime, origin } = event;
          const datePart = day.split('T')[0];
          const fromDateTime = `${datePart}T${fromTime}:00`;
          const toDateTime = `${datePart}T${toTime}:00`;
          const start = moment(fromDateTime).toDate();
          const end = moment(toDateTime).toDate();
          
          return {
            start,
            end,
            title: reason,
            reason: origin,
            type: "class"
          };
        });

        const eventsData2 = locationResponse.data.map((event) => {
          const { reason, day, fromTime, toTime, origin, location } = event;
          const datePart = day.split('T')[0];
          const fromDateTime = `${datePart}T${fromTime}:00`;
          const toDateTime = `${datePart}T${toTime}:00`;
          const start = moment(fromDateTime).toDate();
          const end = moment(toDateTime).toDate();
          
          return {
            start,
            end,
            title: reason,
            reason: origin,
            location,
            type: "location"
          };
        });

        setEvents([...eventsData1, ...eventsData2]);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Calendar events={events} views={["month", "week", "day"]} components={components} />
  );
}
