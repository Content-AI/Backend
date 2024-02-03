import React, { useEffect, useState,useRef } from "react";

// import QuillWrapper from './quillcomponent'
// import Editor from './EditorWithUseQuill';
import { setDocumentTitle } from '../../../NavBar/DynamicTitle';

import { useParams } from 'react-router-dom';

import { fetchData, patchData,postData } from "../../../../apis/apiService";
import { BACKEND_URL,BACK_END_API_SINGLE_WORKFLOW,BACK_END_API_REMOVE_USER,BACK_END_API_REMOVE_USER_FROM_DOC,BACK_END_API_DOC_SHARED_TO_USER,BACK_END_API_MAKE_PUBLIC_OR_NOT,BACK_END_API_CHECK_PUBLIC_OR_NOT,BACK_END_API_SEND_INVITATION,BACK_END_API_CAN_INVITE,BACK_END_API_DOCUMENTS_USERS,BACK_END_API_DOCUMENTS,BACK_END_API_CUSTOM_TEMPLATE,BACK_END_API_GET_CUSTOM_TEMPLATE,BACK_END_API_SELECT_FIELD,BACK_END_API_TEMPLATE, BACK_END_API_RESPONSE,BACK_API_HISTORY, BACK_END_API_INNER_TEMPLATE } from "../../../../apis/urls";
import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import CreatableSelect from "react-select/creatable";
import { useLocation } from 'react-router-dom';

import ChatInEditor from './ChatInEditor/ChatInEditor'

import toast, { Toaster } from 'react-hot-toast';

import {setText} from "../../../../features/EditorText";

import ResponseTemplate from "../ResponseTemplate";

import BouncingDotsLoader from "../../../BouncingDotsLoader";
import WholeTemplateRender from "./WholeTemplateRender";
import {_template_id_} from '../../../../features/LeftTemplateId';
import { _save_details_ } from "../../../../features/Subscriptions";

import {_pre_len_text_,_now_len_text_} from '../../../../features/LengthOfEditorWord';

import { Transition } from "@headlessui/react";

import Editor from "./EditorForDocuments/editor/Editor";
// import EditorTextParser from "./EditorForDocuments/editor-parser/EditorTextParser";
import Fullscreen from '../../../Icons/Fullscreen'
import Chat from '../../../Icons/Chat'
import Template from '../../../Icons/Template'
import Template_Editor from '../../../Icons/Template_Editor'

import WorkflowSteps from "../../workflow/WorkflowSteps";
import { _change_state_ } from "../../../../features/TriggerSwitchForCallingAPIsOfDocumentDoingWorkFlowAfterGenerate";

import DarkModeTemplate from "./DarkModeTemplate";

function EditDocuments() {


  let navigate = useNavigate();
  const dispatch = useDispatch();
  const ref = useRef();

  useEffect(() => {
    setDocumentTitle("Editor Page");
  }, []);

  let upgrade_plan={restrict_user: true, customer_stripe_id: 'null', email: 'null', subscription_type: 'null', status: 'trial'}

  
  const [delta, setDelta] = useState({
    ops: [{ insert: " Loading ....." }]
  });



  // ============the editor state============
  const [editorData, seteditorData] = useState(null);
  const [EditorContent,setEditorContent]=useState(null)


  const [dirtyInnerHTML, setDirtyInnerHTML] = useState("");
  // const [text, setText] = useState("");
  const [length, setLength] = useState("");
  const [DocumentId, setDocumentId] = useState(null);
  const [title, settitle] = useState(null);

  const [TemplateData, setTemplateData] = useState(null);

  const { document_id } = useParams();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const templateValue = searchParams.get('template');

  const custome = searchParams.get('custome');
  // only load workflow if page=workflow
  const page = searchParams.get('page');
  const template_editing = searchParams.get('template_editing');
  
  
  let TOKEN = useSelector(
    (state) => state.SetAuthenticationToken.AuthenticationToken
  );
  let LeftListTemplateData = useSelector(
    (state) => state.SetLeftTemplateId.LeftTemplateId
  );
  let PRE_LENGTH_OF_WORD = useSelector(
    (state) => state.SetLengthOfEditorWord.LengthOfEditorWord.preLen
  );
  let NOW_LENGTH_OF_WORD = useSelector(
    (state) => state.SetLengthOfEditorWord.LengthOfEditorWord.nowLen
  );

  let EDITOR_TEXT = useSelector(
    (state) => state.SetEditorText
  );

  let DarkMode = useSelector((state)=>state.SetDarkMode.DarkMode)


  let TriggerSwitchForCallingAPIsOfDocumentDoingWorkFlowAfterGenerate = useSelector(
    (state) => state.SetTriggerSwitchForCallingAPIsOfDocumentDoingWorkFlowAfterGenerate.TriggerSwitchForCallingAPIsOfDocumentDoingWorkFlowAfterGenerate
  );

  
  let ChosenWorkspaceId = useSelector(
    (state) => state.SetChosenWorkspaceId.ChosenWorkspaceId
    );

  const [TemplateDataInputFields, setTemplateDataInputFields] = useState([]);
  const [TemplateResponseData, setTemplateResponseData] = useState(null);
  
  const [WholeTemplate,setWholeTemplate] = useState(null);

  const [ProjectId, setProjectId] = useState(null);

  // const [Inputlanguage,setInputlanguage] = useState([]);

  const [languageOptions, setLanguageOptions] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [HoverBtnColor,setHoverBtnColor] = useState(true);


  const [Outputlanguage, setOutputlanguage] = useState([]);
  const [OutputlanguageChoice, setOutputlanguageChoice] = useState("English");
  
    
  const [SharePopUpModal,setSharePopUpModal] = useState(false);


  const [inputs, setInputs] = useState([]);
  const [multipleInputForms, setMultipleInputForms] = useState({});


  const [ShowHideHistory, setShowHideHistory] = useState(false);

  const [history_answer, set_history_answer] = useState(null);

  const [range_of_text_from_browser, setrange_of_text_from_browser] = useState(0);

  const [ContentOutputNumber, setContentOutputNumber] = useState(2);

  const [LoadingButton, setLoadingButton] = useState(false);
  
  const [LengthOfWord, setLengthOfWord] = useState('');


  const { template_id } = useParams();

  const notifyerror = (message) => toast.error(message);
  const notifysucces = (message) => toast.success(message);


  const [renderKey, setRenderKey] = useState(0);

  const [fieldValues, setFieldValues] = useState([]);


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
    const truncatedValue = value.slice(0, TemplateData[0]['template_fields'][index].range_of_text);
    const updatedFieldValues = [...fieldValues];
    updatedFieldValues[index] = { ...updatedFieldValues[index], name, value: truncatedValue };

    if (value === '') {
      updatedFieldValues[index].value = ' ';
    }
    if (value.length > 3) {
      updatedFieldValues[index].value = value.trimStart();
    }

    setFieldValues(updatedFieldValues);
  };

  const get_document_content = async (document_id, templateValue) => {
    const resp = await fetchData(BACKEND_URL + BACK_END_API_DOCUMENTS + "/" + document_id + "/", TOKEN)

    try {
      if (resp.status == 200) {
        const res_data = resp.data?.document_content
        seteditorData(resp.data?.document_content);
        // setDelta(newDelta);
        settitle(resp.data?.title)
        setDocumentId(resp.data.id)
        setLengthOfWord(resp.data?.document_content)
        dispatch(_pre_len_text_((resp.data?.document_content).length))
        dispatch(_now_len_text_((resp.data?.document_content).length))
      } else {
        navigate("/templates")
      }
    } catch (e) {
      // notifyerror("something went wrong refresh page")
    }

    dispatch(_change_state_(false))

  }

  useEffect(()=>{
    if(TriggerSwitchForCallingAPIsOfDocumentDoingWorkFlowAfterGenerate==true){
        seteditorData(null)
        get_document_content(document_id,"")
      }
  },[TriggerSwitchForCallingAPIsOfDocumentDoingWorkFlowAfterGenerate])
  


  const get_custom_template_data = async(template_id) => {
    
    const resp_template_data = await fetchData(BACKEND_URL + BACK_END_API_GET_CUSTOM_TEMPLATE + templateValue, TOKEN)
    if(resp_template_data.status == 200) {
      setTemplateData(resp_template_data.data)
    }else{
      const res_template = await fetchData(BACKEND_URL+BACK_END_API_TEMPLATE,TOKEN)
      if(res_template.status==200){
        setWholeTemplate(res_template.data)
      }
    }
  }
  const get_normal_template = async(template_id) => {
    // console.log('get_normal_template : ',template_id)
    if(page!="workflow")
    {
      const resp_template_data = await fetchData(BACKEND_URL + BACK_END_API_INNER_TEMPLATE + template_id, TOKEN)
      if(resp_template_data.status == 200) {
        setTemplateData(resp_template_data.data)
      }else{
        const res_template = await fetchData(BACKEND_URL+BACK_END_API_TEMPLATE,TOKEN)
        if(res_template.status==200){
          setWholeTemplate(res_template.data)
        }
      }
    }
  }

  const WholeTemplateApi = async() =>{
    if(page!="workflow")
    {
      setFieldValues({})
      setContentOutputNumber(2)
      const res_template = await fetchData(BACKEND_URL+BACK_END_API_TEMPLATE,TOKEN)
        if(res_template.status==200){
          setWholeTemplate(res_template.data)
        }
    }
  }

  const get_history = async(template_id_for_history) => {
    if(ChosenWorkspaceId){
      const resp =  await fetchData(BACKEND_URL+BACK_API_HISTORY+"/"+template_id_for_history+"?workspace_id="+ChosenWorkspaceId["Workspace_Id"],TOKEN)
      if(resp.status=200){
          set_history_answer(resp.data)
      }
    }
  }

  
  useEffect(()=>{
    if(LeftListTemplateData!=null){
    set_history_answer(null)
    get_history(LeftListTemplateData[0].id)
  }
  },[LeftListTemplateData])

  useEffect(() => {
    if (document_id.length > 0) {
      get_document_content(document_id, templateValue)
      if(custome=="user"){
        get_custom_template_data(templateValue)
      }else{
        get_normal_template(templateValue)
      }
      get_history(templateValue)
    }
  }, [])

  const handleTextChange = (content, delta, source, editor) => {
    // console.log(editor.getContents()["ops"][0]["insert"])
    const data = editor.getContents()["ops"][0]["insert"]
    // const text = data.replace(/\n/g, '<br>');
    // console.log("text",text)
    const newDelta = {
      ops: [{ insert: editor.getContents()["ops"][0]["insert"] }],
    };
    setDelta(newDelta); // the delta
    // dispatch(setText(text))
    setLengthOfWord(editor.getContents()["ops"][0]["insert"])
    dispatch(_now_len_text_((editor.getContents()["ops"][0]["insert"]).length))
    // setDirtyInnerHTML(editor.getHTML()); // innerhtml

    // console.log("text",text)
    // setText(text); // text string

    // setLength(editor.getLength()); // text length
  };

  useEffect(()=>{
    if(EDITOR_TEXT.text){
      const newDelta = {
        ops: [{ insert: EDITOR_TEXT.text}],
      };
      setDelta(newDelta);
      dispatch(setText(null))

    }
  },[EDITOR_TEXT])


  useEffect(()=>{
    if(LeftListTemplateData){
      setTemplateData(LeftListTemplateData)
      setWholeTemplate(null)
    }
  },[LeftListTemplateData])

  const handleClick = async(id_of_template) => {
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
    "Generate whole text in " + OutputlanguageChoice + " Language";
    formData["output_results"] = ContentOutputNumber.toString();
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
    
    Object.entries(formData).forEach(([key, value_d]) => {
      if (key.match(keyToCheck)) {
        // Case-sensitive match
        if (value_d.trim() === "") {
          notifyerror(`Value for ${key} is empty.`);
          isFormDataValid = false;
        }
      }
    });
    
    if (inputs.length > 0) {
      formData["inputs"] = inputs;
    }
    
    Object.entries(formData).forEach(([key, value__d]) => {
      const trimmedValue__d = value__d.trim();
      if (trimmedValue__d === "") {
        delete formData[key]; // Remove the key from formData
      }
    });
    if (value != null) {
      formData["tone"] = value.value;
    }
    
    // console.log(formData)
    // return true

    if (isFormDataValid) {
        setLoadingButton(true)
        setShowHideHistory(false)
        setHoverBtnColor(false)
        const res_of_template =  await postData(formData,BACKEND_URL+BACK_END_API_RESPONSE,TOKEN)
        if(res_of_template.status==200){
          if(res_of_template.data.data[0]["content"]=="upgrade your plan"){
            // dispatch(_save_details_(upgrade_plan))
            // navigate("/")
            navigate("/settings/subscription_plan?message=upgrade")

          }
          setTemplateResponseData(res_of_template.data.data)
            // console.log(res_of_template.data)
        setProjectId(res_of_template.data.project_id)
        }else{
            notifyerror("Try again")

        }
      }    
    
      setLoadingButton(false)
  };



  const handleMultipleInputChange = (event, index) => {
    const { value } = event.target;
    const newInputs = [...inputs];
    newInputs[index] = value;
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


  const handleInputLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };
  const handleOutputLanguageChange = (event) => {
    setOutputlanguageChoice(event.target.value);
  };



  const displayText = (index) => {
    if (index === 0) {
      return "Tell us first key word";
    } else if (index === 1) {
      return "Tell us second key word";
    } else if (index === 2) {
      return "One last word";
    } else if (index === 3) {
      return "isn't that enough";
    } else if (index === 4) {
      return "ok that's quite heck of feature";
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
      TOKEN
    );
    if (resp.status == 200) {
      const newData = resp.data.map((item) => createOption(item.label));
      setOptions((prevOptions) => [...newData, ...prevOptions]);
    }
  };
  useEffect(() => {
    get_select_fields();
  }, []);


  const title_change_every_word = async (title_text) => {
      const formData = {
        title: title_text
      }
      await patchData(formData, BACKEND_URL + BACK_END_API_DOCUMENTS + "/" + document_id + "/", TOKEN)
    }

  const handleTitleChange = (event) => {
    const inputValue = event.target.value
    settitle(inputValue)
    title_change_every_word(event.target.value)
  };


  const handleTitleApi = async (event) => {
    if (event.key === 'Enter') {
      const formData = {
        title: title
      }
      await patchData(formData, BACKEND_URL + BACK_END_API_DOCUMENTS + "/" + document_id + "/", TOKEN)
    }
  };





    // ============sending email==================
    const [ListofUser, setListofUser] = useState(null);

    const [email, setEmail] = useState('');
    const [send_loading, setsend_loading] = useState(false);
    const [emails, setEmails] = useState([]);
    const [sendinginvitation,setsendinginvitation] = useState(false);
    const [error, setError] = useState('');

    const get_list_of_user_in_doc = async() =>{
      if(document_id!=null){
        const resp = await fetchData(BACKEND_URL+BACK_END_API_DOCUMENTS_USERS+document_id,TOKEN)
        if(resp.status==200){
          setListofUser(resp.data)
        }
      }
    }

    useEffect(()=>{
      get_list_of_user_in_doc()
    },[document_id])
  
    const handleEmailChange = (event) => {
      setEmail(event.target.value);
      setError('');
    };
  
    const handleEmailKeyDown = async(event) => {
      setsendinginvitation(true)
      if (event.key === 'Enter') {
        
        const fromData= {
          email:email.trim()
          }
          if (isValidEmail(email)) {
          } else {
            notifyerror("email must be valid")
            setError('Invalid email format');
            return true
          }
        const resp = await postData(fromData,BACKEND_URL+BACK_END_API_CAN_INVITE+document_id,TOKEN)

        if(resp.status==200){
            event.preventDefault();
            setEmails([...emails, email.trim()]);
            setEmail('');
            setsendinginvitation(false)
        }else{

          // if(resp.response.data.message=="1"){
          //     notifyerror("User not found")
          // }else{
            notifyerror("User not a member of Workspace")
          // }
          setsendinginvitation(false)
        }

      }
    };
  
    const handleRemoveEmail = (index) => {
      const updatedEmails = emails.filter((_, i) => i !== index);
      setEmails(updatedEmails);
    };
  
    const isValidEmail = (email) => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    };


  const LoaderDiv = () => {
    return (
          <div className="flex justify-center items-center mt-[50vh]">
            <div className="border-t-4 border-gray-900 rounded-full animate-spin h-12 w-12"></div>
          </div>
    )
  }

  // ======send invitation==============
  const send_invitation = async() =>{
    setsendinginvitation(true)
    setsend_loading(true)
    const formData={
        document_id:document_id,
        email:emails
    }
    const resp = await postData(formData,BACKEND_URL+BACK_END_API_SEND_INVITATION,TOKEN)
    if(resp.status==200){
      setEmails([])
      setEmail('')
      setsend_loading(false)
      notifysucces("Users Invited")
      setsendinginvitation(false)
    }else{
      setsend_loading(false)
      notifyerror("User is not member of workspace")
      setsendinginvitation(false)
    }
  }


  // =========copy the url ==================
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
    notifysucces("Url Copied")
  };


  // ===========radio btn==============
  const [isOn, setIsOn] = useState(null);

  const doc_public_or_not = async() => {
    if(document_id!=null){
      const resp = await fetchData(BACKEND_URL+BACK_END_API_CHECK_PUBLIC_OR_NOT+document_id,TOKEN)
      if(resp.status==200){
        setIsOn(true)
      }else{
        setIsOn(false)
      }
    }
  }

  useEffect(()=>{
    doc_public_or_not()
  },[])


  const make_it_public_or_not = async(booldata) =>{
    const formData={
      make:booldata
    }
    const resp = await postData(formData,BACKEND_URL+BACK_END_API_MAKE_PUBLIC_OR_NOT+document_id,TOKEN)
    if(resp.status==200){
      if(resp.data.message==true){
        notifysucces("Workshop is public")
      }else{
        notifysucces("Workshop is private")
      }
    }
  }

  const handleToggle = () => {
    setIsOn((prevState) => !prevState);
    if(isOn==true){
      make_it_public_or_not(false)
    }else{
      make_it_public_or_not(true)
    }
  };


  // ==============doc shared list of user============
  const [listOfUser,setlistOfUser]=useState(null)
  const get_the_list_of_user_shared_doc = async() =>{

    if(document_id!=null){
      const resp = await fetchData(BACKEND_URL+BACK_END_API_DOC_SHARED_TO_USER+document_id,TOKEN)
      if(resp.status==200){
        setlistOfUser(resp.data)
      }
    }
  }
    
  useEffect(()=>{
    get_the_list_of_user_shared_doc()
  },[])


  // ====================remove the user from document share===========================
  
  const SelectField = ({ options, onSelect, defaultValue,role_of_user,data_index }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(defaultValue || '');
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);
  
    const handleOptionSelect = (value) => {
      setSelectedOption(value);
      onSelect(value);
      setIsOpen(false);
    };


    const remove_user_from_workspace = async(id,options) =>{
      if(options=="Remove Member"){
        const formData= {
            id:id,
            permission_data:options
        }
        const resp = await postData(formData,BACKEND_URL+BACK_END_API_REMOVE_USER_FROM_DOC+document_id+"/",TOKEN)
        if(resp.status=200){
          notifysucces("User removed")
          get_the_list_of_user_shared_doc()
        }
      }

    }
    // BACK_END_API_REMOVE_USER_FROM_DOC
  
    return (
      <div ref={ref}>
        <div className="">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700  group flex items-center px-4 py-2 text-sm focus:outline-none hover:bg-gray-100"
          >

            {selectedOption ? (
              selectedOption
            ) : (
              <span className="text-gray-400">{role_of_user}</span>
            )}
          <svg
          className="w-5 h-5 text-gray-400 group-hover:text-gray-500 transition-transform"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
          </button>
        </div>
        <Transition
              show={isOpen}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
          <div className="z-20 absolute  right-0 mt-1 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white text-gray-600 text-sm font-medium shadow-md border border-gray-200 focus:outline-none transform opacity-100 scale-100" aria-labelledby="headlessui-menu-button-:r6e:" id="headlessui-menu-items-:r79:" role="menu" tabIndex="0" data-headlessui-state="open">

                <div role="none">
                  {options.map((option, index) => (
                      <div key={option.value} role="none" className="w-40">
                        <button
                          onClick={() => {
                            handleOptionSelect(option.value);
                            remove_user_from_workspace(data_index["id"],option.value)
                          }}
                          className="text-gray-700 w-40 group flex items-center px-4 py-2 text-sm focus:outline-none hover:bg-gray-100"
                          tabIndex="-1"
                        >
                          {option.label}
                        </button>
                      </div>
                    ))}
                </div>
                
              </div>
      </Transition>
    </div>
    );
  };
  const [selectedRoles, setSelectedRoles] = useState({});

  const handleSelectData = (index, value) => {
    setSelectedRoles((prevSelectedRoles) => ({
      ...prevSelectedRoles,
      [index]: value,
    }));
  };

  // =======top bar button function======
  const [editor_full_screen,set_editor_full_screen]=useState(false)
  const [show_chat,set_show_chat]=useState(false)



  // const DarkModeTemplate = () =>{
  //   if(DarkMode){

  //     return (<span className="flex items-center justify-center mx-auto">
  //     <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
  //       <path d="M1.14,8H14.86" stroke="#FFFFFF" fill="none" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
  //       </path>
  //       <path d="M5.71,3.43c-2,1.64-3,2.64-4.57,4.57,1.56,1.92,2.56,2.93,4.57,4.57" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
  //       </path>
  //   </svg>
  //   </span>)

  //   }else{

  //     return (<span className="flex items-center justify-center mx-auto space-x-2 select-none">
  //     <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
  //       <path d="M1.14,8H14.86" fill="none" stroke="#0D121C" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">

  //       </path>
  //       <path d="M5.71,3.43c-2,1.64-3,2.64-4.57,4.57,1.56,1.92,2.56,2.93,4.57,4.57" fill="none" stroke="#0D121C" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
  //       </path>
  //   </svg>
  //   </span>)

  //   }
  // }



  return (
      <div className="dark:bg-black fixed z-50 top-0 left-0 right-0 h-screen bg-white">
        <div className="relative z-10 dark:bg-black">
          {/* ============================== */}

          <div>
            <div className="flex flex-col overflow-hidden h-[100vh] h-calc-vh-0" >
              <div className="dark:bg-black flex flex-col z-20 shadow-md shadow-slate-500/10 bg-white divide-y divide-slate-200 mb-1">
                <div className="flex flex-wrap items-center justify-center py-1 overflow-visible space-x-2">
                  <div className="flex items-center justify-start space-x-2 px-3 flex-1">
                    <div className="-mx-3">
                      <button type="button" className=" transition-all duration-200 relative font-semibold shadow-sm hover:outline-none focus:outline-none px-4 py-2 text-base text-center bg-transparent focus:ring-transparent rounded outline-none shadow-transparent"
                        onClick={() => {
                          navigate("/templates")
                        }}
                      >
                        <DarkModeTemplate/>
                      </button>
                    </div>
                    <input
                      className="dark:bg-gray-700 dark:rounded-md dark:p-1 dark:text-white truncate outline-none focus:outline-none text-sm disabled:bg-white disabled:cursor-not-allowed"
                      type="text"
                      placeholder=""
                      value={title}
                      onChange={handleTitleChange}
                      onKeyDown={handleTitleApi}
                    />

                  </div>


                  {/* ========top button======= */}

                  <div className="hidden md:flex flex-none items-center justify-center">
                    
                    <div className="flex items-center transform">




                        {/* for now chat is disabled */}

                      {/* <span className="relative hover:z-10">
                        <button type="button" className="transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-2 active:ring-1"
                        onClick={()=>{
                          set_show_chat(!show_chat)
                        }}>
                          <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                            <span>
                            <Chat/>
                            </span>
                          </span>
                        </button>
                      </span> */}


                      <span className="relative hover:z-10">

                      <button type="button" title="Edit in Full-Screen" className="dark:ring-1 dark:ring-slate-500 dark:bg-gray-700  dark:border-slate-500 ml-2 mr-2 transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-2 active:ring-1"
                      onClick={()=>{
                        set_editor_full_screen(!editor_full_screen)
                      }}>
                          <span className=" flex items-center justify-center mx-auto space-x-2 select-none">
                              <Fullscreen/>
                          </span>
                        </button>
                        
                      </span>
                      <span className="relative hover:z-10">
                        <button type="button" title="Load Template" className="dark:ring-1 dark:ring-slate-500 dark:bg-gray-700  dark:border-slate-500 transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-2 active:ring-1"
                            onClick={()=>{
                                  set_editor_full_screen(false)
                                  setTemplateData(null)
                                  dispatch(_template_id_(null))
                                  WholeTemplateApi()
                              }}
                            >
                          <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                              <Template_Editor/>
                          </span>
                        </button>
                      </span>
                    </div>
                  </div>

                  {/* ========top button======= */}


                  {/* ==============share======================= */}
                  <div className="flex items-center justify-end px-3 py-0.5 space-x-2 flex-1">
                    {/* ===============share button===================== */}
                    <button
                      className="bg-[#23334b] w-[70px] h-8 text-white rounded-r-md font-helv"
                      onClick={()=>{
                        setSharePopUpModal(true)
                      }}
                      >
                        share
                        </button>
                      <div className="pr-2 text-sm text-gray-400">{NOW_LENGTH_OF_WORD}</div>
                      {/* ===============share button===================== */}
                      <div className="relative inline-block text-left">

                      {/* <button type="button" className="transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-2 active:ring-1" id="headlessui-menu-button-:r1:" aria-haspopup="menu" aria-expanded="false" data-headlessui-state="">
                        <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                          <span className="-mx-1.5">
                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                              <path d="M10.29,2.61c0-.65-.19-1.24-.61-1.67-.43-.43-1.02-.61-1.67-.61s-1.25,.18-1.67,.61c-.43,.43-.61,1.02-.61,1.67s.19,1.24,.61,1.67c.43,.43,1.02,.61,1.67,.61s1.25-.19,1.67-.61c.43-.43,.61-1.02,.61-1.67Zm0,5.39c0-.65-.19-1.24-.61-1.67-.43-.43-1.02-.61-1.67-.61s-1.25,.19-1.67,.61c-.43,.43-.61,1.02-.61,1.67s.19,1.24,.61,1.67c.43,.43,1.02,.61,1.67,.61s1.25-.19,1.67-.61c.43-.43,.61-1.02,.61-1.67Zm0,5.39c0-.65-.19-1.24-.61-1.67-.43-.43-1.02-.61-1.67-.61s-1.25,.19-1.67,.61c-.43,.43-.61,1.02-.61,1.67s.19,1.24,.61,1.67c.43,.43,1.02,.61,1.67,.61s1.25-.19,1.67-.61c.43-.43,.61-1.02,.61-1.67Z" fill="currentColor" fillRule="evenodd"></path>
                            </svg>
                          </span>
                        </span>
                      </button> */}

                    </div>
                  </div>

                  {SharePopUpModal
                  ?
                  <>
                    <div
                        className="justify-center  items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                      >
                        <div className="relative my-6">
                      <div
                        className="justify-center  items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                      >
                        <div className="relative  w-auto my-6 mx-auto max-w-3xl">
                          {/*content*/}
                          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            {/*header*/}
                            <div class="dark:bg-gray-700 dark:border-slate-500 w-full text-left flex justify-between items-center p-6 text-gray-900  border-b border-gray-200">
                              <h3 class="text-lg font-semibold dark:text-white">Share a Document</h3>
                              <button class="p-2 hover:bg-gray-100 rounded-full hover:cursor-pointer"
                              onClick={()=>{
                                setSharePopUpModal(false)
                              }}>
                                  <svg  class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M21.45,21.44L2.55,2.56" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"></path>
                                    <path d="M2.55,21.44L21.45,2.56" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"></path>
                                  </svg>
                              </button>
                            </div>
                            {/*body*/}
                            <div>

                        {/* ==================the message ============= */}
                          <div className="dark:bg-gray-700 dark:border-gray-700 m-auto p-8">
                              <div class="flex text-base mb-2 mt-2 justify-items-start items-center space-x-2">
                                <div>
                                </div>
                                {/* ============emails============== */}
                                <div className="flex flex-col">
                                    <div>
                                      {emails.map((enteredEmail, index) => (
                                        <span key={index} className="dark:text-black bg-gray-300 p-1 m-1 rounded w-[700px]">
                                          {enteredEmail}
                                          <button
                                            className="ml-3 font-bold text-[12px]"
                                            onClick={() => handleRemoveEmail(index)}
                                          >
                                            X
                                          </button>
                                        </span>
                                      ))}
                                    <input
                                      type="email"
                                      placeholder="Enter email"
                                      value={email}
                                      onChange={handleEmailChange}
                                      onKeyDown={handleEmailKeyDown}
                                      className="dark:text-black border border-gray-300 p-2 rounded mt-2 w-[600px]"
                                    />
                                  </div>
                                  <div className="mt-2">
                                    {emails &&
                                      <>
                                        {emails.length>0
                                        ?
                                        <>
                                        {send_loading
                                        ?
                                        <button className="bg-[#334977] text-white font-bold py-2 px-4 rounded-md w-[200px]"
                                            onClick={()=>{
                                            }}>
                                              Sending ...
                                            </button>
                                        :
                                          <button className="bg-[#334977] text-white font-bold py-2 px-4 rounded-md w-[200px]"
                                            onClick={()=>{
                                              send_invitation()
                                            }}>
                                              Send invite
                                            </button>

                                        }
                                          </>
                                        :
                                          <button className="bg-gray-400 text-white font-bold py-2 px-4 rounded-md w-[200px]"
                                            disabled
                                          >
                                            Send invite
                                          </button>
                                      }
                                      </>
                                      }
                                  </div>
                                </div>

                                {/* ============emails============== */}
                              </div>
                              
                              <div class="flex flex-col  p-[30px] mt-5 w-full space-y-1">
                                {/* ======================the list of users===================== */}
                                <div class="flex flex-col w-full">
                                <div class="w-full max-h-72 overflow-auto scrollbar-hide">
                                        
                                        {listOfUser &&
                                            <div class="flex items-center pb-4 relative">
                                              <div class="flex-shrink-0 w-10 h-10">
                                                  <div class="text-base w-10 h-10 rounded-full font-bold text-white flex items-center justify-center" >
                                                  <img
                                                      src="https://uffiafilestorage.s3.amazonaws.com/frontend-images/default.png"
                                                      className="w-[35px] h-[35px] rounded-full"
                                                    />
                                                  </div>
                                              </div>
                                              <div class="ml-4 truncate ">
                                                  <div class="dark:text-white font-medium leading-5 text-sm text-gray-900 truncate" title="copy ai">
                                                    {listOfUser[0]["first_name"]?listOfUser[0]["first_name"]:""
                                                    + " " 
                                                    +listOfUser[0]["last_name"]?listOfUser[0]["last_name"]:""}
                                                  </div>
                                                  <div class="leading-5 text-xs text-gray-500 truncate" >{listOfUser[0]["email"]}</div>
                                              </div>
                                              <div class="ml-auto text-gray-400 text-sm font-medium px-2 w-24">Creator</div>
                                            </div>
                                        }

                                    <div className="h-[80px]">
                                    {listOfUser &&
                                    <>
                                      {listOfUser.length>0
                                      ?
                                        <>
                                        {ChosenWorkspaceId["admin_or_not"]==true
                                          ?
                                          <>
                                              {/* can edit as admin */}
                                              {listOfUser[0]["editable_by_workspace_member"].map((data,index)=>{
                                              return (
                                                        <div class="flex items-center pb-4">
                                                          <div class="flex-shrink-0 w-10 h-10">
                                                              <div class="text-base w-10 h-10 rounded-full font-bold text-white flex items-center justify-center" >
                                                              <img
                                                                  src="/default.png"
                                                                  className="w-[35px] h-[35px] rounded-full"
                                                                />
                                                              </div>
                                                          </div>

                                                          <div class="ml-4 truncate ">
                                                              <div class="dark:text-white font-medium leading-5 text-sm text-gray-900 truncate" >
                                                              {data.first_name?data.first_name:""
                                                              + " " 
                                                              +data.last_name?data.last_name:""}
                                                              </div>
                                                              <div class=" leading-5 text-xs text-gray-500 truncate" >{data.email}</div>
                                                          </div>
                                                          <div class="ml-auto">
                                                                        <SelectField
                                                                            options={[
                                                                              { label: 'Edit', value: 'Edit' },
                                                                              { label: 'Remove Member', value: 'Remove Member' },
                                                                            ]}
                                                                            defaultValue={selectedRoles[index]}
                                                                            onSelect={(value) => handleSelectData(index, value)}
                                                                            role_of_user="Can Edit"
                                                                            data_index={data}
                                                                          />
                                                          </div>
                                                      </div> 
                                              )
                                            })}
                                          </>
                                          :
                                            <>
                                            {/* cannot edit as admin */}
                                            {listOfUser[0]["editable_by_workspace_member"].map((data,index)=>{
                                              return (
                                                        <div class="flex items-center pb-4 relative">
                                                          <div class="flex-shrink-0 w-10 h-10">
                                                              <div class="text-base w-10 h-10 rounded-full font-bold text-white flex items-center justify-center" >
                                                              <img
                                                                  src="/default.png"
                                                                  className="w-[35px] h-[35px] rounded-full"
                                                                />
                                                              </div>
                                                          </div>

                                                          <div class="ml-4 truncate ">
                                                              <div class="dark:text-white font-medium leading-5 text-sm text-gray-900 truncate" >
                                                              {data.first_name?data.first_name:""
                                                              + " " 
                                                              +data.last_name?data.last_name:""}
                                                              </div>
                                                              <div class="leading-5 text-xs text-gray-500 truncate" title="test@gmail.com">{data.email}</div>
                                                          </div>
                                                      </div> 
                                              )
                                            })}
                                            </>
                                        }
                                        </>
                                      :
                                        null
                                      }

                                    </>
                                    }
                                      
                                  </div> 
                                          
                                    </div>
                                    
                                  </div>

                                {/* ======================the list of users===================== */}
                              </div>


                              <div class="flex flex-col mb-2 mt-2 w-full  pb-4 space-y-1">

                              </div>
                                  <div class="pt-6 flex">
                                    <button class="flex items-center justify-center ring-1 ring-blue-800 text-blue-800 text-sm w-28 h-9 rounded-lg font-medium mr-1.5 transition  bg-[#334977]"
                                    onClick={copyToClipboard}
                                    >
                                      <span>Copy Link</span>
                                    </button>
                                    <div class="ml-auto flex items-center text-gray-700">
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true" class="w-3 h-3 mr-2">
                                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                                      </svg>
                                      <p class="dark:text-white pr-3.5 text-sm">Make public ( {ChosenWorkspaceId["workspace_name"]} )</p>
                                      {/* =============radio btn============== */}
                                      <button
                                        type="button"
                                        className={`relative inline-flex items-center flex-shrink-0 border-2 rounded-full cursor-pointer transition-colors ease-in-out duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                          isOn ? 'bg-indigo-500' : 'bg-gray-200'
                                        } h-6 w-11`}
                                        onClick={handleToggle}
                                      >
                                        <span
                                          aria-hidden="true"
                                          className={`pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-150 ${
                                            isOn ? 'translate-x-5' : 'translate-x-0'
                                          } h-5 w-5`}
                                        ></span>
                                      </button>
                                      {/* =============radio btn============== */}
                                    </div>
                                </div>
                          </div>
                        {/* ==================the message ============= */}


                            </div>
                            {/*footer*/}
                          </div>
                        </div>
                      </div>
                      <div className="opacity-25 fixed inset-0 z-40 bg-black">
                      </div>
                      </div>
                      </div>
                  </>
                  :
                    null
                  }

                  {/* ==============share======================= */}


                </div>
              </div>


              <div className=" flex flex-col-reverse md:flex-row bg:white overflow-hidden h-full">
                

                      {editor_full_screen
                      ?
                        null
                      :
                      <>
                        <>
                              <div className=" relative shadow-md z-10 bg-slate-50 max-h-[calc(100vh-4rem)] shrink-0 h-[50%] md:h-full w-full rounded-none border-r border-t md:border-t-0 border-slate-200 md:w-[400px] lg:w-[480px]">
                              <div className="dark:bg-gray-700 inset-0 overflow-auto flex flex-col divide-y divide-slate-200 h-full">

                                  {TemplateData ?(
                                    <>
                                    <div className=" dark:bg-gray-700  flex flex-row items-start justify-between pl-4 pr-3 py-3 sticky top-0 z-50 border-b border-slate-200 w-full bg-white">
                                      
                                      <div 
                                        className="flex items-baseline sticky top-0 bg-white z-10"
                                      >
                                      </div>
                                          
                                          <div className="flex flex-col w-full">
                                            <div className=" dark:bg-gray-700 flex-1 sticky top-0 bg-white z-10">


                                            <div className="flex items-center">
                                                <button
                                                  type="button"
                                                  className="dark:bg-gray-700 transition-all duration-200 relative font-semibold shadow-sm hover:outline-none focus:outline-none px-4 py-2 text-base text-center bg-transparent focus:ring-transparent dark:rounded-none rounded outline-none shadow-transparent pl-0"
                                                  onClick={() => {
                                                    setTemplateData(null);
                                                    dispatch(_template_id_(null));
                                                    WholeTemplateApi();
                                                    const baseUrl = window.location.href.split('?')[0];
                                                    const newUrl = `/template_data/${document_id}?template_editing=edit_by_user&content=chat_content&redirect=from_workflow_page`;
                                                    navigate(newUrl);
                                                  }}
                                                >
                                                  <DarkModeTemplate />
                                                </button>
                                                <h2 className="dark:text-white leading-7 text-gray-900 text-[15px] font-semibold line-clamp-1">
                                                  {TemplateData[0].title}
                                                </h2>
                                              </div>



                                              <p className="dark:text-white leading-tight text-gray-500 text-xs line-clamp-1">
                                                {TemplateData[0].description}
                                              </p>
                                          <div className="pt-2">
                                            <div className="flex items-center transform">
                                              <span className="active z-10 mr-3">
                                                <button type="button" 
                                                  onClick={()=>{
                                                    setHoverBtnColor(true)
                                                  }}
                                                  className={`${
                                                              HoverBtnColor
                                                                ? "bg-slate-400 dark:bg-gray-800 dark:text-gray-200"
                                                                : " "
                                                            } transition-all dark:bg-gray-800 dark:text-gray-200 duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-2 active:ring-1`}

                                                >
                                                  <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                                                    <small className="-my-0.5">
                                                      Inputs
                                                    </small>
                                                  </span>
                                                </button>
                                              </span>
                                              <span className="relative hover:z-10">
                                                <button type="button" 
                                                  onClick={()=>{
                                                    setHoverBtnColor(false)
                                                  }}
                                                  className={`${
                                                              HoverBtnColor
                                                                ? " "
                                                                : " bg-slate-400 dark:bg-gray-800 dark:text-gray-200"
                                                            } transition-all dark:bg-gray-800 dark:text-gray-200 duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-2 active:ring-1`}>
                                                  <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                                                    <small className="-my-0.5">
                                                      Outputs
                                                    </small>
                                                  </span>
                                                </button>
                                              </span>

                                            </div>
                                          </div>
                                            </div>

                                      
                                      
                                        {HoverBtnColor
                                        ?
                                          <>
                                            {/* =============Template inner value==================== */}
                                            <div className="grow mt-2 xl:p-1 xl:pb-28 flex-1 xl:overflow-y-auto">
                                            
                                            <div id={document_id} className=" mb-7">
                                            {TemplateData &&
                                              TemplateData[0]['template_fields'].map((data, index) => {
                                                const textLength = fieldValues[index]?.value?.length || 0;
                                              return (
                                                (data.component === "textarea" && (
                                        <div className="last:mb-1 relative" key={index}>
                                          <div className="space-y-1.5 w-full">
                                            <label
                                              htmlFor="form-field-productInfo"
                                              className="text-sm font-medium block text-gray-900 placeholder:text-gray-400 transition-[color] duration-150 ease-in-out"
                                            >
                                              <span className="dark:text-white flex items-center space-x-1">
                                                {data.label}
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
                                            <span className="dark:text-white flex items-center space-x-1">
                                              {data.label}
                                            </span>
                                          </label>
                                          <div className="dark:bg-gray-800 dark:text-gray-200 py-1 flex items-center gap-2 bg-white w-full px-3 rounded-lg ring-1 hover:ring-2 transition-all duration-150 ease-in-out ring-gray-200 outline-none focus-within:!ring-1">
                                            <div className="dark:bg-gray-800 dark:text-gray-200 flex items-center grow gap-2 py-1.5">
                                              <div className="dark:bg-gray-800 dark:text-gray-200 flex gap-1 grow">
                                                <input
                                                  id="form-field-productName"
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
                                          <div className="mt-2">
                                            <label
                                              htmlFor="form-field-productInfo"
                                              className="text-sm font-medium block text-gray-900 placeholder:text-gray-400 transition-[color] duration-150 ease-in-out"
                                            >
                                              <span className="dark:text-white flex items-center space-x-1">
                                                Example
                                              </span>
                                            </label>
                                          </div>
                                          <div className=" mt-2 flex justify-between flex-col space-y-2 key={index_inner}">
                                            {inputs.map((input, index_inner) => (
                                              <div
                                                className="flex justify-between flex-col space-y-2"
                                                key={index_inner}
                                              >
                                                <div className=" flex items-center justify-between space-x-2">
                                                  <div className="bg-gray-300/20 text-gray-500 font-bold text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                    {index_inner + 1}
                                                  </div>
                                                  <div className="space-y-1.5 w-full">
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
                                                            value={input}
                                                            onChange={(event) =>
                                                              handleMultipleInputChange(
                                                                event,
                                                                index_inner
                                                              )
                                                            }
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
                                                onClick={handleAdd}
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
                                              <span className="flex items-center space-x-1 dark:text-white">
                                                {data.label}
                                              </span>
                                            </label>
                                          </div>
                                          <div className="dark:text-black flex justify-between flex-col space-y-2 key={index_inner} mt-3">
                                            
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
                                                      backgroundColor:"black"    }),
                                                    singleValue: (provided) =>  ({
                                                      ...provided,
                                                      color:"white"    }),
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

                                            </div>

                                            {/* =======Generate Button=========== */}
                                            <div className="dark:bg-gray-700 pointer-events-none xl:bottom-0 xl:sticky xl:w-full xl:left-0 xl:z-20 @container">
                                              <div className="dark:bg-gray-700  dark:border-slate-500 flex flex-row items-center justify-between p-3 border-b border-gray-200 pointer-events-auto bg-gray-50 xl:bg-white xl:border-t xl:border-0 xl:border-gray-200 xl:py-3 xl:px-6">
                                                {/* <button type="button" className="transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-2 active:ring-1"> */}
                                                <button type="button" className="transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm  hover:ring-2 active:ring-1">
                                                  <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                                                    {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="w-4 h-4 opacity-50 -mx-1 @md:mx-0">
                                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                                  </svg> */}
                                                    <span className="hidden @sm:inline-block text-black">Clear inputs</span>
                                                  </span>
                                                </button>
                                                <div className="flex ">
                                                  <input type="number"
                                                    className='mr-2 w-[70px] border border-gray-300 rounded-md py-2 px-4 pr-2 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                    defaultValue={ContentOutputNumber}
                                                    onChange={(e) => {
                                                      setContentOutputNumber(e.target.value)
                                                    }}
                                                    max="10" min="1"
                                                  />
                                                  <button type="submit" className="w-[200px] transition-all duration-200 relative font-semibold outline-none hover:outline-none focus:outline-none rounded-lg px-4 py-2 text-base text-white bg-gradient-to-r bg-[#334977]"
                                                      onClick={()=>{
                                                          handleClick(document_id)
                                                          setTemplateResponseData(null)
                                                      }}
                                                      disabled={LoadingButton}
                                                      >
                                                      <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                                                        Generate
                                                      </span>
                                                  </button>

                                                </div>
                                              </div>
                                            </div>

                                            {/* ================== */}
                                              
                                          </>
                                        :
                                            <div className="dark:bg-gray-600 mt-4 h-screen bg-[#eff2f9] font-semibold text-[17px]  text-black max-h-[500px] overflow-y-auto">
                                              <div className="dark:bg-gray-600 sticky top-0 flex items-center px-3 bg-white border-b border-gray-200">
                                              <nav className="flex flex-grow py-1 space-x-3" aria-label="Tabs">
                                                  <button 
                                                    className={`${
                                                      ShowHideHistory
                                                            ? "  "
                                                            : " bg-gray-100 "
                                                        } relative dark:bg-gray-800 dark:text-gray-200 whitespace-nowrap py-2 px-3 text-xs font-medium  rounded-lg text-black transition-all duration-150 hover:text-black`}

                                                  onClick={()=>{
                                                    if(LeftListTemplateData==null){
                                                      get_history(templateValue)
                                                    }
                                                      setShowHideHistory(false)
                                                  }}
                                                  >
                                                  <span className="relative">
                                                    New outputs {ContentOutputNumber}
                                                  </span>

                                                  </button>
                                                  <button 
                                                    className={`${
                                                      ShowHideHistory
                                                            ? " bg-gray-100 "
                                                            : " "
                                                        } relative whitespace-nowrap dark:bg-gray-800 dark:text-gray-200 py-2 px-3 text-xs font-medium rounded-lg text-black transition-all duration-150 hover:text-black`}

                                                  onClick={()=>{
                                                      setShowHideHistory(true)
                                                  }}>
                                                  <span className="relative">History</span>
                                                  </button>
                                              </nav>
                                              <div>
                                                  <button className="relative whitespace-nowrap px-3 py-2 text-xs font-medium leading-4 text-black transition-all duration-150 hover:text-gray-600"
                                                  onClick={()=>{
                                                      setTemplateResponseData(null)
                                                      if(LeftListTemplateData==null){
                                                      get_history(templateValue)
                                                      }
                                                  }}>
                                                  <span className=" dark:text-gray-200 relative">Clear</span>
                                                  </button>
                                              </div>
                                              </div>


                                          {ShowHideHistory
                                          ?
                                              (history_answer
                                              ?
                                                  (history_answer.map((data,index)=>{
                                                      return (
                                                          <div key={index}>
                                                              <ResponseTemplate r_show={"false"} r_id={data["id"]} r_time={data["created_at"]} r_data={data["answer_response"]}/>
                                                          </div>
                                                      )
                                                  }))
                                              :
                                                  null
                                              )
                                          :

                                          (TemplateResponseData
                                              ?
                                              TemplateResponseData.map((data,index)=>{
                                                  return (
                                                      <div key={index}>
                                                          <ResponseTemplate  r_show={"false"} r_time={data["created_at"]} r_data={data["content"]}/>
                                                      </div>
                                                  )
                                              })
                                              :
                                              (LoadingButton
                                                  ?
                                                      <>
                                                          <div className="mt-3 flex flex-col items-center justify-center">
                                                          <div>
                                                              <p>
                                                              Generating content ...
                                                              </p>
                                                          </div>
                                                          <div className='mt-3'>
                                                              <BouncingDotsLoader />
                                                          </div>
                                                          </div>
                                                      </>
                                                  :
                                                      null
                                                  )
                                          )
                                          }
                                          </div>
                                          
                                        }
                                        

                                      </div>

                                    </div>
                                    </>
                                  )
                                  :                    
                                    (
                                    WholeTemplate&& (
                                        <WholeTemplateRender template_data={WholeTemplate}/>
                                    )
                                    )
                                  }
                                  {/* ===========Template name from apis=============== */}

                                  {page=="workflow" &&
                                    <WorkflowSteps/>
                                  } 
                              </div>
                              </div>
                        </>

                      {/* } */}

                      </>
                      }

                      

                      {/* ===================================================== */}

                      {/* ===================Left side whole template Render================================== */}
                      {/* ===================================================== */}
                      

              

                      

                      {editor_full_screen
                      ?
                        <>
                          {delta
                          ?
                          <>
                          <div className=" relative overflow-auto grow shrink">
                            <div id="editor-012fce57-54d2-4046-8789-1402c27159c4" className=" min-h-full flex flex-col relative bg-white [&amp;>div]:border-none">
                              <div className="dark:bg-gray-700 relative bg-white border border-gray-300 flex flex-col grow">
                            {editorData &&
                              <div className="App p-10">
                                <Editor data={editorData} setData={seteditorData} />
                              </div>
                            }
                            </div>
                            </div>
                            </div>
                            </>
                          :   
                            <LoaderDiv />
                          }
                        </>
                      :
                        <>
                          {delta
                          ?
                            <>
                            <div className=" relative overflow-auto grow shrink">
                            <div id="editor-012fce57-54d2-4046-8789-1402c27159c4" className=" min-h-full flex flex-col relative bg-white [&amp;>div]:border-none">
                              <div className="dark:bg-gray-700 relative bg-white border border-gray-300 flex flex-col grow">
                            {editorData &&
                              <div className="App p-10 dark:bg-gray-700">
                                <Editor data={editorData} setData={seteditorData} />
                              </div>
                            }
                            </div>
                            </div>
                            </div>
                            </>
                          :   
                            <LoaderDiv />
                          }
                        </>
                      }
                      


              </div>
            </div>
            
          </div>
          {/* ============================== */}
        </div>

        <Toaster />

      </div>
  );
}


export default EditDocuments
