import React, { useEffect,useState } from "react";
import clsx from "clsx";
import { BACKEND_URL ,BACK_END_API_TEMPLATE_IMP} from "../../apis/urls";
import { fetchData } from "../../apis/apiService";
import { useSelector, useDispatch } from "react-redux";

import CardDoc from "../Card/CardDoc";
import { setDocumentTitle } from '../NavBar/DynamicTitle';

import CkCheck from "../Icons/CkCheck";
import ThreeDots from "../Icons/ThreeDots";
import { useNavigate } from "react-router-dom";
import DocumentsIcons from '../Icons/DocumentsIcons'
import ListOfDocument from "./Template/Document/ListOfDocument";
import Workflow from "../Icons/Workflow";
import TemplateIcon from "../Icons/TemplateIcon";


import toast, { Toaster } from 'react-hot-toast';
import { Premium } from "./ImageGenerator/Premium";


const buttonTags = [
  "All",
  "Blog",
  "Business",
  "Ecommerce",
  "Email",
  "Frameworks",
  "Freemium",
  "Google",
  "Marketing",
  "New",
  "SEO",
  "Social Media",
];


const imp_manaully = [
  {
    title: "WorkFlow",
    description:
      "Generate WorkFlow to Create Content.",
    icon: "WorkFlow",
    img:"https://uffiafilestorage.s3.amazonaws.com/icons/workflow.png",
    isPremium: true,
    link:"/workflow"
  },
  {
    title: "Recap Builder",
    description:
      "Transform your audio visual content into concise and insightful summaries.",
    icon: "ReacapBuildericon",
    img:"https://uffiafilestorage.s3.amazonaws.com/icons/Screenshot+2023-10-04+at+10.26.05+AM.png",
    isPremium: false,
    link:"/recap_builder"
  },{
    title: "Transcribe speech",
    description:
    "Turn speech into text with ease for accurate content.",
    icon: "Transcribe",
    img:"https://uffiafilestorage.s3.amazonaws.com/icons/Transcribe+speech.png",
    isPremium: true,
    link:"/transcribe-speech"
  },
  // {
  //   title: "One Shot Blog Post",
  //   description:
  //     "Get the key bullet points from a piece of content.",
  //   icon: "Shot",
  //   img:"https://uffiafilestorage.s3.amazonaws.com/icons/1_T3DPBTv.png",
  //   isPremium: false,
  // },
  {
    title: "Art",
    description:
      "Express your creativity through the power of art.",
    icon: "Art",
    img:"https://uffiafilestorage.s3.amazonaws.com/icons/Screenshot+2023-10-04+at+10.32.29+AM.png",
    isPremium: true,
    link:"/art"
  }
]

const Home = ({AUTH_TOKEN}) => {

  useEffect(() => {
    setDocumentTitle("Dashboard");
}, []);

  const navigate = useNavigate()
  const [imp_template,set_imp_template]=useState(null)


  const notifyerror = (message) => toast.error(message);
  const notifysucces = (message) => toast.success(message);

  let subscriptions_details = useSelector(
    (state) => state.SetSubscriptionsData.SubscriptionsData
  );



  const get_template = async(url,token) =>{
    const response_data = await fetchData(url,token)
    if(response_data.status==200){
      set_imp_template(response_data.data)
    }else{
      // navigate("/logout")
    }
  }


useEffect(()=>{
  if(AUTH_TOKEN!=null){
    get_template(BACKEND_URL+BACK_END_API_TEMPLATE_IMP,AUTH_TOKEN)
  }
},[])

  return (
    <div className="pl-6">

      {/* <h1 className="dark:text-gray-500 text-2xl font-bold mb-6 p-8">Dashboard</h1> */}
      <h1 className="dark:text-gray-500 text-2xl font-bold">Dashboard</h1>

      <div className="max-w-[843px] mx-auto mt-8 mb-12">
      
        <div className="mb-6">
          <h1 className="text-[30px] font-bold dark:text-gray-500">Welcome to Jyra AI</h1>
          <p className="text-sm dark:text-gray-500">
            Follow these steps to get started and earn free credits as you go.
          </p>
        </div>
        <table className="table w-full table-auto border border-border dark:border-slate-600">
          <thead className="p-6 border-b border-border dark:border-slate-600">
            <tr>
              <th className="text-left p-6 dark:text-gray-500">Getting Started</th>
              {subscriptions_details &&
                <>
                  {subscriptions_details.user.status=="trial"
                  ?
                    <th className="text-right p-6">
                      2000 free credits available
                    </th>
                  :
                    null
                  }
                </>
              }
            </tr>
          </thead>
          <tbody className="[&_td]:px-6 [&_td]:py-2 [&_tr:first-child_td]:pt-6 [&_tr:last-child_td]:pb-6 [&_td:last-child]:text-right">
            <tr>
              <td className="dark:text-gray-500">Create an account</td>
              <td className="">
                <div className="inline-block">
                  <CkCheck />
                </div>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 dark:text-gray-500">Generate your first blog post</td>
              <td className="px-6 py-4 text-right">
                <button 
                  onClick={()=>{
                    notifysucces("Coming soon")
                  }}
                className="inline-flex items-center justify-center text-white bg-[#304572] px-3 py-1.5 gap-x-2 rounded-md">
                  <span  className="dark:text-gray-500">Try it</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M2.33398 6.99984C2.33398 6.67767 2.59515 6.4165 2.91732 6.4165H11.084C11.4062 6.4165 11.6673 6.67767 11.6673 6.99984C11.6673 7.322 11.4062 7.58317 11.084 7.58317H2.91732C2.59515 7.58317 2.33398 7.322 2.33398 6.99984Z"
                      fill="white"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.58687 2.50435C6.81468 2.27654 7.18402 2.27654 7.41183 2.50435L11.4952 6.58768C11.723 6.81549 11.723 7.18484 11.4952 7.41264L7.41183 11.496C7.18402 11.7238 6.81468 11.7238 6.58687 11.496C6.35906 11.2682 6.35906 10.8988 6.58687 10.671L10.2577 7.00016L6.58687 3.32931C6.35906 3.1015 6.35906 2.73216 6.58687 2.50435Z"
                      fill="white"
                    />
                  </svg>
                </button>
              </td>
            </tr>
            <tr>
              <td>Watch introduction video</td>
              <td>
                <button 
                onClick={()=>{
                    notifysucces("Coming soon")
                  }}
                className="inline-flex items-center justify-center text-white bg-[#304572]  px-3 py-1.5 gap-x-2 rounded-md">
                  <span>Play Video</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M13.125 7C13.125 8.62445 12.4797 10.1824 11.331 11.331C10.1824 12.4797 8.62445 13.125 7 13.125C5.37555 13.125 3.81763 12.4797 2.66897 11.331C1.52031 10.1824 0.875 8.62445 0.875 7C0.875 5.37555 1.52031 3.81763 2.66897 2.66897C3.81763 1.52031 5.37555 0.875 7 0.875C8.62445 0.875 10.1824 1.52031 11.331 2.66897C12.4797 3.81763 13.125 5.37555 13.125 7V7ZM5.92987 10.0468L9.954 7.364C10.0139 7.32405 10.063 7.26992 10.097 7.20642C10.131 7.14292 10.1488 7.07202 10.1488 7C10.1488 6.92798 10.131 6.85708 10.097 6.79358C10.063 6.73008 10.0139 6.67595 9.954 6.636L5.92987 3.95325C5.86399 3.90941 5.78745 3.88426 5.70841 3.88048C5.62936 3.87669 5.55077 3.89442 5.481 3.93178C5.41123 3.96913 5.3529 4.02471 5.31222 4.09259C5.27155 4.16047 5.25004 4.23811 5.25 4.31725V9.68275C5.25004 9.76189 5.27155 9.83953 5.31222 9.90741C5.3529 9.97529 5.41123 10.0309 5.481 10.0682C5.55077 10.1056 5.62936 10.1233 5.70841 10.1195C5.78745 10.1157 5.86399 10.0906 5.92987 10.0468V10.0468Z"
                      fill="white"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    <div>

      <ListOfDocument
          DASHBOARD={true}
          SHOW={"active"}
          AUTH_TOKEN={AUTH_TOKEN}
          search_bar={"off"}
          ShowDashboard="true"
          slice_data='4'
      />

    </div>


    <div className="mt-12 mb-12 p-9">

        {/* <div className="grid grid-cols-2 gap-4 "> */}

        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">


          {imp_manaully.map((data,index)=>{
            return (

                <div className="flex flex-col cursor-pointer " title={data["title"]}>
                  
                <div className="dark:bg-slate-700 flex dark:hover:bg-gray-600 hover:bg-gray-100 dark:border-slate-500 border border-border p-6 rounded-lg">
                    <div className="flex justify-between w-full">
                      <div className="right">
                        <div className="flex">
                          <div>
                            <img src={data["img"]} alt={data["title"]} className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="dark:text-gray-500 text-md font-bold ml-4">{data["title"]}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm min-h-[62px] mt-8">
                            {data["description"]}
                          </p>
                        </div>

                        {subscriptions_details &&
                          <>
                            {subscriptions_details.user.status === "trial" && data["isPremium"] === true
                              ?
                              <button className="text-white w-[100px] h-[36px] cursor-pointer inline-flex items-center justify-center text-sm font-bold bg-[#334977] border border-border rounded-md overflow-hidden"
                                onClick={() => {
                                  navigate("/settings/subscription_plan")
                                }}>
                                Upgrade
                              </button>
                              :
                              <button className="text-white dark:text-gray-300 w-[150px] h-[36px] cursor-pointer inline-flex items-center justify-center text-sm font-bold bg-[#334977] border border-border rounded-md overflow-hidden"
                                onClick={() => {
                                  navigate(data["link"])
                                }}>
                                {data["title"]}
                              </button>
                            }
                          </>
                        }
                      </div>

                      <div className="rounded-s-xl rounded-e-xl mb-3">
                        <img
                          src="https://uffiafilestorage.s3.amazonaws.com/frontend-images/card--placeholder.svg"
                          alt=""
                          className="w-full h-full dark:opacity-60"
                        />
                      </div>
                    </div>
                  </div>


                   
                </div>
            )
          })}

      </div>

    </div>
      


      
    <div className="mt-12 p-9">
        <h3 className="text-md font-bold mb-6 ml-2">New tools to help you create</h3>
        
        <div>

        <div className="cardwrap grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-5">
          {imp_template &&
            <>
              {imp_template.map((items, index) => {
                return (
                  <>
                    <CardDoc {...items} key={"carddoc_" + index}/>
                  </>
                );
              })}
            </>
          }
          </div>


        </div>
      </div>

      
    </div>
  );
};

export default Home;
