import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const Calendar = (props) => {
  return <BigCalendar {...props} localizer={localizer} />;
};

export default Calendar;
