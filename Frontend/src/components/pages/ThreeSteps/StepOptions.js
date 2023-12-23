import clsx from "clsx";

const StepOptions = ({
  data,
  activeData,
  toggleData,
  activeText,
  toggleText,
}) => {
  return (
    <>
      {data.map((item, index) => {
        return (
          <div
            key={index}
            className="relative flex items-center gap-x-2.5 pl-12 pr-4 py-3 h-[40px] bg-blue/10  rounded cursor-pointer select-none"
            onClick={() => {
              toggleData(item);
            }}
          >
            <span
              className={clsx(
                "absolute top-1/2 left-5 -translate-y-1/2 w-3.5 h-3.5 rounded-full border outline outline-2 outline-offset-2 outline-blue/50 duration-300",
                { "bg-blue !outline-blue": activeData === item }
              )}
            ></span>
            <span className="text-blue text-[13px] font-bold">{item}</span>
            {item.toLowerCase() === "other" && (
              <input
                className="block px-4 py-2 h-8  text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                type="text"
                maxLength="20"
                defaultValue={activeText}
                onChange={(e) => toggleText(e.target.value)}
              />
            )}
          </div>
        );
      })}
    </>
  );
};

export default StepOptions;
