import React, { useState, useEffect, useRef } from "react";

import { BACKEND_URL, BACK_END_API_FAV, BACK_END_API_DELETE_PERMANENTLY_DOCUMENTS,BACK_END_API_DOWNLOAD_FILE, BACK_END_MULTIPLE_SELECT_FOR_TRASH, BACK_END_MULTIPLE_SELECT_FOR_UPDATE_PROJECT_ID, BACK_END_MULTIPLE_SELECT_FOR_TRASH_PERMANENTLY_DELETE, BACK_END_API_DOCUMENTS, BACK_END_API_PROJECT_CHOOSE, BACK_END_API_DOCUMENTS_PATCH } from "../../../../apis/urls";
import { fetchData, patchData, postData } from "../../../../apis/apiService";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import RenderHtml from "../RenderHtml";
import LoadingPage from "../../../LoadingPage";
import { useSelector, useDispatch } from "react-redux";
import { _fav_data_ } from "../../../../features/Favorite";

import { _save_doc_data_ } from "../../../../features/DocumentsData";
import DocumentsIcons from "../../../Icons/DocumentsIcons";

import SelectOptionsTemplate from "../SelectOptionsTemplate/SelectOptions";
import ThreeDotsIcon from "../../../Icons/ThreeDotsIcon";
import DangerIcon from "../../../Icons/DangerIcon";
import './style.css'
import ListDocIconFirst from "../../../Icons/ListDocIconFirst";
import ListIconSecond from "../../../Icons/ListIconSecond";

import { setDocumentTitle } from '../../../NavBar/DynamicTitle';

const ListOfDocument = (props) => {



  const navigate = useNavigate();
  const popupRef = useRef(null);
  const dispatch = useDispatch();


  useEffect(() => {

    if(props.SHOW=="trash"){
      setDocumentTitle("Trash Added");
    }

    if(props.SHOW=="active"){
      setDocumentTitle("Recently Added");
    }

    if(props.DASHBOARD==true){
      setDocumentTitle("Dashboard");
    }

  });


  const [ListOrGrid, setListOrGrid] = useState(true);
  const [openPopupIndex, setOpenPopupIndex] = useState(null);
  const [documentData, setdocumentData] = useState(null);
  const [RenameDiv, setRenameDiv] = useState(false);
  const [RenameId, setRenameId] = useState(null);
  const [inputText, setInputText] = useState("");
  const [LoadingData, setLoadingData] = useState(true);
  const [searchText, setSearchText] = useState('');


  const [totalPages, settotalPages] = useState(2);
  const [pagesToShow, setpagesToShow] = useState(5);
  const [showpagination, setshowpagination] = useState(false);


  const [ActiveOrTrash, setActiveOrTrash] = useState(null);


  const [RenameDocumentId, setRenameDocumentId] = useState(null);
  const [ChangeFolderDiv, setChangeFolderDiv] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [SelectedOptions, setSelectedOptions] = useState(null);


  const [showModalForDelete, setshowModalForDelete] = useState(false);
  const [showModalForPermanentlyDelete, setshowModalForPermanentlyDelete] = useState(false);
  const [DeleteFolderId, setDeleteFolderId] = useState(null);

  const [DownloadLoader, setDownloadLoader] = useState(false);


  const notifyerror = (message) => toast.error(message);
  const notifysuccess = (message) => toast.success(message);

  let FolderDataState = useSelector(
    (state) => state.SetFolderData.FolderData
  );

  let ChosenWorkspaceId = useSelector(
    (state) => state.SetChosenWorkspaceId.ChosenWorkspaceId
  );

  const get_all_user_doc = async (chosen_workspace) => {
    // const chosen_workspace=localStorage.getItem('chose_workspace')
    if (props.SHOW == "trash") {

      const resp = await fetchData(BACKEND_URL + BACK_END_API_DOCUMENTS_PATCH + "/?page=" + currentPage + "&workspace=" + ChosenWorkspaceId["Workspace_Id"], props.AUTH_TOKEN)
      if (resp.status == 200) {
        setdocumentData(resp.data.results)
      } else {
        // notifyerror("something went wrong")
      }
    }
    if (props.SHOW == "active" || props.ShowDashboard == true) {

      const resp = await fetchData(BACKEND_URL + BACK_END_API_DOCUMENTS + "/?page=" + currentPage + "&workspace=" + ChosenWorkspaceId["Workspace_Id"], props.AUTH_TOKEN)
      if (resp.status == 200) {
        setdocumentData(resp.data.results)
      } else {
        // notifyerror("something went wrong")
      }
    }

  }
  const initial_get_all_user_doc = async (chosen_workspace) => {
    // const chosen_workspace=localStorage.getItem('chose_workspace')
    setLoadingData(true)
    if (props.SHOW == "trash") {
      if (ChosenWorkspaceId != null) {
        const resp = await fetchData(BACKEND_URL + BACK_END_API_DOCUMENTS_PATCH + "/?page=" + currentPage + "&workspace=" + ChosenWorkspaceId["Workspace_Id"], props.AUTH_TOKEN)
        if (resp.status == 200) {
          setdocumentData(resp.data.results)
          settotalPages(Math.ceil(resp.data.count / 20))
          if (resp.data.count > 0) {
            setshowpagination(true)
          }

        } else {
          // notifyerror("something went wrong")
        }
      }

    }
    if (props.SHOW == "active" || props.ShowDashboard == true) {

      if (ChosenWorkspaceId != null) {

        const resp = await fetchData(BACKEND_URL + BACK_END_API_DOCUMENTS + "/?page=" + currentPage + "&workspace=" + ChosenWorkspaceId["Workspace_Id"], props.AUTH_TOKEN)
        if (resp.status == 200) {
          setdocumentData(resp.data.results)
          settotalPages(Math.ceil(resp.data.count / 20))
          if (resp.data.count > 0) {
            setshowpagination(true)
          }

        } else {
          // notifyerror("something went wrong")
        }
      }

    }

    setLoadingData(false)
  }


  const handleDelete = (id) => {
    setdocumentData((prevDocuments) =>
      prevDocuments.filter((document) => document.id !== id)
    );
    setshowModalForDelete(false)
  };

  const _update_document_data = async (data, id, message) => {

    handleDelete(id)
    if (popupRef.current) {
      setOpenPopupIndex(null);
    }
    const resp = await patchData(data, BACKEND_URL + BACK_END_API_DOCUMENTS + "/" + id + "/", props.AUTH_TOKEN)
    if (resp.status == 201) {
      notifysuccess(message)
      setSelectedItems([])
    } else {
      // notifyerror("something went wrong")
    }
  }
  const _update_name_ = async (data, id, message) => {
    const resp = await patchData(data, BACKEND_URL + BACK_END_API_DOCUMENTS + "/" + id + "/", props.AUTH_TOKEN)
    if (resp.status == 201) {
      notifysuccess(message)
      get_all_user_doc(ChosenWorkspaceId["Workspace_Id"])
      setSelectedItems([])
      setRenameDiv(false)
    } else {
      // notifyerror("something went wrong")
    }
  }



  const handlePopUpMenu = (index) => {
    if (openPopupIndex === index) {
      setOpenPopupIndex(null);
    } else {
      setOpenPopupIndex(index);
    }
  };

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setOpenPopupIndex(null);
    }
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setActiveOrTrash(props.SHOW)
  })

  useEffect(() => {
    if (ChosenWorkspaceId != null) {
      initial_get_all_user_doc(ChosenWorkspaceId["Workspace_Id"])
    }
  }, [ActiveOrTrash])


  const search_from_api = async (search_text) => {
    if (props.SHOW == "trash") {

      // const chosen_workspace=localStorage.getItem('chose_workspace')
      if (ChosenWorkspaceId != null) {
        const resp = await fetchData(BACKEND_URL + BACK_END_API_DOCUMENTS_PATCH + "/?page=" + currentPage + "&workspace=" + ChosenWorkspaceId["Workspace_Id"] + "&search=" + search_text, props.AUTH_TOKEN)
        if (resp.status == 200) {
          if (resp.data.results.length > 0) {
            setdocumentData(resp.data.results)
          }
        } else {
          notifyerror("something went wrong")
        }
      }

    }
    if (props.SHOW == 'active') {

      if (ChosenWorkspaceId != null) {

        const resp = await fetchData(BACKEND_URL + BACK_END_API_DOCUMENTS + "/?page=" + currentPage + "&workspace=" + ChosenWorkspaceId["Workspace_Id"] + "&search=" + search_text, props.AUTH_TOKEN)
        if (resp.status == 200) {
          if (resp.data.results.length > 0) {
            setdocumentData(resp.data.results)
          }
        } else {
          notifyerror("something went wrong")
        }
      }
    }

  }

  const handleSearchText = (event) => {
    setSearchText(event.target.value)
    search_from_api(searchText)
    if (searchText.length <= 0) {
      get_all_user_doc(ChosenWorkspaceId["Workspace_Id"])
    }
  };



  const update_folder = async () => {
    let formData = {
      project_id: selectedValue
    }
    const resp = await patchData(formData, BACKEND_URL + BACK_END_API_DOCUMENTS + "/" + RenameDocumentId + "/", props.AUTH_TOKEN)
    if (resp.status = 201) {
      get_all_user_doc()
      notifysuccess("Document Moved")
    } else {
      notifyerror("something went wrong")
    }
    setChangeFolderDiv(false)
  }

  const get_project_data = async () => {
    if (ChosenWorkspaceId != null) {
      const resp = await fetchData(BACKEND_URL + BACK_END_API_PROJECT_CHOOSE + "?workspace_id=" + ChosenWorkspaceId["Workspace_Id"], props.AUTH_TOKEN)
      if (resp.status == 200) {
        setSelectedOptions(resp.data)
      }
    }
  }
  useEffect(() => {
    get_project_data()
  }, [FolderDataState])

  useEffect(() => {
    dispatch(_save_doc_data_(documentData))
  }, [documentData])

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };



  const handleDownload = (file_link) => {
    const link = document.createElement('a');
    link.href = file_link;
    link.download = getFileNameFromLink(file_link); // Get the file name from the link
    link.click();
  };

  const getFileNameFromLink = (fileLink) => {
    // Extract the file name from the link
    const urlParts = fileLink.split('/');
    return decodeURIComponent(urlParts[urlParts.length - 1]);
  };

  const download_file = async (id) => {
    setDownloadLoader(true)
    const resp = await fetchData(BACKEND_URL + BACK_END_API_DOWNLOAD_FILE + id + "/", props.AUTH_TOKEN)
    if (resp.status == 201) {
      handleDownload(BACKEND_URL + "/" + resp.data.link)
    }
    setDownloadLoader(false)
    if (popupRef.current) {
      setOpenPopupIndex(null);
    }
  }

  // ==============multiple select==================
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleItemSelection = (id) => {
    setSelectedItems(prevSelectedItems => {
      if (prevSelectedItems.includes(id)) {
        return prevSelectedItems.filter(item => item !== id);
      } else {
        return [...prevSelectedItems, id];
      }
    });
  };

  const handleSelectButton = () => {

  };

  const handleCheckboxChange = (id) => {
    if (selectAll) {
      setSelectAll(false);
      setSelectedItems([]);
    } else {
      handleItemSelection(id);
    }
  };

  const handleSelectAll = () => {
    if (!selectAll) {
      setSelectedItems(documentData.map(data => data.id));
    } else {
      setSelectedItems([]);
    }
    setSelectAll(prevSelectAll => !prevSelectAll);
  };


  const delete_multiple_data = async (data, message) => {
    const resp = await postData(data, BACKEND_URL + BACK_END_MULTIPLE_SELECT_FOR_TRASH, props.AUTH_TOKEN)
    if (resp.status == 200) {
      notifysuccess(message)
      get_all_user_doc()
      setSelectedItems([])
    } else {
      notifyerror("something went wrong")
    }
  }
  const permanently_delete_multiple_data = async(data, message) => {

    const resp = await postData(data, BACKEND_URL + BACK_END_MULTIPLE_SELECT_FOR_TRASH_PERMANENTLY_DELETE, props.AUTH_TOKEN)
    if (resp.status == 200) {
      notifysuccess(message)
      get_all_user_doc()
      setSelectedItems([])
      setshowModalForPermanentlyDelete(false)
    } else {
      notifyerror("something went wrong")
    }
  }




  const update_folder_bulk = async (formData, message) => {
    const resp = await postData(formData, BACKEND_URL + BACK_END_MULTIPLE_SELECT_FOR_UPDATE_PROJECT_ID, props.AUTH_TOKEN)
    if (resp.status = 201) {
      get_all_user_doc(ChosenWorkspaceId["Workspace_Id"])
      setSelectedItems([])
      notifysuccess(message)
    } else {
      notifyerror("something went wrong")
    }
    setChangeFolderDiv(false)
  }



  // ==============pagination of list data ==========

  const [currentPage, setCurrentPage] = useState(1);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getVisiblePageNumbers = () => {
    const halfPagesToShow = Math.floor(pagesToShow / 2);
    const firstVisiblePage = Math.max(currentPage - halfPagesToShow, 1);
    const lastVisiblePage = Math.min(firstVisiblePage + pagesToShow - 1, totalPages);
    return Array.from({ length: lastVisiblePage - firstVisiblePage + 1 }, (_, index) => firstVisiblePage + index);
  };

  useEffect(() => {
    setshowpagination(false)
    initial_get_all_user_doc()
  }, [currentPage])



  // =========Add to Fav======

  const get_fav_doc = async () => {
    const resp = await fetchData(BACKEND_URL + BACK_END_API_FAV, props.AUTH_TOKEN)
    if (resp.status = -200) {
      dispatch(_fav_data_(resp.data))
    }
  }

  const add_to_fav = async (id) => {
    const formData = {
      "id": id,
      "fav": true
    }
    const resp = await postData(formData, BACKEND_URL + BACK_END_API_FAV, props.AUTH_TOKEN)
    if (resp.status == 201) {
      notifysuccess("Added to Favorite")
      setOpenPopupIndex(null);
      get_fav_doc()
      get_all_user_doc()
    } else {
      notifyerror("something went wrong")
    }
  }
  const remove_to_fav = async (id) => {
    const formData = {
      "id": id,
      "fav": false
    }
    const resp = await postData(formData, BACKEND_URL + BACK_END_API_FAV, props.AUTH_TOKEN)
    if (resp.status == 201) {
      notifysuccess("Removed from Favorite")
      setOpenPopupIndex(null);
      get_fav_doc()
      get_all_user_doc()
    } else {
      notifyerror("something went wrong")
    }
  }





  return (
    <>
      {LoadingData
        ?
        <LoadingPage />
        :
        <div className="space-y-8 min-w-min px-4 md:px-10 mt-8 w-full" ref={popupRef}>
        
          {props.SHOW == "trash"
            ?
            <>
              <div className="flex ">
                <div>
                  <h1 className="text-[35px] font-bold">Trash </h1>
                </div>
                <div >
                  {/* delete svg */}
                  <svg className="w-4 h-4 mt-10 " xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 388.245 485.30625" xmlSpace="preserve">
                    <g>
                      <path d="M107.415,388.245h173.334c21.207,0,38.342-17.159,38.342-38.342V80.928H69.097v268.975   C69.097,371.086,86.264,388.245,107.415,388.245z M253.998,129.643c0-7.178,5.796-13.03,13.006-13.03   c7.178,0,13.006,5.853,13.006,13.03v208.311c0,7.21-5.828,13.038-13.006,13.038c-7.21,0-13.006-5.828-13.006-13.038V129.643z    M181.491,129.643c0-7.178,5.804-13.03,13.006-13.03c7.178,0,13.006,5.853,13.006,13.03v208.311c0,7.21-5.828,13.038-13.006,13.038   c-7.202,0-13.006-5.828-13.006-13.038C181.491,337.954,181.491,129.643,181.491,129.643z M109.025,129.643   c0-7.178,5.796-13.03,12.973-13.03s13.038,5.853,13.038,13.03v208.311c0,7.21-5.861,13.038-13.038,13.038   c-7.178,0-12.973-5.828-12.973-13.038V129.643z" fill="#010002" />
                      <path d="M294.437,20.451h-52.779C240.39,8.966,230.75,0,218.955,0h-49.682   c-11.86,0-21.476,8.966-22.736,20.451H93.792c-25.865,0-46.756,20.955-46.902,46.756h294.466   C341.258,41.407,320.335,20.451,294.437,20.451z" fill="#010002" />
                    </g>
                  </svg>
                </div>
              </div>
              <div className="dark:bg-gray-700 dark:text-white p-3 text-sm text-center text-gray-500 bg-gray-100 rounded-lg">Items will be permanently deleted after 60 days</div>
            </>
            :
            null
          }

          <div className="space-y-4">


            {props.ShowDashboard
              ?
                null
              :
              <>
                {documentData &&
                  documentData.length > 0
                  ?
                  <>
                    {/* ===================search field========================== */}
                    <div className="flex flex-col justify-between sm:flex-row">
                      <div className="flex items-center space-x-6">
                        <div className="w-80">
                          <div className="w-full space-y-1.5">
                            <label htmlFor="search-content" className="sr-only">
                            <span className="flex items-center space-x-1"><span>Search content</span></span></label>


                            <>
                              <div className="dark:bg-gray-800 !mt-0 flex w-full items-center gap-2 rounded-lg bg-white px-3 py-1 outline-none ring-1 ring-gray-200 transition-all duration-150 ease-in-out focus-within:!ring-1 hover:ring-2">
                                <div className="dark:bg-gray-800 flex grow items-center gap-2 py-1.5">
                                  <svg className="dark:bg-gray-800h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                    <path d="M6.67,12.44c3.19,0,5.78-2.59,5.78-5.78S9.86,.89,6.67,.89,.89,3.48,.89,6.67s2.59,5.78,5.78,5.78Z" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                    <path d="M15.11,15.11l-4-4" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                  </svg>
                                  <div className="dark:bg-gray-800 flex grow gap-1">
                                    <input
                                      id="search-content"
                                      type="search"
                                      className="dark:text-gray-300 dark:bg-gray-800 block w-full resize-none text-sm font-normal text-gray-900 outline-none placeholder:text-gray-400"
                                      placeholder="Search content"
                                      value={searchText}
                                      onChange={handleSearchText}
                                    />
                                  </div>
                                </div>
                              </div>
                            </>
                          </div>
                        </div>
                        <div>
                          {props.SHOW == "trash"
                            ?
                            <>
                              <>
                                {selectedItems.length > 0
                                  ?
                                  <>
                                    <button onClick={() => {
                                      const formData = {
                                        id: selectedItems,
                                        trash: false
                                      }
                                      delete_multiple_data(formData, "Restored")
                                    }}>
                                      <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" role="none">
                                        <path d="M2.15,5.13c-.12,2.74-.09,5.49,.32,8.26,.22,1.49,1.48,2.61,2.99,2.61h5.08c1.51,0,2.77-1.12,2.99-2.61,.41-2.77,.44-5.52,.32-8.26H2.15Z" fill="#9CA3AF" fillRule="evenodd" role="none"></path>
                                        <path d="M5.85,6.77c.54-.47,1.37-.08,1.37,.63v.76h1.5c1.66,0,3,1.34,3,3s-1.34,3-3,3h-.78c-.39,0-.71-.32-.71-.71s.32-.71,.71-.71h.78c.87,0,1.57-.7,1.57-1.57s-.7-1.57-1.57-1.57h-1.5v.77c0,.7-.81,1.09-1.36,.64-.65-.54-1.04-.93-1.54-1.57-.26-.34-.25-.81,.02-1.13,.53-.63,.92-1.01,1.51-1.52Z" fill="#4B5563" fillRule="evenodd" role="none"></path>
                                        <path d="M6.59,2.3c.37-.37,.88-.58,1.41-.58s1.04,.21,1.41,.58c.31,.31,.5,.7,.56,1.12h-3.95c.06-.42,.26-.82,.56-1.12Zm-2.29,1.12c.07-.88,.45-1.71,1.07-2.33,.7-.7,1.64-1.09,2.62-1.09s1.93,.39,2.62,1.09c.63,.63,1.01,1.46,1.07,2.33h3.21c.47,0,.86,.38,.86,.86s-.38,.86-.86,.86H1.1c-.47,0-.86-.38-.86-.86s.38-.86,.86-.86h3.2Z" fill="#4B5563" fillRule="evenodd" role="none"></path>
                                      </svg>
                                    </button>

                                  </>
                                  :
                                  null
                                }
                              </>
                            </>
                            :
                            <>
                              {selectedItems.length > 0
                                ?
                                <button id="selectButton" onClick={() => {
                                  const formData = {
                                    id: selectedItems,
                                    trash: true
                                  }
                                  delete_multiple_data(formData, "Moved to Trash")
                                }}>
                                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" role="none">
                                    <path d="M2.19,5.13c-.12,2.74-.09,5.49,.31,8.26,.22,1.48,1.47,2.61,2.97,2.61h5.03c1.51,0,2.76-1.12,2.97-2.61,.4-2.77,.44-5.52,.31-8.26H2.19Z" fill="#F98080" fillRule="evenodd" role="none"></path>
                                    <path d="M6.58,8.02c0-.39-.32-.71-.71-.71s-.71,.32-.71,.71v4.72c0,.39,.32,.71,.71,.71s.71-.32,.71-.71v-4.72Zm4.27,0c0-.39-.32-.71-.71-.71s-.71,.32-.71,.71v4.72c0,.39,.32,.71,.71,.71s.71-.32,.71-.71v-4.72Z" fill="#E02424" fillRule="evenodd" role="none"></path>
                                    <path d="M6.59,2.3c.37-.37,.88-.58,1.41-.58s1.04,.21,1.41,.58c.31,.31,.5,.7,.56,1.12h-3.95c.06-.42,.26-.82,.56-1.12Zm-2.29,1.12c.07-.88,.45-1.71,1.07-2.33C6.07,.39,7.02,0,8,0s1.93,.39,2.62,1.09c.63,.63,1.01,1.46,1.07,2.33h3.17c.47,0,.86,.38,.86,.86s-.38,.86-.86,.86H1.14c-.47,0-.86-.38-.86-.86s.38-.86,.86-.86h3.16Z" fill="#E02424" fillRule="evenodd" role="none"></path>
                                  </svg>
                                </button>
                                :
                                null
                              }
                            </>
                          }
                        </div>
                      </div>

                      {/* ===================search field========================== */}

                      {/* ===================list or gird========================== */}
                      <div className="flex items-center space-x-5 divide-x divide-gray-200 pt-4 md:pt-0">
                        <div className="md:pl-5">
                          <div className="mr-3 flex items-center justify-center space-x-2">
                            <button className={ListOrGrid ? " flex aspect-square h-9 w-9 items-center justify-center rounded-md bg-gray-100 px-2 py-1.5 text-gray-400 transition-all duration-150 hover:bg-gray-200 hover:text-gray-500 " : " flex aspect-square h-9 w-9 items-center justify-center rounded-md bg-white px-2 py-1.5 text-gray-400 transition-all duration-150 hover:bg-gray-200 hover:text-gray-500 "}
                              onClick={() => {
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
                              className={ListOrGrid ? " flex aspect-square h-9 w-9 items-center justify-center rounded-md bg-white px-2 py-1.5 text-gray-400 transition-all duration-150 hover:bg-gray-200 hover:text-gray-500 " : " flex aspect-square h-9 w-9 items-center justify-center rounded-md bg-gray-100 px-2 py-1.5 text-gray-400 transition-all duration-150 hover:bg-gray-200 hover:text-gray-500 "}
                              onClick={() => {
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
                      {/* ===================list or gird========================== */}
                    </div>

                  </>
                  :
                  <>
                    <div className="space-y-8 px-4 md:px-10">
                      <div className="space-y-4 flex flex-col justify-center">
                        <div className="mx-auto mt-6 max-w-[540px] space-y-2 text-center sm:mt-10 md:mt-28">
                          <h3 className="text-lg font-semibold">You do not have any Document</h3>
                          <p className="text-base font-normal text-gray-600">Prior to creating a document, it appears that you do not have any existing content. To proceed, please create the necessary content first and subsequently generate a document based on the created content.</p>
                        </div>
                        <div className="m-auto">
                          <button
                            onClick={() => {
                              navigate("/template")
                            }}
                            type="button" className="relative w-[300px] rounded-md bg-[#334977] text-white px-3 py-1.5 text-sm font-semibold  shadow-sm outline-none ring-0 ring-blue-600 transition-all duration-200 hover:outline-none hover:ring-2 focus:outline-none active:ring-0">
                            <span className="mx-auto flex select-none items-center justify-center space-x-2"><div>Create template</div></span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                }
              </>
            }




            {ListOrGrid
              ?
              documentData &&
              <>
                {documentData.length > 0
                  ?
                  <>
                  {props.DASHBOARD?
                    <h4 className="dark:text-gray-500">Recent Documents</h4>
                  :
                    null
                  }

                  
                  <div className="w-full  rounded-lg outline outline-1 outline-gray-200">

                    <table className="w-full  ">

                      <thead className="">
                        <tr>

                          <th scope="col" className="w-12 px-3.5 py-3.5">
                            <input
                              checked={selectAll}
                              onChange={handleSelectAll}
                              type="checkbox"
                              className="mr-[15px] dark:bg-black dark:text-gray-400 mt-[5px] w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                          </th>
                          <th scope="col" className="dark:bg-black dark:text-gray-400 text-left text-xs font-semibold uppercase text-gray-700">Name</th>
                          <th scope="col" className="dark:bg-black dark:text-gray-400 hidden text-left text-xs font-semibold uppercase text-gray-700 sm:table-cell"></th>
                          <th scope="col" className="dark:bg-black dark:text-gray-400 hidden text-left text-xs font-semibold uppercase text-gray-700 sm:table-cell">Created by</th>
                          <th scope="col" className="dark:bg-black dark:text-gray-400 hidden text-left text-xs font-semibold uppercase text-gray-700 sm:table-cell">Status</th>
                          <th scope="col" className="dark:bg-black dark:text-gray-400 hidden text-left text-xs font-semibold uppercase text-gray-700 sm:table-cell">Last modified</th>
                          <th scope="col" className="dark:bg-black dark:text-gray-400 w-12  px-3.5 py-3.5"><span className="sr-only">More options</span></th>
                        </tr>

                      </thead>

                      <tbody className="divide-y  dark:bg-black dark:text-white ">

                        {props.ShowDashboard
                        ?
                        <>
                            {documentData.slice(0,10).map((data, index) => (
                              <tr className="group relative cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-600 dark:bg-black dark:text-white dark:border-slate-500 " key={index}>

                                <td className="w-12 p-3.5">
                                  <div className="absolute inset-y-0 left-0 w-0.5">

                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      checked={selectedItems.includes(data.id) || selectAll}
                                      onChange={() => handleCheckboxChange(data.id)}
                                      type="checkbox" id="" className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                    <label for="" className="block text-md font-medium text-gray-600">
                                    </label>
                                  </div>
                                </td>

                                <td className="w-12 px-3.5 py-3.5 dark:text-gray-400" title={"open " + data.title}
                                  onClick={() => {

                                    navigate(`/template_data/${data.id}?template_editing=edit_by_user&template_used=redirect_from_doc_page`)
                                  }}>
                                    <ListDocIconFirst/>
                                </td>

                                <td className="max-w-[10rem] truncate text-ellipsis whitespace-nowrap py-4 pr-3 text-sm text-gray-700 dark:text-gray-400"
                                  title={"open " + data.title}
                                  onClick={() => {
                                    navigate(`/template_data/${data.id}?template_editing=edit_by_user&template_used=redirect_from_doc_page`)
                                  }}
                                >{data.title}</td>


                                <td className="hidden max-w-[6rem] truncate text-ellipsis text-left text-xs font-semibold uppercase dark:text-gray-400 text-gray-700 sm:table-cell"
                                  title={"open " + data.title}
                                  onClick={() => {
                                    navigate(`/template_data/${data.id}?template_editing=edit_by_user&template_used=redirect_from_doc_page`)
                                  }}>me</td>


                                <td className="hidden max-w-[6rem] truncate text-ellipsis whitespace-nowrap py-4 pr-3 text-sm dark:text-gray-400 text-gray-700 sm:table-cell md:max-w-[10rem]">
                                    <SelectOptionsTemplate
                                      id={data.id}
                                      options_selected={data}
                                      TOKEN={props.AUTH_TOKEN}
                                    />
                                </td>

                                <td className="hidden text-left text-xs font-semibold uppercase text-gray-700 dark:text-gray-400 sm:table-cell"
                                  title={"open " + data.title}
                                  onClick={() => {
                                    navigate(`/template_data/${data.id}?template_editing=edit_by_user&template_used=redirect_from_doc_page`)
                                  }}>{data.updated_at}</td>

                                <td className="w-12 pr-4 dark:text-gray-400">
                                  <span className="relative inline-block text-left">
                                    <button type="button" className="relative rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-600 shadow-sm outline-none ring-1 ring-gray-200 transition-all duration-200 hover:outline-none hover:ring-2 focus:outline-none active:ring-1" id="headlessui-menu-button-:r61:" aria-haspopup="menu" aria-expanded="false" data-headlessui-state=""
                                      onClick={() => handlePopUpMenu(index)}
                                    >
                                      <ThreeDotsIcon />
                                    </button>

                                    {props.SHOW == "trash"
                                      ?
                                      <>
                                        {openPopupIndex === index && (
                                          <>
                                            <div className="z-20 absolute right-0 mt-1 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white text-gray-600 text-sm font-medium shadow-md border border-gray-200 focus:outline-none transform opacity-100 scale-100" aria-labelledby="headlessui-menu-button-:r6e:" id="headlessui-menu-items-:r79:" role="menu" tabIndex="0" data-headlessui-state="open">
                                              <div role="none">
                                                <button className="flex items-center px-3.5 py-2.5 hover:bg-gray-100 w-full text-sm space-x-3 active:bg-blue-100 text-red-600" role="none"
                                                  onClick={() => {
                                                    const formData = {
                                                      trash: false
                                                    }
                                                    _update_document_data(formData, data.id, "Restored")
                                                    if (popupRef.current) {
                                                      setOpenPopupIndex(null);
                                                    }
                                                  }}
                                                >
                                                  <ListIconSecond/>
                                                  <span role="none">Restore</span>
                                                </button>
                                              </div>
                                            </div>
                                          </>
                                        )}
                                      </>
                                      :
                                      <>
                                        {openPopupIndex === index && (
                                          <div className="dark:bg-gray-700 dark:text-gray-200 z-20 absolute right-0 mt-1 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white text-gray-600 text-sm font-medium shadow-md border border-gray-200 focus:outline-none transform opacity-100 scale-100" >

                                            <div role="none">
                                              {data.favorite
                                                ?
                                                <button type="button" className="dark:hover:bg-gray-500 dark:text-white flex items-center px-3.5 py-2.5 hover:bg-gray-100 w-full text-sm space-x-3 active:bg-blue-100" role="none"
                                                  onClick={() => {
                                                    remove_to_fav(data.id)
                                                  }}>
                                                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" role="none">
                                                    <path d="M8,0c.22,0,.41,.13,.51,.33l2.23,4.51,4.78,.82c.21,.04,.39,.19,.45,.41,.07,.21,.01,.45-.14,.61l-3.4,3.62,.73,5.02c.03,.22-.06,.45-.23,.58-.17,.13-.4,.15-.6,.05l-4.34-2.27-4.32,2.27c-.19,.1-.42,.08-.6-.05-.17-.13-.26-.36-.23-.58l.73-5.02L.17,6.67c-.15-.16-.2-.4-.14-.61,.07-.21,.24-.37,.46-.41l4.79-.82L7.49,.33c.1-.2,.3-.33,.51-.33Z" fill="#9df356" fillRule="evenodd" role="none"></path>
                                                  </svg>
                                                  <span role="none">Remove from favorites</span>
                                                </button>
                                                :
                                                <button type="button" className=" dark:hover:bg-gray-100 dark:text-white flex items-center px-3.5 py-2.5 hover:bg-gray-100 w-full text-sm space-x-3 active:bg-blue-100" role="none"
                                                  onClick={() => {
                                                    add_to_fav(data.id)
                                                  }}>
                                                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" role="none">
                                                    <path d="M8,0c.22,0,.41,.13,.51,.33l2.23,4.51,4.78,.82c.21,.04,.39,.19,.45,.41,.07,.21,.01,.45-.14,.61l-3.4,3.62,.73,5.02c.03,.22-.06,.45-.23,.58-.17,.13-.4,.15-.6,.05l-4.34-2.27-4.32,2.27c-.19,.1-.42,.08-.6-.05-.17-.13-.26-.36-.23-.58l.73-5.02L.17,6.67c-.15-.16-.2-.4-.14-.61,.07-.21,.24-.37,.46-.41l4.79-.82L7.49,.33c.1-.2,.3-.33,.51-.33Z" fill="#9CA3AF" fillRule="evenodd" role="none"></path>
                                                  </svg>
                                                  <span role="none">Add to favorites</span>
                                                </button>

                                              }
                                              <button className="flex dark:hover:bg-gray-100 dark:text-white items-center px-3.5 py-2.5 hover:bg-gray-100 w-full text-sm space-x-3 active:bg-blue-100" role="none"
                                                onClick={() => {
                                                  setRenameDiv(true)
                                                  setRenameId(data.id)
                                                  if (popupRef.current) {
                                                    setOpenPopupIndex(null);
                                                  }
                                                  setInputText(data.title)
                                                }}
                                              >
                                                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" role="none">
                                                  <path d="M.09,7.46c.05-.96,.15-1.9,.25-2.79,.11-1.01,.65-1.88,1.42-2.45,.49-.37,1.07-.61,1.71-.68,.95-.11,1.96-.22,3-.27,.07,0,.15,0,.22,.01,.24,0,.47-.01,.71-.01,1.38,0,2.73,.15,3.96,.29,1.62,.19,2.92,1.48,3.1,3.11l-1.01,.11,1.01-.11c.14,1.23,.28,2.56,.28,3.94,0,.29,0,.58-.02,.87,.01,.08,.02,.17,.02,.26-.05,.96-.15,1.9-.25,2.79-.11,1.01-.65,1.88-1.42,2.45-.49,.37-1.07,.61-1.71,.68-.95,.11-1.96,.22-3,.27-.08,0-.15,0-.22-.01-.24,0-.47,.01-.71,.01-1.38,0-2.73-.15-3.96-.29-1.62-.19-2.92-1.48-3.1-3.11-.14-1.23-.28-2.56-.28-3.94,0-.29,0-.58,.02-.87-.01-.08-.02-.17-.02-.26Z" fill="#9CA3AF" fillRule="evenodd" role="none"></path>
                                                  <path d="M12.06,.79c.86-.92,2.31-.95,3.2-.06,.89,.89,.86,2.34-.06,3.2l-4.09,3.79c-.18,.17-.39,.29-.62,.37l-1.71,.57c-.89,.3-1.74-.55-1.44-1.45l.57-1.71c.08-.23,.2-.44,.37-.62L12.06,.79Z" fill="#4B5563" fillRule="evenodd" role="none"></path>
                                                </svg>
                                                <span role="none">Rename</span>
                                              </button>

                                              <button className="flex dark:hover:bg-gray-100 dark:text-gray-300 items-center px-3.5 py-2.5  w-full text-sm space-x-3 active:bg-blue-100" role="none"
                                                onClick={() => {
                                                  setChangeFolderDiv(true)
                                                  setRenameDocumentId(data.id)
                                                  if (popupRef.current) {
                                                    setOpenPopupIndex(null);
                                                  }
                                                }}
                                              >
                                                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" role="none">
                                                  <path d="M.57,8c0,4.1,3.32,7.43,7.43,7.43s7.43-3.33,7.43-7.43S12.1,.57,8,.57,.57,3.9,.57,8Z" fill="#9CA3AF" fillRule="evenodd" role="none"></path>
                                                  <path d="M8.54,9.75c0,.72,.84,1.13,1.41,.65,.78-.66,1.27-1.19,1.97-2.04,.17-.21,.17-.51,0-.72-.69-.85-1.19-1.38-1.97-2.04-.56-.48-1.41-.07-1.41,.65v.9h-3.96c-.47,0-.86,.38-.86,.86s.38,.86,.86,.86h3.96v.9Z" fill="#4B5563" fillRule="evenodd" role="none"></path>
                                                </svg>
                                                <span role="none">Move to folder</span>
                                              </button>
                                            </div>

                                            <div role="none">
                                              <button className="flex dark:hover:bg-gray-600 dark:text-white items-center px-3.5 py-2.5 hover:bg-gray-100 w-full text-sm space-x-3 active:bg-blue-100 text-red-600" role="none"
                                                onClick={() => {
                                                  setshowModalForDelete(true)
                                                  setDeleteFolderId(data.id)
                                                  if (popupRef.current) {
                                                    setOpenPopupIndex(null);
                                                  }
                                                }}
                                              >
                                                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" role="none">
                                                  <path d="M2.19,5.13c-.12,2.74-.09,5.49,.31,8.26,.22,1.48,1.47,2.61,2.97,2.61h5.03c1.51,0,2.76-1.12,2.97-2.61,.4-2.77,.44-5.52,.31-8.26H2.19Z" fill="#F98080" fillRule="evenodd" role="none"></path>
                                                  <path d="M6.58,8.02c0-.39-.32-.71-.71-.71s-.71,.32-.71,.71v4.72c0,.39,.32,.71,.71,.71s.71-.32,.71-.71v-4.72Zm4.27,0c0-.39-.32-.71-.71-.71s-.71,.32-.71,.71v4.72c0,.39,.32,.71,.71,.71s.71-.32,.71-.71v-4.72Z" fill="#E02424" fillRule="evenodd" role="none"></path>
                                                  <path d="M6.59,2.3c.37-.37,.88-.58,1.41-.58s1.04,.21,1.41,.58c.31,.31,.5,.7,.56,1.12h-3.95c.06-.42,.26-.82,.56-1.12Zm-2.29,1.12c.07-.88,.45-1.71,1.07-2.33C6.07,.39,7.02,0,8,0s1.93,.39,2.62,1.09c.63,.63,1.01,1.46,1.07,2.33h3.17c.47,0,.86,.38,.86,.86s-.38,.86-.86,.86H1.14c-.47,0-.86-.38-.86-.86s.38-.86,.86-.86h3.16Z" fill="#E02424" fillRule="evenodd" role="none"></path>
                                                </svg>
                                                <span role="none">Delete</span>
                                              </button>
                                            </div>
                                          </div>
                                        )}
                                      </>
                                    }

                                  </span>
                                </td>

                              </tr>
                            ))
                            }
                          </>
                        :
                          <>
                            {documentData.map((data, index) => (
                              <tr className=" relative cursor-pointer  dark:text-white  dark:hover:bg-gray-600   hover:bg-blue-50" key={index}>

                                <td className="w-12 p-3.5  dark:text-white ">
                                  <div className="absolute inset-y-0 left-0 w-0.5">

                                  </div>
                                  <div className="flex items-center space-x-2 ">
                                    <input
                                      checked={selectedItems.includes(data.id) || selectAll}
                                      onChange={() => handleCheckboxChange(data.id)}
                                      type="checkbox" id="" className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                    <label for="" className="block text-md font-medium text-gray-600">
                                    </label>
                                  </div>
                                </td>

                                <td className="w-12 px-3.5 py-3.5  dark:text-gray-400 " title={"open " + data.title}
                                  onClick={() => {

                                    navigate(`/template_data/${data.id}?template_editing=edit_by_user&template_used=redirect_from_doc_page`)
                                  }}>
                                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                    <path d="M8,.57c-1.56,0-2.83,.05-4.14,.14-1.39,.1-2.49,1.2-2.58,2.59-.1,1.52-.14,3.09-.14,4.7s.05,3.18,.14,4.7c.09,1.39,1.19,2.49,2.58,2.59,1.31,.09,2.57,.14,4.14,.14s2.83-.05,4.14-.14c1.39-.1,2.49-1.2,2.58-2.59,.1-1.52,.14-3.09,.14-4.7,0-.65,0-1.3-.02-1.94-.01-.56-.2-1.11-.53-1.56-1.03-1.41-1.87-2.3-3.24-3.35-.46-.36-1.03-.55-1.6-.56-.46-.01-.95-.02-1.46-.02Z" fill="#8DA2FB" fillRule="evenodd"></path>
                                    <path d="M5.82,3.86c-.39,0-.71,.32-.71,.71s.32,.71,.71,.71h2.63c.39,0,.71-.32,.71-.71s-.32-.71-.71-.71h-2.63Zm0,6.77c-.39,0-.71,.32-.71,.71s.32,.71,.71,.71h4.34c.4,0,.71-.32,.71-.71s-.32-.71-.71-.71H5.82Zm0-3.32c-.39,0-.71,.32-.71,.71s.32,.71,.71,.71h4.36c.39,0,.71-.32,.71-.71s-.32-.71-.71-.71H5.82Z" fill="#5850EC" fillRule="evenodd"></path>
                                  </svg>
                                </td>

                                <td className=" dark:text-gray-400  max-w-[10rem] truncate text-ellipsis whitespace-nowrap py-4 pr-3 text-sm text-gray-700"
                                  title={"open " + data.title}
                                  onClick={() => {

                                    if(props.SHOW=="active"){
                                      navigate(`/template_data/${data.id}?template_editing=edit_by_user&template_used=redirect_from_doc_page`)
                                  }

                                  }}
                                >{(data.title).slice(0,25)+".."}</td>


                                <td className=" dark:text-gray-400  hidden max-w-[6rem] truncate text-ellipsis text-left text-xs font-semibold uppercase text-gray-700 sm:table-cell"
                                  title={"open " + data.title}
                                  onClick={() => {
                                    if(props.SHOW=="active"){
                                      navigate(`/template_data/${data.id}?template_editing=edit_by_user&template_used=redirect_from_doc_page`)
                                    }
                                  }}>me</td>


                                <td className=" dark:text-gray-400  hidden max-w-[6rem] truncate text-ellipsis whitespace-nowrap py-4 pr-3 text-sm text-gray-700 sm:table-cell md:max-w-[10rem]">
                                    <SelectOptionsTemplate
                                      id={data.id}
                                      options_selected={data}
                                      TOKEN={props.AUTH_TOKEN}
                                    />
                                </td>

                                <td className=" dark:text-gray-400  hidden text-left text-xs font-semibold uppercase text-gray-700 sm:table-cell"
                                  title={"open " + data.title}
                                  onClick={() => {
                                    navigate(`/template_data/${data.id}?template_editing=edit_by_user&template_used=redirect_from_doc_page`)
                                  }}>{data.updated_at}</td>
                                <td className="w-12 pr-4 ">
                                  <span className="relative inline-block text-left" data-headlessui-state="">
                                    <button type="button" className="relative rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-600 shadow-sm outline-none ring-1 ring-gray-200 transition-all duration-200 hover:outline-none hover:ring-2 focus:outline-none active:ring-1" id="headlessui-menu-button-:r61:" aria-haspopup="menu" aria-expanded="false" data-headlessui-state=""
                                      onClick={() => handlePopUpMenu(index)}
                                    >
                                      <ThreeDotsIcon />
                                    </button>

                                    {props.SHOW == "trash"
                                      ?
                                      <>
                                        {openPopupIndex === index && (
                                          <>
                                            <div 
                                              className="dark:bg-slate-700 bg-white  dark:text-gray-400 z-20 absolute right-0 mt-1 w-56 origin-top-right divide-y divide-gray-100 rounded-md  text-gray-600 text-sm font-medium shadow-md border border-gray-200 focus:outline-none transform opacity-100 scale-100"
                                              >
                                              <div role="none" >
                                                <button className="dark:bg-slate-700 flex dark:hover:bg-gray-500 bg-white items-center px-3.5 py-2.5 hover:bg-gray-100 w-full text-sm space-x-3 active:bg-blue-100 text-red-600" role="none"
                                                  onClick={() => {
                                                    const formData = {
                                                      trash: false
                                                    }
                                                    _update_document_data(formData, data.id, "Restored")
                                                    if (popupRef.current) {
                                                      setOpenPopupIndex(null);
                                                    }
                                                  }}
                                                >
                                                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" role="none">
                                                    <path d="M2.15,5.13c-.12,2.74-.09,5.49,.32,8.26,.22,1.49,1.48,2.61,2.99,2.61h5.08c1.51,0,2.77-1.12,2.99-2.61,.41-2.77,.44-5.52,.32-8.26H2.15Z" fill="#9CA3AF" fillRule="evenodd" role="none"></path>
                                                    <path d="M5.85,6.77c.54-.47,1.37-.08,1.37,.63v.76h1.5c1.66,0,3,1.34,3,3s-1.34,3-3,3h-.78c-.39,0-.71-.32-.71-.71s.32-.71,.71-.71h.78c.87,0,1.57-.7,1.57-1.57s-.7-1.57-1.57-1.57h-1.5v.77c0,.7-.81,1.09-1.36,.64-.65-.54-1.04-.93-1.54-1.57-.26-.34-.25-.81,.02-1.13,.53-.63,.92-1.01,1.51-1.52Z" fill="#4B5563" fillRule="evenodd" role="none"></path>
                                                    <path d="M6.59,2.3c.37-.37,.88-.58,1.41-.58s1.04,.21,1.41,.58c.31,.31,.5,.7,.56,1.12h-3.95c.06-.42,.26-.82,.56-1.12Zm-2.29,1.12c.07-.88,.45-1.71,1.07-2.33,.7-.7,1.64-1.09,2.62-1.09s1.93,.39,2.62,1.09c.63,.63,1.01,1.46,1.07,2.33h3.21c.47,0,.86,.38,.86,.86s-.38,.86-.86,.86H1.1c-.47,0-.86-.38-.86-.86s.38-.86,.86-.86h3.2Z" fill="#4B5563" fillRule="evenodd" role="none"></path>
                                                  </svg>
                                                  <span role="none">Restore</span>
                                                </button>
                                                <button className="dark:bg-slate-700 flex dark:hover:bg-gray-500 bg-white items-center px-3.5 py-2.5 hover:bg-gray-100 w-full text-sm space-x-3 active:bg-blue-100 text-red-600" role="none"
                                                  onClick={() => {
                                                      setDeleteFolderId([data.id])
                                                      setshowModalForPermanentlyDelete(true)
                                                    if (popupRef.current) {
                                                      setOpenPopupIndex(null);
                                                    }
                                                  }}
                                                >
                                                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" role="none">
                                                    <path d="M2.15,5.13c-.12,2.74-.09,5.49,.32,8.26,.22,1.49,1.48,2.61,2.99,2.61h5.08c1.51,0,2.77-1.12,2.99-2.61,.41-2.77,.44-5.52,.32-8.26H2.15Z" fill="#9CA3AF" fillRule="evenodd" role="none"></path>
                                                    <path d="M6.59,2.3c.37-.37,.88-.58,1.41-.58s1.04,.21,1.41,.58c.31,.31,.5,.7,.56,1.12h-3.95c.06-.42,.26-.82,.56-1.12Zm-2.29,1.12c.07-.88,.45-1.71,1.07-2.33,.7-.7,1.64-1.09,2.62-1.09s1.93,.39,2.62,1.09c.63,.63,1.01,1.46,1.07,2.33h3.21c.47,0,.86,.38,.86,.86s-.38,.86-.86,.86H1.1c-.47,0-.86-.38-.86-.86s.38-.86,.86-.86h3.2Z" fill="#4B5563" fillRule="evenodd" role="none"></path>
                                                  </svg>
                                                  <span role="none">Delete</span>
                                                </button>
                                              </div>
                                            </div>
                                          </>
                                        )}
                                      </>
                                      :
                                      <>
                                        {openPopupIndex === index && (
                                          <div className="dark:bg-gray-700 z-20 absolute right-0 mt-1 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white text-gray-600 text-sm font-medium shadow-md border border-gray-200 focus:outline-none transform opacity-100 scale-100" aria-labelledby="headlessui-menu-button-:r6e:" id="headlessui-menu-items-:r79:" role="menu" tabIndex="0" data-headlessui-state="open">

                                            <div role="none">
                                              {data.favorite
                                                ?
                                                <button type="button" className="dark:hover:bg-gray-500 dark:text-gray-400 flex items-center px-3.5 py-2.5 hover:bg-gray-100 w-full text-sm space-x-3 active:bg-blue-100" role="none"
                                                  onClick={() => {
                                                    remove_to_fav(data.id)
                                                  }}>
                                                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" role="none">
                                                    <path d="M8,0c.22,0,.41,.13,.51,.33l2.23,4.51,4.78,.82c.21,.04,.39,.19,.45,.41,.07,.21,.01,.45-.14,.61l-3.4,3.62,.73,5.02c.03,.22-.06,.45-.23,.58-.17,.13-.4,.15-.6,.05l-4.34-2.27-4.32,2.27c-.19,.1-.42,.08-.6-.05-.17-.13-.26-.36-.23-.58l.73-5.02L.17,6.67c-.15-.16-.2-.4-.14-.61,.07-.21,.24-.37,.46-.41l4.79-.82L7.49,.33c.1-.2,.3-.33,.51-.33Z" fill="#9df356" fillRule="evenodd" role="none"></path>
                                                  </svg>
                                                  <span role="none">Remove from favorites</span>
                                                </button>
                                                :
                                                <button type="button" className="dark:hover:bg-gray-100 dark:text-gray-400 flex items-center px-3.5 py-2.5 hover:bg-gray-100 w-full text-sm space-x-3 active:bg-blue-100" role="none"
                                                  onClick={() => {
                                                    add_to_fav(data.id)
                                                  }}>
                                                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" role="none">
                                                    <path d="M8,0c.22,0,.41,.13,.51,.33l2.23,4.51,4.78,.82c.21,.04,.39,.19,.45,.41,.07,.21,.01,.45-.14,.61l-3.4,3.62,.73,5.02c.03,.22-.06,.45-.23,.58-.17,.13-.4,.15-.6,.05l-4.34-2.27-4.32,2.27c-.19,.1-.42,.08-.6-.05-.17-.13-.26-.36-.23-.58l.73-5.02L.17,6.67c-.15-.16-.2-.4-.14-.61,.07-.21,.24-.37,.46-.41l4.79-.82L7.49,.33c.1-.2,.3-.33,.51-.33Z" fill="#9CA3AF" fillRule="evenodd" role="none"></path>
                                                  </svg>
                                                  <span role="none">Add to favorites</span>
                                                </button>

                                              }
                                              <button className=" dark:text-gray-300 dark:hover:bg-gray-100 flex items-center px-3.5 py-2.5 hover:bg-gray-100 w-full text-sm space-x-3 active:bg-blue-100" role="none"
                                                onClick={() => {
                                                  setRenameDiv(true)
                                                  setRenameId(data.id)
                                                  if (popupRef.current) {
                                                    setOpenPopupIndex(null);
                                                  }
                                                  setInputText(data.title)
                                                }}
                                              >
                                                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" role="none">
                                                  <path d="M.09,7.46c.05-.96,.15-1.9,.25-2.79,.11-1.01,.65-1.88,1.42-2.45,.49-.37,1.07-.61,1.71-.68,.95-.11,1.96-.22,3-.27,.07,0,.15,0,.22,.01,.24,0,.47-.01,.71-.01,1.38,0,2.73,.15,3.96,.29,1.62,.19,2.92,1.48,3.1,3.11l-1.01,.11,1.01-.11c.14,1.23,.28,2.56,.28,3.94,0,.29,0,.58-.02,.87,.01,.08,.02,.17,.02,.26-.05,.96-.15,1.9-.25,2.79-.11,1.01-.65,1.88-1.42,2.45-.49,.37-1.07,.61-1.71,.68-.95,.11-1.96,.22-3,.27-.08,0-.15,0-.22-.01-.24,0-.47,.01-.71,.01-1.38,0-2.73-.15-3.96-.29-1.62-.19-2.92-1.48-3.1-3.11-.14-1.23-.28-2.56-.28-3.94,0-.29,0-.58,.02-.87-.01-.08-.02-.17-.02-.26Z" fill="#9CA3AF" fillRule="evenodd" role="none"></path>
                                                  <path d="M12.06,.79c.86-.92,2.31-.95,3.2-.06,.89,.89,.86,2.34-.06,3.2l-4.09,3.79c-.18,.17-.39,.29-.62,.37l-1.71,.57c-.89,.3-1.74-.55-1.44-1.45l.57-1.71c.08-.23,.2-.44,.37-.62L12.06,.79Z" fill="#4B5563" fillRule="evenodd" role="none"></path>
                                                </svg>
                                                <span role="none">Rename</span>
                                              </button>

                                              <button className="dark:text-gray-300 dark:hover:bg-gray-100 flex items-center px-3.5 py-2.5 hover:bg-gray-100 w-full text-sm space-x-3 active:bg-blue-100" role="none"
                                                onClick={() => {
                                                  setChangeFolderDiv(true)
                                                  setRenameDocumentId(data.id)
                                                  if (popupRef.current) {
                                                    setOpenPopupIndex(null);
                                                  }
                                                }}
                                              >
                                                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" role="none">
                                                  <path d="M.57,8c0,4.1,3.32,7.43,7.43,7.43s7.43-3.33,7.43-7.43S12.1,.57,8,.57,.57,3.9,.57,8Z" fill="#9CA3AF" fillRule="evenodd" role="none"></path>
                                                  <path d="M8.54,9.75c0,.72,.84,1.13,1.41,.65,.78-.66,1.27-1.19,1.97-2.04,.17-.21,.17-.51,0-.72-.69-.85-1.19-1.38-1.97-2.04-.56-.48-1.41-.07-1.41,.65v.9h-3.96c-.47,0-.86,.38-.86,.86s.38,.86,.86,.86h3.96v.9Z" fill="#4B5563" fillRule="evenodd" role="none"></path>
                                                </svg>
                                                <span role="none">Move to folder</span>
                                              </button>
                                              {/* <button className="flex items-center px-3.5 py-2.5 hover:bg-gray-100 w-full text-sm space-x-3 active:bg-blue-100" role="none"
                                                onClick={() => {
                                                  // setRenameDocumentId(data.id)
                                                  download_file(data.id)
                                                }}
                                              >

                                                {DownloadLoader ?
                                                  <svg className="animate-spin w-4 h-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 125" version="1.1" x="0px" y="0px">
                                                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                      <path d="M9,46 L26,46 C28.209139,46 30,47.790861 30,50 C30,52.209139 28.209139,54 26,54 L9,54 C6.790861,54 5,52.209139 5,50 C5,47.790861 6.790861,46 9,46 Z M74,46 L91,46 C93.209139,46 95,47.790861 95,50 C95,52.209139 93.209139,54 91,54 L74,54 C71.790861,54 70,52.209139 70,50 C70,47.790861 71.790861,46 74,46 Z M54,9 L54,26 C54,28.209139 52.209139,30 50,30 C47.790861,30 46,28.209139 46,26 L46,9 C46,6.790861 47.790861,5 50,5 C52.209139,5 54,6.790861 54,9 Z M54,74 L54,91 C54,93.209139 52.209139,95 50,95 C47.790861,95 46,93.209139 46,91 L46,74 C46,71.790861 47.790861,70 50,70 C52.209139,70 54,71.790861 54,74 Z M18.1801948,76.1629509 L30.2010101,64.1421356 C31.7631073,62.5800385 34.2957672,62.5800385 35.8578644,64.1421356 C37.4199615,65.7042328 37.4199615,68.2368927 35.8578644,69.7989899 L23.8370491,81.8198052 C22.2749519,83.3819023 19.742292,83.3819023 18.1801948,81.8198052 C16.6180977,80.257708 16.6180977,77.7250481 18.1801948,76.1629509 Z M64.1421356,30.2010101 L76.1629509,18.1801948 C77.7250481,16.6180977 80.257708,16.6180977 81.8198052,18.1801948 C83.3819023,19.742292 83.3819023,22.2749519 81.8198052,23.8370491 L69.7989899,35.8578644 C68.2368927,37.4199615 65.7042328,37.4199615 64.1421356,35.8578644 C62.5800385,34.2957672 62.5800385,31.7631073 64.1421356,30.2010101 Z M23.8370491,18.1801948 L35.8578644,30.2010101 C37.4199615,31.7631073 37.4199615,34.2957672 35.8578644,35.8578644 C34.2957672,37.4199615 31.7631073,37.4199615 30.2010101,35.8578644 L18.1801948,23.8370491 C16.6180977,22.2749519 16.6180977,19.742292 18.1801948,18.1801948 C19.742292,16.6180977 22.2749519,16.6180977 23.8370491,18.1801948 Z M69.7989899,64.1421356 L81.8198052,76.1629509 C83.3819023,77.7250481 83.3819023,80.257708 81.8198052,81.8198052 C80.257708,83.3819023 77.7250481,83.3819023 76.1629509,81.8198052 L64.1421356,69.7989899 C62.5800385,68.2368927 62.5800385,65.7042328 64.1421356,64.1421356 C65.7042328,62.5800385 68.2368927,62.5800385 69.7989899,64.1421356 Z" fill="#000000" />
                                                    </g>
                                                  </svg>

                                                  :
                                                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 76 91.25" version="1.1" x="0px" y="0px">

                                                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                      <path d="M73.5,46.6586399 C74.8807119,46.6586399 76,47.777928 76,49.1586399 L76,49.1586399 L76,58.1586399 C76,66.1667688 69.5081289,72.6586399 61.5,72.6586399 L61.5,72.6586399 L14.5,72.6586399 C6.49187113,72.6586399 0,66.1667688 0,58.1586399 L0,58.1586399 L0,49.1586399 C0,47.777928 1.11928813,46.6586399 2.5,46.6586399 C3.88071187,46.6586399 5,47.777928 5,49.1586399 L5,49.1586399 L5,58.1586399 C5,63.405345 9.25329488,67.6586399 14.5,67.6586399 L14.5,67.6586399 L61.5,67.6586399 C66.7467051,67.6586399 71,63.405345 71,58.1586399 L71,58.1586399 L71,49.1586399 C71,47.777928 72.1192881,46.6586399 73.5,46.6586399 Z M38.0000093,0.158639918 C39.3254927,0.158639918 40.410048,1.19017585 40.4946916,2.49426423 L40.5000093,2.65863992 L40.5,43.9046399 L51.2942137,33.8310017 C52.2597044,32.9298771 53.7490822,32.9406081 54.7012376,33.8266048 L54.8276475,33.9528443 C55.7287722,34.918335 55.7180412,36.4077128 54.8320444,37.3598683 L54.7058049,37.4862781 L39.7208572,51.4721198 C39.6757911,51.5148978 39.6291319,51.5560138 39.5809779,51.5953694 C39.5683135,51.6057519 39.5553541,51.6161416 39.5423186,51.6263826 C39.5127111,51.6495734 39.4825793,51.672149 39.4519322,51.6940497 C39.4306184,51.7093993 39.4093041,51.7241425 39.387821,51.738515 C39.3659323,51.7530143 39.343524,51.7674893 39.3208733,51.7816119 C39.2995492,51.7950669 39.2781907,51.8079414 39.2566895,51.8204663 C39.2236044,51.8395831 39.1899714,51.8581562 39.1558764,51.875966 L39.1158176,51.8965512 C39.0852208,51.9117193 39.0542257,51.9264152 39.0228881,51.9404845 C39.001496,51.9501454 38.9797673,51.959518 38.9579395,51.9685663 C38.9300801,51.9800992 38.9024913,51.9909732 38.8746677,52.0013656 L38.8025919,52.0269593 C38.7805846,52.0344803 38.7586811,52.0415607 38.7366477,52.0483446 C38.706391,52.057548 38.6759498,52.0662748 38.645389,52.0744108 C38.5630973,52.0964627 38.4792945,52.114266 38.3940583,52.1277616 C38.3727059,52.1310321 38.3516194,52.1340997 38.3305059,52.1368971 L38.164385,52.1533222 L38.0000093,52.1586399 L37.9990052,52.1586397 C37.8718303,52.1585853 37.7444354,52.1488334 37.6183044,52.1294345 L37.5004321,52.1082447 C36.7351727,52.2639002 35.9086169,52.0597211 35.2942137,51.4862781 L20.2942137,37.4862781 C19.284837,36.5441932 19.2302862,34.962221 20.1723711,33.9528443 C21.114456,32.9434676 22.6964282,32.8889168 23.7058049,33.8310017 L35.5,44.8396399 L35.5000093,2.65863992 C35.5000093,1.27792804 36.6192974,0.158639918 38.0000093,0.158639918 Z" fill="#000000" fillRule="nonzero" />
                                                    </g>
                                                  </svg>
                                                }
                                                <span role="none">Download</span>
                                              </button> */}

                                            </div>

                                            <div role="none">
                                              <button className="dark:text-gray-300 dark:hover:bg-gray-100 flex items-center px-3.5 py-2.5 hover:bg-gray-100 w-full text-sm space-x-3 active:bg-blue-100 text-red-600" role="none"
                                                onClick={() => {
                                                  setshowModalForDelete(true)
                                                  setDeleteFolderId(data.id)
                                                  if (popupRef.current) {
                                                    setOpenPopupIndex(null);
                                                  }
                                                }}
                                              >
                                                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" role="none">
                                                  <path d="M2.19,5.13c-.12,2.74-.09,5.49,.31,8.26,.22,1.48,1.47,2.61,2.97,2.61h5.03c1.51,0,2.76-1.12,2.97-2.61,.4-2.77,.44-5.52,.31-8.26H2.19Z" fill="#F98080" fillRule="evenodd" role="none"></path>
                                                  <path d="M6.58,8.02c0-.39-.32-.71-.71-.71s-.71,.32-.71,.71v4.72c0,.39,.32,.71,.71,.71s.71-.32,.71-.71v-4.72Zm4.27,0c0-.39-.32-.71-.71-.71s-.71,.32-.71,.71v4.72c0,.39,.32,.71,.71,.71s.71-.32,.71-.71v-4.72Z" fill="#E02424" fillRule="evenodd" role="none"></path>
                                                  <path d="M6.59,2.3c.37-.37,.88-.58,1.41-.58s1.04,.21,1.41,.58c.31,.31,.5,.7,.56,1.12h-3.95c.06-.42,.26-.82,.56-1.12Zm-2.29,1.12c.07-.88,.45-1.71,1.07-2.33C6.07,.39,7.02,0,8,0s1.93,.39,2.62,1.09c.63,.63,1.01,1.46,1.07,2.33h3.17c.47,0,.86,.38,.86,.86s-.38,.86-.86,.86H1.14c-.47,0-.86-.38-.86-.86s.38-.86,.86-.86h3.16Z" fill="#E02424" fillRule="evenodd" role="none"></path>
                                                </svg>
                                                <span role="none">Move to Trash</span>
                                              </button>
                                            </div>
                                          </div>
                                        )}
                                      </>
                                    }

                                  </span>
                                </td>
                              </tr>
                            ))
                            }
                          </>
                        }

                      </tbody>
                    </table>




                    
                  </div>

                  </>
                  :
                  null
                }
              </>
              :
              documentData &&
              <>
                <div className="flex flex-wrap">
                  {documentData.map((data, index) => {
                    return (
                      <div key={index} title={"Open " + data.title} className="dark:bg-black dark:text-gray-200 dark:border-slate-500 relative m-3 transition-all p-3 group cursor-pointer hover:bg-blue-50 border rounded-xl w-[240px] h-[280px]">

                        <div className="dark:bg-gray-800 opacity-0 group-hover:opacity-100 absolute right-5 top-5">
                          <span className="relative inline-block text-left" data-headlessui-state="">
                            <button type="button" className="transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-2 active:ring-1" id="headlessui-menu-button-:r2e:" aria-haspopup="menu" aria-expanded="false" data-headlessui-state=""
                              onClick={() => handlePopUpMenu(index)}
                            >
                              <DocumentsIcons />
                            </button>
                            {props.SHOW == "trash"
                              ?
                              <>
                                {openPopupIndex === index && (
                                  <>
                                    <div className=" z-20 absolute right-0 mt-1 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white text-gray-600 text-sm font-medium shadow-md border border-gray-200 focus:outline-none transform opacity-100 scale-100" aria-labelledby="headlessui-menu-button-:r6e:" id="headlessui-menu-items-:r79:" role="menu" tabIndex="0" data-headlessui-state="open">
                                      <div role="none">
                                        <button className="flex items-center px-3.5 py-2.5 hover:bg-gray-100 w-full text-sm space-x-3 active:bg-blue-100 text-red-600" role="none"
                                          onClick={() => {
                                            const formData = {
                                              trash: false
                                            }
                                            _update_document_data(formData, data.id, "Restored")
                                            if (popupRef.current) {
                                              setOpenPopupIndex(null);
                                            }
                                          }}
                                        >
                                          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" role="none">
                                            <path d="M2.15,5.13c-.12,2.74-.09,5.49,.32,8.26,.22,1.49,1.48,2.61,2.99,2.61h5.08c1.51,0,2.77-1.12,2.99-2.61,.41-2.77,.44-5.52,.32-8.26H2.15Z" fill="#9CA3AF" fillRule="evenodd" role="none"></path>
                                            <path d="M5.85,6.77c.54-.47,1.37-.08,1.37,.63v.76h1.5c1.66,0,3,1.34,3,3s-1.34,3-3,3h-.78c-.39,0-.71-.32-.71-.71s.32-.71,.71-.71h.78c.87,0,1.57-.7,1.57-1.57s-.7-1.57-1.57-1.57h-1.5v.77c0,.7-.81,1.09-1.36,.64-.65-.54-1.04-.93-1.54-1.57-.26-.34-.25-.81,.02-1.13,.53-.63,.92-1.01,1.51-1.52Z" fill="#4B5563" fillRule="evenodd" role="none"></path>
                                            <path d="M6.59,2.3c.37-.37,.88-.58,1.41-.58s1.04,.21,1.41,.58c.31,.31,.5,.7,.56,1.12h-3.95c.06-.42,.26-.82,.56-1.12Zm-2.29,1.12c.07-.88,.45-1.71,1.07-2.33,.7-.7,1.64-1.09,2.62-1.09s1.93,.39,2.62,1.09c.63,.63,1.01,1.46,1.07,2.33h3.21c.47,0,.86,.38,.86,.86s-.38,.86-.86,.86H1.1c-.47,0-.86-.38-.86-.86s.38-.86,.86-.86h3.2Z" fill="#4B5563" fillRule="evenodd" role="none"></path>
                                          </svg>
                                          <span role="none">Restore</span>
                                        </button>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </>
                              :
                              <>
                                {openPopupIndex === index && (
                                  <div className="dark:bg-gray-800  dark:text-gray-300 z-20 absolute right-0 mt-1 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white text-gray-600 text-sm font-medium shadow-md border border-gray-200 focus:outline-none transform opacity-100 scale-100" aria-labelledby="headlessui-menu-button-:r6e:" id="headlessui-menu-items-:r79:" role="menu" tabIndex="0" data-headlessui-state="open">
                                    <div role="none">
                                      <button type="button" className="dark:hover:bg-gray-100 flex items-center px-3.5 py-2.5 hover:bg-gray-100 w-full text-sm space-x-3 active:bg-blue-100" role="none">
                                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" role="none">
                                          <path d="M8,0c.22,0,.41,.13,.51,.33l2.23,4.51,4.78,.82c.21,.04,.39,.19,.45,.41,.07,.21,.01,.45-.14,.61l-3.4,3.62,.73,5.02c.03,.22-.06,.45-.23,.58-.17,.13-.4,.15-.6,.05l-4.34-2.27-4.32,2.27c-.19,.1-.42,.08-.6-.05-.17-.13-.26-.36-.23-.58l.73-5.02L.17,6.67c-.15-.16-.2-.4-.14-.61,.07-.21,.24-.37,.46-.41l4.79-.82L7.49,.33c.1-.2,.3-.33,.51-.33Z" fill="#9CA3AF" fillRule="evenodd" role="none"></path>
                                        </svg>
                                        <span role="none">Add to favorites</span>
                                      </button>
                                      <button className="flex items-center px-3.5 py-2.5 hover:bg-gray-100 w-full text-sm space-x-3 active:bg-blue-100" role="none"
                                        onClick={() => {
                                          setRenameDiv(true)
                                          setRenameId(data.id)
                                          if (popupRef.current) {
                                            setOpenPopupIndex(null);
                                          }
                                          setInputText(data.title)
                                        }}
                                      >
                                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" role="none">
                                          <path d="M.09,7.46c.05-.96,.15-1.9,.25-2.79,.11-1.01,.65-1.88,1.42-2.45,.49-.37,1.07-.61,1.71-.68,.95-.11,1.96-.22,3-.27,.07,0,.15,0,.22,.01,.24,0,.47-.01,.71-.01,1.38,0,2.73,.15,3.96,.29,1.62,.19,2.92,1.48,3.1,3.11l-1.01,.11,1.01-.11c.14,1.23,.28,2.56,.28,3.94,0,.29,0,.58-.02,.87,.01,.08,.02,.17,.02,.26-.05,.96-.15,1.9-.25,2.79-.11,1.01-.65,1.88-1.42,2.45-.49,.37-1.07,.61-1.71,.68-.95,.11-1.96,.22-3,.27-.08,0-.15,0-.22-.01-.24,0-.47,.01-.71,.01-1.38,0-2.73-.15-3.96-.29-1.62-.19-2.92-1.48-3.1-3.11-.14-1.23-.28-2.56-.28-3.94,0-.29,0-.58,.02-.87-.01-.08-.02-.17-.02-.26Z" fill="#9CA3AF" fillRule="evenodd" role="none"></path>
                                          <path d="M12.06,.79c.86-.92,2.31-.95,3.2-.06,.89,.89,.86,2.34-.06,3.2l-4.09,3.79c-.18,.17-.39,.29-.62,.37l-1.71,.57c-.89,.3-1.74-.55-1.44-1.45l.57-1.71c.08-.23,.2-.44,.37-.62L12.06,.79Z" fill="#4B5563" fillRule="evenodd" role="none"></path>
                                        </svg>
                                        <span role="none">Rename</span>
                                      </button>
                                      
                                    </div>
                                    <div role="none">
                                      <button className="flex items-center px-3.5 py-2.5 hover:bg-gray-100 w-full text-sm space-x-3 active:bg-blue-100 text-red-600" role="none"
                                        onClick={() => {
                                          setshowModalForDelete(true)
                                          setDeleteFolderId(data.id)
                                          if (popupRef.current) {
                                            setOpenPopupIndex(null);
                                          }
                                        }}>
                                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" role="none">
                                          <path d="M2.19,5.13c-.12,2.74-.09,5.49,.31,8.26,.22,1.48,1.47,2.61,2.97,2.61h5.03c1.51,0,2.76-1.12,2.97-2.61,.4-2.77,.44-5.52,.31-8.26H2.19Z" fill="#F98080" fillRule="evenodd" role="none"></path>
                                          <path d="M6.58,8.02c0-.39-.32-.71-.71-.71s-.71,.32-.71,.71v4.72c0,.39,.32,.71,.71,.71s.71-.32,.71-.71v-4.72Zm4.27,0c0-.39-.32-.71-.71-.71s-.71,.32-.71,.71v4.72c0,.39,.32,.71,.71,.71s.71-.32,.71-.71v-4.72Z" fill="#E02424" fillRule="evenodd" role="none"></path>
                                          <path d="M6.59,2.3c.37-.37,.88-.58,1.41-.58s1.04,.21,1.41,.58c.31,.31,.5,.7,.56,1.12h-3.95c.06-.42,.26-.82,.56-1.12Zm-2.29,1.12c.07-.88,.45-1.71,1.07-2.33C6.07,.39,7.02,0,8,0s1.93,.39,2.62,1.09c.63,.63,1.01,1.46,1.07,2.33h3.17c.47,0,.86,.38,.86,.86s-.38,.86-.86,.86H1.14c-.47,0-.86-.38-.86-.86s.38-.86,.86-.86h3.16Z" fill="#E02424" fillRule="evenodd" role="none"></path>
                                        </svg>
                                        <span role="none">Delete</span>
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </>
                            }

                          </span>
                        </div>

                        <div className="flex flex-col justify-between h-full"
                          onClick={() => {
                            navigate(`/template_data/${data.id}?template_editing=edit_by_user&template_used=redirect_from_doc_page`)
                          }}
                        >
                          <div className="text-[8px] dark:bg-slate-500 dark:text-white bg-white border rounded-xl px-3 grow break-words space-y-2 overflow-hidden">
                            <RenderHtml htmldata={data.document_content} />
                          </div>
                          <div className="text-gray-700 text-sm font-medium pt-1 pb-1.5 dark:text-white">{data.title}</div>
                          <div className="flex flex-row text-gray-500 text-xs font-normal">
                            <div>{data.updated_at}</div>
                          </div>
                          <div className="absolute right-1.5 bottom-1.5">
                            <div className="relative" data-headlessui-state="">
                              <button >
                                <span className="sr-only">DRAFT</span>
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" clipRule="evenodd" d="M12.9999 0.429993C9.41404 0.429993 6.49152 1.44118 4.46633 3.46639C2.44112 5.49158 1.42993 8.4141 1.42993 12C1.42993 15.5859 2.44112 18.5083 4.46633 20.5337C6.49152 22.5589 9.41404 23.57 12.9999 23.57C16.5858 23.57 19.5083 22.5589 21.5336 20.5337C23.5588 18.5083 24.5699 15.5859 24.5699 12C24.5699 8.4141 23.5588 5.49158 21.5336 3.46639C19.5083 1.44118 16.5858 0.429993 12.9999 0.429993Z" fill="#F3F4F6"></path>
                                  <path fillRule="evenodd" clipRule="evenodd" d="M13 4.28668C10.6094 4.28668 8.66102 4.96081 7.31089 6.31095C5.96075 7.66108 5.28662 9.60942 5.28662 12C5.28662 14.3906 5.96075 16.3389 7.31089 17.6891C8.66102 19.0393 10.6094 19.7133 13 19.7133C15.3906 19.7133 17.3388 19.0393 18.6891 17.6891C20.0392 16.3389 20.7133 14.3906 20.7133 12C20.7133 9.60942 20.0392 7.66108 18.6891 6.31095C17.3388 4.96081 15.3906 4.28668 13 4.28668Z" fill="#D1D5DB"></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                        


                      </div>
                    )
                  })}
                </div>
              </>
            }
            {RenameDiv
                      ?
                      <>
                        <div className="fixed inset-0 z-40 overflow-y-auto" id="headlessui-dialog-:rdn:" role="dialog" aria-modal="true" data-headlessui-state="open">
                          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
                            <div className="fixed inset-0 transition-opacity bg-gray-600 bg-opacity-50" id="headlessui-dialog-overlay-:rdo:" aria-hidden="true" data-headlessui-state="open"></div>
                            <div className="dark:bg-gray-700 dark:text-gray-200  relative h-full bg-white text-gray-900 rounded-md shadow-xl align-top sm:align-middle w-full sm:w-[416px]">
                              <div className="w-full text-left flex justify-between items-center p-6 text-gray-900  border-b border-gray-200">
                                <h3 className="dark:text-gray-400 text-lg font-semibold">Rename document</h3>
                              </div>
                              <div className="flex flex-col p-6">
                                <div className="p-6">
                                  <div className="space-y-1.5 w-full">
                                    <label htmlFor="rename-document" className="sr-only "><span className="flex items-center space-x-1"><span>Rename document</span></span></label>
                                    <div className="dark:bg-gray-800 py-1 !mt-0 flex items-center gap-2 bg-white w-full px-3 rounded-lg ring-1 hover:ring-2 transition-all duration-150 ease-in-out ring-gray-200 outline-none focus-within:!ring-1">
                                      <div className="dark:bg-gray-800 flex items-center grow gap-2 py-1.5">
                                        <div className="dark:bg-gray-800 flex gap-1 grow">
                                          <input
                                            value={inputText} onChange={handleInputChange}
                                            id="rename-document" type="text" className="dark:bg-gray-800 dark:text-gray-200 block w-full text-gray-900 placeholder:text-gray-400 text-sm font-normal resize-none outline-none" placeholder="Document name" name="name" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="p-6 flex items-center gap-4 justify-end"><button
                                  onClick={() => {
                                    setRenameDiv(false)
                                  }} type="button" className="transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-2 active:ring-1"><span className="flex items-center justify-center mx-auto space-x-2 select-none">Cancel</span></button>
                                  <button
                                    onClick={() => {
                                      const formData = {
                                        title: inputText
                                      }
                                      _update_name_(formData, RenameId, "Title updated")
                                    }}
                                    type="button" className="transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm bg-blue-600 text-white ring-0 ring-blue-600 hover:ring-2 active:ring-0"><span className="flex items-center justify-center mx-auto space-x-2 select-none">Save</span></button></div>

                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                      :
                      null}
            {ChangeFolderDiv
              ?
              <>
                <div className="fixed inset-0 z-40 overflow-y-auto" id="headlessui-dialog-:rdn:" role="dialog" aria-modal="true" data-headlessui-state="open">
                  <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
                    <div className="fixed inset-0 transition-opacity bg-gray-600 bg-opacity-50" id="headlessui-dialog-overlay-:rdo:" aria-hidden="true" data-headlessui-state="open"></div>
                    <div className="dark:bg-gray-700  dark:text-gray-200 dark:border-slate-500 relative h-full bg-white text-gray-900 rounded-md shadow-xl align-top sm:align-middle w-full sm:w-[416px]">
                      <div className="w-full text-left flex justify-between items-center p-6 text-gray-900  border-b border-gray-200">
                        <h3 className="dark:text-white text-lg font-semibold">Move to folder</h3>
                      </div>
                      <div className="flex flex-col p-6">
                        <div className="p-6">
                          <div className="space-y-1.5 w-full">
                            <div className="relative inline-block text-left w-full ">
                              {/* ============select field================= */}
                              <select
                                className="dark:text-black p-1 ring-1 font-semibold ring-gray-200 w-[200px] text-left space-y-3 hover:ring-gray-300 active:ring-gray-400"
                                id="selectField"
                                value={selectedValue}
                                onChange={handleSelectChange}
                              >
                                <option value="" >choose your folder ...</option>

                                {SelectedOptions &&
                                  SelectedOptions.map((data, index) => {
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
                        <div className="p-6 flex items-center gap-4 justify-end"><button
                          onClick={() => {
                            setChangeFolderDiv(false)
                            setSelectedValue(null)
                          }} type="button" className="transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-2 active:ring-1"><span className="flex items-center justify-center mx-auto space-x-2 select-none">
                            Cancel</span></button>
                          <button
                            onClick={() => {
                              update_folder()
                              if (popupRef.current) {
                                setOpenPopupIndex(null);
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
              <div className="fixed inset-0 z-40 overflow-y-auto" id="headlessui-dialog-:rdn:" role="dialog" aria-modal="true" data-headlessui-state="open">
                          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
                            <div className="fixed inset-0 transition-opacity bg-gray-600 bg-opacity-50" id="headlessui-dialog-overlay-:rdo:" aria-hidden="true" data-headlessui-state="open"></div>
                            <div className="dark:bg-gray-600 dark:text-gray-200 dark:border-slate-500 relative h-full bg-white text-gray-900 rounded-md shadow-xl align-top sm:align-middle w-full sm:w-[416px]">
                              <div className="w-full text-left flex justify-between items-center p-6 text-gray-900  border-b border-gray-200">

                              <div className="flex">
                                <div className="mt-5 ml-4 mr-5 ">
                                  <DangerIcon/>  
                                </div>
                              <div>
                                <h3 className="dark:text-white text-lg font-semibold">
                                    Move to Trash !!
                                </h3>
                              </div>
                              </div>
                              </div>
                              <div className="flex flex-col p-6">
                                
                                <div className="p-6 flex items-center gap-4 justify-end">


                              <button
                                className="dark:text-white w-full mt-2 p-2.5 flex-1 text-white bg-red-600 rounded-md outline-none ring-offset-2 ring-red-600 focus:ring-2"
                                onClick={() => {
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
                                onClick={() => {
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
              </>
            ) : null}





            {showModalForPermanentlyDelete ? (
              <>
              <div className="fixed inset-0 z-40 overflow-y-auto" id="headlessui-dialog-:rdn:" role="dialog" aria-modal="true" data-headlessui-state="open">
                          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
                            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-50" id="headlessui-dialog-overlay-:rdo:" aria-hidden="true" data-headlessui-state="open"></div>
                            <div className="relative h-full bg-white text-gray-900 rounded-md shadow-xl align-top sm:align-middle w-full sm:w-[416px]">
                              <div className="dark:bg-slate-700 dark:text-white w-full text-left flex justify-between items-center p-6 text-gray-900  border-b border-gray-200">

                              <div className="flex">
                                <div className="mt-10 ml-4 mr-5 ">
                                  <DangerIcon/>  
                                </div>
                              <div>
                                <h3 className="dark:bg-slate-700 dark:text-white  text-2xl font-helv font-medium text-red-800">
                                    Delete it permanently.Once delete cannot be recover.
                                </h3>
                              </div>
                              </div>
                              </div>
                                
                                <div className="dark:bg-slate-700 dark:text-white  p-6 flex items-center gap-4 justify-end">


                                <button
                                  className="w-full p-2.5 flex-1 text-white bg-red-600 rounded-md outline-none ring-offset-2 ring-red-600 focus:ring-2"
                                  onClick={() => {
                                    const formData = {
                                        "id":DeleteFolderId
                                    }
                                    permanently_delete_multiple_data(formData,"Deleted")
                                  }}
                                >
                                  Delete
                                </button>
                                <button
                                  className="dark:text-white w-full  p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-indigo-600 focus:ring-2"
                                  onClick={() => {
                                    setshowModalForPermanentlyDelete(false)
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
              </>
            ) : null}


          </div>
        </div>
      }

      {/* ===========pagination================== */}
      {/* count */}
      {documentData &&
      <>
        {documentData.length>=20 || totalPages>1
        ?
        <>
          {props.ShowDashboard
            ?
            null
            :
            <>
              {showpagination
                ?
                <>
                  <div className="flex items-center justify-center mt-9">
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className={`text-gray-600 ${currentPage === 1 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      Previous
                    </button>
                    <div className="flex items-center mx-4">
                      {getVisiblePageNumbers().map((page) => (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-4 py-2 rounded-md mx-1 ${currentPage === page
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className={`text-gray-600 ${currentPage === totalPages ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      Next
                    </button>
                  </div>
                </>
                :
                null
              }
            </>
          }
          </>
        :
          null
        }
      </>
      }


      {/* ===========pagination================== */}

    </>
  );
};

export default ListOfDocument;
