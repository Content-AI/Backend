import React, { useEffect, useState } from 'react'

import Dummybn from '../Dummybn'
import MarkdownPreview from "@uiw/react-markdown-preview";

import { useSelector, useDispatch } from "react-redux";


const AnswerFroApi = (props) => {

  const DarkModeState = useSelector((state)=>state.SetDarkMode.DarkMode)
  // darkModeStatus={checkDarkMode}

  return (
    
    <>
     <div className="relative flex flex-col">
        <div className="w-7 h-7 mt-2 rounded-full order-last overflow-hidden">
        <img
            className="w-full h-full rounded-full"
            src="https://uffiafilestorage.s3.amazonaws.com/frontend-images/chat.png"
            alt="ChatBot"
        />
        </div>
        <div 
          className="text-black  dark:bg-black dark:border-slate-500  bg-white outline-none px-4 py-3 mx-4 md:max-w-[90%] rounded-2xl border border-sky-100"
        >



        {props.darkModeStatus
      ?
        <div data-color-mode="dark">
          <MarkdownPreview source={props.content} />
        </div>
      :
        <div data-color-mode="light">
          <MarkdownPreview source={props.content} />
        </div>
      }

        {/* ============all sorts of btn================ */}
        <Dummybn
            all_data={props.chat_data}
            data={props.content}
        />
        {/* ============all sorts of btn================ */}
        </div>
    </div>

  </>
  )
}

export default AnswerFroApi
