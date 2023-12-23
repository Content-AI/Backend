import React , {useState,useEffect}from 'react'
import ModalAddVoice from './ModalAddVoice'

import toast, { Toaster } from 'react-hot-toast';

import { fetchData, postData,patchData } from '../../../apis/apiService';
import { BACKEND_URL,BACK_END_API_BRAND_VOICE } from '../../../apis/urls';
import EditBrandVoice from './EditBrandVoice';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';

import { setDocumentTitle } from '../../NavBar/DynamicTitle';

const Brandvoice = (props) => {

  const navigate = useNavigate()


  useEffect(() => {
    setDocumentTitle("Brand Voice");
  }, []);

  const [showAddVoiceModal,setshowAddVoiceModal]=useState(false)
  const [BrandVoiceData,setBrandVoiceData]=useState(null)
  const [showModalForDelete,setshowModalForDelete]=useState(false)
  const [DeleteBrandVoiceId,setDeleteBrandVoiceId]=useState(null)
  const [Edit_BrandVoice,setEdit_BrandVoice]=useState(false)

  const notifyerror = (message) => toast.error(message);
  const notifysuccess = (message) => toast.success(message);


  const get_brand_voice = async() => {
    const resp = await fetchData(BACKEND_URL+BACK_END_API_BRAND_VOICE,props.AUTH_TOKEN)
    if(resp.status==200){
      setBrandVoiceData(resp.data.results)
    }
  }

  useEffect(()=>{
    get_brand_voice()
  },[showAddVoiceModal,Edit_BrandVoice])


  let Subscriptions = useSelector(
    (state) =>state.SetSubscriptions.Subscriptions
  );
  
  const handleDelete = (id) => {
    setBrandVoiceData((prevBrandVoice) =>
      prevBrandVoice.filter((brandvoice) => brandvoice.id !== id)
    );
    setshowModalForDelete(false)
  };

  const _update_document_data = async (data, id, message) => {
    handleDelete(id)
    const resp = await patchData(data, BACKEND_URL + BACK_END_API_BRAND_VOICE + id + "/", props.AUTH_TOKEN)
    if (resp.status == 201) {
      notifysuccess(message)
    } else {
      notifyerror("something went wrong")
    }
  }

  return (
    <>
      <div className="w-full px-5 lg:px-8 py-6">
        <div className="flex flex-col">
        {BrandVoiceData &&
            <>
              {BrandVoiceData.length>0
              ?
                null
              :
                <div className="mb-8 p-px rounded-lg bg-gradient-to-r  from-[#A42AF6] to-[#27f5b0] shadow-md drop-shadow-md hover:to-pink-400 hover:from">
                  <div className="rounded-md h-full w-full bg-white">
                      <div className="dark:bg-slate-600 dark:text-white p-4 space-y-1">
                        <div className="flex flex-row space-x-2 items-center">
                          <svg className="w-8 h-8 mt-1" xmlns="http://www.w3.org/2000/svg" data-name="Layer 51" viewBox="0 0 100 125" x="0px" y="0px">
                            <path d="M67.86,56V50.83a4.48,4.48,0,0,0-4.47-4.47H61.14V40.09a11.14,11.14,0,1,0-22.28,0v6.27H36.61a4.48,4.48,0,0,0-4.47,4.47V56A17.88,17.88,0,0,0,44.79,73v7.69H42.21A5.26,5.26,0,0,0,37,86v4a1.5,1.5,0,0,0,1.5,1.5H61.54A1.5,1.5,0,0,0,63,90V86a5.26,5.26,0,0,0-5.25-5.25H55.21V73A17.88,17.88,0,0,0,67.86,56ZM47.79,80.71V73.65a16.36,16.36,0,0,0,4.42,0v7.06ZM50,32a8.15,8.15,0,0,1,8,6.64H55.14a1.5,1.5,0,0,0,0,3h3v4.77h-3a1.5,1.5,0,0,0,0,3h3v4.78h-3a1.5,1.5,0,0,0,0,3H58a8.14,8.14,0,0,1-16,0h2.86a1.5,1.5,0,0,0,0-3h-3V49.36h3a1.5,1.5,0,0,0,0-3h-3V41.59h3a1.5,1.5,0,0,0,0-3H42A8.15,8.15,0,0,1,50,32Z"/>
                            <path d="M65.21,17.81a1.5,1.5,0,0,0,1.06-2.56,23,23,0,0,0-32.54,0,1.52,1.52,0,0,0,0,2.13,1.5,1.5,0,0,0,2.12,0,20,20,0,0,1,28.3,0A1.45,1.45,0,0,0,65.21,17.81Z"/>
                            <path d="M60,23a1.48,1.48,0,0,0,1.06-.44,1.5,1.5,0,0,0,0-2.12,15.62,15.62,0,0,0-22.12,0,1.5,1.5,0,0,0,2.12,2.12,12.63,12.63,0,0,1,17.88,0A1.49,1.49,0,0,0,60,23Z"/>
                            <path d="M44.74,25.34a1.5,1.5,0,1,0,2.13,2.11,4.42,4.42,0,0,1,6.26,0,1.47,1.47,0,0,0,1.06.44,1.5,1.5,0,0,0,1.07-2.55,7.41,7.41,0,0,0-10.52,0Z"/>
                          </svg>
                            <h3 className=" dark:text-white text-lg font-semibold">Begin your journey with brand voices.</h3>
                        </div>
                        <div>
                            <div className="text-sm text-gray-600 dark:text-white font-normal">Utilizing voices empowers AI model to adopt your brand's unique tone and style. Simplify the process of writing like yourself by incorporating voices in chat, documents, and templates.</div>
                        </div>
                      </div>
                  </div>
                </div>
              }
            </>
          }

          {Subscriptions &&
                  Subscriptions.status=="trial"
                  ?
                    BrandVoiceData &&
                      <div className="mt-4 md:mt-0 break-words bg-red-400 text-black p-2 w-full shadow-lg rounded-md">                 
                            <span class="font-semibold">
                              You have {3-BrandVoiceData.length} Voices remaining.
                              Need more?
                              <button class="font-semibold underline underline-offset-2 cursor-pointer"
                              onClick={()=>{
                                navigate("/settings/subscription_plan")
                              }}>
                              Upgrade now
                              </button>
                              </span>
                      </div>
                  :
                    null
              }

            <div className="md:flex flex-row justify-between items-center mb-8 w-full">
            
              <div className="flex flex-col md:w-4/12">
                  <h2 className="dark:text-white  text-xl font-semibold">Your Brand voices</h2>
                  <p className="dark:text-white text-sm text-gray-600 font-normal">Help AI model learn how your brand communicates.</p>
              </div>


              {Subscriptions &&
              <>
                  {Subscriptions.status=="trial"
                  ?
                  <>
                  {BrandVoiceData &&
                    <>
                      {BrandVoiceData.length>=3
                      ?                        
                      <>
                        <div className="mt-4 md:mt-0">
                          <button type="button" className="dark:bg-gray-400 transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-lg px-4 py-2 text-base  text-white bg-slate-300 ring-0  hover:ring-2 active:ring-0 my-2"
                          disabled
                          >
                            <span className="flex items-center justify-center mx-auto space-x-2 select-none">                        
                                Add Brand Voice
                            </span>
                          </button>
                        </div>
                      </>
                      :
                      <>
                        <div className="mt-4 md:mt-0">
                          <button type="button" className="transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-lg px-4 py-2 text-base  text-white bg-[#334977] ring-0 ring-blue-600 hover:ring-2 active:ring-0 my-2"
                            onClick={()=>{
                              setshowAddVoiceModal(true)
                            }}
                          >
                            <span className="flex items-center justify-center mx-auto space-x-2 select-none">                        
                                Add Brand Voice
                            </span>
                          </button>
                        </div>
                      </>
                      }
                    </>
                  }
                  </>
                  :
                  <>
                    <div className="mt-4 md:mt-0">
                      <button type="button" className="transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-lg px-4 py-2 text-base  text-white bg-[#334977] ring-0 ring-blue-600 hover:ring-2 active:ring-0 my-2"
                        onClick={()=>{
                          setshowAddVoiceModal(true)
                        }}
                      >
                        <span className="flex items-center justify-center mx-auto space-x-2 select-none">                        
                            Add Brand Voice
                        </span>
                      </button>
                  </div>
                  </>
                  }
                </>
              }
              
            </div>
            {BrandVoiceData &&
            <>
              {BrandVoiceData.length>0
              ?
                <div className="flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                      <div className="overflow-hidden ring-1 ring-gray-200 md:rounded-lg">
                        <table className="min-w-full">
                            <thead className="bg-gray-50 dark:bg-slate-700 dark:text-white">
                              <tr>
                                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase">
                                    <button className="dark:text-white group inline-flex items-center uppercase">
                                        Voice
                                    </button>
                                  </th>
                                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase"><span className="sr-only">Actions</span></th>
                              </tr>
                        </thead>

                    {BrandVoiceData.map((data,index)=>{
                      return (
                          <tbody className="divide-y divide-gray-100 bg-white" key={index}>
                            <tr>
                                <td className=" dark:bg-slate-700 whitespace-nowrap px-3 py-4 text-sm text-gray-700 cursor-pointer">
                                  <div className="flex flex-row items-center space-x-2">
                                      <p className="dark:text-white text-sm text-gray-900 font-normal">{data.brand_voice}</p>
                                  </div>
                                </td>
                                <td className="dark:bg-slate-700 whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                                  <div className="flex justify-end space-x-10 mr-2">
                                      <button type="button" className="dark:text-white transition-all duration-200 relative font-semibold shadow-sm hover:outline-none focus:outline-none px-2 py-1 text-xs text-center bg-transparent focus:ring-transparent rounded outline-none shadow-transparent" aria-label="Edit"
                                      onClick={()=>{
                                        setEdit_BrandVoice(true)
                                        setDeleteBrandVoiceId(data.id)
                                      }}>
                                        <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                              <path d="M1.74,14.99l5.05-1.3s-.64-1.57-1.76-2.67c-1.12-1.1-2.71-1.74-2.71-1.74L.99,14.23c-.12,.43,.32,.87,.75,.76Z" fill="transparent"></path>
                                              <path d="M6.8,13.68l7.39-7c1.23-1.16,1.13-3.22-.21-4.54-1.31-1.29-3.31-1.38-4.47-.2L2.32,9.28s1.59,.63,2.71,1.73c1.12,1.1,1.76,2.67,1.76,2.67Z" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>
                                              <path d="M1.74,14.99l5.05-1.3s-.64-1.57-1.76-2.67c-1.12-1.1-2.71-1.74-2.71-1.74L.99,14.23c-.12,.43,.32,.87,.75,.76Z" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>
                                            </svg>
                                        </span>
                                      </button>
                                      <button type="button" className="dark:text-white transition-all duration-200 relative font-semibold shadow-sm hover:outline-none focus:outline-none px-2 py-1 text-xs text-center bg-transparent focus:ring-transparent rounded outline-none shadow-transparent" aria-label="Delete"
                                       onClick={()=>{
                                        setshowModalForDelete(true)
                                        setDeleteBrandVoiceId(data.id)
                                       }}>
                                        <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                              <path d="M.86,4.28H15.14" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>
                                              <path d="M13.13,4.28H2.86c-.17,3-.16,5.97,.28,8.95,.17,1.1,1.11,1.91,2.22,1.91h5.26c1.11,0,2.06-.81,2.22-1.91,.45-2.98,.45-5.95,.28-8.95Z" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>
                                              <path d="M5.14,4.28v-.57c0-.76,.3-1.48,.84-2.02,.53-.54,1.26-.84,2.02-.84s1.48,.3,2.02,.84c.53,.54,.83,1.26,.83,2.02v.57" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>
                                              <path d="M6.29,7.34v4.73" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>
                                              <path d="M9.71,7.34v4.73" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>
                                            </svg>
                                        </span>
                                      </button>
                                  </div>
                                </td>
          
                            </tr>
                          </tbody>
                      )
                    })
                    }

                      </table>
                      {showModalForDelete ? (
                            <>
                            <div className="fixed inset-0 z-10 overflow-y-auto custom-backdrop-blur bg-opacity-50">
                                    <div
                                        className="fixed inset-0 w-full h-full"
                                        onClick={() => setshowModalForDelete(false)}
                                    ></div>
                                    <div className="flex items-center min-h-screen px-4 py-8">
                                        <div className="dark:bg-gray-600 dark:text-gray-200 relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
                                            <div className="mt-3 sm:flex flex items-center justify-center">
                                                
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
                                                    <h4 className="dark:text-white text-2xl font-medium text-red-500 m-3">
                                                        Are you sure want to Delete ??
                                                    </h4>
                                                    <div className="items-center gap-2 mt-3 sm:flex">
                                                        <button
                                                            className="dark:text-white w-full mt-2 p-2.5 flex-1 text-white bg-red-600 rounded-md outline-none ring-offset-2 ring-red-600 focus:ring-2"
                                                            onClick={() =>{
                                                              const formData = {
                                                                trash: true
                                                              }
                                                              _update_document_data(formData, DeleteBrandVoiceId, "Deleted")
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

                    </div>
                </div>
              </div>
              </div>
              :
              <p className="text-sm text-gray-500 font-normal">You haven't created any voices yet</p>
              }
            </>
            }
        </div>
        {showAddVoiceModal
        ?
          <>
            <div className="fixed inset-0 z-40 overflow-y-auto" id="headlessui-dialog-:rf:" role="dialog" aria-modal="true" data-headlessui-state="open">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-50 opacity-100" id="headlessui-dialog-overlay-:rg:" aria-hidden="true" data-headlessui-state="open"></div>
                <div className="relative h-full bg-white text-gray-900 rounded-md shadow-xl align-top sm:align-middle w-full sm:w-[416px] md:w-[640px] lg:w-[864px] opacity-100 translate-y-0 sm:scale-100">
                    <div className="dark:bg-gray-800 dark:text-gray-200 dark:border-slate-500 w-full text-left flex justify-between items-center p-6 text-gray-900  border-b border-gray-200">
                        <h3 className="text-lg font-semibold">Your custome voice </h3>
                        <button className="p-2 hover:bg-gray-100 rounded-full hover:cursor-pointer"
                         onClick={()=>{
                          setshowAddVoiceModal(false)
                         }}>
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M21.45,21.44L2.55,2.56" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
                            <path d="M2.55,21.44L21.45,2.56" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
                        </svg>
                        </button>
                    </div>
                      <ModalAddVoice AUTH_TOKEN={props.AUTH_TOKEN}/>
                </div>
                </div>
            </div>
          </>
        :
          null
        }
        {Edit_BrandVoice
            ?
              <>
              <div className="fixed inset-0 z-40 overflow-y-auto" id="headlessui-dialog-:rf:" role="dialog" aria-modal="true" data-headlessui-state="open">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-50 opacity-100" id="headlessui-dialog-overlay-:rg:" aria-hidden="true" data-headlessui-state="open"></div>
                <div className="dark:bg-gray-800 dark:text-gray-300 relative h-full bg-white text-gray-900 rounded-md shadow-xl align-top sm:align-middle w-full sm:w-[416px] md:w-[640px] lg:w-[864px] opacity-100 translate-y-0 sm:scale-100">
                    <div className="dark:bg-gray-800 dark:text-gray-300 w-full text-left flex justify-between items-center p-6 text-gray-900  border-b border-gray-200">
                        <h3 className="text-lg font-semibold">Edit Brand voice </h3>
                        <button className=" p-2 hover:bg-gray-100 rounded-full hover:cursor-pointer"
                         onClick={()=>{
                          setEdit_BrandVoice(false)
                         }}>
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M21.45,21.44L2.55,2.56" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
                            <path d="M2.55,21.44L21.45,2.56" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
                        </svg>
                        </button>
                    </div>
                    <EditBrandVoice AUTH_TOKEN={props.AUTH_TOKEN} ID={DeleteBrandVoiceId}/>
                </div>
                </div>
            </div>
              </>
            :null}
      </div>
      {/* <Toaster/> */}
    </>
  )
}

export default Brandvoice