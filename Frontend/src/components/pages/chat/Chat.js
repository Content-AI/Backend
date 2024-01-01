import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import AnimateHeight from "react-animate-height";

import CaretDown from "../../Icons/CaretDown";
import {
  postData,
  fetchData,
  patchData,
  deleteData,
} from "../../../apis/apiService";
import { setDocumentTitle } from '../../NavBar/DynamicTitle';
import {
  BACKEND_URL,
  BACK_END_API_CHAT_DATA,
  BACK_END_API_CHAT_ROOM,
  BACK_END_API_BRAND_VOICE,
  BACK_END_API_CHAT_ASK_QUESTION,
  BACK_END_API_FIRST_CHAT_TEMPLATE,
  BACK_END_API_VALUE_OF_CHAT_TEMPLATE,
  BACK_END_CUSTOM_CHAT_TEMPLATE,
} from "../../../apis/urls";

import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import RenderHtml from "../Template/RenderHtml";
import RenderTemplate from "../Template/RenderTemplate";
import RenderHtmlData from "../Template/RenderHtmlData";

import { GrClose } from "react-icons/gr";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Popover from "@mui/material/Popover";
import Differentbtn from "./Differentbtn";
import { useSelector, useDispatch } from "react-redux";
import Typed from "react-typed";
import LoadingPage from "../../LoadingPage";
import { _save_ask_question_again_ } from "../../../features/RepeatQuestionInChat";
import { _save_details_ } from "../../../features/Subscriptions";


import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'

import 'katex/dist/katex.min.css' // `rehype-katex` does not import the CSS for you
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import TypingAnimation from './TypingAnimation'

import ChatLoading from '../../Icons/ChatLoading'
import ChatIconForChat from '../../Icons/ChatIconForChat'
import ChatStopIcon from '../../Icons/ChatStopIcon'

import { BsFillMicFill } from 'react-icons/bs';
import { BsFillMicMuteFill } from 'react-icons/bs';

import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";
import TooltipInfo from "../../../components/Icons/TooltipInfo";
import IconChat from "../../Icons/IconChat";
import ChatIconNine from "../../Icons/ChatIconNine";
import ChatIconFifth from "../../Icons/ChatIconFifth";
import ChatIconSix from "../../Icons/ChatIconSix";
import ChatIconEle from "../../Icons/ChatIconEle";
import ChatIconTw from "../../Icons/ChatIconTw";
import ChatIconM from "../../Icons/ChatIconM";
import ChatIconN from "../../Icons/ChatIconN";
import ChatIconP from "../../Icons/ChatIconP";
import ChatIconR from "../../Icons/ChatIconR";
import ChaticonII from "../../Icons/ChatIconII";
import ChatArrow from "../../Icons/ChatArrow";
import ChatIconRR from "../../Icons/ChatIconRR";
import ChatIconEditFirst from "../../Icons/ChatIconEditFirst";

import ChatIconDialogF from "../../Icons/ChatIconDialogF";
import FirstUserQuestion from "./ChatDiv/FirstUserQuestion";
import FirstBotAnswer from "./ChatDiv/FirstBotAnswer";
import AnswerFroApi from "./ChatDiv/AnswerFroApi";



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

const tagList = [
  "Create an image of...",
  "Create a list of 10 blog post titles about...",
  "Write a paragraph about...",
  "Help me create a short story about...",
  "Summarize the following text...",
  "Write a Facebook ad for the holidays...",
  "Write a blog post about...",
  "Write a country song about cats in the style o...",
];

const Chat = ({ AUTH_TOKEN }) => {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setDocumentTitle("Chat With AI");
}, []);

  const chatContainerRef = useRef(null);
  const chatLoadingRef = useRef(null);

  const divRef = useRef(null);

  let upgrade_plan={restrict_user: true, customer_stripe_id: 'null', email: 'null', subscription_type: 'null', status: 'trial'}

  const notifyerror = (message) => toast.error(message);
  const notifysucces = (message) => toast.success(message);

  const notifymessage = (message) =>
    toast(message, {
      icon: "🙂",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });

  const [chatFill, setChatFill] = useState("");
  const [ChatText, setChatText] = useState("");
  const [AllChatText, setAllChatText] = useState([]);
  const [TitleOfChat, setTitleOfChat] = useState('');
  const [IdOfTopTitleChat, setIdOfTopTitleChat] = useState(null);
  const [AnswerOfChat, setAnswerOfChat] = useState("");


  const [showing_chat,set_showing_chat] = useState(null)

  const [CurrentQuestionIni, setCurrentQuestionIni] = useState(null);
  const [CurrentAnswerIni, setCurrentAnswerIni] = useState([]);
  const [AfterTypeDontShowIni, setAfterTypeDontShowIni] = useState(false);

  const [CurrentQuestion, setCurrentQuestion] = useState(null);
  const [CurrentAnswer, setCurrentAnswer] = useState([]);

  const [showStopBtn, setShowStopBtn] = useState(false);

  const [
    LatestOrCurrentClickGetChatFromID,
    setLatestOrCurrentClickGetChatFromID,
  ] = useState(null);

  const [ChatTitleForSideBar, setChatTitleForSideBar] = useState(null);

  const [Loading, setLoading] = useState(false);
  const [check_to_stop_typing, setcheck_to_stop_typing] = useState(false);

  const [sidebarStatus, setSidebarStatus] = useState(false);

  const [open, setOpen] = useState(false);

  const [popStat, setPopStat] = useState(false);
  const [typedComp, setTypedComp] = useState();
  
  var typedCompRef = useRef();

  const popRef = React.useRef();

  let REPEAT_QUESTION = useSelector(
    (state) => state.SetRepeatQuestionInChat.RepeatQuestionInChat
  );

  let ChosenWorkspaceId = useSelector(
    (state) => state.SetChosenWorkspaceId.ChosenWorkspaceId
    );	


  let subscriptions_check = useSelector(
    (state) => state.SetSubscriptions.Subscriptions
  );

  const get_initial_chat = async (url, room_id) => {
    const resp = await fetchData(url + "/" + room_id + "/", AUTH_TOKEN);
    if (resp.status == 200 || resp.status == 201) {
      setAllChatText(resp.data.chat_data);
      setTitleOfChat(resp.data.title);
      setIdOfTopTitleChat(resp.data.id);
    } else {}
  };
  const get_chat_data_from_side_div_when_click = async (url, room_id) => {
    setCurrentAnswer([]);
    setCurrentAnswerIni([]);
    const resp = await fetchData(url + "/" + room_id + "/", AUTH_TOKEN);
    if (resp.status == 200 || resp.status == 201) {
      setAllChatText(resp.data.chat_data);
      setTitleOfChat(resp.data.title);
      setIdOfTopTitleChat(resp.data.id);
    } else {
    }
  };

  const create_new_room_for_chat = async () => {
    setCurrentAnswer([]);
    setCurrentAnswerIni([]);
    const formData = {};
    const resp = await postData(
      formData,
      BACKEND_URL + BACK_END_API_CHAT_ROOM,
      AUTH_TOKEN
    );
    if (resp.status == 201) {
      get_title_of_chat_room_first(BACKEND_URL + BACK_END_API_CHAT_ROOM);
    }
  };

  useEffect(() => {
    if (LatestOrCurrentClickGetChatFromID != null) {
      get_initial_chat(
        BACKEND_URL + BACK_END_API_CHAT_DATA,
        LatestOrCurrentClickGetChatFromID
      );
    }
  }, [LatestOrCurrentClickGetChatFromID]);

  const first_interaction_with_chat_create_new_room_by_default = async () => {
    const formData = {};
    const resp = await postData(
      formData,
      BACKEND_URL + BACK_END_API_CHAT_ROOM,
      AUTH_TOKEN
    );
    if (resp.status == 201) {
      get_title_of_chat_room_first(BACKEND_URL + BACK_END_API_CHAT_ROOM);
    }
  };

  const get_title_of_chat_room_first = async (url) => {
    const resp = await fetchData(url, AUTH_TOKEN);
    if (resp.status == 200) {
      setChatTitleForSideBar(resp.data);
      if (resp.data.length <= 0) {
        first_interaction_with_chat_create_new_room_by_default();
      }
      if (resp.data.length > 0) {
        setLatestOrCurrentClickGetChatFromID(resp.data[0]["id"]);
      }
    } else {
      navigate("/");
    }
  };
  const _title_change_but_not_the_chatting_ui_ = async (url) => {
    const resp = await fetchData(url, AUTH_TOKEN);
    if (resp.status == 200) {
      setChatTitleForSideBar(resp.data);
    } else {
      navigate("/");
    }
  };
  const get_title_of_chat_room = async (url) => {
    const resp = await fetchData(url, AUTH_TOKEN);
    if (resp.status == 200) {
      setChatTitleForSideBar(resp.data);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    get_title_of_chat_room_first(BACKEND_URL + BACK_END_API_CHAT_ROOM);
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePopoverOpen = (event) => {
    setPopStat(popRef.current);
  };

  const handlePopoverClose = (event) => {
    setPopStat(null);
  };

  const openPop = Boolean(popStat);
  const id = openPop ? "simple-popover" : undefined;

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [AllChatText]);

  const submitChatText = async () => {
    SpeechRecognition.stopListening();
    if (ChatText === "") {
      notifyerror("you need to say somethings");
      return false;
    }
    setLoading(true);
    setShowStopBtn(true);

    // =================Initial chat without data==============================
    if (AllChatText.length <= 0) {
      // if there is tone selected for chat
      let InTone = ``;
      if (selectedSummarizes) {
        selectedSummarizes.forEach((item) => {
          InTone += `[Generate In Tone:${item.value}]`;
        });
      } else {
        InTone = "Default";
      }
      if (ChatText) {
        setChatText("");
        setAfterTypeDontShowIni(true);
        setCurrentQuestionIni(ChatText);
        if (divRef.current) {
          divRef.current.focus();
        }
        const formdata = {
          question: ChatText,
          Tone: InTone,
          chat_root: IdOfTopTitleChat,
        };
        const resp = await postData(
          formdata,
          BACKEND_URL + BACK_END_API_CHAT_ASK_QUESTION + "/",
          AUTH_TOKEN
        );
        if (resp.status == 201) {
          setCurrentQuestionIni(null);
          const data = {
            content: resp.data[0]["content"],
            question: resp.data[0]["question"],
          };
          setCurrentAnswerIni((CurrentAnswerIni) => [
            ...CurrentAnswerIni,
            data,
          ]);
          setChatText("");
          if(resp.data[0]["content"]=="upgrade a plan"){
            
            dispatch(_save_details_(upgrade_plan))
          }
          setcheck_to_stop_typing(true)
        } else {
          // notifyerror("something went wrong");
        }
        // setLoading(false);
        return true;
      }
    }

    // =================Initial chat without data==============================

    // =================Initial chat with data or after there is some data==============================
    if (ChatText) {
      setChatText("");

      // if there is tone selected for chat
      let InTone = ``;
      if (selectedSummarizes) {
        selectedSummarizes.forEach((item) => {
          InTone += `[Generate In Tone:${item.value}]`;
        });
      } else {
        InTone = "Default";
      }
      setCurrentQuestion(ChatText);
      if (divRef.current) {
        divRef.current.focus();
      }
      const formdata = {
        question: ChatText,
        Tone: InTone,
        chat_root: IdOfTopTitleChat,
      };
      const resp = await postData(
        formdata,
        BACKEND_URL + BACK_END_API_CHAT_ASK_QUESTION + "/",
        AUTH_TOKEN
      );
      if (resp.status == 201) {
        setCurrentQuestion(null);
        const data = {
          content: resp.data[0]["content"],
          question: resp.data[0]["question"],
        };
        setCurrentAnswer((CurrentAnswer) => [...CurrentAnswer, data]);
        setChatText("");
        if(resp.data[0]["content"]=="upgrade a plan"){
          // dispatch(_save_details_(upgrade_plan))
          navigate("/settings/subscription_plan?message=upgrade")
        }
        setcheck_to_stop_typing(true)
      } else {
        // notifyerror("something went wrong");
      }
    }
    // =================Initial chat with data or after there is some data==============================
    // setLoading(false);
  };



  useEffect(() => {
    if (chatLoadingRef.current) {
      chatLoadingRef.current.focus();
    }
  }, [CurrentQuestionIni]);

  useEffect(() => {
    if (chatLoadingRef.current) {
      chatLoadingRef.current.focus();
    }
  }, [CurrentQuestion]);

  const [editingIndex, setEditingIndex] = useState(null);
  const [initialTitle, setInitialTitle] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setInitialTitle(ChatTitleForSideBar[index].title);
  };

  const handleInputChange = (index, event) => {
    const updatedTitle = event.target.value;
    setChatTitleForSideBar((prevTitles) => {
      const updatedTitles = [...prevTitles];
      updatedTitles[index].title = updatedTitle;
      return updatedTitles;
    });
  };


  const handleInputBlur = async (index) => {
    if (ChatTitleForSideBar[index].title !== initialTitle) {
      const fromData = {
        title: ChatTitleForSideBar[index].title,
      };
      const resp = await patchData(
        fromData,
        BACKEND_URL +
          BACK_END_API_CHAT_ROOM +
          ChatTitleForSideBar[index].id +
          "/",
        AUTH_TOKEN
      );
      if(resp.status==201){
        get_chat_data_from_side_div_when_click(BACKEND_URL + BACK_END_API_CHAT_DATA,ChatTitleForSideBar[index].id);
      }
    }
    setEditingIndex(null);
    setInitialTitle("");
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    get_title_of_chat_room(
      BACKEND_URL + BACK_END_API_CHAT_ROOM + "?search=" + value
    );
  };

  const handleDelete = (id) => {
    setChatTitleForSideBar((prevtitledata) =>
      prevtitledata.filter((titledata) => titledata.id !== id)
    );
  };

  const _update_document_data = async (data, id, message) => {
    handleDelete(id);
    const resp = await deleteData(
      BACKEND_URL + BACK_END_API_CHAT_ROOM + id + "/",
      AUTH_TOKEN
    );
  };

  const call_api_change_title = async (newTitle) => {
    const fromData = {
      title: newTitle,
    };
    const resp = await patchData(
      fromData,
      BACKEND_URL + BACK_END_API_CHAT_ROOM + IdOfTopTitleChat + "/",
      AUTH_TOKEN
    );
    if (resp.status == 201) {
      _title_change_but_not_the_chatting_ui_(
        BACKEND_URL + BACK_END_API_CHAT_ROOM
      );
    }
  };

  const TitleChage = (event) => {
    setTitleOfChat(event.target.value);
  };

  const TitleInputKeyPressed = (event) => {
    if (event.key === "Enter") {
      call_api_change_title(TitleOfChat);
    }
  };

  const mousemovedawayfrominput = () => {
    call_api_change_title(TitleOfChat);
  };

  const renderHTMLDataForChatting = (htmldata) => {
    const formattedContent = htmldata
      .split("\n")
      .map((line, index) => (index === 0 ? line : `<br>${line}`))
      .join("");

    return formattedContent;
  };

  const [Chat_Template_Title, setChat_Template_Title] = useState(null);
  const [second_layer_title, setsecond_layer_title] = useState(null);
  const [value_of_template_to_use, setvalue_of_template_to_use] =
    useState(null);

  const [show_only_custom, set_show_only_custom] = useState(true);
  const [custome_chat_template, setcustome_chat_template] = useState(null);
  // const [customDescription, setCustomDescription] = useState('');

  const [innervalueofcustomechattemplate, setinnervalueofcustomechattemplate] =
    useState("");
  const [
    previousinnervalueofcustomechattemplate,
    setpreviousinnervalueofcustomechattemplate,
  ] = useState("");
  const [
    show_button_to_edit_text_area_description,
    setshow_button_to_edit_text_area_description,
  ] = useState(false);
  const [descriptionid, setdescriptionid] = useState(null);

  const [show_create_input, setshow_create_input] = useState(false);

  //udpate description from textarea using id
  const update_the_description = async () => {
    let formData = {
      description: innervalueofcustomechattemplate,
    };
    const resp = await patchData(
      formData,
      BACKEND_URL + BACK_END_CUSTOM_CHAT_TEMPLATE + descriptionid + "/",
      AUTH_TOKEN
    );
    if (resp.status == 201) {
      notifysucces("Description updated");
    } else {
      notifyerror("something went wrong");
    }
    setshow_button_to_edit_text_area_description(false);
  };

  const handleChangeDescriptions = (e) => {
    if (innervalueofcustomechattemplate == "") {
      return true;
    }
    setshow_button_to_edit_text_area_description(true);
    setinnervalueofcustomechattemplate(e.target.value);
  };

  const get_first_chat_template_title = async () => {
    const resp = await fetchData(
      BACKEND_URL + BACK_END_API_FIRST_CHAT_TEMPLATE,
      AUTH_TOKEN
    );
    if ((resp.status = 200)) {
      setChat_Template_Title(resp.data);
    }
  };

  const get_first_custom_chat_template_title = async () => {
    const resp = await fetchData(
      BACKEND_URL + BACK_END_CUSTOM_CHAT_TEMPLATE,
      AUTH_TOKEN
    );
    if ((resp.status = 200)) {
      setcustome_chat_template(resp.data);
    }
  };

  const second_layer_template = async (id) => {
    const resp = await fetchData(
      BACKEND_URL + BACK_END_API_FIRST_CHAT_TEMPLATE + id + "/",
      AUTH_TOKEN
    );
    if ((resp.status = 200)) {
      setsecond_layer_title(resp.data.second_title);
    }
  };
  const get_value_of_template = async (id) => {
    try {
      const resp = await fetchData(
        BACKEND_URL + BACK_END_API_VALUE_OF_CHAT_TEMPLATE + id + "/",
        AUTH_TOKEN
      );

      if (resp.status === 200) {
        const innerValueData = resp.data.inner_value_data;

        if (
          innerValueData &&
          Array.isArray(innerValueData) &&
          innerValueData.length > 0
        ) {
          const valueOfPrompt = innerValueData[0].value_of_prompt;
          if (valueOfPrompt) {
            setvalue_of_template_to_use(valueOfPrompt);
          } else {
            notifymessage("comming soon");
          }
        } else {
          notifymessage("comming soon");
        }
      } else {
        notifymessage("comming soon");
      }
    } catch (error) {
      notifymessage("comming soon");
    }
  };

  const use_choosen_text_to_question = () => {
    setChatText(value_of_template_to_use);
    setOpen(false);
  };
  const use_custome_text = () => {
    setChatText(innervalueofcustomechattemplate);
    setOpen(false);
  };

  useEffect(() => {
    get_first_chat_template_title();
    get_first_custom_chat_template_title();
  }, []);

  // =======create chat template code=============
  const showinputtocreate = () => {
    setshow_create_input(true);
  };

  const [newTitleName, setNewTitleName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleNewTitleNameChange = (e) => {
    setNewTitleName(e.target.value);
  };

  const handleNewDescriptionChange = (e) => {
    setNewDescription(e.target.value);
  };

  const create_new_template = async () => {
    if (!newTitleName || !newDescription) {
      notifyerror("Title with description is needed");
      return false;
    }
    let formData = {
      title: newTitleName,
      description: newDescription,
    };
    const resp = await postData(
      formData,
      BACKEND_URL + BACK_END_CUSTOM_CHAT_TEMPLATE,
      AUTH_TOKEN
    );
    if (resp.status == 201) {
      notifysucces("Template created");
      get_first_custom_chat_template_title();
      setshow_create_input(false);
      setNewTitleName("");
      setNewDescription("");
    } else {
      notifyerror("try again");
    }
  };

  const get_the_inner_value_of_custom_template = async (id) => {
    const resp = await fetchData(
      BACKEND_URL + BACK_END_CUSTOM_CHAT_TEMPLATE + id + "/",
      AUTH_TOKEN
    );
    if (resp.status == 200) {
      setinnervalueofcustomechattemplate(resp.data.description);
      setpreviousinnervalueofcustomechattemplate(resp.data.description);
      setdescriptionid(resp.data.id);
    }
  };

  // ====================Edit Custom Template==================
  const [
    EditCustomTemplateEditingTitleIndex,
    setEditCustomTemplateEditingTitleIndex,
  ] = useState(null);
  const [EditCustomTemplateEditedTitle, setEditCustomTemplateEditedTitle] =
    useState("");

  const EditCustomTemplateHandleEditClick = (index) => {
    setEditCustomTemplateEditingTitleIndex(index);
    setEditCustomTemplateEditedTitle(custome_chat_template[index].title);
  };

  const EditCustomTemplateHandleTitleChange = (e) => {
    setEditCustomTemplateEditedTitle(e.target.value);
  };

  const EditCustomTemplateHandleSaveClick = async (index, id) => {
    let formData = {
      title: EditCustomTemplateEditedTitle,
    };
    const resp = await patchData(
      formData,
      BACKEND_URL + BACK_END_CUSTOM_CHAT_TEMPLATE + id + "/",
      AUTH_TOKEN
    );
    if (resp.status == 201) {
      get_first_custom_chat_template_title();
      setEditCustomTemplateEditingTitleIndex(null);
      notifysucces("Title updated");
    } else {
      notifyerror("something went wrong");
    }
  };

  const handleDeleteCustomTemplate = (id) => {
    setcustome_chat_template((prevdata) =>
      prevdata.filter((cusdata) => cusdata.id !== id)
    );
  };

  const delete_the_custom_template = async (id) => {
    handleDeleteCustomTemplate(id);
    const resp = await deleteData(
      BACKEND_URL + BACK_END_CUSTOM_CHAT_TEMPLATE + id + "/",
      AUTH_TOKEN
    );
    notifyerror("Template deleted");
  };

  // ============brand Voice===========
  const [brandVoice, setbrandVoice] = useState(null);

  const get_brand_voice_for_chat = async () => {
    const resp = await fetchData(
      BACKEND_URL + BACK_END_API_BRAND_VOICE,
      AUTH_TOKEN
    );
    if (resp.status == 200) {
      setbrandVoice(resp.data.results);
    }
  };

  useEffect(() => {
    get_brand_voice_for_chat();
  }, []);

  const [selectedSummarizes, setSelectedSummarizes] = useState([]);
  const [show_summarize_tone, set_show_summarize_tone] = useState(false);

  const handleBrandVoiceChange = (event) => {
    const selectedBrandVoice = event.target.value;
    const brandVoiceItem = brandVoice.find(
      (item) => item.brand_voice === selectedBrandVoice
    );

    if (event.target.checked) {
      setSelectedSummarizes((prevSelectedSummarizes) => [
        ...prevSelectedSummarizes,
        {
          value: brandVoiceItem.content_summarize,
          label: selectedBrandVoice,
        },
      ]);
    } else {
      setSelectedSummarizes((prevSelectedSummarizes) =>
        prevSelectedSummarizes.filter(
          (summary) => summary.label !== selectedBrandVoice
        )
      );
    }
  };

  const handleDeleteClick = (label) => {
    setSelectedSummarizes((prevSelectedSummarizes) =>
      prevSelectedSummarizes.filter((summary) => summary.label !== label)
    );
  };

  // search for chat template
  const [search_chat_template, setSearchChatTemplate] = useState("");

  const search_first_chat_template_title = async (search_data) => {
    const resp = await fetchData(
      BACKEND_URL + BACK_END_API_FIRST_CHAT_TEMPLATE + "?search=" + search_data,
      AUTH_TOKEN
    );
    if ((resp.status = 200)) {
      setChat_Template_Title(resp.data);
    }
  };

  const handleChange = (event) => {
    setSearchChatTemplate(event.target.value);
    search_first_chat_template_title(event.target.value);
  };

  // ===============Repeat ask question again==================

  useEffect(() => {
    if (REPEAT_QUESTION != null) {
      startStreaming(true,REPEAT_QUESTION);
    }
  }, [REPEAT_QUESTION]);


  
  // =================adjust the size of textarea================
  const adjustTextareaHeight = (textarea) => {
    textarea.style.height = "auto";
    const minHeight = 60; // Minimum height for the textarea
    const maxHeight = 300; // Maximum height for the textarea
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    textarea.style.overflowY =
      textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  };

  useEffect(() => {
    try{
      const textarea = document.querySelector("textarea");
      adjustTextareaHeight(textarea);
    }catch(e){}
  }, [ChatText]);



  // =======typing done=========
  const [isTypingFinished, setIsTypingFinished] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);

  const handleTypingDone = () => {
    setIsTypingFinished(true);
    setLoading(false)
    setcheck_to_stop_typing(false)
    setShowStopBtn(false)
  };

  const handleTypeStop = () => {

    // check the response of api is come yet or not if not then prevent stoping typing it


    setShowStopBtn(false)
    console.log('typedComp', typedComp)
    try{
      setTypedComp(typedComp.cursor.hidden = true)
      setTypedComp(typedComp.stop())
      setLoading(false)

      setIsTypingFinished(true);
      setcheck_to_stop_typing(false)

    }catch(e){}
  }
  
  const handleStopTyping = () => {
    setIsTypingFinished(false);
  };


  // ======it the screen is large then show the side bar of chat with title===========
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1500px)'); // Adjust the screen size as needed

    const handleMediaChange = (e) => {
      if (e.matches) {
        // Screen is large, set the sidebar status
        setSidebarStatus(true);
      } else {
        // Screen is small, don't set the sidebar status
        // You can also set it to false if needed
        setSidebarStatus(false);
      }
    };

    // Add the event listener
    mediaQuery.addEventListener('change', handleMediaChange);

    // Initial check for screen size
    handleMediaChange(mediaQuery);

    // Clean up the event listener when the component unmounts
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);


  // The mic start and stop listening 

  // const [listening, setListening] = useState(false);
  // const { transcript, resetTranscript } = useSpeechRecognition();

  // const startListening = () => {
  //   SpeechRecognition.startListening();
  //   setListening(true);
  //   setChatText(transcript)
  // };

  // const stopListening = () => {
  //   SpeechRecognition.stopListening();
  //   setListening(false);
  // };

  // useEffect(()=>{
  //   if(listening){
  //     setChatText(transcript)
  //   }
  // })


  const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = "en-US";



const [isListening, setIsListening] = useState(false);
const [note, setNote] = useState(null);

useEffect(() => {
  if(isListening==false){
    setNote("")
    mic.stop()
  }
  if(isListening==true){
    handleListen();
  }
},[isListening]);

const handleListen = () => {
  if (isListening) {
    mic.start();
  } else {
    mic.stop();
    // mic.onend = () => {
    //   console.log("Stopped Mic on Click");
    // };
  }
  mic.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join("");
    setNote(transcript);
    mic.onerror = (event) => {
      console.log(event.error);
    };
  };
};

useEffect(()=>{
  if(isListening){
    setChatText(note)
  }
})




  const latestMessageRef = useRef(null);

  // Function to scroll to the latest message without smooth scrolling
  const scrollToLatestMessage = () => {
    if (latestMessageRef.current) {
      latestMessageRef.current.scrollIntoView({ behavior: 'auto', block: 'end' });
    }
  };

  // Scroll to the latest message whenever AllChatText changes
  useEffect(() => {
    scrollToLatestMessage();
  }, [AllChatText]);





  const [isFinishedTyping, setIsFinishedTyping] = useState(false);

  const handleFinishTyping = (finished) => {
    setIsFinishedTyping(finished);
    if(isFinishedTyping==false){
      setShowStopBtn(false)
      setLoading(false)
      setIsTypingFinished(true);
      setcheck_to_stop_typing(false)
      setIsFinishedTyping(false)
    }
  };




  // ================ event stream for chat modified=================
  

  const [streamedData, setStreamedData] = useState('');
  const [abortController, setAbortController] = useState(new AbortController());
  
  const [restrict_after_asking_question_once,set_restrict_after_asking_question_once]=useState(false)

  // Reusable function to make authorized requests with various methods and payload
  const makeAuthorizedRequest = async (url, method, token, payload, signal) => {
    set_restrict_after_asking_question_once(true)
    const headers = {
      Authorization: token,
      'Content-Type': 'application/json',
    };

    const requestOptions = {
      method,
      signal,
      headers,
    };

    if (method === 'POST') {
      requestOptions.body = JSON.stringify(payload);
    }

    return fetch(url, requestOptions);
  };




  const startStreaming = async (repeat_question,question) => {

    if(restrict_after_asking_question_once){
        notifymessage("Wait for response to finish")
        return
    }


    let payload={}

    if(repeat_question==false){

        if(ChatText.length<=0){
          notifyerror("Type somethings to ask.")
          return
        }
        setCurrentQuestionIni(ChatText)
        
      }else{        
        setCurrentQuestionIni(question)
    }



    let InTone = ``;
    if (selectedSummarizes) {
      selectedSummarizes.forEach((item) => {
        InTone += `[Generate In Tone:${item.value}]`;
      });
    } else {
      InTone = "Default";
    }
      // setCurrentQuestionIni(ChatText);
      if (divRef.current) {
        divRef.current.focus();
      }

    if(repeat_question==true){

      payload = {
        question: question,
        Tone: InTone,
        chat_root: IdOfTopTitleChat,
      };

    }else{

      payload = {
        question: ChatText,
        Tone: InTone,
        chat_root: IdOfTopTitleChat,
      };

    }
    



    const controller = new AbortController();
    setAbortController(controller);

    const url = BACKEND_URL+BACK_END_API_CHAT_ASK_QUESTION+"/"

    setAfterTypeDontShowIni(true)


    setChatText('')

    const response = await makeAuthorizedRequest(
      url,
      'POST',
      `Bearer ${AUTH_TOKEN}`,
      payload,
      controller.signal
    );

    try {

      if(response.status==400){
        notifyerror("upgrade your plan")
      }
      if(response.status==500){
        notifyerror("upgrade your plan")
      }

      // if (!response.ok) {
      //   notifyerror("Check Your Network")
      // }

      const reader = response.body.getReader();
      let answer_response = ""

      while (true) {

        const { done, value } = await reader.read();

        if (done || controller.signal.aborted) {
          const final_single_result = {
            question: payload.question,
            content: answer_response,
          };
          setCurrentAnswer((prevMessages) => [...prevMessages, final_single_result]);
          setCurrentQuestionIni("")
          setStreamedData("")
          set_restrict_after_asking_question_once(false)
          break;
        }

        // in value there could be multiple or single data comming from stream
        const textData = new TextDecoder().decode(value); // Convert binary data to text
        // Use a regular expression to extract 'content' from the data
        const regex = /'content': '([^']*)'/g;
        let match;
        let contents = [];

        while ((match = regex.exec(textData)) !== null) {
          const contentWithLineBreaks = match[1];
          // Replace '\n' with actual line breaks
          const contentWithActualLineBreaks = contentWithLineBreaks.replace(/\\n/g, '\n');
          contents.push(contentWithActualLineBreaks);
        }

        const concatenatedContent = contents.join('');

        if(concatenatedContent!="@@stop@@"){
            setStreamedData(prevData => prevData + concatenatedContent);
            answer_response+=concatenatedContent
        }else{
          set_restrict_after_asking_question_once(false)
          abortController.abort();
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const stopStreaming = () => {
    abortController.abort();

    const final_single_result = {
      question: CurrentQuestionIni,
      content: streamedData,
    };
    setCurrentAnswer((prevMessages) => [...prevMessages, final_single_result]);

    setCurrentQuestionIni("")
    setStreamedData("")
    set_restrict_after_asking_question_once(false)
  };



  // =======repeat the stream questioning==============
  // const submitRepeat = async (repeat_ask_question) => {





  // ================load data after darkmode is true or not confirmation================
  const DarkModeState = useSelector((state)=>state.SetDarkMode.DarkMode)
  const [checkDarkMode, setCheckDarkMode] = useState(null);

  useEffect(() => {
    const darkModeValue = localStorage.getItem('DarkMode');
    if (darkModeValue === 'true') {
      setCheckDarkMode(true);
    } else if (darkModeValue === 'false' || darkModeValue === null) {
      setCheckDarkMode(false);
    }
  }); // Use an empty dependency array

  return (
    <>
      {checkDarkMode === null ? (
        <LoadingPage />
      ) :
      <div className=" z-20 relative sm:fixed top-0 right-0 sm:w-[calc(100%-256px)] min-h-screen -mx-6 sm:mx-0  flex">
      {/* <div className="bg-slate-500"> */}


      <div className="flex-auto flex flex-col h-full">
          
      <div className="dark:bg-black dark:text-gray-200 dark:border-slate-500 sm:w-full bg-white px-4 py-2 mt-1 lg:px-10 lg:py-5 border border-gray-200 flex gap-2">
                
                <div className="h-[25px] flex-1 text-xl font-semibold">
                    <div className="">              
                          <input
                              className="w-full mb-4 text-[20px] truncate bg-transparent outline-none focus:ring pointer-events-auto"
                              type="text"
                              placeholder="Title of Room"
                              data-testid="EditableChatTitle"
                              value={TitleOfChat}
                              onChange={TitleChage}
                              onKeyPress={TitleInputKeyPressed}
                              onBlur={mousemovedawayfrominput}
                            />
                    </div>
                </div>

                <button
                  type="button"
                  className="dark:bg-gray-800 dark:text-white h-[30px] float-right  transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-2 active:ring-1"
                  onClick={(e) => setSidebarStatus(!sidebarStatus)}
                >
                  <span className="flex items-center justify-center gap-x-2 mx-auto select-none">
                      <ChatArrow clsx={clsx} sidebarStatus={sidebarStatus}/>
                    <span>{sidebarStatus ? "Hide" : "View"} conversations</span>
                  </span>
                </button>
          </div>


          <div className="flex-auto w-full flex-grow flex flex-col items-center pt-4 pb-5 overflow-hidden h-screen">

            <div className="relative flex flex-col overflow-hidden h-full w-full bg-white max-w-[832px]">
              <div className="flex flex-col flex-auto h-full w-full">
              
                <div className="dark:bg-black  dark:border-slate-500 flex-1 flex max-h-full overflow-x-hidden overflow-y-auto w-full">

                      {/* =================chat data initially================== */}

                      {AllChatText &&
                        (AllChatText.length > 0 ? (

                          <div
                            ref={chatContainerRef}
                            className="dark:bg-gray-800 flex-1 mb-4 flex flex-col item-start bg-white ml-auto mr-auto  p-3 text-sm overflow-y-auto"
                          >
                            {/* Chat messages */}
                            {AllChatText.map((chat_data, index) => (

                              <div key={index} className="flex flex-col mb-3 mt-4" >

                                {/* User */}
                                <FirstUserQuestion question={chat_data.question} />

                                {/* Bot */}                         
                                <FirstBotAnswer darkModeStatus={checkDarkMode} chat_data={chat_data} content={chat_data.content}/>

                              </div>
                            ))}
                            
                            {/* ==========after init question */}

                            {CurrentAnswer &&
                              <>
                                {CurrentAnswer.length>=0
                                  ?
                                  <>
                                      {CurrentAnswer.map((data,index)=>{
                                        return (
                                          <div 
                                          key={index}
                                        >
                                          <FirstUserQuestion question={data.question} />

                                            <div
                                              index={2}
                                              ref={latestMessageRef}
                                            >
                                              <FirstBotAnswer darkModeStatus={checkDarkMode} chat_data={data} content={data.content}/>
                                              {/* <ShowAnswer data={data["content"]}/> */}
                                            </div>
                                        </div>
                                        )
                                      })}
                                  </>
                                  :
                                    null
                                }
                              </>
                              }

                            {CurrentQuestionIni &&  (
                              <>
                                  {CurrentQuestionIni.length>0
                                  ?
                                      <>
                                      {streamedData.length<=0
                                      ?
                                        <>
                                            <div className="flex flex-col mb-3 mt-4">
                                                <FirstUserQuestion question={CurrentQuestionIni}/>

                                              {/* Bot */}
                                              <div className="relative flex flex-col">
                                                <div className="w-7 h-7 mt-2 rounded-full order-last overflow-hidden">
                                                  <img
                                                    className="w-full h-full rounded-full"
                                                    src="https://aiprojectfilestorage.s3.ap-southeast-2.amazonaws.com/frontend-images/chat.png"
                                                    alt="ChatBot"
                                                  />
                                                </div>
                                                <div 
                                                  className="text-black  dark:text-white dark:bg-black dark:border-slate-500  bg-white outline-none px-4 py-3 mx-4 md:max-w-[90%] rounded-2xl border border-sky-100"
                                                  // className="text-black bg-blue-800 outline-none px-4 py-3 mx-4 md:max-w-[90%] rounded-2xl"
                                                  tabIndex={0}
                                                  ref={chatLoadingRef}
                                                >
                                                  <>
                                                    <IconChat />
                                                  </>
                                                </div>
                                              </div>
                                            </div>
                                          </>
                                        :
                                          <>
                                            <FirstUserQuestion question={CurrentQuestionIni} />

                                            <div
                                              tabIndex={4}
                                              // tabIndex={0}
                                              ref={divRef}
                                            >
                                              <AnswerFroApi darkModeStatus={checkDarkMode} content={streamedData}/>

                                            </div>
                                          </>
                                      }
                                      </>
                                  :
                                      null

                                  }

                              </>
                            )}



                            


                          </div>
                        ) : (
                          <>

                            <div
                              ref={chatContainerRef}
                              className="dark:bg-gray-800 mb-4 flex-1 flex flex-col item-start bg-white ml-auto mr-auto  p-3 text-sm overflow-y-auto"
                            >

                            {CurrentAnswer &&
                              <>
                                {CurrentAnswer.length>=0
                                  ?
                                  <>
                                      {CurrentAnswer.map((data,index)=>{
                                        return (
                                          <div 
                                          key={index}
                                        >
                                          <FirstUserQuestion question={data.question} />

                                            <div
                                              index={2}
                                              ref={latestMessageRef}
                                            >
                                              <FirstBotAnswer darkModeStatus={checkDarkMode} chat_data={data} content={data.content}/>
                                              {/* <ShowAnswer data={data["content"]}/> */}
                                            </div>
                                        </div>
                                        )
                                      })}
                                  </>
                                  :
                                    null
                                }
                              </>
                              }

                            {CurrentQuestionIni &&  (
                              <>
                                  {CurrentQuestionIni.length>0
                                  ?
                                      <>
                                      {streamedData.length<=0
                                      ?
                                        <>
                                            <div className="flex flex-col mb-3 mt-4">
                                                <FirstUserQuestion question={CurrentQuestionIni}/>

                                              {/* Bot */}
                                              <div className="relative flex flex-col">
                                                <div className="w-7 h-7 mt-2 rounded-full order-last overflow-hidden">
                                                  <img
                                                    className="w-full h-full rounded-full"
                                                    src="https://aiprojectfilestorage.s3.ap-southeast-2.amazonaws.com/frontend-images/chat.png"
                                                    alt="ChatBot"
                                                  />
                                                </div>
                                                <div
                                                  className="text-black  dark:bg-black dark:border-slate-500 bg-white outline-none px-4 py-3 mx-4 md:max-w-[90%] rounded-2xl border border-sky-100"
                                                  // className="text-black bg-blue-800 outline-none px-4 py-3 mx-4 md:max-w-[90%] rounded-2xl"
                                                  tabIndex={0}
                                                  ref={chatLoadingRef}
                                                >
                                                  <>
                                                    <IconChat />
                                                  </>
                                                </div>
                                              </div>
                                            </div>
                                          </>
                                        :
                                          <>
                                            <FirstUserQuestion question={CurrentQuestionIni} />

                                            <div
                                              tabIndex={4}
                                              // tabIndex={0}
                                              ref={divRef}
                                              className=""
                                            >
                                              <AnswerFroApi darkModeStatus={checkDarkMode} content={streamedData}/>

                                            </div>
                                          </>
                                      }
                                      </>
                                  :
                                      null

                                  }

                              </>
                            )}

                              


                              {AfterTypeDontShowIni ? null : (
                                <div className="flex flex-auto flex-col items-center justify-center">
                                  <div className="py-10 text-center">
                                    <img
                                      src="https://aiprojectfilestorage.s3.ap-southeast-2.amazonaws.com/frontend-images/chat-hero.png"
                                      className="w-64 mb-8"
                                      alt="Chat Hero"
                                    />
                                    <h2 className="text-2xl font-bold mb-8">
                                      AI Chat
                                    </h2>
                                    <p className="text-sm font-medium leading-none max-w-[300px]">
                                      Choose a prompt below or write your own to
                                      start chatting with our Best AI.
                                    </p>
                                  </div>
                                </div>
                              )}

                            </div>

                          </>
                        ))}


                      {/* ====================================================== */}
                    
                    
                    </div>
                    
                    
                    <div
                      ref={popRef}
                      className="dark:bg-black dark:text-gray-200 dark:border-slate-500 chatbox relative flex flex-col w-full  @lg:py-4 max-w-7xl m-auto"
                    >

                      <div className="dark:bg-black dark:text-gray-200 dark:border-slate-500 mb-[70px] flex w-full ">

                        <div className="w-full mr-[60px]">
                            <div className="dark:bg-black dark:text-gray-200 dark:border-slate-500 dark:rounded-none p-2 bg-gray-50 w-full flex items-center rounded-t-xl">
                              <button
                                className="dark:hover:bg-gray-700 group inline-flex items-center gap-2 px-3 py-2 text-sm font-bold rounded-md duration-300 hover:bg-blue-900 hover:text-grey-900 focus:shadow-none"
                                onClick={handleClickOpen}
                              >
                                <ChatIconP/>
                                <p  className="text-[15px] font-semibold" >Browse prompts</p>
                              </button>
                              <button
                                className="dark:hover:bg-gray-700 group inline-flex items-center gap-2 px-3 py-2 text-sm font-bold rounded-md duration-300 hover:bg-blue-900 hover:text-grey-900 focus:shadow-none"
                                onClick={handlePopoverOpen}
                              >
                                <ChatIconR/>

                                <p  className="text-[15px] font-semibold" >Browse voice</p>

                              </button>
                              
                              {/* ==================Tone to show=================== */}
                              {show_summarize_tone ? (
                                <>
                                  {selectedSummarizes.map((data, index) => {
                                    return (
                                      <>
                                        <div
                                          key={index}
                                          className="dark:bg-gray-700 dark:text-white dark:border-slate-500 text-xs font-medium rounded-full py-1 border ml-2 px-3 border-gray-200 bg-white flex items-center"
                                        >
                                          <div className="dark:text-white mr-2 w-3 h-3 flex items-center justify-center">
                                            <ChatIconN/>
                                          </div>
                                          <div className="dark:text-white truncate text-ellipsis max-w-[4rem] @md:max-w-[40rem]">
                                            {data.label}
                                          </div>
                                          <div
                                            className="dark:text-white ml-2 w-2.5 h-2.5 flex items-center justify-center cursor-pointer"
                                            onClick={() => handleDeleteClick(data.label)}
                                          >
                                            <ChatIconM/>
                                          </div>
                                        </div>
                                      </>
                                    );
                                  })}
                                </>
                              ) : null}
                              {/* ==================Tone to show=================== */}
                            </div>

                          <div className=" inputbox relative chat-message" ref={latestMessageRef}>

                            <textarea
                                className="dark:bg-black dark:text-gray-200 dark:border-slate-500 w-full py-4 pl-4 pr-12 border border-border rounded-b-xl placeholder-text-black placeholder-opacity-100 placeholder-font-semibold focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:border-blue resize-none overflow-y-auto min-h-14"
                                type="text"
                                rows="1"
                                placeholder="Ask or Search anything"
                                value={ChatText}
                                onChange={(e) => {
                                  setChatText(e.target.value);
                                  adjustTextareaHeight(e.target);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    // submitChatText();
                                    startStreaming(false,"")
                                  }
                                }}
                            /> 

                            {streamedData &&
                            <>
                                {streamedData.length>0
                                ?
                                  <>
                                      <button
                                        className="stop-generator  absolute -top-[100px] left-1/2 -translate-x-1/2 text-white bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition-all"
                                      // className="fixed bottom-[145px] ml-[100px] left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all"
                                      onClick={()=>{
                                        stopStreaming()
                                      }}
                                    >
                                      Stop Generating
                                    </button>
                                  </>
                                :
                                  null
                                }

                            </>
                            }
                          
                          
                            {check_to_stop_typing
                            ?
                                <button
                                    className="absolute bottom-6 right-3 w-6 h-6"
                                  onClick={handleStopTyping}>
                                    <ChatStopIcon/>
                                </button>
                            :
                              <>
                                <button
                                  className="absolute bottom-6 right-3 w-6 h-6"
                                  onClick={() => {
                                    // submitChatText();
                                    startStreaming(false,"")
                                    // setChatFill("");
                                  }}
                                >
                                  {Loading ? (
                                      <ChatLoading/>
                                  ) : (
                                      <ChatIconForChat/>
                                  )}
                                </button>
                              </>
                            }

                          </div>

                        </div>

                        <div className="absolute bottom-9 mb-[70px] right-[-9px]  w-6 h-6 mr-[40px]">
                            <button
                              // onClick={listening ? stopListening : startListening}
                              onClick={() => {
                                if(isListening==true){
                                  setIsListening(false)
                                }else{
                                  setIsListening(true)
                                }
                                    // setIsListening((prevState) => !prevState)
                                  }}
                              className="dark:bg-black dark:text-gray-200 dark:border-slate-500 p-3 h-[50px] w-[50px] bg-slate-200 rounded-full"
                            >
                                {
                                    isListening
                                    ?
                                      <BsFillMicMuteFill className="h-[23px] w-[23px]"/>
                                    :
                                      <BsFillMicFill className="h-[23px] w-[23px]"/>
                                }
                            </button>
                        </div>

                      </div>

                    </div>


                  </div>
                </div>
          </div>

      </div>


          {/* =========== start side bar div========= */}


          <div
                className={clsx(
                  "z-10 absolute top-[50px] sm:top-0 -right-0 sm:relative w-60 max-w-screen bg-gray-100 flex flex-col duration-300",
                  {
                    "sm:hidden !-right-full": !sidebarStatus,
                    "hidden": !sidebarStatus, // Add this line to hide the div when sidebarStatus is true
                  }
                )}
                style={{ maxHeight: "calc(100vh - 50px)", overflowY: "auto" }}
              >

              <div className="dark:bg-black dark:text-gray-200 dark:border-slate-500 p-4 pb-2">

                <button
                  type="button"
                  className="dark:bg-gray-800 dark:text-white transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm bg-blue-600 text-white ring-0 ring-blue-600 hover:ring-2 active:ring-0 w-full"
                  onClick={() => {
                    create_new_room_for_chat();
                  }}
                >
                  <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                    + New chat conversation
                  </span>
                </button>

              </div>


              

              <div className="w-full p-2 flex flex-col dark:bg-black dark:text-gray-200 dark:border-slate-500">
                <div className="space-y-1.5 w-full">
                  <label
                    htmlFor="search-chat-threads"
                    className="text-sm font-medium block text-gray-900 placeholder:text-gray-400 transition-[color] duration-150 ease-in-out"
                  >
                    <span className="flex items-center space-x-1">
                      <span />
                    </span>
                  </label>
                  <div className="py-1 flex items-center gap-2 bg-white w-full px-3 rounded-lg ring-1 hover:ring-2 transition-all duration-150 ease-in-out ring-gray-200 outline-none focus-within:!ring-1">
                    <div className="flex items-center grow gap-2 py-1.5">
                      <ChatIconSix/>
                      <div className="flex gap-1 grow">
                        <input
                          id="search-chat-threads"
                          type="search"
                          className="block w-full text-gray-900 placeholder:text-gray-400 text-sm font-normal resize-none outline-none"
                          placeholder="Search..."
                          defaultValue=""
                          onChange={handleSearchChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>



              {/* =======Title side bar======== */}
              <div className="w-full min-h-screen grow flex-1 dark:bg-black dark:text-gray-200 dark:border-slate-500">
                {ChatTitleForSideBar && (
                  <>
                    {ChatTitleForSideBar.map((data, index) => {
                      return (
                        <div
                          key={index}
                          className={`${data.id==IdOfTopTitleChat? "bg-slate-300 " : "bg-slate-100" }   cursor-pointer group border-b border-gray-200 flex items-center h-13  mt-1 mb-1 `}
                        >
                          <div className="dark:bg-gray-800 dark:text-white dark:border-slate-500 p-4 w-[300px] flex flex-grow justify-between items-center truncate">
                            <div
                              className="truncate text-ellipsis w-full"
                              onClick={() => {
                                get_chat_data_from_side_div_when_click(
                                  BACKEND_URL + BACK_END_API_CHAT_DATA,
                                  data.id
                                );
                              }}
                            >
                              {editingIndex === index ? (
                                <input
                                  className="dark:text-black text-ellipsis p-1 text-[20px] flex-grow text-xs font-semibold w-full truncate  outline-none focus:ring pointer-events-auto"
                                  aria-label="Chat title"
                                  value={ChatTitleForSideBar[index].title}
                                  onChange={(event) =>
                                    handleInputChange(index, event)
                                  }
                                  onBlur={() => handleInputBlur(index)}
                                  onKeyPress={(event) => {
                                    if (event.key === "Enter") {
                                      handleInputBlur(index);
                                    }
                                  }}
                                  autoFocus
                                />
                              ) : (
                                <span
                                  className="p-1 w-full text-ellipsis flex-grow text-xs font-normal"
                                  aria-label="Chat title"
                                >
                                  {data.title}
                                </span>
                              )}
                            </div>
                            <div className="sr-only group-hover:not-sr-only flex">
                              {editingIndex === index ? (
                                // Show Save button while editing
                                <>
                                  <button
                                    type="button"
                                    className=" transition-all duration-200 relative font-semibold shadow-sm hover:outline-none focus:outline-none px-2 py-1 text-xs text-center bg-transparent focus:ring-transparent rounded outline-none shadow-transparent"
                                    aria-label="Edit conversation title"
                                    onClick={() => handleInputBlur(index)}
                                  >
                                    <ChatIconEditFirst/>
                                  </button>
                                </>
                              ) : (
                                // Show Edit button when not editing
                                <>
                                  <button
                                    type="button"
                                    className=" transition-all duration-200 relative font-semibold shadow-sm hover:outline-none focus:outline-none px-2 py-1 text-xs text-center bg-transparent focus:ring-transparent rounded outline-none shadow-transparent"
                                    aria-label="Edit conversation title"
                                    onClick={() => handleEditClick(index)}
                                  >
                                    <span className=" flex items-center justify-center mx-auto space-x-2 select-none">
                                    <ChatIconEle/>
                                    </span>
                                  </button>
                                  <button
                                    type="button"
                                    className="transition-all duration-200 relative font-semibold shadow-sm hover:outline-none focus:outline-none px-2 py-1 text-xs text-center bg-transparent focus:ring-transparent rounded outline-none shadow-transparent"
                                    aria-label="Delete conversation"
                                    onClick={() => {
                                      // console.log(data.id)
                                      const formData = {
                                        trash: true,
                                      };
                                      _update_document_data(
                                        formData,
                                        data.id,
                                        "Moved to trash"
                                      );
                                    }}
                                  >
                                    <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                                    <ChatIconTw/>
                                    </span>
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
              {/* =============== */}




          </div>

            
        {/* ===========end side bar div========= */}
          



            {/* =====================Browse prompts ============ */}
                  <Dialog
                    open={open}
                    onClose={handleClose}
                    fullWidth={true}
                    maxWidth={"lg"}
                    className=" rounded-lg max-w-[1088px] mx-auto"
                  >
                    <DialogContent
                      className="dark:bg-gray-800 dark:text-gray-200 dark:border-slate-500"
                    >
                      <div className="mb-4 pr-12 flex w-full items-center justify-start">
                        <h3 className="w-52 text-xl font-bold">Prompts</h3>
                        <div className="relative w-full text-grey-600 focus-within:text-grey-400">
                          <ChatIconDialogF/>
                          <input
                            type="search"
                            className="resize-none rounded border border-blue-900 py-2 pl-10 text-sm text-black shadow-sm w-60 focus:outline-none placeholder-grey-400 transition-all duration-300 focus:w-full focus:border-border focus:ring-0"
                            placeholder='Try "Sales" or "Email"'
                            autoComplete="off"
                            data-hj-allow="true"
                            value={search_chat_template} // Use the search_chat_template value here
                            onChange={handleChange}
                          />
                        </div>


                        <div
                          onClick={handleClose}
                          className="absolute top-0 right-0 p-8 cursor-pointer duration-300 hover:opacity-70"
                        >
                          <GrClose size={16} />
                        </div>

                      </div>

                      
                      <div className="flex w-full items-start justify-start">
                        {/* =================the first template name================= */}
                        <div className="w-3/12 h-[500px] self-stretch overflow-scroll  pt-3 pr-1">
                        
                          <div
                            className="dark:hover:bg-slate-500 cursor-pointer truncate rounded-md p-3 capitalize hover:bg-blue-900 "
                            onClick={() => {
                              set_show_only_custom(true);
                            }}
                          >
                            Custom
                          </div>

                          <div className="my-4 opacity-40">
                          <div className="border-b  border-purple-100 h-0 w-full" />
                          </div>
                          {Chat_Template_Title && (
                            <>
                              {Chat_Template_Title.length > 0 ? (
                                <>
                                  {Chat_Template_Title.map((data, index) => {
                                    return (
                                      <>
                                        <div key={index}>
                                          <div
                                            className="dark:bg-gray-800 dark:border-slate-500 dark:hover:bg-slate-500  mb-1 cursor-pointer truncate rounded-md p-3 capitalize bg-blue-900 hover:bg-blue-900"
                                            onClick={() => {
                                              second_layer_template(data.id);
                                              set_show_only_custom(false);
                                            }}
                                          >
                                            {data.description}
                                          </div>
                                        </div>
                                      </>
                                    );
                                  })}
                                </>
                              ) : null}
                            </>
                          )}
                        </div>
                        {/* =================the first template name================= */}

                        {/* ====================custome template===================== */}

                        {show_only_custom ? (
                          <>
                            <div className="w-4/12 h-[500px] self-stretch overflow-scroll border-r border-purple-100 p-3 ">
                              {show_create_input ? (
                                <>
                                  <input
                                    type="text"
                                    className="mb-2 p-3 text-sm dark:border dark:border-slate-500 text-black dark:bg-gray-800  dark:text-white border-purple-100 focus:outline-none w-full resize-none rounded placeholder-grey-400 shadow-sm transition-all duration-300 focus:w-full focus:border-green-700 focus:ring-0"
                                    placeholder="Title of Template"
                                    autoComplete="off"
                                    value={newTitleName}
                                    onChange={handleNewTitleNameChange}
                                  />
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    className="open-modal-button w-full transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-lg px-4 py-2 text-base  text-white bg-[#334977] ring-0 ring-blue-600 hover:ring-2 active:ring-0 my-2"
                                    onClick={showinputtocreate}
                                  >
                                    <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                                      + Create Custom template
                                    </span>
                                  </button>
                                </>
                              )}
                              {custome_chat_template && (
                                <>
                                  {custome_chat_template.length > 0 ? (
                                    <>
                                      {custome_chat_template.map((data, index) => {
                                        return (
                                          <>
                                            <div
                                              key={index}
                                              className="w-full grow overflow-y-auto flex-1"
                                            >
                                              <div className="dark:bg-gray-800 dark:hover:bg-slate-500  dark:border-slate-500 cursor-pointer group border-b mb-1 break-words rounded-md border-2 p-2.5 line-clamp-2 border-blue-800 bg-blue-800">
                                                <div className="flex flex-grow justify-between items-center truncate">
                                                  {EditCustomTemplateEditingTitleIndex ===
                                                  index ? (
                                                    <>
                                                      <div className="truncate text-ellipsis w-full">
                                                        <input
                                                          type="text"
                                                          className="dark:text-black"
                                                          value={
                                                            EditCustomTemplateEditedTitle
                                                          }
                                                          onChange={
                                                            EditCustomTemplateHandleTitleChange
                                                          }
                                                        />
                                                      </div>
                                                      <div className="sr-only group-hover:not-sr-only flex">
                                                        <button
                                                          className="transition-all duration-200 relative font-semibold shadow-sm hover:outline-none focus:outline-none px-2 py-1 text-xs text-center bg-transparent focus:ring-transparent rounded outline-none shadow-transparent"
                                                          onClick={() => {
                                                            EditCustomTemplateHandleSaveClick(
                                                              index,
                                                              data.id
                                                            );
                                                          }}
                                                        >
                                                          <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                                                            <svg
                                                              className="w-4 h-4"
                                                              viewBox="0 0 24 24"
                                                              fill="none"
                                                              xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                              <path
                                                                d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z"
                                                                fill="#292D32"
                                                              />
                                                            </svg>
                                                          </span>
                                                        </button>
                                                        <button
                                                          className="transition-all duration-200 relative font-semibold shadow-sm hover:outline-none focus:outline-none px-2 py-1 text-xs text-center bg-transparent focus:ring-transparent rounded outline-none shadow-transparent"
                                                          onClick={() => {
                                                            setEditCustomTemplateEditingTitleIndex(
                                                              null
                                                            );
                                                          }}
                                                        >
                                                          <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                                                            <svg
                                                              className="w-4 h-4 mt-[2px]"
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              xmlnsXlink="http://www.w3.org/1999/xlink"
                                                              xmlnsSerif="http://www.serif.com/"
                                                              viewBox="0 0 20 25"
                                                              version="1.1"
                                                              xmlSpace="preserve"
                                                              x="0px"
                                                              y="0px"
                                                              fillRule="evenodd"
                                                              clipRule="evenodd"
                                                              strokeLinejoin="round"
                                                              strokeMiterlimit="2"
                                                            >
                                                              <g transform="matrix(1,0,0,1,-350,-30)">
                                                                <path
                                                                  d="M360,42.472L367.528,50L370,47.528L362.472,40L370,32.472L367.528,30L360,37.528L352.472,30L350,32.472L357.528,40L350,47.528L352.472,50L360,42.472Z"
                                                                  fillRule="nonzero"
                                                                />
                                                              </g>
                                                            </svg>
                                                          </span>
                                                        </button>
                                                      </div>
                                                    </>
                                                  ) : (
                                                    <>
                                                      <div
                                                        className="truncate text-ellipsis w-full"
                                                        onClick={() => {
                                                          get_the_inner_value_of_custom_template(
                                                            data.id
                                                          );
                                                        }}
                                                      >
                                                        {data.title}
                                                      </div>
                                                      <div className="sr-only group-hover:not-sr-only flex">
                                                        <button
                                                          type="button"
                                                          className="transition-all duration-200 relative font-semibold shadow-sm hover:outline-none focus:outline-none px-2 py-1 text-xs text-center bg-transparent focus:ring-transparent rounded outline-none shadow-transparent"
                                                          onClick={() =>
                                                            EditCustomTemplateHandleEditClick(
                                                              index
                                                            )
                                                          }
                                                        >
                                                          <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                                                            <svg
                                                              className="w-4 h-4"
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              viewBox="0 0 16 16"
                                                            >
                                                              <path
                                                                d="M1.74,14.99l5.05-1.3s-.64-1.57-1.76-2.67c-1.12-1.1-2.71-1.74-2.71-1.74L.99,14.23c-.12,.43,.32,.87,.75,.76Z"
                                                                fill="transparent"
                                                              ></path>
                                                              <path
                                                                d="M6.8,13.68l7.39-7c1.23-1.16,1.13-3.22-.21-4.54-1.31-1.29-3.31-1.38-4.47-.2L2.32,9.28s1.59,.63,2.71,1.73c1.12,1.1,1.76,2.67,1.76,2.67Z"
                                                                fill="none"
                                                                stroke="#0D121C"
                                                                strokeWidth="1"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                              ></path>
                                                              <path
                                                                d="M1.74,14.99l5.05-1.3s-.64-1.57-1.76-2.67c-1.12-1.1-2.71-1.74-2.71-1.74L.99,14.23c-.12,.43,.32,.87,.75,.76Z"
                                                                fill="none"
                                                                stroke="#0D121C"
                                                                strokeWidth="1"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                              ></path>
                                                            </svg>
                                                          </span>
                                                        </button>
                                                        <button
                                                          type="button"
                                                          className="transition-all duration-200 relative font-semibold shadow-sm hover:outline-none focus:outline-none px-2 py-1 text-xs text-center bg-transparent focus:ring-transparent rounded outline-none shadow-transparent"
                                                          onClick={() => {
                                                            delete_the_custom_template(
                                                              data.id
                                                            );
                                                          }}
                                                        >
                                                          <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                                                            <svg
                                                              className="w-4 h-4"
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              viewBox="0 0 16 16"
                                                            >
                                                              <path
                                                                d="M.86,4.28H15.14"
                                                                fill="none"
                                                                stroke="#0D121C"
                                                                strokeWidth="1"
                                                                strokeLinecap="round"
                                                              ></path>
                                                              <path
                                                                d="M13.13,4.28H2.86c-.17,3-.16,5.97,.28,8.95,.17,1.1,1.11,1.91,2.22,1.91h5.26c1.11,0,2.06-.81,2.22-1.91,.45-2.98,.45-5.95,.28-8.95Z"
                                                                fill="none"
                                                                stroke="#0D121C"
                                                                strokeWidth="1"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                              ></path>
                                                              <path
                                                                d="M5.14,4.28v-.57c0-.76,.3-1.48,.84-2.02,.53-.54,1.26-.84,2.02-.84s1.48,.3,2.02,.84c.53,.54,.83,1.26,.83,2.02v.57"
                                                                fill="none"
                                                                stroke="#0D121C"
                                                                strokeWidth="1"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                              ></path>
                                                              <path
                                                                d="M6.29,7.34v4.73"
                                                                fill="none"
                                                                stroke="#0D121C"
                                                                strokeWidth="1"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                              ></path>
                                                              <path
                                                                d="M9.71,7.34v4.73"
                                                                fill="none"
                                                                stroke="#0D121C"
                                                                strokeWidth="1"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                              ></path>
                                                            </svg>
                                                          </span>
                                                        </button>
                                                      </div>
                                                    </>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          </>
                                        );
                                      })}
                                    </>
                                  ) : null}
                                </>
                              )}
                            </div>
                            {/* ====================custome template===================== */}
                          </>
                        ) : (
                          <>
                            {/* =================the second layer template name================= */}
                            <div className="w-4/12 h-[500px] self-stretch overflow-scroll border-r border-purple-100 p-3">
                              {second_layer_title && (
                                <>
                                  {Chat_Template_Title.length > 0 ? (
                                    <>
                                      {second_layer_title.map((data, index) => {
                                        return (
                                          <>
                                            <div
                                              key={index}
                                              className="dark:hover:bg-slate-500 dark:bg-gray-800 mb-1 cursor-pointer break-words rounded-md border-2 p-2.5 line-clamp-2 border-blue-800 bg-blue-800"
                                              onClick={() => {
                                                get_value_of_template(data.id);
                                              }}
                                            >
                                              {data.chat_first_step_template_name}
                                            </div>
                                          </>
                                        );
                                      })}
                                    </>
                                  ) : (
                                    <>
                                      <LoadingPage />
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                            {/* =================the second layer template name================= */}
                          </>
                        )}

                        {show_only_custom ? (
                          <>
                            {show_create_input ? (
                              <div className="w-5/12 h-[500px] dark:bg-gray-800 flex flex-col items-end self-stretch border-r border-purple-100 pt-3 pl-3">
                                <div className="dark:bg-gray-800 relative w-full h-full rounded-md whitespace-pre-wrap text-gray-500 bg-blue-900 p-3 mb-3 overflow-y-scroll">
                                  <div className="dark:bg-gray-800 editor-textarea h-full w-full">
                                    <div
                                      style={{
                                        maxHeight: 400,
                                        minHeight: 300,
                                        height: "100%",
                                      }}
                                      className="dark:bg-gray-800 focus:outline-none focus:expand no-scrollbar mb-2 w-full resize-none overflow-scroll rounded text-left text-grey-500 placeholder-purple-300 shadow-none  transition-all duration-300 focus:w-full focus:border-green-700 focus:ring-0 focus:ring-transparent"
                                      id="custom-prompt-editor-preview"
                                    >
                                      <div
                                        translate="no"
                                        className="dark:bg-gray-800 ProseMirror [&_p]:py-1.5"
                                        contentEditable="false"
                                      >
                                        {/* =============typing description=================== */}
                                        <textarea
                                          className="dark:bg-gray-800 resize-none w-full h-[90%] p-10 absolute top-0 left-0 border-none bg-transparent focus:outline-none"
                                          placeholder="Create your own template
                                              Start typing..."
                                          value={newDescription}
                                          onChange={handleNewDescriptionChange}
                                        />
                                        {/* =============typing description=================== */}
                                      </div>
                                    </div>
                                    <div className="dark:bg-gray-800 flex w-full flex-row justify-between">
                                      <div />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <>
                                {/* ====================Third layer which is value of chat template============ */}

                                <div className="w-5/12 h-[500px] dark:text-white dark:bg-gray-800 flex flex-col items-end self-stretch border-r border-purple-100 pt-3 pl-3">
                                  <div className="relative dark:text-white dark:bg-gray-800 w-full h-full rounded-md whitespace-pre-wrap text-gray-500 bg-blue-900 p-3 mb-3 overflow-y-scroll">
                                    <span className="dark:text-white dark:bg-gray-800 text-red-500 font-semibold text-[20px] sticky top-0 z-50 flex w-full overflow-y-scroll whitespace-pre-wrap bg-blue-900 pb-2 text-xs text-black/30">
                                      Edit or Use ( Template )
                                    {/* <TooltipInfo text="Use this template in chat" /> */}
                                    </span>
                                    <div className="dark:text-white dark:bg-gray-800 editor-textarea h-full w-full">
                                      <div
                                        style={{
                                          maxHeight: 400,
                                          minHeight: 300,
                                          height: "100%",
                                        }}
                                        className="dark:bg-gray-800 focus:outline-none focus:expand no-scrollbar mb-2 w-full resize-none overflow-scroll rounded text-left text-grey-500 placeholder-purple-300 shadow-none  transition-all duration-300 focus:w-full focus:border-green-700 focus:ring-0 focus:ring-transparent"
                                      >
                                        <div
                                          className="dark:text-white dark:bg-gray-800 ProseMirror [&_p]:py-1.5"
                                          contentEditable="false"
                                        >
                                          {/* =============typing description=================== */}
                                          {innervalueofcustomechattemplate == "" ? null : (
                                            <textarea
                                              className="dark:bg-gray-800 dark:text-gray-200  resize-none w-full h-[90%] p-10 absolute top-0 left-0 border-none bg-transparent focus:outline-none"
                                              value={innervalueofcustomechattemplate}
                                              onChange={handleChangeDescriptions}
                                              placeholder="Your custome template
                                            Start typing..."
                                            />
                                          )}
                                          {/* =============typing description=================== */}
                                        </div>
                                      </div>
                                        <div className="dark:bg-gray-800 flex w-full flex-row justify-between">
                                        <div />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* ====================Third layer which is value of chat template End========= */}
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            {/* ====================Third layer which is value of chat template============ */}

                            <div className="w-5/12 h-[500px] dark:text-white dark:bg-gray-800 flex flex-col items-end self-stretch border-r border-purple-100 pt-3 pl-3">
                              <div className="dark:bg-gray-800 relative w-full h-full rounded-md whitespace-pre-wrap text-gray-500 bg-blue-900 p-3 mb-3 overflow-y-scroll">
                                <span className="dark:bg-gray-800 text-red-500 sticky top-0 z-50 flex w-full overflow-y-scroll whitespace-pre-wrap bg-blue-900 pb-2 text-xs text-black/30">
                                  PREVIEW (Template)
                                  {/* <TooltipInfo text="Use this template in chat" /> */}
                                </span>
                                <div className="dark:bg-gray-800 editor-textarea h-full w-full">
                                  <div
                                    style={{
                                      maxHeight: 400,
                                      minHeight: 300,
                                      height: "100%",
                                    }}
                                    className="dark:bg-gray-800 focus:outline-none focus:expand no-scrollbar mb-2 w-full resize-none overflow-scroll rounded text-left text-grey-500 placeholder-purple-300 shadow-none  transition-all duration-300 focus:w-full focus:border-green-700 focus:ring-0 focus:ring-transparent"
                                    id="custom-prompt-editor-preview"
                                  >
                                    <div
                                      translate="no"
                                      className="dark:bg-gray-800 ProseMirror [&_p]:py-1.5"
                                      contentEditable="false"
                                    >
                                      {value_of_template_to_use && (
                                        <>{value_of_template_to_use}</>
                                      )}
                                    </div>
                                  </div>
                                  <div className="dark:bg-gray-800 flex w-full flex-row justify-between">
                                    <div />
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* ====================Third layer which is value of chat template End========= */}
                          </>
                        )}
                      </div>
                    </DialogContent>
                    <DialogActions
                      className="dark:bg-gray-800"
                    >
                      {show_create_input ? (
                        <>
                          <button
                            className="focus:outline-none select-none items-center rounded py-3 text-sm font-medium ring-offset-2 focus:ring-2 flex justify-around bg-red text-white bg-green-700 px-5"
                            onClick={() => {
                              create_new_template();
                            }}
                          >
                            create
                          </button>
                          <button
                            className="focus:outline-none select-none items-center rounded py-3 text-sm font-medium ring-offset-2 focus:ring-2 flex justify-around bg-red text-white bg-red-600 px-5"
                            onClick={() => {
                              setshow_create_input(false);
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : null}
                      {show_button_to_edit_text_area_description ? (
                        <>
                          <button
                            className="focus:outline-none select-none items-center rounded py-3 text-sm font-medium ring-offset-2 focus:ring-2 flex justify-around bg-red text-white bg-green-700 px-5"
                            onClick={() => {
                              update_the_description();
                            }}
                          >
                            update
                          </button>
                          <button
                            className="focus:outline-none select-none items-center rounded py-3 text-sm font-medium ring-offset-2 focus:ring-2 flex justify-around bg-red text-white bg-red-600 px-5"
                            onClick={() => {
                              setinnervalueofcustomechattemplate(
                                previousinnervalueofcustomechattemplate
                              );
                              setshow_button_to_edit_text_area_description(false);
                            }}
                          >
                            reset
                          </button>
                        </>
                      ) : null}

                      {show_only_custom ? (
                        <button
                          className="focus:outline-none select-none items-center rounded py-3 text-sm font-medium ring-offset-2 focus:ring-2 flex justify-around bg-blue text-white px-5"
                          onClick={use_custome_text}
                        >
                          Use Prompt
                        </button>
                      ) : (
                        <button
                          className="focus:outline-none select-none items-center rounded py-3 text-sm font-medium ring-offset-2 focus:ring-2 flex justify-around bg-blue text-white px-5"
                          onClick={use_choosen_text_to_question}
                        >
                          Use Prompt
                        </button>
                      )}
                    </DialogActions>
                  </Dialog>

                  <Popover
                    id={id}
                    open={openPop}
                    anchorEl={popStat}
                    onClose={handlePopoverClose}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    className="shadow-none"
                  >
                  
                  <div className="dark:bg-gray-700 dark:text-gray-200 dark:border-slate-500  dark:rounded-none w-full md:w-[800px] border border-grey-300 bg-white shadow-lg md:left-0 rounded-xl">
              <div>
                <div className="px-4 py-5">
                  <div className="space-y-1.5 w-full">
                    <label htmlFor="search" className="sr-only">
                      <span className="flex items-center space-x-1">
                        <span className="">Search</span>
                      </span>
                    </label>
                    <div className="dark:bg-black py-1 md:!mt-0 flex items-center gap-2 bg-white w-full px-3 rounded-lg ring-1 hover:ring-2 transition-all duration-150 ease-in-out ring-gray-200 outline-none focus-within:!ring-1">
                      <div className="dark:bg-black flex items-center grow gap-2 py-1.5">
                          <ChatIconFifth/>
                        <div className="dark:bg-black flex gap-1 grow">
                          <input
                            id="search"
                            type="search"
                            className="dark:bg-black dark:text-white block w-full text-gray-900 placeholder:text-gray-400 text-sm font-normal resize-none outline-none"
                            placeholder="Search by entry name, tag, or tone"
                            autoComplete="off"
                            defaultValue=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mx-3 overflow-y-scroll flex items-center no-scrollbar">
                  <span className="pr-2 mb-2">
                    <button>
                      <div className="inline-block">
                        <div className="dark:bg-gray-800 dark:text-white text-xs font-medium rounded-full text-gray-900 border py-1 px-3 border-gray-200 bg-white hover hover:bg-gray-100 cursor-pointer">
                          <strong className="font-semibold">
                            <div className="whitespace-nowrap">Tone</div>
                          </strong>
                        </div>
                      </div>
                    </button>
                  </span>
                </div>
                <div className="relative inline-block text-left w-full z-auto max-h-[12.875rem] overflow-y-auto overscroll-contain">
                  <div>
                    <div className="mx-4 text-gray-500 text-xs my-3 pb-2 border-b border-gray-200">
                      TONE
                    </div>

                    <div className="flex">
                      {brandVoice && (
                        <>
                          {brandVoice.length > 0 ? (
                            <>
                              {brandVoice.map((data, index) => (
                                <div key={index}>
                                  <ul className="py-1">
                                    <label className=" dark:text-white dark:hover:bg-gray-600 flex text-center items-center rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 mx-4 px-4 py-2 text-sm cursor-pointer">
                                      <input
                                        data-testid={`menu-item-${data.id}`}
                                        type="checkbox"
                                        id={data.id}
                                        className="dark:text-white form-checkbox focus:ring-blue-500 h-4 w-4 mr-2 text-blue-800 border-gray-300"
                                        value={data.brand_voice}
                                        checked={selectedSummarizes.some(
                                          (item) => item.label === data.brand_voice
                                        )}
                                        onChange={handleBrandVoiceChange}
                                      />
                                      <div className="truncate text-ellipsis max-w-[12rem] md:max-w-[40rem]">
                                        {data.brand_voice}
                                      </div>
                                      <div className="ml-2">
                                        <svg
                                          className="w-4 h-4"
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 16 16"
                                        >
                                          <ChatIconNine/>
                                        </svg>
                                      </div>
                                    </label>
                                  </ul>
                                </div>
                              ))}
                            </>
                          ) : null}
                        </>
                      )}
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>
              <div className="py-3 px-4 flex justify-end border-t border-gray-200">
                <button
                  type="button"
                  className="transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm bg-blue-600 text-white ring-0 ring-blue-600 hover:ring-2 active:ring-0 justify-end"
                  onClick={() => {
                    set_show_summarize_tone(true);
                    handlePopoverClose();
                  }}
                >
                  <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                    Apply to chat
                  </span>
                </button>
              </div>
            </div>

                    
                  </Popover>
            {/* =====================Browse prompts ============ */}


      </div>
      }
    </>
  );
};

export default Chat;