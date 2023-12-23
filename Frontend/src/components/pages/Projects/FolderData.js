import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from 'react-router-dom'
import {BACKEND_URL,BACK_END_API_GET_FOLDER_DETAILS,BACK_END_API_PROJECT_CHOOSE,BACK_END_API_PROJECTS,BACK_END_API_DOCUMENTS } from "../../../apis/urls";
import { fetchData,patchData } from "../../../apis/apiService";
import { useLocation } from 'react-router-dom';
import LoadingPage from "../../LoadingPage";
import { useSelector, useDispatch } from "react-redux";
import { _load_screen_ } from "../../../features/LoadingScreen";
import RenderHtml from "../Template/RenderHtml";
import RenderHtmlData from "../Template/RenderHtmlData";
import toast, { Toaster } from 'react-hot-toast';
import ListOfDocument from "../Template/Document/ListOfDocument";


const FolderData = (props) => {

    const navigate=useNavigate()
    const dispatch = useDispatch();
    const popupRef = useRef(null);

    const [ListOrGrid, setListOrGrid] = useState(true);
    const [FolderData,setFolderData] = useState(null)
    const [FolderRenameDiv, setFolderRenameDiv] = useState(false);
    const [RenameTitleDocument,setRenameTitleDocument] = useState(null);
    const [RenameDocumentId,setRenameDocumentId] = useState(null);
    
    const [ChangeFolderDiv, setChangeFolderDiv] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    const [SelectedOptions, setSelectedOptions] = useState(null);
    
    const [showModalForDelete,setshowModalForDelete] = useState(false);
    const [DeleteFolderId,setDeleteFolderId] = useState(null);
  

    const [openPopUpMiniMenu, setopenPopUpMiniMenu] = useState(null);

    const {folder_id} = useParams()


    let ChosenWorkspaceId = useSelector(
        (state) => state.SetChosenWorkspaceId.ChosenWorkspaceId
        );	
    
  const notifyerror = (message) => toast.error(message);
  const notifysuccess = (message) => toast.success(message);


    let loading_page = useSelector(
        (state) => state.SetLoadingScreen.LoadingScreen
      );

    const initial_get_folder_details = async() => {
        const resp = await fetchData(BACKEND_URL+BACK_END_API_GET_FOLDER_DETAILS+folder_id+"/",props.AUTH_TOKEN)
        if(resp.status==200){
            setFolderData(resp.data)

        }else{
            navigate("/")
        }
        
    }

    useEffect(()=>{
        initial_get_folder_details()
    },[])

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
      useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);

    
      const update_doc_title_name = async(id) => {
        let formData = {
          title:RenameTitleDocument
        }
        const resp = await patchData(formData, BACKEND_URL + BACK_END_API_DOCUMENTS + "/" + id + "/", props.AUTH_TOKEN)
        if(resp.status=201){
          initial_get_folder_details()
          notifysuccess("Folder Name updated")
        }else{
          notifyerror("something went wrong")
        }
        setRenameTitleDocument(null)
        setFolderRenameDiv(false)
      }

      const handleDocumentsRenameChange = (event) => {
        setRenameTitleDocument(event.target.value);
      };

      const handleDelete = (detailId) => {
        setFolderData((prevData) => {
          const updatedDetails = prevData.details.filter(
            (detail) => detail.id !== detailId
          );
    
          const updatedData = {
            ...prevData,
            details: updatedDetails,
          };
      
          return updatedData;
        });
        setshowModalForDelete(false)
      };
      
    
      const _update_document_data = async (data, id, message) => {
        handleDelete(id)
        if (popupRef.current) {
            setopenPopUpMiniMenu(null);
        }
        const resp = await patchData(data, BACKEND_URL + BACK_END_API_DOCUMENTS + "/" + id + "/", props.AUTH_TOKEN)
        if (resp.status == 201) {
          notifysuccess(message)
        } else {
          notifyerror("something went wrong")
        }
      }

      const update_folder = async() =>{
        let formData = {
            project_id:selectedValue
          }
          const resp = await patchData(formData, BACKEND_URL + BACK_END_API_DOCUMENTS + "/" + RenameDocumentId + "/", props.AUTH_TOKEN)
          if(resp.status=201){
            initial_get_folder_details()
            notifysuccess("Document Moved")
          }else{
            notifyerror("something went wrong")
          }
        setChangeFolderDiv(false)
      }

      const handleSelectChange = (event) => {
        setSelectedValue(event.target.value);
      };
    
    const get_project_data = async() => {
        if(ChosenWorkspaceId!=null){
            const resp = await fetchData(BACKEND_URL+BACK_END_API_PROJECT_CHOOSE+"?workspace_id="+ChosenWorkspaceId["Workspace_Id"],props.AUTH_TOKEN)
            if(resp.status==200){
                setSelectedOptions(resp.data)
            }
        }
    }

      useEffect(()=>{
        get_project_data()
      },[])

  return (
    <>
    {loading_page
    ?
        <LoadingPage/>   
    :
        <div className="top-0 w-full max-w-full self-start text-black md:pt-0 pt-14 min-h-[calc(100vh-60px)] h-auto" ref={popupRef}>
        <div className="flex flex-1 flex-col ">
            <div className="flex h-full flex-1">
                <div className="flex max-w-full flex-1 flex-col ">
                    <div className="flex flex-1 justify-center px-6 py-8 duration-500  !p-0">
                    <div className="flex w-full flex-1 flex-col  ">
                        <div className="mx-auto flex w-full max-w-screen-xl flex-col px-4 md:px-8 md:pb-40">
                            
                            {/* ====================Folder Name=================== */}
                            <div className="flex items-center justify-between pt-4">
                                <div className="dark:text-white flex items-center justify-start">
                                <p className="dark:text-white font-bold text-[15px] mt-2 cursor-pointer pb-2">
                                <button type='dark:text-white button'
                                onClick={()=>{
                                    navigate("/projects")
                                }}>
                                    Folder
                                </button>
                                </p>
                                <svg width="6" height="9" viewBox="0 0 6 9" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-2 text-grey-600">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M2.57478 0.661057C2.18426 0.270533 1.55109 0.270533 1.16057 0.661057C0.770045 1.05158 0.770045 1.68475 1.16057 2.07527L3.45346 4.36816L1.16057 6.66106C0.770045 7.05158 0.770045 7.68475 1.16057 8.07527C1.55109 8.4658 2.18426 8.4658 2.57478 8.07527L5.57478 5.07527C5.96531 4.68475 5.96531 4.05158 5.57478 3.66106L2.57478 0.661057Z" fill="currentColor"></path>
                                    <path d="M0.86768 7.41488V1.3768L4.02468 4.43587L0.86768 7.41488Z" fill="currentColor"></path>
                                </svg>
                                <p className="text-[15px] font-bold mt-2 flex items-center pb-2">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M6.33637 5.10954L6.93012 6H8.00037H10H12H13C13.5523 6 14 6.44771 14 7V12C14 12.5523 13.5523 13 13 13H3C2.44772 13 2 12.5523 2 12V4C2 3.44772 2.44772 3 3 3H4.39461C4.72894 3 5.04114 3.16707 5.22662 3.44523L6.33637 5.10954ZM12 4H13C14.6569 4 16 5.34315 16 7V12C16 13.6569 14.6569 15 13 15H3C1.34315 15 0 13.6569 0 12V4C0 2.34315 1.34315 1 3 1H4.39461C5.39758 1 6.3342 1.50121 6.89062 2.33568L8.00037 4H10H12Z" fill="currentColor"></path>
                                    </svg>
                                    {
                                        FolderData
                                        ?
                                            <span className="dark:text-white pl-2">{FolderData.project_name}</span>
                                        :
                                            <div className="ml-2 animate-spin rounded-full h-4 w-4 border-t-4 border-blue-500"></div>
                                    }
                                </p>
                                </div>
                                <div className="flex justify-end space-x-2">
                                {/* ==================list grid========================== */}
                                <div className="flex items-center space-x-5 divide-x divide-gray-200 pt-4 md:pt-0">
                        <div className="md:pl-5">
                            <div className="mr-3 flex items-center justify-center space-x-2">
                            <button className={ListOrGrid?" flex aspect-square h-9 w-9 items-center justify-center rounded-md bg-gray-100 px-2 py-1.5 text-gray-400 transition-all duration-150 hover:bg-gray-200 hover:text-gray-500 ":" flex aspect-square h-9 w-9 items-center justify-center rounded-md bg-white px-2 py-1.5 text-gray-400 transition-all duration-150 hover:bg-gray-200 hover:text-gray-500 "}
                                onClick={()=>{
                                setListOrGrid(true)
                                }}
                                >
                                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                <path d="M14.71,12.68c.1-1.5,.14-3.05,.14-4.64,0-.59,0-1.17-.02-1.75H1.16c-.01,.58-.02,1.16-.02,1.75,0,1.59,.05,3.14,.14,4.64,.07,1.09,.94,1.96,2.05,2.03,1.51,.09,3.07,.14,4.67,.14s3.16-.05,4.67-.14c1.1-.07,1.98-.94,2.05-2.03Z" fill="transparent"></path>
                                <path d="M1.16,6.29c-.01,.58-.02,1.17-.02,1.77,0,1.6,.05,3.16,.14,4.67,.07,1.1,.94,1.98,2.05,2.05,1.51,.09,3.07,.14,4.67,.14s3.16-.05,4.67-.14c1.1-.07,1.98-.94,2.05-2.05,.1-1.51,.14-3.07,.14-4.67,0-.59,0-1.18-.02-1.77" fill="none" stroke="#0D121C" strokeWidth="1"></path>
                                <path d="M5.7,6.29V14.73" fill="none" stroke="#0D121C" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M1.18,10.29H14.82" fill="none" stroke="#0D121C" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M14.84,6.29H1.16c.02-1,.06-1.99,.12-2.95,.07-1.1,.94-1.98,2.04-2.05,1.51-.09,3.07-.14,4.67-.14s3.16,.05,4.67,.14c1.1,.07,1.98,.94,2.04,2.05,.06,.96,.1,1.95,.13,2.95Z" fill="none" stroke="#0D121C" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                            </button>
                            <button 
                                className={ListOrGrid?" flex aspect-square h-9 w-9 items-center justify-center rounded-md bg-white px-2 py-1.5 text-gray-400 transition-all duration-150 hover:bg-gray-200 hover:text-gray-500 ":" flex aspect-square h-9 w-9 items-center justify-center rounded-md bg-gray-100 px-2 py-1.5 text-gray-400 transition-all duration-150 hover:bg-gray-200 hover:text-gray-500 "}
                            onClick={()=>{
                                setListOrGrid(false)
                                }}
                            >
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                <path d="M9.66,5.04c.07,.63,.58,1.14,1.21,1.21,.47,.05,.95,.1,1.44,.1s.98-.04,1.45-.1c.63-.07,1.14-.58,1.21-1.21,.05-.47,.09-.95,.09-1.44s-.04-.97-.09-1.44c-.07-.63-.58-1.14-1.21-1.21-.47-.05-.95-.1-1.45-.1s-.97,.04-1.44,.1c-.63,.07-1.14,.58-1.21,1.21-.05,.47-.09,.95-.09,1.44s.04,.97,.09,1.44Z" fill="none" stroke="#0D121C" strokeWidth="1"></path>
                                <path d="M1.03,5.04c.07,.63,.58,1.14,1.21,1.21,.47,.05,.95,.1,1.45,.1s.97-.04,1.44-.1c.63-.07,1.14-.58,1.21-1.21,.05-.47,.09-.95,.09-1.44s-.04-.97-.09-1.44c-.07-.63-.58-1.14-1.21-1.21-.47-.05-.95-.1-1.44-.1s-.98,.04-1.45,.1c-.63,.07-1.14,.58-1.21,1.21-.05,.47-.09,.95-.09,1.44s.04,.97,.09,1.44Z" fill="none" stroke="#0D121C" strokeWidth="1"></path>
                                <path d="M1.03,13.83c.07,.63,.58,1.14,1.21,1.21,.47,.05,.95,.1,1.45,.1s.97-.04,1.44-.1c.63-.07,1.14-.58,1.21-1.21,.05-.47,.09-.95,.09-1.44s-.04-.97-.09-1.44c-.07-.63-.58-1.14-1.21-1.21-.47-.05-.95-.1-1.44-.1s-.98,.04-1.45,.1c-.63,.07-1.14,.58-1.21,1.21-.05,.47-.09,.95-.09,1.44s.04,.97,.09,1.44Z" fill="none" stroke="#0D121C" strokeWidth="1"></path>
                                <path d="M9.66,13.83c.07,.63,.58,1.14,1.21,1.21,.47,.05,.95,.1,1.44,.1s.98-.04,1.45-.1c.63-.07,1.14-.58,1.21-1.21,.05-.47,.09-.95,.09-1.44s-.04-.97-.09-1.44c-.07-.63-.58-1.14-1.21-1.21-.47-.05-.95-.1-1.45-.1s-.97,.04-1.44,.1c-.63,.07-1.14,.58-1.21,1.21-.05,.47-.09,.95-.09,1.44s.04,.97,.09,1.44Z" fill="none" stroke="#0D121C" strokeWidth="1"></path>
                            </svg>
                            </button>
                            </div>
                        </div>
                                </div>
                                {/* ==================list grid========================== */}
                                {/* <div className="h-8 grid grid-cols-2 items-center">
                                    <div className="px-1">
                                        <button aria-label="View select" tabIndex="0" className="focus:outline-none flex select-none items-center rounded py-3 text-xs font-medium ring-offset-2 hover:bg-grey-100 border-purple-100 text-blue-900 justify-center border !text-xs shadow-sm focus:ring-2 focus:ring-black border-none !py-0 !px-0 !mr-0 h-6 w-6 bg-grey-100 text-opacity-100 px-3">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-grey-600">
                                            <g clipPath="url(#clip0_34_231)">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M3 2H5C5.55228 2 6 2.44772 6 3V4C6 4.55228 5.55228 5 5 5H3C2.44772 5 2 4.55228 2 4V3C2 2.44772 2.44772 2 3 2ZM5 0H3C1.34315 0 0 1.34315 0 3V4C0 5.65685 1.34315 7 3 7H5C6.65685 7 8 5.65685 8 4V3C8 1.34315 6.65685 0 5 0ZM10 3.5C10 2.94772 10.4477 2.5 11 2.5H15C15.5523 2.5 16 2.94772 16 3.5C16 4.05228 15.5523 4.5 15 4.5H11C10.4477 4.5 10 4.05228 10 3.5ZM3 11H5C5.55228 11 6 11.4477 6 12V13C6 13.5523 5.55228 14 5 14H3C2.44772 14 2 13.5523 2 13V12C2 11.4477 2.44772 11 3 11ZM5 9H3C1.34315 9 0 10.3431 0 12V13C0 14.6569 1.34315 16 3 16H5C6.65685 16 8 14.6569 8 13V12C8 10.3431 6.65685 9 5 9ZM11 11.5C10.4477 11.5 10 11.9477 10 12.5C10 13.0523 10.4477 13.5 11 13.5H15C15.5523 13.5 16 13.0523 16 12.5C16 11.9477 15.5523 11.5 15 11.5H11Z" fill="currentColor"></path>
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_34_231">
                                                    <rect width="16" height="16" fill="white"></rect>
                                                </clipPath>
                                            </defs>
                                            </svg>
                                        </button>
                                    </div>
                                    <button aria-label="View select" tabIndex="0" className="focus:outline-none flex select-none items-center rounded py-3 text-xs font-medium ring-offset-2 bg-white hover:bg-grey-100 border-purple-100 text-blue-900 justify-center border !text-xs shadow-sm focus:ring-2 focus:ring-black border-none !py-0 !px-0 !ml-0 !pt-0.5 h-6 w-6 !bg-grey-600 text-opacity-100 px-3">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-grey-600 !text-black">
                                            <g clipPath="url(#clip0_34_268)">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M13 0H12C10.3431 0 9 1.34315 9 3V4C9 5.65685 10.3431 7 12 7H13C14.6569 7 16 5.65685 16 4V3C16 1.34315 14.6569 0 13 0ZM3 9H4C5.65685 9 7 10.3431 7 12V13C7 14.6569 5.65685 16 4 16H3C1.34315 16 0 14.6569 0 13V12C0 10.3431 1.34315 9 3 9ZM12 9H13C14.6569 9 16 10.3431 16 12V13C16 14.6569 14.6569 16 13 16H12C10.3431 16 9 14.6569 9 13V12C9 10.3431 10.3431 9 12 9ZM3 0H4C5.65685 0 7 1.34315 7 3V4C7 5.65685 5.65685 7 4 7H3C1.34315 7 0 5.65685 0 4V3C0 1.34315 1.34315 0 3 0Z" fill="currentColor"></path>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_34_268">
                                                <rect width="16" height="16" fill="white"></rect>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </button>
                                </div> */}
                                <div className="hidden md:flex">
                                    <span>
                                        <div className="relative inline-block text-left w-full">
                                            <div>
                                            <select
                                                name=""
                                                id=""
                                                className="w-full h-8 text-sm font-bold border border-border rounded-md bg-white px-8 py-1"
                                            >
                                                <option>Last Modified</option>
                                            </select>
                                            </div>
                                        </div>
                                    </span>
                                </div>
                                </div>
                            </div>
                            {/* ====================================================== */}
                                
                            {/* ============Folder List ===================== */}
                                {FolderData &&
                                    <>
                                    {ListOrGrid
                                        ?
                                        <>
                                        <div className=" mt-6 items-start grid max-w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {FolderData.details.length>0
                                        ?
                                            <>
                                                {FolderData.details.map((data,index)=>{
                                                    return (
                                                            <div  key={index} className="dark:bg-gray-700 dark:text-white dark:border-slate-500 group flex h-74 flex-1 flex-col overflow-hidden rounded-xl border shadow-sm transition-top duration-200 hover:-top-1
                                                            border-purple-100 bg-white">
                                                            <div className="tooltip-container" title={"Open "+data.title+" Document"}
                                                                onClick={()=>{
                                                                    navigate(`/template_data/${data.id}?template_editing=edit_by_user&template_used=redirect_from_doc_page`)
                                                                }}
                                                            >
                                                                <div className=" flex flex-1  cursor-pointer  min-h-full items-center">
                                                                    <div className="p-2  pt-2  grow w-full"><span className="flex flex-1 outline-none max-w-full rounded-md border-none text-md cursor-pointer focus:ring-0 p-2 line-clamp-3" data-testid="project-title-field">
                                                                        {data.title}
                                                                    </span>
                                                                    </div>
                                                                        {/* <div className="grow-0 p-4 pt-3 h-24 items-top">
                                                                            <div className="flex p-2 cursor-pointer items-center justify-center text-grey-300 hover:text-green-600">
                                                                                <div className="w-4 h-4 rounded border-2 border-grey-300 hover:border-green-600">
                                                                                    
                                                                                </div>
                                                                            </div>
                                                                        </div> */}
                                                                </div>
                                                                <div className="dark:bg-gray-700 dark:text-white dark:border-slate-500 h-20 text-[8px] bg-white cursor-pointer rounded-xl px-3 grow break-words space-y-2 overflow-hidden">
                                                                    <RenderHtml htmldata={data.document_content}/>
                                                                </div>
                                                                {/* <span className="tooltip-text">Open {data.title} Document</span> */}
                                                            </div>
                                                            
                                                            <div className="flex flex-1">
                                                                <div className="grid grid-cols-1 p-4 w-full" >
                                                                    <div className="text-xs text-grey-700  whitespace-nowrap flex items-center">
                                                                        {/* <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-3 w-3 text-grey-600">
                                                                        <g clipPath="url(#clip0_780_1679)">
                                                                            <path fillRule="evenodd" clipRule="evenodd" d="M3.75 0C4.16421 0 4.5 0.335786 4.5 0.75V1.5H7.5V0.75C7.5 0.335786 7.83579 0 8.25 0C8.66421 0 9 0.335786 9 0.75V1.5H10C11.1046 1.5 12 2.39543 12 3.5V10C12 11.1046 11.1046 12 10 12H2C0.895431 12 0 11.1046 0 10V3.5C0 2.39543 0.895431 1.5 2 1.5H3V0.75C3 0.335786 3.33579 0 3.75 0ZM7.5 3V4.25C7.5 4.66421 7.83579 5 8.25 5C8.66421 5 9 4.66421 9 4.25V3H10C10.2761 3 10.5 3.22386 10.5 3.5V10C10.5 10.2761 10.2761 10.5 10 10.5H2C1.72386 10.5 1.5 10.2761 1.5 10V3.5C1.5 3.22386 1.72386 3 2 3H3V4.25C3 4.66421 3.33579 5 3.75 5C4.16421 5 4.5 4.66421 4.5 4.25V3H7.5Z" fill="currentColor"></path>
                                                                        </g>
                                                                        <defs>
                                                                            <clipPath id="clip0_780_1679">
                                                                                <rect width="12" height="12" fill="white"></rect>
                                                                            </clipPath>
                                                                        </defs>
                                                                        </svg> */}
                                                                        <span>updated at : {data.updated_at}</span>
                                                                    </div>
                                                                    {/* <div className="text-xs text-grey-700">
                                                                        <div className="flex">
                                                                        <span className="mr-1.5 grid content-center">
                                                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-grey-600">
                                                                                <path fillRule="evenodd" clipRule="evenodd" d="M6.99998 2.5C6.99998 3.05228 6.55227 3.5 5.99998 3.5C5.4477 3.5 4.99998 3.05228 4.99998 2.5C4.99998 1.94772 5.4477 1.5 5.99998 1.5C6.55227 1.5 6.99998 1.94772 6.99998 2.5ZM8.49998 2.5C8.49998 3.88071 7.3807 5 5.99998 5C4.61927 5 3.49998 3.88071 3.49998 2.5C3.49998 1.11929 4.61927 0 5.99998 0C7.3807 0 8.49998 1.11929 8.49998 2.5ZM5.26614 7.5H6.73383C7.7218 7.5 8.6171 8.08183 9.01835 8.98465L9.37937 9.79693C9.52632 10.1276 9.28429 10.5 8.92246 10.5H3.07751C2.71568 10.5 2.47365 10.1276 2.6206 9.79693L2.98161 8.98465C3.38287 8.08183 4.27817 7.5 5.26614 7.5ZM1.6109 8.37545C2.2529 6.93093 3.68539 6 5.26614 6H6.73383C8.31458 6 9.74707 6.93093 10.3891 8.37545L10.7501 9.18772C11.3379 10.5103 10.3698 12 8.92246 12H3.07751C1.63019 12 0.662075 10.5103 1.24989 9.18772L1.6109 8.37545Z" fill="currentColor"></path>
                                                                            </svg>
                                                                        </span>
                                                                        Private
                                                                        </div>
                                                                    </div> */}
                                                                </div>
                                                                <div className="relative">
                                                                <button className="flex cursor-pointer items-center justify-center p-3 text-grey-600 h-full pr-6" id="headlessui-menu-button-1994" type="button" aria-haspopup="true" aria-expanded="false"
                                                                    onClick={() => handlePopUpMenu(index)}>
                                                                        <span className="sr-only" data-testid="more-button">Open options</span>
                                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path fillRule="evenodd" clipRule="evenodd" d="M4 8C4 9.10457 3.10457 10 2 10C0.895431 10 0 9.10457 0 8C0 6.89543 0.895431 6 2 6C3.10457 6 4 6.89543 4 8ZM16 8C16 9.10457 15.1046 10 14 10C12.8954 10 12 9.10457 12 8C12 6.89543 12.8954 6 14 6C15.1046 6 16 6.89543 16 8ZM8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" fill="#6C8D9D"></path>
                                                                        </svg>
                                                                    </button>
                                                                {/* =============menu mini list=============== */}
                                                                {openPopUpMiniMenu === index && (
                                                                <div className="ml-5 shadow-lg" ref={popupRef}>
                                                                    <div className="dark:bg-gray-600 dark:text-white  dark:border-slate-500 right-2 bottom-2 absolute mt-2 origin-top-right w-52 focus:outline-none z-50 overflow-hidden rounded-md border border-purple-100 bg-white shadow-overlay" role="menu" tabIndex="0">
                                                                    <div role="none">
                                                                        <div className="!pb-1 text-grey-600 flex flex-1  cursor-pointer items-center px-4 py-2 text-xs font-medium"  role="menuitem" tabIndex="-1">
                                                                        </div>
                                                                        <div className="text-grey-600 flex flex-1 cursor-pointer items-center px-4 py-2 text-xs font-medium" role="menuitem" tabIndex="-1">
                                                                            <button className="flex hover:bg-gray-100 dark:hover:bg-slate-600 active:bg-blue-100" role="none"
                                                                            type="button"
                                                                            onClick={()=>{
                                                                                setFolderRenameDiv(true)
                                                                                setRenameTitleDocument(data.title)
                                                                                setRenameDocumentId(data.id)
                                                                                if (popupRef.current) {
                                                                                setopenPopUpMiniMenu(null);
                                                                                }
                                                                            }}>
                                                                        
                                                                            <span role="none mr-1">Rename</span>
                                                                            </button>
                                                                        </div>
                                                                        <div className="text-grey-600 flex flex-1 cursor-pointer items-center px-4 py-2 text-xs font-medium" id="headlessui-menu-item-396" role="menuitem" tabIndex="-1">
                                                                        <button type="button" 
                                                                            className="flex hover:bg-gray-100 active:bg-blue-100 dark:hover:bg-slate-600" role="none"
                                                                        onClick={()=>{
                                                                                setChangeFolderDiv(true)
                                                                                setRenameDocumentId(data.id)
                                                                                if (popupRef.current) {
                                                                                    setopenPopUpMiniMenu(null);
                                                                                }
                                                                        }}>
                                                                            <span>
                                                                                Move to Folder
                                                                            </span>
                                                                        </button>
                                                                        </div>
                                                                        <div className="border-t border-grey-300  text-grey-600 flex flex-1 cursor-pointer items-center px-4 py-2 text-xs font-medium" id="headlessui-menu-item-397" role="menuitem" tabIndex="-1">
                                                                        <button type="button" 
                                                                            className="flex hover:bg-gray-100 active:bg-blue-100 dark:hover:bg-slate-600" role="none"
                                                                        onClick={()=>{
                                                                            setshowModalForDelete(true)
                                                                            setDeleteFolderId(data.id)
                                                                            if (popupRef.current) {
                                                                                setopenPopUpMiniMenu(null);
                                                                            }
                                                                        }}>
                                                                            <span>
                                                                                Delete
                                                                            </span>
                                                                        </button>
                                                                        </div>
                                                                    </div>
                                                                    </div>
                                                                </div>
                                                                )}
                                                                {/* =============menu mini list=============== */}
                                                                    
                                                                </div>
                                                            </div>
                                                            </div>
                                                    )
                                                })
                                                }
                                            </>
                                        :
                                                <div className="flex justify-center items-center">
                                                    <p className="dark:text-white font-bold text-[20px]">You don't have any projects in this folder yet!</p>
                                                </div>
                                        }
                                        </div>
                                        </>
                                    :
                                    <>
                                    {FolderData.details.length>0
                                    ?
                                    <>
                                        {FolderData.details.map((data,index)=>{
                                            return (
                                                <div key={index} className=" mt-6 items-start flex flex-col divide-y divide-purple-100 rounded border border-purple-100">
                                                <div className="dark:bg-gray-800 dark:text-gray-200 dark:border-slate-500 group relative flex w-full cursor-pointer items-center transition-none border-purple-100 bg-white">
                                                    <div className="flex cursor-text border-purple-100">       
                                                        <div className="pl-3 p-2"><span className="flex flex-1 outline-none max-w-full rounded-md border-none text-md cursor-pointer focus:ring-0 p-2 line-clamp-1" data-testid="project-title-field">
                                                        {data.title}
                                                        </span></div>
                                                    </div>
                                                    <button className="flex h-full flex-1 items-center p-0"
                                                    title={"Open "+data.title+" Document"}
                                                    onClick={()=>{
                                                        navigate(`/template_data/${data.id}?template_editing=edit_by_user&template_used=redirect_from_doc_page`)
                                                    }}></button>
                                                    <div className="flex items-center justify-end p-2">
                                                        <div className="text-xs text-grey-700 overflow-hidden overflow-ellipsis whitespace-nowrap hidden sm:flex items-center">
                                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-3 w-3 text-grey-600">
                                                            <g clipPath="url(#clip0_780_1679)">
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M3.75 0C4.16421 0 4.5 0.335786 4.5 0.75V1.5H7.5V0.75C7.5 0.335786 7.83579 0 8.25 0C8.66421 0 9 0.335786 9 0.75V1.5H10C11.1046 1.5 12 2.39543 12 3.5V10C12 11.1046 11.1046 12 10 12H2C0.895431 12 0 11.1046 0 10V3.5C0 2.39543 0.895431 1.5 2 1.5H3V0.75C3 0.335786 3.33579 0 3.75 0ZM7.5 3V4.25C7.5 4.66421 7.83579 5 8.25 5C8.66421 5 9 4.66421 9 4.25V3H10C10.2761 3 10.5 3.22386 10.5 3.5V10C10.5 10.2761 10.2761 10.5 10 10.5H2C1.72386 10.5 1.5 10.2761 1.5 10V3.5C1.5 3.22386 1.72386 3 2 3H3V4.25C3 4.66421 3.33579 5 3.75 5C4.16421 5 4.5 4.66421 4.5 4.25V3H7.5Z" fill="currentColor"></path>
                                                            </g>
                                                            <defs>
                                                                <clipPath id="clip0_780_1679">
                                                                    <rect width="12" height="12" fill="white"></rect>
                                                                </clipPath>
                                                            </defs>
                                                        </svg>
                                                        <span>{data.updated_at}</span>
                                                        </div>
                                                        {/* <div className="text-xs text-grey-700 ml-4 mr-4 hidden sm:block">
                                                        <div className="flex">
                                                            <span className="mr-1.5 grid content-center">
                                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-grey-600">
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M6.99998 2.5C6.99998 3.05228 6.55227 3.5 5.99998 3.5C5.4477 3.5 4.99998 3.05228 4.99998 2.5C4.99998 1.94772 5.4477 1.5 5.99998 1.5C6.55227 1.5 6.99998 1.94772 6.99998 2.5ZM8.49998 2.5C8.49998 3.88071 7.3807 5 5.99998 5C4.61927 5 3.49998 3.88071 3.49998 2.5C3.49998 1.11929 4.61927 0 5.99998 0C7.3807 0 8.49998 1.11929 8.49998 2.5ZM5.26614 7.5H6.73383C7.7218 7.5 8.6171 8.08183 9.01835 8.98465L9.37937 9.79693C9.52632 10.1276 9.28429 10.5 8.92246 10.5H3.07751C2.71568 10.5 2.47365 10.1276 2.6206 9.79693L2.98161 8.98465C3.38287 8.08183 4.27817 7.5 5.26614 7.5ZM1.6109 8.37545C2.2529 6.93093 3.68539 6 5.26614 6H6.73383C8.31458 6 9.74707 6.93093 10.3891 8.37545L10.7501 9.18772C11.3379 10.5103 10.3698 12 8.92246 12H3.07751C1.63019 12 0.662075 10.5103 1.24989 9.18772L1.6109 8.37545Z" fill="currentColor"></path>
                                                                </svg>
                                                            </span>
                                                            Private
                                                        </div>
                                                        </div> */}
                                                        <div className="relative flex">
                                                        <button className="flex cursor-pointer items-center justify-center p-3 text-grey-600 h-full pr-6 rounded-xl" id="headlessui-menu-button-671" type="button" aria-haspopup="true" aria-expanded="false"
                                                        onClick={() => handlePopUpMenu(index)}
                                                        >
                                                            <span className="sr-only" data-testid="more-button">Open options</span>
                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M4 8C4 9.10457 3.10457 10 2 10C0.895431 10 0 9.10457 0 8C0 6.89543 0.895431 6 2 6C3.10457 6 4 6.89543 4 8ZM16 8C16 9.10457 15.1046 10 14 10C12.8954 10 12 9.10457 12 8C12 6.89543 12.8954 6 14 6C15.1046 6 16 6.89543 16 8ZM8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" fill="#6C8D9D"></path>
                                                            </svg>
                                                        </button>
                                                            {/* =============menu mini list=============== */}
                                                            {openPopUpMiniMenu === index && (
                                                                <div className="ml-5 shadow-lg" ref={popupRef}>
                                                                    <div className=" right-2 bottom-2 absolute mt-2 origin-top-right w-52 focus:outline-none z-50 overflow-hidden rounded-md border border-purple-100 bg-white shadow-overlay" aria-labelledby="headlessui-menu-button-386" id="headlessui-menu-items-391" role="menu" tabIndex="0">
                                                                    <div role="none">
                                                                        <div className="dark:bg-gray-800 dark:text-white !pb-1 text-grey-600 flex flex-1 cursor-pointer items-center px-4 py-2 text-xs font-medium" id="headlessui-menu-item-392" role="menuitem" tabIndex="-1">
                                                                        </div>
                                                                        <div className="dark:bg-gray-800 dark:text-white text-grey-600 flex flex-1 cursor-pointer items-center px-4 py-2 text-xs font-medium" id="headlessui-menu-item-395" role="menuitem" tabIndex="-1">
                                                                            <button className="flex dark:hover:bg-gray-800 hover:bg-gray-100 active:bg-blue-100" role="none"
                                                                            type="button"
                                                                            onClick={()=>{
                                                                                setFolderRenameDiv(true)
                                                                                setRenameTitleDocument(data.title)
                                                                                setRenameDocumentId(data.id)
                                                                                if (popupRef.current) {
                                                                                setopenPopUpMiniMenu(null);
                                                                                }
                                                                            }}>
                                                                        
                                                                            <span role="none mr-1 dark:text-white">Rename</span>
                                                                            </button>
                                                                        </div>
                                                                        <div className="dark:bg-gray-800 dark:text-white text-grey-600 flex flex-1 cursor-pointer items-center px-4 py-2 text-xs font-medium" id="headlessui-menu-item-396" role="menuitem" tabIndex="-1">
                                                                        <button type="button" 
                                                                            className="flex dark:hover:bg-gray-800 hover:bg-gray-100 active:bg-blue-100" role="none"
                                                                        onClick={()=>{
                                                                                setChangeFolderDiv(true)
                                                                                setRenameDocumentId(data.id)
                                                                                if (popupRef.current) {
                                                                                    setopenPopUpMiniMenu(null);
                                                                                }
                                                                        }}>
                                                                            <span className="dark:text-white">
                                                                                Move to Folder
                                                                            </span>
                                                                        </button>
                                                                        </div>
                                                                        <div className="dark:bg-gray-800 dark:text-white border-t border-grey-300  text-grey-600 flex flex-1 cursor-pointer items-center px-4 py-2 text-xs font-medium" id="headlessui-menu-item-397" role="menuitem" tabIndex="-1">
                                                                        <button type="button" 
                                                                            className="flex dark:hover:bg-gray-800 hover:bg-gray-100 active:bg-blue-100 " role="none"
                                                                        onClick={()=>{
                                                                            setshowModalForDelete(true)
                                                                            setDeleteFolderId(data.id)
                                                                            if (popupRef.current) {
                                                                                setopenPopUpMiniMenu(null);
                                                                            }
                                                                        }}>
                                                                            <span className="dark:text-white">
                                                                                Delete
                                                                            </span>
                                                                        </button>
                                                                        </div>
                                                                    </div>
                                                                    </div>
                                                                </div>
                                                                )}
                                                                {/* =============menu mini list=============== */}

                                                        </div>
                                                    </div>
                                                </div>
                                                </div>
                                            )
                                        })}
                                    </>
                                    :
                                        <div className="flex justify-center items-center">
                                            <p className="font-bold text-[20px]">You don't have any projects in this folder yet!</p>
                                        </div>
                                    }
                                    </>
                                    }
                                    </>
                                }
                            {/* ============================================= */}
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        {FolderRenameDiv
            ?
            <>
            <div className="fixed inset-0 z-40 overflow-y-auto" id="headlessui-dialog-:rdn:" role="dialog" aria-modal="true" data-headlessui-state="open">
                <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-50" id="headlessui-dialog-overlay-:rdo:" aria-hidden="true" data-headlessui-state="open"></div>
                <div className="relative h-full bg-white text-gray-900 rounded-md shadow-xl align-top sm:align-middle w-full sm:w-[416px]">
                    <div className="dark:bg-gray-800  dark:border-slate-500 w-full text-left flex justify-between items-center p-6 text-gray-900  border-b border-gray-200">
                    <h3 className="text-lg font-semibold dark:text-white">Rename Folder</h3>
                    </div>
                    <div className="dark:bg-gray-800 flex flex-col p-6">
                        <div className="p-6">
                        <div className="space-y-1.5 w-full">
                            <label htmlFor="rename-title" className="sr-only"><span className="flex items-center space-x-1"><span className="dark:text-white">Rename document</span></span></label>
                            <div className="py-1 !mt-0 flex items-center gap-2 bg-white w-full px-3 rounded-lg ring-1 hover:ring-2 transition-all duration-150 ease-in-out ring-gray-200 outline-none focus-within:!ring-1">
                            <div className="flex items-center grow gap-2 py-1.5">
                                <div className="flex gap-1 grow">
                                <input
                                    value={RenameTitleDocument} onChange={handleDocumentsRenameChange}
                                    id="rename-document" type="text" className="block w-full text-gray-900 placeholder:text-gray-400 text-sm font-normal resize-none outline-none" placeholder="Document name" name="name" />
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                        <div className="p-6 flex items-center gap-4 justify-end"><button
                        onClick={() => {
                            setFolderRenameDiv(false)
                            setRenameTitleDocument(null)
                        }} type="button" className="transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-2 active:ring-1"><span className="flex items-center justify-center mx-auto space-x-2 select-none">
                        Cancel</span></button>
                        <button
                            onClick={()=>{
                            update_doc_title_name(RenameDocumentId)
                            if (popupRef.current) {
                                setopenPopUpMiniMenu(null);
                                }
                            }}
                            
                            type="button" className="transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm bg-blue-600 text-white ring-0 ring-blue-600 hover:ring-2 active:ring-0"><span className="flex items-center justify-center mx-auto space-x-2 select-none">
                            Save</span></button></div>
                    
                    </div>
                </div>
                </div>
            </div>
            </>
            :
            null
        }
        {ChangeFolderDiv
            ?
            <>
            <div className="fixed inset-0 z-40 overflow-y-auto" id="headlessui-dialog-:rdn:" role="dialog" aria-modal="true" data-headlessui-state="open">
                <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-50" id="headlessui-dialog-overlay-:rdo:" aria-hidden="true" data-headlessui-state="open"></div>
                <div className="relative h-full bg-white text-gray-900 rounded-md shadow-xl align-top sm:align-middle w-full sm:w-[416px]">
                    <div className="dark:bg-gray-700 dark:text-gray-200 dark:border-slate-500 w-full text-left flex justify-between items-center p-6 text-gray-900  border-b border-gray-200">
                    <h3 className="text-lg font-semibold dark:text-white">Move to folder</h3>
                    </div>
                    <div className="flex flex-col p-6 dark:bg-gray-700">
                        <div className="p-6">
                        <div className="space-y-1.5 w-full">
                                <div className="relative inline-block text-left w-full ">
                                    {/* ============select field================= */}
                                        <select
                                            className="p-1 ring-1 font-semibold ring-gray-200 w-[200px] text-left space-y-3 hover:ring-gray-300 active:ring-gray-400"
                                            id="selectField"
                                            value={selectedValue}
                                            onChange={handleSelectChange}
                                        >
                                            <option value="" className="text-black">choose your folder ...</option>
                                            
                                            {SelectedOptions &&
                                                SelectedOptions.map((data,index)=>{
                                                    return (
                                                        <option key={index} value={data.value}>{data.label}</option>
                                                    )
                                                })
                                            }
                                            
                                        </select>
                                    {/* ========================================= */}
                                </div>
                        </div>
                        </div>
                        <div className="p-6 flex items-center gap-4 justify-end "><button
                        onClick={() => {
                            setChangeFolderDiv(false)
                        }} type="button" className="dark:bg-gray-600  dark:text-white transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-2 active:ring-1"><span className="flex items-center justify-center mx-auto space-x-2 select-none">
                        Cancel</span></button>
                        <button
                            onClick={()=>{
                            update_folder()
                            if (popupRef.current) {
                                setopenPopUpMiniMenu(null);
                                }
                            }}
                            
                            type="button" className="transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm bg-blue-600 text-white ring-0 ring-blue-600 hover:ring-2 active:ring-0"><span className="flex items-center justify-center mx-auto space-x-2 select-none">
                            Save</span></button></div>
                    
                    </div>
                </div>
                </div>
            </div>
            </>
            :
            null
        }


        {showModalForDelete ? (
                <>
                    <div className="fixed inset-0 z-10 overflow-y-auto backdrop-blur-sm backdrop-filter bg-opacity-20">
                        <div
                            className="fixed inset-0 w-full h-full"
                            onClick={() => setshowModalForDelete(false)}
                        ></div>
                        <div className="flex items-center min-h-screen px-4 py-8">
                            <div className="dark:bg-gray-800 dark:text-gray-200 dark:border-slate-500 relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
                                <div className="mt-3 sm:flex flex items-center justify-center">
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
                                        <h4 className="text-2xl font-medium text-red-500 m-3 dark:text-white">
                                             Are you sure want to Delete ??
                                        </h4>
                                        <div className="items-center gap-2 mt-3 sm:flex">
                                            <button
                                                className="w-full mt-2 p-2.5 flex-1 text-white bg-red-600 rounded-md outline-none ring-offset-2 ring-red-600 focus:ring-2"
                                                onClick={() =>{
                                                  const formData = {
                                                    trash: true
                                                  }
                                                  _update_document_data(formData, DeleteFolderId, "Moved to trash")
                                                }}
                                            >
                                                Delete
                                            </button>
                                            <button
                                                className="dark:text-white w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-indigo-600 focus:ring-2"
                                                onClick={() =>{
                                                    setshowModalForDelete(false)
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
            {/* <Toaster/> */}
        </div>
    }
    </>
  )
}

export default FolderData