import React , { useState,useEffect} from 'react'
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
import {
  _load_screen_
} from "../../../features/LoadingScreen";


import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import LoadingPage from '../../LoadingPage';

const GoogleOneTap = () => {
    let navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    
    
    const searchParams = new URLSearchParams(location.search);
    const subscription_type = searchParams.get('subscription_type');
    const plan = searchParams.get('plan');
    const invitation_code = searchParams.get('invitation_code');

    const notifysuccess = (message) => toast.success(message);
    const notifyerr = (message) => toast.error(message);

    const [token_of_gmail,set_token_of_gmail] = useState(null)


    let loading_page = useSelector(
      (state) => state.SetLoadingScreen.LoadingScreen
    );

    useEffect(() => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = (data) => {
          window.google.accounts.id.initialize({
              client_id: "65857693177-41t814nhrml22jptcfdrcqveumamp8al.apps.googleusercontent.com",
              callback: (response) => {
                  try {
                      set_token_of_gmail(response.credential);
                  } catch (e) {
                      notifyerr("Try logging in a different account");
                  }
              },
              prompt_parent_domain: "app.uffai.com",
          });
          window.google.accounts.id.prompt();
      };
      document.body.appendChild(script);
  }, []);
  


    
  const get_user_date = async(token_data) =>{
    // console.log('token_data',token_data)
    if (token_data){
        dispatch(_load_screen_(true))
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
          dispatch(_load_screen_(false))
                      
          
          if(subscription_type!=null && subscription_type!=undefined && plan!=null && plan!=undefined){
            navigate(`/subscribe_by_user?subscription_type=${subscription_type}&plan=${plan}`)
          }else if(invitation_code!=null && invitation_code!=undefined){
            navigate(`/invitation/${invitation_code}`)
          }else{
            navigate("/");
          }

        }).catch((err)=>{
          dispatch(_load_screen_(false))
          try{
            notifyerr("Try loggin in different account")
          }catch(e){
            notifyerr("something went wrong refresh page")
          }
        })
      }
      }
      useEffect(() => {
        get_user_date(token_of_gmail)
      }, [token_of_gmail])

  return (
    <></>
  )
}

export default GoogleOneTap