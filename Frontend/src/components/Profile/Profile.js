import React , {useEffect,useState} from 'react'
import {Link, Navigate } from 'react-router-dom';
import Modal from 'react-modal';
import { IoMdArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector, useDispatch } from "react-redux";
import { _save_user_profile } from '../../features/Fullprofile';

import { BACK_END_API_PROFILE_UPDATE,BACKEND_URL } from '../../apis/urls';
import { patchData } from '../../apis/apiService';

import {
    _save_token_
  } from "../../features/AuthenticationToken";

  

const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [loadingdata, setloadingdata] = useState(false);
    
    let TOKEN = useSelector(
        (state) => state.SetAuthenticationToken.AuthenticationToken
      );

    let PROFILE_DATA = useSelector(
        (state) =>state.SetFullProfile.Fullprofile
      );

    const [firstName, setfirstName] = useState(null);
    const [EmailUser, setEmailUser] = useState(null);
    const [lastName, setlastName] = useState(null);

    
    const notifyerror = (message) => toast.error(message);
    const notifysucces = (message) => toast.success(message);


    useEffect(()=>{
        if(PROFILE_DATA){
            setfirstName(PROFILE_DATA.first_name)
            setlastName(PROFILE_DATA.last_name)
            setEmailUser(PROFILE_DATA.email)
        }
    },[PROFILE_DATA])


    const openModal = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };

    // useEffect(()=>{
    //     setIsModalOpen(!isModalOpen)
    // })

    const patch_data = async() =>{
        setloadingdata(true)
        const data = {
            first_name:firstName,
            last_name:lastName,
            email:EmailUser
        }
        const response = await patchData(data,BACKEND_URL+BACK_END_API_PROFILE_UPDATE+PROFILE_DATA?.id+"/",TOKEN)
        if(response.status==200){
            dispatch(_save_user_profile(response.data))
            notifysucces("profile saved")
        }else{
            notifyerror("enter correct data")
        }
        setloadingdata(false)
    }

  
  return (
    <>
     <div className='bg-[#FAFBFD]'>
      <Modal
        isOpen={isModalOpen}
        ariaHideApp={false}
        onRequestClose={()=>{
            setIsModalOpen(!isModalOpen)
        }}
        className="fixed inset-0 bg-white"
        overlayClassName="fixed inset-0"
      >
        <div className='m-1 p-1'>
            <button onClick={()=>{
                setIsModalOpen(!isModalOpen)
                navigate("/")
            }} className=" text-black font-bold py-2 px-4 rounded">
                <IoMdArrowBack/>
            </button>
            <div className="mt-[57px] fixed left-0 top-0 h-full w-64 shadow-2xl bg-white  rounded-[5px]">
            <hr></hr>
                <div className="flex flex-col ml-6">
                    <div className="mt-[2vh] ">
                        <div className='flex flex-col mr-4 p-3 '>
                            <p className="font-bold text-[#414357] text-[15px] mt-1  font-sans">Profile Settings</p>
                        </div>
                        <div className='bg-slate-200 mr-4 p-3 rounded-lg cursor-pointer'>
                            <p className="font-bold text-[#36464E] text-[13px]  font-sans">Profile</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col ml-6">
                    <div className="mt-[2vh] ">
                        <div className='flex flex-col mr-4 p-3'>
                            <p className="font-bold text-[#414357] text-[15px] mt-1  font-sans">Product Settings</p>
                        </div>
                        <div className='mr-4 p-3 rounded-lg cursor-pointer'>
                            <p className=" text-[#36464E] text-[13px]  font-sans">Integrations</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col ml-6">
                    <div className="mt-[2vh] ">
                        <div className='flex flex-col mr-4 p-3'>
                            <p className="font-bold text-[#414357] text-[15px] mt-1  font-sans">Product Settings</p>
                        </div>
                        <div className='mr-4 p-3 rounded-lg cursor-pointer'>
                            <p className=" text-[#36464E] text-[13px]  font-sans">General</p>
                        </div>
                        <div className='mr-4 p-3 rounded-lg cursor-pointer'>
                            <p className=" text-[#36464E] text-[13px]  font-sans">Billing</p>
                        </div>
                        <div className='mr-4 p-3 rounded-lg cursor-pointer'>
                            <p className=" text-[#36464E] text-[13px]  font-sans">Team</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col ml-6">
                    <div className="mt-[2vh] ">
                        <div className='flex flex-col mr-4 p-3'>
                            <p className="font-bold text-[#414357] text-[15px] mt-1  font-sans">Onboarding</p>
                        </div>
                        <div className='mr-4 p-3 rounded-lg cursor-pointer'>
                            <p className=" text-[#36464E] text-[13px]  font-sans">Welcome to Jasper</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            {/* The profile data of middle page*/}
        <div className='bg-white ml-[260px] mt-[15px] '>
            <div className='flex flex-col'>
                <div className='ml-[20%] mt-[5%]'>
                    <div>
                        <h1 className='text-[18px] font-bold'>Profile Settings</h1>
                    </div>
                    <div className='mt-3'>
                    <label
                            htmlFor="first_name"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            First Name
                        </label>
                        <input
                            type="first_name"
                            id="first_name"
                            name="first_name"
                            defaultValue={firstName}
                            onChange={(e)=>{
                                setfirstName(e.target.value)
                            }}
                            autoComplete="off"
                            className="block w-[400px] px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>
                    <div className='mt-3'>
                    <label
                            htmlFor="last_name"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Last Name
                        </label>
                        <input
                            type="last_name"
                            id="last_name"
                            name="last_name"
                            defaultValue={lastName}
                            onChange={(e)=>{
                                setlastName(e.target.value)
                            }}
                            autoComplete="off"
                            className="block w-[400px] px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>
                    <div className='mt-3'>
                    <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            defaultValue={EmailUser}
                            onChange={(e)=>{
                                setEmailUser(e.target.value)
                            }}
                            autoComplete="off"
                            className="block w-[400px] px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>

                    <div className='mt-3'>
                    {loadingdata
                    ? 
                        <Button
                            sx={{ textTransform: 'none',color:"white",backgroundColor:"blue"}} 
                            className='w-[100px]'
                            variant='contained'
                            disabled
                        >
                            saving
                        </Button>
                    :
                        <Button
                            sx={{ textTransform: 'none',color:"white",backgroundColor:"blue"}} 
                            variant='contained'
                            onClick={()=>{
                                patch_data()
                            }}
                            className='w-[100px]'
                        >
                            save
                        </Button>
                    }
                    </div>
                </div>
            </div>
        </div>
      </Modal>
    </div>
      <Toaster />
    </>
  )
}

export default Profile