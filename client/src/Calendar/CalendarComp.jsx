import BasicCalendar from "./BasicCalendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css";

export default function CalendarComp() {
  return (
    <div style={{ height: "95vh" }}>
      <BasicCalendar />
    </div>
  );
}
