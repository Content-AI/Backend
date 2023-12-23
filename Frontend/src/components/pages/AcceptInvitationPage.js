import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { useParams } from 'react-router-dom';
import { postData,fetchData } from '../../apis/apiService';
import { BACKEND_URL,BACK_END_API_ACCEPT_INVITATION } from '../../apis/urls';
import toast, { Toaster } from "react-hot-toast";

const AcceptInvitationPage = () => {

  const [loadingResp,setloadingResp]=useState(false)

  const navigate = useNavigate()
  const url_data =useParams()

  const notifyerror = (message) => toast.error(message);
  const notifysucces = (message) => toast.success(message);

  let TOKEN = useSelector(
    (state) => state.SetAuthenticationToken.AuthenticationToken
  );

  const handleAcceptInvitation = async() => {
    setloadingResp(true)
    const resp = await fetchData(BACKEND_URL+BACK_END_API_ACCEPT_INVITATION+url_data.invitation_id,TOKEN)
    if(resp.status==200){
      window.location.replace("/");
    }else{
      notifyerror("Already accepted")
      setloadingResp(false)
    }
  };



  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full">
        <h1 className="text-2xl font-semibold mb-4">Accept Invitation</h1>
        <p className="text-gray-700 mb-4">
          You have been invited to join a Workshop.
          Click the button below to accept the invitation.
        </p>
        <button
          onClick={()=>{
            window.location.replace("/");
          }}
          className="mr-3 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded focus:outline-none"
        >
          Back Home
        </button>
        {loadingResp
        ?
          <button
            className="bg-blue-200 hover:bg-blue-200 text-white font-semibold py-2 px-4 rounded focus:outline-none"
          >
            Requesting acceptance
          </button>
        :
          <button
            onClick={handleAcceptInvitation}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none"
          >
            Accept Invitation
          </button>
        }

      </div>
    </div>
  );
};

export default AcceptInvitationPage;
