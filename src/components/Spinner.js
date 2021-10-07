import React from "react";
import spinnerUrl from "../Spinner.gif";

function Spinner() {
  return (
    <img
      className="position-absolute top-50 end-0 translate-middle"
      src={spinnerUrl}
      alt="Loading..."
    />
  );
}

export default Spinner;
