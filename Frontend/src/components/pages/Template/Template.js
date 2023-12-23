import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { BACKEND_URL,BACK_END_API_TEMPLATE ,AWS_FRONT_END_ICONS,BACK_END_API_CATEGORIES, BACK_END_API_CUSTOM_TEMPLATE} from "../../../apis/urls";
import { fetchData } from "../../../apis/apiService";
import LoadingPage from "../../LoadingPage";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import SearchIconTemplate from '../../Icons/SearchIconTemplate'

import { PremiumIc } from "../ImageGenerator/PremiumIc";

import { useSelector, useDispatch } from "react-redux";
import {
  _load_screen_
} from "../../../features/LoadingScreen";

import './Template.css'



import CardDoc from "../../Card/CardDoc";
import StreamingComponent from "./StreamingComponent";

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




const Template = ({AUTH_TOKEN}) => {

  const location = useLocation();
  const dispatch = useDispatch();
  let navigate = useNavigate();


  let subscriptions_check = useSelector(
    (state) => state.SetSubscriptions.Subscriptions
  );
  let subscriptions_details = useSelector(
    (state) => state.SetSubscriptionsData.SubscriptionsData
  );


  const notifyerror = (message) => toast.error(message);
  const notifysucces = (message) => toast.success(message);


  const notifyprogress = (message) => toast('Template comming soon',
  {
    icon: '👏',
    style: {
      borderRadius: '10px',
      background: '#333',
      color: '#fff',
    },
  }
)
  let loading_page = useSelector(
    (state) => state.SetLoadingScreen.LoadingScreen
    );
    
    const [activeCat, setActiveCat] = useState();
    const [templateData,settemplateData] = useState([]);
    const [filter_category,setfilter_category] = useState(null);
    const [search_parameter,setsearch_parameter] = useState(null);
    
    const [category,setcategory] = useState(null);
    
    const get_template = async(url,token) =>{
      const response_data = await fetchData(url,token)
      if(response_data.status==200){
        settemplateData(response_data.data)
      }else{
        navigate("/logout")
      }
    }
    const get_template_categories = async(url,token,category) =>{
      const response_data = await fetchData(url+"?category="+filter_category,token)
      if(response_data.status==200){
        settemplateData(response_data.data)
      }else{
        navigate("/logout")
      }
    }
    const get_categories = async(url,token) =>{
      const response_data = await fetchData(url,token)
      if(response_data.status==200){
        setcategory(response_data.data)
          // .sort((a, b) => a.localeCompare(b)))
      }else{
        // navigate("/logout")
      }
    }

    const get_template_search = async(url,token,search_parameter) =>{
      setCategoryTmp(["all"])
      const response_data = await fetchData(url+"?search="+search_parameter,token)
      if(response_data.status==200){
        settemplateData(response_data.data)
      }else{
        navigate("/logout")
      }
    }
    
  useEffect(()=>{
    // dispatch(_load_screen_(true))
    get_template(BACKEND_URL+BACK_END_API_TEMPLATE,AUTH_TOKEN)
    get_categories(BACKEND_URL+BACK_END_API_CATEGORIES,AUTH_TOKEN)
  },[])

  useEffect(()=>{
    if(filter_category!=null){
      get_template_categories(BACKEND_URL+BACK_END_API_TEMPLATE,AUTH_TOKEN,filter_category)
    }
  },[filter_category])

  useEffect(()=>{
    if(search_parameter!=null){
      get_template_search(BACKEND_URL+BACK_END_API_TEMPLATE,AUTH_TOKEN,search_parameter)
    }
  },[search_parameter])


  // ============select Multiple category=============
  // const [categoryTmp, setCategoryTmp] = useState(["All"]);
  // const [selectedCategories, setSelectedCategories] = useState("All");

  // const capitalizeFrontText = (text) => {
  //   return text.charAt(0).toUpperCase() + text.slice(1);
  // };

  // const handleCategoryClick = (selectedCategory) => {
  //   console.log("selectedCategory",selectedCategory)  
  //   if(selectedCategory=="custom" || selectedCategory=="Custom"){
  //     setCategoryTmp(["Custom","custom"]);
  //     get_custome_template()
  //     return;
  //   }
  //   if (selectedCategory === "all") {
  //     if (categoryTmp.length === 1 && categoryTmp.includes("all")) {
  //       // If only "All" is selected, deselect it
  //       setCategoryTmp([]);
  //     } else {
  //       // If other categories are selected, select only "All"
  //       setCategoryTmp(["all"]);
  //     }
  //   } else {
  //     if (categoryTmp.includes("all")) {
  //       // If "All" is selected, deselect it and select the clicked category
  //       setCategoryTmp([selectedCategory]);
  //     } else {
  //       // Toggle the selection of the clicked category
  //       // setCategoryTmp([selectedCategory])
  //       setCategoryTmp((prevCategoryTmp) =>
  //         prevCategoryTmp.includes(selectedCategory)
  //           ? prevCategoryTmp.filter((item) => item !== selectedCategory)
  //           : [...prevCategoryTmp, selectedCategory]
  //       );
  //     }
  //   }
  // };


  // useEffect(() => {
  //   if (categoryTmp.length === 1 && categoryTmp.includes("all")) {
  //     setSelectedCategories("All");
  //   }else{
  //     setSelectedCategories(
  //       categoryTmp
  //       .filter((category) => category !== "all")
  //       .map(capitalizeFrontText)
  //       .join(",")
  //       );
  //     }
  // }, [categoryTmp]);

  // const get_template_categories_new = async(url,token,category) =>{
  //   const response_data = await fetchData(url+"?category="+category,token)
  //   if(response_data.status==200){
  //     settemplateData(response_data.data)
  //   }else{
  //     navigate("/logout")
  //   }
  // }


  // useEffect(()=>{
  //   if(selectedCategories!=null){
  //     if(categoryTmp!="custom"){
  //       get_template_categories_new(BACKEND_URL+BACK_END_API_TEMPLATE,AUTH_TOKEN,selectedCategories)
  //     }
  //   }
  // },[selectedCategories])
  // ============select Multiple category=============
  
  
  
  // ============select Single category=============
  const [categoryTmp, setCategoryTmp] = useState(["All"]);
  const [selectedCategories, setSelectedCategories] = useState("All");

  const capitalizeFrontText = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const handleCategoryClick = (selectedCategory) => {
    // console.log("selectedCategory",selectedCategory)  
    if(selectedCategory=="custom" || selectedCategory=="Custom"){
      setCategoryTmp(["Custom"]);
      get_custome_template()
      return;
    }
    if (selectedCategory === "all") {
      if (categoryTmp.length === 1 && categoryTmp.includes("all")) {
        // If only "All" is selected, deselect it
        setCategoryTmp([]);
      } else {
        // If other categories are selected, select only "All"
        setCategoryTmp(["all"]);
      }
    } else {
      if (categoryTmp.includes("all")) {
        // If "All" is selected, deselect it and select the clicked category
        setCategoryTmp([selectedCategory]);
      } else {
        // Toggle the selection of the clicked category
        setCategoryTmp([selectedCategory])
      }
    }
  };


  useEffect(() => {
    if (categoryTmp.length === 1 && categoryTmp.includes("all")) {
      setSelectedCategories("All");
    }else{
      setSelectedCategories(
        categoryTmp
        .filter((category) => category !== "all")
        .map(capitalizeFrontText)
        .join(",")
        );
      }
  }, [categoryTmp]);

  const get_template_categories_new = async(url,token,category) =>{
    const response_data = await fetchData(url+"?category="+category,token)
    if(response_data.status==200){
      settemplateData(response_data.data)
    }else{
      navigate("/logout")
    }
  }


  useEffect(()=>{
    if(selectedCategories!=null){
      if(categoryTmp!="Custom"){
        get_template_categories_new(BACKEND_URL+BACK_END_API_TEMPLATE,AUTH_TOKEN,selectedCategories)
      }
    }
  },[selectedCategories])
  // ============select Single category=============
  
  

  // =============get the custom template===========
  const get_custome_template = async() =>{
    const resp = await fetchData(BACKEND_URL+BACK_END_API_CUSTOM_TEMPLATE,AUTH_TOKEN)
    if(resp.status=200){
      settemplateData(resp.data)
    }
  }


  return (
    <div className="w-full ">

      {/* <StreamingComponent /> */}

      <h1 className="text-2xl font-bold mb-6">Templates</h1>

      <div>


      <div className="dark:text-white relative mb-6 ml-0 sm:ml-[40%]">
        <div className="dark:text-white icon absolute top-1/2 left-4 -translate-y-1/2 w-6 h-6">
          <SearchIconTemplate />
        </div>
        <input
          className="dark:bg-gray-600 dark:text-white  w-full h-10 py-2.5 pr-4 pl-[52px] border border-border rounded-3xl placeholder:text-black placeholder-both-screens"
          type="text" 
          placeholder="Search content types like Facebook Ads, Email, Blog ideas..."
          onChange={(e) => {
            setsearch_parameter(e.target.value);
          }}
        />
      </div>


        <div className="searchtags flex flex-wrap gap-2 mb-6">
        {category
        ?
        <>


        {/* this is for multiple select */}
        {category.slice()
        .sort((a, b) => a.localeCompare(b)) // Sort the categories in ascending order
        .map((item, index) => (
          <>
                <button
                  key={index}
                  className={clsx(
                    "dark:bg-black dark:text-gray-200 dark:border-slate-500 dark:hover:bg-gray-500 text-sm text-black px-4 py-2 border border-border rounded-3xl duration-300",
                    {
                      "active text-white bg-blue border-blue": categoryTmp.includes(item),
                      "hover:bg-blue/10": !categoryTmp.includes(item),
                    }
                  )}
                  onClick={() => {
                    handleCategoryClick(item);
                  }}
                >
                  {capitalizeFrontText(item)}
                </button>
          </>
        ))}
        {/* this is for multiple select */}


        {/* this is for single select */}
        {/* {category.slice()
          .sort((a, b) => a.localeCompare(b))
          .map((item, index) => (
            <button
              key={index}
              className={clsx(
                "text-sm text-black px-4 py-2 border border-border rounded-3xl duration-300",
                {
                  "active text-white bg-blue border-blue": selectedCategories === item,
                  "hover:bg-blue/10": selectedCategories !== item,
                }
              )}
              onClick={() => {
                handleCategoryClick(item);
              }}
            >
              {capitalizeFrontText(item)}
            </button>
          ))} */}
          {/* this is for single select */}


            </>
          :
            <LoadingPage/>
          }
        </div>


        <div className="cardwrap grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {templateData ? (
                <>
                {templateData[0] && templateData.length > 0
                ?
                <>
                {templateData.map((items, index) => {
                  return (

                    <div
                        key={items.id}
                        className="flex p-3 border border-border  rounded-xl cursor-pointer"
                        onClick={() => {
                          if (items.premium) {
                            if (subscriptions_check.status === "trial") {
                              notifyerror(
                                "To use this Template you need to upgrade your plan"
                              );
                              return true;
                            }
                          }
                          if (items.custome === "user") {
                            navigate(`/template/${items.id}?custom=user`);
                          } else {
                            navigate(`/template/${items.id}?custom=normal_user`);
                          }
                        }}
                      >                        

                        <div className="icon flex-none w-14 h-14 p-2  bg-blue-700/10 rounded-xl">
                          <img src={items.icon} alt="" className="block w-full" />
                        </div>

                        <div className="content flex-auto pl-4">
                          
                          <div className="flex items-center justify-between gap-2 mb-2">

                            <h4 className="text-sm  font-bold leading-none">
                              {items.title}
                            </h4>

                            {items.premium && (
                              <span className="md:inline text-xs md:text-sm lg:text-sm text-green py-1 px-1 bg-green/10 border border-green rounded-3xl">
                                Premium
                              </span>
                            )}
                            
                          </div>
                          
                          <p className="text-sm leading-none">{items.description}</p>
                        </div>


                      </div>
                  );
                })
                }
                </>
                :
                 null
                }
                </>
              ) : (
                <>
                  <LoadingPage />
                </>
              )}
        </div>

              {templateData &&
                <>
                    {templateData[0] && templateData.length > 0
                    ?
                      null
                    :
                        <>
                          <div className="flex items-center justify-center">
                            <p className="text-3xl text-gray-500">No Data</p>
                          </div>
                        </>
                    }
              </>
              }


      </div>
      {/* <Toaster/> */}
    </div>
  );
};

export default Template;
