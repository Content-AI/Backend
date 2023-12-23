import React , { useState,useEffect} from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import axios from "axios";

import { BACKEND_URL, BACK_API_GOOGLE } from '../../../apis/urls';

import { useSelector, useDispatch } from "react-redux";

import {
  _save_token_,
  _delete_token_,
} from "../../../features/AuthenticationToken";
import {
  _save_user_profile,_delete_user_profile
} from "../../../features/Fullprofile";
import {
  _save_survey_
} from "../../../features/ThreeSteps";

import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import LoadingPage from '../../LoadingPage';

const GoogleLoginSigup = () => {
  let navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();



  const searchParams = new URLSearchParams(location.search);
  const subscription_type = searchParams.get('subscription_type');
  const plan = searchParams.get('plan');
  const invitation_code = searchParams.get('invitation_code');



  const [token_of_gmail,set_token_of_gmail] = useState(null)
  const [wholePageLoading,setwholePageLoading]=useState(false)

  const notifysuccess = (message) => toast.success(message);
  const notifyerr = (message) => toast.error(message);

  const get_user_date = async(token_data) =>{
    // console.log('token_data',token_data)
    if (token_data){
        setwholePageLoading(true)
        axios.post(BACKEND_URL+BACK_API_GOOGLE,{
          auth_token: token_data
        }).then((response)=>{
          if (response.data.access) {
            localStorage.setItem("token",  response.data.access);
            localStorage.setItem("refresh",  response.data.refresh);
            dispatch(_save_token_(response.data.access));
            localStorage.setItem("three_steps",response.data.three_steps)
            dispatch(_save_survey_(response.data.three_steps))

          }
        // if there is stripe data redirect to stripe
            if(subscription_type!=null && subscription_type!=undefined && plan!=null && plan!=undefined){
              navigate(`/subscribe_by_user?subscription_type=${subscription_type}&plan=${plan}`)
          }else if(invitation_code!=null && invitation_code!=undefined){
              navigate(`/invitation/${invitation_code}`)
          }else{
              navigate("/");
          }
        }).catch((err)=>{
          // navigate("/login");
          try{
            notifyerr("Try loggin in different account")
          }catch(e){
            notifyerr("something went wrong refresh page")
          }
        })
      }
      setwholePageLoading(false)
      }
      useEffect(() => {
        get_user_date(token_of_gmail)
        // setwholePageLoading(true)
      }, [token_of_gmail])

  return (
    <>
        {wholePageLoading
          ?
          <LoadingPage/>
          :
          null
        }
         <GoogleOAuthProvider clientId="65857693177-41t814nhrml22jptcfdrcqveumamp8al.apps.googleusercontent.com">
          <GoogleLogin 
              onSuccess={credentialResponse => {
                  get_user_date(credentialResponse.credential)
              }}
              prompt="select_account"
              isSignedIn={false}
          >
            {(renderProps) => (
              <button
                // className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-[10px] focus:outline-none"
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
                Sign in with Google
              </button>
            )}
          </GoogleLogin>
      </GoogleOAuthProvider>
    </>
  )
}

export default GoogleLoginSigup