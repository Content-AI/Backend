import React, { useEffect, useState } from 'react';


import { useSelector, useDispatch } from "react-redux";


const LiveChat = () => {
  const [showChat, setShowChat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  let PROFILE_DATA = useSelector((state) => state.SetFullProfile.Fullprofile);



  const loadChatWidget = () => {
    console.log(PROFILE_DATA?.email)
    setIsLoading(true);

    // Load the HubSpot chat widget
    const script = document.createElement("script");
    script.src = "//js-na1.hs-scripts.com/42338625.js"; // Replace with the actual HubSpot chat widget script URL
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      setIsLoading(false);
      setShowChat(true);
    };
  };

  


  return (
    <div className="pt-6">
    <div className="dark:bg-gray-800 flow-root px-6 pb-8 rounded-lg bg-slate-50 hover:bg-slate-100 ring-1 ring-gray-200 h-full">
      <div className="flex flex-col justify-between h-full">
          <div>
            <div>
                <span className="inline-flex items-center justify-center p-3 bg-white rounded-md shadow-lg ring-1 ring-blue-500 -mt-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true" className="w-6 h-6 text-blue-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                </span>
            </div>
            <h3 className=" dark:text-white mt-6 text-xl font-medium tracking-tight text-gray-900">Help center / Knowledge base</h3>
            <p className="dark:text-white mt-3 text-base text-gray-500 pt-3">Look in our support area to find information about how things work for different products and your account.</p>
          </div>
          <button type="button" 
           className={`mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#334977] hover:bg-[#293c59]'
          }`}
          disabled={isLoading}
          onClick={loadChatWidget}
          >
          <span className="flex items-center justify-center mx-auto space-x-2 select-none">
          {isLoading ? 'Loading...' : 'Start Chat'}
          </span>
          </button>
          {showChat && <div id="hubspot-chat-container"></div>}
      </div>
    </div>
</div>
  );
};

export default LiveChat;
