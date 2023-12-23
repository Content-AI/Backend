import React, { useEffect, useState } from 'react';

const DateConverter = ({ inputDate }) => {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const convertDate = () => {
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      const parsedDate = new Date(inputDate);
      const formattedDate = parsedDate.toLocaleDateString('en-US', options);
      setFormattedDate(formattedDate);
    };

    convertDate();
  }, [inputDate]);

  return (
    <>
    {formattedDate}
    </>
  );
};

export default DateConverter;
