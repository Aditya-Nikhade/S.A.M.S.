const CustomEvent = ({ event }) => {
    const { title, reason, location, type } = event;
    return (
      <div className={(type==="location")?("bg-indigo-700"):("")}>
        <strong>{title}</strong>
        {reason && <div>Reason: {reason}</div>}
        {type === "location" && location && <div>Location: {location}</div>}
      </div>
    );
  };
  
  export default CustomEvent;
  