import React, { useState, useRef, useEffect } from 'react';
import { styled } from "@mui/material/styles";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { useNavigate } from 'react-router-dom';
import { fetchData, postData } from '../../../apis/apiService';
import { BACK_END_API_PROFILE,BACK_END_API_SUBCRIPTION_CHARGE,BACKEND_URL,BACK_END_API_SUBSCRIBE_CHECK,BACK_END_API_SUBSCRIBE_USER } from '../../../apis/urls';
import LoadingPage from '../../LoadingPage';
import toast, { Toaster } from 'react-hot-toast';
import { _delete_token_ } from "../../../features/AuthenticationToken";
import { _save_survey_ } from "../../../features/ThreeSteps";
import { _delete_user_profile } from "../../../features/Fullprofile";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import ChangeWorkSpace from '../ChangeWorkSpace';

import {
  MdLogout,
} from "react-icons/md";



export const monthly_plan=["Jasper Chat","50+ AI templates","Browser extension","Support for 30+ languages","Email support"]
export const annually_plan=["Up to 3 users","Automated workflows","Google Docs style editor","Compose & command features","Live chat users"]
export const  enterprise_plan=["Collaborate with more than 3 users","Tailored AI Brand Voice","API access","Personalized onboarding & training","Dedicated accounnt manager"]


const ISwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
          opacity: 1,
          border: 0
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5
        }
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff"
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color:
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[600]
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3
      }
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500
      })
    }
  }));
const Subscription = (props) => {
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const notifyerror = (message) => toast.error(message);
    const notifysucces = (message) => toast.success(message);


    const [isCheckedPlan, setIsCheckedPlan] = useState(false);
    const [subcharge,setsubcharge] = useState(null);
    const [Token,setToken] = useState(null);
    const [Loading,setLoading] = useState(true);
    const [wholePageLoading,setwholePageLoading] = useState(false);
    const [startbtnLoading,setstartbtnLoading] = useState(false);
    const [premiumbtnLoading,setpremiumbtnLoading] = useState(false);
    
    const [switch_workspace,setswitch_workspace] = useState(false);


    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const subscription_type = searchParams.get('subscription_type');
    const plan = searchParams.get('plan');



    const direct_subcribe_from_url = async(plan,monthly_annaully) =>{
      const formData = {
        "plan":plan,
        "subscription_type":monthly_annaully
      }
      const resp = await postData(formData,BACKEND_URL+BACK_END_API_SUBSCRIBE_USER,Token)

      if(resp.status==200){
        try{
          window.location.replace(resp.data.message.url);
        }catch(e){
          // notifyerror("something went wrong refresh the page")
        }
      }else{
        // notifyerror("something went wrong refresh the page")
        // setstartbtnLoading(false)
      }
    }

    
    
    useEffect(()=>{
      if(subscription_type!=null && subscription_type!=undefined && plan!=null && plan!=undefined){
        setwholePageLoading(true)
        if(Token!=null){
          direct_subcribe_from_url(plan,subscription_type)
        }
      }
    },[Token])
    useEffect(()=>{
      if(subscription_type!=null && subscription_type!=undefined && plan!=null && plan!=undefined){
        setwholePageLoading(true)
      }
    },[])

    



    const handleCheckboxChangePlan = (event) => {
        setIsCheckedPlan(event.target.checked);
      };
      const get_subscription_details = async() => {
        const subscribe_data = await fetchData(BACKEND_URL+BACK_END_API_SUBSCRIBE_CHECK,Token)
        const subscribe_charge = await fetchData(BACKEND_URL+BACK_END_API_SUBCRIPTION_CHARGE,Token)
        if(subscribe_data.status){
          setLoading(false)
        }else{
          setLoading(false)
        }
        if(subscribe_charge.status==200){
          setsubcharge(subscribe_charge.data[0])
        }
      }
    
      useEffect(() => {
        if(Token!=null){
            get_subscription_details()
        }
      }, [Token]);

      useEffect(()=>{
        setToken(props._TOKEN_FOR_VALIDATION_NAVBAR_)
      },[])


      const send_subcription_request = async(plan,monthly_annaully) =>{

        if(plan=="starter"){
          setstartbtnLoading(true)
        }else{
          setpremiumbtnLoading(true)
        }
        const formData = {
          "plan":plan,
          "subscription_type":monthly_annaully
        }

        const resp = await postData(formData,BACKEND_URL+BACK_END_API_SUBSCRIBE_USER,Token)

        if(resp.status==200){
          setstartbtnLoading(false)
          try{
            window.location.replace(resp.data.message.url);
          }catch(e){
            notifyerror("something went wrong refresh the page")
          }
        }else{
          // navigate("/")
          notifyerror("something went wrong refresh the page")
          setstartbtnLoading(false)
        }
      }



  return (
  <>
  {wholePageLoading
  ?
      <LoadingPage/>
  :
   <>
        <div
          className="justify-center h-[95vh]  m-auto items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        >
          <div className="relative p-5">

            {/* ================the plan design========== */}
            {Loading
            ?

              <LoadingPage />
            :
            <>
          <section className="flex flex-col justify-center antialiased bg-gray-100 text-gray-600 min-h-screen p-4">
                  

                  <div className="max-w-5xl p-5 mt-6">
                  

                      <h2 className="text-3xl text-gray-800 mt-[40px] mr-[100px] font-bold text-center mb-4">Plans</h2>
                        <div className='w-[100px] float-right'>
                          <button
                        onClick={() => {
                          localStorage.clear();
                          dispatch(_delete_token_(null));
                          dispatch(_save_survey_(null));
                          dispatch(_delete_user_profile(null));
                          window.location.replace("/login");
                        }}
                      >
                        <div
                          className="py-2 px-3 flex items-center text-blue-500"
                        >
                          <div className="mr-2">
                            <MdLogout size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-helv">Logout</p>
                          </div>
                        </div>
                          </button>
                        </div>
                        
                        {switch_workspace
                        ?
                          <>
                            {/* ====================close switch workspace================ */}
                              <ChangeWorkSpace/>
                            {/* ====================close switch workspace================ */}
                          </>
                        :
                          null
                        }
                        

                        <div className='float-right'>
                          <button
                            className='bg-[#223358] rounded-r-sm'
                            onClick={() => {
                              setswitch_workspace(true)
                            }}
                          >
                        <div
                          className="py-2 px-3 flex items-center text-white font-semibold"
                        >
                          <div>
                            <p className="text-sm font-helv">Switch Work Space</p>
                          </div>
                        </div>
                          </button>
                        </div>

                      <div className="flex justify-center">
                          <div className="flex items-center space-x-3 mb-8">
                          <div className="text-sm text-gray-500 font-medium min-w-[120px] text-right">Monthly</div>
                          <div className="relative select-none w-[44px]">
                              {/* ======swip===== */}
                                  <FormGroup>
                                  <FormControlLabel
                                  control={
                                      <ISwitch
                                      sx={{ m: 1 }}
                                      checked={isCheckedPlan}
                                      onChange={handleCheckboxChangePlan}
                                      />
                                  }
                                  label=""
                                  />
                              </FormGroup>
                          {/* ======swip===== */}
                          </div>
                          <div className="text-sm text-gray-500 font-medium min-w-[120px]">Annually 
                          <span className="text-green-500">(-20%)</span>
                          </div>
                          </div>
                          
                      </div>
                      
                      <div className="grid grid-cols-12 gap-6">
                          
                          <div className="relative col-span-full md:col-span-4 bg-white shadow-md rounded-sm border border-gray-200">
                          <div className="absolute top-0 left-0 right-0 h-0.5 bg-green-500" aria-hidden="true"></div>
                          <div className="px-5 pt-5 pb-6 border-b border-gray-200">
                              <header className="flex items-center mb-2">
                                  <div className="w-6 h-6 rounded-full flex-shrink-0 bg-gradient-to-tr from-green-500 to-green-300 mr-3">
                                      <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
                                      <path d="M12 17a.833.833 0 01-.833-.833 3.333 3.333 0 00-3.334-3.334.833.833 0 110-1.666 3.333 3.333 0 003.334-3.334.833.833 0 111.666 0 3.333 3.333 0 003.334 3.334.833.833 0 110 1.666 3.333 3.333 0 00-3.334 3.334c0 .46-.373.833-.833.833z" />
                                      </svg>
                                  </div>
                                  <h3 className="text-lg text-gray-800 font-semibold">Starter</h3>
                              </header>
                              <div className="text-sm mb-2">For the hobbyist just getting started</div>
                              <hr></hr>
                              <div className="text-sm mb-2">The economic option for individuals who want to use Generative AI casually for hobbies and work.</div>
                              
                              <div className="text-gray-800 font-bold mb-4">
                                  <span className="text-2xl">$</span><span className="text-3xl">
                                  {isCheckedPlan
                                  ?
                                  <>
                                    {subcharge &&
                                      subcharge.annaully_starter
                                    }
                                  </>
                                  :
                                  <>
                                    {subcharge &&
                                      subcharge.monthly_starter
                                    }
                                  </>
                                  }
                                  </span>
                                  {isCheckedPlan
                                  ?
                                  <>
                                    <span className="text-gray-500 font-medium text-sm">/yr</span>
                                  </>
                                  :
                                  <>
                                    <span className="text-gray-500 font-medium text-sm">/mo</span>
                                  </>
                                  }
                              </div>


                              {startbtnLoading
                              ?
                                <button className="font-medium text-sm inline-flex items-center justify-center px-3 py-2 border border-gray-200 rounded leading-5 shadow-sm transition duration-150 ease-in-out focus:outline-none focus-visible:ring-2 hover:border-gray-300 text-gray-600 w-full"
                                >
                                <div role="status">
                                  <svg aria-hidden="true" className="w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                  </svg>
                                  <span className="sr-only">Loading...</span>
                              </div>
                                </button>
                              :
                                <button className="font-medium text-sm inline-flex items-center justify-center px-3 py-2 border border-gray-200 rounded leading-5 shadow-sm transition duration-150 ease-in-out focus:outline-none focus-visible:ring-2 hover:border-gray-300 text-gray-600 w-full"
                                  onClick={()=>{
                                    if(isCheckedPlan){
                                      send_subcription_request("starter","annually")
                                    }else{
                                      send_subcription_request("starter","monthly")
                                    }
                                  }}
                                >
                                    {/* Start 7/Days Free Trail */}
                                    Proceed With Plan
                                </button>

                              }
                          </div>
                          <div className="px-5 pt-4 pb-5">
                              <div className="text-xs text-gray-800 font-semibold uppercase mb-4">What's included</div>
                              
                              <ul>
                              {monthly_plan.map((data,index)=>{
                                  return(
                                          <li className="flex items-center py-1">
                                              <svg className="w-3 h-3 flex-shrink-0 fill-current text-green-500 mr-2" viewBox="0 0 12 12">
                                              <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                              </svg>
                                              <div className="text-sm">{data}</div>
                                          </li>
                                  )
                              })}
                              </ul>
                          </div>
                          </div>
                          
                          <div className="relative col-span-full md:col-span-4 bg-white shadow-md rounded-sm border border-gray-200">
                          <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500" aria-hidden="true"></div>
                          <div className="px-5 pt-5 pb-6 border-b border-gray-200">
                              <header className="flex items-center mb-2">
                                  <div className="w-6 h-6 rounded-full flex-shrink-0 bg-gradient-to-tr from-blue-500 to-blue-300 mr-3">
                                      <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
                                      <path d="M12 17a.833.833 0 01-.833-.833 3.333 3.333 0 00-3.334-3.334.833.833 0 110-1.666 3.333 3.333 0 003.334-3.334.833.833 0 111.666 0 3.333 3.333 0 003.334 3.334.833.833 0 110 1.666 3.333 3.333 0 00-3.334 3.334c0 .46-.373.833-.833.833z" />
                                      </svg>
                                  </div>
                                  <h3 className="text-lg text-gray-800 font-semibold">Premium Mode</h3>
                              </header>
                              <div className="text-sm mb-2">For individuals and small items</div>
                              <hr></hr>
                              <div className="text-sm mb-2">The most popular option for professionals who want to use automations and write-long-form.items</div>
                              
                              <div className="text-gray-800 font-bold mb-4">
                                  <span className="text-2xl">$</span><span className="text-3xl">
                                {isCheckedPlan
                                  ?
                                  <>
                                    {subcharge &&
                                      subcharge.annaully_premium_mode
                                    }
                                  </>
                                  :
                                  <>
                                    {subcharge &&
                                      subcharge.monthly_premium_mode
                                    }
                                  </>
                                  }
                                  </span>
                                  {isCheckedPlan
                                  ?
                                  <>
                                    <span className="text-gray-500 font-medium text-sm">/yr</span>
                                  </>
                                  :
                                  <>
                                    <span className="text-gray-500 font-medium text-sm">/mo</span>
                                  </>
                                  }
                              </div>
                              
                            {premiumbtnLoading
                            ?
                              <button className="font-medium text-sm inline-flex items-center justify-center px-3 py-2 border border-gray-200 rounded leading-5 shadow-sm transition duration-150 ease-in-out focus:outline-none focus-visible:ring-2 hover:border-gray-300 text-gray-600 w-full"
                                >
                                <div role="status">
                                  <svg aria-hidden="true" className="w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                  </svg>
                                  <span className="sr-only">Loading...</span>
                              </div>
                                </button>
                            :
                              <button className="font-medium text-sm inline-flex items-center justify-center px-3 py-2 border border-gray-200 rounded leading-5 shadow-sm transition duration-150 ease-in-out focus:outline-none focus-visible:ring-2 hover:border-gray-300 text-gray-600 w-full"
                              onClick={()=>{
                                      if(isCheckedPlan){
                                          send_subcription_request("premium","annually")
                                        }else{
                                          send_subcription_request("premium","monthly")
                                        }
                                    }}>
                                  {/* Start 7/Days Free Trail  */}
                                  Proceed With Plan
                              </button>
                            }

                          </div>
                          <div className="px-5 pt-4 pb-5">
                              <div className="text-xs text-gray-800 font-semibold uppercase mb-4">What's included</div>
                              
                              <ul>
                              {annually_plan.map((data,index)=>{
                                  return(
                                      <li className="flex items-center py-1">
                                          <svg className="w-3 h-3 flex-shrink-0 fill-current text-green-500 mr-2" viewBox="0 0 12 12">
                                          <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                          </svg>
                                          <div className="text-sm">{data}</div>
                                      </li>
                                  )
                              })}

                              </ul>
                          </div>
                          </div>
                          
                          <div className="relative col-span-full md:col-span-4 bg-white shadow-md rounded-sm border border-gray-200">
                          <div className="absolute top-0 left-0 right-0 h-0.5 bg-indigo-500" aria-hidden="true"></div>
                          <div className="px-5 pt-5 pb-6 border-b border-gray-200">
                              <header className="flex items-center mb-2">
                                  <div className="w-6 h-6 rounded-full flex-shrink-0 bg-gradient-to-tr from-indigo-500 to-indigo-300 mr-3">
                                      <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
                                      <path d="M12 17a.833.833 0 01-.833-.833 3.333 3.333 0 00-3.334-3.334.833.833 0 110-1.666 3.333 3.333 0 003.334-3.334.833.833 0 111.666 0 3.333 3.333 0 003.334 3.334.833.833 0 110 1.666 3.333 3.333 0 00-3.334 3.334c0 .46-.373.833-.833.833z" />
                                      </svg>
                                  </div>
                                  <h3 className="text-lg text-gray-800 font-semibold">Business Mode</h3>
                              </header>
                              <div className="text-sm mb-2">For growing teams and businesses</div>
                              <hr></hr>
                              <div className="text-sm mb-2">The AI built for teams with the ability to learn your brand voice, and the support you need to scale.</div>
                              
                              <div className=" font-bold mb-4 mt-3 text-white">
                                  <span className="text-2xl">$</span><span className="text-3xl"></span><span className="text-gray-500 font-medium text-sm"></span>
                              </div>
                              
                              <button disabled className="font-medium text-sm inline-flex items-center justify-center px-3 py-2 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out bg-indigo-500 focus:outline-none focus-visible:ring-2 hover:bg-indigo-600 text-white w-full">contact sales</button>
                        </div>



                          <div className="px-5 pt-4 pb-5">
                              <div className="text-xs text-gray-800 font-semibold uppercase mb-4">What's included</div>
                              
                              <ul>
                              {enterprise_plan.map((data,index)=>{
                                  return (
                                          <li className="flex items-center py-1">
                                              <svg className="w-3 h-3 flex-shrink-0 fill-current text-green-500 mr-2" viewBox="0 0 12 12">
                                              <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                              </svg>
                                              <div className="text-sm">{data}</div>
                                          </li>
                                  )
                              })}
                                
                              </ul>
                          </div>
                          </div>
                      </div>
                  </div>
            </section>
            </>
            }
            {/* ================the plan design========== */}
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  }
      {/* <Toaster/> */}
    </>
  )
}

export default Subscription