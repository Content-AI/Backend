import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL,BACK_END_API_TEMPLATE,BACK_END_API_CUSTOM_TEMPLATE,BACK_END_API_INNER_TEMPLATE ,BACK_END_API_SELECT_FIELD} from "../../../../apis/urls";
import { useParams } from 'react-router-dom';
import CreatableSelect from "react-select/creatable";
import { fetchData,postData } from "../../../../apis/apiService";
import toast, { Toaster } from "react-hot-toast";
import LoadingPage from "../../../LoadingPage";
import { useSelector, useDispatch } from "react-redux";

const BuildcustomTemplate = (props) => {
    const navigate = useNavigate()
    const { template_id } = useParams();


  let DarkMode = useSelector((state)=>state.SetDarkMode.DarkMode)


    const notifyerror = (message) => toast.error(message);
    const notifysucces = (message) => toast.success(message);


    const handleGoBack = () => {
        navigate(-1);
    };

    const get_template_data = async() => {
        const resp = await fetchData(BACKEND_URL+BACK_END_API_INNER_TEMPLATE+template_id,props.AUTH_TOKEN)
        if(resp.status==200){
            setTemplateData(resp.data)

        }else{
            navigate("/")
        }
    }

    useEffect(()=>{
        get_template_data()
    },[])

    const [TemplateData,setTemplateData]=useState(null)

    const [fieldValues, setFieldValues] = useState([]);
    const [loading,setloading] = useState(false);

    let ChosenWorkspaceId = useSelector(
      (state) => state.SetChosenWorkspaceId.ChosenWorkspaceId
      );
    const [inputs, setInputs] = useState([{ key: "", value: "" }]);

    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([
        { value: "nice", label: "Nice" },
        { value: "fancy", label: "Fancy" },
        { value: "relaxed", label: "Relaxed" },
        { value: "skilled", label: "Skilled" },
        { value: "confident", label: "Confident" },
        { value: "daring", label: "Daring" },
        { value: "funny", label: "Funny" },
        { value: "persuasive", label: "Persuasive" },
        { value: "empathetic", label: "Empathetic" },
    ]);
    const [value, setValue] = useState(null);

  const handleInputChange = (event, index) => {
    const { name, value } = event.target;
    const truncatedValue = value.slice(
      0,
      TemplateData[0]["template_fields"][index].range_of_text
    );
    const updatedFieldValues = [...fieldValues];
    updatedFieldValues[index] = {
      ...updatedFieldValues[index],
      name,
      value: truncatedValue,
    };

    if (value === "") {
      updatedFieldValues[index].value = " ";
    }

    setFieldValues(updatedFieldValues);
  };


  const handleMultipleInputChange = (event, index, key) => {
    const newInputs = [...inputs];
    newInputs[index] = { key, value: event.target.value };
    setInputs(newInputs);
  };

  const handleMultipleInputDelete = (index) => {
    const newInputs = [...inputs];
    newInputs.splice(index, 1);
    setInputs(newInputs);
  };

  const handleAdd = () => {
    setInputs([...inputs, ""]);
  };


  const displayText = (index) => {
    if (index === 0) {
      return "Tell us first key word";
    } else if (index === 1) {
      return "Tell us second key word";
    } else if (index === 2) {
      return "One last word";
    } else {
      return "...";
    }
  };


  
  const createOption = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  });

  const handleCreate = (inputValue) => {
    setIsLoading(true);
    setTimeout(() => {
      const newOption = createOption(inputValue);
      setIsLoading(false);
      setOptions((prev) => [newOption, ...prev]);
      setValue(newOption);
    }, 1000);
  };

  const get_select_fields = async () => {
    const resp = await fetchData(
      BACKEND_URL + BACK_END_API_SELECT_FIELD,
      props.AUTH_TOKEN
    );
    if (resp.status == 200) {
      const newData = resp.data.map((item) => createOption(item.label));
      setOptions((prevOptions) => [...newData, ...prevOptions]);
    }
  };
  useEffect(() => {
    get_select_fields();
  }, []);



  const handleClick = async (id_of_template) => {
    // console.log(TemplateData[0]["title"])
    // return true
    const divElement = document.getElementById(id_of_template);
    const inputElements = divElement.getElementsByTagName("input");
    const textareaElements = divElement.getElementsByTagName("textarea");

    const elements = [...inputElements, ...textareaElements];

    const formData = Array.from(elements).reduce((data, element) => {
      data[element.name] = element.value;
      return data;
    }, {});
    let isFormDataValid = true;
    formData["language"] =
    formData["generate"] = TemplateData[0]["title"];
    formData["ids"] = TemplateData[0]["id"];
    formData["workspace_id"] = ChosenWorkspaceId["Workspace_Id"];


    const keyToCheck = /^(?!.*[Tt]one)(?!.*features).*$/;
    
    // return true
    for (const [key, value] of Object.entries(formData)) {
      if (key === "") {
        delete formData[key];
      }
    }
  
    // Object.entries(formData).forEach(([key, value_d]) => {
    //   if (key.match(keyToCheck)) {
    //     // Case-sensitive match
    //     if (value_d.trim() === "") {
    //       // notifyerror(`Value for ${key} is empty.`);
    //       isFormDataValid = false;
    //     }
    //   }
    // });

    if (value != null) {
      // formData["tone"] = value.value;
    }

    // if(templateName=="" || templateName==" "){
      // }else{
        //   notifyerror("Template Name misssing")
    // }
    if (templateName.trim().length === 0) {
      notifyerror("Template Name is missing");
      return true
    } else {
      formData["templateName"] = templateName.trim();
    }
    
    const key_feature = inputs;
    // if (
      //   key_feature.length === 1 &&
      //   key_feature[0].key === "" &&
      //   key_feature[0].value === ""
      // ) {} else {
        //   if(Object.keys(key_feature).length != 0){
          //   }
          // }
          
          if (divElement) {
            const keyFeatureInput = divElement.querySelector('input[name="key_feature_input"]');
            if (keyFeatureInput) {
        formData["key_feature"] = key_feature;
      }
    }
    // console.log(formData)
    setloading(true)
    const resp = await postData(formData,BACKEND_URL+BACK_END_API_CUSTOM_TEMPLATE,props.AUTH_TOKEN)
    if(resp.status==201){
      try{
        // navigate(`/template/${resp.data.id}?custom=user`)
      }catch(e){
        navigate(`/`)
      }
    }else{
      try{
        notifyerror(resp.response.data.message)
      }catch(e){
        notifyerror("something went wrong")
      }
    }
    setloading(false)
  };


  // =============template name=================
  const [templateName, setTemplateName] = useState("");

  const handleTemplateNameChange = (event) => {
    const value = event.target.value;
    if (value.length <= 40) {
      setTemplateName(value);
    }
  };

  return (
    <>
    {loading
    ?
      <LoadingPage />
    :
      <>
        <Toaster />
        <div class="fixed inset-0 z-40 overflow-y-auto backdrop-blur-sm">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 shadow-lg">
            <div class="fixed inset-0 transition-opacity  bg-opacity-30 opacity-40"></div>
            <div class="dark:bg-gray-800 relative h-full bg-white text-gray-900 rounded-md shadow-xl align-top sm:align-middle w-full sm:w-[900px] md:w-[900px] opacity-100 translate-y-0 sm:scale-100">
              <div class="flex flex-col p-6">
                  <div class="-m-6 divide-y divide-gray-200">
                    <div class="p-6 space-y-4">
                        <div class="space-y-1">
                          <h1 class=" dark:text-gray-300 mb-2 text-lg font-semibold text-gray-900">Create Custom Template</h1>
                          <button class="dark:text-gray-300 outline-none absolute top-0 right-0 z-10 p-8 ring-0 hover:opacity-70" tabindex="0" aria-label="Close"
                          onClick={()=>
                                handleGoBack()
                          }>
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M13.7071 3.70711C14.0976 3.31658 14.0976 2.68342 13.7071 2.29289C13.3166 1.90237 12.6834 1.90237 12.2929 2.29289L8 6.58579L3.70711 2.29289C3.31658 1.90237 2.68342 1.90237 2.29289 2.29289C1.90237 2.68342 1.90237 3.31658 2.29289 3.70711L6.58579 8L2.29289 12.2929C1.90237 12.6834 1.90237 13.3166 2.29289 13.7071C2.68342 14.0976 3.31658 14.0976 3.70711 13.7071L8 9.41421L12.2929 13.7071C12.6834 14.0976 13.3166 14.0976 13.7071 13.7071C14.0976 13.3166 14.0976 12.6834 13.7071 12.2929L9.41421 8L13.7071 3.70711Z" fill="currentColor"></path>
                              </svg>
                          </button>
                        </div>                  
                    </div>
                    


                    {/* ========Template start=================== */}
                    {TemplateData &&
                        TemplateData.length>0
                        ?
                        <>
                        <div id={TemplateData[0]["id"]} className="p-8">
                          {/* ========Template Name=================== */}

                            <div className="space-y-1.5 w-full" >
                              <label
                                htmlFor="form-field-templateName"
                                className="text-sm font-medium block text-gray-900 placeholder:text-gray-400 transition-[color] duration-150 ease-in-out"
                              >
                                <span className="flex items-center space-x-1">
                                  <span className="dark:text-gray-300">Template Name</span>
                                </span>
                              </label>
                              <div className="dark:text-gray-300 dark:bg-gray-800  py-1 flex items-center gap-2 bg-white w-full px-3 rounded-lg ring-1 hover:ring-2 transition-all duration-150 ease-in-out ring-gray-200 outline-none focus-within:!ring-1">
                                <div className="flex items-center grow gap-2 py-1.5">
                                  <div className=" flex gap-1 grow">
                                    <input
                                      className="dark:text-gray-300 dark:bg-gray-800 block w-full text-gray-900 placeholder:text-gray-400 text-sm font-normal resize-none outline-none"
                                      maxLength="40"
                                      type="text"
                                      id="templateName"
                                      value={templateName}
                                      onChange={handleTemplateNameChange}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="ml-auto text-xs text-gray-500 transition-[color] duration-150 ease-in-out">
                                  {templateName.length}/40
                                </span>
                        
                              </div>
                            </div>
                          {/* ========Template Name=================== */}
                          {/* ==========the template data=========== */}

                          {TemplateData[0]["template_fields"].map((data, index) => {
                            const textLength = fieldValues[index]?.value?.length || 0;

                            return (
                                (data.component === "textarea" && (
                                  <div className="last:mb-1 relative" key={index}>
                                    <div className="space-y-1.5 w-full">
                                      <label
                                        htmlFor="form-field-productInfo"
                                        className=" text-sm font-medium block text-gray-900 placeholder:text-gray-400 transition-[color] duration-150 ease-in-out"
                                      >
                                        <span className="flex items-center space-x-1 dark:text-white ">
                                          <span>{data.label}</span>
                                        </span>
                                      </label>
                                      <div className="dark:bg-gray-800 dark:text-gray-200 py-2.5 relative gap-2 bg-white w-full px-3 rounded-lg ring-1 hover:ring-2 transition-all duration-150 ease-in-out ring-gray-200 outline-none focus-within:!ring-1">
                                        <textarea
                                          id="form-field-productInfo"
                                          className="dark:bg-gray-800 dark:text-gray-200 block w-full h-[300px] text-gray-900 placeholder:text-gray-400 text-sm font-normal resize-none outline-none max-h-64 overflow-y-auto"
                                          maxLength={data.range_of_text}
                                          name={data.title}
                                          placeholder={data.placeholder}
                                          value={
                                            fieldValues[index]?.value ||
                                            data.pre_define_value ||
                                            ""
                                          }
                                          onChange={(event) =>
                                            handleInputChange(event, index)
                                          }
                                        ></textarea>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="ml-auto text-xs text-gray-500 transition-[color] duration-150 ease-in-out">
                                          {textLength}/{data.range_of_text}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )) ||
                                (data.component === "text" && (
                                  <div className="space-y-1.5 w-full" key={index}>
                                    <label
                                      htmlFor="form-field-productName"
                                      className="text-sm font-medium block text-gray-900 placeholder:text-gray-400 transition-[color] duration-150 ease-in-out"
                                    >
                                      <span className="flex items-center space-x-1 dark:text-white">
                                        <span>{data.label}</span>
                                      </span>
                                    </label>
                                    <div className="dark:bg-gray-800 dark:text-gray-200 py-1 flex items-center gap-2 bg-white w-full px-3 rounded-lg ring-1 hover:ring-2 transition-all duration-150 ease-in-out ring-gray-200 outline-none focus-within:!ring-1">
                                      <div className="dark:bg-gray-800 dark:text-gray-200 flex items-center grow gap-2 py-1.5">
                                        <div className="dark:bg-gray-800 dark:text-gray-200 flex gap-1 grow">
                                          <input
                                            className="dark:bg-gray-800 dark:text-gray-200 block w-full text-gray-900 placeholder:text-gray-400 text-sm font-normal resize-none outline-none"
                                            maxLength={data.range_of_text}
                                            name={data.title}
                                            type={data.component}
                                            placeholder={data.placeholder}
                                            value={
                                              fieldValues[index]?.value ||
                                              data.pre_define_value ||
                                              ""
                                            }
                                            onChange={(event) =>
                                              handleInputChange(event, index)
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="ml-auto text-xs text-gray-500 transition-[color] duration-150 ease-in-out">
                                        {textLength}/{data.range_of_text}
                                      </span>
                                    </div>
                                  </div>
                                )) ||
                                (data.component === "Example" && (
                                  <>
                                    <div className="mt-3">
                                      <label
                                        htmlFor="form-field-productInfo"
                                        className="text-sm font-medium block text-gray-900 placeholder:text-gray-400 transition-[color] duration-150 ease-in-out"
                                      >
                                        <span className="flex items-center space-x-1">
                                        <span className="dark:text-gray-300">Example</span>
                                        </span>
                                      </label>
                                    </div>
                                    <div className=" flex justify-between flex-col space-y-2 key={index_inner}">
                                      {inputs.map((input, index_inner) => (
                                        <div
                                          className=" flex justify-between flex-col space-y-2"
                                          key={index_inner}
                                        >
                                          <div className=" flex items-center justify-between space-x-2">
                                            <div className="bg-gray-300/20 dark:text-white text-gray-500 font-bold text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                              {index_inner + 1}
                                            </div>
                                            <div className="dark:bg-gray-800 dark:text-gray-200 space-y-1.5 w-full">
                                              <div className="dark:bg-gray-800 dark:text-gray-200 py-1 !mt-0 flex items-center gap-2 bg-white w-full px-3 rounded-lg ring-1 hover:ring-2 transition-all duration-150 ease-in-out ring-gray-200 outline-none focus-within:!ring-1">
                                                <div className="dark:bg-gray-800 dark:text-gray-200 flex items-center grow gap-2 py-1.5">
                                                  <div className="dark:bg-gray-800 dark:text-gray-200 flex gap-1 grow">
                                                    <input
                                                      id={`example-${index_inner + 1}`}
                                                      type="text"
                                                      className="dark:bg-gray-800 dark:text-gray-200 block w-full text-gray-900 placeholder:text-gray-400 text-sm font-normal resize-none outline-none"
                                                      placeholder={displayText(
                                                        index_inner
                                                      )}
                                                      value={input.value}
                                                      onChange={(event) =>
                                                        handleMultipleInputChange(
                                                          event,
                                                          index_inner,
                                                          `key_${index_inner + 1}`
                                                        )
                                                      }
                                                      // id={`example-${index_inner + 1}`}
                                                      // type="text"
                                                      // className="block w-full text-gray-900 placeholder:text-gray-400 text-sm font-normal resize-none outline-none"
                                                      // placeholder={displayText(
                                                      //   index_inner
                                                      // )}
                                                      // value={input.value}
                                                      // onChange={(event) =>
                                                      //   handleMultipleInputChange(
                                                      //     event,
                                                      //     index_inner
                                                      //   )
                                                      // }
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>

                                            {/* Delete button */}
                                            <button
                                              type="button"
                                              className="dark:bg-gray-800 dark:text-gray-200 transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-700 selectionRing active:bg-gray-100 active:text-gray-700"
                                              onClick={() =>
                                                handleMultipleInputDelete(index_inner)
                                              }
                                            >
                                              <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  viewBox="0 0 20 20"
                                                  fill="currentColor"
                                                  aria-hidden="true"
                                                  className="w-3"
                                                >
                                                  <path
                                                    fillRule="evenodd"
                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                  ></path>
                                                </svg>
                                              </span>
                                            </button>
                                          </div>
                                        </div>
                                      ))}
              

                                      {/* + button */}
                                      <span className="self-end">
                                        <button
                                          type="button"
                                          className="dark:bg-gray-800 dark:text-gray-200 transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-2 active:ring-1"
                                          // onClick={handleAdd}
                                          onClick={() => setInputs([...inputs, { key: "", value: "" }])}
                                        >
                                          +
                                        </button>
                                      </span>

                                      {/* Submit button */}
                                      {/* <button
                                                        type="button"
                                                        className="transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-700 selectionRing active:bg-gray-100 active:text-gray-700"
                                                        onClick={handleSubmit}
                                                    >
                                                        save
                                                    </button> */}
                                    </div>
                                  </>
                                )) ||
                                (data.component === "select" && (
                                  <>
                                    <div>
                                      <label
                                        htmlFor="form-field-productInfo"
                                        className="text-sm font-medium block text-gray-900 placeholder:text-gray-400 transition-[color] duration-150 ease-in-out"
                                      >
                                        <span className="flex items-center space-x-1">
                                          <span className="text-white">{data.label}</span>
                                        </span>
                                      </label>
                                    </div>
                                    <div className="dark:bg-gray-800 dark:text-black flex justify-between flex-col space-y-2 key={index_inner} mt-3">
                                    {DarkMode
                                    ?
                                      <CreatableSelect
                                        isClearable
                                        isDisabled={isLoading}
                                        isLoading={isLoading}
                                        onChange ={(newValue ) => setValue(newValue)}
                                        onCreate Option ={handleCreate }
                                        options={ options }
                                          value={ value }
                                          styles={{
                                            control :  ( provided ) => ({ 
                                            ...provided, 
                                            backgroundColor:"#1f2937"}),
                                          singleValue: (provided) =>  ({
                                            ...provided,
                                            color:"white"}),
                                        }}
                                      />
                                      :
                                      <CreatableSelect
                                        isClearable
                                        isDisabled={isLoading}
                                        isLoading={isLoading}
                                        onChange={(newValue) => setValue(newValue)}
                                        onCreateOption={handleCreate}
                                        options={options}
                                        value={value}
                                      />
                                    }
                                    </div>
                                  </>
                                ))
                              );
                            })}
                        </div>
                        {/* ==========the template data=========== */}
                        </>
                        :
                          <p>Refresh page</p>
                    }


                    {/* ========Template start=================== */}
                    <div class="flex justify-end p-6">
                    <button type="button" class="bg-[#334977] transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-lg px-4 py-2 text-base  text-white ring-1 ring-gray-200 hover:ring-2 active:ring-1"
                    onClick={()=>{
                        handleClick(TemplateData[0]["id"]);
                    }}
                    >
                    <span class="flex items-center justify-center mx-auto space-x-2 select-none">
                    + Create</span></button></div>
                  </div>
              </div>
            </div>
        </div>
        </div>
      </>
    }
     </>
  )
}

export default BuildcustomTemplate