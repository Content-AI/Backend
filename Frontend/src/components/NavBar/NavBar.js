import React, { useEffect, useState,useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { _delete_token_ } from "../../features/AuthenticationToken";
import { _save_survey_ } from "../../features/ThreeSteps";
import { _delete_user_profile } from "../../features/Fullprofile";
import { _save_details_ } from "../../features/Subscriptions";
import { _chosen_workspace_id_ } from "../../features/ChosenWorkspaceId";
import { BACK_END_API_PROFILE, BACK_END_API_SUBCRIPTION_DETAILS, BACKEND_URL, BACK_END_API_TIMES_REMANING } from '../../apis/urls';

import {
  _hide_nav_,
  _show_nav_,
} from "../../features/HideShowNavBarGlobalState";

import { _make_blur_ } from "../../features/BlurBg";
import {
  MdCircle,
  MdClose,
  MdHome,
  MdOutlineHome,
  MdPeopleAlt,
  MdPhotoCameraFront,
  MdLogout,
  MdArtTrack,
  MdDocumentScanner,
  MdSettings,
  MdSettingsAccessibility,
  MdSettingsApplications,
  MdSettingsBackupRestore,
  MdHelp,
  MdSearch,
} from "react-icons/md";

import { FaBars, FaTimes, FaTrash } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { _save_sub_details_ } from "../../features/SubscriptionsData";

import {
  CgFileDocument,
  CgMenuGridO,
  CgProfile,
  CgTemplate,
} from "react-icons/cg";

import { AiFillCloseCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { Button } from "@mui/material";
import Select from "react-select";
import {
  BsChat,
  BsCheckCircle,
  BsReceipt,
  BsRecordCircleFill,
} from "react-icons/bs";

import clsx from "clsx";

import { NavIcons, SealCheck } from "../Icons";
import Settings from "../Settings/Settings";
import LoadingPage from "../LoadingPage";
import { useParams } from 'react-router-dom';
import FavoriteDocuments from "./FavoriteDocuments";
import DarkMode from "./DarkMode";


const Navbar = () => {
  const [activeLink, setActiveLink] = useState("");
  const dispatch = useDispatch();
  let navigate = useNavigate()
  const location = useLocation();

  const [isHovered, setHovered] = useState(false);
  const [isSettings, set_isSettings] = useState(false);
  // const [subdetails,setsubdetails] = useState(null);

  const [showpricingPopUpModal, setShowpricingPopUpModal] = React.useState(false);
  const [show_invitation, setshow_invitation] = React.useState(false);
  const { invitation_id } = useParams();


  let PROFILE_DATA = useSelector((state) => state.SetFullProfile.Fullprofile);

  let NAV_BAR_CONDITION = useSelector(
    (state) => state.SetHideShowNavBarGlobalState.HideShowNavBarGlobalState
  );
  
  let subscriptions_details = useSelector(
    (state) => state.SetSubscriptionsData.SubscriptionsData
  );

  let TOKEN = useSelector(
    (state) => state.SetAuthenticationToken.AuthenticationToken
  );
  let WorkspaceId = useSelector(
    (state) => state.SetWorkspaceId.WorkspaceId
  );
  let ChosenWorkspaceId = useSelector(
    (state) => state.SetChosenWorkspaceId.ChosenWorkspaceId
  );


  // check the time is negative 
  // useEffect(()=>{
  //   if(subscriptions_details!=null){
  //     if(subscriptions_details.user.trail_ends<=0){
  //     navigate("/settings/subscription_plan?message=upgrade")
  //   }}
  // },[subscriptions_details])


  const handleLinkClick = (link) => {
    setActiveLink(link);
  };


  let url = [
    { name: "Home", link: "" },
    { name: "Project", link: "#project" },
    { name: "Contact", link: "#contact" },
  ];

  const navURL = [
    { title: "Create New Content", link: "/create_new_content" },
    { title: "Dashboard", link: "/" },
    { title: "Chat", link: "/chat" },
    { title: "Projects", link: "/projects" },
    { title: "Recent Added", link: "/documents" },
    { title: "Brand Voice", link: "/brand_voice" }
  ];


  // check the setting open or
  useEffect(() => {
    if (location.pathname.includes("/settings")) {
      set_isSettings(true)
    } else {
      set_isSettings(false)
    }
  }, [location]);

  useEffect(() => {
    if (location.pathname.includes("/invitation")) {
      setshow_invitation(true)
    } else {
      setshow_invitation(false)
    }
  }, []);



  useEffect(() => {
    dispatch(_chosen_workspace_id_(JSON.parse(localStorage.getItem("chose_workspace"))))
  }, [])


  let upgrade_plan = { restrict_user: true, customer_stripe_id: 'null', email: 'null', subscription_type: 'null', status: 'trial' }

  useEffect(() => {
    if (subscriptions_details) {
      try {
        const splitResult = subscriptions_details.user.trail_ends.split(" ");
        const firstNumber = parseInt(splitResult[0], 10);
        if (firstNumber <= "0") {
          navigate("/settings/subscription_plan?message=upgrade")
        }
      } catch (e) { }
    }
  }, [subscriptions_details])


  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  // Function to toggle the overlay div
  const toggleOverlay = () => {
    setIsOverlayVisible(!isOverlayVisible);
  };




  // =========Hide small navbar when ever click in other div========  
  const divRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        // Call your function here when clicking outside the div
        // For example, you can call a function like handleOutsideClick()
        handleOutsideClick();
      }
    };

    const handleOutsideClick = () => {
      // console.log("Clicked outside the div");
      // dispatch(_hide_nav_(false))
      // You can put your logic or function call here
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
      {show_invitation
        ?
        null
        :
        <>
          {isSettings
            ?
            null
            :
            <>

              <div className="dark:bg-black dark:text-gray-200 dark:border-slate-500 z-20 fixed top-0 left-0 right-0 flex items-center justify-between px-6 sm:pl-64  bg-white border-b border-border"
              >
                <div className="dark:bg-black dark:text-gray-200 sm:hidden">
                  {NAV_BAR_CONDITION ? (
                    <>
                      <FaTimes
                        size={24}
                        onClick={() => {
                          dispatch(_make_blur_(false));
                          dispatch(_hide_nav_(!NAV_BAR_CONDITION));
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <FaBars
                        size={24}
                        onClick={() => {
                          dispatch(_make_blur_(true));
                          dispatch(_show_nav_(!NAV_BAR_CONDITION));
                        }}
                      />
                    </>
                  )}
                </div>

                {/* ==========the large navbar============= */}
                <div className="dark:bg-black dark:text-gray-200 sm:hidden pl-4"
                >
                  <img
                    src="https://static.vecteezy.com/system/resources/previews/009/182/285/non_2x/tmp-letter-logo-design-with-polygon-shape-tmp-polygon-and-cube-shape-logo-design-tmp-hexagon-logo-template-white-and-black-colors-tmp-monogram-business-and-real-estate-logo-vector.jpg"
                    className="w-[50px] h-[50px] rounded-full"
                  />
                </div>

                <div className="dark:bg-black dark:text-gray-200 lg:flex items-center gap-10 ml-auto hidden h-[74px]">

                  {subscriptions_details &&
                    <>
                      {subscriptions_details.user.status == "active"
                        ?
                        null
                        :
                        <>
                          <button className="inline-flex items-center gap-3 text-lg font-bold text-white bg-[#334977] pl-3 pr-6 py-2.5 rounded-md"
                            onClick={() => {
                              navigate("/settings/subscription_plan")
                            }}
                          >
                            <SealCheck classes="w-6 h-6" />
                            Upgrade to Pro
                          </button>
                        </>
                      }
                    </>
                  }

                {/* <DarkMode/> */}
                
                </div>


              </div>



              {/* ==========the large navbar============= */}

              <div className="dark:bg-black dark:text-gray-200 dark:border-slate-500 z-20 hidden sm:block fixed top-0 left-0 h-full w-64 bg-blue-900  border-r border-border">
                <div className="dark:bg-black dark:text-gray-200 flex items-center h-[74px] dark:border-slate-500 border-b border-border">
                  <div className="dark:bg-black dark:text-gray-200 pl-4">
                    <img
                      src="https://static.vecteezy.com/system/resources/previews/009/182/285/non_2x/tmp-letter-logo-design-with-polygon-shape-tmp-polygon-and-cube-shape-logo-design-tmp-hexagon-logo-template-white-and-black-colors-tmp-monogram-business-and-real-estate-logo-vector.jpg"
                      className="w-[50px] h-[50px] rounded-full"
                    />
                  </div>
                </div>

                <div className="dark:bg-black dark:text-gray-200 flex flex-col">


                  <div className="dark:bg-black dark:text-gray-200 dark:border-slate-500 flex flex-col ml-2 my-2 p-2 h-[calc(100vh-10rem)] overflow-y-auto scrollbar-none">

                    {navURL.map((items, index) => {
                      const { title, link, offset } = items;
                      return (
                          <div
                            key={"nav_" + index}
                            className={clsx({ "mt-auto": offset })}
                          >
                          <Link
                            to={link}
                            onClick={() => handleLinkClick(title)}
                            className={clsx("flex items-center p-1", {
                              "font-bold text-blue bg-blue/10 rounded-lg dark:bg-black dark:text-gray-200":
                                activeLink === title,
                              "mb-6": navURL.length - 1 !== index,
                            })}
                          >
                              <span className="icon w-6 h-6 p-1 inline-flex items-center justify-center">
                                <NavIcons
                                  icon={title.toLocaleLowerCase()}
                                  fill={activeLink === title ? "#1D43FF" : "#343330"}
                                />
                              </span>
                              <p className="text-[14px] capitalize font-semibold ml-2">
                                {title}
                              </p>
                          </Link>
                        </div>
                      );
                    })}

                      {/* ====favorite ===== */}
                      <nav className="dark:bg-black dark:text-gray-200 flex-grow mt-3 space-x-4 overflow-x-auto border-t  bg-gray-50">
                        <div className="dark:bg-black dark:text-gray-200 flex">
                          <div>

                        
                          <svg className=" w-5 h-5 text-[14px] capitalize font-semibold ml-2 mt-[10px]" xmlns="http://www.w3.org/2000/svg" 
                          xmlnsSlink="http://www.w3.org/1999/xlink" 
                          version="1.1" x="0px" y="0px" 
                          viewBox="0 0 100 125" 
                          enableBackground="new 0 0 100 100" 
                          xmlSpace="preserve">
                            <g>
                                <path fill="#343330" d="M58.48,38.832l-8.48-17.182L41.52,38.832c-0.656,1.328-1.922,2.248-3.388,2.462L19.17,44.049l13.722,13.375   c1.06,1.034,1.544,2.523,1.294,3.983l-3.239,18.884l16.959-8.917c1.311-0.689,2.878-0.689,4.189,0l16.959,8.917l-3.238-18.885   c-0.25-1.459,0.233-2.949,1.294-3.982L80.83,44.049l-18.962-2.755C60.403,41.08,59.135,40.16,58.48,38.832z"/>
                                <path d="M94.779,39.517c-0.529-1.629-1.937-2.817-3.633-3.063l-25.643-3.727L54.036,9.491c-0.758-1.536-2.322-2.508-4.035-2.508   s-3.277,0.972-4.035,2.508L34.497,32.727L8.853,36.454C7.158,36.7,5.75,37.887,5.22,39.517c-0.529,1.629-0.088,3.417,1.139,4.613   l18.556,18.088l-4.38,25.539c-0.29,1.688,0.405,3.395,1.79,4.402c0.784,0.57,1.713,0.86,2.646,0.86   c0.716,0,1.435-0.171,2.094-0.517l22.936-12.059l22.935,12.059c1.518,0.798,3.353,0.664,4.739-0.343   c1.386-1.006,2.08-2.713,1.79-4.401l-4.38-25.54l18.556-18.088C94.867,42.934,95.309,41.145,94.779,39.517z M67.11,57.424   c-1.061,1.034-1.544,2.523-1.294,3.982l3.238,18.885l-16.959-8.917c-1.311-0.689-2.878-0.689-4.189,0l-16.959,8.917l3.239-18.884   c0.25-1.46-0.234-2.95-1.294-3.983L19.17,44.049l18.962-2.755c1.466-0.214,2.733-1.134,3.388-2.462l8.481-17.182l8.48,17.182   c0.655,1.328,1.922,2.248,3.388,2.462l18.962,2.755L67.11,57.424z"/>
                            </g>
                          </svg>

                          </div>
                          <div className="dark:bg-black dark:text-gray-200 text-[14px] capitalize font-semibold mt-2">
                            Favorites
                          </div>
                        </div>
                              <div className="dark:bg-black dark:text-gray-200 space-y-2">
                                <FavoriteDocuments TOKEN={TOKEN}/>
                              </div>
                        </nav>
                      {/* ====favorite ===== */}



                  </div>
                </div>
                

                <div className="dark:bg-black dark:text-gray-200 fixed bottom-0 w-64 p-4 bg-gray-100 ">
                  <div className="dark:bg-black dark:text-gray-200 relative">
                    {isHovered && (
                      <div
                        className="absolute bottom-full left-0 w-60 bg-white border border-border rounded"
                        style={{
                          boxShadow:
                            "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)",
                        }}
                      >
                        <div className="dark:bg-black dark:text-gray-200 absolute top-2 right-2 w-6 h-6">
                          <AiOutlineCloseCircle
                            onClick={() => {
                              setHovered(!isHovered);
                            }}
                            className="w-full h-full duration-300 hover:text-red-500 cursor-pointer"
                          />
                        </div>

                        <div className="dark:bg-black dark:text-gray-200 flex flex-col justify-center ">
                          <div className="dark:bg-black dark:text-gray-200 py-4 px-2">

                            {/* =================workspace==================== */}
                            <div className="dark:bg-black dark:text-gray-200 py-2 px-3 flex items-center duration-300 hover:text-blue-500 cursor-pointer"
                            onClick={()=>{
                              navigate("/change-work-space")
                            }}>
                              <div className=" mr-2">
                              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 60" x="0px" y="0px">
                                <g dataName="Layer 27">
                                    <path d="M47,24H30V23a3,3,0,0,0-3-3H21a3,3,0,0,0-3,3v1H11a1,1,0,0,0,0-2H10V19a.965.965,0,0,0-.182-.542,1,1,0,0,0-.108-.168,1.2,1.2,0,0,0-.122-.078A.983.983,0,0,0,9,18H4V12H14v6H13a1,1,0,0,0,0,2h2a1,1,0,0,0,1-1V11a1,1,0,0,0-1-1H3a1,1,0,0,0-1,1v8a1,1,0,0,0,1,1H8v2H7a1,1,0,0,0,0,2H1a1,1,0,0,0-1,1v4a1,1,0,0,0,1,1H2V47a1,1,0,0,0,2,0V30H15a1,1,0,0,0,0-2H2V26H18v1a3,3,0,0,0,3,3h2v4H19a3,3,0,0,0,0,6h4v3.586l-2.707,2.707a1,1,0,1,0,1.414,1.414L24,45.414l2.293,2.293a1,1,0,0,0,1.414-1.414L25,43.586V40h4a3,3,0,0,0,0-6H25V30h2a3,3,0,0,0,3-3V26H46v2H33a1,1,0,0,0,0,2h1V47a1,1,0,0,0,1,1H45a1,1,0,0,0,1-1V30h1a1,1,0,0,0,1-1V25A1,1,0,0,0,47,24ZM30,37a1,1,0,0,1-1,1H19a1,1,0,0,1,0-2H29A1,1,0,0,1,30,37ZM28,27a1,1,0,0,1-1,1H21a1,1,0,0,1-1-1V23a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1ZM44,40H36V36h8Zm-8,6V42h8v4Zm8-12H36V30h8Z"/>
                                    <path d="M24,10H47a1,1,0,0,0,1-1V1a1,1,0,0,0-1-1H23a1,1,0,0,0-1,1V17a1,1,0,0,0,1,1H47a1,1,0,0,0,1-1V13a1,1,0,0,0-2,0v3H33.816A2.966,2.966,0,0,0,34,15a3,3,0,0,0-3-3H29a3,3,0,0,0-3,3,2.966,2.966,0,0,0,.184,1H24Zm4,5a1,1,0,0,1,1-1h2a1,1,0,0,1,0,2H29A1,1,0,0,1,28,15ZM27,7.5v-2a.5.5,0,0,1,1,0v2a.5.5,0,0,1-1,0Zm16,0a.5.5,0,0,1-1,0v-2a.5.5,0,0,1,1,0Zm-3,0a.5.5,0,0,1-1,0v-2a.5.5,0,0,1,1,0Zm-3,0a.5.5,0,0,1-1,0v-2a.5.5,0,0,1,1,0Zm-3,0a.5.5,0,0,1-1,0v-2a.5.5,0,0,1,1,0Zm-3,0a.5.5,0,0,1-1,0v-2a.5.5,0,0,1,1,0ZM46,2V8H44.949A2.5,2.5,0,0,0,45,7.5v-2A2.5,2.5,0,0,0,42.5,3a2.471,2.471,0,0,0-1.5.513,2.449,2.449,0,0,0-3,0,2.449,2.449,0,0,0-3,0,2.449,2.449,0,0,0-3,0,2.449,2.449,0,0,0-3,0A2.471,2.471,0,0,0,27.5,3,2.5,2.5,0,0,0,25,5.5v2a2.5,2.5,0,0,0,.051.5H24V2Z"/>
                                </g>
                              </svg>
                              </div>
                              <div>
                                  Change Workspace
                              </div>
                            </div>
                            {/* =================workspace==================== */}

                            <Link
                              to="/settings/general?page=general"
                              onClick={() => {
                                setHovered(!isHovered);
                              }}
                            >
                              <div className="dark:bg-black dark:text-gray-200 py-2 px-3 flex items-center duration-300 hover:text-blue-500 cursor-pointer">
                                <div className="dark:bg-black dark:text-gray-200 mr-2">
                                  <MdSettings size={18} />
                                </div>
                                <div>
                                  <p className="text-sm font-helv">Settings</p>
                                </div>
                              </div>
                            </Link>
                            <div className="dark:bg-black dark:text-gray-200 py-2 px-3 flex items-center duration-300 hover:text-blue-500 cursor-pointer">
                              <div className="dark:bg-black dark:text-gray-200 mr-2">
                                <MdHelp size={18} />
                              </div>
                              <div>

                              <Link to="/help">
                                      <p className="text-sm  font-helv">Help</p>
                              </Link> 
                            </div>
                            </div>
                            <div className="dark:bg-black dark:text-gray-200 py-2 px-3 flex items-center duration-300 hover:text-blue-500 cursor-pointer">
                              <div className="dark:bg-black dark:text-gray-200 mr-2">
                                <FaTrash size={18} />
                              </div>
                              <div>
                                <Link to="/trash">
                                  <p className="text-sm font-helv">Trash</p>
                                </Link>
                              </div>
                            </div>
                            <Link
                              className="pt-2 mt-4 block border-t border-border"
                              to="/"
                              onClick={() => {
                                handleLinkClick("logout");
                                localStorage.clear();
                                dispatch(_delete_token_(null));
                                dispatch(_save_survey_(null));
                                dispatch(_delete_user_profile(null));
                                dispatch(_save_details_(null));
                                dispatch(_save_sub_details_(null));
                                window.location.replace("/login");
                              }}
                            >
                              <div
                                className={`py-2 px-3 flex items-center ${
                                  activeLink === "logout" ? "text-blue-500" : ""
                                }`}
                              >
                                <div className="dark:bg-black dark:text-gray-200 mr-2">
                                  <MdLogout size={18} />
                                </div>
                                <div>
                                  <p className="text-sm font-helv">Logout</p>
                                </div>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="dark:bg-black dark:text-gray-200 flex flex-col bg-gray-100">
                    {!isHovered && (
                      <>
                        {subscriptions_details
                        ?
                          <>
                          <div className="dark:bg-black dark:text-gray-200 mb-4">
                          {subscriptions_details.user.trail_ends
                          ?
                            <div className="dark:bg-black dark:text-gray-200 flex text-base justify-items-start items-center">
                              <div>
                                  <svg className="w-4 h-4 mb-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                    <path d="M14.25,4.77c.44,.96,.67,2.01,.67,3.08,0,1.56-.5,3.08-1.41,4.34-.92,1.26-2.21,2.2-3.7,2.68-1.48,.48-3.08,.48-4.57,0-1.48-.48-2.78-1.42-3.69-2.69S.14,9.4,.14,7.84c0-1.56,.5-3.08,1.41-4.34,.92-1.26,2.21-2.2,3.7-2.68,.45-.15,.93,.1,1.08,.55,.15,.45-.1,.93-.55,1.08-1.14,.37-2.13,1.09-2.84,2.06-.7,.97-1.08,2.14-1.09,3.33,0,1.2,.38,2.37,1.08,3.34,.7,.97,1.7,1.69,2.84,2.06,1.14,.37,2.37,.37,3.51,0,1.14-.37,2.13-1.09,2.84-2.06s1.08-2.14,1.09-3.34c0-.77-.15-1.52-.45-2.22l-1.42,.82c-.19,.11-.43,.1-.61-.03-.18-.13-.27-.34-.24-.56,.23-1.4,.44-2.17,.92-3.45,.1-.25,.36-.4,.62-.36,1.35,.22,2.12,.42,3.45,.92,.21,.08,.35,.27,.37,.49,.02,.22-.09,.43-.28,.54l-1.32,.76Z" fill="#76A9FA" fillRule="evenodd"></path>
                                    <path d="M7.79,8.83c.31-.13,.51-.44,.51-.78l.02-2.55c0-.47-.38-.86-.85-.86-.47,0-.86,.38-.87,.85l-.02,2-1.09,.48c-.43,.19-.63,.69-.44,1.13,.19,.43,.69,.63,1.13,.44l1.6-.7Z" fill="#1C64F2" fillRule="evenodd"></path>
                                  </svg>
                              </div>

                              <span className="text-sm pl-2 mb-2">
                              {parseInt(subscriptions_details.user.trail_ends)<=0
                              ?
                                "Plan Ended"
                              :

                                "Free trial ends in " + subscriptions_details.user.trail_ends
                              }
                              </span>

                            </div>
                          :
                            <div className="dark:bg-black dark:text-gray-200 flex text-base justify-items-start items-center">
                                <div>
                                    <svg className="w-4 h-4 mb-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                      <path d="M14.25,4.77c.44,.96,.67,2.01,.67,3.08,0,1.56-.5,3.08-1.41,4.34-.92,1.26-2.21,2.2-3.7,2.68-1.48,.48-3.08,.48-4.57,0-1.48-.48-2.78-1.42-3.69-2.69S.14,9.4,.14,7.84c0-1.56,.5-3.08,1.41-4.34,.92-1.26,2.21-2.2,3.7-2.68,.45-.15,.93,.1,1.08,.55,.15,.45-.1,.93-.55,1.08-1.14,.37-2.13,1.09-2.84,2.06-.7,.97-1.08,2.14-1.09,3.33,0,1.2,.38,2.37,1.08,3.34,.7,.97,1.7,1.69,2.84,2.06,1.14,.37,2.37,.37,3.51,0,1.14-.37,2.13-1.09,2.84-2.06s1.08-2.14,1.09-3.34c0-.77-.15-1.52-.45-2.22l-1.42,.82c-.19,.11-.43,.1-.61-.03-.18-.13-.27-.34-.24-.56,.23-1.4,.44-2.17,.92-3.45,.1-.25,.36-.4,.62-.36,1.35,.22,2.12,.42,3.45,.92,.21,.08,.35,.27,.37,.49,.02,.22-.09,.43-.28,.54l-1.32,.76Z" fill="#76A9FA" fillRule="evenodd"></path>
                                      <path d="M7.79,8.83c.31-.13,.51-.44,.51-.78l.02-2.55c0-.47-.38-.86-.85-.86-.47,0-.86,.38-.87,.85l-.02,2-1.09,.48c-.43,.19-.63,.69-.44,1.13,.19,.43,.69,.63,1.13,.44l1.6-.7Z" fill="#1C64F2" fillRule="evenodd"></path>
                                    </svg>
                                </div>
                                <span className="text-sm pl-2 mb-2">Your current plans</span>
                              </div>
                          }
                            <div className="dark:bg-black dark:text-gray-200 mb-3">
                            <button
                              onClick={() => {
                                setShowpricingPopUpModal(true)
                              }}
                              className="text-[25px] transition-all duration-200 relative shadow-sm outline-none hover:outline-none  mb-2  flex select-none items-center py-3 text-xs font-medium ring-offset-2 focus:ring-2 text-white justify-center rounded-lg bg-[#334977]  w-full h-[30px] px-2"
                            >
                              <span>View Details</span>
                            </button>
                          </div>
                          </div>
                          </>
                        :
                        <>
                          <LoadingPage />
                          </>
                        }
                      </>
                    )}
                    <div className="dark:bg-black dark:text-gray-200 ">
                      <Button
                        sx={{ textTransform: "none" }}
                        onClick={() => {
                          setHovered(!isHovered);
                        }}
                        className="flex items-center "
                      >
                        {PROFILE_DATA ? (
                          PROFILE_DATA.profile_pic ? (
                            <img
                              src="https://uffiafilestorage.s3.amazonaws.com/frontend-images/default.png"
                              alt="PP"
                              className="w-[40px] h-[40px] rounded-full"
                            />
                          ) : (
                            <img
                              src="https://uffiafilestorage.s3.amazonaws.com/frontend-images/default.png"
                              alt="Image"
                              className="w-[40px] h-[40px] rounded-full"
                            />
                          )
                        ) : (
                          <img
                            src="https://uffiafilestorage.s3.amazonaws.com/frontend-images/default.png"
                            alt="Image"
                            className="w-[40px] h-[40px] rounded-full"
                          />
                        )}
                        <div className=" dark:text-white text-left ml-2 w-full">
                          <p className="text-xs font-sans font-bold text-black dark:text-white">
                            {ChosenWorkspaceId &&
                              <>
                                {ChosenWorkspaceId["workspace_name"]}
                              </>
                            }
                          </p>
                          {subscriptions_details &&
                            <>
                              {subscriptions_details.user.status=='active'
                              ?
                                null
                              :
                                <>
                                  <p className="text-[10px] font-sans dark:text-white font-bold text-black">
                                    Free plan
                                  </p>
                                </>
                              }

                            </>
                          }
                        </div>
                        <span className="w-4 h-6 float-right ml-3">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-full h-full"
                          >
                            <g clipPath="url(#clip0_512_3040)">
                              <path
                                d="M10.8909 8.99179C11.0786 8.80401 11.3331 8.69847 11.5986 8.69838C11.864 8.69828 12.1186 8.80365 12.3064 8.99129C12.4942 9.17893 12.5997 9.43347 12.5998 9.69893C12.5999 9.96439 12.4946 10.219 12.3069 10.4068L8.00691 14.7068C7.81938 14.8943 7.56507 14.9996 7.29991 14.9996C7.03475 14.9996 6.78044 14.8943 6.59291 14.7068L2.29291 10.4068C2.10527 10.2189 1.99996 9.96413 2.00015 9.69858C2.00033 9.43303 2.106 9.17843 2.29391 8.99079C2.48182 8.80315 2.73657 8.69783 3.00212 8.69802C3.26767 8.69821 3.52227 8.80388 3.70991 8.99179L7.29991 12.5828L10.8909 8.99179ZM10.8909 5.00779L7.29991 1.41679L3.70891 5.00779C3.52127 5.19556 3.26672 5.3011 3.00126 5.3012C2.73581 5.30129 2.48118 5.19593 2.29341 5.00829C2.10564 4.82065 2.00009 4.5661 2 4.30064C1.99991 4.03518 2.10527 3.78056 2.29291 3.59279L6.59291 -0.707214C6.78044 -0.894685 7.03475 -1 7.29991 -1C7.56507 -1 7.81938 -0.894685 8.00691 -0.707214L12.3069 3.59279C12.3998 3.68576 12.4735 3.79613 12.5238 3.91758C12.574 4.03904 12.5999 4.1692 12.5998 4.30064C12.5998 4.43208 12.5738 4.56223 12.5235 4.68364C12.4732 4.80506 12.3994 4.91538 12.3064 5.00829C12.2134 5.1012 12.1031 5.17488 11.9816 5.22514C11.8602 5.2754 11.73 5.30124 11.5986 5.3012C11.4671 5.30115 11.337 5.27521 11.2156 5.22487C11.0941 5.17453 10.9838 5.10076 10.8909 5.00779Z"
                                fill="#36464E"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_512_3040">
                                <rect width="14" height="14" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>

              </div>


              {/* ==========the large navbar============= */}


              {NAV_BAR_CONDITION
                ?
                (
                  <>

                    <div
                      ref={divRef}
                      className={`${NAV_BAR_CONDITION ? "" : "-translate-x-full"
                        } fixed left-0 top-0 w-64 h-full shadow-2xl dark:bg-black  bg-white transform z-[100] duration-500 mt-[40px]`}
                      style={{ overflowY: 'hidden' }}
                    >
                   
                      <div className="dark:bg-black dark:text-gray-200 flex flex-col">
                              <div className="dark:bg-black dark:text-gray-200 flex flex-col ml-2 my-2 p-2 h-[calc(100vh-10rem)] overflow-y-auto scrollbar-none">

                                {navURL.map((items, index) => {
                                  const { title, link, offset } = items;
                                  return (
                                      <div
                                        key={"nav_" + index}
                                        className={clsx({ "mt-auto": offset })}
                                      >
                                      <Link
                                        to={link}
                                        onClick={() => {
                                          handleLinkClick(title)
                                          dispatch(_hide_nav_(!NAV_BAR_CONDITION));
                                          }}
                                        className={clsx("flex items-center p-1", {
                                          "font-bold text-blue bg-blue/10 rounded-lg":
                                            activeLink === title,
                                          "mb-4": navURL.length - 1 !== index,
                                        })}
                                      >
                                          <span className="icon w-6 h-6 p-1 inline-flex items-center justify-center">
                                            <NavIcons
                                              icon={title.toLocaleLowerCase()}
                                              fill={activeLink === title ? "#1D43FF" : "#343330"}
                                            />
                                          </span>
                                          <p className="text-[14px] capitalize font-semibold ml-2">
                                            {title}
                                          </p>
                                      </Link>
                                    </div>
                                  );
                                })}

                                  {/* ====favorite ===== */}

                                  <nav className="dark:bg-black dark:text-gray-200 dark:border-slate-500 flex-grow mt-3 space-x-4 overflow-x-auto border-t  bg-gray-50">
                                    <div className="dark:bg-black dark:text-gray-200 flex">
                                      <div>
                                        <svg className="w-6 h-6 text-[14px] capitalize font-semibold ml-2 mt-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80" x="0px" y="0px">
                                          <path d="m51.5766791,13.4525611c.2421875,0,.4848633-.0874023.6772461-.2646484l2.2060547-2.0327148c.40625-.3740234.4321289-1.0068359.0576172-1.4130859s-1.0068359-.4335938-1.4130859-.0576172l-2.2060547,2.0327148c-.6763916.5797729-.1963501,1.7676392.6782227,1.7353516Z"/>
                                          <path d="m52.8134955,17.4320533c.1187744.5425415.6699219.8783569,1.1948242.7563477l2.9272461-.6577148c.5390625-.1210938.8774414-.6557617.7563477-1.1948242-.121582-.5390625-.6582031-.8789062-1.1948242-.7563477l-2.9272461.6577148c-.5390625.1210938-.8774414.6557617-.7563477,1.1948242Z"/>
                                          <path d="m46.6347846,10.7264869c.5128784.1647339,1.0890503-.1244507,1.2524414-.6567383l.894043-2.8637695c.1645508-.5268555-.1293945-1.0878906-.6567383-1.2524414-.5263672-.1650391-1.0878906.128418-1.2524414.6567383l-.894043,2.8637695c-.1645508.5268555.1293945,1.0878906.6567383,1.2524414Z"/>
                                          <path d="m59.9804877,38.2767799l-19.8779297-7.206543c-.8056641-.2919922-1.6254883-.1899414-2.2524414.2773438-.6279297.4672852-.9609375,1.2246094-.9130859,2.0776367l1.184082,21.1098633c.0175171,2.0169067,2.6036377,3.8449707,4.3384399,2.5282593-.000061.000061,6.1679077-4.5873413,6.1679077-4.5873413l3.4355469,4.6191406c.7752075,1.085144,2.4128418,1.3299561,3.4716797.5101929,0,.000061,2.3774414-1.7680054,2.3774414-1.7680054,1.097168-.8164062,1.3261719-2.3740234.5092773-3.4711914l-3.4355469-4.6196289,6.1674805-4.5878906c1.7588501-1.2825928.7544556-4.2845459-1.1728516-4.8818359Zm-.0205078,3.2773438l-6.9702148,5.1845703c-.4433594.3295898-.5351562.9560547-.2055664,1.3989258l4.0327148,5.4223633c.1582031.2124023.1137695.5146484-.0986328.6728516l-2.3769531,1.7675781c-.2750854.1598511-.4551392.1314087-.6733398-.0986328l-4.0327148-5.421875c-.3121338-.4371948-.9733887-.5353394-1.3989258-.2055664l-6.9702148,5.1845703c-.1362305.1010742-.3569336.0166016-.4453125-.0258789-.3193359-.1494141-.6757812-.5292969-.7026367-1.0097656l-1.184082-21.1098633c-.0179443-.3515015.1531372-.4829712.4868164-.362793l19.8779297,7.2060547c.539917.1955566.9962158.9599609.6611328,1.3974609Z"/>
                                          <path d="m26.5273627,47.7948463c.2219849.0509644.4783936.0487061.7006836,0,3.0810547-.8139648,6.0126953-1.875,8.7124023-3.152832,1.1801758-.5725098.3295898-2.3565674-.8555298-1.8076172-2.5424194,1.2036133-5.3026733,2.2070312-8.2069702,2.9838867-5.4370117-1.4589844-22.3032227-7.1113281-22.9262695-21.0249023-.3413086-7.6088867,4.9912109-11.8740234,10.4272461-12.7260742,4.5019531-.703125,9.9887695.9160156,11.4985352,6.1201172.1082764,1.1159058,1.7421265,1.2030029,1.9785156.1141968,1.4555664-5.2924194,6.9902344-6.9408569,11.515625-6.2352905,8.935791,1.2932129,13.1885376,10.7134399,8.6033325,19.5918579-.2542114.4901733-.0628052,1.093689.4279175,1.3475952.4902344.2543945,1.09375.0620117,1.3476562-.4277344,1.2392578-2.3911133,1.9296875-4.9799805,2.0512695-7.6948242.3964844-8.8486328-5.8022461-13.8051758-12.121582-14.7929688-4.6601562-.7250977-10.2358398.7114258-12.7983398,5.3232422-2.5668945-4.6152344-8.1459961-6.0522461-12.8125-5.3217773-6.3164062.9897461-12.512207,5.9467773-12.1157227,14.7915039.6904297,15.4160156,18.9833984,21.434082,24.5737305,22.9116211Z"/>
                                          <path d="m12.715351,17.4623267c-.246582-.4941406-.8461914-.6958008-1.3408203-.4492188-3.8286133,1.9057617-5.5581055,6.9570312-3.7016602,10.8095703.2406616.5023804.848938.7040405,1.3349609.4667969.4975586-.2397461.706543-.8374023.4667969-1.3349609-1.3754883-2.8540039-.0449219-6.7392578,2.7915039-8.1513672.4941406-.2460938.6953125-.8461914.4492188-1.3408203Z"/>
                                          <path d="m9.937519,29.9081275c-1.3264771.020813-1.315918,1.9783936.000061,2,1.3143921-.0223999,1.314209-1.9778442-.000061-2Z"/>
                                        </svg>
                                      </div>
                                      <div className="dark:bg-black dark:text-gray-200 text-[14px] capitalize font-semibold mt-2">
                                        Favorites
                                      </div>
                                    </div>
                                          <div className="dark:bg-black dark:text-gray-200 space-y-2">
                                            <FavoriteDocuments TOKEN={TOKEN}/>
                                          </div>
                                    </nav>

                                  {/* ====favorite ===== */}


                                  {/* ====== Profile ======== */}
                                  <div className="dark:bg-black dark:text-gray-200 fixed bottom-0 w-64 p-2 mb-2 mr-3 bg-white ">
                                  <div className="dark:bg-black dark:text-gray-200 relative">

                                  {isHovered && (

                                    <div
                                        className="absolute bottom-full left-0 w-[220px] bg-white border border-border rounded"
                                        style={{
                                          boxShadow:
                                            "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)",
                                        }}
                                      >
                                          <div className="dark:bg-black dark:text-gray-200 absolute top-2 right-2 w-6 h-6">
                                          <AiOutlineCloseCircle
                                            onClick={() => {
                                              setHovered(!isHovered);
                                            }}
                                            className="w-full h-full duration-300 hover:text-red-500 cursor-pointer"
                                          />
                                        </div>

                                        <div className="dark:bg-black dark:text-gray-200 flex flex-col justify-center ">
                                          <div className="dark:bg-black dark:text-gray-200 py-4 px-2">

                                            {/* =================workspace==================== */}
                                            <div className="dark:bg-black dark:text-gray-200 py-2 px-3 flex items-center duration-300 hover:text-blue-500 cursor-pointer"
                                            onClick={()=>{
                                              dispatch(_hide_nav_(!NAV_BAR_CONDITION))
                                              navigate("/change-work-space")
                                            }}>
                                              <div className="dark:bg-black dark:text-gray-200 mr-2">
                                              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 60" x="0px" y="0px">
                                                <g dataName="Layer 27">
                                                    <path d="M47,24H30V23a3,3,0,0,0-3-3H21a3,3,0,0,0-3,3v1H11a1,1,0,0,0,0-2H10V19a.965.965,0,0,0-.182-.542,1,1,0,0,0-.108-.168,1.2,1.2,0,0,0-.122-.078A.983.983,0,0,0,9,18H4V12H14v6H13a1,1,0,0,0,0,2h2a1,1,0,0,0,1-1V11a1,1,0,0,0-1-1H3a1,1,0,0,0-1,1v8a1,1,0,0,0,1,1H8v2H7a1,1,0,0,0,0,2H1a1,1,0,0,0-1,1v4a1,1,0,0,0,1,1H2V47a1,1,0,0,0,2,0V30H15a1,1,0,0,0,0-2H2V26H18v1a3,3,0,0,0,3,3h2v4H19a3,3,0,0,0,0,6h4v3.586l-2.707,2.707a1,1,0,1,0,1.414,1.414L24,45.414l2.293,2.293a1,1,0,0,0,1.414-1.414L25,43.586V40h4a3,3,0,0,0,0-6H25V30h2a3,3,0,0,0,3-3V26H46v2H33a1,1,0,0,0,0,2h1V47a1,1,0,0,0,1,1H45a1,1,0,0,0,1-1V30h1a1,1,0,0,0,1-1V25A1,1,0,0,0,47,24ZM30,37a1,1,0,0,1-1,1H19a1,1,0,0,1,0-2H29A1,1,0,0,1,30,37ZM28,27a1,1,0,0,1-1,1H21a1,1,0,0,1-1-1V23a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1ZM44,40H36V36h8Zm-8,6V42h8v4Zm8-12H36V30h8Z"/>
                                                    <path d="M24,10H47a1,1,0,0,0,1-1V1a1,1,0,0,0-1-1H23a1,1,0,0,0-1,1V17a1,1,0,0,0,1,1H47a1,1,0,0,0,1-1V13a1,1,0,0,0-2,0v3H33.816A2.966,2.966,0,0,0,34,15a3,3,0,0,0-3-3H29a3,3,0,0,0-3,3,2.966,2.966,0,0,0,.184,1H24Zm4,5a1,1,0,0,1,1-1h2a1,1,0,0,1,0,2H29A1,1,0,0,1,28,15ZM27,7.5v-2a.5.5,0,0,1,1,0v2a.5.5,0,0,1-1,0Zm16,0a.5.5,0,0,1-1,0v-2a.5.5,0,0,1,1,0Zm-3,0a.5.5,0,0,1-1,0v-2a.5.5,0,0,1,1,0Zm-3,0a.5.5,0,0,1-1,0v-2a.5.5,0,0,1,1,0Zm-3,0a.5.5,0,0,1-1,0v-2a.5.5,0,0,1,1,0Zm-3,0a.5.5,0,0,1-1,0v-2a.5.5,0,0,1,1,0ZM46,2V8H44.949A2.5,2.5,0,0,0,45,7.5v-2A2.5,2.5,0,0,0,42.5,3a2.471,2.471,0,0,0-1.5.513,2.449,2.449,0,0,0-3,0,2.449,2.449,0,0,0-3,0,2.449,2.449,0,0,0-3,0,2.449,2.449,0,0,0-3,0A2.471,2.471,0,0,0,27.5,3,2.5,2.5,0,0,0,25,5.5v2a2.5,2.5,0,0,0,.051.5H24V2Z"/>
                                                </g>
                                              </svg>
                                              </div>
                                              <div>
                                                  Change Workspace
                                              </div>
                                            </div>
                                            {/* =================workspace==================== */}

                                            <Link
                                              to="/settings/general?page=general"
                                              onClick={() => {
                                                setHovered(!isHovered);
                                                dispatch(_hide_nav_(!NAV_BAR_CONDITION))
                                              }}
                                            >
                                              <div className="dark:bg-black dark:text-gray-200 py-2 px-3 flex items-center duration-300 hover:text-blue-500 cursor-pointer">
                                                <div className="dark:bg-black dark:text-gray-200 mr-2">
                                                  <MdSettings size={18} />
                                                </div>
                                                <div>
                                                  <p className="text-sm font-helv">Settings</p>
                                                </div>
                                              </div>
                                            </Link>
                                            <div className="dark:bg-black dark:text-gray-200 py-2 px-3 flex items-center duration-300 hover:text-blue-500 cursor-pointer">
                                              <div className="dark:bg-black dark:text-gray-200 mr-2">
                                                <MdHelp size={18} />
                                              </div>
                                              <div>

                                              <Link to="/help">
                                                      <p className="text-sm font-helv">Help</p>
                                              </Link> 
                                            </div>
                                            </div>
                                            {/* <div className="dark:bg-black dark:text-gray-200 py-2 px-3 flex items-center duration-300 hover:text-blue-500 cursor-pointer">
                                              <div className="dark:bg-black dark:text-gray-200 mr-2">
                                                <MdSearch size={18} />
                                              </div>
                                              <div>
                                                <p className="text-sm font-helv">Search</p>
                                              </div>
                                            </div> */}
                                            <div className="dark:bg-black dark:text-gray-200 py-2 px-3 flex items-center duration-300 hover:text-blue-500 cursor-pointer">
                                              <div className="dark:bg-black dark:text-gray-200 mr-2">
                                                <FaTrash size={18} />
                                              </div>
                                              <div>
                                                <Link to="/trash">
                                                  <p className="text-sm font-helv">Trash</p>
                                                </Link>
                                              </div>
                                            </div>
                                            <Link
                                              className="pt-2 mt-4 block border-t border-border"
                                              to="/"
                                              onClick={() => {
                                                dispatch(_hide_nav_(!NAV_BAR_CONDITION))
                                                handleLinkClick("logout");
                                                localStorage.clear();
                                                dispatch(_delete_token_(null));
                                                dispatch(_save_survey_(null));
                                                dispatch(_delete_user_profile(null));
                                                dispatch(_save_details_(null));
                                                dispatch(_save_sub_details_(null));
                                                window.location.replace("/login");
                                              }}
                                            >
                                              <div
                                                className={`py-2 px-3 flex items-center ${
                                                  activeLink === "logout" ? "text-blue-500" : ""
                                                }`}
                                              >
                                                <div className="dark:bg-black dark:text-gray-200 mr-2">
                                                  <MdLogout size={18} />
                                                </div>
                                                <div>
                                                  <p className="text-sm font-helv">Logout</p>
                                                </div>
                                              </div>
                                            </Link>
                                          </div>
                                        </div>
                                    </div>

                                  )}
                                    

                                  </div>

                                  <div className="dark:bg-black dark:text-gray-200 flex flex-col bg-white">
                                    {!isHovered && (
                                      <>
                                        {subscriptions_details
                                        ?
                                          <>
                                          <div className="dark:bg-black dark:text-gray-200 mb-2">
                                          {subscriptions_details.user.trail_ends
                                          ?
                                            <div className="dark:bg-black dark:text-gray-200 flex text-base justify-items-start items-center">
                                              <div>
                                                  <svg className="w-4 h-4 mb-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                                    <path d="M14.25,4.77c.44,.96,.67,2.01,.67,3.08,0,1.56-.5,3.08-1.41,4.34-.92,1.26-2.21,2.2-3.7,2.68-1.48,.48-3.08,.48-4.57,0-1.48-.48-2.78-1.42-3.69-2.69S.14,9.4,.14,7.84c0-1.56,.5-3.08,1.41-4.34,.92-1.26,2.21-2.2,3.7-2.68,.45-.15,.93,.1,1.08,.55,.15,.45-.1,.93-.55,1.08-1.14,.37-2.13,1.09-2.84,2.06-.7,.97-1.08,2.14-1.09,3.33,0,1.2,.38,2.37,1.08,3.34,.7,.97,1.7,1.69,2.84,2.06,1.14,.37,2.37,.37,3.51,0,1.14-.37,2.13-1.09,2.84-2.06s1.08-2.14,1.09-3.34c0-.77-.15-1.52-.45-2.22l-1.42,.82c-.19,.11-.43,.1-.61-.03-.18-.13-.27-.34-.24-.56,.23-1.4,.44-2.17,.92-3.45,.1-.25,.36-.4,.62-.36,1.35,.22,2.12,.42,3.45,.92,.21,.08,.35,.27,.37,.49,.02,.22-.09,.43-.28,.54l-1.32,.76Z" fill="#76A9FA" fillRule="evenodd"></path>
                                                    <path d="M7.79,8.83c.31-.13,.51-.44,.51-.78l.02-2.55c0-.47-.38-.86-.85-.86-.47,0-.86,.38-.87,.85l-.02,2-1.09,.48c-.43,.19-.63,.69-.44,1.13,.19,.43,.69,.63,1.13,.44l1.6-.7Z" fill="#1C64F2" fillRule="evenodd"></path>
                                                  </svg>
                                              </div>
                                              <span className="text-sm pl-2 mb-2">Free trial ends in {subscriptions_details.user.trail_ends}</span>
                                            </div>
                                          :
                                            <div className="dark:bg-black dark:text-gray-200 flex text-base justify-items-start items-center">
                                                <div>
                                                    <svg className="w-4 h-4 mb-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                                      <path d="M14.25,4.77c.44,.96,.67,2.01,.67,3.08,0,1.56-.5,3.08-1.41,4.34-.92,1.26-2.21,2.2-3.7,2.68-1.48,.48-3.08,.48-4.57,0-1.48-.48-2.78-1.42-3.69-2.69S.14,9.4,.14,7.84c0-1.56,.5-3.08,1.41-4.34,.92-1.26,2.21-2.2,3.7-2.68,.45-.15,.93,.1,1.08,.55,.15,.45-.1,.93-.55,1.08-1.14,.37-2.13,1.09-2.84,2.06-.7,.97-1.08,2.14-1.09,3.33,0,1.2,.38,2.37,1.08,3.34,.7,.97,1.7,1.69,2.84,2.06,1.14,.37,2.37,.37,3.51,0,1.14-.37,2.13-1.09,2.84-2.06s1.08-2.14,1.09-3.34c0-.77-.15-1.52-.45-2.22l-1.42,.82c-.19,.11-.43,.1-.61-.03-.18-.13-.27-.34-.24-.56,.23-1.4,.44-2.17,.92-3.45,.1-.25,.36-.4,.62-.36,1.35,.22,2.12,.42,3.45,.92,.21,.08,.35,.27,.37,.49,.02,.22-.09,.43-.28,.54l-1.32,.76Z" fill="#76A9FA" fillRule="evenodd"></path>
                                                      <path d="M7.79,8.83c.31-.13,.51-.44,.51-.78l.02-2.55c0-.47-.38-.86-.85-.86-.47,0-.86,.38-.87,.85l-.02,2-1.09,.48c-.43,.19-.63,.69-.44,1.13,.19,.43,.69,.63,1.13,.44l1.6-.7Z" fill="#1C64F2" fillRule="evenodd"></path>
                                                    </svg>
                                                </div>
                                                <span className="text-sm pl-2 mb-2">Your current plans</span>
                                              </div>
                                          }
                                            <div className="dark:bg-black dark:text-gray-200 ">
                                            <button
                                              onClick={() => {
                                                // console.log("pricing")
                                                setShowpricingPopUpModal(true)
                                                dispatch(_hide_nav_(!NAV_BAR_CONDITION))
                                              }}
                                              className="text-[25px]  transition-all duration-200 relative shadow-sm outline-none hover:outline-none  mb-2  flex select-none items-center py-3 text-xs font-medium ring-offset-2 focus:ring-2 text-white justify-center rounded-lg bg-[#334977]  w-[200px] h-[30px] px-2 p-2  mr-3"
                                            >
                                              <span>View Details</span>
                                            </button>
                                          </div>
                                          </div>
                                          </>
                                        :
                                        <>
                                          <LoadingPage />
                                          </>
                                        }
                                      </>
                                    )}
                                    <div className="dark:bg-black dark:text-gray-200 bg-white mb-6    w-full">
                                      <Button
                                        sx={{ textTransform: "none" }}
                                        onClick={() => {
                                          setHovered(!isHovered);
                                        }}
                                        className="flex items-center"
                                      >
                                        {PROFILE_DATA ? (
                                          PROFILE_DATA.profile_pic ? (
                                            <img
                                              src="https://uffiafilestorage.s3.amazonaws.com/frontend-images/default.png"
                                              alt="PP"
                                              className="w-[40px] h-[40px] rounded-full"
                                            />
                                          ) : (
                                            <img
                                              src="https://uffiafilestorage.s3.amazonaws.com/frontend-images/default.png"
                                              alt="Image"
                                              className="w-[40px] h-[40px] rounded-full"
                                            />
                                          )
                                        ) : (
                                          <img
                                            src="https://uffiafilestorage.s3.amazonaws.com/frontend-images/default.png"
                                            alt="Image"
                                            className="w-[40px] h-[40px] rounded-full"
                                          />
                                        )}
                                        <div className="dark:bg-black dark:text-gray-200 text-left ml-2 w-full">
                                          <p className="text-xs dark:text-white font-sans font-bold text-black">
                                            {ChosenWorkspaceId &&
                                              <>
                                                {ChosenWorkspaceId["workspace_name"]}
                                              </>
                                            }
                                          </p>
                                          {subscriptions_details &&
                                            <>
                                              {subscriptions_details.user.status=='active'
                                              ?
                                                null
                                              :
                                                <>
                                                  <p className="dark:text-white text-[10px] font-sans font-bold text-black">
                                                    Free plan
                                                  </p>
                                                </>
                                              }

                                            </>
                                          }
                                        </div>
                                        <span className="w-4 h-6 float-right ml-3">
                                          <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 14 14"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-full h-full"
                                          >
                                            <g clipPath="url(#clip0_512_3040)">
                                              <path
                                                d="M10.8909 8.99179C11.0786 8.80401 11.3331 8.69847 11.5986 8.69838C11.864 8.69828 12.1186 8.80365 12.3064 8.99129C12.4942 9.17893 12.5997 9.43347 12.5998 9.69893C12.5999 9.96439 12.4946 10.219 12.3069 10.4068L8.00691 14.7068C7.81938 14.8943 7.56507 14.9996 7.29991 14.9996C7.03475 14.9996 6.78044 14.8943 6.59291 14.7068L2.29291 10.4068C2.10527 10.2189 1.99996 9.96413 2.00015 9.69858C2.00033 9.43303 2.106 9.17843 2.29391 8.99079C2.48182 8.80315 2.73657 8.69783 3.00212 8.69802C3.26767 8.69821 3.52227 8.80388 3.70991 8.99179L7.29991 12.5828L10.8909 8.99179ZM10.8909 5.00779L7.29991 1.41679L3.70891 5.00779C3.52127 5.19556 3.26672 5.3011 3.00126 5.3012C2.73581 5.30129 2.48118 5.19593 2.29341 5.00829C2.10564 4.82065 2.00009 4.5661 2 4.30064C1.99991 4.03518 2.10527 3.78056 2.29291 3.59279L6.59291 -0.707214C6.78044 -0.894685 7.03475 -1 7.29991 -1C7.56507 -1 7.81938 -0.894685 8.00691 -0.707214L12.3069 3.59279C12.3998 3.68576 12.4735 3.79613 12.5238 3.91758C12.574 4.03904 12.5999 4.1692 12.5998 4.30064C12.5998 4.43208 12.5738 4.56223 12.5235 4.68364C12.4732 4.80506 12.3994 4.91538 12.3064 5.00829C12.2134 5.1012 12.1031 5.17488 11.9816 5.22514C11.8602 5.2754 11.73 5.30124 11.5986 5.3012C11.4671 5.30115 11.337 5.27521 11.2156 5.22487C11.0941 5.17453 10.9838 5.10076 10.8909 5.00779Z"
                                                fill="#36464E"
                                              />
                                            </g>
                                            <defs>
                                              <clipPath id="clip0_512_3040">
                                                <rect width="14" height="14" fill="white" />
                                              </clipPath>
                                            </defs>
                                          </svg>
                                        </span>
                                      </Button>
                                    </div>
                                  </div>
                                  </div>
                                  {/* ====== Profile ======== */}


                              </div>
                      </div>

                  </div>


                  </>
                )
                :
                  null
              }
            </>
          }




          {showpricingPopUpModal ? (
            <>
              <div
                className="justify-center  items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
              >
                <div className="dark:bg-gray-600 dark:text-gray-200 relative my-6">
                  <div
                    className="justify-center  items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                  >
                    <div className="dark:bg-gray-600 dark:text-gray-200 relative w-auto my-6 mx-auto max-w-3xl">
                      <div className="dark:bg-gray-600 dark:text-gray-200 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        <div className="dark:bg-gray-600 dark:text-gray-200 dark:border-slate-500 flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                          <h3 className="text-3xl font-semibold">
                            <div className="dark:bg-gray-600 dark:text-gray-200 mb-4">
                              <div className="dark:bg-gray-600 dark:text-gray-200 flex text-base justify-items-start items-center">
                                <div>
                                  <svg className="w-5 h-5 mt-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                    <path d="M14.25,4.77c.44,.96,.67,2.01,.67,3.08,0,1.56-.5,3.08-1.41,4.34-.92,1.26-2.21,2.2-3.7,2.68-1.48,.48-3.08,.48-4.57,0-1.48-.48-2.78-1.42-3.69-2.69S.14,9.4,.14,7.84c0-1.56,.5-3.08,1.41-4.34,.92-1.26,2.21-2.2,3.7-2.68,.45-.15,.93,.1,1.08,.55,.15,.45-.1,.93-.55,1.08-1.14,.37-2.13,1.09-2.84,2.06-.7,.97-1.08,2.14-1.09,3.33,0,1.2,.38,2.37,1.08,3.34,.7,.97,1.7,1.69,2.84,2.06,1.14,.37,2.37,.37,3.51,0,1.14-.37,2.13-1.09,2.84-2.06s1.08-2.14,1.09-3.34c0-.77-.15-1.52-.45-2.22l-1.42,.82c-.19,.11-.43,.1-.61-.03-.18-.13-.27-.34-.24-.56,.23-1.4,.44-2.17,.92-3.45,.1-.25,.36-.4,.62-.36,1.35,.22,2.12,.42,3.45,.92,.21,.08,.35,.27,.37,.49,.02,.22-.09,.43-.28,.54l-1.32,.76Z" fill="#76A9FA" fillRule="evenodd"></path>
                                    <path d="M7.79,8.83c.31-.13,.51-.44,.51-.78l.02-2.55c0-.47-.38-.86-.85-.86-.47,0-.86,.38-.87,.85l-.02,2-1.09,.48c-.43,.19-.63,.69-.44,1.13,.19,.43,.69,.63,1.13,.44l1.6-.7Z" fill="#1C64F2" fillRule="evenodd"></path>
                                  </svg>
                                </div>
                                <span className="dark:bg-gray-600 dark:text-gray-200 text-lg pl-2">
                                {subscriptions_details &&
                                  <>
                                    {
                                      subscriptions_details.user.trail_ends!=undefined || subscriptions_details.user.trail_ends!=null
                                      ?
                                      "Free trial ends in  " + subscriptions_details.user.trail_ends
                                      :
                                        "Your subscription ends in  "+subscriptions_details.user.date_to_end_subs
                                      }
                                  </>
                                }
                                  </span>
                              </div>
                            </div>
                          </h3>
                        </div>
                        <div>

                        
                          {/* ==================the message ============= */}
                          <div className="dark:bg-gray-600 dark:text-gray-200 w-[90%] m-auto p-8">
                            <div className="dark:bg-gray-600 dark:text-gray-200 flex text-base mb-2 mt-2 justify-items-start items-center space-x-2">
                              <div>
                                <svg className="w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" x="0px" y="0px"><g data-name="01"><path d="M18.81,4.83a3.08,3.08,0,0,0-5.63,0L3.73,23.77a3.82,3.82,0,0,0,.16,3.69A3.13,3.13,0,0,0,6.54,29H25.46a3.13,3.13,0,0,0,2.65-1.54,3.82,3.82,0,0,0,.16-3.69Zm7.59,21.58a1.14,1.14,0,0,1-1,.59H6.54a1.14,1.14,0,0,1-1-.59,1.81,1.81,0,0,1-.07-1.75L15,5.72a1.09,1.09,0,0,1,2,0l9.46,18.94A1.81,1.81,0,0,1,26.41,26.41ZM16,20a3,3,0,1,0,3,3A3,3,0,0,0,16,20Zm0,4a1,1,0,1,1,1-1A1,1,0,0,1,16,24Zm-2.1-6.88a2.12,2.12,0,0,0,4.2,0l.76-4.81A2.12,2.12,0,0,0,16.75,10h-1.5a2.12,2.12,0,0,0-1.58.71,2.14,2.14,0,0,0-.52,1.69ZM15.25,12h1.5l.12.08-.76,4.81c0,.12-.21.17-.24,0l-.75-4.77-1,.16Z" /></g></svg>
                              </div>
                              <p className="text-sm font-normal text-gray-400">
                                You are currently subscribed to the {subscriptions_details.plan} plan,
                                which provides you with unlimited word access. Once your trial period concludes,
                                you will be automatically charged the specified amount for one {subscriptions_details.user.subscription_type} continued usage of the tool.
                              </p>
                            </div>
                            <div className="dark:bg-gray-600 dark:text-gray-200 dark:border-slate-500 flex flex-col mb-5 mt-5 w-full border-b border-gray-200 pb-4 space-y-1">
                              <div className="dark:bg-gray-600 dark:text-gray-200 text-gray-600 text-xs font-semibold uppercase"> subsciption type</div>
                              <div className="dark:bg-gray-600 dark:text-gray-200 flex flex-row justify-between">
                                <div className="dark:bg-gray-600 dark:text-gray-200 text-gray-900">{subscriptions_details.user.plan}</div>

                                {subscriptions_details.user.plan == "starter" && subscriptions_details.user.subscription_type == "monthly"
                                  ?
                                  <div className="dark:bg-gray-600 dark:text-gray-200 text-sm text-gray-600">
                                    ${subscriptions_details.charge_description.monthly_starter}
                                    /month
                                  </div>
                                  :
                                  null
                                }
                                {subscriptions_details.user.plan == "starter" && subscriptions_details.user.subscription_type == "annually"
                                  ?
                                  <div className="dark:bg-gray-600 dark:text-gray-200 text-sm text-gray-600">
                                    ${subscriptions_details.charge_description.annaully_starter}
                                    /year
                                  </div>
                                  :
                                  null
                                }
                                {subscriptions_details.user.plan == "premium" && subscriptions_details.user.subscription_type == "monthly"
                                  ?
                                  <div className="dark:bg-gray-600 dark:text-gray-200 text-sm text-gray-600">
                                    ${subscriptions_details.charge_description.monthly_premium_mode}
                                    /month
                                  </div>
                                  :
                                  null
                                }
                                {subscriptions_details.user.plan == "premium" && subscriptions_details.user.subscription_type == "annually"
                                  ?
                                  <div className="dark:bg-gray-600 dark:text-gray-200 text-sm text-gray-600">
                                    ${subscriptions_details.charge_description.annaully_premium_mode}
                                    /year
                                  </div>

                                  :
                                  null
                                }

                              </div>
                            </div>
                            <div className="dark:bg-gray-600 dark:text-gray-200 dark:border-slate-500 flex flex-col mb-2 mt-2 w-full border-b border-gray-200 pb-4 space-y-1">
                              <div className="dark:bg-gray-600 dark:text-gray-200 flex flex-row justify-between">
                                <span className="text-xl font-bold text-gray-900 w-3/5">Plan total</span>
                                <div className="dark:bg-gray-600 dark:text-gray-200 flex flex-col items-end md:flex-row space-x-2"><span className="text-lg text-green-600 font-bold">$
                                  {subscriptions_details.user.plan == "starter" && subscriptions_details.user.subscription_type == "monthly"
                                    ?
                                    subscriptions_details.charge_description.monthly_starter
                                    :
                                    null
                                  }
                                  {subscriptions_details.user.plan == "starter" && subscriptions_details.user.subscription_type == "annually"
                                    ?
                                    subscriptions_details.charge_description.annaully_starter
                                    :
                                    null
                                  }
                                  {subscriptions_details.user.plan == "premium" && subscriptions_details.user.subscription_type == "monthly"
                                    ?
                                    subscriptions_details.charge_description.monthly_premium_mode
                                    :
                                    null
                                  }
                                  {subscriptions_details.user.plan == "premium" && subscriptions_details.user.subscription_type == "annually"
                                    ?
                                    subscriptions_details.charge_description.annaully_premium_mode
                                    :
                                    null
                                  }*</span></div>
                              </div>
                            </div>
                          </div>
                          {/* ==================the message ============= */}


                        </div>
                        {/*footer*/}
                        <div className="dark:bg-gray-600 dark:text-gray-200 dark:border-slate-500 flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                          <button
                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={() => setShowpricingPopUpModal(false)}
                          >
                            Close
                          </button>
                          <button
                            className="bg-[#334977] text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={() => {
                              setShowpricingPopUpModal(false)
                              navigate("/settings/subscription_plan")
                            }}
                          >
                            Change Plan
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="dark:bg-black dark:text-gray-200 opacity-25 fixed inset-0 z-40 bg-black">
                  </div>
                </div>
              </div>
            </>
          )
            :
            null
          }
        </>
      }
    </>
  );
};

export default Navbar;
