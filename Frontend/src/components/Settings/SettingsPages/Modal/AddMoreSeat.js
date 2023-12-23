import React,{useState} from "react";
import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { _load_screen_ } from "../../../../features/LoadingScreen";
import { postData } from "../../../../apis/apiService";
import { BACKEND_URL,BACK_END_API_CHECKOUT_ADD_SEAT,BACK_END_API_TEAM_MEMBER_SEAT_SUBS_ID } from "../../../../apis/urls";

const details_data=["Monthly Auto Renewable"]


export default function AddMoreSeat(props) {
  
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const [showModal, setShowModal] = React.useState(false);
  const [loadingbtn,setloadinbtn] = React.useState(false);

  const [numSeats, setNumSeats] = useState(1);
  const seatPrice = 65;
  const maxSeats = 10000;

  const handleIncrease = () => {
    if (numSeats < maxSeats) {
      setNumSeats(numSeats + 1);
    }
  };

  const handleDecrease = () => {
    if (numSeats > 0) {
      setNumSeats(numSeats - 1);
    }
  };

  const totalPrice = numSeats * seatPrice;

  const add_team_member = async()=>{
    setloadinbtn(true)
      const formData = {
          "no_of_seats":numSeats
        }
        const resp = await postData(formData,BACKEND_URL+BACK_END_API_CHECKOUT_ADD_SEAT,props.TOKEN)
        if(resp.status==200){
            setloadinbtn(false)
            dispatch(_load_screen_(true))
            window.location.replace(resp.data.url);
        }else{
            setloadinbtn(false)
        }
  }


  return (
    <>
      <button
        className="cursor-pointer font-semibold text-indigo-600 underline underline-offset-2"
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
                <div className="dark:bg-gray-800 dark:text-gray-200 dark:border-slate-500 flex items-start justify-between p-2 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-1xl font-semibold ml-3">Add seat per Required</h3>
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

                <div className="dark:bg-gray-800 dark:text-gray-200 dark:border-slate-500 relative p-1 flex-auto w-[500px]">

                  <div className=" px-5 mt-1 mb-2 pb-5">

                  <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold">
                        More Team More Gain
                      </div>
                    </div>

                    <div className="mb-4 mt-4">
                        <p className="mb-2 dark:text-white text-gray-600 p-1 font-helv">Number of seats</p>
                        <div className="flex items-center">
                        <button
                            className="px-2 py-1 bg-[#334977] text-white rounded-md mr-2 text-sm"
                            onClick={handleDecrease}
                        >
                            -
                        </button>
                        <input
                            type="number"
                            className="w-20 dark:text-black p-2 border border-gray-300 rounded-lg text-center"
                            value={numSeats}
                            onChange={(e) => setNumSeats(Math.min(maxSeats, parseInt(e.target.value, 10)))}
                        />
                        <button
                            className="px-2 py-1 bg-[#334977] text-white rounded-md ml-2 text-sm"
                            onClick={handleIncrease}
                        >
                            +
                        </button>
                        </div>
                        
                    </div>

                    {details_data &&
                      <>

                        <ul>
                          {details_data.map((data, index) => {
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

                    <div className="flex mt-8 justify-between items-center">
                        <p className="text-lg font-semibold">Price per seat</p>
                        <p className="text-lg font-semibold">${seatPrice}</p>
                    </div>
                    <div className="flex mt-2 justify-between items-center">
                        <p className="text-lg font-semibold">Seat</p>
                        <p className="text-lg font-semibold"> {numSeats} Team</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold">
                        Total
                      </div>

                        <div className="bg-green-100 mt-3 text-green-500 border border-green-500 rounded-lg py-[2px] px-2 text-sm">
                        <span className="text-base font-bold">${totalPrice}</span>/mo</div>
                    </div>

                  </div>
                </div>
                {/*footer*/}
                <div className="dark:bg-gray-800 dark:text-gray-200 dark:border-slate-500 flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold  px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Dumb Decline
                  </button>
                  <button
                    className="text-white bg-[#334977] active:bg-emerald-600 font-bold text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                        add_team_member();
                    }}
                    disabled={loadingbtn}
                    >
                    {loadingbtn
                    ?
                        "Loading .."
                    :
                        "Confirm"
                    }
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
