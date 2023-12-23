import React, {useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const Dummybn = (props) => {
  

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

      
  const notifylikeordislike=(message)=>toast(message,
  {
    icon: '👏',
    style: {
      borderRadius: '10px',
      background: '#333',
      color: '#fff',
    },
  }
);

  return (
    <>

        <span className="block pb-3">
        <div data-exclude-from-screenshot="true" className="flex w-full items-center justify-end pt-0 !mt-0 @md:!mt-0">
            <span className="block -mx-0.5 @md:m-0 flex-shrink-none">
              <button type="button" className="transition-all duration-200 relative font-semibold shadow-sm hover:outline-none focus:outline-none px-3 py-1.5 text-sm text-center bg-transparent focus:ring-transparent rounded outline-none shadow-transparent" aria-label="Upvote Message"
              onClick={()=>{
                notifylikeordislike("Wait for content to generate")
              }}>
                  <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                    <span className="flex items-center justify-center">
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                          <path d="M4.7,12.94h-.7V6.4L7.45,1.49c.28-.4,.73-.63,1.22-.63,.9,0,1.6,.8,1.48,1.7l-.26,1.86h2.27c.99,0,2.98,.99,2.98,2.98s-2,6.54-4.12,6.54c-2.78,0-5.17-.66-6.33-.99Z" fill="transparent"></path>
                          <path d="M4.7,12.94h-.7V6.4L7.45,1.49c.28-.4,.73-.63,1.22-.63,.9,0,1.6,.8,1.48,1.7l-.26,1.86h2.27c.99,0,2.98,.99,2.98,2.98s-2,6.54-4.12,6.54c-2.78,0-5.17-.66-6.33-.99Z" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>
                          <path d="M.86,6.14c0-.87,.7-1.57,1.57-1.57s1.57,.7,1.57,1.57v6.57c0,.87-.7,1.57-1.57,1.57s-1.57-.7-1.57-1.57V6.14Z" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"></path>
                        </svg>
                    </span>
                  </span>
              </button>
            </span>
            <span className="block -mx-0.5 @md:m-0 flex-shrink-none">
              <button type="button" className="transition-all duration-200 relative font-semibold shadow-sm hover:outline-none focus:outline-none px-3 py-1.5 text-sm text-center bg-transparent focus:ring-transparent rounded outline-none shadow-transparent" aria-label="Downvote Message"
              onClick={()=>{
                notifylikeordislike("Wait for content to generate")
              }}>
                  <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                    <span className="flex items-center justify-center">
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                          <path d="M4.7,2.63h-.7v6.54l3.45,4.91c.28,.4,.73,.63,1.22,.63,.9,0,1.6-.8,1.48-1.7l-.26-1.86h2.27c.99,0,2.98-.99,2.98-2.98S13.14,1.64,11.03,1.64c-2.79,0-5.17,.66-6.33,.99Z" fill="transparent"></path>
                          <path d="M4.7,2.63h-.7v6.54l3.45,4.91c.28,.4,.73,.63,1.22,.63,.9,0,1.6-.8,1.48-1.7l-.26-1.86h2.27c.99,0,2.98-.99,2.98-2.98S13.14,1.64,11.03,1.64c-2.79,0-5.17,.66-6.33,.99Z" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>
                          <path d="M.86,9.43c0,.87,.7,1.57,1.57,1.57s1.57-.7,1.57-1.57V2.86c0-.87-.7-1.57-1.57-1.57S.86,1.99,.86,2.86v6.57Z" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"></path>
                        </svg>
                    </span>
                  </span>
              </button>
            </span>
            
            <span className="block -mx-0.5 @md:m-0 flex-shrink-none">
              <button type="button" className="tooltip-container transition-all duration-200 relative font-semibold shadow-sm hover:outline-none focus:outline-none px-3 py-1.5 text-sm text-center bg-transparent focus:ring-transparent rounded outline-none shadow-transparent" aria-label="Retry Message"
              onClick={()=>{
                notifylikeordislike("Wait for content to generate")
              }}>
                  <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                    <span className="flex items-center justify-center">
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                          <path d="M14.28,9.57c-.47,1.32-1.31,2.47-2.43,3.31-1.12,.84-2.46,1.33-3.86,1.41-1.29,0-2.55-.4-3.61-1.14-1.06-.74-1.86-1.79-2.3-3" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>
                          <path d="M1.71,6.43C2.59,4.02,5.29,1.71,8,1.71c1.3,0,2.56,.41,3.62,1.16,1.06,.75,1.86,1.81,2.29,3.03" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>
                          <path d="M15.01,11.88c-.2-.95-.36-1.45-.73-2.3-.91,.19-1.41,.35-2.31,.73" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>
                          <path d="M1.16,4.08c.13,.96,.25,1.48,.56,2.35,.92-.12,1.44-.24,2.35-.56" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                    </span>
                    <span className="tooltip-text">Repeat Question</span>
                  </span>
              </button>
            </span>

            <span className="block -mx-0.5 @md:m-0 flex-shrink-none">
              <button type="button" className="tooltip-container transition-all duration-200 relative font-semibold shadow-sm hover:outline-none focus:outline-none px-3 py-1.5 text-sm text-center bg-transparent focus:ring-transparent rounded outline-none shadow-transparent" aria-label="Copy Message"
              onClick={()=>{
                notifylikeordislike("Wait for content to generate")
              }}
              >
                  <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                    <span className="flex items-center justify-center">
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                          <path d="M4.92,3.99c-.03,.8-.05,1.62-.05,2.44,0,1.3,.04,2.57,.12,3.79,.06,.9,.77,1.62,1.67,1.68,1.05,.07,2.07,.11,3.33,.11,.38,0,.74,0,1.09-.01-.02,.45-.04,.9-.07,1.35-.06,.9-.77,1.62-1.67,1.68-1.05,.07-2.07,.11-3.33,.11s-2.27-.04-3.32-.11c-.9-.06-1.62-.78-1.67-1.68-.08-1.22-.12-2.49-.12-3.79s.04-2.57,.12-3.79c.06-.9,.77-1.62,1.67-1.68,.73-.05,1.45-.08,2.24-.1Z" fill="none" stroke="currentColor" strokeWidth="1"></path>
                          <path d="M14.99,10.23c.08-1.22,.12-2.49,.12-3.79,0-.53,0-1.05-.02-1.56,0-.36-.13-.72-.34-1.01-.82-1.11-1.47-1.8-2.54-2.63-.3-.23-.66-.35-1.04-.36-.37,0-.76-.01-1.18-.01-1.26,0-2.27,.04-3.33,.11-.9,.06-1.62,.78-1.67,1.68-.08,1.22-.12,2.49-.12,3.79s.04,2.57,.12,3.79c.06,.9,.77,1.62,1.67,1.68,1.05,.07,2.07,.11,3.33,.11s2.27-.04,3.32-.11c.9-.06,1.62-.78,1.67-1.68Z" fill="transparent"></path>
                          <path d="M14.99,10.23c.08-1.22,.12-2.49,.12-3.79,0-.53,0-1.05-.02-1.56,0-.36-.13-.72-.34-1.01-.82-1.11-1.47-1.8-2.54-2.63-.3-.23-.66-.35-1.04-.36-.37,0-.76-.01-1.18-.01-1.26,0-2.27,.04-3.33,.11-.9,.06-1.62,.78-1.67,1.68-.08,1.22-.12,2.49-.12,3.79s.04,2.57,.12,3.79c.06,.9,.77,1.62,1.67,1.68,1.05,.07,2.07,.11,3.33,.11s2.27-.04,3.32-.11c.9-.06,1.62-.78,1.67-1.68Z" fill="none" stroke="currentColor" strokeWidth="1"></path>
                        </svg>
                    </span>
                  </span>
                  <span className="tooltip-text">Copy</span>
              </button>
            </span>

            <span className="block -mx-0.5 @md:m-0 flex-shrink-none">
              <button type="button" className=" tooltip-container transition-all duration-200 relative font-semibold shadow-sm hover:outline-none focus:outline-none px-3 py-1.5 text-sm text-center bg-transparent focus:ring-transparent rounded outline-none shadow-transparent" aria-label="Open in Document"
               onClick={()=>{
                    notifylikeordislike("Wait for content to generate")
                }}
                >
                  <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                    <span className="flex items-center justify-center">
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                          <path d="M14.14,12.67c.09-1.51,.14-3.07,.14-4.67,0-.65,0-1.29-.02-1.92-.01-.44-.16-.88-.42-1.24-1.01-1.37-1.81-2.22-3.12-3.24-.36-.28-.81-.43-1.27-.44-.46,0-.94-.01-1.45-.01-1.55,0-2.8,.05-4.1,.14-1.1,.08-1.98,.95-2.04,2.05-.1,1.51-.15,3.07-.15,4.67s.05,3.16,.15,4.67c.07,1.1,.94,1.98,2.04,2.05,1.29,.09,2.55,.14,4.1,.14s2.8-.05,4.1-.14c1.1-.08,1.98-.95,2.05-2.05Z" fill="none" stroke="currentColor" strokeWidth="1"></path>
                          <path d="M5.82,8.02h4.36" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>
                          <path d="M5.82,11.34h4.34M5.82,4.57h2.63" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                    </span>
                  </span>
                  <span className="tooltip-text">Open in Document</span>
              </button>
            </span>
        </div>
        </span>
    </>
  )
}

export default Dummybn