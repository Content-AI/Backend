import React from "react";
import { annually_plan } from "../../../pages/Subscription/Subscription"
import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { _load_screen_ } from "../../../../features/LoadingScreen";

export default function Upgradenow(props) {
  
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const [showModal, setShowModal] = React.useState(false);


  const get_the_plan = ()=>{
    if(props.subscription_data.user.subscription_type=="monthly"){
      // navigate("/subscribe_by_user?subscription_type=monthly&plan=premium")
      window.location.replace("/subscribe_by_user?subscription_type=monthly&plan=premium");
    } 
    if(props.subscription_data.user.subscription_type=="annually"){
      window.location.replace("/subscribe_by_user?subscription_type=annually&plan=premium");
      // navigate("/subscribe_by_user?subscription_type=annually&plan=premium")
    }

  }
  

  return (
    <>
      <button
        className="ml-1 cursor-pointer font-semibold text-indigo-600 underline underline-offset-2"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Upgrade now
      </button>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-2 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-1xl font-semibold ml-3">Upgrade Plan add more seat</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}

                <div className="relative p-1 flex-auto w-[600px]">

                  <div className="px-5 mt-1 mb-2 pt-2 pb-5">

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold">
                        Get 3 more seats by upgrading to Teams
                      </div>


                      {props.subscription_data.user.subscription_type=="monthly"
                      ?
                      <>
                        <div className="bg-green-100 text-green-500 border border-green-500 rounded-lg py-[2px] px-2 text-sm">
                        <span className="text-base font-bold">$122</span>/mo</div>
                      </>
                      :
                        null
                      }
                      {props.subscription_data.user.subscription_type=="annually"
                      ?
                      <>
                        <div className="bg-green-100 text-green-500 border border-green-500 rounded-lg py-[2px] px-2 text-sm">
                        <span className="text-base font-bold">$1185</span>/yearly</div>
                      </>
                      :
                        null
                      }

                    </div>

                    {annually_plan &&
                      <>

                        <ul>
                          {annually_plan.map((data, index) => {
                            return (
                              <li className="flex items-center py-1">
                                <svg className="w-3 h-3 flex-shrink-0 fill-current text-green-500 mr-2" viewBox="0 0 12 12">
                                  <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                                </svg>
                                <div className="text-sm">{data}</div>
                              </li>
                            )
                          })}
                        </ul>
                      </>
                    }
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold  px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Dumb Decline
                  </button>
                  <button
                    className=" text-white bg-[#334977] active:bg-emerald-600 font-bold text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                      get_the_plan()
                    }}
                  >
                    Confirm Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
