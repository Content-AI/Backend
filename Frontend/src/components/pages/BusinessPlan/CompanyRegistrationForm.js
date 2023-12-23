import React, { useState,useEffect } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL,BACK_END_API_BUSINESS_PLAN } from "../../../apis/urls";
import {fetchData,postData} from "../../../apis/apiService"
import toast, { Toaster } from "react-hot-toast";


import { setDocumentTitle } from '../../NavBar/DynamicTitle';

function CompanyRegistrationForm(props) {
    
  const navigate = useNavigate();

  const [submitting_form,setsubmitting_form]=useState(false)

        
    useEffect(() => {
        setDocumentTitle("Company Registration Page");
    }, []);


  const notifyerror = (message) => toast.error(message);
  const notifysucces = (message) => toast.success(message);
  const notifymessage = (message) =>
    toast(message, {
      icon: "👏",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });


const initialFormData = {
    email: "",
    fullName: "",
    companyName: "",
    messageDetails: "",
    phone: ""
    };
    
const [formData, setFormData] = useState(initialFormData);
    

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate phone number to allow only numeric input
    if (name === "phone" && !/^\d*$/.test(value)) {
      return; // Do not update the state if it's not a numeric input
    }

    // Validate full name length (e.g., maximum 50 characters)
    if (name === "fullName" && value.length > 20) {
      notifyerror("Full Name less then 30 character")
      return; // Do not update the state if the full name exceeds the maximum length
    }
    // Validate full name length (e.g., maximum 50 characters)
    if (name === "companyName" && value.length > 30) {
        notifyerror("company Name less then 30 character")
      return; // Do not update the state if the full name exceeds the maximum length
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setsubmitting_form(true)
    // Handle form submission here (e.g., send data to a server)
    const resp = await postData(formData,BACKEND_URL+BACK_END_API_BUSINESS_PLAN,props.AUTH_TOKEN)

    if(resp.status==200){
        notifymessage("We will get Back Soon with in 1-3 business days")
        setsubmitting_form(false)
        setFormData(initialFormData);
    }
    else if(resp.response.status==403){
        notifyerror("You already message us. Wait for 1-3 bussiness days")
        setsubmitting_form(false)
    }
    else{
        try{
            notifyerror(resp.response.data.message)
        }catch(e){
            notifyerror("something went wrong")
        }
        setsubmitting_form(false)
    }

  };

  return (
    <div className="dark:text-gray-300 dark:bg-gray-800 fixed inset-0 flex z-50 bg-white overflow-auto">
        <button
            type="button"
            className="transition-all h-[40px] p-3 m-3 duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm text-white bg-[#334977] ring-1 ring-gray-200 hover:ring-2 active:ring-1 flex items-center space-x-1"
            onClick={() => {
                navigate("/");
            }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className='w-4 h-4 mt-1' data-name="Layer 1" viewBox="0 0 80 100" x="0px" y="0px">
                <path d="M71,40a5.12,5.12,0,0,1-5.12,5.12H26.48L36.85,55.5a5.13,5.13,0,0,1-5,8.57,5.22,5.22,0,0,1-2.32-1.39l-19.06-19a5.16,5.16,0,0,1,0-7.26L29.61,17.26a5.12,5.12,0,0,1,3.63-1.51,5.11,5.11,0,0,1,3.55,8.81L26.48,34.88h39.4A5.12,5.12,0,0,1,71,40Z"
                    fill="white"
                />
                </svg>
            <span>Go Back</span>
            </button>
            <div className="max-w-screen-md mx-auto p-3">
                <div class="text-center mb-8">
                    <p class="mt-4 text-sm leading-7 text-gray-500 font-regular uppercase">
                        Contact
                    </p>
                    <h3 class="dark:text-white text-3xl sm:text-4xl leading-normal font-extrabold tracking-tight text-gray-900">
                        Contact <span class="text-indigo-600">Sales</span>
                    </h3>
                </div>
            
            <form class="w-full" onSubmit={handleSubmit}>
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full px-3">
                <label class="dark:text-white block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                Full Name <span className="text-red-700">*</span>
                </label>
                <input 
                    class="dark:bg-gray-800 dark:text-gray-200 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    />
                </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full px-3">
                <label class="dark:text-white block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Email Address  <span className="text-red-700">*</span>
                </label>
                <input 
                    class="dark:bg-gray-800 dark:text-gray-200 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="********@*****.**"/>
                </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full px-3">
                <label class="dark:text-white block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Company Name <span className="text-red-700">*</span>
                </label>
                <input 
                    class="dark:bg-gray-800 dark:text-gray-200 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                    type="text"
                    id="companyName"
                    name="companyName"
                    placeholder="Company Name"
                    value={formData.companyName}
                    onChange={handleChange}
                    required                        
                    />
                </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full px-3">
                <label class="dark:text-white block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Phone
                </label>
                <input 
                    class="dark:bg-gray-800 dark:text-gray-200 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                    type="text"
                    id="phone"
                    name="phone"
                    maxLength={12}
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}                   
                    />
                </div>
            </div>
                
                <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full px-3">
                <label class="dark:text-white block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Message Details <span className="text-red-700">*</span>
                </label>
                <textarea 
                    rows="10"
                    class="dark:bg-gray-800 dark:text-gray-200 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="messageDetails"
                    name="messageDetails"
                    placeholder="Message Details"
                    value={formData.messageDetails}
                    onChange={handleChange}
                    required
                >   
                </textarea>
                </div>
                <div class="flex justify-between w-full px-3 mb-6">
                <div class="md:flex md:items-center">
                    <label class="block text-gray-500 font-bold">
                    </label>
                </div>

                {submitting_form
                ?
                    <button 
                        disabled
                        class="shadow bg-red-800 w-[200px] text-white font-bold py-2 px-6 rounded"
                        type="submit"
                    >
                        Submiting  ...
                    </button>
                :
                    <button 
                        class="shadow bg-[#334977] w-[200px] hover:bg-[#334977] focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded"
                        type="submit"
                    >
                        Submit Form
                    </button>
                }


                </div>
                
            </div>
                
            </form>
            </div>


        <a href="/" target="_blank" class="block">
            <img 
                src="https://static.vecteezy.com/system/resources/previews/009/182/285/non_2x/tmp-letter-logo-design-with-polygon-shape-tmp-polygon-and-cube-shape-logo-design-tmp-hexagon-logo-template-white-and-black-colors-tmp-monogram-business-and-real-estate-logo-vector.jpg" 
                class="w-48 mx-auto my-5"
                alt="company Logo"
            />
        </a>

        </div>
  
  
  );
}

export default CompanyRegistrationForm;
