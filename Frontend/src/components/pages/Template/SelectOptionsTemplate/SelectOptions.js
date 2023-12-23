import React, { useEffect, useState } from "react";
import { BACKEND_URL, BACK_END_API_DOCUMENTS } from "../../../../apis/urls";
import { patchData } from "../../../../apis/apiService";

const SelectOptionsTemplate = (props) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [colorIt, setcolorIt] = useState("bg-black");

  const options = [
    // { text: "Completed", color: "text-green-700 border border-green-500 bg-green-200 " },
    // { text: "Completed", color: "text-green-800 border border-green-200 bg-purple-200"},
    { text: "Completed", color: "text-green-800 border border-green-500  bg-[#9FE2BF] " },
    // { text: "Completed", color: "text-green-700 border border-green-500 bg-green-200 " },
    { text: "Working", color: "text-black border border-blue-500 bg-blue-200 " },
    // { text: "Working", color: "bg-blue-700 text-white border border-blue-900" },
    { text: "Publish", color: "text-indigo-700 border border-indigo-500 bg-indigo-100 " },
    // { text: "Publish", color: "bg-indigo-800 text-white border border-indigo-500 " },
    { text: "Draft", color: "text-gray-700 border border-gray-500 bg-gray-200 " },
    // { text: "Draft", color: "bg-gray-800 text-white  border border-gray-500" },
    { text: "Urgent", color: "text-red-700 border border-red-500 bg-red-100 " },
    // { text: "Urgent", color: "bg-red-800 text-white border border-red-500" },
    { text: "Pending", color: "text-yellow-700 border border-yellow-500 bg-yellow-100 " },
    // { text: "Pending", color: "bg-yellow-800 text-black border-yellow-500" },
  ];

  const updateStatus = async (id, option, TOKEN) => {
    const formData = {
      status: option,
    };
    const resp = await patchData(
      formData,
      BACKEND_URL + BACK_END_API_DOCUMENTS + "/" + id + "/",
      TOKEN
    );
  };

  const handleSelectChange = (e) => {
    const newSelectedOption = e.target.value;
    setSelectedOption(newSelectedOption);
    const selectedText = options.find((option) => option.text === newSelectedOption);
    if (selectedText) {
      setcolorIt(selectedText.color);
      updateStatus(props.id, newSelectedOption, props.TOKEN);
    }
  };

  useEffect(() => {
    const selectedText = options.find(
      (option) => option.text === props.options_selected.status
    );

    if (selectedText) {
      setcolorIt(selectedText.color);
      setSelectedOption(selectedText.text);
    }
  }, [props.options_selected.status]);

  return (
    <>
      <select
        className={`${colorIt} rounded-full text-[11px] w-[74px] h-[28px] font-semibold  text-center appearance-none`}
        value={selectedOption}
        onChange={handleSelectChange}
      >
        {options.map((option) => (
          <option key={option.text} value={option.text}>
            {option.text}
          </option>
        ))}
      </select>
    </>
  );
};

export default SelectOptionsTemplate;
