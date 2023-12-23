import React ,{useState,useEffect}from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';

import { BACKEND_URL,BACK_END_API_TICKETS_CREATION,BACK_END_API_ISSUES_LIST_TICKETS } from '../../../apis/urls';
import { fetchData, postData } from '../../../apis/apiService';

const TicketForm = (props) => {

    const notifyerror = (message) => toast.error(message);
    const notifysucces = (message) => toast.success(message);

    const notifyprogress = (message) => toast(message,
    {
      icon: '👏',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    }
  )

    const [statusMessage,setstatusMessage]=useState(null)
    const [sbmitted,setSubmitted]=useState(false)
    

    // const [issues,setIssues]=useState(
    //     ["Account Creation Issues",
    //     "Payment Issues",
    //     "Cancellation Issues",
    //     "Technical Issue",
    //     "Product or Service Complaints",
    //     "Account Access Issues",
    //     "Order Issues",
    //     "Refund and Return Requests",
    //     "Subscription Management"]
    //     )
    const [issues,setIssues]=useState(["wait ..."])

    const [isDialogOpen, setIsDialogOpen] = useState(false);
      const [subscriptionReasons, setSubscriptionReasons] = useState({
        subject: "",
        content: ""
      });
    
      const openDialog = () => {
        setIsDialogOpen(true);
      };
    
      const closeDialog = (statusMessage) => {
        setIsDialogOpen(false);
        setSubscriptionReasons({
          subject: "",
          content: ""
        });
        if(statusMessage==200){
          notifysucces("subscription cancel")
        }else{
          // notifyerror("Your subscription is already canceled")
        }
      };
    
      const handleInputChangeTickets = (event) => {
        const { name, value } = event.target;
        setSubscriptionReasons((prevReasons) => ({
          ...prevReasons,
          [name]: value
        }));
      };

      const handleFormSubmit = async(event) => {
        event.preventDefault();
        
        if (subscriptionReasons.content.length < 5 || subscriptionReasons.content.length > 500) {
          notifyerror("Message must be between 5 and 500 characters.");
        } 
        else if(subscriptionReasons.subject.length<=0){
          notifyerror("Must select the subject");
        }else {
          setSubmitted(true)
          const formData = {
            "subject":subscriptionReasons.subject,
            "content":subscriptionReasons.content
          }
          const resp = await postData(formData,BACKEND_URL+BACK_END_API_TICKETS_CREATION,props.AUTH_TOKEN)
          if(resp.status==200){
              notifyprogress("We will reach back to you in short period")
              closeDialog(statusMessage);
              setSubmitted(false)
            }else{
              notifysucces("Data must be valid")
              setSubmitted(false)
          }
        }


      };


      const get_issue_list = async()=>{
        const resp = await fetchData(BACKEND_URL+BACK_END_API_ISSUES_LIST_TICKETS,props.AUTH_TOKEN)
        if(resp.status==200){
            setIssues(resp.data)
        }else{
        }
      }
      useEffect(()=>{
        get_issue_list()
      },[])


  return (
    <>

        <div className="pt-6">
          <div className="dark:bg-gray-800 flow-root px-6 pb-8 rounded-lg bg-slate-50 hover:bg-slate-100 ring-1 ring-gray-200 h-full">
          <div className="flex flex-col justify-between h-full">
              <div>
                <div>
                    <span className="inline-flex items-center justify-center p-3 bg-white rounded-md shadow-lg ring-1 ring-blue-500 -mt-6">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true" className="w-6 h-6 text-blue-600">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                    </span>
                </div>
                <h3 className="dark:text-white mt-6 text-xl font-medium tracking-tight text-gray-900">Create a Ticket</h3>
                <p className="dark:text-white mt-3 text-base text-gray-500 pt-3">Submit a support ticket for assistance.</p>
              </div>
              <button type="button" 
                      className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#334977]"
                      onClick={()=>{
                          openDialog()
                          // notifysucces("comming soon")
                      }}
          >
              <span className="flex items-center justify-center mx-auto space-x-2 select-none">Open a Ticket</span></button>
          </div>
        </div>
    </div>


      {/* =====this is the ticket creation====== */}
      {/* <div className="relative z-10"> */}
          <CSSTransition
            in={isDialogOpen}
            // timeout={500} // Adjust the duration of the transition
            classNames="dialog"
            unmountOnExit
          >
        <div className="fixed inset-0 flex justify-center items-center bg-slate-700 bg-opacity-20 z-20">
          <div className="dark:bg-gray-800 bg-white w-[800px] p-10 rounded shadow-2xl overflow-y-auto max-h-[90vh]">

            {/* <div className="fixed inset-0 flex justify-center items-center bg-slate-700 bg-opacity-20 z-20">
              <div className="bg-white w-[600px] p-6 rounded shadow-lg "> */}
              
                <h2 className="text-2xl font-semibold mb-4 ">
                    Create Tickets
                  </h2>
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-6 ">
                    <label className="dark:text-white  block text-lg font-medium mb-2 text-[#4B5563]">
                      Select Options that related to Issue ? ( subject ) <span className='text-red-700'>*</span>
                    </label>

                    {issues &&
                    <>
                        {issues.map((data,index)=>{
                        return (
                            <label className="flex items-center mb-3">
                              <input
                                type="radio"
                                name="subject"
                                value={data}
                                onChange={handleInputChangeTickets}
                                className="mr-2 text-red-500"
                              />
                              <span className="text-[#4B5563] dark:text-white">
                                {data}
                              </span>
                            </label>
                        )
                      })}
                    </>
                    }
                  </div>
                  <div className="mb-6">
                    <label className="dark:text-white block text-lg font-medium mb-2">
                      Message <span className='dark:text-white text-red-700'>*</span>
                    </label>
                    <textarea
                      name="content"
                      onChange={handleInputChangeTickets}
                      className="dark:bg-gray-700 dark:text-white border p-3 w-full rounded font-helvetica"
                      rows="4"
                      placeholder='message'
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
                    {sbmitted
                    ?
                      <button
                        type="submit"
                        disabled
                        className="dark:text-white transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm  text-black  ring-1 ring-gray-200 hover:ring-2 active:ring-1"
                      >
                        Creating Tickets ...
                      </button>
                    :
                      <button
                        type="submit"
                        className="dark:text-white transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm  text-black  ring-1 ring-gray-200 hover:ring-2 active:ring-1"
                      >
                        Submit Ticket
                      </button>
                    }
                  </div>
                </form>
              </div>
            </div>
          </CSSTransition>
        {/* </div>  */}
    </>

  );
};

export default TicketForm;
