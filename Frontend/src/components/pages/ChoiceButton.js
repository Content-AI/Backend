import React, { useState } from 'react';

const ChoiceButton = ({ label }) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleToggle = () => {
    setIsSelected(!isSelected);
  };

  return (
            <button
            className={`w-[full] flex items-center space-x-2 divide-x divide-blue-200 text-blue-700 bg-blue-500 px-4 py-2 ${
                isSelected ? 'bg-blue-200 ' : 'bg-gray-200 text-gray-800'
            }`}
            onClick={handleToggle}
            >
            <div className="w-4 h-4 rounded-full bg-gray-400" />
            <span>{label}</span>
            </button>

  );
};

export default ChoiceButton;
