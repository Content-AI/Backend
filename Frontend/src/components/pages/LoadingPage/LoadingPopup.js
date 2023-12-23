import React, { useState, useEffect } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";


const LoadingPopup = () => {
  const [message, setMessage] = useState("Thinking...");

  useEffect(() => {
    const timers = [
      { time: 2000, message: "Validating email" },
      { time: 4000, message: "Creating account" },
      { time: 6000, message: "Creating Workspace" },
      { time: 8000, message: "Finalizing" }
    ];

    timers.forEach(({ time, message }) => {
      setTimeout(() => {
        setMessage(message);
      }, time);
    });
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md">
        <div className="flex items-center justify-center mb-4">
          <div className="mr-3">
            <CircularProgress color="primary" size={50} />
          </div>
          <div className="text-blue-500 text-xl font-semibold">{message}</div>
        </div>
        <p className="text-gray-700">Check Your Email. Login Via Token</p>
      </div>
    </div>
  );
};

export default LoadingPopup;
