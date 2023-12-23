import React, {useRef, useState } from 'react';
import RenderHtml from './RenderHtml'
import RenderHtmlData from './RenderHtmlData'
import { useSelector, useDispatch } from "react-redux";

import {
  _save_token_
} from "../../../features/AuthenticationToken";
import {
    _load_screen_
  } from "../../../features/LoadingScreen";
import {
    _message_
  } from "../../../features/LoadingScreenMessage";

import {
    setText
} from "../../../features/EditorText";
  
import {
    _copy_text_,_reset_copy_text_
} from "../../../features/CopiedText";
  
import {
    _save_folder_id_
} from "../../../features/ProjectOrFolderIdChoosen";
  

import { useParams } from 'react-router-dom';

import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import LoadingPage from '../../LoadingPage';
import { BACKEND_URL,BACK_END_API_DOCUMENTS } from '../../../apis/urls';
import { postData } from '../../../apis/apiService';



const ResponseTemplate = (prop) => {

    // console.log("prop : ",prop)
    // prop.r_custome=="user"


    const textRef = useRef(null);
    let navigate = useNavigate();
    const dispatch = useDispatch();

    const {template_id} = useParams();


    let TOKEN = useSelector(
        (state) => state.SetAuthenticationToken.AuthenticationToken
      );
    let loading_page = useSelector(
    (state) => state.SetLoadingScreen.LoadingScreen
    );
    
    let ProjectOrFolderIdChoosen = useSelector(
    (state) => state.SetProjectOrFolderIdChoosen.ProjectOrFolderIdChoosen
    );
    
    let COPIED_TEXT = useSelector(
        (state) => state.SetCopiedText.CopiedText
      );

    let ChosenWorkspaceId = useSelector(
    (state) => state.SetChosenWorkspaceId.ChosenWorkspaceId
    );

    const handleCopyClick = () => {
      const textToCopy = textRef.current.innerText;
      navigator.clipboard.writeText(textToCopy);
      notifycopy("Text Copied")
      dispatch(_copy_text_(textToCopy))
    };

    const notifyerror = (message) => toast.error(message);
    const notifycopy = (message) => toast.success(message, {
        style: {
        //   border: '1px solid #713200',
          padding: '10px',
          color: '#713200',
        },
        iconTheme: {
          primary: '#713200',
          secondary: '#FFFAEE',
        },
      });
      const notifymessage = (message) =>
      toast(message, {
        icon: "👏",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });

      const createDocumentForUser = async() =>{
        let formData = {}
        if(ProjectOrFolderIdChoosen){
            formData = {
                document_content:prop.r_data,
                project_id:ProjectOrFolderIdChoosen,
                workspace_id:ChosenWorkspaceId["Workspace_Id"]
            }
        }else{
            formData = {
                document_content:prop.r_data,
                workspace_id:ChosenWorkspaceId["Workspace_Id"]
            }

        }

        const resp = await postData(formData,BACKEND_URL+BACK_END_API_DOCUMENTS+"/",TOKEN)
        try{
            if(resp.status==201){
                dispatch(_load_screen_(false))
                dispatch(_message_(""))
                navigate(`/template_data/${resp.data["id"]}?template_editing=edit_by_user&template=${template_id}&custome=${prop.r_custome}`)

            }else{
                notifyerror("something went wrong refresh page")
            }
        }catch(e){
            notifyerror("something went wrong refresh page")
        }
      }
    
    
  return (
    <>
        <div className="dark:bg-gray-700 dark:text-white px-6 py-3 border-b border-gray-200 group cursor-pointer bg-green-50 hover:bg-green-300/5 ">
        {loading_page
        ?
            <LoadingPage message={"Creating Document"}/>
        :
            <>
                <div className="flex items-center space-x-2">
                   {/* ============================ */}
                   
                    <button
                        onClick={handleCopyClick}
                    className=" p-2 leading-4 text-gray-400 transition duration-150 group-hover:bg-white rounded-md opacity-20  group-hover:opacity-100 hover:text-gray-600 hover:ring-1 hover:ring-gray-200 hover:bg-white dark:hover:bg-gray-400 dark:bg-black">
                        {/* <div className="tooltip" title="Copy"> */}
                        <div className="tooltip-container">
                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                <path d="M4.92,3.99c-.03,.8-.05,1.62-.05,2.44,0,1.3,.04,2.57,.12,3.79,.06,.9,.77,1.62,1.67,1.68,1.05,.07,2.07,.11,3.33,.11,.38,0,.74,0,1.09-.01-.02,.45-.04,.9-.07,1.35-.06,.9-.77,1.62-1.67,1.68-1.05,.07-2.07,.11-3.33,.11s-2.27-.04-3.32-.11c-.9-.06-1.62-.78-1.67-1.68-.08-1.22-.12-2.49-.12-3.79s.04-2.57,.12-3.79c.06-.9,.77-1.62,1.67-1.68,.73-.05,1.45-.08,2.24-.1Z" fill="none" stroke="currentColor" strokeWidth="1"></path>
                                <path d="M14.99,10.23c.08-1.22,.12-2.49,.12-3.79,0-.53,0-1.05-.02-1.56,0-.36-.13-.72-.34-1.01-.82-1.11-1.47-1.8-2.54-2.63-.3-.23-.66-.35-1.04-.36-.37,0-.76-.01-1.18-.01-1.26,0-2.27,.04-3.33,.11-.9,.06-1.62,.78-1.67,1.68-.08,1.22-.12,2.49-.12,3.79s.04,2.57,.12,3.79c.06,.9,.77,1.62,1.67,1.68,1.05,.07,2.07,.11,3.33,.11s2.27-.04,3.32-.11c.9-.06,1.62-.78,1.67-1.68Z" fill="transparent"></path>
                                <path d="M14.99,10.23c.08-1.22,.12-2.49,.12-3.79,0-.53,0-1.05-.02-1.56,0-.36-.13-.72-.34-1.01-.82-1.11-1.47-1.8-2.54-2.63-.3-.23-.66-.35-1.04-.36-.37,0-.76-.01-1.18-.01-1.26,0-2.27,.04-3.33,.11-.9,.06-Here's the rest of the code with improved formatting: 1.62,.78-1.67,1.68-.08,1.22-.12,2.49-.12,3.79s.04,2.57,.12,3.79c.06,.9,.77,1.62,1.67,1.68,1.05,.07,2.07,.11,3.33,.11s2.27-.04,3.32-.11c.9-.06,1.62-.78,1.67-1.68Z" fill="none" stroke="currentColor" strokeWidth="1"></path>
                            </svg>
                            <span className="tooltip-text">Copy</span>
                        </div>
                    </button>


                   {/* ============================ */}

                    {prop?.r_show
                    ?
                        <button className="p-2 leading-4 text-gray-400 transition duration-150 group-hover:bg-white rounded-md opacity-20  group-hover:opacity-100 hover:text-gray-600 hover:ring-1 hover:ring-gray-200 hover:bg-white dark:hover:bg-gray-400 dark:bg-black"
                            onClick={()=>{
                                // const formattedData = COPIED_TEXT.replace(/\n/g, '<br>');
                                dispatch(setText(COPIED_TEXT))
                            }}>
                        <div className="tooltip-container">
                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                            <path d="M4.67,2.71c-.18,.02-.35,.05-.53,.07-.22,.03-.44,.06-.66,.08-.55,.07-.98,.51-1.02,1.06-.24,3.34-.24,6.5,0,9.84,.04,.55,.47,.99,1.02,1.04,3.03,.25,5.79,.25,8.82,0,.55-.05,.98-.49,1.02-1.04,.24-3.34,.24-6.5,0-9.84-.04-.55-.47-.99-1.02-1.06-.22-.03-.44-.05-.66-.08-.18-.02-.35-.04-.53-.07-.08,.86-.81,1.54-1.69,1.54h-3.07c-.88,0-1.61-.67-1.69-1.54Z" fill="transparent" fillRule="evenodd"></path>
                            <path d="M5.82,7.45h4.36" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>
                            <path d="M5.82,10.77h2.63" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>
                            <path d="M9.43,.86h-3.07c-.94,0-1.7,.76-1.7,1.7h0c0,.94,.76,1.7,1.7,1.7h3.07c.94,0,1.7-.76,1.7-1.7h0c0-.94-.76-1.7-1.7-1.7Z" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"></path>
                            <path d="M4.78,2.71c-.4,.05-.8,.1-1.2,.15-.55,.07-.98,.51-1.02,1.06-.24,3.34-.24,6.5,0,9.84,.04,.55,.47,.99,1.02,1.04,3.03,.25,5.79,.25,8.82,0,.55-.05,.98-.49,1.02-1.04,.24-3.34,.24-6.5,0-9.84-.04-.55-.47-.99-1.02-1.06-.39-.05-.79-.1-1.2-.15" fill="none" stroke="currentColor" strokeWidth="1"></path>
                            </svg>
                            <span className="tooltip-text">Paste to Editor</span>
                            </div>
                        </button>
                    :
                        <button className="p-2 leading-4 text-gray-400 transition duration-150 group-hover:bg-white rounded-md opacity-20  group-hover:opacity-100 hover:text-gray-600 hover:ring-1 hover:ring-gray-200 hover:bg-white dark:hover:bg-gray-400 dark:bg-black"
                            onClick={()=>{
                                dispatch(_load_screen_(true))
                                dispatch(_message_("Creating Document"))
                                createDocumentForUser()
                            }}
                        >
                            {/* <div className="tooltip" title="Open in Document"> */}
                            <div className="tooltip-container">
                                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                    <path d="M14.14,12.67c.09-1.51,.14-3.07,.14-4.67,0-.65,0-1.29-.02-1.92-.01-.44-.16-.88-.42-1.24-1.01-1.37-1.81-2.22-3.12-3.24-.36-.28-.81-.43-1.27-.44-.46,0-.94-.01-1.45-.01-1.55,0-2.8,.05-4.1,.14-1.1,.08-1.98,.95-2.04,2.05-.1,1.51-.15,3.07-.15,4.67s.05,3.16,.15,4.67c.07,1.1,.94,1.98,2.04,2.05,1.29,.09,2.55,.14,4.1,.14s2.8-.05,4.1-.14c1.1-.08,1.98-.95,2.05-2.05Z" fill="none" stroke="currentColor" strokeWidth="1"></path>
                                </svg>
                                <span className="tooltip-text">Open in Document</span>
                            </div>
                        </button>
                    }

                    <button className="p-2 leading-4 text-gray-400 transition duration-150 group-hover:bg-white rounded-md opacity-20  group-hover:opacity-100 hover:text-gray-600 hover:ring-1 hover:ring-gray-200 hover:bg-white dark:hover:bg-gray-400 dark:bg-black"
                    onClick={()=>{
                        notifymessage("Thank you for feedback")
                    }}
                    >
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                        <path d="M4.7,12.94h-.7V6.4L7.45,1.49c.28-.4,.73-.63,1.22-.63,.9,0,1.6,.8,1.48,1.7l-.26,1.86h2.27c.99,0,2.98,.99,2.98,2.98s-2,6.54-4.12,6.54c-2.78,0-5.17-.66-6.33-.99Z" fill="transparent"></path>
                        <path d="M4.7,12.94h-.7V6.4L7.45,1.49c.28-.4,.73-.63,1.22-.63,.9,0,1.6,.8,1.48,1.7l-.26,1.86h2.27c.99,0,2.98,.99,2.98,2.98s-2,6.54-4.12,6.54c-2.78,0-5.17-.66-6.33-.99Z" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>
                        <path d="M.86,6.14c0-.87,.7-1.57,1.57-1.57s1.57,.7,1.57,1.57v6.57c0,.87-.7,1.57-1.57,1.57s-1.57-.7-1.57-1.57V6.14Z" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"></path>
                    </svg>
                    </button>

                    <button className="p-2 leading-4 text-gray-400 transition duration-150 group-hover:bg-white rounded-md opacity-20  group-hover:opacity-100 hover:text-gray-600 hover:ring-1 hover:ring-gray-200 hover:bg-white dark:hover:bg-gray-400 dark:bg-black"
                    onClick={()=>{
                        notifymessage("Thank you for feedback")
                    }}>
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                        <path d="M4.7,2.63h-.7v6.54l3.45,4.91c.28,.4,.73,.63,1.22,.63,.9,0,1.6-.8,1.48-1.7l-.26-1.86h2.27c.99,0,2.98-.99,2.98-2.98S13.14,1.64,11.03,1.64c-2.79,0-5.17,.66-6.33,.99Z" fill="transparent"></path>
                        <path d="M4.7,2.63h-.7v6.54l3.45,4.91c.28,.4,.73,.63,1.22,.63,.9,0,1.6-.8,1.48-1.7l-.26-1.86h2.27c.99,0,2.98-.99,2.98-2.98S13.14,1.64,11.03,1.64c-2.79,0-5.17,.66-6.33,.99Z" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>
                        <path d="M.86,9.43c0,.87,.7,1.57,1.57,1.57s1.57-.7,1.57-1.57V2.86c0-.87-.7-1.57-1.57-1.57S.86,1.99,.86,2.86v6.57Z" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"></path>
                    </svg>
                    </button>
                    <div className="flex justify-end flex-grow">
                    <div className="text-xs text-gray-400">{prop.r_time=="0 secs ago"?"just now":prop.r_time}</div>
                    </div>
                </div>
                <div ref={textRef} className="w-full mt-2 mb-3 text-base font-medium leading-7 text-gray-800 whitespace-pre-wrap pre">
                    <RenderHtmlData
                        htmldata={prop.r_data}
                    />
                </div>
            </>
        }
        {/* <Toaster/> */}
        </div>
    </>
  )
}

export default ResponseTemplate