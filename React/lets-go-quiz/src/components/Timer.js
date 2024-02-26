// This component represents a timer that dispatches a tick action every second.
// The clearInterval function is used to stop the timer when the component is unmounted or when the dependencies change.
import { useEffect } from "react";

function Timer({ dispatch, secondsRemaining }) {
  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;

  useEffect(() => {
    // Set up an interval that dispatches a tick action every second
    const id = setInterval(() => {
      dispatch({
        type: "tick",
      });
    }, 1000);

    // Return a cleanup function that clears the interval when the component is unmounted or when the dependencies change
    return () => clearInterval(id);
  }, [dispatch]);

  // Render the remaining seconds
  return (
    <div className="timer">
      {mins < 10 && "0"}
      {mins}:{secs < 10 && "0"}
      {secs}
    </div>
  );
}

export default Timer;
