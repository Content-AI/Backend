import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { BACKEND_URL, BACK_END_API_PROJECTS } from "../../../apis/urls";
import { postData, fetchData, patchData } from "../../../apis/apiService";
import CardDoc from "../../Card/CardDoc";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import ListOfDocument from "../Template/Document/ListOfDocument";
import { useSelector, useDispatch } from "react-redux";
import { _save_folder_data_ } from "../../../features/FolderData";

import { useLocation } from "react-router-dom";
import { setDocumentTitle } from '../../NavBar/DynamicTitle';

const cardData = [
  {
    title: "Blog Post Wizard",
    description:
      "Jump into a whole first draft of your blog post in 5 minutes - all we need is your title and topic.",
    icon: "FileDoc.svg",
    isPremium: true,
  },
  {
    title: "Instagram Captions",
    description:
      "Generate captions for an Instagram photo just by describing what the post is about.",
    icon: "FileDoc.svg",
  },
];

const Projects = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setDocumentTitle("Project");
}, []);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const create_folder_params = searchParams.get("create");

  const [FolderOfUser, setFolderOfUser] = useState(null);
  const [PopUpModelToCreateFolder, setPopUpModelToCreateFolder] =
    useState(false);
  const [folderName, setFolderName] = useState(null);
  const [openPopUpMiniMenu, setopenPopUpMiniMenu] = useState(null);
  const [FolderRenameDiv, setFolderRenameDiv] = useState(false);
  const [RenameFolder, setRenameFolder] = useState(null);
  const [RenameFolderId, setRenameFolderId] = useState(null);

  const [showModalForDelete, setshowModalForDelete] = useState(false);
  const [DeleteFolderId, setDeleteFolderId] = useState(null);

  const notifyerror = (message) => toast.error(message);
  const notifysuccess = (message) => toast.success(message);

  const popupRef = useRef(null);

  let DocumentsData = useSelector(
    (state) => state.SetDocumentsData.DocumentsData
  );
  let ChosenWorkspaceId = useSelector(
    (state) => state.SetChosenWorkspaceId.ChosenWorkspaceId
    );	


  const get_folder_of_user = async () => {
    if(ChosenWorkspaceId!=null){
      const resp = await fetchData(
        BACKEND_URL + BACK_END_API_PROJECTS+"?workspace_id="+ChosenWorkspaceId["Workspace_Id"],
        props.AUTH_TOKEN
      );
      if ((resp.status = 200)) {
        setFolderOfUser(resp.data);
        dispatch(_save_folder_data_(resp.data));
      }
    }
  };

  const handlePopUpMenu = (index) => {
    if (openPopUpMiniMenu === index) {
      setopenPopUpMiniMenu(null);
    } else {
      setopenPopUpMiniMenu(index);
    }
  };

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setopenPopUpMiniMenu(null);
    }
  };

  const handleFolderDelete = (id) => {
    setFolderOfUser((prevDocuments) =>
      prevDocuments.filter((document) => document.id !== id)
    );
    setshowModalForDelete(false);
  };

  const update_folder_name = async (id) => {
    let formData = {
      project_name: RenameFolder,
    };
    const resp = await patchData(
      formData,
      BACKEND_URL + BACK_END_API_PROJECTS + id + "/",
      props.AUTH_TOKEN
    );
    if ((resp.status = 201)) {
      get_folder_of_user();
      notifysuccess("Folder Name updated");
    } else {
      notifyerror("something went wrong");
    }
    setFolderRenameDiv(false);
  };

  const _update_project_data = async (data, id, message) => {
    const resp = await patchData(
      data,
      BACKEND_URL + BACK_END_API_PROJECTS + id + "/",
      props.AUTH_TOKEN
    );
    if (resp.status == 201) {
      notifysuccess(message);
      handleFolderDelete(id);
    } else {
      notifyerror("something went wrong");
    }
  };

  const create_folder = async () => {
    let formData = {
      project_name: folderName,
      workspace_id:ChosenWorkspaceId["Workspace_Id"]
    };
    const resp = await postData(
      formData,
      BACKEND_URL + BACK_END_API_PROJECTS,
      props.AUTH_TOKEN
    );
    if (resp.status == 201) {
      notifysuccess("Folder created");
      get_folder_of_user();
      setFolderName(null);
    } else {
      notifyerror("something went wrong");
    }
    setPopUpModelToCreateFolder(false);
  };

  const handleFolderNameInputChange = (event) => {
    setFolderName(event.target.value);
  };

  useEffect(() => {
    get_folder_of_user();
  }, []);
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFolderRenameChange = (event) => {
    setRenameFolder(event.target.value);
  };

  useEffect(() => {
    get_folder_of_user();
  }, [DocumentsData]);

  useEffect(() => {
    if (create_folder_params == "new_folder") {
      setPopUpModelToCreateFolder(true);
    }
  }, []);

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-6">Projects</h1>
      <div className="mt-8">
        <div className="title-header flex items-center mb-6">
          <h3 className="inline-flex text-md font-bold text-blue pb-1 border-b border-blue">
            Get Started
          </h3>
          <div className="ml-auto">
            <button
              onClick={() => {
                navigate("/template");
              }}
              className="text-md cursor-pointer"
            >
              See more templates
            </button>
          </div>
        </div>
        <div>
          <div className="cardwrap grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-5">
            <div
              className="flex flex-col items-center justify-center bg-[#334977] text-white min-h-[144px] rounded-xl cursor-pointer hover:border hover:shadow-lg focus:ring-gray-400 focus:shadow-xl duration-150  hover:ring-gray-300 hover:ring-2"
              onClick={() => {
                navigate("/create_new_content");
              }}
            >
              <div className="icon w-6 h-6 mb-2.5">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  <path
                    d="M12 2.25C6.62391 2.25 2.25 6.62391 2.25 12C2.25 17.3761 6.62391 21.75 12 21.75C17.3761 21.75 21.75 17.3761 21.75 12C21.75 6.62391 17.3761 2.25 12 2.25ZM15.75 12.75H12.75V15.75C12.75 15.9489 12.671 16.1397 12.5303 16.2803C12.3897 16.421 12.1989 16.5 12 16.5C11.8011 16.5 11.6103 16.421 11.4697 16.2803C11.329 16.1397 11.25 15.9489 11.25 15.75V12.75H8.25C8.05109 12.75 7.86032 12.671 7.71967 12.5303C7.57902 12.3897 7.5 12.1989 7.5 12C7.5 11.8011 7.57902 11.6103 7.71967 11.4697C7.86032 11.329 8.05109 11.25 8.25 11.25H11.25V8.25C11.25 8.05109 11.329 7.86032 11.4697 7.71967C11.6103 7.57902 11.8011 7.5 12 7.5C12.1989 7.5 12.3897 7.57902 12.5303 7.71967C12.671 7.86032 12.75 8.05109 12.75 8.25V11.25H15.75C15.9489 11.25 16.1397 11.329 16.2803 11.4697C16.421 11.6103 16.5 11.8011 16.5 12C16.5 12.1989 16.421 12.3897 16.2803 12.5303C16.1397 12.671 15.9489 12.75 15.75 12.75Z"
                    fill="white"
                  />
                </svg>
              </div>
              <p className="text-md font-bold">Create New Project</p>
            </div>
            {cardData.map((items, index) => {
              return (
                <>
                  {index < 2 && <CardDoc {...items} key={"carddoc_" + index} />}
                </>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-8">
        <div className="title-header flex items-center mb-6">
          <h3 className="inline-flex text-md font-bold text-blue pb-1 border-b border-blue">
            Folders
          </h3>
          <div className="flex items-center gap-4 ml-auto">
            <div className="selectopt relative w-40">
              <button
                className="flex items-center text-sm leading-none font-bold bg-[#334977] text-white px-3 py-2 gap-2 border border-border rounded-md"
                onClick={() => {
                  setPopUpModelToCreateFolder(true);
                }}
              >
                <span className="icon w-3.5 h-3.5">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full "
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M2.33398 2.33317C2.17927 2.33317 2.0309 2.39463 1.92151 2.50402C1.81211 2.61342 1.75065 2.76179 1.75065 2.9165V11.0832C1.75065 11.2379 1.81211 11.3863 1.92151 11.4956C2.0309 11.605 2.17928 11.6665 2.33398 11.6665H11.6673C11.822 11.6665 11.9704 11.605 12.0798 11.4956C12.1892 11.3863 12.2507 11.2379 12.2507 11.0832V4.6665C12.2507 4.51179 12.1892 4.36342 12.0798 4.25402C11.9704 4.14463 11.822 4.08317 11.6673 4.08317H6.41732C6.22228 4.08317 6.04014 3.98569 5.93196 3.82341L4.93846 2.33317H2.33398ZM1.09655 1.67907C1.42474 1.35088 1.86986 1.1665 2.33398 1.1665H5.25065C5.44569 1.1665 5.62783 1.26398 5.73601 1.42626L6.72951 2.9165H11.6673C12.1314 2.9165 12.5766 3.10088 12.9048 3.42907C13.2329 3.75726 13.4173 4.20237 13.4173 4.6665V11.0832C13.4173 11.5473 13.2329 11.9924 12.9048 12.3206C12.5766 12.6488 12.1314 12.8332 11.6673 12.8332H2.33398C1.86986 12.8332 1.42474 12.6488 1.09655 12.3206C0.768359 11.9924 0.583984 11.5473 0.583984 11.0832V2.9165C0.583984 2.45238 0.768359 2.00726 1.09655 1.67907Z"
                      fill="white"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.99935 5.8335C7.32152 5.8335 7.58268 6.09466 7.58268 6.41683V9.91683C7.58268 10.239 7.32152 10.5002 6.99935 10.5002C6.67718 10.5002 6.41602 10.239 6.41602 9.91683V6.41683C6.41602 6.09466 6.67718 5.8335 6.99935 5.8335Z"
                      fill="white"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.66602 8.16683C4.66602 7.84466 4.92718 7.5835 5.24935 7.5835H8.74935C9.07151 7.5835 9.33268 7.84466 9.33268 8.16683C9.33268 8.489 9.07151 8.75016 8.74935 8.75016H5.24935C4.92718 8.75016 4.66602 8.489 4.66602 8.16683Z"
                      fill="white"
                    />
                  </svg>
                </span>
                Create Folder
              </button>
              {/* <span className="icon absolute top-1/2 left-3 -translate-y-1/2 w-3.5 h-3.5">
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
              </span> */}
              {/* <select
                name=""
                id=""
                className="w-full h-8 text-sm font-bold border border-border rounded-md bg-white px-8 py-1"
              >
                <option>Last Modified</option>
                <option>Last Modified</option>
                <option>Last Modified</option>
              </select> */}
            </div>
          </div>
        </div>

        {/* ======================Folders of user ================== */}

        {FolderOfUser && (
          <>
            {FolderOfUser.length > 0 ? (
              <>
                <div className="mb-8 flex w-full max-w-full flex-wrap sm:-mr-6">
                  {FolderOfUser.map((data, index) => {
                    return (
                      <div
                        className="flex w-[250px] cursor-pointer items-start pb-6 mr-1"
                        key={index}
                      >
                        <div className="dark:bg-gray-700 dark:text-white  dark:border-slate-500   bg-[#fafbfd]  shadow-lg relative top-0 flex max-w-full flex-1 items-center rounded-xl border border-purple-100  py-1 pl-2 transition-top duration-200 hover:-top-1 md:mr-6">
                          <div className="w-full grid grid-rows-1">
                            <div
                              className="tooltip-container  pr-4"
                              onClick={() => {
                                navigate(
                                  `/folder_of_user/${data.id}?folder_name=${data.project_name}`
                                );
                              }}
                            >
                              <div className="flex">
                                <div>
                                  <svg
                                    className="w-5 h-5 m-2"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      opacity="0.5"
                                      d="M22 14V11.7979C22 9.16554 22 7.84935 21.2305 6.99383C21.1598 6.91514 21.0849 6.84024 21.0062 6.76946C20.1506 6 18.8345 6 16.2021 6H15.8284C14.6747 6 14.0979 6 13.5604 5.84678C13.2651 5.7626 12.9804 5.64471 12.7121 5.49543C12.2237 5.22367 11.8158 4.81578 11 4L10.4497 3.44975C10.1763 3.17633 10.0396 3.03961 9.89594 2.92051C9.27652 2.40704 8.51665 2.09229 7.71557 2.01738C7.52976 2 7.33642 2 6.94975 2C6.06722 2 5.62595 2 5.25839 2.06935C3.64031 2.37464 2.37464 3.64031 2.06935 5.25839C2 5.62595 2 6.06722 2 6.94975V14C2 17.7712 2 19.6569 3.17157 20.8284C4.34315 22 6.22876 22 10 22H14C17.7712 22 19.6569 22 20.8284 20.8284C22 19.6569 22 17.7712 22 14Z"
                                      fill="#1C274C"
                                    />
                                    <path
                                      d="M12.25 10C12.25 9.58579 12.5858 9.25 13 9.25H18C18.4142 9.25 18.75 9.58579 18.75 10C18.75 10.4142 18.4142 10.75 18 10.75H13C12.5858 10.75 12.25 10.4142 12.25 10Z"
                                      fill="#1C274C"
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <input
                                    type="text"
                                    className="dark:bg-gray-700 dark:text-white flex flex-1 p-2 outline-none max-w-full rounded-md border-none text-sm cursor-pointer focus:ring-0 group-hover:text-blue-800 min-w-full overflow-ellipsis whitespace-nowrap pr-7"
                                    spellCheck="false"
                                    required=""
                                    data-hj-allow="true"
                                    value={data.project_name}
                                    readOnly
                                  />
                                </div>
                              </div>

                              <div className="grid content-center w-full ml-2">
                                <span className="dark:text-white font-bold text-sm text-slate-600 flex-grow bloc">
                                  {data.documents_data}
                                </span>
                              </div>
                              <span className="tooltip-text">
                                Open {data.project_name} folder
                              </span>
                            </div>

                            <div className="flex flex-1 pl-2">
                              <div className="grid content-center w-full">
                                <span className="dark:text-white flex-grow block text-[12px] font-bold text-gray-500 whitespace-nowrap">
                                  Created on {data.created_at}
                                </span>
                              </div>
                              <div className="relative flex">
                                <button
                                  className="flex cursor-pointer items-center justify-center p-3 text-grey-600 h-full pr-6"
                                  id="headlessui-menu-button-1994"
                                  type="button"
                                  aria-haspopup="true"
                                  aria-expanded="false"
                                  onClick={() => handlePopUpMenu(index)}
                                >
                                  <span
                                    className="sr-only"
                                    data-testid="more-button"
                                  >
                                    Open options
                                  </span>
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M4 8C4 9.10457 3.10457 10 2 10C0.895431 10 0 9.10457 0 8C0 6.89543 0.895431 6 2 6C3.10457 6 4 6.89543 4 8ZM16 8C16 9.10457 15.1046 10 14 10C12.8954 10 12 9.10457 12 8C12 6.89543 12.8954 6 14 6C15.1046 6 16 6.89543 16 8ZM8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
                                      fill="#6C8D9D"
                                    ></path>
                                  </svg>
                                </button>
                                {openPopUpMiniMenu === index && (
                                  <div
                                    ref={popupRef}
                                    className="dark:bg-slate-600 dark:hover:bg dark:text-gray-200 dark:border-slate-500 mr-10 z-20 absolute right-0 mt-1 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white text-gray-600 text-sm font-medium shadow-md border border-gray-200 focus:outline-none transform opacity-100 scale-100"
                                    role="menu"
                                    tabIndex="0"
                                  >
                                    <div role="none">
                                      <button
                                        className="dark:hover:bg-gray-500 flex items-center px-3.5 py-2.5 hover:bg-gray-100 w-full text-sm space-x-3 active:bg-blue-100"
                                        role="none"
                                        type="button"
                                        onClick={() => {
                                          setFolderRenameDiv(true);
                                          setRenameFolder(data.project_name);
                                          setRenameFolderId(data.id);
                                          if (popupRef.current) {
                                            setopenPopUpMiniMenu(null);
                                          }
                                        }}
                                      >
                                        <svg
                                          className="w-4 h-4"
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 16 16"
                                          role="none"
                                        >
                                          <path
                                            d="M.09,7.46c.05-.96,.15-1.9,.25-2.79,.11-1.01,.65-1.88,1.42-2.45,.49-.37,1.07-.61,1.71-.68,.95-.11,1.96-.22,3-.27,.07,0,.15,0,.22,.01,.24,0,.47-.01,.71-.01,1.38,0,2.73,.15,3.96,.29,1.62,.19,2.92,1.48,3.1,3.11l-1.01,.11,1.01-.11c.14,1.23,.28,2.56,.28,3.94,0,.29,0,.58-.02,.87,.01,.08,.02,.17,.02,.26-.05,.96-.15,1.9-.25,2.79-.11,1.01-.65,1.88-1.42,2.45-.49,.37-1.07,.61-1.71,.68-.95,.11-1.96,.22-3,.27-.08,0-.15,0-.22-.01-.24,0-.47,.01-.71,.01-1.38,0-2.73-.15-3.96-.29-1.62-.19-2.92-1.48-3.1-3.11-.14-1.23-.28-2.56-.28-3.94,0-.29,0-.58,.02-.87-.01-.08-.02-.17-.02-.26Z"
                                            fill="#9CA3AF"
                                            fillRule="evenodd"
                                            role="none"
                                          ></path>
                                          <path
                                            d="M12.06,.79c.86-.92,2.31-.95,3.2-.06,.89,.89,.86,2.34-.06,3.2l-4.09,3.79c-.18,.17-.39,.29-.62,.37l-1.71,.57c-.89,.3-1.74-.55-1.44-1.45l.57-1.71c.08-.23,.2-.44,.37-.62L12.06,.79Z"
                                            fill="#4B5563"
                                            fillRule="evenodd"
                                            role="none"
                                          ></path>
                                        </svg>
                                        <span role="none">Rename</span>
                                      </button>
                                    </div>
                                    <div role="none">
                                      <button
                                        className="flex dark:hover:bg-gray-500 items-center px-3.5 py-2.5 hover:bg-gray-100 w-full text-sm space-x-3 active:bg-blue-100 text-red-600"
                                        role="none"
                                        onClick={() => {
                                          setshowModalForDelete(true);
                                          setDeleteFolderId(data.id);

                                          if (popupRef.current) {
                                            setopenPopUpMiniMenu(null);
                                          }
                                        }}
                                      >
                                        <svg
                                          className="w-4 h-4"
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 16 16"
                                          role="none"
                                        >
                                          <path
                                            d="M2.19,5.13c-.12,2.74-.09,5.49,.31,8.26,.22,1.48,1.47,2.61,2.97,2.61h5.03c1.51,0,2.76-1.12,2.97-2.61,.4-2.77,.44-5.52,.31-8.26H2.19Z"
                                            fill="#F98080"
                                            fillRule="evenodd"
                                            role="none"
                                          ></path>
                                          <path
                                            d="M6.58,8.02c0-.39-.32-.71-.71-.71s-.71,.32-.71,.71v4.72c0,.39,.32,.71,.71,.71s.71-.32,.71-.71v-4.72Zm4.27,0c0-.39-.32-.71-.71-.71s-.71,.32-.71,.71v4.72c0,.39,.32,.71,.71,.71s.71-.32,.71-.71v-4.72Z"
                                            fill="#E02424"
                                            fillRule="evenodd"
                                            role="none"
                                          ></path>
                                          <path
                                            d="M6.59,2.3c.37-.37,.88-.58,1.41-.58s1.04,.21,1.41,.58c.31,.31,.5,.7,.56,1.12h-3.95c.06-.42,.26-.82,.56-1.12Zm-2.29,1.12c.07-.88,.45-1.71,1.07-2.33C6.07,.39,7.02,0,8,0s1.93,.39,2.62,1.09c.63,.63,1.01,1.46,1.07,2.33h3.17c.47,0,.86,.38,.86,.86s-.38,.86-.86,.86H1.14c-.47,0-.86-.38-.86-.86s.38-.86,.86-.86h3.16Z"
                                            fill="#E02424"
                                            fillRule="evenodd"
                                            role="none"
                                          ></path>
                                        </svg>
                                        <span role="none">Delete</span>
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {showModalForDelete ? (
                            <>
                              <div className="fixed inset-0 z-10 overflow-y-auto  backdrop-filter bg-opacity-10">
                                <div
                                  className="fixed inset-0 w-full h-full"
                                  onClick={() => setshowModalForDelete(false)}
                                ></div>
                                <div className="flex items-center min-h-screen px-4 py-8">
                                  <div className="dark:bg-gray-700 dark:text-gray-200 border-black relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
                                    <div className="   mt-3 sm:flex flex items-center justify-center">
                                      {/* <div className="flex items-center justify-center flex-none w-12 h-12 mx-auto bg-red-100 rounded-full">
                                       
                                    </div> */}
                                      <div className=" flex items-center justify-center flex-col mt-2 text-center sm:ml-4 sm:text-left">
                                        <div>
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-6 h-6 text-red-600"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                        </div>
                                        <div>
                                          <h4 className="text-2xl font-medium text-red-500 m-3">
                                            Are you sure want to Delete ??
                                          </h4>
                                          <div className="items-center gap-2 mt-3 sm:flex">
                                            <button
                                              className="w-full mt-2 p-2.5 flex-1 text-white bg-red-600 rounded-md outline-none ring-offset-2 ring-red-600 focus:ring-2"
                                              onClick={() => {
                                                const formData = {
                                                  trash: true,
                                                };
                                                _update_project_data(
                                                  formData,
                                                  DeleteFolderId,
                                                  "Moved to trash"
                                                );
                                              }}
                                            >
                                              Delete
                                            </button>
                                            <button
                                              className="dark:text-white w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-indigo-600 focus:ring-2"
                                              onClick={() => {
                                                setshowModalForDelete(false);
                                              }}
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : null}

                          {FolderRenameDiv ? (
                            <>
                              <div
                                className="fixed inset-0 z-40 overflow-y-auto"
                                role="dialog"
                              >
                                <div className=" flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
                                  <div
                                    className="fixed inset-0 transition-opacity  bg-opacity-50"
                                  ></div>
                                  <div className="dark:bg-gray-700 dark:text-gray-200 dark:border-slate-500 relative h-full bg-white text-gray-900 rounded-md shadow-xl align-top sm:align-middle w-full sm:w-[416px]">
                                    <div className="w-full text-left flex justify-between items-center p-6 text-gray-900  border-b border-gray-200">
                                      <h3 className="dark:text-white text-lg font-semibold">
                                        Rename Folder
                                      </h3>
                                    </div>
                                    <div className="flex flex-col p-6">
                                      <div className="p-6">
                                        <div className="space-y-1.5 w-full">
                                          <label
                                            htmlFor="rename-document"
                                            className="sr-only"
                                          >
                                            <span className="flex items-center space-x-1">
                                              <span>Rename document</span>
                                            </span>
                                          </label>
                                          <div className="py-1 !mt-0 flex items-center gap-2 bg-white w-full px-3 rounded-lg ring-1 hover:ring-2 transition-all duration-150 ease-in-out ring-gray-200 outline-none focus-within:!ring-1">
                                            <div className="flex items-center grow gap-2 py-1.5">
                                              <div className="flex gap-1 grow">
                                                <input
                                                  value={RenameFolder}
                                                  onChange={
                                                    handleFolderRenameChange
                                                  }
                                                  id="rename-document"
                                                  type="text"
                                                  className="block w-full text-gray-900 placeholder:text-gray-400 text-sm font-normal resize-none outline-none"
                                                  placeholder="Document name"
                                                  name="name"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="p-6 flex items-center gap-4 justify-end">
                                        <button
                                          onClick={() => {
                                            setFolderRenameDiv(false);
                                            setRenameFolder(null);
                                            setRenameFolderId(null);
                                          }}
                                          type="button"
                                          className="transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-2 active:ring-1"
                                        >
                                          <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                                            Cancel
                                          </span>
                                        </button>
                                        <button
                                          onClick={() => {
                                            update_folder_name(RenameFolderId);
                                            if (popupRef.current) {
                                              setopenPopUpMiniMenu(null);
                                            }
                                          }}
                                          type="button"
                                          className="transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm bg-blue-600 text-white ring-0 ring-blue-600 hover:ring-2 active:ring-0"
                                        >
                                          <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                                            Save
                                          </span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <div className="empty-placeholder h-24 flex items-center justify-center text-center">
                  <p className="text-md font-bold opacity-50">
                    You don't have any folders yet.
                  </p>
                </div>
              </>
            )}
          </>
        )}
        {/* ======================Folders of user ================== */}
      </div>

      <div className="mt-8">
        <div className="title-header flex items-center mb-6">
          <h3 className="inline-flex text-md font-bold text-blue pb-1 border-b border-blue">
            Projects
          </h3>
          <div className="flex items-center gap-4 ml-auto">
            {/* <button className="flex items-center bg-white px-3 py-2 gap-2 border border-border rounded-md">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.85937 1.75C1.79897 1.75 1.75 1.79897 1.75 1.85937V5.57812C1.75 5.63853 1.79897 5.6875 1.85937 5.6875H5.57812C5.63853 5.6875 5.6875 5.63853 5.6875 5.57812V1.85937C5.6875 1.79897 5.63853 1.75 5.57812 1.75H1.85937ZM0.875 1.85937C0.875 1.31572 1.31572 0.875 1.85937 0.875H5.57812C6.12178 0.875 6.5625 1.31572 6.5625 1.85937V5.57812C6.5625 6.12178 6.12178 6.5625 5.57812 6.5625H1.85937C1.31572 6.5625 0.875 6.12178 0.875 5.57812V1.85937Z"
                  fill="black"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.42187 1.75C8.36147 1.75 8.3125 1.79897 8.3125 1.85937V5.57812C8.3125 5.63853 8.36147 5.6875 8.42187 5.6875H12.1406C12.201 5.6875 12.25 5.63853 12.25 5.57812V1.85937C12.25 1.79897 12.201 1.75 12.1406 1.75H8.42187ZM7.4375 1.85937C7.4375 1.31572 7.87822 0.875 8.42187 0.875H12.1406C12.6843 0.875 13.125 1.31572 13.125 1.85937V5.57812C13.125 6.12178 12.6843 6.5625 12.1406 6.5625H8.42187C7.87822 6.5625 7.4375 6.12178 7.4375 5.57812V1.85937Z"
                  fill="black"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.85937 8.3125C1.79897 8.3125 1.75 8.36147 1.75 8.42187V12.1406C1.75 12.201 1.79897 12.25 1.85937 12.25H5.57812C5.63853 12.25 5.6875 12.201 5.6875 12.1406V8.42187C5.6875 8.36147 5.63853 8.3125 5.57812 8.3125H1.85937ZM0.875 8.42187C0.875 7.87822 1.31572 7.4375 1.85937 7.4375H5.57812C6.12178 7.4375 6.5625 7.87822 6.5625 8.42187V12.1406C6.5625 12.6843 6.12178 13.125 5.57812 13.125H1.85937C1.31572 13.125 0.875 12.6843 0.875 12.1406V8.42187Z"
                  fill="black"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.42187 8.3125C8.36147 8.3125 8.3125 8.36147 8.3125 8.42187V12.1406C8.3125 12.201 8.36147 12.25 8.42187 12.25H12.1406C12.201 12.25 12.25 12.201 12.25 12.1406V8.42187C12.25 8.36147 12.201 8.3125 12.1406 8.3125H8.42187ZM7.4375 8.42187C7.4375 7.87822 7.87822 7.4375 8.42187 7.4375H12.1406C12.6843 7.4375 13.125 7.87822 13.125 8.42187V12.1406C13.125 12.6843 12.6843 13.125 12.1406 13.125H8.42187C7.87822 13.125 7.4375 12.6843 7.4375 12.1406V8.42187Z"
                  fill="black"
                />
              </svg>
            </button> */}
            <div className="selectopt relative w-40">
              {/* <span className="icon absolute top-1/2 left-3 -translate-y-1/2 w-3.5 h-3.5">
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
              </span> */}
              {/* <select
                name=""
                id=""
                className="w-full h-8 text-sm font-bold border border-border rounded-md bg-white px-8 py-1"
              >
                <option>Last Modified</option>
                <option>Last Modified</option>
                <option>Last Modified</option>
              </select> */}
            </div>
          </div>
        </div>
        {/* <div className="grid grid-cols-3 gap-6">
          <div className="card border border-border rounded-xl">
            <div className="card-header p-6 border-b border-border">
              <p className="text-md font-bold">2023-03-25 Untitled</p>
            </div>
            <div className="card-body p-6">
              <button className="text-md font-bold leading-none px-4 py-2 bg-[#D9D9D9] rounded">
                Chat
              </button>
            </div>
          </div>
        </div> */}
        <ListOfDocument
          SHOW={"active"}
          AUTH_TOKEN={props.AUTH_TOKEN}
          search_bar={"off"}
        />
      </div>

      {PopUpModelToCreateFolder ? (
        <>
          {/* <div className="fixed top-0 left-0 w-screen h-screen backdrop-blur-sm backdrop-filter bg-opacity-20 z-50"> */}
          <div className="fixed inset-0 z-40 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-50 opacity-100" 
            ></div>

                
            <div
              className="fixed inset-0 overflow-y-auto z-50"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex min-h-screen items-center justify-center text-center sm:block sm:p-0">
                <div
                  className="fixed inset-0 bg-grey-600 bg-opacity-75 transition-opacity"
                  aria-hidden="true"
                ></div>
                <span
                  className="hidden sm:inline-block sm:h-screen sm:align-middle"
                  aria-hidden="true"
                ></span>

                <div className="dark:bg-gray-700 dark:text-gray-200 inline-block rounded-lg bg-white align-bottom p-6 sm:p-8 shadow-xl transform text-left transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full undefined">
                  <button
                    className="dark:text-white outline-none absolute top-0 right-0 z-10 p-8 ring-0 hover:opacity-70"
                    tabIndex="0"
                    aria-label="Close"
                    onClick={() => {
                      setPopUpModelToCreateFolder(false);
                      setFolderName(null);
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.7071 3.70711C14.0976 3.31658 14.0976 2.68342 13.7071 2.29289C13.3166 1.90237 12.6834 1.90237 12.2929 2.29289L8 6.58579L3.70711 2.29289C3.31658 1.90237 2.68342 1.90237 2.29289 2.29289C1.90237 2.68342 1.90237 3.31658 2.29289 3.70711L6.58579 8L2.29289 12.2929C1.90237 12.6834 1.90237 13.3166 2.29289 13.7071C2.68342 14.0976 3.31658 14.0976 3.70711 13.7071L8 9.41421L12.2929 13.7071C12.6834 14.0976 13.3166 14.0976 13.7071 13.7071C14.0976 13.3166 14.0976 12.6834 13.7071 12.2929L9.41421 8L13.7071 3.70711Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </button>
                  <div className="text-left">
                    <h3
                      className="dark:text-gray-200 pt-8 pr-8 text-xl font-medium text-black sm:pt-0 "
                      id="headlessui-dialog-title-1753"
                    >
                      Create Folder
                    </h3>
                    <div>
                      <div className="flex w-full flex-1 flex-col undefined">
                        <div className="mb-3 flex flex-1 flex-col justify-between lg:flex-row">
                          <label
                            htmlFor="folder-name"
                            className="text-sm  text-grey-700 !font-light w-100"
                          >
                            Folder Name
                          </label>
                        </div>
                        <div className="w-full">
                          <input
                            placeholder="New Folder"
                            className="dark:text-black flex flex-1 border py-2.5 px-3.5 border-purple-100 focus:outline-none w-full resize-none rounded placeholder-grey-400 shadow-sm focus:border-green-700 focus:ring-0 text-grey-800"
                            type="text"
                            autoComplete="off"
                            id="folder-name"
                            data-hj-allow="true"
                            value={folderName}
                            onChange={handleFolderNameInputChange}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center align-middle">
                        <button
                          tabIndex="0"
                          className="bg-[#334977] text-white focus:outline-none flex select-none items-center rounded py-3 text-[15px] font-medium ring-offset-2 focus:ring- my-4 h-10 w-40 justify-center"
                          onClick={() => {
                            create_folder();
                          }}
                        >
                          <span className="flex-nowrap whitespace-nowrap">
                            Create Folder
                          </span>
                        </button>

                        <button
                          tabIndex="0"
                          onClick={() => {
                            setPopUpModelToCreateFolder(false);
                            setFolderName(null);
                          }}
                        >
                          <span
                            className="text-inherit inline-block text-center ring-offset-2 duration-200 focus:ring-2 cursor-pointer hover:opacity-70 relative opacity-100 self-center"
                            tabIndex="0"
                            role="button"
                          >
                            Cancel
                            <span className="absolute -bottom-0.5 block w-full border-b border-grey-200"></span>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>


                
              </div>
            </div>
          </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Projects;
