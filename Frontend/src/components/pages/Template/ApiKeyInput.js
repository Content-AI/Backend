import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import Upgradenow from '../../Settings/SettingsPages/Modal/Upgradenow';
import { useNavigate } from 'react-router-dom'
import { NavIcons, SealCheck } from "../../Icons";
import { fetchData } from '../../../apis/apiService';
import { BACKEND_URL,BACK_END_API_GET_API_KEY,BACK_END_GENERATE_NEW_API_KEY } from '../../../apis/urls';

import DangerIcon from '../../Icons/DangerIcon'

import { AiFillEyeInvisible ,AiFillEye} from 'react-icons/ai';

const ApiKeyInput = ({ apiKey, onChange }) => {

    const [showApiKey, setshowApiKey] = useState(false);
    const [_show_confirmation, set_show_confirmation] = useState(false);
    const [ApiKey, setApiKey] = useState("**************");
    const navigate = useNavigate()


    let subscriptions_check = useSelector(
    (state) => state.SetSubscriptions.Subscriptions
    );
    let subscriptions_details = useSelector(
    (state) => state.SetSubscriptionsData.SubscriptionsData
    );

    let TOKEN = useSelector(
        (state) => state.SetAuthenticationToken.AuthenticationToken
    );

    // console.log(subscriptions_details.user.plan)

    const get_api_key = async() =>{
        
        if(subscriptions_details!=null){
            if(subscriptions_details.user.status != "trial" && subscriptions_details.user.plan == "premium"){
                const resp =await fetchData(BACKEND_URL+BACK_END_API_GET_API_KEY,TOKEN)
                if(resp.status==200){
                    setApiKey(resp.data.api_key)
                }
            }
        }
    }
    
    useEffect(()=>{
       get_api_key()
    },[subscriptions_details])


    const handleTogglePassword = () => {
        setshowApiKey(!showApiKey);
    };


    const generate_new_key = async()=>{
        const resp  = await fetchData(BACKEND_URL+BACK_END_GENERATE_NEW_API_KEY,TOKEN)
        if(resp.status==200){
            get_api_key()   
        }
    }

  return (
    <>
    <div className="mb-4">
      <label className=" block dark:text-white text-sm font-medium text-gray-600 mb-2">
        API Key
      </label>
      {subscriptions_details &&
        <>
        {subscriptions_details.user.status != "trial" && subscriptions_details.user.plan == "premium"
        ?
            <>
            <div className="relative flex items-center">
                <input
                    id="api-key"
                    type={showApiKey ? "text" : "password"}
                    value={ApiKey}
                    placeholder="Your API key..."
                    className="w-1/2 md:w-96 px-4 py-2 border border-gray-300 rounded-l-md  text-gray-700"
                />
                        <button
                            className="p-3  cursor-pointer rounded-r-md"
                            type="button"
                            onClick={handleTogglePassword}
                        >
                            {showApiKey ? (
                            <AiFillEyeInvisible className='w-[30px] h-[30px]'/>
                            ) : (
                            <AiFillEye  className='w-[30px] h-[30px]'/>
                            )}
                        </button>
            </div>
            <button
                className='text-red-500 font-semibold no-underline'
                onClick={()=>{
                    set_show_confirmation(true)
                    // generate_another_key()
                }}
            >
                Generate another key
            </button>
            <p className="mt-2 text-sm text-gray-500">
                Your API key is a secret token used to authenticate requests to the API. Please keep it secure.
                <a type='link'
                    target='_blank'
                    className='underline text-blue-500 font-semibold ml-2'
                    href={BACKEND_URL+"/doc/"}>
                    API's Doc's
                </a>
                {/* <button type='button'
                    className='underline text-blue-500 font-semibold ml-2'
                    onClick={()=>{
                        window.location.href = BACKEND_URL+"/doc/"
                    }}>
                    API's Doc's
                </button> */}
            </p>

            </>
            :
                <button
                    type="submit"
                    className="w-[210px] text-sm transition-all duration-200 relative font-semibold outline-none hover:outline-none focus:outline-none rounded-lg px-4 py-2 text-white bg-gradient-to-r  shadow-sm bg-[#334977]"
                    id="generateBtn1"
                    onClick={()=>{
                    navigate("/settings/subscription_plan")
                    }}

                >
                <span className="flex select-none">
                    <SealCheck classes="w-6 h-6 mr-2" />
                        Upgrade to Premium
                    </span>
                </button>
        }
        </>
      }
    </div>

    {_show_confirmation
        ?
        <>
            <div className="fixed inset-0 z-40 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
                    <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-50"></div>
                        <div className="relative h-full bg-white text-gray-900 rounded-md shadow-xl align-top sm:align-middle w-full sm:w-[416px]">

                            <div className="dark:bg-gray-800 dark:text-gray-200 dark:border-slate-500 w-full text-left flex justify-between items-center p-3 text-gray-900 ">

                            <div className="flex">
                            <div className="mt-5 ml-4 mr-5 ">
                                {/* <DangerIcon/>   */}
                            </div>
                            <div>
                            <h3 className="dark:text-white text-lg font-semibold">
                                Please remember that if you generate a new key, all the previous keys will be revoked.
                            </h3>
                            <h3 className="dark:text-white text-lg font-semibold">
                                Are you sure you want to proceed?
                            </h3>
                            </div>
                            </div>
                            </div>

                            <div className="dark:bg-gray-800 black dark:text-gray-200 dark:border-slate-500 flex flex-col p-6">
                                
                                <div className="p-6 flex items-center gap-4 justify-end">


                                <button
                                    className="w-full mt-2 p-2.5 flex-1 text-white bg-red-600 rounded-md outline-none ring-offset-2 ring-red-600 focus:ring-2"
                                        onClick={() => {
                                            generate_new_key()
                                            set_show_confirmation(false)
                                        }}
                                        >
                                    Generate
                                </button>
                                <button
                                    className="dark:text-white w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-indigo-600 focus:ring-2"
                                    onClick={() => {
                                        set_show_confirmation(false)
                                    }}
                                >
                                    Cancel  
                                </button>

                                </div>

                            </div>

                            </div>
                    </div>
            </div>
        </>

    :
        null}

    </>
    
  );
};

export default ApiKeyInput;
