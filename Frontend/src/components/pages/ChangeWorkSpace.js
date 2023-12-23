import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL,BACK_END_API_INITIAL_WORKSPACE,BACK_END_API_WORKSPACE } from '../../apis/urls';
import { postData,fetchData } from '../../apis/apiService';

const ChangeWorkSpace = () => {
    const navigate=useNavigate()
    const divRef = useRef(null);
  
    const [workspacelist,setworkspacelist]=useState(null)
    const [searchTerm, setSearchTerm] = useState('');


    let WorkspaceId = useSelector(
        (state) => state.SetWorkspaceId.WorkspaceId
      );

    let TOKEN = useSelector(
    (state) => state.SetAuthenticationToken.AuthenticationToken
    );

    useEffect(()=>{
        setworkspacelist(WorkspaceId)
    },[])


  const handleClickOutside = (event) => {
    // if (divRef.current && !divRef.current.contains(event.target)) {
    //   navigate("/")
    // }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const initial_workspace = async(ids) => {
    const formData={
        id:ids
    }
    const workspace_list = await postData(formData,BACKEND_URL+BACK_END_API_INITIAL_WORKSPACE,TOKEN)
      if(workspace_list.status=200){
        try{
          localStorage.setItem("chose_workspace",JSON.stringify(workspace_list.data[0]))
          window.location.replace("/");
        }catch(e){
        }

    }
  }

  const search_for_workspace = async(search_text) => {
    const workspace_list = await fetchData(BACKEND_URL+BACK_END_API_WORKSPACE+"?search="+search_text,TOKEN)
      if(workspace_list.status=200){
        try{
            setworkspacelist(workspace_list.data)
        }catch(e){
        }

    }

  }

  const handleSearch = (event) => {
    const searchText = event.target.value;
    setSearchTerm(searchText);
    search_for_workspace(searchText)
  };


  return (
    <>
        <div  className="fixed inset-0 z-40 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
                    <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-50 opacity-100" ></div>
                    <div className="relative h-full bg-white text-gray-900 rounded-md shadow-xl align-top sm:align-middle w-full sm:w-[416px] md:w-[640px] opacity-100 translate-y-0 sm:scale-100">
                        <div ref={divRef}  className="dark:bg-gray-600 dark:text-gray-200 dark:border-slate-500 flex flex-col p-6">
                        {/* ====================close switch workspace================ */}
                        <div className="w-full text-left flex justify-between p-2 items-center text-gray-900  border-b border-gray-200">
                                <h1 className="dark:text-white mb-2 text-lg font-semibold text-gray-900">
                                    Select a Workspace
                                </h1>
                            <button className="p-2 hover:bg-gray-100 rounded-full hover:cursor-pointer"
                            onClick={()=>{
                                window.location.replace('/')
                            }}>
                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M21.45,21.44L2.55,2.56" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
                                    <path d="M2.55,21.44L21.45,2.56" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
                                </svg>
                            </button>
                            </div>
                        {/* ====================close switch workspace================ */}
                        
                            <div className="-m-6 divide-y divide-gray-200">
                            <div className="p-6 space-y-4">
                                <div className="space-y-1">
                                    <div className="flex">
                                        {/* ============search field================= */}
                                        

                                                <div className=" relative w-full">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-400 left-3"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                        />
                                                    </svg>
                                                    <input
                                                        type="text"
                                                        placeholder="Search"
                                                        className="w-full py-3 pl-12 pr-4 text-gray-500 border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-indigo-600"
                                                        value={searchTerm}
                                                        onChange={handleSearch}
                                                    />
                                                </div>
                                        {/* ========================================= */}
                                    </div>
                                    <div className="mt-3">
                                        <hr className="dark:bg-black dark:hidden"></hr>
                                    </div>

                                    {/* ========list of workshop============ */}

                                    {workspacelist&&
                                    <>
                                        {workspacelist.map((data,index)=>{
                                        return (
                                            <div className= "dark:text-white dark:border-gray-500 dark:shadow-2xl dark:border-b  overflow-y-auto max-h-80 cursor-pointer"
                                            onClick={()=>{
                                                    initial_workspace(data.Workspace_Id)
                                                }}>
                                                <div className="dark:bg-slate-600 dark:text-white dark:border-white w-full flex text-left items-center px-3 py-2 space-x-3 text-sm border-b border-gray-200 last:border-0 bg-gray-100 pointer-events-none font-medium text-gray-800">
                                                    <div className="bg-amber-700 text-xs w-6 h-6 rounded-full font-bold text-white flex items-center justify-center" 
                                                    >
                                                        <img src="https://aiprojectfilestorage.s3.ap-southeast-2.amazonaws.com/frontend-images/default.png" className='rounded-full'/>
                                                    </div>
                                                    <div className="dark:text-white flex flex-col flex-grow truncate">
                                                        <div>{data.workspace_name}</div>
                                                        <div className="dark:text-white text-sm text-gray-400 ">{data.to_show_admin_user_email}</div>
                                                    </div>
                                                    <div className="dark:text-white text-xs text-gray-500">{data.team_member_count}</div>
                                                </div>    
                                            </div>
                                        )
                                    })}
                                    </>
                                    }
                                    {/* ========list of workshop============ */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default ChangeWorkSpace