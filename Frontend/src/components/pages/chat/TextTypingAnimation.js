import React, { useState, useEffect } from "react";

function TextTypingAnimation(props) {
  

  const [textToType, setTextToType] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const typingSpeed = 50; // Adjust typing speed in milliseconds

  useEffect(() => {
    // Simulate fetching data from an API
    // Replace this with your actual API fetch code
    // setTimeout(() => {
      const apiResponse = props.data;

      // Replace \n with <br /> for line breaks
      const formattedText = apiResponse.replace(/\n/g, "<br />");
      setTextToType(formattedText);
    // }, 1000); // Simulated API fetch delay, replace with your actual fetch code
  }, []);

  useEffect(() => {
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentIndex <= textToType.length) {
        const segment = textToType.slice(0, currentIndex);

        setDisplayedText(segment);

        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, typingSpeed);

    return () => {
      clearInterval(typingInterval);
    };
  }, [textToType]);

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: displayedText }} />
    </div>
  );
}

export default TextTypingAnimation;
