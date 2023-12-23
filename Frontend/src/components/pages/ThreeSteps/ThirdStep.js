import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TopBar from "./TopBar";
import toast, { Toaster } from "react-hot-toast";
import Dots from "../Dots";
import ChoiceButton from "../ChoiceButton";
import StepOptions from "./StepOptions";

import { postData } from "../../../apis/apiService";

import Button from "@mui/material/Button";

import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";

import { _save_token_ } from "../../../features/AuthenticationToken";
import { BACKEND_URL, BACK_API_SURVEY } from "../../../apis/urls";
import { _save_survey_ } from "../../../features/ThreeSteps";
import LoadingPage from "../../LoadingPage";

const ThirdStep = () => {
  let navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const searchParams = new URLSearchParams(location.search);
  const subscription_type = searchParams.get('subscription_type');
  const plan = searchParams.get('plan');
  const invitation_code = searchParams.get('invitation_code');

  


  // console.log(location.state)

  let ACCESS_TOKEN = useSelector(
    (state) => state.SetAuthenticationToken.AuthenticationToken
  );

  const [isSelected, setIsSelected] = useState(false);
  const [data, setData] = useState("");
  const [datatext, setDatatext] = useState("");
  const [showModal, setShowModal] = React.useState(true);
  const [LoadingPageSurvey, setLoadingPageSurvey] = React.useState(false);

  const handleToggle = (e) => {
    setIsSelected(!isSelected);
  };

  const localOptions = [
    "Online Article",
    "Facebook",
    "Google",
    "LinkedIn",
    "Twitter",
    "Tiktok",
    "Word of mouth",
    "Other",
  ];

  function setStateFormVal(val) {
    setData(val);
  }

  function setStateFormText(val) {
    setDatatext(val);
  }

  const send_survey_data = async () => {
    // formData, url,ACCESS_TOKEN
    setLoadingPageSurvey(true)
    const datas = {
      first_answer: location.state.first_answer,
      second_answer: location.state.second_answer,
      third_answer: data,
    };
    const response = await postData(
      datas,
      BACKEND_URL + BACK_API_SURVEY,
      ACCESS_TOKEN
    );
    // console.log(response.data)
    dispatch(_save_survey_(false));
    localStorage.setItem("three_steps", false);
    if(response.status==200){
      if(subscription_type!=null && subscription_type!=undefined && plan!=null && plan!=undefined){
        // navigate(`/subscribe_by_user?subscription_type=${subscription_type}&plan=${plan}`)
        window.location.replace(`/subscribe_by_user?subscription_type=${subscription_type}&plan=${plan}`);
      }else if(invitation_code!=null && invitation_code!=undefined){
        window.location.replace(`/invitation/${invitation_code}&new=user`);
      }else{
        window.location.replace(`/`);
        // navigate("/");
      }
    }
    // setLoadingPageSurvey(false)
  };

  useEffect(() => {
    // console.log(data)
    // console.log(datatext)
    setDatatext("");
  }, [data]);

  return (
    <>
    {LoadingPageSurvey
    ?
      <LoadingPage/>
    :
    <>
      {showModal ? (
        <>
          <div className="z-50 fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            {/*content*/}
            {/*header*/}
            <div className="w-full max-w-[727px] font-helv px-10 py-[52px] border border-[#CFD0D5] rounded">
              <TopBar />
              <div className="my-7">
                <Dots steps="third" />
              </div>
              <h3 className="text-sm font-bold mb-5 text-black dark:text-black">
                What do you need to make?
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <StepOptions
                  data={localOptions}
                  activeData={data}
                  toggleData={setStateFormVal}
                  activeText={datatext}
                  toggleText={setStateFormText}
                />
              </div>

              <div className="flex justify-between mt-5">
                <button
                  className="flex items-center gap-3 font-normal text-blue text-sm"
                  onClick={() => {
                    if(subscription_type!=null && subscription_type!=undefined && plan!=null && plan!=undefined){
                    navigate(`/second_step?survey_data_second=by-for-user-clarification&subscription_type=${subscription_type}&plan=${plan}`)
                      
                    }else if(invitation_code!=null && invitation_code!=undefined){
                      navigate(`/second_step?survey_data_second=by-for-user-clarification&invitation_code=${invitation_code}`)
                    }else{
                    navigate("/second_step?survey_data_second=by-for-user-clarification");
                    }
                  }}
                >
                  <span className="w-5 h-5">
                    <svg
                      width={20}
                      height={20}
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-full"
                    >
                      <path
                        d="M12.9417 15.8077C12.9998 15.8657 13.0458 15.9347 13.0773 16.0105C13.1087 16.0864 13.1249 16.1677 13.1249 16.2499C13.1249 16.332 13.1087 16.4133 13.0773 16.4892C13.0458 16.565 12.9998 16.634 12.9417 16.692C12.8836 16.7501 12.8147 16.7962 12.7388 16.8276C12.663 16.859 12.5816 16.8752 12.4995 16.8752C12.4174 16.8752 12.3361 16.859 12.2602 16.8276C12.1843 16.7962 12.1154 16.7501 12.0573 16.692L5.80733 10.442C5.74922 10.384 5.70312 10.3151 5.67167 10.2392C5.64021 10.1633 5.62402 10.082 5.62402 9.99986C5.62402 9.91772 5.64021 9.8364 5.67167 9.76052C5.70312 9.68465 5.74922 9.61572 5.80733 9.55767L12.0573 3.30767C12.1746 3.1904 12.3337 3.12451 12.4995 3.12451C12.6654 3.12451 12.8244 3.1904 12.9417 3.30767C13.059 3.42495 13.1249 3.58401 13.1249 3.74986C13.1249 3.91571 13.059 4.07477 12.9417 4.19205L7.13311 9.99986L12.9417 15.8077Z"
                        fill="#343330"
                      />
                    </svg>
                  </span>
                  Go Back
                </button>

                <Button
                  variant="contained"
                  className="flex items-center justify-center !font-bold !px-8 !py-3 !bg-blue/50"
                  sx={{ textTransform: "none" }}
                  onClick={() => {
                    send_survey_data();
                  }}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-white"></div>
        </>
      ) : null}
      </>
    }
      <Toaster />
    </>
  );
};

export default ThirdStep;
