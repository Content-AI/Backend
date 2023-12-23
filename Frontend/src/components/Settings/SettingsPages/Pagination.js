import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Function to handle previous page click
  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // Function to handle next page click
  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center mt-4">
      <button
        className="px-4 py-2 mx-1 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300"
        onClick={handlePrevClick}
      >
        Previous
      </button>
      <span className="px-4 py-2 mx-1 bg-blue-500 text-white rounded-md">
        {currentPage}
      </span>
      <button
        className="px-4 py-2 mx-1 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300"
        onClick={handleNextClick}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
