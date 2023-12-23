import React from "react";

const TopBar = () => {
  return (
    <>
      <div className="flex justify-center flex-col items-center">
        <h1 className="text-xl text-[#414357] mb-2.5 font-sans font-bold">
          Welcome to uffai.com!
        </h1>
        <p className="text-[13px] text-center max-w-[250px] mx-auto text-[#A0A1AB]">
          Help us calculate your experience by telling us a bit yourself and
          goals
        </p>
      </div>
    </>
  );
};

export default TopBar;
