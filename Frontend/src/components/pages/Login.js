import React, { useEffect, useState } from 'react';
import { LoginData } from '../../apis/apiService';

import toast, { Toaster } from 'react-hot-toast';

import '../../PinInput.css';


import GoogleAuthComponent from './LoginUpdate/GoogleAuthComponent';

import { useNavigate } from "react-router-dom";

import OTPInput, { ResendOTP } from "otp-input-react";

import { useSelector, useDispatch } from "react-redux";

import {
    _save_token_, _delete_token_
} from "../../features/AuthenticationToken";
import {
    _save_survey_
} from "../../features/ThreeSteps";

import {
    _load_screen_
} from "../../features/LoadingScreen";

import { BACKEND_URL, BACK_API_LOGIN_URL, BACK_TOKEN_RECEIVE, BACK_API_FACEBOOK } from '../../apis/urls'


import GoogleLoginSigup from './LoginUpdate/GoogleLoginSigup';



import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import LoadingPage from '../LoadingPage';

import GoogleOneTap from './LoginUpdate/GoogleOneTap';



import { useLocation } from "react-router-dom";
import LinkedInSignUp from './LoginUpdate/LinkedInSignUp';

import { setDocumentTitle } from '../NavBar/DynamicTitle';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    height:350,
    bgcolor: '#efefefd6',
    boxShadow: 24,
    borderRadius: "10px",
    p: 4,
};

export default function Login() {

    let navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

      useEffect(() => {
            setDocumentTitle("Login Page");
        }, []);

    const searchParams = new URLSearchParams(location.search);
    const subscription_type = searchParams.get('subscription_type');
    const plan = searchParams.get('plan');
    const invitation_code = searchParams.get('invitation_code');


    const [open, setOpen] = React.useState(false);
    const [popupgoogle, setpopupgoogle] = React.useState(false);


    const [OTP, setOTP] = useState("");

    const notifyerror = (message) => toast.error(message);
    const notifysucces = (message) => toast.success(message);

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const [wholePageLoading, setwholePageLoading] = useState(false)
    const [loading, setloading] = useState(false)
    
    const [timer_start_to_show_message, settimer_start_to_show_message] = useState(false)


    let TOKEN = useSelector(
        (state) => state.SetAuthenticationToken.AuthenticationToken
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            if (TOKEN) {
            } else {
                setpopupgoogle(true)
            }
        }, 5000);

        return () => {
            clearTimeout(timer);
        };
    }, []);


    const [formData, setFormData] = useState({
        email: '',
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        settimer_start_to_show_message(true)
        event.preventDefault();
        setloading(true)

        // console.log(formData);
        try {
            const url = BACKEND_URL + BACK_API_LOGIN_URL
            const response = await LoginData(formData, url);


            if (response.request.status == 201) {

                // localStorage.setItem("token", response.data.access);
                // localStorage.setItem("refresh", response.data.refresh);

                // dispatch(_save_token_(response.data.access));

                // localStorage.setItem("three_steps",response.data.three_steps)

                // navigate("/");
                // setFormData({ email: '', password: '' });
                notifysucces("check you mail " + formData.email)

                // setsendOTP(true)
                setOpen(true)
                // setFormData({ email: ''});
                settimer_start_to_show_message(false)

            } else {
                settimer_start_to_show_message(false)
                if(response.response.data.detail=="You do not have permission to perform this action."){
                    notifyerror("To Many attempts wait for Minutes")
                }else{
                    notifyerror(response.response.data.detail)
                    // notifyerror("supply valid email")
                }
            }
            
        } catch (error) {
            // Handle any errors
            notifyerror("supply valid email")
            // notifyerror("check email and password")
        }
        setloading(false)

    };


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    const get_refresh_access = async () => {
        setwholePageLoading(true)
        const url = BACKEND_URL + BACK_TOKEN_RECEIVE
        const response = await LoginData({ "token": OTP }, url);

        if (response.request.status == 201) {
            localStorage.setItem("token", response.data.access);
            localStorage.setItem("refresh", response.data.refresh);
            dispatch(_save_token_(response.data.access));
            dispatch(_save_survey_(response.data.three_steps))
            localStorage.setItem("three_steps", response.data.three_steps)

            // if there is stripe data redirect to stripe
            if (subscription_type != null && subscription_type != undefined && plan != null && plan != undefined) {
                navigate(`/subscribe_by_user?subscription_type=${subscription_type}&plan=${plan}`)
            } else if (invitation_code != null && invitation_code != undefined) {
                navigate(`/invitation/${invitation_code}`)
            } else {
                navigate("/");
            }
            return true
        } else {
            try {
                if (response.response.data.detail == "You do not have permission to perform this action.") {
                    notifyerror("Try after 3 minutes")
                } else {
                    notifyerror("Invalid token")
                }
            } catch (e) {
                notifyerror("Invalid token")
            }
        }
        setwholePageLoading(false)

    }

    useEffect(() => {
        // console.log('setOTP',OTP.length)
        if (OTP.length >= 6) {
            get_refresh_access()
        }
    }, [OTP])

    const handleSuccess = (credential) => {
        // Handle successful sign-in, use the credential if needed
        console.log('Sign-in success:', credential);
    };

    const handleFailure = (error) => {
        // Handle sign-in failure
        console.error('Sign-in failure:', error);
    };


    // =====show message in button while sending token======
    const [message, setMessage] = useState("Validating email");

    useEffect(() => {

        if(timer_start_to_show_message){
            const timers = [
            { time: 2000, message: "Validating email" },
            { time: 4000, message: "Validating account" },
            { time: 6000, message: "Validating Workspace" },
            { time: 8000, message: "Sending Token" },
            { time: 9000, message: "Wait For Validation ......." }
            ];
        
            timers.forEach(({ time, message }) => {
            setTimeout(() => {
                setMessage(message);
            }, time);
            });
        }

      }, [timer_start_to_show_message]);


    return (
        <>
            {popupgoogle ? <GoogleOneTap /> : null}
            <div className={open ? 'blur-sm' : ''}>
                <div className=" flex items-center flex-col w-full p-4 sm:p-1">
                    <div className='mt-[5%] items-center font-bold text-[25px] text-blue-800'>
                        <p className="text-[18px] font-semibold font-helv text-slate-500">Login or</p>
                    </div>
                    <div className='mt-1 items-center font-bold text-[25px] text-blue-800'>
                        <p className="text-[18px] font-semibold font-helv text-slate-500">Create an Account</p>
                    </div>
                    <div className='mt-5 items-center font-semibold text-slate-500'>
                        <p className="text-[18px] font-semibold font-helv">Sign in instantly using your existing accounts to get started quickly</p>
                    </div>
                    <div className='mt-5 items-center font-semibold text-slate-500'>
                        <p className="text-[18px] font-semibold">By proceeding, you are agreeing to <a href="#" className='text-blue-600 font-semibold' >Terms of services</a> and <a href="#" className='text-blue-600 font-semibold' >Privacy Notice .</a></p>
                    </div>
                </div>
                <div className="flex justify-center items-center p-6 flex-col sm:flex-row">
                    <div className="flex mt-3 ">
                        {/* <GoogleLoginSigup /> */}
                        <GoogleAuthComponent/>
                    </div>
                    <div className='md:ml-4 lg:ml-4 mt-3 '>
                        <LinkedInSignUp />
                    </div>
                </div>


                <div className="flex mt-4 items-center">
                    <hr className="flex-grow border-t border-gray-300 lg:ml-[30%] md:ml-[10%] sm:ml-[10%]" />
                    <span className="px-4 text-slate-600 text-[15px] ">or continue with</span>
                    <hr className="flex-grow border-t border-gray-300 lg:mr-[30%] md:mr-[10%] sm:mr-[10%]" />
                </div>


                <form className="p-6" onSubmit={handleSubmit}>
                    <div className='flex lg:w-[40%] md:w-[100%] sm:w-[60%] m-auto flex-col p-3'>
                        <div className="mb-2">
                            <label
                                htmlFor="email"
                                className="block text-[15px] font-semibold"
                            >
                                Email
                            </label>
                            {/* <label className='absolute sm:ml-[80%] md:ml-[90%] lg:ml-[52%] text-slate-600 text-[16px] mt-[16px] font-bold'>@</label> */}
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                autoComplete="off"
                                placeholder='Enter your email'
                                className="block w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            />
                        </div>
                        <div className='mt-[15px]'>
                            <label className="text-blue-600 font-semibold ">We'll email you a verification code for a password free registration.</label>
                        </div>

                        <div className="mt-6">
                            {loading
                                ?
                                <button disabled className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform rounded-md focus:outline-none bg-red-700">
                                    {message}
                                </button>
                                :
                                <button className="w-full text-[15px] px-4 py-2 tracking-wide text-blue-800 bg-slate-700 font-bold transition-colors duration-200 transform rounded-md hover:bg-blue-600 focus:outline-none focus:bg-purple-600">
                                    Continue
                                </button>
                            }
                        </div>

                    </div>
                </form>
            </div>

            <Toaster />
            {open
                ?
                <>
                    <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        open={open}
                        onClose={handleClose}
                        closeAfterTransition
                        slots={{ backdrop: Backdrop }}
                        slotProps={{
                            backdrop: {
                                timeout: 500,
                            },
                        }}
                        className="backdrop-blur-sm bg-opacity-80"
                    >
                       

                        <Fade in={open}>
                            <Box sx={style}>
                            <button
                            className='float-right font-bold text-[15px]'
                        onClick={()=>{
                            setOpen(false)
                        }}>X</button>
                                <div className=' p-3 m-4 flex flex-col justify-center items-center'>
                                    <div className='m-5'>

                                        <svg width="44" height="44" viewBox="0 0 40 40" fill="none" stroke="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.5 19.375V18.125C19.5 17.8125 19.1875 17.5 18.875 17.5H13.125C12.7344 17.5 12.5 17.8125 12.5 18.125V19.375C12.5 19.7656 12.7344 20 13.125 20H18.875C19.1875 20 19.5 19.7656 19.5 19.375ZM13.125 15H26.875C27.1875 15 27.5 14.7656 27.5 14.375V13.125C27.5 12.8125 27.1875 12.5 26.875 12.5H13.125C12.7344 12.5 12.5 12.8125 12.5 13.125V14.375C12.5 14.7656 12.7344 15 13.125 15ZM38.5938 12.8906C38.4375 12.7344 36.875 11.4844 35 9.92188V7.5C35 6.17188 33.8281 5 32.5 5H28.8281C28.5156 4.76562 28.2031 4.53125 28.0469 4.375C26.3281 3.04688 23.3594 0 20 0C16.5625 0 13.6719 2.96875 11.875 4.375C11.7188 4.53125 11.4062 4.76562 11.0938 5H7.5C6.09375 5 5 6.17188 5 7.5V9.92188C3.04688 11.4844 1.48438 12.7344 1.32812 12.8906C0.46875 13.5938 0 14.6094 0 15.7812V36.25C0 38.3594 1.64062 40 3.75 40H36.25C38.2812 40 40 38.3594 40 36.25V15.7812C40 14.6875 39.4531 13.5938 38.5938 12.8906ZM20 2.5C21.6406 2.5 23.4375 3.82812 24.9219 5H15C16.4844 3.82812 18.2812 2.5 20 2.5ZM7.5 7.5H32.5V21.0938C29.9219 23.125 27.3438 25.1562 25.7031 26.4844C24.375 27.5781 21.7969 30.0781 20 30C18.125 30.0781 15.5469 27.5781 14.2188 26.4844C12.5781 25.1562 10 23.125 7.5 21.0938V7.5ZM2.5 15.7812C2.5 15.3906 2.65625 15.0781 2.89062 14.8438C3.04688 14.7656 3.82812 14.0625 5 13.2031V19.0625C4.0625 18.3594 3.20312 17.6562 2.5 17.0312V15.7812ZM37.5 36.25C37.5 36.9531 36.875 37.5 36.25 37.5H3.75C3.04688 37.5 2.5 36.9531 2.5 36.25V20.2344C5.78125 22.9688 10.2344 26.4844 12.6562 28.4375C14.2969 29.7656 17.1094 32.5781 20 32.5C22.8125 32.5781 25.625 29.7656 27.2656 28.4375C29.6875 26.4844 34.1406 22.9688 37.5 20.2344V36.25ZM37.5 17.0312C36.7188 17.6562 35.8594 18.3594 35 19.0625V13.2031C36.0938 14.0625 36.875 14.7656 37.0312 14.8438C37.2656 15.0781 37.5 15.3906 37.5 15.7812V17.0312Z" fill="rgb(104, 81, 255)" fill-opacity="1"></path></svg>

                                    </div>
                                    <div>
                                        <h1 className='font-sans text-[17px] font-bold'>Enter the OTP send to</h1>
                                    </div>
                                    <div>
                                        <strong className="font-sans font-extrabold text-[19px] ">{formData.email}</strong>
                                    </div>
                                </div>
                                <div className='flex justify-center items-center mb-5'>
                                    <div>
                                        {wholePageLoading
                                            ?
                                            <>
                                                <div className='flex justify-center items-center'>
                                                    <div>
                                                        <p className='font-bold text-[20px] text-red-600'>Verifying OTP</p>
                                                    </div>
                                                </div>
                                            </>
                                            :
                                            <div className="change_input_style">
                                            <OTPInput
                                                value={OTP}
                                                onChange={(e) => {
                                                    setOTP(e)
                                                }}
                                                autoFocus
                                                OTPLength={6}
                                                otpType="number"
                                                disabled={false}
                                                secure
                                            />
                                            </div>
                                        }
                                    </div>
                                </div>
                            </Box>
                        </Fade>
                    </Modal>
                </>
                :
                null
            }



        </>
    );
}
