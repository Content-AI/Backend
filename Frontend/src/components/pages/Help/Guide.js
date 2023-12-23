import React from 'react';
import toast, { Toaster } from 'react-hot-toast';


const Guide = () => {
    const notifyerror = (message) => toast.error(message);
    const notifysucces = (message) => toast.success(message);

  return (
        <div className="pt-6">
          <div className="dark:bg-gray-800  flow-root px-6 pb-8 rounded-lg bg-slate-50 hover:bg-slate-100 ring-1 ring-gray-200 h-full">
          <div className="flex flex-col justify-between h-full">
              <div>
                <div>
                    <span className="inline-flex items-center justify-center p-3 bg-white rounded-md shadow-lg ring-1 ring-blue-500 -mt-6">
                    <svg xmlns="http://www.w3.org/2000/svg" data-name="EX Color line copy" viewBox="0 0 64 80" x="0px" y="0px" className="w-6 h-6 text-blue-600">
                        <path d="M57.219,38.375,56,39.9V12a1,1,0,0,0-1-1H43V9a1,1,0,0,0-1-1H39V7a1,1,0,0,0-1-1H32a1,1,0,0,0-1,1V8H10A1,1,0,0,0,9,9V57a1,1,0,0,0,1,1H42a1,1,0,0,0,1-1V55H55a1,1,0,0,0,1-1V43.1l2.781-3.476ZM33,8h4v4.586l-1.293-1.293a1,1,0,0,0-1.414,0L33,12.586Zm8,48H11V10H31v5a1,1,0,0,0,1.707.707L35,13.414l2.293,2.293A1,1,0,0,0,38,16a.987.987,0,0,0,.383-.076A1,1,0,0,0,39,15V10h2V56Zm13-3H43V43h7V41H43V39h7V37H43V35h7V33H43V31h7V29H43V27h7V25H43V23h7V21H43V19h7V17H43V13H54V42.4l-4.083,5.1-2.21-2.21-1.414,1.414,3,3A1,1,0,0,0,50,50l.055,0a1,1,0,0,0,.726-.373L54,45.6Z"
                             fill='blue'
                        />
                        <path d="M35,31a9.023,9.023,0,1,0-4.875,7.99l5.043,7.565,1.664-1.11-5.043-7.564A8.979,8.979,0,0,0,35,31ZM19,31a7,7,0,1,1,7,7A7.008,7.008,0,0,1,19,31Z"
                            fill='blue'
                        />
                        <path d="M31,31a5.006,5.006,0,0,0-5-5v2a3,3,0,0,1,3,3Z" fill='blue'/>
                        <rect x="22" y="13" width="7" height="2" fill='blue'/>
                        <rect x="14" y="17" width="23" height="2" fill='blue'/>
                        <rect x="19" y="52" width="14" height="2" fill='blue'/>
                        <rect x="14" y="48" width="23" height="2" fill='blue'/>
                        <rect x="29" y="32" width="2" height="2" fill='blue'/>
                        </svg>
                    </span>
                </div>
                <h3 className="dark:text-white mt-6 text-xl font-medium tracking-tight text-gray-900">Get a the IDEA. How to use</h3>
                <p className="dark:text-white mt-3 text-base text-gray-500 pt-3">Browse through our assistance materials to access step-by-step instructions tailored to help you effectively navigate and utilize our website.</p>
              </div>
              <button type="button" 
                      className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#334977]"
                      onClick={()=>{
            notifysucces("comming soon")
        }}
          >
              <span className="flex items-center justify-center mx-auto space-x-2 select-none">Guide</span></button>
          </div>
        </div>
    </div>
  );
};

export default Guide;
