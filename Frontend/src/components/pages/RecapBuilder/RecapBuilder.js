import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  BACKEND_URL,
  BACK_END_API_GENERATE_IMAGE,
  BACK_END_API_CHECK_VIDEO,
  BACK_END_API_UPLOADING_VIDEO,
  BACK_END_API_EXTRACT_SPEECH_FROM_VIDEO,
  BACK_END_API_RECAP_OF_AUDIO,
  BACK_END_API_AUDIO_SUMMARIZE,
  BACK_END_API_HISTORY_URL,
  BACK_END_API_HISTORY_AUDIO_VIDEO,
  BACK_END_API_CHUNK_FILE,
  BACK_END_API_CONVERT_AUDIO,
} from "../../../apis/urls";
import { fetchData, postData,fileFormData } from "../../../apis/apiService";
import { IoMdArrowBack } from "react-icons/io";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { setDocumentTitle } from '../../NavBar/DynamicTitle';

import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
// import LoadingPage from "../../LoadingPage";
import toast, { Toaster } from "react-hot-toast";

import RenderHtml from "../Template/RenderHtml";
import BouncingDotsLoader from "../../BouncingDotsLoader";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { _save_details_ } from "../../../features/Subscriptions";
import TooltipInfo from "../../Icons/TooltipInfo";

import ResponseTemplate from "../Template/ResponseTemplate";
import SelectOptionsTemplate from "../Template/SelectOptionsTemplate/SelectOptions";



import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import { Carousel } from "react-responsive-carousel";
import { FaDownload } from "react-icons/fa"; // Import the download icon from react-icons
import Downloadicon from "../../Icons/Downloadicon";
import RenderHtmlData from "../Template/RenderHtmlData";
import Progressbar from "./Progressbar";



const RecapBuilder = ({ AUTH_TOKEN }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setDocumentTitle("Recap Builder");
  });

  const [selectedTab, setSelectedTab] = useState("url"); // Track the selected tab
  const [ShowHideHistory, setShowHideHistory] = useState(false);


  let upgrade_plan={restrict_user: true, customer_stripe_id: 'null', email: 'null', subscription_type: 'null', status: 'trial'}


  const [ProjectId, setProjectId] = useState(null);

  const [Outputlanguage, setOutputlanguage] = useState([]);
  const [OutputlanguageChoice, setOutputlanguageChoice] = useState("English");

  const [inputs, setInputs] = useState([{ key: "", value: "" }]);



  const [multipleInputForms, setMultipleInputForms] = useState({});

  const [ContentOutputNumber, setContentOutputNumber] = useState(2);

  const [LoadingButton, setLoadingButton] = useState(false);

  const location = useLocation();

  let ChosenWorkspaceId = useSelector(
    (state) => state.SetChosenWorkspaceId.ChosenWorkspaceId
    );

  let subscriptions_details = useSelector(
    (state) => state.SetSubscriptionsData.SubscriptionsData
  );

  const { template_id } = useParams();

  const searchParams = new URLSearchParams(location.search);
  const custom = searchParams.get('custom');


  const notifyerror = (message) => toast.error(message);
  const notifysucces = (message) => toast.success(message);


// =======generate image=========

  const [summarize_text, setsummarize_text] = useState([]);
  const [summarize_text_id, setsummarize_text_id] = useState(null);
  const [created_time, setcreated_time] = useState(null);
  const [GeneratingSummarize, setGeneratingSummarize] = useState(false);
  const [message_from_backend, setmessage_from_backend] = useState('Generating Summarize of content this may take while buckle up ...');
  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleInputChange = (e) => {
    const inputUrl = e.target.value;
    setUrl(inputUrl);

    // Validate the URL using a simple regex pattern
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    setIsValid(urlPattern.test(inputUrl));
  };


  const get_summarize = async() =>{
    setsummarize_text([])
    setsummarize_text_id(null)
    if(url.length<=0){
        notifyerror("Input Valid URL")
        return true
    }
        if(!isValid){
            notifyerror("Input Valid URL")
            return true
        }

        setLoadingButton(true)
        setGeneratingSummarize(true)
        const formdata={
            url:url
        }
        
        const resp_first = await postData(formdata,BACKEND_URL+BACK_END_API_CHECK_VIDEO,AUTH_TOKEN)
        if(resp_first.status==200){
          
          setmessage_from_backend(resp_first.data.message)
          
          
          const resp_second = await fetchData(BACKEND_URL+BACK_END_API_UPLOADING_VIDEO,AUTH_TOKEN)
          if(resp_second.status==200){
            
            setmessage_from_backend(resp_second.data.message)
            
            const resp_third = await fetchData(BACKEND_URL+BACK_END_API_EXTRACT_SPEECH_FROM_VIDEO,AUTH_TOKEN)
            if(resp_third.status==200){
              
              setmessage_from_backend(resp_third.data.message)
              const resp_fourth = await fetchData(BACKEND_URL+BACK_END_API_RECAP_OF_AUDIO,AUTH_TOKEN)
              
              if(resp_fourth.status==200){
                  setLoadingButton(false)
                  setGeneratingSummarize(false)
                  setsummarize_text(resp_fourth.data[0]["summarize_text"])
                  setsummarize_text_id(resp_fourth.data[0]["id"])
                  setcreated_time(resp_fourth.data[0]["created_at"])
                  setUrl('')

              }else{
                notifyerror("something went wrong refresh the page")
              }

            }else{

              notifyerror("something went wrong refresh the page")

            }

          }else{
            notifyerror("something went wrong refresh the page")
          }


        }else{
            try{
                if(resp_first.response.data.message){
                    notifyerror(resp_first.response.data.message)
                }
            }catch(e){
                notifyerror("We adhere to strict guidelines ensuring the responsible creation of content, prioritizing the avoidance of any harmful or offensive imagery.")
            }
            setLoadingButton(false)
            setGeneratingSummarize(false)
        }

    }


  // Toggle between the "Add URL" and "Upload New File" sections
  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };




  // =========the file upload audio or video======
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragging, setDragging] = useState(false);

  const [show_uploading_bar, setshow_uploading_bar] = useState(false);
  const [percent_uploaded, setpercent_uploaded] = useState(0);

  const [error, setError] = useState("");

  const supportedExtensions = [".mp3", ".mp4", ".srt"];

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0]; // Allow only one file
    setSelectedFile(file);
    validateFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]; // Allow only one file
    setSelectedFile(file);
    validateFile(file);
  };

  const validateFile = (file) => {
    if (!file) {
      setError("");
      return;
    }

    const fileExtension = `.${file.name.split(".").pop()}`;
    if (!supportedExtensions.includes(fileExtension.toLowerCase())) {
      setError("Invalid file format. Supported formats: audio and video like mp3, mp4 , avi  etc..");
    } else {
      setError("");
    }
  };

  const CHUNK_SIZE = 6 * 1024 * 1024; // 3 MB

  const uploadFile = async() => {
    const message_data = "We adhere to strict guidelines ensuring the responsible creation of content, prioritizing the avoidance of any harmful or offensive imagery."
    setsummarize_text([])
    setsummarize_text_id(null)
    setGeneratingSummarize(true)
    setLoadingButton(true)
    if (!selectedFile || error) {
      // Don't upload if no file selected or there is an error
      return;
    }

    // const formData = new FormData();
    // formData.append("file", selectedFile);

    const fileSize = selectedFile.size;
    let start = 0;
    let end = CHUNK_SIZE;

    let resp_upload;

    while (start < fileSize) {
      const chunk = selectedFile.slice(start, end);
      const formData = new FormData();
      formData.append('file_chunk', chunk);
      formData.append('file_name', selectedFile.name);
      formData.append('file_size', selectedFile.size);

      
      try {
        
          resp_upload = await axios.post(BACKEND_URL+BACK_END_API_CHUNK_FILE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${AUTH_TOKEN}`,
              },
            });
          start = end;
          end = Math.min(start + CHUNK_SIZE, fileSize);
          
          let inputNumber = (resp_upload.data.uploaded_partial_size/fileSize)*100
          let actual_percent = inputNumber.toString().match(/\d{2}/)

          setpercent_uploaded(actual_percent["input"])
          setshow_uploading_bar(true)
          
          if(resp_upload.data.uploaded_partial_size==fileSize){
            setshow_uploading_bar(false)
            
                try{
                  if(resp_upload.status==200){
                      setmessage_from_backend(resp_upload.data.message)

                      const resp_second = await fetchData(BACKEND_URL+BACK_END_API_CONVERT_AUDIO,AUTH_TOKEN)
                      if(resp_second.status==200){
                        setmessage_from_backend(resp_second.data.message)

                        const resp_third = await fetchData(BACKEND_URL+BACK_END_API_EXTRACT_SPEECH_FROM_VIDEO,AUTH_TOKEN)
                        if(resp_third.status==200){
                          
                          setmessage_from_backend(resp_third.data.message)
                          const resp_fourth = await fetchData(BACKEND_URL+BACK_END_API_RECAP_OF_AUDIO,AUTH_TOKEN)
                          
                          if(resp_fourth.status==200){
                            setLoadingButton(false)
                            setsummarize_text(resp_fourth.data[0]["summarize_text"])
                            setsummarize_text_id(resp_fourth.data[0]["id"])
                            setGeneratingSummarize(false)
                            setSelectedFile(null)
              
                          }else{
                            if(resp_fourth.response.data.message){
                              notifyerror(resp_fourth.response.data.message)
                            }
                            notifyerror(message_data)
                          }
              
                        }else{
              
                          if(resp_third.response.data.message){
                            notifyerror(resp_third.response.data.message)
                          }
                          notifyerror(message_data)
              
                        }



                      }else{
                        if(resp_second.response.data.message){
                          notifyerror(resp_second.response.data.message)
                        }
                        notifyerror(message_data)
                      }

                    }else{
                      if(resp_upload.response.data.message){
                        notifyerror(resp_upload.response.data.message)
                      }
                      notifyerror(message_data)
                  }

                }catch(e){

                }

          }

      } catch (error) {
        console.error('Error uploading file:', error);
        break;
      }

    }

    // try{
    //   // console.log(resp_upload.data)
    //   if(resp_upload.status==201){
    //       setmessage_from_backend(resp_upload.data.message)

    //   }else{

    //   }
    // }catch(e){

    // }



    // const resp = await fileFormData(formData,BACKEND_URL+BACK_END_API_AUDIO_SUMMARIZE,AUTH_TOKEN)
    // if(resp.status==200){
    //   setLoadingButton(false)
    //   setsummarize_text(resp.data[0]["summarize_text"])
    //   setsummarize_text_id(resp.data[0]["id"])
    //   setGeneratingSummarize(false)
    //   setSelectedFile(null)
    // }else{
    //   setLoadingButton(false)
    //   setGeneratingSummarize(false)
    //   setSelectedFile(null)
    //   try{
    //     if(resp.response.data.message){
    //       notifyerror(resp.response.data.message)
    //     }
    //   }catch(e){
    //     notifyerror("We adhere to strict guidelines ensuring the responsible creation of content, prioritizing the avoidance of any harmful or offensive imagery.")
    //   }
    // }

  };



  // ======get the history====

  const [history_data,set_history_data]=useState(null)

  const get_history = async() =>{
    if(selectedTab=="upload"){
      const resp = await fetchData(BACKEND_URL+BACK_END_API_HISTORY_AUDIO_VIDEO,AUTH_TOKEN)
      if(resp.status==200){
        console.log(resp.data)
        set_history_data(resp.data)
      }
    }
    if(selectedTab=="url"){
      const resp = await fetchData(BACKEND_URL+BACK_END_API_HISTORY_URL,AUTH_TOKEN)
      if(resp.status==200){
        console.log(resp.data)
        set_history_data(resp.data)
      }
    }
  }
  const get_history_click = async(data) =>{
    if(data=="upload"){
      const resp = await fetchData(BACKEND_URL+BACK_END_API_HISTORY_AUDIO_VIDEO,AUTH_TOKEN)
      if(resp.status==200){
        console.log(resp.data)
        set_history_data(resp.data)
      }
    }
    if(data=="url"){
      const resp = await fetchData(BACKEND_URL+BACK_END_API_HISTORY_URL,AUTH_TOKEN)
      if(resp.status==200){
        console.log(resp.data)
        set_history_data(resp.data)
      }
    }
  }




  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    // const fileSize = file.size;
    // let start = 0;
    // let end = CHUNK_SIZE;

    // while (start < fileSize) {
    //   const chunk = file.slice(start, end);
    //   const formData = new FormData();
    //   formData.append('file_chunk', chunk);
    //   formData.append('file_name', file.name);
    //   formData.append('file_size', file.size);

    //   try {
    //     await axios.post(BACKEND_URL+BACK_END_API_CHUNK_FILE, formData, {
    //       headers: {
    //         'Content-Type': 'multipart/form-data',
    //       },
    //     });
    //     start = end;
    //     end = Math.min(start + CHUNK_SIZE, fileSize);
    //   } catch (error) {
    //     console.error('Error uploading file:', error);
    //     break;
    //   }
    // }

    // alert('File uploaded successfully!');
  };



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
                      className="dark:bg-black dark:text-white z-20 top-9  left-[280px] w-8 h-8 flex bg-white items-center justify-center text-black font-bold rounded"
                    >
                      <IoMdArrowBack />
                    </button>
                    <img
                      className="w-full h-full object-contain rounded-full"
                      src="https://aiprojectfilestorage.s3.ap-southeast-2.amazonaws.com/frontend-images/recap_builder.png"
                    />
                  </div>
                  <div className="flex-1 pl-6">
                    <h1 className="font-bold text-xl">
                        Recap Builder
                    </h1>
                    <p className="text-sm">Turn your videos and audios into clear, informative summaries effortlessly, adding professionalism and clarity to your content with ease.</p>
                  </div>

                  <div className="mt-6">
                        {subscriptions_details &&
                            <>
                              {subscriptions_details.user.plan=="starter" 
                              && 
                              subscriptions_details.user.status=="active"
                              ?
                                <TooltipInfo
                                  text={"Your plan gives 50 min video per month "}
                                />
                              :
                                null
                              }
                              {subscriptions_details.user.plan=="premium"
                              && 
                              subscriptions_details.user.status=="active"
                              ?
                                <TooltipInfo
                                  text={"Your plan gives 200 min per month "}
                                />
                              :
                                null
                              }
                              {subscriptions_details.user.status=="trial"
                              ?
                                <TooltipInfo
                                  text={"You can only use 10 minutes videos in trial"}
                                />
                              :
                                null
                              }
                            </>
                            }
                        </div>

                </div>

                <div className="dark:bg-black grow p-3 xl:p-6 xl:pb-28 flex-1 space-y-6 xl:overflow-y-auto">

                <div className="flex flex-col">
                  <div>
                    <p className="text-sm font-bold ml-3">
                      Media
                    </p>
                  </div>
                  <div>
                    <span className="text-sm ml-3">
                      Select a recording
                    </span>
                  </div>

                  <div>

                  <div className="flex mt-4">
                    <button
                      className={`${
                        selectedTab === "url"
                          ? " text-black border-t-2 border-r-2  border-l-2"
                          : "text-gray-400  border-t-2 border-r-2 border-b-2 border-l-2"
                      } dark:border-slate-500 p-1 text-sm font-bold rounded-l-md cursor-pointer transition duration-300 dark:text-white`}
                      tabIndex="-1"
                      type="button"
                      onClick={() => {
                          handleTabClick("url")
                          setSelectedFile(null)
                          setError("")
                          get_history_click("url")
                        }}
                    >
                      Add URL
                    </button>
                    <button
                      className={`${
                        selectedTab === "upload"
                          ? "  text-black border-t-2 border-r-2"
                          : " text-gray-400 border-t-2 border-r-2 border-b-2"
                      } dark:border-slate-500 p-1 text-sm font-bold rounded-r-md cursor-pointer transition duration-300 dark:text-white`}
                      tabIndex="0"
                      type="button"
                      onClick={() => {
                          handleTabClick("upload")
                          setUrl('')
                          get_history_click("upload")
                        }}
                    >
                      Upload file
                    </button>
                  </div>

              {/* Content for Add URL Tab */}
              {selectedTab === "url" && (
                <div className="mt-4">
                <div id="id-art" className="ml-3 mt-3">
                    {/* ====url text-area===== */}
                    <div className="last:mb-1 relative">
                    <div className="space-y-1.5 w-full">
                        <label
                        htmlFor="form-field-productInfo"
                        className="text-sm font-medium block text-gray-900 placeholder:text-gray-400 transition-[color] duration-150 ease-in-out"
                        >
                        <span className="dark:text-white font-bold flex items-center space-x-1 ">
                            Add a YouTube URL
                        </span>
                        <span className="dark:text-white">Paste a link to a YouTube video</span>
                        </label>
                        <div className="dark:bg-gray-800 py-2.5 relative gap-2 bg-white w-full px-3 rounded-lg ring-1 hover:ring-2 transition-all duration-150 ease-in-out ring-gray-200 outline-none focus-within:!ring-1">
                        <input
                            id="form-field-productInfo"
                            className="dark:bg-gray-800 dark:text-gray-200 block w-full text-gray-900 placeholder:text-gray-400 text-sm font-normal resize-none outline-none max-h-64 overflow-y-auto"
                            value={url}
                            onChange={handleInputChange}
                            placeholder="https://www.youtube.com/watch?v=Tuw8hxrFBH8&t"
                        />
                        </div>
                    </div>

                    
                    </div>
                    {/* ====url text-area===== */}

                    </div>

                    

                    {subscriptions_details &&
                    <>
                      {subscriptions_details.user.status=="trial"
                        ?
                        <div className="flex mt-4 items-center dark:bg-gray-600 bg-blue-400 text-white text-sm font-bold px-4 py-3" role="alert">
                          <svg className="fill-current w-4 h-4 mr-2 " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"/></svg>
                          <p className="dark:text-white">You can only use 10 minutes videos in trial</p>
                        </div>
                        
                        :
                          null
                        }
                      </>
                    }
                              
                    
                </div>
              )}

            {/* Content for Upload New File Tab */}
            {selectedTab === "upload" && (
              <div className="mt-4">
                <p 
                  className="text-sm font-bold block text-gray-900 placeholder:text-gray-400 transition-[color] duration-150 ease-in-out"
                >Upload File Content Here</p>
                {/* Add your file upload input or content here */}
                <div
                  className={`w-full mt-3 p-8 bg-white border-2 border-dashed rounded-lg dark:text-white  dark:bg-gray-600 ${
                    dragging ? "border-green-500" : "border-gray-300"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  {selectedFile ? (
                    <div>
                      <p className="text-green-500 text-center">
                        File selected: {selectedFile.name} (
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)                        
                      </p>
                      {error && <p className="text-red-500 text-center">{error}</p>}
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-500 text-center">
                          Drag and drop your file here or{" "}
                        <label
                          htmlFor="fileInput"
                          className="text-green-500 cursor-pointer hover:underline"
                        >
                          select a file
                        </label>{" "}
                        from your device.
                      </p>
                      {error && <p className="text-red-500 text-center">{error}</p>}
                    </div>
                  )}
                  <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    onChange={handleFileInputChange}
                    accept=".mp3, .mp4, .srt" // Define your supported file types here
                  />
                </div>
                  
                {show_uploading_bar
                ?
                  <Progressbar 
                    percent_uploaded={percent_uploaded}
                  /> 
                :
                  null
                }

                <div>
                        {subscriptions_details &&
                            <>
                              {subscriptions_details.user.plan=="starter" 
                              && 
                              subscriptions_details.user.status=="active"
                              ?
                                <div className="flex flex-col mt-4  bg-blue-400 text-white text-sm font-bold px-4 py-3" role="alert">
                                <div className="flex">
                                  <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"/></svg>
                                  <p>Your subscription give 50 minutes videos per month</p>
                                </div>
                                <div className="ml-6">
                                  <p>Upload Only 24MB of Video of format 
                                  <strong className="ml-3">.mp3, .mp4, .srt .avi</strong>
                                  </p>
                                </div>
                                </div>
                              :
                                null
                              }
                              {subscriptions_details.user.plan=="premium"
                              && 
                              subscriptions_details.user.status=="active"
                              ?
                                <div className="flex flex-col mt-4  bg-blue-400 text-white text-sm font-bold px-4 py-3" role="alert">
                                <div className="flex">
                                  <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"/></svg>
                                  <p>Your subscription give 200 minutes videos per month </p>
                                </div>
                                <div className="ml-6">
                                  <p>Upload Only 24MB of Video of format 
                                  <strong className="ml-3">
                                  .mp3, .mp4, .srt .avi
                                  </strong>
                                  </p>
                                </div>
                                </div>
                              :
                                null
                              }
                            </>
                            }
                      </div>


                {subscriptions_details &&
                    <>
                      {subscriptions_details.user.status=="trial"
                        ?
                        <div className="dark:bg-gray-600 flex flex-col mt-4  bg-blue-400 text-white text-sm font-bold px-4 py-3" role="alert">
                                <div className="flex">
                                  <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"/></svg>
                                  <p className="dark:text-white">You can only use 10 minutes videos in trial</p>
                                </div>
                                <div className="ml-6">
                                  <p className="dark:text-white">Upload Only 24MB of Video of format 
                                  <strong className="ml-3 dark:text-white">
                                  .mp3, .mp4, .srt .avi
                                  </strong>
                                  </p>
                                </div>
                            </div>
                        :
                          null
                        }
                      </>
                    }


              </div>
            )}
   
                  </div>


                 

                </div>

                  
                </div>
                 
                <div className="pointer-events-none xl:bottom-0 xl:sticky xl:w-full xl:left-0 xl:z-20 @container">
                  <div className="dark:bg-black flex flex-row items-center justify-between p-3 border-b border-gray-200 pointer-events-auto bg-gray-50 xl:bg-white xl:border-t xl:border-0 xl:border-gray-200 xl:py-3 xl:px-6">
                    <button
                      type="button"
                      className="transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm  hover:ring-2 active:ring-1"
                      onClick={()=>{
                        // setImageUrls([])
                      }}
                    >
                      <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                        <span className="hidden @sm:inline-block text-black">
                          Clear inputs
                        </span>
                      </span>
                    </button>
                    <div className="flex ">


                      {/* =======for url====== */}
                      
                      {selectedTab === "url" && (
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
                      )}
                    {/* =======for url====== */}

                      {/* =======for file====== */}

                      {selectedFile &&
                      <>
                        {(selectedFile.size / 1024 / 1024).toFixed(2)>=23.9
                        ?
                          <>
                          {selectedFile ? (
                                <button
                                  type="submit"
                                  className="w-[200px] transition-all duration-200 relative font-semibold outline-none hover:outline-none focus:outline-none rounded-lg px-4 py-2 text-base text-white bg-gradient-to-r  shadow-sm bg-red-500"
                                  id="generateBtn1"
                                  onClick={()=>{
                                    setSelectedFile(null)
                                  }}
                                >
                                  File must be less then 24 MB
                                  ( Delete file )
                                </button>
                              )
                              :
                                null
                              }
                          </>
                        :
                          <>
                              {selectedFile ? (
                                <button
                                  type="submit"
                                  className="w-[200px] transition-all duration-200 relative font-semibold outline-none hover:outline-none focus:outline-none rounded-lg px-4 py-2 text-base text-white bg-gradient-to-r  shadow-sm bg-[#334977]"
                                  id="generateBtn1"
                                  onClick={uploadFile}
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
                                      <>
                                        Generate
                                      </>
                                    )}
                                        {/* 24117248 */}
                                  </span>
                                </button>
                              )
                              :
                                null
                              }
                          </>
                        }

                      </>
                      }
                      
                    {/* =======for file====== */}
                     


                    </div>
                  </div>
                </div>
              </div>

              <div className="dark:bg-black dark:text-gray-200 dark:border-slate-500  lg:w-1/2 items-center justify-center max-h-full bg-white font-semibold text-[17px] text-black border-l border-gray-300 overflow-y-auto">
                <div className="dark:bg-black dark:text-gray-200 dark:border-slate-500  sticky top-0 flex items-center px-3 bg-white border-b border-gray-200">
                  <nav
                    className="flex flex-grow py-1 space-x-3"
                    aria-label="Tabs"
                  >
                    <button
                      className="relative dark:bg-gray-700 dark:text-white whitespace-nowrap py-2 px-3 text-xs font-medium bg-gray-100 rounded-lg text-black transition-all duration-150 hover:text-black"
                      onClick={() => {
                        setShowHideHistory(false);
                      }}
                    >
                      <span className="relative">
                        Outputs
                      </span>
                    </button>
                    <button
                      className="relative dark:bg-gray-700 dark:text-white whitespace-nowrap py-2 px-3 text-xs font-medium bg-gray-100 rounded-lg text-black transition-all duration-150 hover:text-black"
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
                        setsummarize_text_id(null)
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
                            r_id={summarize_text_id}
                            r_time={created_time}
                            r_data={summarize_text}
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
                                        <p>{message_from_backend}</p>
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

                

                {/* {ShowHideHistory ? (
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
                )} */}
                
              </div>

              <Toaster />
            </div>
          </>
      </div>
    </>
  );
};

export default RecapBuilder;
