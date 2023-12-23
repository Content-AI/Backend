import { configureStore } from '@reduxjs/toolkit'
import AuthenticationToken from '../features/AuthenticationToken'
import ThreeSteps from '../features/ThreeSteps'
import Fullprofile from '../features/Fullprofile'
import BlurBgNavBar from '../features/BlurBg'
import HideShowNavBarGlobalState from '../features/HideShowNavBarGlobalState'
import LoadingScreen from '../features/LoadingScreen'
import LoadingScreenMessage from '../features/LoadingScreenMessage'
import EditorText from '../features/EditorText'
import CopiedText from '../features/CopiedText'
import LeftTemplateId from '../features/LeftTemplateId'
import LengthOfEditorWord from '../features/LengthOfEditorWord'
import ProjectOrFolderIdChoosen from '../features/ProjectOrFolderIdChoosen'
import DocumentsData from '../features/DocumentsData'
import FolderData from '../features/FolderData'
import RepeatQuestionInChat from '../features/RepeatQuestionInChat'
import Subscriptions from '../features/Subscriptions'
import SubscriptionsData from '../features/SubscriptionsData'
import ListTokenGeneratedByUser from '../features/ListTokenGeneratedByUser'
import WorkspaceId from '../features/WorkspaceId'
import ChosenWorkspaceId from '../features/ChosenWorkspaceId'
import Favorite from '../features/Favorite'
import TriggerSwitchForCallingAPIsOfDocumentDoingWorkFlowAfterGenerate from '../features/TriggerSwitchForCallingAPIsOfDocumentDoingWorkFlowAfterGenerate'

import DarkMode from '../features/DarkMode'

export const store = configureStore({
    reducer: {
        SetAuthenticationToken: AuthenticationToken,
        SetThreeSteps: ThreeSteps,
        SetFullProfile:Fullprofile,
        SetBlurBgNavBar:BlurBgNavBar,
        SetHideShowNavBarGlobalState:HideShowNavBarGlobalState,
        SetLoadingScreen:LoadingScreen,
        SetLoadingScreenMessage:LoadingScreenMessage,
        SetEditorText:EditorText,
        SetCopiedText:CopiedText,
        SetLeftTemplateId:LeftTemplateId,
        SetLengthOfEditorWord:LengthOfEditorWord,
        SetProjectOrFolderIdChoosen:ProjectOrFolderIdChoosen,
        SetDocumentsData:DocumentsData,
        SetFolderData:FolderData,
        SetRepeatQuestionInChat:RepeatQuestionInChat,
        SetSubscriptions:Subscriptions,
        SetSubscriptionsData:SubscriptionsData,
        SetListTokenGeneratedByUser:ListTokenGeneratedByUser,
        SetWorkspaceId:WorkspaceId,
        SetChosenWorkspaceId:ChosenWorkspaceId,
        SetFavorite:Favorite,
        SetTriggerSwitchForCallingAPIsOfDocumentDoingWorkFlowAfterGenerate:TriggerSwitchForCallingAPIsOfDocumentDoingWorkFlowAfterGenerate,
        SetDarkMode:DarkMode,
    }
})

