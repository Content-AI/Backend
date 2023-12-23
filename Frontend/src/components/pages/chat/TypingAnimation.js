import React, { useState, useEffect } from "react";

const TypingAnimation = ({ textToType, onFinishTyping }) => {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showStopButton, setShowStopButton] = useState(true);

  useEffect(() => {
    const typingSpeed = 1000;
    let currentIndex = 0;

    const typeText = () => {
      if (!isTyping) {
        return;
      }

      if (currentIndex < textToType.length) {
        const nextChar = textToType[currentIndex];
        setText((prevText) => prevText + nextChar);
        currentIndex++;
      } else {
        setIsTyping(false);
        onFinishTyping(true);
        setShowStopButton(false); // Hide the stop button when typing is finished
      }
    };

    const typingInterval = setInterval(typeText, 100 / typingSpeed);

    return () => {
      setIsTyping(false);
      clearInterval(typingInterval);
    };
  }, [isTyping, textToType, onFinishTyping]);

  const stopTyping = () => {
    setIsTyping(false);
    setShowStopButton(false); // Hide the stop button when clicked
    onFinishTyping(false);
  };

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: text }} />
      {isTyping && showStopButton && (
        <button
          className="fixed bottom-[150px] ml-[100px] left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all"
          onClick={stopTyping}
        >
          Stop
        </button>
      )}
    </div>
  );
};

export default TypingAnimation;
