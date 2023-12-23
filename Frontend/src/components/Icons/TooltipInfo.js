import React, { useState, useEffect, useRef } from "react";
const TooltipInfo = ({ text }) => {
  const [isClicked, setIsClicked] = useState(false);
  const tooltipRef = useRef(null);

  const toggleTooltip = () => {
    setIsClicked(!isClicked);
  };

  const handleOutsideClick = (event) => {
    if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
      setIsClicked(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const calculateTooltipWidth = () => {
    // Set a minimum and maximum width for the tooltip
    const minWidth = 150; // Set to your desired minimum width
    const maxWidth = 300; // Set to your desired maximum width

    // Calculate the width based on the text length
    const textLength = text.length;
    const calculatedWidth = Math.min(Math.max(textLength * 7, minWidth), maxWidth);
    return calculatedWidth;
  };

  const tooltipWidth = calculateTooltipWidth();

  return (
    <div className="relative inline-block text-left ml-2" ref={tooltipRef}>
      <button
        className="rounded-full w-4 h-4 bg-gray-800 text-white flex items-center justify-center"
        onClick={toggleTooltip}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          aria-hidden="true"
          className="h-4 w-4 text-gray-300 hover:text-gray-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
      {isClicked && (
        <div
          className=" absolute bottom-5 left-1/2 transform -translate-x-1/2 opacity-100 pointer-events-auto transition-opacity duration-300 z-50"
          style={{ width: `${tooltipWidth}px` }}
        >
          <div className="bg-black text-white text-xs rounded p-2">{text}</div>
        </div>
      )}
    </div>
  );
};

export default TooltipInfo;

