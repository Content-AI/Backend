import React , {useEffect,useState} from 'react'
import {Link, Navigate } from 'react-router-dom';
import Modal from 'react-modal';
import { IoMdArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector, useDispatch } from "react-redux";

import { _save_user_profile } from '../../../features/Fullprofile';

import { setDocumentTitle } from '../../NavBar/DynamicTitle';

import { BACK_END_API_PROFILE_UPDATE,BACKEND_URL } from '../../../apis/urls';
import { patchData } from '../../../apis/apiService';
import Settings from '../Settings';

import {
    _save_token_
  } from "../../../features/AuthenticationToken";

  

const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [loadingdata, setloadingdata] = useState(false);

    useEffect(() => {
        setDocumentTitle("Profile Page");
  }, []);
    
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
      {/* <Settings/> */}
      <div className='flex flex-col ml-5 sm:ml-40 mt-10'>
    <div className="mb-3">
        <h1 className='text-2xl font-bold'>Profile Settings</h1>
    </div>
    <div className='mb-3'>
        <label htmlFor="first_name" className="block text-sm font-semibold text-gray-800">
            First Name
        </label>
        <input
            type="text"
            id="first_name"
            name="first_name"
            defaultValue={firstName}
            onChange={(e) => {
                setfirstName(e.target.value);
            }}
            autoComplete="off"
            placeholder='First Name character must be 3 to 10 long'
            className="dark:text-gray-300 dark:bg-gray-800 block w-full sm:w-[400px] px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
        />
    </div>
    <div className='mb-3'>
        <label htmlFor="last_name" className="block text-sm font-semibold text-gray-800">
            Last Name
        </label>
        <input
            type="text"
            id="last_name"
            name="last_name"
            defaultValue={lastName}
            onChange={(e) => {
                setlastName(e.target.value);
            }}
            placeholder='Last Name must be 3 to 10 long'
            autoComplete="off"
            className="dark:text-gray-300 dark:bg-gray-800 block w-full sm:w-[400px] px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
        />
    </div>
    <div className='mb-3'>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-800">
            Email
        </label>
        <input
            type="email"
            id="email"
            name="email"
            disabled
            defaultValue={EmailUser}
            autoComplete="off"
            className="dark:text-gray-300 dark:bg-gray-800 block w-full sm:w-[400px] px-4 py-2 mt-2 resize-none outline-none bg-white text-gray-400 placeholder:text-gray-300"
        />
    </div>
    <div className='mb-3'>
        {loadingdata ? (
            <button className="font-bold text-white bg-[#334977] p-2 w-full sm:w-[100px] rounded-md" disabled>
                Saving
            </button>
        ) : (
            <button
                className="font-bold text-white bg-[#334977] p-2 w-full sm:w-[100px] rounded-md"
                onClick={() => {
                    patch_data();
                }}
            >
                Save
            </button>
        )}
    </div>
</div>

    </>
  )
}

export default Profile