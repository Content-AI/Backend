import React, { useEffect,useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Login from "../pages/Login";
import Home from "../pages/Home";
import FirstStep from "../pages/ThreeSteps/FirstStep";
import SecondStep from "../pages/ThreeSteps/SecondStep";
import ThirdStep from "../pages/ThreeSteps/ThirdStep";
import { useSelector, useDispatch } from "react-redux";

import { _save_token_ } from "../../features/AuthenticationToken";
// import Profile from "../Profile/Profile";
import Chat from "../pages/chat/Chat";
import Template from "../pages/Template/Template";
import SingleTemplate from "../pages/Template/SingleTemplate";
import EditDocuments from "../pages/Template/Document/EditDocuments";
import Logout from "../pages/Logout";
import Projects from "../pages/Projects/Projects";
import ListOfDocument from "../pages/Template/Document/ListOfDocument";
import CreateNewContent from "../pages/CreateNewContent";
import FolderData from "../pages/Projects/FolderData";
import Brandvoice from "../pages/brandvoice/Brandvoice";
import BuildcustomTemplate from "../pages/Template/BuildcustomTemplate/BuildcustomTemplate";
import Settings from "../Settings/Settings";

import ImageGenerators from "../pages/ImageGenerator/ImageGenerators";
import RecapBuilder from "../pages/RecapBuilder/RecapBuilder";

import Billing from '../Settings/SettingsPages/Billing'
import General from '../Settings/SettingsPages/General'
import Profile from '../Settings/SettingsPages/Profile'
import Team from '../Settings/SettingsPages/Team'
import Usage from '../Settings/SettingsPages/Usage'
import Integrations from '../Settings/SettingsPages/Integrations'
import Subscription from "../Settings/SettingsPages/Subscription";
import ChangeWorkSpace from "../pages/ChangeWorkSpace";
import AcceptInvitationPage from "../pages/AcceptInvitationPage";
import { BsWhatsapp } from "react-icons/bs";
import Workflow from "../pages/workflow/Workflow";



import Help from "../pages/Help/Help";
import VoiceRecognition from "../pages/GenerateUsingVoice/VoiceRecognition";
import CompanyRegistrationForm from "../pages/BusinessPlan/CompanyRegistrationForm";


import {
  _hide_nav_,
  _show_nav_,
} from "../../features/HideShowNavBarGlobalState";


const AllRoutes = ({ _TOKEN_FOR_VALIDATION_NAVBAR_ }) => {
  const location = useLocation();

  const dispatch = useDispatch();

  const [isSettings,set_isSettings] = useState(false);
  const [show_invitation,setshow_invitation] = useState(false);

  let TOKEN = useSelector(
    (state) => state.SetAuthenticationToken.AuthenticationToken
  );
  useEffect(() => {
    if(location.pathname.includes("/settings")){
      set_isSettings(true)
    }else{
      set_isSettings(false)
    }
  }, [location]);
  useEffect(() => {
    if(location.pathname.includes("/invitation")){
      setshow_invitation(true)
    }else{
      setshow_invitation(false)
    }
  }, []);



  return (
    <>
      {TOKEN ? (
        <>
        <main 
            className={` 
            ${isSettings
              ? 
                'dark:bg-black dark:text-gray-200 dark:border-slate-500 flex flex-col sm:ml-64 sm:mt-[40px] min-h-[calc(100vh-80px)] pt-[74px] sm:pt-6 p-6 text-black bg-white ' 
              :
                show_invitation
                ?
                  null
                :
                  'dark:bg-black dark:text-gray-200 dark:border-slate-500 flex flex-col sm:ml-64 sm:mt-[74px] min-h-[calc(100vh-80px)] pt-[74px] sm:pt-6 p-6 text-black bg-white '
              }
              `
              }
        >
          <Routes>
            <Route path="/" element={<Home AUTH_TOKEN={TOKEN} />} />

            <Route path="/chat" element={<Chat AUTH_TOKEN={TOKEN} />} />
            <Route
              path="/documents"
              element={<ListOfDocument SHOW={"active"} AUTH_TOKEN={TOKEN} />}
            />
            
            <Route
              path="/art"
              element={<ImageGenerators AUTH_TOKEN={TOKEN} />}
            />
            <Route
              path="/recap_builder"
              element={<RecapBuilder AUTH_TOKEN={TOKEN} />}
            />

            <Route
              path="/brand_voice"
              element={<Brandvoice AUTH_TOKEN={TOKEN} />}
            />
          
            <Route
              path="/transcribe-speech"
              element={<VoiceRecognition AUTH_TOKEN={TOKEN} />}
            />

            <Route
              path="/create_new_content"
              element={<CreateNewContent AUTH_TOKEN={TOKEN} />}
            />
            <Route
              path="/help"
              element={<Help AUTH_TOKEN={TOKEN} />}
            />
            <Route
              path="/change-work-space"
              element={<ChangeWorkSpace AUTH_TOKEN={TOKEN} />}
            />
            <Route
              path="/folder_of_user/:folder_id"
              element={<FolderData AUTH_TOKEN={TOKEN} />}
            />


            <Route
              path="/Workflow"
              element={<Workflow AUTH_TOKEN={TOKEN} />}
            />
            

            <Route
              path="/trash"
              element={<ListOfDocument SHOW={"trash"} AUTH_TOKEN={TOKEN} />}
            />

            {/* <Route path="/Template" element={<Template AUTH_TOKEN={TOKEN}/>} /> */}
            <Route
              path="/templates"
              element={<Template AUTH_TOKEN={TOKEN} />}
            />

            <Route path="template" AUTH_TOKEN={TOKEN}>
              <Route index element={<Template AUTH_TOKEN={TOKEN} />} />
              <Route
                path=":template_id"
                element={<SingleTemplate AUTH_TOKEN={TOKEN} />}
              />
            </Route>

            <Route
              path="/first_step"
              element={
                <FirstStep
                  AUTHORIZATION_TOKEN={_TOKEN_FOR_VALIDATION_NAVBAR_}
                />
              }
            />
            <Route
              path="/second_step"
              element={
                <SecondStep
                  AUTHORIZATION_TOKEN={_TOKEN_FOR_VALIDATION_NAVBAR_}
                />
              }
            />
            <Route
              path="/third_step"
              element={
                <ThirdStep
                  AUTHORIZATION_TOKEN={_TOKEN_FOR_VALIDATION_NAVBAR_}
                />
              }
            />

            <Route
              path="/template_data/:document_id"
              element={<EditDocuments AUTH_TOKEN={TOKEN} />}
            />
            <Route
              path="/custome_template/:template_id"
              element={<BuildcustomTemplate AUTH_TOKEN={TOKEN} />}
            />

            <Route path="/*" element={<Home />} />
            <Route path="/Projects" element={<Projects AUTH_TOKEN={TOKEN} />} />

            <Route path="/logout" element={<Logout />} />

            <Route path="/settings/general" element={<Settings AUTH_TOKEN={TOKEN}/>} />
            
            <Route path="/company_registration_form" element={<CompanyRegistrationForm AUTH_TOKEN={TOKEN}/>} />
            

            <Route path="/settings/subscription_plan" element={<Subscription AUTH_TOKEN={TOKEN}/>} />

            <Route
              path="/invitation/:invitation_id"
              element={<AcceptInvitationPage AUTH_TOKEN={TOKEN} />}
            />

          </Routes>
        </main>
          </>
      ) : (
        <Route path="/login" element={<Login />} />
      )}
    </>
  );
};

export default AllRoutes;
