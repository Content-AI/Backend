import React , {useEffect,useState} from 'react'
import './App.css';
import AllRoutes from './components/Route/AllRoutes';
import { useSelector, useDispatch } from "react-redux";

import {
  _save_token_
} from "./features/AuthenticationToken";

import {
  _save_survey_
} from "./features/ThreeSteps";

import { _save_user_profile } from './features/Fullprofile';
import {
  _load_screen_
} from "./features/LoadingScreen";

import {
  _hide_nav_,
  _show_nav_,
} from "./features/HideShowNavBarGlobalState";

import { _dark_mode_ } from './features/DarkMode';


import { _delete_token_ } from "./features/AuthenticationToken";
import { _delete_user_profile } from "./features/Fullprofile";
import { _save_details_ } from "./features/Subscriptions";
import { _save_sub_details_ } from "./features/SubscriptionsData";
import { _save_generated_token_ } from "./features/ListTokenGeneratedByUser";
import { _workspace_id_ } from "./features/WorkspaceId";
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Login from './components/pages/Login';
import Navbar from './components/NavBar/NavBar';
import FirstStep from './components/pages/ThreeSteps/FirstStep';
import { fetchData,HitUrl,LoginData, postData } from './apis/apiService';
import { BACK_END_API_PROFILE,BACK_API_LINKEDIN,BACK_API_GOOGLE_UPDATE,BACK_END_API_INITIAL_WORKSPACE,BACK_END_API_TRACK_USER,BACK_END_API_WORKSPACE,BACK_END_API_TOKEN_GENERATED,BACK_END_API_SUBCRIPTION_DETAILS,BACKEND_URL,BACK_END_API_SUBSCRIBE_CHECK } from './apis/urls';
import LoadingPage from './components/LoadingPage';
import Subscription from './components/pages/Subscription/Subscription'
import { useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function App() {
  
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  

  const notifyerror = (message) => toast.error(message);
  const notifysucces = (message) => toast.success(message);

  const [ subcheck,setsubcheck]=useState(true)
  
  const [ linkedInAuthToken,setlinkedInAuthToken]=useState(null)
  const [ googleAuthToken,setgoogleInAuthToken]=useState(null)


  const [ data_of_planning,setdata_of_planning]=useState([])
  const [invitation_code_show, setinvitation_code_show] = useState(false);


  const searchParams = new URLSearchParams(location.search);
  const subscription_type = searchParams.get('subscription_type');
  const plan = searchParams.get('plan');
  const invitation_code = searchParams.get('invitation_code');
  
  const message_from_subscription = searchParams.get('message');
  


  const linkedInCode = searchParams.get('code');

  const params = new URLSearchParams(window.location.hash.substring(1));
  // Get the value of the access_token parameter of google auth
  const google_auth_code = params.get('access_token');



  // check dark mode from local storage 
  useEffect(()=>{
    try{
      dispatch(_dark_mode_(localStorage.getItem('DarkMode')))
    }catch(e){}
  })



  let TOKEN = useSelector(
    (state) => state.SetAuthenticationToken.AuthenticationToken
  );
  let _survey_data_ = useSelector(
    (state) => state.SetThreeSteps.ThreeSteps
  );
  let loading_page = useSelector(
    (state) => state.SetLoadingScreen.LoadingScreen
  );
  let subscriptions_check = useSelector(
    (state) => state.SetSubscriptions.Subscriptions
  );
  let subscriptions_details = useSelector(
    (state) => state.SetSubscriptionsData.SubscriptionsData
  );


  useEffect(() => {
    if(location.pathname.includes("/invitation")){
      setinvitation_code_show(true);
    }
  }, []);



  // proceed towards linkedIn Login
  const get_linkedIn_token = async() =>{
    dispatch(_load_screen_(true))
    const formData = {
      code:linkedInAuthToken
    }
    const response = await LoginData(formData,BACKEND_URL+BACK_API_LINKEDIN)
    if (response.status == 200) {
      localStorage.setItem("token", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      dispatch(_save_token_(response.data.access));
      dispatch(_save_survey_(response.data.three_steps))
      localStorage.setItem("three_steps", response.data.three_steps)
      navigate("/")
    }
  }

  // proceed google login
  const get_google_token = async() =>{
    dispatch(_load_screen_(true))
    const formData = {
      code_google:googleAuthToken
    }
    const response = await LoginData(formData,BACKEND_URL+BACK_API_GOOGLE_UPDATE)
    if (response.status == 200) {
      localStorage.setItem("token", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      dispatch(_save_token_(response.data.access));
      dispatch(_save_survey_(response.data.three_steps))
      localStorage.setItem("three_steps", response.data.three_steps)
      navigate("/")
    }
  }

  useEffect(()=>{
    if(linkedInAuthToken!=null){
      get_linkedIn_token()
    }
  },[linkedInAuthToken])
  useEffect(()=>{
    if(googleAuthToken!=null){
      get_google_token()
    }
  },[googleAuthToken])

  useEffect(() => {
    if(linkedInCode!=null){
      setlinkedInAuthToken(linkedInCode)
    }
    if(google_auth_code!=null){
      setgoogleInAuthToken(google_auth_code)
    }
  }, []);

  useEffect(() => {
    
    if(message_from_subscription=="success")
    {
      notifysucces("Thank you for choosing our proudct")
    }
    if(message_from_subscription=="cancle")
    {
      notifyerror("Subscription Cancal")
    }

    if (localStorage.getItem("token")) {
      dispatch(_save_token_(localStorage.getItem("token")));
      dispatch(_load_screen_(false))
    }else{
      // console.log("subscription_type : ",subscription_type)
      // console.log("plan : ",plan)
      // console.log("invitation_code : ",invitation_code)
      if(subscription_type!=null && subscription_type!=undefined && plan!=null && plan!=undefined){
        navigate(`/login?subscription_type=${subscription_type}&plan=${plan}`)
      }else if(invitation_code!=null && invitation_code!=undefined){
        navigate(`/login?user=login_f&invitation_code=${invitation_code}`)
      }else{
        navigate('/login?user=login_f')
      }
      dispatch(_load_screen_(false))
    }
  }, []);

  const get_profile_data = async() => {
    const profile_data = await fetchData(BACKEND_URL+BACK_END_API_PROFILE,TOKEN)
      if(profile_data.status=200){
        try{
          dispatch(_save_user_profile(profile_data.data[0]))
          dispatch(_load_screen_(false))
        }catch(e){
          localStorage.clear();
          dispatch(_delete_token_(null));
          dispatch(_save_survey_(null));
          dispatch(_delete_user_profile(null));
          dispatch(_load_screen_(false))
          // console.log("subscription_type : ",subscription_type)
          // console.log("plan : ",plan)
          if(subscription_type!=null && subscription_type!=undefined && plan!=null && plan!=undefined){
            navigate(`/login?subscription_type=${subscription_type}&plan=${plan}`)
          }else if(invitation_code!=null && invitation_code!=undefined){
            navigate(`/login?user=login_f&invitation_code=${invitation_code}`)
          }else{
            navigate("/login?user=login_s")
          }
        }

    }

  }


  const track_user = async()=>{
    await HitUrl(BACKEND_URL+BACK_END_API_TRACK_USER)
  }


  const get_workshop_list = async() => {
    const workspace_list = await fetchData(BACKEND_URL+BACK_END_API_WORKSPACE,TOKEN)
      if(workspace_list.status=200){
        try{
          dispatch(_workspace_id_(workspace_list.data))
          
        }catch(e){
          localStorage.clear();
          dispatch(_delete_token_(null));
          dispatch(_save_survey_(null));
          dispatch(_delete_user_profile(null));
          dispatch(_load_screen_(false))          
          navigate("/login?user=login_s")
        }

    }

  }
  const get_chosen_project = async() => {
    const workspace_list = await fetchData(BACKEND_URL+BACK_END_API_INITIAL_WORKSPACE,TOKEN)
      if(workspace_list.status=200){
        try{
          localStorage.setItem("chose_workspace",JSON.stringify(workspace_list.data[0]))
        }catch(e){
          localStorage.clear();
          dispatch(_delete_token_(null));
          dispatch(_save_survey_(null));
          dispatch(_delete_user_profile(null));
          dispatch(_load_screen_(false))          
          navigate("/login?user=login_s")
        }

    }

  }

  const get_subscription_details = async() => {
    const subscribe_data = await fetchData(BACKEND_URL+BACK_END_API_SUBSCRIBE_CHECK,TOKEN)
    // if(subscribe_data.status=200){
      // try{
          // console.log(subscribe_data.data)
      dispatch(_save_details_(subscribe_data.data))
          // }catch(e){}

    // }

  }
  
  const get_token_generated_by_user = async() => {
    const resp = await fetchData(BACKEND_URL+BACK_END_API_TOKEN_GENERATED,TOKEN)
    if(resp.status==200){
      dispatch(_save_generated_token_(resp.data))
    }
  }

  const get_subcribe_data_of_user = async() =>{
    const subscribe_detail_data = await fetchData(BACKEND_URL+BACK_END_API_SUBCRIPTION_DETAILS,TOKEN)
    try{
      dispatch(_save_sub_details_(subscribe_detail_data.data))
    }catch(e){}
  }

  useEffect(() => {
    if(TOKEN){
        get_profile_data()
        get_workshop_list()
        get_chosen_project()
        get_subscription_details()
        get_subcribe_data_of_user()
        get_token_generated_by_user()
        track_user()
    }
    if (localStorage.getItem("three_steps")) {
      dispatch(_save_survey_(localStorage.getItem("three_steps")));
    }
  }, [TOKEN]);

  // useEffect(()=>{

  // },[])

  useEffect(()=>{
    if(_survey_data_=="true"){
      setsubcheck(null)
      if(subscription_type!=null && subscription_type!=undefined && plan!=null && plan!=undefined){
        navigate(`/first_step?survey_data_first=by-for-user-clarification&subscription_type=${subscription_type}&plan=${plan}`)
      }else if(invitation_code!=null && invitation_code!=undefined){
        navigate(`/first_step?survey_data_first=by-for-user-clarification&invitation_code=${invitation_code}`)
      }else{
        navigate("/first_step?survey_data_first=by-for-user-clarification")
      }
    }
  },[_survey_data_])
  

  useEffect(()=>{
    // console.log("subscriptions_details : ",subscriptions_details)
    if(subscriptions_check!=null){
        setsubcheck(subscriptions_check.restrict_user)
        // if(subscriptions_check.restrict_user){
          // navigate("/subscribe?user=with_user_details")
        // }
    }
  })





  return (  
    <>
      {TOKEN
        ?
        loading_page
        ?
          <LoadingPage/>
        :
        <>
            {subcheck
            ?
            <>
              {invitation_code_show
              ?
                <>
                  <div>
                    <Navbar _TOKEN_FOR_VALIDATION_NAVBAR_={TOKEN}/>
                    <AllRoutes _TOKEN_FOR_VALIDATION_NAVBAR_={TOKEN}/>
                  </div>
                </>
              :
                <>
                  <Subscription _TOKEN_FOR_VALIDATION_NAVBAR_={TOKEN}/>
                  <Navbar _TOKEN_FOR_VALIDATION_NAVBAR_={TOKEN}/>
                  <AllRoutes _TOKEN_FOR_VALIDATION_NAVBAR_={TOKEN}/>
                </>
              }
            </>

            :
              <div>
                <Navbar _TOKEN_FOR_VALIDATION_NAVBAR_={TOKEN}/>
                <AllRoutes _TOKEN_FOR_VALIDATION_NAVBAR_={TOKEN}/>
              </div>
            }
        </>
        :
        loading_page
        ?
          <LoadingPage/>
        :
          <>
            <Login redirect_to_stripe_from_app={data_of_planning}/>
          </>
      }
      <Toaster/>
    </>
  );
}

export default App;
