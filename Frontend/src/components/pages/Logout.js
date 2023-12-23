import React , {useEffect,useState} from 'react'
import { useSelector, useDispatch } from "react-redux";
import {
  _save_token_
} from "../../features/AuthenticationToken";

import {
  _save_survey_
} from "../../features/ThreeSteps";

import { _save_user_profile } from '../../features/Fullprofile';
import {
  _load_screen_
} from "../../features/LoadingScreen";
import { _delete_token_ } from "../../features/AuthenticationToken";
import { _delete_user_profile } from "../../features/Fullprofile";
import { useNavigate } from "react-router-dom";

function Logout() {
  
  
  let navigate = useNavigate();
  const dispatch = useDispatch();


  let _survey_data_ = useSelector(
    (state) => state.SetThreeSteps.ThreeSteps
  );


  const get_profile_data = async() => {
    
          localStorage.clear();
          dispatch(_delete_token_(null));
          dispatch(_save_survey_(null));
          dispatch(_delete_user_profile(null));
          dispatch(_load_screen_(false))
          navigate("login")
  }

  useEffect(() => {
    get_profile_data()
  }, []);

  useEffect(()=>{
    // console.log("_save_survey_",_survey_data_)
    if(_survey_data_=="true"){
      navigate("/first_step?survey_data_first=by-for-user-clarification")
    }
  },[_survey_data_])
  

  return (  
        <center>Logging out .....</center>
  );
}

export default Logout;
