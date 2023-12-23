import React,{useState,useEffect} from 'react'
import LoadingPage from '../../../LoadingPage'
import { BACKEND_URL,BACK_END_API_TEMPLATE,BACK_END_API_INNER_TEMPLATE } from '../../../../apis/urls'
import { useSelector, useDispatch } from "react-redux";
import { fetchData } from '../../../../apis/apiService';
import {_template_id_} from '../../../../features/LeftTemplateId';

const WholeTemplateRender = ({template_data}) => {
    
    const dispatch = useDispatch();

    const [ListOfTemplate,setListOfTemplate] = useState(null)
    const [searchValue, setSearchValue] = useState('');

    let TOKEN = useSelector(
        (state) => state.SetAuthenticationToken.AuthenticationToken
      );

    let DarkMode = useSelector((state)=>state.SetDarkMode.DarkMode)


    useEffect(()=>{
        setListOfTemplate(template_data)
    },[])


    const handleSearchChange = async(event) => {
        setSearchValue(event.target.value);
        const response_data = await fetchData(BACKEND_URL+BACK_END_API_TEMPLATE+"?search="+event.target.value,TOKEN)
        if(response_data.status==200){
            setListOfTemplate(response_data.data)
        }else{}
    };

    const _get_single_template_data_ = async(id) => {
        const response_data = await fetchData(BACKEND_URL+BACK_END_API_INNER_TEMPLATE+id,TOKEN)
        if(response_data.status==200){
            dispatch(_template_id_(response_data.data))
        }else{}
    }

  return (
    <>
    <div className="bg-white flex flex-col h-full w-full">



            {/* ========search template======= */}
            <div className="p-2 dark:bg-black">
                <div className="space-y-1.5 w-full dark:bg-black">
                    <label htmlFor="search" className="sr-only"><span className="flex items-center space-x-1"><span>search</span></span></label>
                    <div className="dark:bg-gray-600 py-1 !mt-0 flex items-center gap-2 bg-white w-full px-3 rounded-lg ring-1 hover:ring-2 transition-all duration-150 ease-in-out ring-gray-200 outline-none focus-within:!ring-1">
                        <div className=" flex items-center grow gap-2 py-1.5">

                        {DarkMode
                        ?
                            <svg className="dark:text-black w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                <path d="M6.67,12.44c3.19,0,5.78-2.59,5.78-5.78S9.86,.89,6.67,.89,.89,3.48,.89,6.67s2.59,5.78,5.78,5.78Z" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M15.11,15.11l-4-4" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                        :

                            <svg className="dark:text-black w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                <path d="M6.67,12.44c3.19,0,5.78-2.59,5.78-5.78S9.86,.89,6.67,.89,.89,3.48,.89,6.67s2.59,5.78,5.78,5.78Z" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M15.11,15.11l-4-4" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                        }

                            

                        <div className="flex gap-1 grow dark:text-white">
                            <input
                                id="search"
                                type="search"
                                className="dark:bg-gray-600 dark:text-gray-300 block w-full placeholder:text-gray-400 text-sm font-normal resize-none outline-none"
                                placeholder="Search templates"
                                value={searchValue}
                                onChange={handleSearchChange}
                            />
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* ========search template======= */}


        <ul className="dark:bg-black  space-y-4 flex-1 overflow-auto">
            
            {/* ===================Workflow start======================== */}
            {/* ===================Workflow end======================== */}

            <li>
                <h3 className="dark:text-white px-2 font-semibold text-xs text-slate-800">Templates</h3>
                <ul>
                    
                {ListOfTemplate
                ?
                    ListOfTemplate.map((data,index)=>{
                    return (
                            <li className="px-1" key={index}>
                        <button className="group w-full px-2 py-1 items-center space-x-2 flex hover:bg-slate-200/50 rounded-lg cursor-pointer"
                            onClick={()=>{
                                _get_single_template_data_(data.id)
                            }}
                        >
                            <div className="rounded-full aspect-square w-4 flex justify-center items-center bg-transparent ">
                                {/* <svg viewBox="0 0 146 138" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"> */}
                                <div className="w-6 h-6 mt-[10px]">
                                    <img src={data.icon?data.icon:"/template.png"}  alt="template"/>
                                </div>
                                {/* </svg> */}
                            </div>
                            <div className="flex-1 truncate flex flex-col gap-1.5">
                                <div className="flex justify-between items-center gap-[10px] w-full truncate overflow-hidden">
                                    <div className="text-xs truncate whitespace-nowrap">{data.title}</div>
                                    <div className="aspect-1 origin-center scale-90 hover:scale-100 transition-all duration-100 opacity-50 group-hover:opacity-100">
                                    {/* <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                        <path d="M8,1.33c.18,0,.34,.1,.43,.27l1.86,3.76,3.98,.68c.18,.03,.32,.16,.38,.34,.06,.18,.01,.38-.11,.51l-2.83,3.02,.61,4.18c.03,.19-.05,.37-.19,.48-.15,.11-.34,.13-.5,.04l-3.61-1.89-3.6,1.89c-.16,.09-.35,.07-.5-.04-.15-.11-.22-.3-.19-.48l.61-4.18L1.47,6.89c-.13-.13-.17-.33-.11-.51,.06-.18,.2-.31,.38-.34l3.99-.68,1.85-3.76c.08-.17,.25-.27,.43-.27Z" fill="none" fillRule="evenodd" stroke="#4B5563" strokeWidth="1"></path>
                                    </svg> */}
                                    </div>
                                </div>
                            </div>
                        </button>
                            </li>
                    )
                })
                :
                    <LoadingPage/>
                }
                

                </ul>
            </li>
        </ul>


        
        </div>
    </>
  )
}

export default WholeTemplateRender