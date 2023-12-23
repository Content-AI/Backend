import React , {useEffect,useState} from 'react'
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom'
import { BACKEND_URL,BACK_END_API_CANCEL_SUBSCRIPTION_FINAL,BACK_END_API_TIMES_REMANING,BACK_END_API_CANCEL_SUBSCRIPTION_FINAL_FEEDBACK,BACK_END_API_INVOICE_PORTAL } from '../../../apis/urls';
import Settings from '../Settings'
import { fetchData } from '../../../apis/apiService';
import toast, { Toaster } from 'react-hot-toast';
import { CSSTransition } from 'react-transition-group';
import './CancelSubs.css'
import './AlreadyCancel.css'
import Profile from './Profile';
import DateConverter from './DateConverter';

import { setDocumentTitle } from '../../NavBar/DynamicTitle';


const Billing = (props) => {
  const navigate = useNavigate()

  useEffect(() => {
    setDocumentTitle("Billings Page");
}, []);

  const [showInvoice,setshowInvoice]=useState(false)
  const [showBillsData,setshowBillsData]=useState(false)
  
  const [showCancelSubs,setshowCancelSubs]=useState(false)

  const notifyerror = (message) => toast.error(message);
  const notifysucces = (message) => toast.success(message);

  let list_token_generated_by_user = useSelector(
    (state) => state.SetListTokenGeneratedByUser.ListTokenGeneratedByUser
  );
  let PROFILE_DATA = useSelector(
    (state) => state.SetFullProfile.Fullprofile
  );

  
  let SubscriptionsData = useSelector(
    (state) => state.SetSubscriptionsData.SubscriptionsData
  );




  const invoice_portal = async() =>{
    setshowInvoice(true)
    const resp = await fetchData(BACKEND_URL+BACK_END_API_INVOICE_PORTAL,props.AUTH_TOKEN)
    if(resp.status==200){
      try{
        window.location.replace(resp.data.message);
      }catch(e){
        notifyerror("something went wrong")
      }
    }else{
      notifyerror("something went wrong")
      }
      // setshowInvoice(false)
    }
  const edit_detials = async() =>{

    setshowBillsData(true)
    const resp = await fetchData(BACKEND_URL+BACK_END_API_INVOICE_PORTAL,props.AUTH_TOKEN)
    if(resp.status==200){
      try{
        window.location.replace(resp.data.message);
      }catch(e){
        notifyerror("something went wrong")
      }
    }else{
      notifyerror("something went wrong")
      }
      // setshowInvoice(false)
    }


    // =========the subscription cancel=========

    const [statusMessage,setstatusMessage]=useState(null)
    const [trialExpirationDate,settrialExpirationDate]=useState(null)



    const subscription_feedback = async() =>{
        openDialog()
      }
      
      const cancel_subscription_feedback = async() =>{
        
        setshowCancelSubs(true)  
        const resp = await fetchData(BACKEND_URL+BACK_END_API_CANCEL_SUBSCRIPTION_FINAL_FEEDBACK,props.AUTH_TOKEN)
        if(resp.status==200){
          // console.log(resp.data)
          // notifysucces("subscription cancel")
          setstatusMessage(resp.status)
          setshowCancelSubs(false)
        }else{
          // notifyerror("Your subscription is already canceled")
            setstatusMessage(resp.status)
            const resp_inner = await fetchData(BACKEND_URL+BACK_END_API_TIMES_REMANING,props.AUTH_TOKEN)
            if(resp_inner.status==200){
              setshowCancelSubs(false)
              setIsDialogOpen(false)
              try{
                settrialExpirationDate(resp_inner.data.end_at)
                if(resp_inner.data.end_at == null){
                  settrialExpirationDate(resp_inner.data.trail_ends)
                }
              }catch(e){
                settrialExpirationDate(resp_inner.data.trail_ends)
              }
              openAlreadyCancelDialog("You Already Unsubscribe")
            }else{
              setshowCancelSubs(false)
            }
          }
      }
    
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const [subscriptionReasons, setSubscriptionReasons] = useState({
        cancelReason: "",
        additionalComments: ""
      });
    
      const openDialog = () => {
        setIsDialogOpen(true);
      };
    
      const closeDialog = (statusMessage) => {
        setIsDialogOpen(false);
        setSubscriptionReasons({
          cancelReason: "",
          additionalComments: ""
        });
        if(statusMessage==200){
          notifysucces("subscription cancel")
        }else{
          // notifyerror("Your subscription is already canceled")
        }
      };
    
      const handleInputChangeCancelSubscription = (event) => {
        const { name, value } = event.target;
        setSubscriptionReasons((prevReasons) => ({
          ...prevReasons,
          [name]: value
        }));
      };
      // const handleInputChange = (event) => {
      //   const { name, value } = event.target;
      //   setSubscriptionReasons((prevReasons) => ({
      //     ...prevReasons,
      //     [name]: value,
      //   }));
      // };


      const handleFormSubmit = (event) => {
        event.preventDefault();
        // Perform any actions with the collected subscription reasons
        console.log("Cancel Reason:", subscriptionReasons.cancelReason);
        console.log("Additional Comments:", subscriptionReasons.additionalComments);
        closeDialog(statusMessage);
      };



// =========Already cancel==========
const [isAlreadyCancel, setIsAlreadyCancel] = useState(false);
const [newTimeRemainingReasons, setNewTimeRemainingReasons] = useState({
  cancelReason: "",
  additionalComments: ""
});


useEffect(() => {
  if (isAlreadyCancel) {
    document.body.style.overflow = "hidden"; // Prevent scrolling when the dialog is open
  } else {
    document.body.style.overflow = ""; // Restore scrolling when the dialog is closed
  }
}, [isAlreadyCancel]);

const openAlreadyCancelDialog = () => {
  setIsAlreadyCancel(true);
};

const closeNewDialog = () => {
  setIsAlreadyCancel(false);
  setNewTimeRemainingReasons({
    cancelReason: "",
    additionalComments: ""
  });
};

const handleNewInputChange = (event) => {
  const { name, value } = event.target;
  setNewTimeRemainingReasons((prevReasons) => ({
    ...prevReasons,
    [name]: value
  }));
};

const handleNewFormSubmit = (event) => {
  event.preventDefault();
  // Perform any actions with the collected subscription reasons
  console.log("Cancel Reason:", newTimeRemainingReasons.cancelReason);
  console.log(
    "Additional Comments:",
    newTimeRemainingReasons.additionalComments
  );
  closeNewDialog();
};


// Define a function to calculate the background color based on the value
function calculateBackgroundColor(total) {
  

  if (total >= 0 && total <= 10) {
    return 'bg-green-500 w-[2%]'; // Red color for values between 0 and 100
  } else if (total >= 10 && total <= 100) {
    return 'bg-green-500 w-[10%]'; // Red color for values between 0 and 100
  } else if (total > 500 && total <= 1499) {
  } else if (total > 100 && total <= 500) {
    return 'bg-green-500 w-[45%]'; // Yellow color for values between 101 and 500
  } else if (total > 500 && total <= 1499) {
    return 'bg-green-500 w-[70%]'; // Blue color for values between 501 and 1000
  } else if (total > 1500 && total <= 2000) {
    return 'bg-red-500 w-[95%]'; // Green color for values between 1001 and 2000
  } else {
    return 'bg-red-500'; // Default color for other values
  }
}


  return (
    <>
      {/* <Settings/> */}

      <div className='ml-[50px] mr-[50px] sm:ml-[100px] mt-10 '>
        <p className="dark:text-gray-300 font-bold text-[25px] text-black mb-1">Billing </p>
        <div className=" dark:bg-gray-800 dark:border-slate-500 m-1 px-6 pt-6 bg-white text-black rounded-md shadow-xs ring-1 ring-gray-300">
              <h3 className="dark:text-gray-300 text-xl font-medium leading-6 text-gray-700">Subscription</h3>
                <div>
                  {/* ============================= */}
                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                    <div className="sm:col-span-6">
                        <p className="mb-4 mt-2 font-semibold text-sm font-helv text-slate-500 text-grey-500 sm:col-span-6 ">
                        Your account was created on.
                        <span className='font-semibold ml-1'>
                        {PROFILE_DATA &&
                          <DateConverter 
                            inputDate={PROFILE_DATA.created_at}
                          />
                        }
                        </span>
                        </p>
                        <p className="text-sm font-semibold font-helv text-grey-500 sm:col-span-6 text-slate-500">
                        You are currently on the
                         <span className='ml-1'>
                        {SubscriptionsData &&
                          <>
                            {SubscriptionsData.user.status
                            ?
                              SubscriptionsData.user.plan + " " +  SubscriptionsData.user.subscription_type
                            :
                              "sdf"
                            }
                            </>
                        }
                        </span>
                        <strong> Free Plan</strong> 
                        </p>
                    </div>

                    <div className="flex w-full flex-col sm:col-span-6 md:w-120">
                        <div className="flex flex-row ">
                        <strong className="dark:text-gray-300 font-medium text-black">
                        Words Generated
                        </strong>
                        <strong className="dark:text-gray-300 font-medium text-black sm:ml-[400px] ml-[120px]">
                        {SubscriptionsData &&
                          <>
                            {SubscriptionsData.user.status=="trial"
                            ?
                              <>
                                {
                                  list_token_generated_by_user.total +"/ 2000"
                                }
                              </>
                            :
                              <>
                                {
                                  list_token_generated_by_user.total +"/ *"
                                }
                              </>
                            }
                          </>
                        }
                        </strong>
                      </div>

                        {SubscriptionsData &&
                        <>

                          {SubscriptionsData.user.status=="trial"
                          ?
                            <div className="w-full max-w-xl">
                              <div className="relative py-1 min-w-full w-full">
                                <div className="flex overflow-hidden rounded-full text-xs relative shadow-inner h-[0.75rem] w-[100%] bg-slate-400">
                                  <div className={`absolute z-10 flex flex-col justify-center whitespace-nowrap text-center text-black rounded-r-full ${calculateBackgroundColor(list_token_generated_by_user.total)} shadow-inner_right  h-[0.75rem]`}></div>
                                </div>
                              </div>
                            </div>
                          :

                            <div className="w-full max-w-xl">
                              <div className="relative py-1 min-w-full w-full">
                                  <div className="flex overflow-hidden rounded-full text-xs relative shadow-inner bg-green-200 h-[0.75rem]" >
                                    <div className="absolute z-10 flex flex-col justify-center whitespace-nowrap text-center text-black rounded-r-full bg-green-600 shadow-inner_right w-[50%] h-[0.75rem]"></div>
                                  </div>
                              </div>
                            </div>
                          }  

                        </>

                        }
                        

                        <div className="mb-1 font-medium text-gray-700 md:flex  md:justify-end">
                        <div className="mt-4 md:flex md:items-center  md:space-x-2">
                        {showBillsData
                    ?
                        <button type="button" 
                        disabled
                          className="w-[150px] mt-2 transition-all duration-200 relative font-semibold outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm text-white bg-gray-400">
                        <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                          <div className="w-4 h-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                        </span></button>
                    :
                      <button type="button" 
                        onClick={()=>{
                          edit_detials()
                          }} 
                          className="dark:bg-black  dark:hover:bg-gray-500 transition-all mt-2 duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-2 active:ring-1 w-full md:w-auto"
                          >
                              <span className="dark:text-gray-300 flex items-center justify-center mx-auto space-x-2 select-none">
                              Edit payment details
                              </span>
                            </button>
                        }
                          <button type="button" className="dark:bg-black  dark:hover:bg-gray-500  mt-2 transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-2 active:ring-1 w-full md:w-auto"
                          onClick={()=>{
                            navigate("/settings/subscription_plan")
                          }}>
                            <span className="dark:text-gray-300 flex items-center justify-center mx-auto space-x-2 select-none">
                            Edit plan
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>

                    
                  </div>
                  {/* ============================= */}
                </div>
          </div>
          {/* <div className="m-1">
              <div>
                <div className="flex items-center p-6 transition-all duration-150 bg-white rounded-md ring-gray-300 ring-1">
                    <div className="flex-grow">
                      <div className="text-xl font-semibold tracking-tight text-black">Save more than 20%</div>
                      <div className="text-gray-500">Pay annually to save more than 20%!</div>
                    </div>
                    
                      <button type="button" 
                      className="transition-all w-[150px] duration-200 relative font-semibold outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm text-white bg-[#334977]">
                      <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                      View details
                      </span></button>
                </div>
              </div>
          </div> */}
          <div className="m-1 dark:border-slate-700">
              <div className="dark:bg-gray-800  dark:text-gray-200  flex items-center p-6 transition-all duration-150 bg-white rounded-md  ring-gray-300 ring-1">
                <div className="flex-grow">
                    <h3 className="dark:text-gray-300 text-xl font-semibold text-gray-900">Invoices</h3>
                    <p className="dark:text-gray-300 text-gray-500 text-sm">View your payment history</p>
                </div>
                {showInvoice
                    ?
                      <button type="button" 
                      disabled
                        className="w-[150px] transition-all duration-200 relative font-semibold outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm text-white bg-gray-400">
                      <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                        Generating History
                      </span></button>
                    :
                    <button type="button" 
                      onClick={()=>{
                          invoice_portal()
                        }}
                    className="transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm bg-[#334977] text-white ring-1 ring-gray-200 hover:ring-2 active:ring-1">
                    <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                      View billing history
                    </span></button>
                }
              </div>
          </div>
          <div className="space-y-2 py-8">
              <h2 className="dark:text-gray-300 text-xl font-semibold text-gray-900">Cancel Subscription</h2>
              <p className="text-gray-500 text-sm">
                <span className="block mb-2">
                  {/* Kindly take note that if you decide to delete your account, all your saved content will be delete. */}
                  When cancelling the subscription, a one-time payment will be charged, regardless of whether you have chosen a yearly or monthly billing cycle.
                </span>

              {showCancelSubs
              ?
                <button 
                  type="button"
                  className="w-[150px] transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm  text-black  ring-1 ring-gray-200 hover:ring-2 active:ring-1">
                  <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                    <div className="w-4 h-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                  </span>
                </button>
                
              :
                <button 
                  type="button"
                  onClick={()=>{
                    subscription_feedback()
                    // openDialog()
                  }}
                  className="dark:bg-black dark:hover:bg-gray-500 bg-white w-[200px] transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm  text-black  ring-1 ring-gray-200 hover:ring-2 active:ring-1">
                  <span className="dark:text-gray-300 flex items-center justify-center mx-auto space-x-2 select-none">
                    Cancel Subscription
                  </span>
                </button>
              }

              </p>
          </div>
        </div>

        {/* ======cancel subscription dialog box========= */}
        <div className="relative z-10">

      <CSSTransition
        in={isDialogOpen}
        // timeout={100} // Adjust the duration of the transition
        classNames="dialog"
        unmountOnExit
      >
         <div className="fixed inset-0 flex justify-center items-center bg-slate-100 bg-opacity-20 z-20">
          <div className="dark:bg-gray-800 bg-white w-[600px] p-6 rounded shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 dark:text-gray-300">Cancel Subscription</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-6 ">
                <label className="dark:text-gray-300 block text-lg font-medium mb-2 text-[#4B5563]">
                  Why are you canceling the subscription?
                </label>
                <label className="flex items-center mb-3">
                  <input
                    type="radio"
                    name="cancelReason"
                    value="Not satisfied with the service"
                    onChange={handleInputChangeCancelSubscription}
                    className="mr-2 text-red-500"
                  />
                  <span className="text-[#4B5563] dark:text-gray-300">
                    Not satisfied with the service
                  </span>
                </label>
                <label className="flex items-center mb-3">
                  <input
                    type="radio"
                    name="cancelReason"
                    value="Found an alternative"
                    onChange={handleInputChangeCancelSubscription}
                    className="mr-2 text-red-500"
                  />
                  <span className="text-[#4B5563] dark:text-gray-300">Found an alternative</span>
                </label>
                <label className="flex items-center mb-3">
                  <input
                    type="radio"
                    name="cancelReason"
                    value="Service features not meeting requirements"
                    onChange={handleInputChangeCancelSubscription}
                    className="mr-2 text-red-500"
                  />
                  <span className="text-[#4B5563] dark:text-gray-300">
                    Service features not meeting requirements
                  </span>
                </label>
                <label className="flex items-center mb-3">
                  <input
                    type="radio"
                    name="cancelReason"
                    value="Financial reasons"
                    onChange={handleInputChangeCancelSubscription}
                    className="mr-2 text-red-500 "
                  />
                  <span className="text-[#4B5563] dark:text-gray-300">Financial reasons</span>
                </label>
                {/* Add more reasons here */}
              </div>
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2 dark:text-gray-300">
                  Additional Comments (optional)
                </label>
                <textarea
                  name="additionalComments"
                  onChange={handleInputChangeCancelSubscription}
                  className="dark:bg-gray-800 dark:text-gray-200 border p-3 w-full rounded font-helvetica"
                  rows="4"
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={()=>{
                      closeDialog(statusMessage)
                    }}
                  className="bg-red-500 mr-2 hover:bg-red-600 text-white py-2 px-4 rounded"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={()=>{
                    cancel_subscription_feedback()
                  }}
                  // className=" text-gray-600 hover:text-gray-800"
                  className="dark:text-gray-300 transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm  text-black  ring-1 ring-gray-200 hover:ring-2 active:ring-1"
                >
                  Confirm Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </CSSTransition>
    </div>
  
  
      {/* ======cancel subscription dialog box========= */}

      {/* ========Already cancel subscription======= */}
      <div className="relative z-10">

      <CSSTransition
        in={isAlreadyCancel}
        timeout={500} // Adjust the duration of the transition
        classNames="new-dialog"
        unmountOnExit
      >
         <div className="fixed inset-0 flex justify-center items-center bg-slate-50 bg-opacity-60 z-20">
          <div className="new-dialog-box">
            <h2 className="text-2xl font-semibold mb-4">Subscription Details</h2>
            <div className="mb-4">
              <p className="text-gray-700 text-sm text-[20px] items-center">
                Expires on {trialExpirationDate && trialExpirationDate}.
              </p>
            </div>
            <form onSubmit={handleNewFormSubmit}>
              {/* Add radio buttons and additional comments here */}
              <div className="flex justify-end mt-6">
                {/* <button
                  type="button"
                  onClick={closeNewDialog}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button> */}
                <button
                  type="submit"
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors duration-300 ease-in-out transform hover:scale-105"
                >
                  Close
                  {/* <span className="animate-cross text-xl">&#10060;</span> */}
                </button>
              </div>
            </form>
          </div>
        </div>
      </CSSTransition>
    </div>
  
      {/* ========Already cancel subscription======= */}
        </>
  )
}

export default Billing