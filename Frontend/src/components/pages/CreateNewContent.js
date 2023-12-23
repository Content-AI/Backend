import React, { useEffect, useRef, useState } from "react";
import { BACKEND_URL,BACK_END_API_PROJECT_CHOOSE,BACK_END_API_DOCUMENTS } from '../../apis/urls';
import { fetchData, postData } from '../../apis/apiService';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import LoadingPage from "../LoadingPage";
import toast, { Toaster } from 'react-hot-toast';
import {
  _message_
} from "../../features/LoadingScreenMessage";
import { _load_screen_ } from "../../features/LoadingScreen";

// import Select from 'react-select';
import { setDocumentTitle } from '../NavBar/DynamicTitle';

import {
    _save_folder_id_
  } from "../../features/ProjectOrFolderIdChoosen";
import CreateTemplateicon from "../Icons/CreateTemplateicon";
import CreateDocumenticon from "../Icons/CreateDocumenticon"
import TemplateIconForCreate from "../Icons/TemplateIconForCreate"
import Closeicons from "../Icons/Closeicons"
import Template from "../Icons/Template"
import DocumentsIcon from "../Icons/DocumentsIcon";
import ArtIcon from "../Icons/ArtIcon";
import ReacapBuildericon from '../Icons/ReacapBuildericon'
import { Premium } from "./ImageGenerator/Premium";
import { PremiumVoice } from "./GenerateUsingVoice/PremiumVoice";
  

const CreateNewContent = (props) => {
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const handleGoBack = () => {
        navigate(-1);
    };

    useEffect(() => {
      setDocumentTitle("Create New Content");
    }, []);

    let ChosenWorkspaceId = useSelector(
      (state) => state.SetChosenWorkspaceId.ChosenWorkspaceId
      );	

    const notifyerror = (message) => toast.error(message);

    let subscriptions_check = useSelector(
      (state) => state.SetSubscriptions.Subscriptions
    );

    const [selectedValue, setSelectedValue] = useState('');
    const [SelectedOptions, setSelectedOptions] = useState(null);

    let loading_page = useSelector(
      (state) => state.SetLoadingScreen.LoadingScreen
      );

    // const handleSelectChange = (event) => {
    //     setSelectedValue(event.target.value);
    //   };

    const [selectedOption, setSelectedOption] = useState({"value":"select a folder","label":"select a folder"});
    const [options, setoptions] = useState([
      { value: "Your content", label: "Your content"},
    ]);

    const get_project_data = async() => {

      if(ChosenWorkspaceId!=null){
          const resp = await fetchData(BACKEND_URL+BACK_END_API_PROJECT_CHOOSE+"?workspace_id="+ChosenWorkspaceId["Workspace_Id"],props.AUTH_TOKEN)
          if(resp.status==200){
              setSelectedOptions(resp.data)
              setoptions(resp.data)
          }
        }
    }
      useEffect(()=>{
        get_project_data()
      },[])

    //   useEffect(()=>{
    //     dispatch(_save_folder_id_(selectedValue))
    //   },[selectedValue])

      // useEffect(()=>{
      //   dispatch(_save_folder_id_(selectedOption.value))
      // },[selectedOption])

    
      const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption);
      };

    //   useEffect(()=>{
    //     console.log(selectedOption.value)
    //   },[selectedOption])



    // =============select folder or create new folder===========
    // const options = [
    //     { value: "your content", label: "Your content" },
    //   ];
    
      const [selectedOptionFolder, setSelectedOptionFolder] = useState(options[0].value);
      const [searchText, setSearchText] = useState("");
      const [showToUser,setshowToUser] = useState("Select a Folder");
      const [showDropdown, setShowDropdown] = useState(false);
    
      const handleOptionClick = (option) => {
        setSelectedOptionFolder(option);
        setShowDropdown(false);
      };
    
      const handleNewCampaignClick = () => {
          navigate("/projects?create=new_folder&true=redirect_site")
      };
    
      const handleSelectOption = (option) => {
        setshowToUser(option)
      };


      useEffect(()=>{
        dispatch(_save_folder_id_(selectedOptionFolder))
      },[selectedOptionFolder])
    
      const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchText.toLowerCase())
      );

      const capitalizeFrontText = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
      };


// ========popup for select go off when click on other div========
const dropdownRef = useRef(null);

useEffect(() => {
  function handleOutsideClick(e) {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  }

  document.addEventListener("mousedown", handleOutsideClick);

  return () => {
    document.removeEventListener("mousedown", handleOutsideClick);
  };
}, []);


const create_blank_document = async() => {
  const formData = {
    document_content: "",
    workspace_id:ChosenWorkspaceId["Workspace_Id"]
  }
  
  const resp = await postData(formData,BACKEND_URL+BACK_END_API_DOCUMENTS+"/",props.AUTH_TOKEN)
  try{
    if(resp.status==201){
        dispatch(_load_screen_(false))
        dispatch(_message_(""))
        navigate(`/template_data/${resp.data.id}?template_editing=edit_by_user&content=chat_content&redirect=from_blank_document`)


    }else{
        notifyerror("something went wrong refresh page")
    }
  }catch(e){
      notifyerror("something went wrong refresh page")
  }
  }

  return (
    <>
    {loading_page
        ?
            <LoadingPage message={"Creating Document"}/>
        :
       <div className="fixed inset-0 z-40 overflow-y-auto">
            <div className=" flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
                <div className=" fixed inset-0 transition-opacity bg-gray-500 bg-opacity-50 opacity-100"></div>
                
                <div className=" relative h-full bg-white text-gray-900 rounded-md shadow-xl align-top sm:align-middle w-full sm:w-[416px] md:w-[700px] opacity-100 translate-y-0 sm:scale-100">
                    <div className="dark:bg-gray-800 dark:text-gray-200 flex flex-col p-6">
                        <div className="dark:bg-gray-800 dark:text-gray-200 -m-6 divide-y divide-gray-200">
                        <div className="dark:bg-gray-800  dark:text-gray-200 p-6 space-y-4">
                            <div className="dark:bg-gray-800 dark:text-gray-200 space-y-1">

                                {/* <h1 className="dark:bg-gray-600 dark:text-gray-200 mb-2 text-lg font-semibold text-gray-900">Get started with new content powered by  <b> AI</b></h1> */}

                                <div className="dark:bg-gray-800 dark:text-gray-500 w-full text-left flex justify-between items-center  text-gray-900">
                                    <h3 className="text-lg font-semibold">Get started with new content powered by  <b>Jyra AI</b></h3>
                                    <button className="p-2 hover:bg-gray-100 rounded-full hover:cursor-pointer"
                                    onClick={handleGoBack}>
                                        <Closeicons/>
                                    </button>
                                  </div>


                                <div className="flex ">
                                    <div className="w-64 mt-2 ">
                                    {/* ============select field================= */}
                                      <div className="w-64" ref={dropdownRef}>
                                        <div className="relative inline-block text-left w-full">
                                          <button
                                            className="flex dark:bg-gray-600   items-center justify-between w-full px-4 py-2 truncate transition-all duration-150 bg-white rounded-md group active:ring-gray-400 hover:ring-gray-300 ring-1 ring-gray-200"
                                            aria-label="Select a campaign"
                                            onClick={() => setShowDropdown((prevState) => !prevState)}
                                          >
                                            <span className="items-start block truncate">
                                              <span className="block text-sm text-left dark:text-gray-300 text-gray-600 truncate">
                                                {capitalizeFrontText(showToUser)}
                                              </span>
                                            </span>
                                            <span className="ml-3 -mr-1">
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="2"
                                                stroke="currentColor"
                                                aria-hidden="true"
                                                className="w-5 h-5 text-gray-400 group-hover:text-gray-600"
                                              >
                                                <path d="M19 9l-7 7-7-7"></path>
                                              </svg>
                                            </span>
                                          </button>
                                          {showDropdown && (
                                            <div className="dark:bg-gray-700 border  border-green-300 origin-top absolute left-0 z-50 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none w-full !min-w-0 transform opacity-100">
                                              <div className="px-4 py-3">
                                                <div className="space-y-1.5 w-full">
                                                  <label htmlFor="search-projects" className="sr-only">
                                                    <span className="flex items-center space-x-1">
                                                      <span>Search projects</span>
                                                    </span>
                                                  </label>
                                                  <div className="dark:bg-gray-800 py-1 !mt-0 flex items-center gap-2 bg-white w-full px-3 rounded-lg ring-1 hover:ring-2 transition-all duration-150 ease-in-out ring-gray-200 outline-none focus-within:!ring-1">
                                                    <div className="flex items-center grow gap-2 py-1.5">
                                                      <div className="flex gap-1 grow">
                                                        <input
                                                          id="search-projects"
                                                          type="text"
                                                          className="dark:bg-gray-800 dark:text-gray-200   block w-full text-gray-900 placeholder:text-gray-400 text-sm font-normal resize-none outline-none"
                                                          placeholder="Search"
                                                          autoComplete="off"
                                                          value={searchText}
                                                          onChange={(e) => setSearchText(e.target.value)}
                                                        />
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <ul className="py-1 max-h-[12.875rem] overflow-y-auto">
                                                {filteredOptions.map((option) => (
                                                  <li key={option.value}>
                                                    <button
                                                      className="dark:text-gray-300 dark:hover:bg-gray-800 text-left w-full relative text-gray-700 hover:bg-gray-200 hover:text-gray-900 truncate px-4 py-2 text-sm  pr-8"
                                                      onClick={() => {
                                                        handleOptionClick(option.value);
                                                        handleSelectOption(option.label);
                                                      }}
                                                    >
                                                    <span className="flex-grow">{capitalizeFrontText(option.label)}</span>
                                                    {option.label=="default"
                                                    ?
                                                      <CreateTemplateicon/>
                                                    :
                                                      null
                                                    }
                                                    </button>
                                                  </li>
                                                ))}
                                              </ul>
                                              <button
                                                id="newProject"
                                                className="dark:bg-gray-800 dark:text-gray-300  dark:hover:bg-gray-800 text-left w-full text-sm font-bold text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-4 py-2 rounded-b-md"
                                                onClick={handleNewCampaignClick}
                                              >
                                                + Create Folder
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    {/* ========================================= */}
                                    </div>
                                    
                                </div>
                            </div>
                            <p className="dark:bg-gray-800 dark:text-gray-500 text-sm font-normal text-gray-600">You have the option to produce a document for lengthy content, utilize a template for concise excerpts of specialized content, or employ our guided forms</p>
                        </div>

                        {/* ========choose the options ======== */}
                        <div className=" grid grid-cols-1 md:grid-cols-2 gap-6 p-3 mb-2">

                        
                            <button 
                                className="p-4 border dark:bg-gray-700 dark:border-slate-500 rounded-lg text-left space-y-2 hover:scale-105 hover:ring-gray-600 transform transition-transform duration-300"
                            onClick={()=>{
                              create_blank_document()
                              dispatch(_load_screen_(true))
                              dispatch(_message_("Creating Blank Doc ..."))
                            }}>
                                <span className="flex items-center space-x-3">
                                    <DocumentsIcon/>
                                    <span className=" dark:text-gray-500 text-slate-700 text-base font-semibold">Blank document</span>
                                </span>
                                <span className="block dark:text-gray-500">Commence a new by creating an empty document.</span>
                            </button>

                            <button 
                              className="p-4 border rounded-lg dark:bg-gray-700 text-left dark:border-slate-500  hover:ring-gray-600 space-y-2 hover:scale-105 transform transition-transform duration-300"

                                onClick={()=>{
                                    navigate("/templates")
                                }}
                            >
                                <span className="flex items-center space-x-3">
                                  <Template/>
                                    <span className=" dark:text-gray-500 text-slate-700 text-base font-semibold">Templates</span>
                                </span>
                                <span className="block dark:text-gray-500">Create content with predefined templates and workflows.</span>
                            </button>

                            <button 
                              className="p-4 border dark:border-slate-500 dark:bg-gray-700 rounded-lg text-left  hover:ring-gray-600 space-y-2 hover:scale-105 transform transition-transform duration-300"

                                onClick={()=>{
                                    navigate("/recap_builder")
                                }}
                            >
                                <span className="flex items-center space-x-3">
                                    {/* <ReacapBuildericon/> */}
                                    <img className="w-8 h-8 dark:rounded-md" alt="Transcribe speech" src="https://aiprojectfilestorage.s3.ap-southeast-2.amazonaws.com/icons/Screenshot+2023-10-04+at+10.26.05+AM.png" />
                                    <span className=" dark:text-gray-500  ext-slate-700 text-base font-semibold">Recap Builder</span>
                                    {/* <Premium /> */}
                                </span>
                                <span className="block dark:text-gray-500">Transform your audio visual content into concise and insightful summaries..</span>
                            </button>

                            <button 
                              className="p-4 border dark:bg-gray-700 dark:border-slate-500 rounded-lg text-left  hover:ring-gray-600 space-y-2 hover:scale-105 transform transition-transform duration-300"

                                onClick={()=>{
                                    navigate("/transcribe-speech")
                                }}
                            >
                                <span className="flex items-center space-x-3">
                                    <img className="w-8 h-8" alt="Transcribe speech" src="https://aiprojectfilestorage.s3.ap-southeast-2.amazonaws.com/icons/Transcribe+speech.png" />
                                    <span className=" dark:text-gray-500  text-slate-700 text-base font-semibold">Transcribe speech.</span>
                                      <Premium/>
                                </span>
                                <span className="block dark:text-gray-500">Convert your spoken words into written text effortlessly, transforming your voice into clear and precise written content.</span>
                            </button>
                            

                            <button 
                              className="p-4 border dark:bg-gray-700 dark:border-slate-500 rounded-lg text-left  hover:ring-gray-600 space-y-2 hover:scale-105 transform transition-transform duration-300"

                                onClick={()=>{
                                    navigate(`/template/31025db5-d6e9-4bd2-b237-8a87a2545595?custom=normal_user`)
                                }}
                            >
                                <span className="flex items-center space-x-3">
                                    <img className="w-8 h-8" alt="Transcribe speech" src="https://aiprojectfilestorage.s3.ap-southeast-2.amazonaws.com/icons/1_T3DPBTv.png" />
                                    <span className=" dark:text-gray-500  text-slate-700 text-base font-semibold">One Shot Blog Post</span>
                                </span>
                                <span className="block dark:text-gray-500">Get the key bullet points from a piece of content.</span>
                            </button>
                            
                            <button 
                              className="dark:bg-gray-700 p-4 border rounded-lg text-left dark:border-slate-500 hover:ring-gray-600 space-y-2 hover:scale-105 transform transition-transform duration-300"

                                onClick={()=>{
                                    navigate("/art")
                                }}
                            >
                            
                                <span className="flex items-center space-x-3">
                                    {/* <ArtIcon/> */}
                                    <img className="w-8 h-8 dark:rounded-md" alt="Transcribe speech" src="https://aiprojectfilestorage.s3.ap-southeast-2.amazonaws.com/icons/Screenshot+2023-10-04+at+10.32.29+AM.png" />
                                    <span className=" dark:text-gray-500  text-slate-700 text-base font-semibold">Art</span>
                                    <Premium />
                                </span>
                                <span className="block dark:text-gray-500">Express your creativity through the power of art.</span>
                            </button>

                        </div>
                        

                        
                        </div>

                        
                    </div>
                </div>
            </div>
        </div>
    }
    </>
  )
}

export default CreateNewContent