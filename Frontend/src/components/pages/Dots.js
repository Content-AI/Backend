import React from "react";

const Dots = ({ steps }) => {
  return (
    <div className="flex justify-center items-center gap-2">
      {steps == "first" ? (
        <>
          <button className="rounded-full w-8 h-[5px] bg-blue-500 border-none cursor-pointer"></button>
          <button className="rounded-full w-8 h-[5px] bg-[#CFD0D5] border-none cursor-pointer"></button>
          <button className="rounded-full w-8 h-[5px] bg-[#CFD0D5] border-none cursor-pointer"></button>
        </>
      ) : null}
      {steps == "second" ? (
        <>
          <button className="rounded-full w-8 h-[5px] bg-[#CFD0D5] border-none cursor-pointer"></button>
          <button className="rounded-full w-8 h-[5px] bg-blue-500 border-none cursor-pointer"></button>
          <button className="rounded-full w-8 h-[5px] bg-[#CFD0D5] border-none cursor-pointer"></button>
        </>
      ) : null}
      {steps == "third" ? (
        <>
          <button className="rounded-full w-8 h-[5px] bg-[#CFD0D5] border-none cursor-pointer"></button>
          <button className="rounded-full w-8 h-[5px] bg-[#CFD0D5] border-none cursor-pointer"></button>
          <button className="rounded-full w-8 h-[5px] bg-blue-500 border-none cursor-pointer"></button>
        </>
      ) : null}
    </div>
  );
};

export default Dots;
