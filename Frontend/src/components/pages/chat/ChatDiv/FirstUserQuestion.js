import React from 'react'
import RenderHtmlData from '../../Template/RenderHtmlData'

import MarkdownPreview from "@uiw/react-markdown-preview";

const FirstUserQuestion = (props) => {
  return (
    
        <div className="relative flex flex-col items-end">
        <div className="w-6 h-6 rounded-full order-last overflow-hidden">
            <img
            className="w-full h-full rounded-full"
            src="https://aiprojectfilestorage.s3.ap-southeast-2.amazonaws.com/frontend-images/default.png"
            alt="User"
            />
        </div>
        <div className="dark:bg-slate-600 dark:text-white text-white bg-blue px-4 py-3 mx-4 rounded-2xl ">
            {/* <RenderHtmlData htmldata={props.question} /> */}
            {props.question}
        </div>
        </div>
  )
}

export default FirstUserQuestion