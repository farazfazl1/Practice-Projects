import React, { useState } from "react";
import ReactDOM from "react-dom/client";
// import StarRating from "./StarRating";
import App from "./App copy_2";
import "./index.css";

// function Test() {
//   const [movieRating, setMovieRating] = useState(0);
//   return (
//     <>
//       <StarRating color="blue" maxRating={10} onSetRating={setMovieRating} />
//       <p>This movie was rated {movieRating} stars</p>
//     </>
//   );
// }

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating
      maxRating={5}
      messages={["Terrible", "Bad", "Ok", "Good", "Amazing"]}
    />
    <StarRating
      maxRating={10}
      size={24}
      color="red"
      className="test"
      defaultRating={6}
    />
    <Test /> */}
  </React.StrictMode>
);
