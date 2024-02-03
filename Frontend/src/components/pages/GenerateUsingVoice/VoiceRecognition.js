import React, { useEffect, useState, useRef } from "react";
import SpeechRecognition, {
    useSpeechRecognition
  } from "react-speech-recognition";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";

import { BsFillMicFill } from 'react-icons/bs';
import { BsFillMicMuteFill } from 'react-icons/bs';

import {
  BACKEND_URL,
  BACK_END_API_HISTORY_AUDIO_VIDEO,
  BACK_API_LANG,
  BACK_END_API_TRANSCRIBE_SPEECH,
  BACK_END_API_HISTORY_TRANSCRIBE,
} from "../../../apis/urls";
import { AiOutlineArrowRight } from "react-icons/ai";
import { fetchData, postData,fileFormData } from "../../../apis/apiService";
import { IoMdArrowBack } from "react-icons/io";

import { useNavigate } from "react-router-dom";
import LoadingPage from "../../LoadingPage";
import toast, { Toaster } from "react-hot-toast";

import BouncingDotsLoader from "../../BouncingDotsLoader";
import { useSelector, useDispatch } from "react-redux";
import { _save_details_ } from "../../../features/Subscriptions";
import TooltipInfo from "../../Icons/TooltipInfo";

import ResponseTemplate from "../Template/ResponseTemplate";
import CreatableSelect from "react-select/creatable";
import { NavIcons, SealCheck } from "../../Icons";

import { setDocumentTitle } from '../../NavBar/DynamicTitle';


const VoiceRecognition = ({ AUTH_TOKEN }) => {
  const navigate = useNavigate();

  useEffect(() => {
    setDocumentTitle("Transcribe speech");
  });

  const [selectedTab, setSelectedTab] = useState("url"); // Track the selected tab
  const [ShowHideHistory, setShowHideHistory] = useState(false);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [Outputlanguage, setOutputlanguage] = useState([]);
  const [OutputlanguageChoice, setOutputlanguageChoice] = useState("English");
  


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

  let upgrade_plan={restrict_user: true, customer_stripe_id: 'null', email: 'null', subscription_type: 'null', status: 'trial'}

  const handleInputLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };
  const handleOutputLanguageChange = (event) => {
    setOutputlanguageChoice(event.target.value);
  };


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



  const [LoadingButton, setLoadingButton] = useState(false);

  const location = useLocation();


  let subscriptions_details = useSelector(
    (state) => state.SetSubscriptionsData.SubscriptionsData
  );


  const searchParams = new URLSearchParams(location.search);
  const custom = searchParams.get('custom');


  const notifyerror = (message) => toast.error(message);
  const notifysucces = (message) => toast.success(message);


  // const [listening, setListening] = useState(false);
  // const { transcript, resetTranscript } = useSpeechRecognition();

  // const startListening = () => {
  //   SpeechRecognition.startListening();
  //   setListening(true);
  // };

  // const stopListening = () => {
  //   SpeechRecognition.stopListening();
  //   setListening(false);
  // };



  const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = "en-US";



const [isListening, setIsListening] = useState(false);
const [note, setNote] = useState(null);

useEffect(() => {
  if(isListening==false){
    setNote("")
    mic.stop()
  }
  if(isListening==true){
    handleListen();
  }
},[isListening]);

const handleListen = () => {
  console.log(isListening)
  if (isListening) {
    mic.start();
  } else {
    mic.stop();
  }
  mic.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join("");
    setNote(transcript);
    mic.onerror = (event) => {
      console.log(event.error);
    };
  };
};

useEffect(()=>{
  if(isListening){
    setstatement_of_user(note)
  }
})



// =======generate image=========

  const [summarize_text, setsummarize_text] = useState([]);
  const [GeneratingSummarize, setGeneratingSummarize] = useState(false);
  const [statement_of_user,setstatement_of_user]=useState('')


const get_summarize = async() =>{
    
    if(statement_of_user.length<=0){
        notifyerror("Say somethings ..")
        return;
    }

    setLoadingButton(true)
    setGeneratingSummarize(true)
    
    const formData = {
        transcribe_data:statement_of_user,
        language:OutputlanguageChoice,
        tone:value?value.value:"Default"
    }
    const resp = await postData(formData,BACKEND_URL+BACK_END_API_TRANSCRIBE_SPEECH,AUTH_TOKEN)
    if(resp.status==200){
        setsummarize_text(resp.data)
        setLoadingButton(false)
        setGeneratingSummarize(false)
    }else{
        notifyerror(resp.response.data.message)
        setLoadingButton(false)
        setGeneratingSummarize(false)    
    }
}


  // ======get the history====

  const [history_data,set_history_data]=useState(null)

  const get_history = async() =>{
      const resp = await fetchData(BACKEND_URL+BACK_END_API_HISTORY_TRANSCRIBE,AUTH_TOKEN)
      if(resp.status==200){
        set_history_data(resp.data)
      }
  }

  
  // useEffect(()=>{
  //   if(listening){setstatement_of_user(transcript)}
  // })


  return (
    <>
      <div className="relative lg:-m-6">
          <>
            <div className="flex flex-col lg:flex-row h-[100vh]">
              <div className="lg:w-1/2 flex flex-col max-h-full bg-blue-900">
                <div className="dark:bg-black dark:text-gray-200 dark:border-slate-500 z-10 sticky top-[74px] flex px-6 py-4 bg-white border-b border-border">
                  <div className="w-10 h-10">
                      <button
                        onClick={() => {
                          navigate("/create_new_content");
                        }}
                        // className="z-20 fixed top-7 left-[280px] w-8 h-8 flex items-center justify-center text-black font-bold rounded"
                        className="dark:bg-black dark:text-white z-20 top-9  left-[280px] w-8 h-8 flex bg-white items-center justify-center text-black font-bold rounded"
                      >
                        <IoMdArrowBack />
                      </button>
                    <img
                      className="w-full h-full object-contain rounded-full"
                      src="https://uffiafilestorage.s3.amazonaws.com/icons/Screenshot+2023-10-01+at+10.40.56+AM.png"
                    />
                  </div>
                  <div className="flex-1 pl-6">
                    <h1 className="font-bold text-xl">
                        Transcribe speech
                    </h1>
                    <p className="text-sm">Convert your spoken words into written text effortlessly, transforming your voice into clear and precise written content.</p>
                  </div>

                  <div className="mt-6">
                        {subscriptions_details &&
                            <>
                            <TooltipInfo
                                text={"Generate text with your voice command"}
                            />
                            </>
                            }
                        </div>

                </div>

                <div className="dark:bg-black dark:text-gray-200 dark:border-slate-500 grow p-3 xl:p-6 xl:pb-28 flex-1 space-y-6 xl:overflow-y-auto">
                    <div>

                        <div className="voice-recognition-container">
                            <div className="mt-4">
                                <p className="dark:text-white text-sm font-bold ml-3">
                                  Transcribe speech
                                </p>
                            </div>
                            <div className="flex mt-4">
                                <button
                                    onClick={() => {
                                      if(isListening==true){
                                        setIsListening(false)
                                      }else{
                                        setIsListening(true)
                                      }
                                          // setIsListening((prevState) => !prevState)
                                        }}
                                    // onClick={listening ? stopListening : startListening}
                                    className={isListening ?
                                        "mr-3 transition-all duration-200 relative font-semibold outline-none hover:outline-none focus:outline-none rounded-lg px-4 py-2 text-base text-white bg-gradient-to-r  shadow-sm bg-red-500"
                                    :
                                    "dark:text-white mr-3 transition-all duration-200 relative font-semibold outline-none hover:outline-none focus:outline-none rounded-lg px-4 py-2 text-base text-white bg-gradient-to-r  shadow-sm bg-blue-500"
                                    }
                                    
                                >
                                    {
                                      isListening 
                                        ? 
                                          <BsFillMicMuteFill className="h-[23px] w-[23px]"/>
                                        :
                                          <BsFillMicFill className="h-[23px] w-[23px]"/>
                                    }
                                </button>
                                {/* <button
                                    title="Reset"
                                    className="mr-3 transition-all duration-200 relative font-semibold outline-none hover:outline-none focus:outline-none rounded-lg px-4 py-2 text-base text-white bg-gradient-to-r bg-red-400 hover:bg-red-500  shadow-sm"
                                    onClick={resetTranscript}>
                                        Reset
                                </button> */}
                            </div>
                            
                            <div className="last:mb-1 relative mt-4">
                                <div className="space-y-1.5 w-full">
                                    <label
                                    htmlFor="form-field-productInfo"
                                    className="text-sm font-medium block text-gray-900 placeholder:text-gray-400 transition-[color] duration-150 ease-in-out"
                                    >
                                    <span className="flex items-center space-x-1">
                                        <span className="dark:text-white">Your statement was</span>
                                    </span>
                                    </label>
                                    <div className="dark:bg-gray-800 py-2.5 relative gap-2 bg-white w-full px-3 rounded-lg ring-1 hover:ring-2 transition-all duration-150 ease-in-out ring-gray-200 outline-none focus-within:!ring-1">
                                    <textarea
                                       id="form-field-productInfo"
                                    className="dark:bg-gray-800 dark:text-gray-200 block w-full h-[150px] text-gray-900 placeholder:text-gray-400 text-sm font-normal resize-none outline-none max-h-64 overflow-y-auto"
                                    value={statement_of_user}
                                    maxLength="100"
                                    onChange={(event) => {
                                        // if(listening){
                                        if(isListening){
                                            notifyerror("Stop the microphone ..")
                                            return ;
                                        }
                                        const newText = event.target.value;
                                        setstatement_of_user(newText)
                                    }}
                                    ></textarea>
                                    </div>
                                </div>
                                </div>
                        </div>

                        <div>
                            <label
                            htmlFor="form-field-productInfo"
                            className="text-sm font-medium block text-gray-900 placeholder:text-gray-400 transition-[color] duration-150 ease-in-out"
                            >
                            <span className="flex items-center space-x-1">
                                <span className="dark:text-white">Tone of Voice</span>
                            </span>
                            </label>
                        </div>

                        <div className="flex justify-between flex-col space-y-2 mt-3 dark:text-black">
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
                  
                </div>



                      


                 
                <div className="pointer-events-none xl:bottom-0 xl:sticky xl:w-full xl:left-0 xl:z-20 @container">
                  <div className="dark:bg-black flex flex-row items-center justify-between p-3 border-b border-gray-200 pointer-events-auto bg-gray-50 xl:bg-white xl:border-t xl:border-0 xl:border-gray-200 xl:py-3 xl:px-6">
                    <button
                      type="button"
                      className="transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm  hover:ring-2 active:ring-1"
                      onClick={()=>{
                        setsummarize_text([])
                      }}
                    >
                      <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                        <span className="hidden @sm:inline-block text-black">
                          Clear inputs
                        </span>
                      </span>
                    </button>
                    <div className="flex ">


                      
                       
                        {subscriptions_details &&
                        <>
                          {subscriptions_details.user.status=="trial"
                          ?
                            <>
                              <button
                                type="submit"
                                className="w-[200px] transition-all duration-200 relative font-semibold outline-none hover:outline-none focus:outline-none rounded-lg px-4 py-2 text-base text-white bg-gradient-to-r  shadow-sm bg-[#334977]"
                                id="generateBtn1"
                                onClick={()=>{
                                  navigate("/settings/subscription_plan")
                                }}

                              >
                              <span className="flex space-x-2 select-none">
                                <SealCheck classes="w-6 h-6 mr-2" />
                                    Upgrade to Pro
                                </span>
                              </button>
                            </>
                          :
                              <button
                              type="submit"
                              className="w-[200px] transition-all duration-200 relative font-semibold outline-none hover:outline-none focus:outline-none rounded-lg px-4 py-2 text-base text-white bg-gradient-to-r  shadow-sm bg-[#334977]"
                              id="generateBtn1"
                              onClick={() => {
                                  get_summarize()
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
                          }
                        </>
                        }



                    </div>
                  </div>
                </div>
              </div>

              <div className="dark:bg-black dark:text-gray-200 dark:border-slate-500 lg:w-1/2 items-center justify-center max-h-full bg-white font-semibold text-[17px] text-black border-l border-gray-300 overflow-y-auto">
                <div className="dark:bg-black dark:text-gray-200 dark:border-slate-500 sticky top-0 flex items-center px-3 bg-white border-b border-gray-200">
                  <nav
                    className="flex flex-grow py-1 space-x-3"
                    aria-label="Tabs"
                  >
                    <button
                      className="dark:bg-gray-700 dark:text-white relative whitespace-nowrap py-2 px-3 text-xs font-medium bg-gray-100 rounded-lg text-black transition-all duration-150 hover:text-black"
                      onClick={() => {
                        setShowHideHistory(false);
                      }}
                    >
                      <span className="relative">
                        Outputs
                      </span>
                    </button>
                    <button
                      className="dark:bg-gray-700 dark:text-white relative whitespace-nowrap py-2 px-3 text-xs font-medium bg-gray-100 rounded-lg text-black transition-all duration-150 hover:text-black"
                      onClick={() => {
                        setShowHideHistory(true);
                        get_history()
                      }}
                    >
                      <span className="relative">History</span>
                    </button>
                  </nav>
                  <div>
                    <button
                      className="relative whitespace-nowrap px-3 py-2 text-xs font-medium leading-4 text-black-400 transition-all duration-150 hover:text-gray-600"
                      onClick={() => {
                        setsummarize_text([])
                      }}
                    >
                      <span className="relative">Clear</span>
                    </button>
                  </div>
                </div>


            <div className="">
            {ShowHideHistory ?
              <>
                {history_data &&
                  history_data.map((data, index) => {
                      return (
                        <div key={index}>
                          <ResponseTemplate
                              r_id={data["id"]}
                              r_time={data["created_at"]}
                              r_data={data["summarize_text"]}
                            />
                        </div>
                      );
                    })
                }
              </>
            :
            <>
                {summarize_text &&
                    <>
                    {summarize_text.length>0
                    ?
                    <>
                          <ResponseTemplate
                            r_id={summarize_text[0]["id"]}
                            r_time={summarize_text[0]["created_at"]}
                            r_data={summarize_text[0]["summarize_text"]}
                            r_custome={custom=="user"?"user":"normal_user"}
                          />
                    </>
                    :
                    <>
                        <div className="mt-[25%] w-[400px] ml-[20%] max-w-lg relative py-3 pl-8 space-x-2 text-xs text-gray-400 rounded-md ring-1 ring-gray-200">
                       
                        {GeneratingSummarize
                        ?
                        <>
                        <div className="flex-grow pl-2 pr-4 text-left">
                                <div className="mb-1 text-sm font-medium text-gray-500">
                                <div className="mt-3 flex flex-col items-center justify-center">
                                    <div>
                                        <p>Generating Content from Speech</p>
                                    </div>
                                    <div className="mt-3">
                                        <BouncingDotsLoader />
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </>
                        :
                        <>
                            <div className="absolute inset-y-0 left-0 flex items-center justify-center w-8 bg-gray-100 rounded-l-md">
                                <svg
                                className="w-10 h-10"
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
                            <div className="flex-grow">
                                <div className="mb-1 text-sm font-medium text-gray-500">
                                    Respond to the prompts
                                </div>
                                <div>
                                Transform text into expressive speech with our product. Customize tone and voice for impactful audio content creation effortlessly.
                                </div>
                            </div>
                        </>
                        }
                        </div>
                    </>
                    }
                    </>
                }
              </>
            }
                </div>

             
              </div>

              <Toaster />
            </div>
          </>
      </div>
    </>
  );
};

export default VoiceRecognition;
