import React, { useEffect, useState } from "react";
import { Transition } from '@headlessui/react';

import { FaArrowRight,FaArrowLeft,FaTimes,FaBars } from "react-icons/fa";

import { setDocumentTitle } from '../NavBar/DynamicTitle';

import { Link } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { IoMdArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

import Profile from "./SettingsPages/Profile";
import Usage from "./SettingsPages/Usage"
import Integrations from "./SettingsPages/Integrations"
import Team from "./SettingsPages/Team"
import Billing from "./SettingsPages/Billing"

import { useLocation } from "react-router-dom";


const Settings = (props) => {

  const navigate = useNavigate();
  const work_space = ['General', 'Billing', 'Team', 'Usage', 'Integrations'];
  const personal_settings = ['Profile'];

  const location = useLocation();


    

  const [activeLink, setActiveLink] = useState('');
  
  const notifysucces = (message) => toast.success(message);


  const capitalizeFrontText = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };
  const lowercaseFrontText = (text) => {
    return text.charAt(0).toLowerCase() + text.slice(1);
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };


// ==========render the page according to url========
    const [currentPath, setCurrentPath] = useState("general");

    const searchParams = new URLSearchParams(location.search);
    const page_link = searchParams.get('page');

  useEffect(() => {
    // Listen to changes in the URL path
    const handlePathChange = () => {
        setCurrentPath(page_link);
    };

    window.addEventListener('popstate', handlePathChange);

    return () => {
      window.removeEventListener('popstate', handlePathChange);
    };
  }, []);


  useEffect(()=>{
    setCurrentPath(page_link)
  },[page_link])




  return (
    <>
            <div className="fixed inset-0 flex z-50 ">
            {/* Sidebar (visible on large screens) */}

            <div className="dark:bg-black dark:border-r dark:border-gray dark:text-gray-200 dark:border-slate-500 hidden lg:flex w-64 bg-gray-100">
           
                <div className="dark:bg-black dark:text-gray-200 dark:border-slate-500  flex flex-col py-4 bg-gray-100">
                
                {/* Sidebar content */}
                <div className='dark:bg-black bg-gray-100'>
                <button onClick={()=>{
                    navigate("/")
                    
                }} className=" text-black font-bold py-2 px-4 rounded"
                title="Go back">
                    <IoMdArrowBack className="dark:text-white"/>
                </button>
                </div>

                <div className="flex flex-col ml-6">
                    <div className="mt-[2vh] ">
                        <div className='flex flex-col mr-4'>
                            <p className="dark:text-white font-bold text-[#414357] text-[15px] mt-1  font-sans">Workspace settings</p>
                        </div>
                        {work_space.map((data, index) => {
                        return (
                        <button
                        // to={`/settings/${lowercaseFrontText(data)}`}
                        className={`dark:hover:bg-slate-500 block w-full py-1 text-sm mt-3 mb-3 px-1 text-left rounded-lg text-gray-600 transition-all duration-150 hover:text-black hover:bg-gray-100 ${
                            activeLink === data ? 'text-black font-bold' : 'text-black font-medium'
                        } `}
                        onClick={() => {
                            setActiveLink(data)
                            setCurrentPath(lowercaseFrontText(data))
                            navigate("/settings/general?page="+lowercaseFrontText(data))
                        }}
                        >
                            <span className="dark:text-white relative text-[#36464E] text-[13px]  font-sans">{capitalizeFrontText(data)}</span>
                        </button>
                        );
                    })}
                    </div>
                </div>

                
                </div>

            </div>

            {/* Sidebar (popup on medium/small screens) */}
            <Transition
                show={isOpen}
                // enter="transform transition ease-in-out duration-300"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                // leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
                className="lg:hidden w-64 bg-gray-200 transform -translate-x-full lg:translate-x-0 lg:static lg:inset-0"
            >
                <div className="h-[100vh]">
                
                <div className="dark:bg-black dark:text-gray-200 dark:border-slate-500 flex flex-col py-4 bg-gray-200 h-[100vh] w-[100vh]">
                
                {/* Sidebar content */}
                <div className='bg-gray-200'>
               

                <div className="dark:bg-black dark:text-gray-200 dark:border-slate-500 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Show the toggle button on medium/small screens */}
                   
                    <button onClick={()=>{
                        navigate("/")
                    }} 
                    className=" text-black dark:text-white font-bold py-2 px-4 rounded lg:hidden"
                    title="Go back">
                        <IoMdArrowBack size={24}
                        color="black dark:text-white"/>
                    </button>

                    <button
                    className="text-gray-400 hover:text-white lg:hidden"
                    onClick={toggleNavbar}
                    >
                     <FaTimes
                        size={24}
                        color="black dark:text-white"
                        onClick={() => {
                        }}
                      />
                    </button>
                </div>
                
                </div>

                <div className="flex flex-col ml-6">
                    <div className="mt-[2vh]">
                        <div className='flex flex-col mr-4'>
                            <p className="font-bold text-[#414357] text-[15px] mt-1  font-sans dark:text-white">Workspace settings</p>
                        </div>
                        {work_space.map((data, index) => {
                        return (
                            <button
                        className={`block w-full py-1 text-sm mt-3 mb-3 px-1 text-left rounded-lg text-gray-600 transition-all duration-150 hover:text-black hover:bg-gray-100 ${
                            activeLink === data ? 'text-black font-bold' : 'text-black font-medium'
                        }`}
                        onClick={() => {
                            setActiveLink(data)
                            setIsOpen(false)
                            setCurrentPath(lowercaseFrontText(data))
                            navigate("/settings/general?page="+lowercaseFrontText(data))
                        }}
                        >
                            <span className="dark:text-white relative text-[#36464E] text-[13px]  font-sans">{capitalizeFrontText(data)}</span>
                        </button>
                        );
                    })}
                    </div>
                </div>

                
                </div>
                

                </div>
            </Transition>

            {/* Content */}
            <div className="dark:bg-black flex-1 flex flex-col">
                {/* Top Navbar */}
                <header className="bg-slate-100 py-4 dark:bg-black ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Show the toggle button on medium/small screens */}
                    <button onClick={()=>{
                        navigate("/")
                    }} 
                    className="dark:text-white text-black font-bold py-2 px-4 rounded lg:hidden"
                    title="Go back">
                        <IoMdArrowBack size={24}
                        color="black dark:text-white"/>
                    </button>

                    <button
                    className="text-gray-400 hover:text-white lg:hidden"
                    onClick={toggleNavbar}
                    >
                    
                     <FaBars
                        color="black dark:text-white"
                        size={24}
                        onClick={() => {
                        }}
                      />
                    </button>
                </div>
                </header>

                {/* Main content */}
                {isOpen
                ?
                    null
                :
                    <main className="dark:bg-black dark:text-gray-200 dark:border-slate-500 bg-white relative overflow-scroll">
                        {currentPath === 'general' ? <Profile  AUTH_TOKEN={props.AUTH_TOKEN} /> : null}
                        {currentPath === 'usage' ? <Usage AUTH_TOKEN={props.AUTH_TOKEN}/> : null}
                        {currentPath === 'integrations' ? <Integrations AUTH_TOKEN={props.AUTH_TOKEN}/> : null}
                        {currentPath === 'team' ? <Team AUTH_TOKEN={props.AUTH_TOKEN}/> : null}
                        {currentPath === 'billing' ? <Billing AUTH_TOKEN={props.AUTH_TOKEN}/> : null}
                        {currentPath === 'general' ||
                        currentPath === 'usage' ||
                        currentPath === 'integrations' ||
                        currentPath === 'team' ||
                        currentPath === 'billing'
                            ? null
                            : <div>Page not found</div>}
                    </main>
                }
               

            </div>
            </div>
    </>
  );
};

export default Settings;
