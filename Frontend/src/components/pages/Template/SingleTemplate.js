import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  BACKEND_URL,
  BACK_API_HISTORY,
  BACK_API_LANG,
  BACK_END_API_INNER_TEMPLATE,
  BACK_END_API_RESPONSE,
  BACK_END_API_SELECT_FIELD,
  BACK_END_API_GET_CUSTOM_TEMPLATE,
  BACK_END_API_EXAMPLE_VALUE,
} from "../../../apis/urls";
import { NavIcons, SealCheck } from "../../Icons";
import { fetchData, postData } from "../../../apis/apiService";
import { IoMdArrowBack } from "react-icons/io";
import { AiOutlineArrowRight } from "react-icons/ai";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import LoadingPage from "../../LoadingPage";
import toast, { Toaster } from "react-hot-toast";

import RenderHtml from "./RenderHtml";
import RenderTemplate from "./RenderTemplate";
import BouncingDotsLoader from "../../BouncingDotsLoader";
import axios from "axios";
import ResponseTemplate from "./ResponseTemplate";
import { useSelector, useDispatch } from "react-redux";
import { _save_details_ } from "../../../features/Subscriptions";
import TooltipInfo from "../../Icons/TooltipInfo";

import SelectOptionsTemplate from "./SelectOptionsTemplate/SelectOptions";
import { setDocumentTitle } from '../../NavBar/DynamicTitle';

const SingleTemplate = ({ AUTH_TOKEN }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  let upgrade_plan={restrict_user: true, customer_stripe_id: 'null', email: 'null', subscription_type: 'null', status: 'trial'}


  const [TemplateData, setTemplateData] = useState(null);
  const [TemplateDataInputFields, setTemplateDataInputFields] = useState([]);
  const [TemplateResponseData, setTemplateResponseData] = useState(null);

  const [ProjectId, setProjectId] = useState(null);

  // const [Inputlanguage,setInputlanguage] = useState([]);

  const [languageOptions, setLanguageOptions] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const [Outputlanguage, setOutputlanguage] = useState([]);
  const [OutputlanguageChoice, setOutputlanguageChoice] = useState("English");

  // const [inputs, setInputs] = useState([]);
  const [inputs, setInputs] = useState([{ key: "", value: "" }]);



  const [multipleInputForms, setMultipleInputForms] = useState({});

  const [ShowHideHistory, setShowHideHistory] = useState(false);

  const [history_answer, set_history_answer] = useState(null);

  const [range_of_text_from_browser, setrange_of_text_from_browser] = useState(0);

  const [ContentOutputNumber, setContentOutputNumber] = useState(2);

  const [LoadingButton, setLoadingButton] = useState(false);

  const location = useLocation();

  let ChosenWorkspaceId = useSelector(
    (state) => state.SetChosenWorkspaceId.ChosenWorkspaceId
    );


  let DarkMode = useSelector((state)=>state.SetDarkMode.DarkMode)

  useEffect(() => {
    setDocumentTitle("Template");
  }, []);


  const { template_id } = useParams();

  const searchParams = new URLSearchParams(location.search);
  const custom = searchParams.get('custom');

  // console.log("custom : ",custom)

  const notifyerror = (message) => toast.error(message);
  const notifysucces = (message) => toast.success(message);


  let subscriptions_details = useSelector(
    (state) => state.SetSubscriptionsData.SubscriptionsData
  );


  const [renderKey, setRenderKey] = useState(0);

  const [fieldValues, setFieldValues] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([
    { value: "nice", label: "Nice" },
    { value: "fancy", label: "Fancy" },
    { value: "relaxed", label: "Relaxed" },
    { value: "skilled", label: "Skilled" },
    { value: "confident", label: "Confident" },
    { value: "daring", label: "Daring" },
    { value: "funny", label: "Funny" },
    { value: "persuasive", label: "Persuasive" },
    { value: "empathetic", label: "Empathetic" },
  ]);
  const [value, setValue] = useState(null);

  const handleInputChange = (event, index) => {
    const { name, value } = event.target;
    const truncatedValue = value.slice(
      0,
      TemplateData[0]["template_fields"][index].range_of_text
    );
    const updatedFieldValues = [...fieldValues];
    updatedFieldValues[index] = {
      ...updatedFieldValues[index],
      name,
      value: truncatedValue,
    };

    if (value === "") {
      updatedFieldValues[index].value = " ";
    }

    setFieldValues(updatedFieldValues);
  };

  const get_inner_template_data = async (url, token) => {
    const resp = await fetchData(url, token);
    if (resp.status === 200) {
      setTemplateData(resp.data);
    } else {
      navigate("/templates");
    }
  };

  useEffect(() => {
    if(custom=="user"){
      get_inner_template_data(
        BACKEND_URL + BACK_END_API_GET_CUSTOM_TEMPLATE+ template_id,
        AUTH_TOKEN
      );
    }else{
      get_inner_template_data(
        BACKEND_URL + BACK_END_API_INNER_TEMPLATE + template_id,
        AUTH_TOKEN
      );
    }
  }, []);



  const handleClick = async (id_of_template) => {
    const divElement = document.getElementById(id_of_template);
    const inputElements = divElement.getElementsByTagName("input");
    const textareaElements = divElement.getElementsByTagName("textarea");

    const elements = [...inputElements, ...textareaElements];

    const formData = Array.from(elements).reduce((data, element) => {
      data[element.name] = element.value;
      return data;
    }, {});
    let isFormDataValid = true;
    formData["language"] =
    "Generate whole text in " + OutputlanguageChoice + " Language";
    formData["output_results"] = ContentOutputNumber.toString();
    formData["generate"] = TemplateData[0]["title"];
    formData["ids"] = TemplateData[0]["id"];
    formData["workspace_id"] = ChosenWorkspaceId["Workspace_Id"];
    
    const keyToCheck = /^(?!.*[Tt]one)(?!.*features).*$/;
    
    // return true
    for (const [key, value] of Object.entries(formData)) {
      if (key === "") {
        delete formData[key];
      }
    }
  
    Object.entries(formData).forEach(([key, value_d]) => {
      if (key.match(keyToCheck)) {
        // Case-sensitive match
        if (value_d.trim() === "") {
          notifyerror(`Value for ${key} is empty.`);
          isFormDataValid = false;
        }
      }
    });

    // if (inputs.length > 0) {
    //   formData["inputs"] = inputs;
    // }

    // Object.entries(formData).forEach(([key, value__d]) => {
    //   const trimmedValue__d = value__d.trim();
    //   if (trimmedValue__d === "") {
    //     delete formData[key]; // Remove the key from formData
    //   }
    // });

    if (value != null) {
      formData["tone"] = value.value;
    }

    const key_feature = inputs;
    if (
      key_feature.length === 1 &&
      key_feature[0].key === "" &&
      key_feature[0].value === ""
    ) {} else {
      if(Object.keys(key_feature).length != 0){
        formData["key_feature"] = key_feature;
      }
    }

    if (isFormDataValid) {
      setLoadingButton(true);
      let res_of_template = await postData(
        formData,
        BACKEND_URL + BACK_END_API_RESPONSE,
        AUTH_TOKEN
      );
      if (res_of_template.status == 200) {
        if(res_of_template.data.data[0]["content"]=="upgrade your plan"){
          navigate("/settings/subscription_plan?message=upgrade")
        }
        if(res_of_template.data.data[0]["content"]=="To use Premium you need to upgrade your plan"){
          notifysucces(res_of_template.data.data[0]["content"])
        }
        setTemplateResponseData(res_of_template.data.data);
        setProjectId(res_of_template.data.project_id);
        setLoadingButton(false);

      } else {
        notifyerror("Try again");
        setLoadingButton(false);
      }
    }
  };

  //   useEffect(() => {
  //     console.log(TemplateResponseData);
  //     console.log(ProjectId);
  //   }, [ProjectId]);

  const get_history = async (template_id) => {
    if(template_id!=null){
      if(ChosenWorkspaceId!=null){
        const resp = await fetchData(BACKEND_URL + BACK_API_HISTORY+"/"+template_id+"?workspace_id="+ChosenWorkspaceId["Workspace_Id"], AUTH_TOKEN);
        if ((resp.status = 200)) {
          set_history_answer(resp.data);
        }
    }
    }
  };

  useEffect(() => {
    if (TemplateData != null) {
      if (
        TemplateData &&
        TemplateData.length > 0 &&
        TemplateData[0]["template_fields"]
      ) {
        if (TemplateData[0]["template_fields"].length > 0) {
          // console.log("good")
        } else {
          navigate("/templates");
        }
      }
    }
    get_history(template_id);
  }, [TemplateData]);

  // useEffect(()=>{
  //     console.log(TemplateDataInputFields)
  // },[TemplateDataInputFields])

  const get_language = async () => {
    const resp = await fetchData(BACKEND_URL + BACK_API_LANG, AUTH_TOKEN);

    if (resp.status == 200) {
      // setInputlanguage(resp.data)
      setOutputlanguage(resp.data);

      setLanguageOptions(resp.data);
      setSelectedLanguage(resp.data[0].value);
      setOutputlanguageChoice(resp.data[0].value);
    } else {
      navigate("/logout");
    }
  };

  useEffect(() => {
    get_language();
  }, []);

  const handleMultipleInputChange = (event, index, key) => {
    const newInputs = [...inputs];
    newInputs[index] = { key, value: event.target.value };
    setInputs(newInputs);
  };

  const handleMultipleInputDelete = (index) => {
    const newInputs = [...inputs];
    newInputs.splice(index, 1);
    setInputs(newInputs);
  };

  const handleAdd = () => {
    setInputs([...inputs, ""]);
  };

  const handleInputLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };
  const handleOutputLanguageChange = (event) => {
    setOutputlanguageChoice(event.target.value);
  };

  const displayText = (index) => {
    if (index === 0) {
      return "Tell us first key word";
    } else if (index === 1) {
      return "Tell us second key word";
    } else if (index === 2) {
      return "One last word";
    } else if (index === 3) {
      return "isn't that enough";
    } else if (index === 4) {
      return "ok that's quite heck of feature";
    } else {
      return "...";
    }
  };

  const createOption = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  });

  const handleCreate = (inputValue) => {
    setIsLoading(true);
    setTimeout(() => {
      const newOption = createOption(inputValue);
      setIsLoading(false);
      setOptions((prev) => [newOption, ...prev]);
      setValue(newOption);
    }, 1000);
  };

  const get_select_fields = async () => {
    const resp = await fetchData(
      BACKEND_URL + BACK_END_API_SELECT_FIELD,
      AUTH_TOKEN
    );
    if (resp.status == 200) {
      const newData = resp.data.map((item) => createOption(item.label));
      setOptions((prevOptions) => [...newData, ...prevOptions]);
    }
  };
  useEffect(() => {
    get_select_fields();
  }, []);

  const save_select_fields = async (value_data) => {
    const formData = {
      value: value_data,
    };
    const resp = await postData(
      formData,
      BACKEND_URL + BACK_END_API_SELECT_FIELD,
      AUTH_TOKEN
    );
  };
  useEffect(() => {
    // console.log("options : ", options[0]["value"]);
    save_select_fields(options[0]["value"]);
  }, [options]);



// =======Get the example value============

const get_example_value_api = async() =>{
  const resp = await fetchData(BACKEND_URL+BACK_END_API_EXAMPLE_VALUE+template_id,AUTH_TOKEN)
  if(resp.status==200){
    setInputs(resp.data)
  }
}

useEffect(()=>{
  if(custom=='user'){
    get_example_value_api()  
  }
},[])




  return (
    <>
      <div className="relative lg:-m-6">

        {TemplateData && (
          <>
            <div className="flex flex-col lg:flex-row lg:max-h-[calc(100vh-75px)] bg-white">



              <div className="lg:w-1/2 flex flex-col max-h-full bg-blue-900">

                 

                <div className="dark:bg-black dark:text-gray-200 dark:border-slate-500 z-10 sticky top-[74px] flex px-6 py-4 bg-white border-b border-border">
                  
                  <div className="w-10 h-10">

                    <button
                        onClick={() => {
                          navigate("/templates");
                        }}
                        className="z-20 top-9 dark:bg-black dark:text-gray-200 left-[280px] w-8 h-8 flex bg-white items-center justify-center text-black font-bold rounded"
                      >
                        <IoMdArrowBack />
                      </button>

                    <img
                      className="w-full h-full object-contain"
                      src={TemplateData[0].icon}
                    />
                  </div>
                  <div className="flex-1 pl-6">
                    <h1 className="font-bold text-xl">
                      {TemplateData[0].title}
                    </h1>
                    <p className="text-sm">{TemplateData[0].description}</p>
                  </div>
                </div>

                <div className="dark:bg-black dark:text-gray-200 dark:border-slate-500 grow p-3 xl:p-6 xl:pb-28 flex-1 space-y-6 xl:overflow-y-auto">
                  <div id={TemplateData[0]["id"]}>
                    {TemplateData[0]["template_fields"].map((data, index) => {
                      const textLength = fieldValues[index]?.value?.length || 0;

                      return (
                        (data.component === "textarea" && (
                          <div className="last:mb-1 relative" key={index}>
                            <div className="space-y-1.5 w-full">
                              <label
                                htmlFor="form-field-productInfo"
                                className=" text-sm font-medium block text-gray-900 placeholder:text-gray-400 transition-[color] duration-150 ease-in-out"
                              >
                                <span className="flex items-center space-x-1 dark:text-white ">
                                  <span>{data.label}</span>
                                </span>
                              </label>
                              <div className="dark:bg-gray-800 dark:text-gray-200 py-2.5 relative gap-2 bg-white w-full px-3 rounded-lg ring-1 hover:ring-2 transition-all duration-150 ease-in-out ring-gray-200 outline-none focus-within:!ring-1">
                                <textarea
                                  id="form-field-productInfo"
                                  className="dark:bg-gray-800 dark:text-gray-200 block w-full h-[300px] text-gray-900 placeholder:text-gray-400 text-sm font-normal resize-none outline-none max-h-64 overflow-y-auto"
                                  maxLength={data.range_of_text}
                                  name={data.title}
                                  placeholder={data.placeholder}
                                  value={
                                    fieldValues[index]?.value ||
                                    data.pre_define_value ||
                                    ""
                                  }
                                  onChange={(event) =>
                                    handleInputChange(event, index)
                                  }
                                ></textarea>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="ml-auto text-xs text-gray-500 transition-[color] duration-150 ease-in-out">
                                  {textLength}/{data.range_of_text}
                                </span>
                              </div>
                            </div>
                          </div>
                        )) ||
                        (data.component === "text" && (
                          <div className="space-y-1.5 w-full" key={index}>
                            <label
                              htmlFor="form-field-productName"
                              className="text-sm font-medium block text-gray-900 placeholder:text-gray-400 transition-[color] duration-150 ease-in-out"
                            >
                              <span className="flex items-center space-x-1 dark:text-white">
                                <span>{data.label}</span>
                              </span>
                            </label>
                            <div className="dark:bg-gray-800 dark:text-gray-200 py-1 flex items-center gap-2 bg-white w-full px-3 rounded-lg ring-1 hover:ring-2 transition-all duration-150 ease-in-out ring-gray-200 outline-none focus-within:!ring-1">
                              <div className="dark:bg-gray-800 dark:text-gray-200 flex items-center grow gap-2 py-1.5">
                                <div className="dark:bg-gray-800 dark:text-gray-200 flex gap-1 grow">
                                  <input
                                    className="dark:bg-gray-800 dark:text-gray-200 block w-full text-gray-900 placeholder:text-gray-400 text-sm font-normal resize-none outline-none"
                                    maxLength={data.range_of_text}
                                    name={data.title}
                                    type={data.component}
                                    placeholder={data.placeholder}
                                    value={
                                      fieldValues[index]?.value ||
                                      data.pre_define_value ||
                                      ""
                                    }
                                    onChange={(event) =>
                                      handleInputChange(event, index)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="ml-auto text-xs text-gray-500 transition-[color] duration-150 ease-in-out">
                                {textLength}/{data.range_of_text}
                              </span>
                            </div>
                          </div>
                        )) ||
                        (data.component === "Example" && (
                          <>
                            <div className="mt-3">
                              <label
                                htmlFor="form-field-productInfo"
                                className="text-sm font-medium block text-gray-900 placeholder:text-gray-400 transition-[color] duration-150 ease-in-out"
                              >
                                <span className="flex items-center space-x-1">
                                  <span className="dark:text-gray-300">Example</span>
                                </span>
                              </label>
                            </div>
                            <div className=" flex justify-between flex-col space-y-2 key={index_inner}">
                              {inputs.map((input, index_inner) => (
                                <div
                                  className=" flex justify-between flex-col space-y-2"
                                  key={index_inner}
                                >
                                  <div className=" flex items-center justify-between space-x-2">
                                    <div className="bg-gray-300/20 dark:text-white text-gray-500 font-bold text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                      {index_inner + 1}
                                    </div>
                                    <div className="dark:bg-gray-800 dark:text-gray-200 space-y-1.5 w-full">
                                      <div className="dark:bg-gray-800 dark:text-gray-200 py-1 !mt-0 flex items-center gap-2 bg-white w-full px-3 rounded-lg ring-1 hover:ring-2 transition-all duration-150 ease-in-out ring-gray-200 outline-none focus-within:!ring-1">
                                        <div className="dark:bg-gray-800 dark:text-gray-200 flex items-center grow gap-2 py-1.5">
                                          <div className="dark:bg-gray-800 dark:text-gray-200 flex gap-1 grow">
                                            <input
                                              id={`example-${index_inner + 1}`}
                                              type="text"
                                              className="dark:bg-gray-800 dark:text-gray-200 block w-full text-gray-900 placeholder:text-gray-400 text-sm font-normal resize-none outline-none"
                                              placeholder={displayText(
                                                index_inner
                                              )}
                                              value={input.value}
                                              onChange={(event) =>
                                                handleMultipleInputChange(
                                                  event,
                                                  index_inner,
                                                  `key_${index_inner + 1}`
                                                )
                                              }
                                              // id={`example-${index_inner + 1}`}
                                              // type="text"
                                              // className="block w-full text-gray-900 placeholder:text-gray-400 text-sm font-normal resize-none outline-none"
                                              // placeholder={displayText(
                                              //   index_inner
                                              // )}
                                              // value={input.value}
                                              // onChange={(event) =>
                                              //   handleMultipleInputChange(
                                              //     event,
                                              //     index_inner
                                              //   )
                                              // }
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Delete button */}
                                    <button
                                      type="button"
                                      className="dark:bg-gray-800 dark:text-gray-200 transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-700 selectionRing active:bg-gray-100 active:text-gray-700"
                                      onClick={() =>
                                        handleMultipleInputDelete(index_inner)
                                      }
                                    >
                                      <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                          aria-hidden="true"
                                          className="w-3"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                          ></path>
                                        </svg>
                                      </span>
                                    </button>
                                  </div>
                                </div>
                              ))}
      

                              {/* + button */}
                              <span className="self-end">
                                <button
                                  type="button"
                                  className="dark:bg-gray-800 dark:text-gray-200 transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-2 active:ring-1"
                                  // onClick={handleAdd}
                                  onClick={() => setInputs([...inputs, { key: "", value: "" }])}
                                >
                                  +
                                </button>
                              </span>

                              {/* Submit button */}
                              {/* <button
                                                type="button"
                                                className="transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-700 selectionRing active:bg-gray-100 active:text-gray-700"
                                                onClick={handleSubmit}
                                            >
                                                save
                                            </button> */}
                            </div>
                          </>
                        )) ||
                        (data.component === "select" && (
                          <>
                            <div>
                              <label
                                htmlFor="form-field-productInfo"
                                className="text-sm font-medium block text-gray-900 placeholder:text-gray-400 transition-[color] duration-150 ease-in-out"
                              >
                                <span className="flex items-center space-x-1">
                                  <span className="text-white">{data.label}</span>
                                </span>
                              </label>
                            </div>
                            {DarkMode==true
                            ?
                            <>
                                <div className="dark:bg-gray-800 dark:text-black flex justify-between flex-col space-y-2 key={index_inner} mt-3">
                                    <CreatableSelect
                                      isClearable
                                      isDisabled={isLoading}
                                      isLoading={isLoading}
                                      onChange ={(newValue ) => setValue(newValue)}
                                      onCreate Option ={handleCreate }
                                      options={ options }
                                        value={ value }
                                        styles={{
                                          control :  ( provided ) => ({ 
                                          ...provided, 
                                          backgroundColor:"#1f2937"}),
                                        singleValue: (provided) =>  ({
                                          ...provided,
                                          color:"white"}),
                                      }}
                                    />
                                  </div>
                              </>
                              :
                              <>
                              <div className="flex justify-between flex-col space-y-2 key={index_inner} mt-3">
                                <CreatableSelect
                                  isClearable
                                  isDisabled={isLoading}
                                  isLoading={isLoading}
                                  onChange={(newValue) => setValue(newValue)}
                                  onCreateOption={handleCreate}
                                  options={options}
                                  value={value}
                                />
                              </div>
                              </>
                            }
                          </>
                        ))
                      );
                    })}
                  </div>

                  <div className="flex flex-col border border-border p-6 rounded-md mt-[30px] mb-[50px]">
                    <div className="flex flex-col items-start md:flex-row md:justify-start md:items-center sm:flex-wrap lg:flex-nowrap">
                      <h3 className="text-sm font-medium flex items-center md:mr-3 md:mb-2">
                        <span className="md:whitespace-nowrap">
                          Language options
                        </span>{" "}
                        <TooltipInfo
                            text="Create content in your chosen language efficiently and effectively for your needs." 
                          />
                      </h3>
                    </div>
                    <div className="flex items-end justify-between gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-semibold mb-2">
                          Input language
                        </label>
                        <select
                          className="block w-full py-2 pl-3 pr-12 text-gray-700 placeholder-gray-400 transition-shadow duration-150 ease-in-out bg-white border-gray-200 rounded-md shadow-sm outline-none resize-none focus:outline-none focus:ring-blue-800 focus:border-blue-800 form-select truncate"
                          value={selectedLanguage}
                          onChange={handleInputLanguageChange}
                        >
                          {languageOptions.map((language, index) => (
                            <option value={language.value} key={index}>
                              {language.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="px-1 py-3">
                        <AiOutlineArrowRight />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-semibold mb-2">
                          Output language
                        </label>
                        <select
                          className="block w-full py-2 pl-3 pr-12 text-gray-700 placeholder-gray-400 transition-shadow duration-150 ease-in-out bg-white border-gray-200 rounded-md shadow-sm outline-none resize-none focus:outline-none focus:ring-blue-800 focus:border-blue-800 form-select truncate"
                          value={OutputlanguageChoice}
                          onChange={handleOutputLanguageChange}
                        >
                          {languageOptions.map((language, index) => (
                            <option value={language.value} key={index}>
                              {language.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  {custom=="user"
                  ?
                      null
                  :
                  <>
                  {subscriptions_details &&
                  <>
                  {subscriptions_details.user.status=='trial'
                  ?
                    <div className="flex justify-center items-center">
                      <button
                        type="submit"
                        className="w-[200px] transition-all duration-200 relative font-semibold outline-none hover:outline-none focus:outline-none rounded-lg px-4 py-2 text-base text-white bg-gradient-to-r  shadow-sm bg-[#334977]"
                        id="generateBtn1"
                        title="Upgrade plan to save custom template"
                        onClick={()=>{
                          navigate("/settings/subscription_plan")
                        }}

                      >
                      <span className="flex space-x-2 select-none">
                        <SealCheck classes="w-6 h-6 mr-2" />
                            Upgrade to Pro
                        </span>
                      </button>
                    </div>
                  :
                  <>
                      <div className="flex justify-center">
                        <button type="button"
                          className="text-slate-500  font-semibold hover:text-slate-900 dark:hover:text-slate-300"
                        onClick={()=>{
                          navigate("/custome_template/"+TemplateData[0].id+"?action=create_template&new=true")
                        }}>
                          Save this  template as custom
                        </button>
                        {subscriptions_details.user.plan=='premium'
                        ?
                          <div className="mt-2">
                            <TooltipInfo text="Your plan can create 10 templates" />
                          </div>
                        :
                          <div className="mt-2">
                            <TooltipInfo text="Your plan can create 20 templates" />
                          </div>
                        }
                      </div>
                    </>

                  }
                  </>
                  }
                  </>
                  }
                </div>
                 
                <div className="pointer-events-none xl:bottom-0 xl:sticky xl:w-full xl:left-0 xl:z-20 @container">
                  <div className="dark:bg-black dark:text-gray-200 dark:border-slate-500 flex flex-row items-center justify-between p-3 border-b border-gray-200 pointer-events-auto bg-gray-50 xl:bg-white xl:border-t xl:border-0 xl:border-gray-200 xl:py-3 xl:px-6">
                    {/* <button type="button" className="transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-2 active:ring-1"> */}
                    <button
                      type="button"
                      className="transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm  hover:ring-2 active:ring-1"
                    >
                      <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                        <span className="hidden @sm:inline-block text-black">
                          Clear inputs
                        </span>
                      </span>
                    </button>
                    <div className="flex ">
                      <input
                        type="number"
                        className="mr-2 w-[70px] border border-gray-300 rounded-md py-2 px-4 pr-2 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        defaultValue={ContentOutputNumber}
                        onChange={(e) => {
                          if(ContentOutputNumber>10){
                            return true
                          }
                          setContentOutputNumber(e.target.value);
                        }}
                        max={10}
                        min={1}
                      />
                      <button
                        type="submit"
                        className="w-[200px] transition-all duration-200 relative font-semibold outline-none hover:outline-none focus:outline-none rounded-lg px-4 py-2 text-base text-white bg-gradient-to-r  shadow-sm bg-[#334977]"
                        id="generateBtn1"
                        onClick={() => {
                          handleClick(TemplateData[0]["id"]);
                          setTemplateResponseData(null);
                        }}
                      >
                        <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                          {LoadingButton ? (
                            <>
                              <svg
                                aria-hidden="true"
                                role="status"
                                className="inline w-4 h-4 mr-3 text-white animate-spin"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                  fill="#E5E7EB"
                                />
                                <path
                                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                  fill="currentColor"
                                />
                              </svg>
                              Generating
                            </>
                          ) : (
                            "Generate"
                          )}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dark:bg-black dark:text-gray-200 dark:border-slate-500 lg:w-1/2 items-center justify-center max-h-full bg-[#eff2f9] font-semibold text-[17px] text-black border-l border-gray-300 overflow-y-auto">
                <div className="dark:bg-black dark:text-gray-200 dark:border-slate-500 sticky top-0 flex items-center px-3 bg-white border-b border-gray-200">
                  <nav
                    className="flex flex-grow py-1 space-x-3"
                    aria-label="Tabs"
                  >
                    <button
                      className="dark:bg-gray-700 dark:text-gray-200  relative whitespace-nowrap py-2 px-3 text-xs font-medium bg-gray-100 rounded-lg text-black transition-all duration-150 hover:text-black"
                      onClick={() => {
                        get_history(template_id);
                        setShowHideHistory(false);
                        // setTemplateResponseData(null)
                      }}
                    >
                      <span className="relative">
                        New outputs {ContentOutputNumber.toString()}
                      </span>
                    </button>
                    <button
                      className="dark:bg-gray-700 dark:text-gray-200 relative whitespace-nowrap py-2 px-3 text-xs font-medium bg-gray-100 rounded-lg text-black transition-all duration-150 hover:text-black"
                      onClick={() => {
                        get_history(template_id);
                        setShowHideHistory(true);
                        // setTemplateResponseData(null)
                      }}
                    >
                      <span className="relative">History</span>
                    </button>
                  </nav>
                  <div>
                    <button
                      className="relative whitespace-nowrap px-3 py-2 text-xs font-medium leading-4 text-black-400 transition-all duration-150 hover:text-gray-600"
                      onClick={() => {
                        setTemplateResponseData(null);
                      }}
                    >
                      <span className="relative">Clear</span>
                    </button>
                  </div>
                </div>

                {ShowHideHistory ? (
                  history_answer ? (
                    history_answer.map((data, index) => {
                      return (
                        <div key={index}>
                          <ResponseTemplate
                            r_id={data["id"]}
                            r_time={data["created_at"]}
                            r_data={data["answer_response"]}
                            r_custome={custom=="user"?"user":"normal_user"}
                          />
                        </div>
                      );
                    })
                  ) : (
                    <LoadingPage />
                  )
                ) : TemplateResponseData ? (
                  TemplateResponseData.map((data, index) => {
                    return (
                      <div key={index}>
                        <ResponseTemplate
                          r_time={data["created_at"]}
                          r_data={data["content"]}
                        />
                      </div>
                    );
                  })
                ) : LoadingButton ? (
                  <>
                    <div className="mt-3 flex flex-col items-center justify-center">
                      <div>
                        <p>Generating content ...</p>
                      </div>
                      <div className="mt-3">
                        <BouncingDotsLoader />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="mt-[25%] w-[400px] ml-[20%] max-w-lg relative py-3 pl-8 space-x-2 text-xs text-gray-400 rounded-md ring-1 ring-gray-200">
                    <div className="absolute inset-y-0 left-0 flex items-center justify-center w-8 bg-gray-100 rounded-l-md">
                      <svg
                        className="w-10 h-"
                        xmlns="http://www.w3.org/2000/svg"
                        data-name="Layer 1"
                        viewBox="0 0 100 125"
                        x="0px"
                        y="0px"
                      >
                        <path d="M48.68,62.5A6.27,6.27,0,0,1,54,57.17c4-.56,9.89-1.49,18.55-3C63.9,52.69,58,51.77,54,51.2a6.26,6.26,0,0,1-5.33-5.33c-.57-4-1.5-9.9-3-18.56-1.49,8.66-2.42,14.56-3,18.56a6.26,6.26,0,0,1-5.32,5.33c-4,.57-9.9,1.49-18.56,3,8.66,1.49,14.55,2.42,18.56,3A6.27,6.27,0,0,1,42.7,62.5c.57,4,1.5,9.9,3,18.56C47.18,72.4,48.11,66.5,48.68,62.5Z" />
                        <path d="M67.91,38.49a3.49,3.49,0,0,1,3-3c2.22-.31,5.5-.83,10.31-1.66-4.81-.83-8.09-1.34-10.31-1.66a3.48,3.48,0,0,1-3-3c-.32-2.22-.83-5.5-1.66-10.31-.83,4.81-1.35,8.09-1.66,10.31a3.48,3.48,0,0,1-3,3c-2.22.32-5.5.83-10.31,1.66,4.81.83,8.09,1.35,10.31,1.66a3.49,3.49,0,0,1,3,3c.31,2.23.83,5.5,1.66,10.31C67.08,44,67.59,40.72,67.91,38.49Z" />
                        <path d="M58.33,72.86a1.46,1.46,0,0,1,1.25-1.24c.94-.14,2.32-.35,4.34-.7-2-.35-3.4-.57-4.34-.7A1.46,1.46,0,0,1,58.33,69c-.13-.93-.35-2.31-.7-4.34-.34,2-.56,3.41-.69,4.34a1.47,1.47,0,0,1-1.25,1.25c-.94.13-2.32.35-4.34.7,2,.35,3.4.56,4.34.7a1.47,1.47,0,0,1,1.25,1.24c.13.94.35,2.32.69,4.34C58,75.18,58.2,73.8,58.33,72.86Z" />
                        <path d="M31.75,42.1A1.46,1.46,0,0,1,33,40.86c.94-.14,2.31-.35,4.34-.7-2-.35-3.4-.57-4.34-.7a1.46,1.46,0,0,1-1.25-1.25c-.13-.93-.35-2.31-.7-4.34-.35,2-.56,3.41-.7,4.34a1.45,1.45,0,0,1-1.24,1.25c-.94.13-2.32.35-4.34.7,2,.35,3.4.56,4.34.7a1.45,1.45,0,0,1,1.24,1.24c.14.94.35,2.32.7,4.35C31.4,44.42,31.62,43,31.75,42.1Z" />
                      </svg>
                    </div>
                    <div className="flex-grow pl-2 pr-4 text-left">
                      <div className="mb-1 text-sm font-medium text-gray-500">
                        Respond to the prompts
                      </div>
                      <div>
                        Achieve optimal outcomes by experimenting with various
                        inputs of different lengths
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Toaster />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SingleTemplate;
