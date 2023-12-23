import React,{useEffect,useState,useRef} from 'react'
import { useSelector, useDispatch } from "react-redux";
import { fetchData ,postData} from '../../../apis/apiService'
import { BACKEND_URL,BACK_END_API_DOCUMENTS,BACK_END_API_WORKFLOW } from '../../../apis/urls'
import { useNavigate } from "react-router-dom";
import LoadingPage from '../../LoadingPage';


import {
    _load_screen_
  } from "../../../features/LoadingScreen";
import {
    _message_
  } from "../../../features/LoadingScreenMessage";
import toast, { Toaster } from 'react-hot-toast';


const Workflow = (props) => {

    const textRef = useRef(null);
    let navigate = useNavigate();
    const dispatch = useDispatch();

    const notifyerror = (message) => toast.error(message);


    const [workflow_data,set_workflow_data]=useState(null)
    let ChosenWorkspaceId = useSelector(
    (state) => state.SetChosenWorkspaceId.ChosenWorkspaceId
    );


    const get_workflow_data = async() =>{
        const resp = await fetchData(BACKEND_URL+BACK_END_API_WORKFLOW,props.AUTH_TOKEN)
        if(resp.status==200){
            set_workflow_data(resp.data)
        }
    }


    useEffect(()=>{
        if(props.AUTH_TOKEN){
            get_workflow_data()
        }
    },[])



    const create_new_document_for_workflow = async(workflow_id) => {
        const formData = {
          document_content: "",
          workspace_id:ChosenWorkspaceId["Workspace_Id"]
        }
        console.log(formData)
        
        const resp = await postData(formData,BACKEND_URL+BACK_END_API_DOCUMENTS+"/",props.AUTH_TOKEN)
        try{
          if(resp.status==201){
              dispatch(_load_screen_(false))
              dispatch(_message_(""))
              navigate(`/template_data/${resp.data.id}?template_editing=edit_by_user&content=chat_content&redirect=from_blank_document&page=workflow&workflow_id=${workflow_id}`)
          }else{
              notifyerror("something went wrong refresh page")
          }
        }catch(e){
            notifyerror("something went wrong refresh page")
            dispatch(_load_screen_(false))
            dispatch(_message_(""))
            // navigate("/")
        }
    }


  return (
    <>
        <div className="p-6">
        <div>
            <div className="dark:bg-black dark:text-white cursor-pointer border inline-flex items-center justify-center mr-2 mb-2 px-3.5 py-1 text-sm font-medium rounded-full border-blue-800 bg-blue-800 focusRing text-black hover:bg-opacity-100">
            All</div>
        </div>

        <div className="my-2 grid gap-5 mb-12 sm:grid-cols-2">

        {workflow_data &&
        <>
            {workflow_data.map((data,index)=>{
            return (
                <>
                    <div 
                    key={index}
                    onClick={()=>{
                        dispatch(_load_screen_(true))
                        dispatch(_message_("Creating Document"))
                        create_new_document_for_workflow(data.id)
                    }}
                    >
                        <div  id={`template-card-${data.id}`} className="dark:bg-gray-800 dark:text-gray-200 dark:border-slate-500 cursor-pointer relative p-6 transition-all h-full focus:ring-gray-400 focus:shadow-xl duration-150 rounded-2xl shadow-sm hover:shadow-lg hover:ring-gray-300 hover:ring-2 ring-1 ring-gray-200 group flex flex-col bg-white">
                            <div className="!absolute top-4 right-4"></div>
                            <div className="flex flex-col space-y-2">
                                <img src={data.icon} className="w-8 h-8" alt="frame icon" />
                                <div className="dark:text-white text-left font-semibold text-gray-700">{data.title}</div>
                                <div className="text-gray-500 dark:text-white">{data.description}</div>
                            </div>
                        </div>
                    </div>
                </>

            )})}
        </>

        }
        </div>


</div>
    </>
  )
}

export default Workflow