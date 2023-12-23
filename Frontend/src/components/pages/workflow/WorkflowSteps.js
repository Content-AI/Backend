import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchData, postData } from '../../../apis/apiService';
import { BACKEND_URL,BACK_END_API_WORKFLOW_INNER_ANSWER, BACK_END_API_SINGLE_WORKFLOW,BACK_END_API_WORKFLOW_ANSWER,BACK_API_LANG,BACK_END_API_TONE_SELECT_FIELDS_WORKFLOW } from '../../../apis/urls';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import "./style.css";
import { useParams } from 'react-router-dom';
import { _change_state_ } from '../../../features/TriggerSwitchForCallingAPIsOfDocumentDoingWorkFlowAfterGenerate';
import Done from '../../Icons/Done';
import toast, { Toaster } from 'react-hot-toast';
// import  DarkModeTemplate from '../Template/Document/EditDocuments'
import DarkModeTemplate from '../Template/Document/DarkModeTemplate';



const WorkflowSteps = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();


  const notifyerror = (message) => toast.error(message);
  const notifysucces = (message) => toast.success(message);


  const [workFlowData, setWorkFlowData] = useState(null);
  const [inputValues, setInputValues] = useState({});


  const [isLoading, setIsLoading] = useState({});
  const [randomOutputs, setRandomOutputs] = useState({});
  
  const [currentStep, setCurrentStep] = useState(0);


  const [submittedSteps, setSubmittedSteps] = useState([]);
  const [isFirstStepSubmitted, setIsFirstStepSubmitted] = useState(false);



  let TOKEN = useSelector(
    (state) => state.SetAuthenticationToken.AuthenticationToken
  );
  let ChosenWorkspaceId = useSelector(
    (state) => state.SetChosenWorkspaceId.ChosenWorkspaceId
  );

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const page = searchParams.get('page');
  const workflow_id = searchParams.get('workflow_id');

  const { document_id } = useParams();



  const [languageOptions, setLanguageOptions] = useState([]);

  const [selectedLanguage, setSelectedLanguage] = useState("");

  const [Outputlanguage, setOutputlanguage] = useState([]);
  const [OutputlanguageChoice, setOutputlanguageChoice] = useState("English");

  const get_language = async () => {
    const resp = await fetchData(BACKEND_URL + BACK_API_LANG, TOKEN);

    if (resp.status == 200) {
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


  const get_workflow_data = async () => {
    const resp = await fetchData(
      BACKEND_URL + BACK_END_API_SINGLE_WORKFLOW + workflow_id,
      TOKEN
    );
    if (resp.status === 200) {
      setWorkFlowData(resp.data);
    }
  };

  useEffect(()=>{
    // console.log(workFlowData)
},[workFlowData])

  useEffect(() => {
    if (workflow_id != null) {
      get_workflow_data();
    }
  }, []);



  const handleInputChange = (stepIndex, fieldName, value) => {

    if (value.length <= workFlowData[0].WorkFlowTemplateId[stepIndex].inner_fields.find(field => field.label_title === fieldName).range_of_text) {
      setInputValues((prevInputValues) => ({
        ...prevInputValues,
        [stepIndex]: {
          ...prevInputValues[stepIndex],
          [fieldName]: value,
        },
      }));
    }
  };

  useEffect(()=>{
    // console.log(inputValues)
    
  },[inputValues])


  const handleSubmit = async (event, stepIndex,title) => {

    event.preventDefault();
    
    // let hasMissingRequiredFields = false;

    // notify from here as Toast to fill the data in textarea
    
    let hasMissingRequiredFields = false;
    try {
      let fill_data = workFlowData[0].WorkFlowTemplateId[stepIndex]["inner_fields"];

      // console.log(fill_data)
    
      fill_data.forEach(field => {

        // Check if the field is required and if the value is empty or null

        
        if(inputValues[stepIndex]?.[field.label_title]!=undefined || title!="Tone"){

          if (field.required && !inputValues[stepIndex]?.[field.label_title]) {
  
            notifyerror(field.label_title + " is required");
            hasMissingRequiredFields = true;
  
          }
        }

      });
    } catch (e) {
      // hasMissingRequiredFields = true;
    }


    // return true

    if (hasMissingRequiredFields) {
    } else {
      // All required fields are present, log "passed"
      if (inputValues[stepIndex]) {


        setIsLoading((prevIsLoading) => ({ ...prevIsLoading, [stepIndex]: true }));
        
        
        // Create an object with input name and value
        const inputData = {};
        for (const fieldName in inputValues[stepIndex]) {
          inputData[fieldName] = inputValues[stepIndex][fieldName];
        }
  
        const formData=inputData
        formData["Generate only"]=title
        
        if(isSwitchOn){
          formData["Context"]=textareaValue
        }
        
        formData["document_id"]=document_id
  
  
        if (inputValueselect!=null && inputValueselect!="") {
          formData["Tone"]=inputValueselect
        }
        
          const response = await postData(formData,BACKEND_URL+BACK_END_API_WORKFLOW_ANSWER,TOKEN)
  
          if(response.status==200){
  
              const data=response.data
              
              try{
                let data_title = workFlowData[0].WorkFlowTemplateId[stepIndex+1]["inner_fields"][0]["label_title"]
                const formDataInner={}
                formDataInner[data_title] = data.resp_data
                // set the another index value from previous data
                const response_next_index=await postData(formDataInner,BACKEND_URL+BACK_END_API_WORKFLOW_INNER_ANSWER,TOKEN)
                
                if(response_next_index.status==200){

                  // console.log(response_next_index.data.resp_data)

                  try{
                    let data_title = workFlowData[0].WorkFlowTemplateId[stepIndex+1]["inner_fields"][0]["label_title"]
                    setInputValues((prevInputValues) => ({
                      ...prevInputValues,
                      [stepIndex+1]: {
                        ...prevInputValues[stepIndex],
                        [data_title]: response_next_index.data.resp_data,
                      },
                    }));
  
                    setRandomOutputs((prevRandomOutputs) => ({ ...prevRandomOutputs, [stepIndex]: data.resp_data }));
                    setIsLoading((prevIsLoading) => ({ ...prevIsLoading, [stepIndex]: false }));
                    handleStepSubmit(stepIndex);
  
                  }catch(e){
                    
                    setRandomOutputs((prevRandomOutputs) => ({ ...prevRandomOutputs, [stepIndex]: data.resp_data }));
                    setIsLoading((prevIsLoading) => ({ ...prevIsLoading, [stepIndex]: false }));
                    handleStepSubmit(stepIndex);
                  }
                  
                }
              }catch(e){
                setRandomOutputs((prevRandomOutputs) => ({ ...prevRandomOutputs, [stepIndex]: data.resp_data }));
                setIsLoading((prevIsLoading) => ({ ...prevIsLoading, [stepIndex]: false }));
                handleStepSubmit(stepIndex);
            }
  
          }else{
              console.error('Error fetching random output:');
              setIsLoading((prevIsLoading) => ({ ...prevIsLoading, [stepIndex]: false }));
          }
        
      }
    }        
  
  };


  const handleStepSubmit = (stepNo) => {
    setSubmittedSteps((prevSubmittedSteps) => [...prevSubmittedSteps, stepNo]);
  };

  const handleRandomOutputChange = (stepIndex, value) => {
    setRandomOutputs((prevRandomOutputs) => ({
      ...prevRandomOutputs,
      [stepIndex]: value,
    }));
  };


  const handleNextStep = () => {

    let hasMissingRequiredFields = false;
    try {
      let fill_data = workFlowData[0].WorkFlowTemplateId[currentStep]["inner_fields"];
    
      fill_data.forEach(field => {
        // Check if the field is required and if the value is empty or null

        if(inputValues[currentStep]?.[field.label_title]!=undefined || field["label_title"]!="Tone"){
          if (field.required && !inputValues[currentStep]?.[field.label_title]) {
            notifyerror(field.label_title + " is required");
            hasMissingRequiredFields = true;
          }
        }
      });
    } catch (e) {
      // hasMissingRequiredFields = true;
    }


    if (hasMissingRequiredFields) {
      return true
    } else {
        dispatch(_change_state_(true))
        if (currentStep < workFlowData[0].WorkFlowTemplateId.length - 1) {
          setCurrentStep(currentStep + 1);
          setIsFirstStepSubmitted(false);
        }
      }
  };




//   ========context======
const [textareaValue, setTextareaValue] = useState('');
const [isSwitchOn, setIsSwitchOn] = useState(false);

const handleTextareaChange = (event) => {
  const inputValue = event.target.value;
  setIsSwitchOn(true)
  
  if (inputValue.length <= 200) {
    setTextareaValue(inputValue);
  }
  if(inputValue.length<=0){
    setIsSwitchOn(false)
  }
};

const handleSwitchToggle = () => {
  setIsSwitchOn(!isSwitchOn);
};




// ========options for tone==========
const [inputValueselect, setInputValueselect] = useState("");
  const [isOpen, setIsOpenselect] = useState(false);
  const [optionsselect, setOptionsSelect] = useState([]);

  const get_tone = async() =>{
    const resp = await fetchData(BACKEND_URL+BACK_END_API_TONE_SELECT_FIELDS_WORKFLOW,TOKEN)
    if(resp.status==200){
        setOptionsSelect(resp.data.options);

    }
  }

  useEffect(() => {
    get_tone()
  }, []);

  const handleInputChangeselect = (e) => {
    if (!isOpen) {
      setInputValueselect(e.target.value);
    }
  };

  const handleOptionClickSelect = (option) => {
    setInputValueselect(option);
    setIsOpenselect(false);
  };


// =========generate single or all======
const [isOpenOptionGenerateOrAll, setIsOpenOptionGenerateOrAll] = useState(
  false
);

const toggleDropdown = () => {
  setIsOpenOptionGenerateOrAll(!isOpenOptionGenerateOrAll);
};



  return (
      <div className="absolute inset-0 flex flex-row divide-x divide-slate-200 bg-white">
        <div className="h-full flex-1">
          <div className="dark:bg-gray-800 flex h-full flex-col overflow-y-scroll bg-slate-50">

            {/* <!-- ======back button==== --> */}
            <div className="flex pl-4">
              <button type="button" className=" relative rounded bg-transparent px-4 py-2 pl-0 text-center text-base font-semibold shadow-sm shadow-transparent outline-none transition-all duration-200 hover:outline-none focus:outline-none focus:ring-transparent"
              onClick={()=>{
                      const baseUrl = window.location.href.split('?')[0];                
                      const newUrl = `${baseUrl}?template_editing=edit_by_user&content=chat_content&redirect=from_workflow_page`;
                      window.location.replace(newUrl);

              }}>
                <DarkModeTemplate/>
              </button>
            </div>
            {/* <!-- ======back button==== --> */}



            {/* =========from here the workflow started============ */}

            <div className="bg-slate-20 h-full min-h-screen px-8 min-w-[235px]">


              {/* <!-- ======provide context===== --> */}
                      {/* <div id="setup-step"  className="sticky top-16 z-40 m-auto mb-2 flex max-w-xs flex-col rounded-lg bg-white px-6 shadow-lg dark:ring-gray-700"> */}
                      <div id="setup-step"  className="dark:bg-gray-600 sticky top-16 z-40 m-auto mb-2 flex max-w-xs flex-col rounded-lg bg-blue-800 px-6 shadow-lg dark:ring-gray-700">
                      <div className="w-full py-4 text-sm transition-all duration-300 dark:text-black">
                          <div className="w-full">
                          <div className="dark:text-gray-300 mb-1 flex justify-between">
                              <div>Provide Context Description</div>
                              <div className="ml-2 flex items-center">
                              
                              <button
                                  className={`relative w-10 h-4 transition-colors duration-200 ease-in-out bg-gray-300 rounded-full focus:outline-none ${
                                      isSwitchOn ? 'bg-indigo-500' : ''
                                  }`}
                                  onClick={handleSwitchToggle}
                                  >
                                  <span
                                      className={`absolute inset-0 w-4 h-3 mt-[2px] transition-transform transform bg-white rounded-full ${
                                      isSwitchOn ? 'translate-x-6' : ''
                                      }`}
                                  />
                                  </button>
                              </div>
                          </div>

                          <div className="w-full space-y-1.5">
                              {/* {isSwitchOn && ( */}
                              <div className="dark:bg-gray-800 dark:text-gray-300 !mt-0 flex w-full items-center gap-2 rounded-lg bg-white px-3 py-2.5 outline-none ring-1 ring-gray-200 transition-all duration-150 ease-in-out focus-within:!ring-1 hover:ring-2">
                                  <textarea
                                  // className="block w-full resize-none text-sm font-normal text-gray-900 outline-none placeholder:text-gray-400 h-5 overflow-hidden"
                                  value={textareaValue}
                                  onChange={handleTextareaChange}
                                  placeholder="Type something..."
                                  type="text" 
                                  className="dark:bg-gray-800 dark:text-gray-300 block w-full resize-none text-sm font-normal text-gray-900 outline-none placeholder:text-gray-400"
                                  />
                              </div>
                              {/* )} */}
                              <div className="flex items-center gap-2">
                                  <span className="dark:text-gray-200 ml-auto text-xs text-gray-500 transition-[color] duration-150 ease-in-out">
                                      {textareaValue.length}/200
                                  </span>
                              </div>
                          </div>

                          
                          </div>
                      </div>
                      </div>
              {/* <!-- ======provide context===== --> */}

    

              {/* <!-- =========title======= --> */}
                      <div>
                      <div className="flex flex-col pt-12">
                          <div className="mt-5 text-center text-2xl font-bold dark:text-gray-300" id="workflow-name">
                          {workFlowData &&
                              workFlowData[0]["title"]
                          }
                          </div>
                          <div className="self-center italic text-gray-600 dark:text-gray-400">Start</div>
                      </div>
                      </div>
              {/* <!-- =========title======= --> */}

              <div className="pb-4">

                {workFlowData &&
                <>
                
                    {workFlowData[0].WorkFlowTemplateId.map((step,stepIndex)=>{
                        return (
                            <div key={step.id}>

                            {/* <!-- =========steps show in========= --> */}
                                <div className="flex flex-col">
                                    <div className="left-1/2 h-10 self-center border-l-2 border-gray-200 dark:border-gray-600"></div>
                                    <div className="mb-0.5 flex self-center">
                                    <div className="item-center self-center italic text-gray-600 dark:text-gray-400">
                                        <div className="pr-3">Step</div>
                                    </div>
                                    {currentStep>=stepIndex+1
                                    ?
                                    <>
                                    <div className="mr-11 flex h-12 w-12 justify-center rounded-full bg-white text-blue-800 ring-2 ring-blue-800 dark:ring-green-800">
                                      {/* <div className="mr-11 flex h-12 w-12 justify-center rounded-full bg-white text-blue-800 ring-2 ring-blue-800 dark:bg-gray-900 dark:text-white dark:ring-gray-600"> */}
                                          <div className="self-center text-center text-2xl font-extrabold leading-4 dark:text-gray-400">
                                            <Done/>
                                          </div>
                                      </div>
                                    </>
                                    :
                                    <>
                                      {/* <div className="mr-11 flex h-12 w-12 justify-center rounded-full bg-white text-blue-800 ring-2 ring-blue-800 dark:bg-gray-900 dark:text-white dark:ring-gray-600"> */}
                                      <div className="dark:bg-gray-800 dark:text-gray-300 mr-11 flex h-12 w-12 justify-center rounded-full bg-white text-blue-800 ring-2 ring-blue-800 dark:ring-green-800">
                                          <div className="self-center text-center text-2xl font-extrabold leading-4 dark:text-gray-400">
                                            {stepIndex + 1}
                                          </div>
                                      </div>
                                    </>
                                    }
                                    </div>
                                    <div className="left-1/2 h-10 self-center border-l-2 border-gray-200 dark:border-gray-600"></div>
                                </div>
                            {/* <!-- =========steps show in========= --> */}

                            {/* <!-- ========the text area and other input area===== --> */}


                                <div 
                                className={`flex flex-wrap items-start rounded-xl shadow-xl ring-1  sm:col-span-3 md:flex-nowrap ${
                                    (!isFirstStepSubmitted || stepIndex !== currentStep) &&
                                    stepIndex !== currentStep
                                    ? 'bg-gray-100 ring-gray-200 dark:ring-gray-300'
                                    : 'bg-white'
                                }`}
                                >
                                    <div className="flex-auto font-medium text-gray-500 dark:text-white">
                                    <div className="relative w-full">

                                        <div className="dark:bg-gray-600 dark:rounded-md dark:text-gray-300 w-full space-y-2 p-4 px-6 bg-blue-800">

                                        <div className="mb-4 flex items-center md:flex-row md:items-center">
                                            <div className="flex flex-col">
                                            {/* <div className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-300 sm:mb-1"> */}
                                            <div className="dark:text-gray-300 text-2xl font-bold tracking-tight text-gray-900  sm:mb-1">
                                                {step.title}
                                            </div>
                                            </div>
                                        </div>
                                        <hr className='bg-black'></hr>


                                        {step.inner_fields.map((field) => (
                                            <div key={field.id} className="w-full space-y-2">

                                            {/* =======here the input , textarea or select field ====== */}
                                                <div className="w-full">
                                                    <div className="w-full space-y-1.5">
                                                        <label 
                                                            className="block text-sm font-medium text-gray-900 transition-[color] duration-150 ease-in-out placeholder:text-gray-400"
                                                        >
                                                            <span className="flex items-center space-x-1">
                                                                <span className='dark:text-gray-300'>
                                                                    {field.label_title}
                                                                </span>
                                                            </span>
                                                        </label>

                                                        {field.component === 'textarea' ? (
                                                            <>
                                                            <div 
                                                                className="dark:bg-gray-800 dark:text-gray-300 flex w-full items-center gap-2 rounded-lg bg-white px-3 py-1 outline-none ring-1 ring-gray-200 transition-all duration-150 ease-in-out focus-within:!ring-1 hover:ring-2"
                                                            >

                                                                <div className="flex grow items-center gap-2 py-1.5">
                                                                    <div className="flex grow gap-1">
                                                                    <textarea 
                                                                        type="text" 
                                                                        className="dark:bg-gray-800 dark:text-gray-300 block w-full resize-none text-sm font-normal text-gray-900 outline-none placeholder:text-gray-400"
                                                                        placeholder={field.placeholder}
                                                                        value={inputValues[stepIndex]?.[field.label_title] || ''}
                                                                        onChange={(e) => handleInputChange(stepIndex, field.label_title, e.target.value)}
                                                                        readOnly={(!isFirstStepSubmitted || stepIndex !== currentStep) && stepIndex !== currentStep}
                                                                        />

                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-2">
                                                                <span className="ml-auto text-xs text-gray-500 transition-[color] duration-150 ease-in-out">
                                                                {inputValues[stepIndex]?.[field.label_title]?.length || 0}/
                                                                {field.range_of_text}
                                                                </span>
                                                            </div>
                                                            </>
                                                        ):(
                                                            <>
                                                            <div className="relative w-full text-black">
                                                                <div className="flex">
                                                                    <input
                                                                    type="text"
                                                                    value={inputValueselect}
                                                                    onChange={handleInputChangeselect}
                                                                    onFocus={() => setIsOpenselect(false)}
                                                                    className="dark:bg-gray-800 dark:text-gray-300 w-full px-3 py-2 border text-sm font-normal rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                    placeholder="Type  Witty , Normal , Professional ...."
                                                                    />
                                                                    <button
                                                                    className="absolute ml-[321px] px-4 h-[39px] border border-l-0  focus:outline-none"
                                                                    onClick={() => setIsOpenselect(!isOpen)}
                                                                    >
                                                                    ▼
                                                                    </button>
                                                                </div>
                                                                {isOpen && (
                                                                    <div className="absolute z-10 w-full mt-1 bg-white border rounded border-gray-300">
                                                                    {optionsselect.map((option) => (
                                                                        <div
                                                                        key={option}
                                                                        className="dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-500 px-3 py-2 cursor-pointer hover:bg-gray-100 text-black"
                                                                        onClick={() => handleOptionClickSelect(option)}
                                                                        >
                                                                        {option}
                                                                        </div>
                                                                    ))}
                                                                    </div>
                                                                )}
                                                                </div>
                                                            </>
                                                    )}

                                                    </div>
                                                </div>


                                            {/* =======here the input , textarea or select field ====== */}


                                            </div>
                                        ))}



                            {/* ===================the output========== */}
                            {randomOutputs[stepIndex] && (
                            <div className="w-full">
                                <div className="w-full space-y-1.5">
                                <label 
                                    className="block text-sm font-medium text-gray-900 transition-[color] duration-150 ease-in-out placeholder:text-gray-400"
                                >
                                    <span className="dark:text-gray-300 flex items-center space-x-1">Output</span>
                                </label>
                                <div>
                                    <div className="flex grow items-center gap-2 py-1.5">
                                    <div className="flex grow gap-1">
                                        <textarea
                                        className="dark:text-gray-300 dark:bg-gray-600 text-black w-full h-[300px] px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={randomOutputs[stepIndex]}
                                        onChange={(e) => handleRandomOutputChange(stepIndex, e.target.value)}
                                        readOnly={(!isFirstStepSubmitted || stepIndex !== currentStep) && stepIndex !== currentStep}
                                        disabled={!isFirstStepSubmitted || stepIndex !== currentStep}
                                        />
                                    </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                            )}

                            {/* ===================the output========== */}

                                        <div className="flex justify-between">

                                            <div className="flex w-full items-center justify-end space-x-2">
                                            <div>

                                                <div className="relative inline-block text-left">
                                                <div className="relative text-sm font-normal leading-tight text-gray-600 shadow-sm">

                                          {/* ===========generate all or once======= */}
                                          
                                          {stepIndex==0
                                            ?
                                            <>
                                              <div className="group cursor-pointer">
                                                <div
                                                  className="px-4 py-2 rounded-lg border border-gray-300 bg-[#334977] text-white flex items-center justify-between"
                                                  onClick={toggleDropdown}
                                                >
                                                  {isLoading[stepIndex]
                                                    ?
                                                        <>
                                                          <div class="w-4 h-4 border-t-2 border-white mr-2 border-solid rounded-full animate-spin">
                                                          </div>
                                                            Generating
                                                        </>
                                                  :
                                                        <p>
                                                          Generate
                                                        </p>
                                                  }
                                                  
                                                      <div className="aspect-1 ml-1 mt-1">
                                                          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                                          <path d="M4,6.19c1.18,1.44,1.98,2.29,3.17,3.31,.48,.41,1.18,.41,1.66,0,1.18-1.02,1.99-1.87,3.17-3.31" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">

                                                          </path>
                                                          </svg>
                                                      </div>
                                                </div>
                                                <div
                                                  className={`${
                                                    isOpenOptionGenerateOrAll ? "block" : "hidden"
                                                  } origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}
                                                >
                                                  <button 
                                                    className={`flex flex-wrap items-start  w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 sm:col-span-3 md:flex-nowrap ${
                                                              (!isFirstStepSubmitted || stepIndex !== currentStep) && stepIndex !== currentStep
                                                                  ? 'bg-slate-400 ring-gray-200 dark:ring-gray-300'
                                                                  : ''
                                                              } ${isLoading[stepIndex] ? 'opacity-50 cursor-not-allowed' : ''}  px-3 h-[35px] selectionRing inline-flex w-full items-center justify-between space-x-2 truncate text-black`}

                                                          onClick={(e) => {
                                                              handleSubmit(e, stepIndex,step.title);
                                                              setIsFirstStepSubmitted(true);
                                                              setIsOpenOptionGenerateOrAll(false)
                                                          }}
                                                          disabled={
                                                              isLoading[stepIndex] ||
                                                              (!isFirstStepSubmitted && stepIndex !== currentStep)
                                                      }

                                                  >
                                                    Generate
                                                  </button>
                                                  {/* <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                                  onClick={()=>{
                                                    notifysucces("comming soon")
                                                  }}>
                                                    All
                                                  </button> */}
                                                </div>
                                              </div>
                                            </>
                                            :
                                            <>
                                            <button 
                                                        type="button"
                                                        className={`flex flex-wrap items-start rounded-xl shadow-xl ring-1 sm:col-span-3 md:flex-nowrap ${
                                                            (!isFirstStepSubmitted || stepIndex !== currentStep) && stepIndex !== currentStep
                                                                ? 'bg-slate-400 ring-gray-200 dark:ring-gray-300'
                                                                : 'bg-[#334977]'
                                                            } ${isLoading[stepIndex] ? 'opacity-50 cursor-not-allowed' : ''}  px-3 h-[35px] selectionRing inline-flex w-full items-center justify-between space-x-2 truncate rounded-lg border border-gray-300 bg-gradient-to-r text-white shadow-sm focus:outline-none`}

                                                        onClick={(e) => {
                                                            handleSubmit(e, stepIndex,step.title);
                                                            setIsFirstStepSubmitted(true);
                                                        }}
                                                        disabled={
                                                            isLoading[stepIndex] ||
                                                            (!isFirstStepSubmitted && stepIndex !== currentStep)
                                                        }
                                                    >
                                                    <div className="truncate">
                                                        {isLoading[stepIndex]
                                                        ?
                                                          <div class="flex items-center justify-center h-screen">
                                                            <div class="w-4 h-4 border-t-2 border-white mr-2 border-solid rounded-full animate-spin">
                                                            </div>
                                                              Generating
                                                          </div>
                                                        : 
                                                          <p>
                                                            Generate
                                                          </p>
                                                      }
                                                    </div>
                                                    </button>
                                            </>

                                          }

                                          {/* ===========generate all or once======= */}

                                                </div>
                                                </div>

                                            </div>


                                            {stepIndex === currentStep && (
                                                <button  
                                                    type="button" 
                                                    // className="bg-[#334977] relative justify-between rounded-md border-0 px-3 py-1.5 text-sm font-semibold text-white opacity-50 shadow-sm outline-none ring-0  transition-all duration-200 hover:outline-none hover:ring-0 focus:outline-none active:ring-1  dark:ring-0"
                                                    className="bg-[#334977] relative justify-between rounded-md border-0 px-3 h-[33px] text-sm font-semibold text-white"
                                                    onClick={handleNextStep}
                                                        disabled={
                                                        isLoading[stepIndex] ||
                                                        (!isFirstStepSubmitted || stepIndex !== currentStep)
                                                        }
                                                >
                                                    <span 
                                                        className="mx-auto flex select-none items-center justify-center space-x-2"
                                                    >
                                                    <span>
                                                    {currentStep === workFlowData[0].WorkFlowTemplateId.length - 1
                                                    ? 'Finish'
                                                    : 'Next'}
                                                    </span>
                                                    <div className="h-5 w-5 pl-1 pt-0.5">
                                                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                                        <path d="M4.57,14.86c2.47-2.02,3.93-3.4,5.67-5.43,.7-.82,.7-2.03,0-2.85-1.74-2.03-3.2-3.41-5.67-5.43" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">

                                                        </path>
                                                        </svg>
                                                    </div>
                                                    </span>
                                                </button>
                                            )}

                                            </div>
                                        </div>


                                        </div>

                                    </div>
                                    


                                    </div>
                                    
                                </div>

                            {/* <!-- ========the text area and other input area===== --> */}



                        </div>
                        )})}
                </>
                }

                  {/* <!-- =========steps show in========= --> */}
                  <div className="flex flex-col">
                          <div className="left-1/2 h-10 self-center border-l-2 border-gray-200 dark:border-gray-600"></div>
                          
                          <div className="mb-0.5 flex self-center">
                          <div className="item-center self-center italic text-gray-600 dark:text-gray-400">
                              <div className="pr-3">Reset</div>
                          </div>

                          <div className="mr-11 flex h-12 w-12 justify-center rounded-full bg-white text-blue-800 ring-2 ring-blue-800 dark:ring-green-800">
                          {/* <div className="mr-11 flex h-12 w-12 justify-center rounded-full bg-white text-blue-800 ring-2 ring-blue-800 dark:bg-gray-900 dark:text-white dark:ring-gray-600"> */}
                              <button className="self-center text-center text-2xl font-extrabold leading-4 dark:text-gray-400"
                              type='button'
                              onClick={()=>{
                                  setInputValues({})
                                  setIsLoading({})
                                  setRandomOutputs({})
                                  setCurrentStep(0)
                                  setSubmittedSteps([])
                                  setIsFirstStepSubmitted(false)
                              }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true" class="w-8 h-8 self-center text-blue-800 dark:text-gray-300 cursor-pointer">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                  </svg>
                              </button>
                          </div>
                          </div>
                          <div className="left-1/2 h-10 self-center border-l-2 border-gray-200 dark:border-gray-600"></div>
                          <div className="self-center italic text-gray-600 dark:text-gray-400">End</div>

                      </div>
                  {/* <!-- =========steps show in========= --> */}
              </div>
            </div>

            {/* ========= workflow ended============ */}

          
          </div>
        </div>
      </div>
  );
};




export default WorkflowSteps;

