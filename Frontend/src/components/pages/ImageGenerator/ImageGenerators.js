import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  BACKEND_URL,
  BACK_END_API_GENERATE_IMAGE
} from "../../../apis/urls";
import { fetchData, postData } from "../../../apis/apiService";
import { IoMdArrowBack } from "react-icons/io";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { NavIcons, SealCheck } from "../../Icons";

import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import LoadingPage from "../../LoadingPage";
import toast, { Toaster } from "react-hot-toast";

import BouncingDotsLoader from "../../BouncingDotsLoader";
import { useSelector, useDispatch } from "react-redux";
import { _save_details_ } from "../../../features/Subscriptions";
import TooltipInfo from "../../Icons/TooltipInfo";

import ResponseTemplate from "../Template/ResponseTemplate";
import SelectOptionsTemplate from "../Template/SelectOptionsTemplate/SelectOptions";

import { setDocumentTitle } from '../../NavBar/DynamicTitle';

import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import { Carousel } from "react-responsive-carousel";
import { FaDownload } from "react-icons/fa"; // Import the download icon from react-icons
import Downloadicon from "../../Icons/Downloadicon";



const ImageGenerators = ({ AUTH_TOKEN }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  useEffect(() => {
    setDocumentTitle("Generate Image");
  });

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

    let subscriptions_check = useSelector(
      (state) => state.SetSubscriptions.Subscriptions
    );
    let subscriptions_details = useSelector(
      (state) => state.SetSubscriptionsData.SubscriptionsData
    );

  const { template_id } = useParams();

  const searchParams = new URLSearchParams(location.search);
  const custom = searchParams.get('custom');


  const notifyerror = (message) => toast.error(message);
  const notifysucces = (message) => toast.success(message);



// ======the textarea restriction====

const [GeneratingImage, setGeneratingImage] = useState(false);
const [text, setText] = useState("");
const maxWords = 500;
const maxCharacters = 500

const handleTextChange = (event) => {
  const inputValue = event.target.value;
  const words = inputValue.trim().split(/\s+/);
  const wordCount = words.length;
  const charCount = inputValue.length;

  if (wordCount <= maxWords && charCount <= maxCharacters) {
    setText(inputValue);
  }
};

const wordCount = text.trim().split(/\s+/).filter((word) => word !== "").length;
const charCount = text.length;


// =======generate image=========
const [imageUrls, setImageUrls] = useState([]);
  const [generateText, setGenerateText] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const handleGenerateTextChange = (event) => {
    setGenerateText(event.target.value);
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleClickGenerateImage = (index) => {
    if (index !== null) {
      const selectedImageUrl = imageUrls[index];
      fetch(selectedImageUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.blob();
        })
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "image.jpg"; // Specify the filename you want
          a.click();
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.error("Error fetching image:", error);
        });
    }
  };

  const handleBackClick = () => {
    setSelectedImageIndex(null);
  };



  const generate_image = async()=>{
      if(text.length<=0){
          notifyerror("Your need say something to generate image")
          return true
        }
        setLoadingButton(true)
        setGeneratingImage(true)
        const fromData = {
            "data":text
        }
        const resp = await postData(fromData,BACKEND_URL+BACK_END_API_GENERATE_IMAGE,AUTH_TOKEN)
        if(resp.status==200){
            setImageUrls(resp.data.image_urls)
            setLoadingButton(false)
            console.log(resp.data)
            setGeneratingImage(false)
            setText("")
        }else{
          try{
              notifyerror(resp.response.data.message)
          }catch(e){
              notifyerror("We adhere to strict guidelines ensuring the responsible creation of content, prioritizing the avoidance of any harmful or offensive imagery.")
          }
            setLoadingButton(false)
            setGeneratingImage(false)
    }
  }



  return (
    <>
      <div className="relative lg:-m-6">
          <>
            <div className="flex flex-col lg:flex-row lg:max-h-[calc(100vh-75px)]">
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
                      src="https://uffiafilestorage.s3.amazonaws.com/frontend-images/art-generator.png"
                    />
                  </div>
                  <div className="flex-1 pl-6">
                    <h1 className="font-bold text-xl">
                      Art Generator
                    </h1>
                      <div className="flex">
                        <div>
                          <p className="text-sm">Unlock Infinite Artistry: Where Imagination Meets AI Innovation for Limitless Creative Expression!</p>
                        </div>
                       
                        <div>
                        {subscriptions_details &&
                            <>
                              {subscriptions_details.user.plan=="starter" 
                              && 
                              subscriptions_details.user.status=="active"
                              ?
                                <TooltipInfo
                                  text={"Your plan gives 50 image per month "}
                                />
                              :
                                null
                              }
                              {subscriptions_details.user.plan=="premium"
                              && 
                              subscriptions_details.user.status=="active"
                              ?
                                <TooltipInfo
                                  text={"Your plan gives 200 image per month "}
                                />
                              :
                                null
                              }
                              {subscriptions_details.user.status=="trial"
                              ?
                                <TooltipInfo
                                  text={"To use image generation upgrade your plan"}
                                />
                              :
                                null
                              }
                            </>
                            }
                        </div>
                        
                      </div>
                    
                  </div>
                </div>

                <div className="dark:bg-black grow p-3 xl:p-6 xl:pb-28 flex-1 space-y-6 xl:overflow-y-auto">
                  <div id="id-art">
                    

                    {/* ====art text-area===== */}
                    <div className="last:mb-1 relative">
                    <div className="space-y-1.5 w-full">
                        <label
                        htmlFor="form-field-productInfo"
                        className="text-sm font-medium block text-gray-900 placeholder:text-gray-400 transition-[color] duration-150 ease-in-out"
                        >
                        <span className="flex items-center space-x-1">
                            <span className="dark:text-white">Image Description</span>
                        </span>
                        </label>
                        <div className="dark:bg-gray-800 py-2.5 relative gap-2 bg-white w-full px-3 rounded-lg ring-1 hover:ring-2 transition-all duration-150 ease-in-out ring-gray-200 outline-none focus-within:!ring-1">
                        <textarea
                            id="form-field-productInfo"
                            className="dark:bg-gray-800 dark:text-gray-200 block w-full h-[300px] text-gray-900 placeholder:text-gray-400 text-sm font-normal resize-none outline-none max-h-64 overflow-y-auto"
                            name=""
                            placeholder="Magical forest with glowing trees, a colorful serpent, a ghostly harpist, and glowing flowers, where dreams come to life."
                            value={text}
                            onChange={handleTextChange}
                        ></textarea>
                        </div>
                        <div className="flex items-center gap-2">
                        
                        <span className="ml-auto text-xs text-gray-500 transition-[color] duration-150 ease-in-out">
                        
                            {charCount}/500 words
                        </span>
                        </div>
                        
                    </div>
                    </div>
                    {/* ====art text-area===== */}
                        
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
                          <>
                            <button
                              type="submit"
                              className="w-[200px] transition-all duration-200 relative font-semibold outline-none hover:outline-none focus:outline-none rounded-lg px-4 py-2 text-base text-white bg-gradient-to-r  shadow-sm bg-[#334977]"
                              id="generateBtn1"
                              onClick={() => {
                                  generate_image()
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
                                  "Generate an Image"
                                )}
                              </span>
                            </button>
                          </>
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
                      className="dark:bg-gray-700 dark:text-gray-200  relative whitespace-nowrap py-2 px-3 text-xs font-medium rounded-lg "
                      onClick={() => {
                      }}
                    >
                    </button>
                    <button
                      className="dark:bg-gray-700 dark:text-gray-200 relative whitespace-nowrap py-2 px-3 text-xs font-medium rounded-lg "
                      onClick={() => {
                      }}
                    >
                    </button>
                  </nav>
                  <div>
                    <button
                      className="relative whitespace-nowrap px-3 py-2 text-xs font-medium leading-4 text-black-400 transition-all duration-150 hover:text-gray-600"
                      onClick={() => {
                        setImageUrls([]);
                      }}
                    >
                      <span className="relative">Clear</span>
                    </button>
                  </div>
                </div>


            <div className="w-[80%] p-2 m-auto">
                {imageUrls &&
                    <>
                    {imageUrls.length>0
                    ?
                    <>
                        {imageUrls.map((url, index) => (
                            <div key={index} className="relative">
                            <img
                                src={url}
                                className="m-1 p-1 w-[800px] h-[300px] shadow-1xl hover:shadow-3xl rounded-xl hover:bg-slate-300 hover:cursor-pointer"
                                alt={`Image ${index + 1}`}
                            />
                            <button
                                className="text-white  px-2 py-1 mr-1  rounded-full absolute top-2 right-2"
                                onClick={() => handleClickGenerateImage(index)}
                            >
                                <Downloadicon/>

                            </button>
                            </div>
                        ))}
                        {selectedImageIndex !== null && (
                        <div className="text-center">
                            <button
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                            onClick={handleBackClick}
                            >
                            Back
                            </button>
                        </div>
                        )}
                        
                    </>
                    :
                    <>
                        <div className="mt-[25%] w-[400px] ml-[20%] max-w-lg relative py-3 pl-8 space-x-2 text-xs text-gray-400 rounded-md ring-1 ring-gray-200">
                       
                        {GeneratingImage
                        ?
                        <>
                        <div className="flex-grow pl-2 pr-4 text-left">
                                <div className="mb-1 text-sm font-medium text-gray-500">
                                <div className="mt-3 flex flex-col items-center justify-center">
                                    <div>
                                        <p>Generating Image ...</p>
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
                                Enhance visual impact by experimenting with a diverse range of image inputs, each of varying lengths and content. Achieve optimal results as you explore the creative possibilities in the world of images.
                                </div>
                            </div>
                        </>
                        }
                        </div>
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

export default ImageGenerators;
