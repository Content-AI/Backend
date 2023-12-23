import React , {useState,useEffect}from 'react'
import { IoMdArrowBack, IoMdRefresh } from "react-icons/io";
import { fetchData, postData } from '../../../apis/apiService';
import { BACKEND_URL,BACK_END_API_BRAND_VOICE,BACK_END_API_BRAND_VOICE_URLS,BACK_END_API_BRAND_VOICE_FILE } from '../../../apis/urls';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import './index.css';
import axios from 'axios';

import UrlIcon from '../../Icons/UrlIcon'
import FileIcon from '../../Icons/FileIcon'
import FileTextUrl from '../../Icons/FileTextUrl'
import TooltipInfo from '../../Icons/TooltipInfo';

const ModalAddVoice = (props) => {

    let navigate = useNavigate();

    const [showInitialsetup,setshowInitialsetup]=useState(true)
    const [showTextInputBox,setshowTextInputBox]=useState(false)
    const [analyzingdata,setanalyzingdata]=useState(false)
    const [response,setresponse]=useState(false)
    
    const [responseData,setresponseData]=useState([])
    
    // for urls
    const [showTextUrl,setshowTextUrl]=useState(false)

    const [text, setText] = useState('');
    const [titletext, settitletext] = useState('');
    const [textlen, settextlen] = useState(0);
    const [titlelen, settitlelen] = useState(0);


    const notifyerror = (message) => toast.error(message);
    const notifysucces = (message) => toast.success(message);


    const handleTextareaChange = (event) => {
        const inputText = event.target.value;
        if (inputText.length <= 6500) {
          setText(inputText);
        }
      };
      useEffect(()=>{
        settextlen(text.length)
      },[text])
    const handleTexttitleChange = (event) => {
        const inputText = event.target.value;
        if (inputText.length <= 30) {
            settitletext(inputText);
        }
      };
      useEffect(()=>{
        settitlelen(titletext.length)
      },[titletext])
    
      const save_context_brand_voice = async() => {
        if(titlelen<=0){
            notifyerror("Did you forgot to provide Title")
            return true
        }
        if(textlen<=0){
            notifyerror("Did you forgot to provide Brand Voice")
            return true
        }
        setshowTextInputBox(false)
        setanalyzingdata(true)
        const formData = {
            content:text,
            brand_voice:titletext
        }
        const resp  = await postData(formData,BACKEND_URL+BACK_END_API_BRAND_VOICE,props.AUTH_TOKEN)
        if(resp.status==201){
            notifysucces("Brand voice created")
            setanalyzingdata(false)
            setresponse(true)
            setresponseData(resp.data)
            }else{
                try{
                    if(resp.response.data.message=="That's limit for trail"){
                        notifyerror("upgrade plan")
                    }
                }catch(e){
                    notifyerror("something went wrong")
                }
                setanalyzingdata(false)
                setresponse(false)
        }
        setshowTextInputBox(false)
      }




    //   ========For Url==============
    const [url, setUrl] = useState('');
    const [isValidUrl, setIsValidUrl] = useState(true);
    const [brandVoiceUrl, setBrandVoiceUrl] = useState('');
    const [analyze_url_tone,setanalyze_url_tone] = useState(false);

  
    const handleInputChangeUrl = (event) => {
      setUrl(event.target.value);
      setIsValidUrl(isValidURL(event.target.value));
    };
    const handleInputChangeBrandVoiceUrl = (event) => {
        setBrandVoiceUrl(event.target.value);
      };
    
  
    const isValidURL = (inputURL) => {
      // Simple URL validation logic (can be customized)
      try {
        new URL(inputURL);
        return true;
      } catch (error) {
        return false;
      }
    };
  
    const handleButtonClickUrl = async() => {
        if(brandVoiceUrl==""){
            notifyerror("You forgot to put Tone name")
            return true
        }
      if (isValidUrl) {
        setanalyzingdata(true)
        setshowTextUrl(false)
        // BACK_END_API_BRAND_VOICE_URLS
        const formData = {
            brand_voice:brandVoiceUrl,
            urls: [
                url
              ]
        }
        const resp  = await postData(formData,BACKEND_URL+BACK_END_API_BRAND_VOICE_URLS,props.AUTH_TOKEN)
        if(resp.status==200){
            setanalyzingdata(false)
            notifysucces("Brand voice created")
            setresponse(true)
            setresponseData(resp.data)
            }else{
            setshowTextUrl(true)
            setanalyze_url_tone(false)
            setanalyzingdata(false)
            // =="That's limit for trail"
            if(resp.response.data.message){
              // console.log(resp.response.data.message)
              notifyerror(resp.response.data.message)
            }else{
              notifyerror("we cannot read this ulr sorry")
            }
              
          }
        } else {
        notifyerror("Please enter a valid URL.")
      }
      setanalyze_url_tone(false)
    };

// =======file upload to analyze
const [file_upload_form,setfile_upload_form] = useState(false);
const [file, setFile] = useState(null);
const [brandVoiceFileTitle, setBrandVoiceFileTitle] = useState('');
const [errorMessage, setErrorMessage] = useState('');

const handleFileChange = (e) => {
  const selectedFile = e.target.files[0];
  if (selectedFile) {
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

    // Allowed file extensions
    const allowedExtensions = ['txt', 'docx', 'pdf'];

  
    if (allowedExtensions.includes(fileExtension)) {

            // Check if the selected file size is less than or equal to 10MB (in bytes)
            const maxSize = 10 * 1024 * 1024; // 10MB in bytes
            if (selectedFile.size <= maxSize) {
            // File size is within the limit, proceed with setting the file
            setFile(selectedFile);
            } else {
            // File size exceeds the limit, show an error message or take appropriate action
            notifyerror('File size exceeds the limit of 10MB');
            // Clear the input field
            e.target.value = null;
        }
    }else{
        // Handle the case where the file extension is not allowed
        notifyerror('Only .txt, .docx, and .pdf files are allowed.');
        // Reset the file input to allow selecting a new file
        e.target.value = null;

    }
  }
};

const handleBrandVoiceFileTitleChange = (e) => {
  setBrandVoiceFileTitle(e.target.value);
};

const handleUploadFile = async () => {
  if (!file || !brandVoiceFileTitle) {
    notifyerror("Please select a file and provide a brand voice title.")
    return;
  }
  setfile_upload_form(false)
  setanalyzingdata(true)

  const formData = new FormData();
  formData.append('file', file);
  formData.append('brand_voice', brandVoiceFileTitle);

  try {
    const response = await axios.post(BACKEND_URL+BACK_END_API_BRAND_VOICE_FILE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${props.AUTH_TOKEN}`
      },
    });

    setFile(null);
    setBrandVoiceFileTitle('');
    setanalyzingdata(false)
    notifysucces("Brand voice created")
    setresponse(true)
    setresponseData(response.data)
  } catch (error) {
    setfile_upload_form(true)
    setanalyzingdata(false)
    notifyerror('Please Upload valid file like pdf,doc and text file with good content');
  }
};


  return (
    <>
 
            <div className="flex flex-col bg-gray-50 p-3 dark:bg-slate-700">
                <div className="border dark:bg-slate-800 border-gray-200 bg-white rounded-2xl mb-8 p-6 h-auto">
                <button
                    className='dark:text-white'
                    onClick={() => {
                        setshowTextInputBox(false)
                        setshowTextUrl(false)
                        setanalyzingdata(false)
                        setshowInitialsetup(true)
                        setresponse(null)
                        setresponseData(null)
                        setText('')
                        settextlen(0)
                        settitlelen(0)
                        settitletext('')
                        setfile_upload_form(false)
                    }}
                    >
                        <IoMdRefresh/>
                </button>
                {response
                ?
                null
                :
                <>
                    <div className="flex justify-between">
                        <h2 className="dark:text-white font-semibold text-lg">Incorporate your content to enable AI to emulate your unique writing style.</h2>
                        <p className="text-gray-500 text-sm font-bold">
                        {showInitialsetup?"1/3":null}{showTextInputBox?"2/3":null}{analyzingdata?"3/3":null}
                        </p>
                    </div>
                    <p className="dark:text-white text-gray-600 text-sm pb-3">AI, can deduce your brand's voice from your website, text, or document. Choose one of the methods below to input your brand content into Jasper.</p>
                </>
                }


                <div className="md:flex justify-around">
                {showInitialsetup ? (
                      <>
                        <button
                          className="flex-1 border mb-1 dark:bg-gray-700 dark:text-gray-200 dark:border-slate-500 bg-gray-50 rounded-2xl cursor-pointer mr-3"
                          onClick={() => {
                            setshowInitialsetup(false);
                            setshowTextUrl(true);
                          }}
                        >
                          <div className=" py-6 text-center">
                            <div className="flex justify-center dark:text-white">
                              <UrlIcon />
                            </div>
                            <h3 className="dark:text-white font-medium">Using Urls</h3>
                            <p className="dark:text-white text-gray-600 text-xs">copy and paste url</p>
                          </div>
                        </button>

                        <button
                          className="flex-1 border bg-gray-50 rounded-2xl cursor-pointer mr-3 dark:bg-gray-700 dark:text-gray-200 dark:border-slate-500"
                          onClick={() => {
                            setshowInitialsetup(false);
                            setanalyzingdata(false);
                            setfile_upload_form(true);
                          }}
                        >
                          <div className="py-6 text-center">
                            <div className="flex justify-center">
                              <FileIcon />
                            </div>
                            <h3 className="font-medium dark:text-white">From File</h3>
                            <p className="text-gray-600 text-xs dark:text-white">Upload Your File we will analyze the tone</p>
                          </div>
                        </button>

                        <button
                          className="flex-1 border bg-gray-50 rounded-2xl cursor-pointer mr-3 dark:bg-gray-700 dark:text-gray-200 dark:border-slate-500"
                          onClick={() => {
                            setshowInitialsetup(false);
                            setanalyzingdata(false);
                            setshowTextInputBox(true);
                          }}
                        >
                          <div className="py-6 text-center">
                            <div className="flex justify-center">
                              <FileTextUrl />
                            </div>
                            <h3 className="font-medium dark:text-white">From text</h3>
                            <p className="text-gray-600 text-xs dark:text-white">Write or copy and paste text</p>
                          </div>
                        </button>
                      </>
                    ) : null}

                
                    {/* =========pdf data======================= */}
                    {file_upload_form
                    ?
                    <>
                                  <div className="space-y-1.5 w-full">
                                        <div className="flex justify-between">
                                            <h1 className="dark:text-white text-base font-semibold pb-2">Name this voice</h1>
                                        </div>
                                        <div className="dark:bg-gray-800 space-y-1.5 w-full">
                                            <label htmlFor="name" className="sr-only"><span className="flex items-center space-x-1"><span className='dark:text-white'>Make it easier to know which tone you're using when writing</span></span></label>
                                            <div className="dark:bg-gray-800 dark:text-white py-1 !mt-0 flex items-center gap-2 bg-white w-full px-3 rounded-lg ring-1 hover:ring-2 transition-all duration-150 ease-in-out ring-gray-200 outline-none focus-within:!ring-1">
                                                <div className="dark:bg-gray-800 flex items-center grow gap-2 py-1.5">
                                                <div className="dark:bg-gray-800 flex gap-1 grow">
                                                    <input id="name" type="text" 
                                                    className="dark:bg-gray-800 dark:text-gray-300 block w-full text-gray-900 placeholder:text-gray-400 text-sm font-normal resize-none outline-none" 
                                                    placeholder="e.g. My Brand voice for Blog, article" 
                                                    name="brandVoiceFileTitle"
                                                    value={brandVoiceFileTitle}
                                                    onChange={handleBrandVoiceFileTitleChange}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2"><span className="dark:text-white ml-auto text-xs text-gray-500 transition-[color] duration-150 ease-in-out">
                                                    {brandVoiceFileTitle.length}/30</span>
                                                </div>
                                                </div>
                                            </div>
                                                <div className="dark:text-white block text-sm font-normal text-gray-500 pt-3">Make it easy to know which voice you're using when writing .
                                                <strong className='ml-1 dark:text-white'>
                                                only .txt , .docx , .pdf of ( 10MB )
                                                </strong></div>
                                                    <label htmlFor="text" className="dark:text-white text-sm font-medium block text-gray-900 placeholder:text-gray-400 transition-[color] duration-150 ease-in-out">
                                                        
                                                    </label>
                                                    <div className="dark:bg-black dark:text-gray-200 dark:border-slate-500 py-2.5 flex items-center gap-2 bg-white w-full px-3 rounded-lg ring-1 hover:ring-2 transition-all duration-150 ease-in-out ring-gray-200 outline-none focus-within:!ring-1">
                                                    <div className="mb-4">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-white">Select File:</label>
                                                    <input type="file" name="file dark:text-white" onChange={handleFileChange} className="border rounded px-3 py-2 w-full" />
                                                    </div>
                                                    </div>
                                        </div>
                                    </div>  

                        </>
                    :
                        null
                    }
                {/* =========pdf data======================= */}

                    {analyzingdata
                    ?
                        <>
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="spinner mb-4"></div>
                            <p className="text-blue-500 font-semibold">Analyzing Tone</p>
                            <p className="text-gray-500 text-sm">Please wait...</p>
                        </div>
                            {/* <div className="flex items-center justify-center flex-col">
                            <div className="w-12 h-12 animate-spin">
                                <svg className="w-full h-full text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <svg className='w-24 h-24' xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" xmlSpace="preserve">
                                        <path d="M93.685,56.065c0,0-1.558,0.606-3.103,1.094c-0.773,0.248-1.542,0.472-2.117,0.629c-0.355,0.089-0.624,0.157-0.794,0.199  c0.544-2.577,0.835-5.248,0.835-7.987c0-1.829-0.136-3.626-0.383-5.388c0.153-0.202,0.395-0.523,0.714-0.946  c0.508-0.714,1.272-1.723,1.841-2.758c0.605-1.039,1.191-2.139,1.619-2.99c0.212-0.431,0.388-0.79,0.512-1.041  c0.127-0.256,0.18-0.399,0.18-0.399c0.23-0.547,0.225-1.238-0.01-1.884c0,0-0.449-1.272-0.952-2.521  c-0.58-1.215-1.16-2.431-1.16-2.431c-0.448-0.921-1.469-1.123-1.927-0.412c0,0-0.921,1.414-1.899,2.724  c-0.771,1.046-1.566,2.015-1.868,2.378c-1.841-4.127-4.385-7.868-7.482-11.075c0.013-0.254,0.029-0.67,0.028-1.218  c-0.016-0.87-0.066-2.055-0.165-3.279c-0.049-0.611-0.109-1.231-0.176-1.818c-0.08-0.57-0.177-1.095-0.26-1.556  c-0.183-0.926-0.305-1.543-0.305-1.543c-0.125-0.592-0.518-1.168-1.071-1.572c0,0-0.068-0.049-0.187-0.136  c-0.125-0.078-0.304-0.188-0.518-0.321c-0.43-0.263-1.004-0.615-1.578-0.966c-0.577-0.346-1.154-0.692-1.587-0.951  c-0.451-0.227-0.751-0.378-0.751-0.378c-0.919-0.451-1.876,0.006-1.823,0.837c0,0,0.097,1.658,0.086,3.268  c0.005,0.793-0.046,1.639-0.081,2.245c-0.024,0.341-0.043,0.608-0.056,0.786c-3.83-2.216-8.076-3.789-12.594-4.577  c-0.147-0.208-0.374-0.528-0.67-0.946c-0.523-0.704-1.255-1.709-2.057-2.611c-1.589-1.778-3.492-3.541-3.492-3.541  c-0.448-0.441-1.102-0.607-1.786-0.586c0,0-1.34,0.07-2.68,0.141c-0.671,0.016-1.334,0.151-1.834,0.214  c-0.499,0.075-0.832,0.124-0.832,0.124c-1.011,0.154-1.519,1.071-0.987,1.722c0,0,1.055,1.302,1.995,2.629  c0.744,1.035,1.41,2.072,1.668,2.479c-4.593,0.477-8.945,1.764-12.914,3.711c-0.245-0.086-0.609-0.214-1.073-0.378  c-0.864-0.312-1.995-0.607-3.179-0.868c-1.183-0.267-2.418-0.496-3.365-0.649c-0.929-0.1-1.549-0.166-1.549-0.166  c-0.596-0.056-1.257,0.152-1.804,0.565c0,0-0.268,0.203-0.67,0.507c-0.414,0.29-0.904,0.75-1.405,1.198  c-0.992,0.906-1.985,1.812-1.985,1.812c-0.738,0.704-0.558,1.793,0.233,1.986c0,0,1.575,0.39,3.152,0.948  c1.175,0.398,2.302,0.843,2.794,1.04c-3.323,2.998-6.116,6.569-8.234,10.555c-0.66,0.205-2.385,0.758-4.202,1.5  c-1.135,0.469-2.199,1.038-3.045,1.476c-0.837,0.458-1.395,0.763-1.395,0.763c-0.536,0.299-0.978,0.847-1.136,1.517  c0,0-0.336,1.305-0.673,2.61c-0.081,0.327-0.162,0.654-0.238,0.96c-0.051,0.311-0.099,0.602-0.14,0.85  c-0.079,0.499-0.131,0.831-0.131,0.831c-0.157,1.011,0.565,1.777,1.345,1.469c0,0,1.558-0.606,3.102-1.094  c0.773-0.248,1.542-0.472,2.117-0.629c0.313-0.079,0.565-0.142,0.739-0.185c-0.541,2.571-0.83,5.236-0.83,7.968  c0,1.851,0.139,3.669,0.391,5.45c-0.156,0.206-0.384,0.508-0.671,0.889c-0.508,0.714-1.272,1.723-1.841,2.758  c-0.606,1.039-1.191,2.139-1.619,2.99c-0.212,0.431-0.388,0.79-0.512,1.041c-0.127,0.256-0.181,0.399-0.181,0.399  c-0.23,0.547-0.225,1.238,0.01,1.884c0,0,0.449,1.272,0.952,2.521c0.58,1.215,1.16,2.431,1.16,2.431  c0.448,0.921,1.469,1.123,1.927,0.412c0,0,0.92-1.414,1.899-2.724c0.741-1.005,1.509-1.945,1.836-2.339  c1.849,4.132,4.403,7.876,7.512,11.083c-0.013,0.26-0.027,0.658-0.026,1.172c0.016,0.87,0.066,2.055,0.165,3.279  c0.049,0.611,0.109,1.231,0.176,1.818c0.08,0.57,0.177,1.095,0.26,1.556c0.183,0.926,0.305,1.543,0.305,1.543  c0.125,0.592,0.518,1.168,1.071,1.572c0,0,0.068,0.049,0.187,0.136c0.125,0.078,0.304,0.188,0.518,0.321  c0.43,0.263,1.004,0.615,1.578,0.966c0.577,0.346,1.154,0.692,1.587,0.951c0.451,0.227,0.751,0.378,0.751,0.378  c0.919,0.451,1.876-0.006,1.823-0.837c0,0-0.097-1.658-0.086-3.268c-0.005-0.793,0.046-1.639,0.081-2.245  c0.023-0.324,0.041-0.584,0.054-0.763c3.833,2.21,8.08,3.777,12.599,4.558c0.147,0.208,0.373,0.527,0.667,0.941  c0.523,0.704,1.255,1.709,2.057,2.611c1.589,1.778,3.492,3.541,3.492,3.541c0.448,0.441,1.102,0.607,1.786,0.586  c0,0,1.34-0.07,2.68-0.141c0.671-0.016,1.334-0.151,1.834-0.214c0.499-0.075,0.832-0.124,0.832-0.124  c1.011-0.154,1.519-1.071,0.987-1.722c0,0-1.055-1.302-1.995-2.629c-0.751-1.046-1.423-2.092-1.674-2.49  c4.583-0.481,8.924-1.768,12.884-3.713c0.243,0.086,0.618,0.218,1.11,0.391c0.864,0.312,1.995,0.607,3.179,0.868  c1.183,0.267,2.418,0.496,3.365,0.65c0.929,0.1,1.549,0.166,1.549,0.166c0.596,0.056,1.257-0.152,1.804-0.565  c0,0,0.268-0.203,0.67-0.507c0.414-0.29,0.904-0.75,1.405-1.198c0.992-0.906,1.985-1.812,1.985-1.812  c0.738-0.704,0.558-1.793-0.233-1.986c0,0-1.575-0.39-3.152-0.948c-1.215-0.412-2.371-0.869-2.833-1.056  c3.31-2.99,6.095-6.548,8.208-10.519c0.601-0.185,2.383-0.751,4.266-1.52c1.135-0.469,2.199-1.038,3.044-1.476  c0.837-0.458,1.395-0.763,1.395-0.763c0.536-0.299,0.978-0.847,1.136-1.517c0,0,0.336-1.305,0.673-2.61  c0.081-0.327,0.162-0.654,0.238-0.96c0.051-0.311,0.099-0.602,0.14-0.85c0.079-0.499,0.131-0.831,0.131-0.831  C95.187,56.523,94.465,55.757,93.685,56.065z M50,58c-4.418,0-8-3.582-8-8s3.582-8,8-8s8,3.582,8,8S54.418,58,50,58z"/>
                                    </svg>
                                </svg>
                                </div>
                                <p className='text-[20px] font-semibold'>Analyzing Tone ....</p>
                            </div>                         */}
                        </>
                    :
                    null
                    }
                    {response
                    ?
                        <>
                        {responseData &&
                            <div className="flex items-center justify-center flex-col m-4 p-3">
                                <p className='dark:text-white text-[20px]  font-bold'>{responseData.content_summarize}</p>
                            </div>                        
                        }
                        </>
                    :
                    null
                    }
                    {showTextInputBox
                    ?
                        <>
                            <div className="space-y-1.5 w-full">
                                <div className="flex justify-between">
                                    <h1 className="dark:text-white text-base font-semibold pb-2">Name this voice</h1>
                                </div>
                                <div className="dark:bg-gray-800 space-y-1.5 w-full">
                                    <label htmlFor="name" className="sr-only"><span className="flex items-center space-x-1"><span className='dark:text-white'>Make it easier to know which tone you're using when writing</span></span></label>
                                    <div className="dark:bg-gray-800 py-1 !mt-0 flex items-center gap-2 bg-white w-full px-3 rounded-lg ring-1 hover:ring-2 transition-all duration-150 ease-in-out ring-gray-200 outline-none focus-within:!ring-1">
                                        <div className="dark:bg-gray-800 flex items-center grow gap-2 py-1.5">
                                        <div className="dark:bg-gray-800 flex gap-1 grow">
                                            <input id="name" type="text" className="dark:bg-gray-800 dark:text-gray-300 block w-full text-gray-900 placeholder:text-gray-400 text-sm font-normal resize-none outline-none" placeholder="e.g. My Brand voice for Blog, article" name="name"
                                            value={titletext}
                                            onChange={handleTexttitleChange}
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                        <span className="dark:text-white ml-auto text-xs text-gray-500 transition-[color] duration-150 ease-in-out">
                                            {titlelen}/30</span>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="block text-sm font-normal text-gray-500 pt-3 dark:text-white">Make it easy to know which voice you're using when writing.</div>
                            <label htmlFor="text" className="text-sm font-medium block text-gray-900 placeholder:text-gray-400 transition-[color] duration-150 ease-in-out">
                                <span className="flex items-center space-x-1">
                                <span className='dark:text-white'>Write your Brand Voice </span>
                                  <TooltipInfo text="Write your brand details" />
                                </span>
                            </label>
                            <div className="dark:bg-gray-800  py-2.5 flex items-center gap-2 bg-white w-full px-3 rounded-lg ring-1 hover:ring-2 transition-all duration-150 ease-in-out ring-gray-200 outline-none focus-within:!ring-1">
                                <textarea id="text" className="dark:bg-gray-800 dark:text-gray-300 block w-full text-gray-900 placeholder:text-gray-400 text-sm font-normal resize-none outline-none max-h-64 overflow-y-auto" placeholder="Write or paste in any content written in your brand voice..." rows="5" name="text" 
                                value={text}
                                onChange={handleTextareaChange}
                                >
                                </textarea>
                            </div>
                            <div className="flex items-center gap-2">
                            <span className="dark:text-white ml-auto text-xs text-gray-500 transition-[color] duration-150 ease-in-out">
                            {textlen}/6500</span>
                            
                            </div>
                            </div>  
                        </>
                    :
                    null}

                    {showTextUrl
                    ?
                    <>
                        <div className="space-y-1.5 w-full pb-2">
                            <div className="space-y-1.5 w-[80%] m-auto">
                            <div className="flex justify-between">
                                <h1 className="dark:text-white text-base font-semibold pb-2">Tone Name</h1>
                            </div>
                            <div className="space-y-1.5 w-full">
                                <div className="dark:bg-gray-800 py-1 !mt-0 flex items-center gap-2 bg-white w-full px-3 rounded-lg ring-1 hover:ring-2 transition-all duration-150 ease-in-out ring-gray-200 outline-none focus-within:!ring-1">
                                <div className="dark:bg-gray-800 flex items-center grow gap-2 py-1.5">
                                    <div className="dark:bg-gray-800 flex gap-1 grow">
                                    <input
                                        id="brand_voice_url"
                                        placeholder='Eg. My custom Tone'
                                        type="text"
                                        className="dark:text-gray-300 dark:bg-gray-800 block w-full text-gray-900 placeholder:text-gray-400 text-sm font-normal resize-none outline-none"
                                        value={brandVoiceUrl}
                                        onChange={handleInputChangeBrandVoiceUrl}
                                    />
                                    </div>
                                </div>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <h1 className="dark:text-white text-base font-semibold pb-2">Website Url</h1>
                            </div>
                                <div className="dark:bg-gray-800 py-1 !mt-0 flex items-center gap-2 bg-white w-full px-3 rounded-lg ring-1 hover:ring-2 transition-all duration-150 ease-in-out ring-gray-200 outline-none focus-within:!ring-1">
                                <div className="dark:bg-gray-800  flex items-center grow gap-2 py-1.5">
                                    <div className="dark:bg-gray-800  flex gap-1 grow">
                                    <input
                                        id="name"
                                        placeholder='Eg. www.https://articles.com/have_tone'
                                        type="text"
                                        className={`dark:text-gray-300 dark:bg-gray-800 block w-full text-gray-900 placeholder:text-gray-400 text-sm font-normal resize-none outline-none ${
                                        !isValidUrl ? 'border-red-500' : ''
                                        }`}
                                        value={url}
                                        onChange={handleInputChangeUrl}
                                    />
                                    </div>
                                    {!isValidUrl && (
                                    <span className="text-red-500">Please enter a valid URL.</span>
                                    )}
                                </div>
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    null
                    }
                    
                </div>





                
                <div className="dark:text-white font-normal text-gray-700 text-xs pb-6">Ownership or permission for content submission to AI is required. Utilizing our website to infringe upon others' rights constitutes a breach of our <a target="_blank" href="/">Terms of Service</a></div>
                </div>
                <div className="flex justify-end items-center">
                {showTextInputBox
                ?
                    <button type="submit" className="transition-all duration-200 relative font-semibold outline-none hover:outline-none rounded-md px-3 py-1.5 text-sm text-white bg-[#334977] border border-transparent shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-1/6"
                    onClick={()=>{
                        save_context_brand_voice()
                    }}>
                        <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                            <span>Continue</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true" className="w-4 h-4 opacity-50">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                        </span>
                    </button>
                :
                    null
                }
                {showTextUrl
                ?
                <button type="submit" className="transition-all duration-200 relative font-semibold outline-none hover:outline-none rounded-md px-3 py-1.5 text-sm text-white bg-[#334977] border border-transparent shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 "
                    onClick={handleButtonClickUrl}>
                        <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                            <span>Process URL</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true" className="w-4 h-4 opacity-50">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                        </span>
                    </button>
                :
                    null
                }
                {file_upload_form
                ?
                <button type="button" className="transition-all duration-200 relative font-semibold outline-none hover:outline-none rounded-md px-3 py-1.5 text-sm text-white bg-[#334977] border border-transparent shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 "
                    onClick={handleUploadFile}>
                        <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                            <span>Submit file</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true" className="w-4 h-4 opacity-50">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                        </span>
                    </button>
                :
                    null
                }


                
                </div>

                
            </div>
    </>
  )
}

export default ModalAddVoice