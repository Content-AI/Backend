import React, { useState,useEffect } from "react";
import Settings from '../Settings'

import { styled } from "@mui/material/styles";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import toast, { Toaster } from "react-hot-toast";

import { setDocumentTitle } from '../../NavBar/DynamicTitle';

import ApiKeyInput from "../../pages/Template/ApiKeyInput";

const ISwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5
      }
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff"
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600]
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3
    }
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500
    })
  }
}));


const Integrations = () => {

  const [isCheckedSEO, setIsCheckedSEO] = useState(false);
  const [isCheckedPlagarism,setisCheckedPlagarism] = useState(false);
  const [isCheckedLanguage,setisCheckedLanguage] = useState(false);

  useEffect(() => {
    setDocumentTitle("Integrations Page");
}, []);

  const handleCheckboxChangeSEO = (event) => {
    setIsCheckedSEO(event.target.checked);
    notifypopup("comming soon")
  };
  const handleCheckboxChangePlagarism = (event) => {
    setisCheckedPlagarism(event.target.checked);
    notifypopup("comming soon")

  };
  const handleCheckboxChangeLanguage = (event) => {
    setisCheckedLanguage(event.target.checked);
  };


  const notifyerror = (message) => toast.error(message);
  const notifysucces = (message) => toast.success(message);

  const notifypopup= (message) => toast.success(message, {
    style: {
      padding: '10px',
      color: '#713200',
    },
    iconTheme: {
      primary: '#713200',
      secondary: '#FFFAEE',
    },
  });


  return (
    <>
      {/* <Settings/> */}
      <div className='ml-[50px] mr-[50px] sm:ml-[100px] mt-10'>

      <div className="mx-auto px-4 sm:px-6 max-w-4xl">
          <div className="flex items-center mb-4 justify-between">
              <h2 className="dark:text-gray-300  text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate mb-1 pb-1">Integrations</h2>
          </div>

          <section className="p-6 mb-3 dark:border dark:bg-gray-800 dark:text-gray-200 dark:border-slate-500  bg-slate-100 shadow-sm rounded">
                <span className="flex flex-col flex-grow mr-2">
                </span>
                  <ApiKeyInput/>               
          </section>

          <section className="dark:bg-gray-800 dark:text-gray-200 dark:border dark:border-slate-500 p-6 mb-3 bg-slate-100 shadow-sm rounded">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 items-center justify-between w-full">
                <span className="flex flex-col flex-grow mr-2">
                    <span className="dark:text-gray-300 flex items-center mb-1 text-lg font-medium text-gray-900">
                    SEO Wave
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-300" >
                    "Incorporate an "SEO" section into your document editor, offering robust SEO keyword research and metrics capabilities.
                    </span>
                </span>
                {/* ======swip===== */}
                <FormGroup>
                <FormControlLabel
                  control={
                    <ISwitch
                      sx={{ m: 1 }}
                      checked={isCheckedSEO}
                      onChange={handleCheckboxChangeSEO}
                    />
                  }
                  label=""
                />
              </FormGroup>
                
                {/* ======swip===== */}
              </div>
          </section>
          <section className="p-6 mb-3 dark:bg-gray-800 dark:text-gray-200 dark:border-slate-500 dark:border bg-slate-100 shadow-sm rounded">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 items-center justify-between w-full">
                <span className="flex flex-col flex-grow mr-2">
                    <span className="flex items-center mb-1 text-lg font-medium text-gray-900 dark:text-gray-300" >
                    Originality Check
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-300" >
                    Utilize a text scanning feature to check for content originality, safeguarding your reputation and search engine rankings.
                    </span>
                </span>
                <span>
                                  {/* ======swip===== */}
                                    <FormGroup>
                                    <FormControlLabel
                                      control={
                                        <ISwitch
                                          sx={{ m: 1 }}
                                          checked={isCheckedPlagarism}
                                          onChange={handleCheckboxChangePlagarism}
                                        />
                                      }
                                      label=""
                                    />
                                  </FormGroup>
                                    
                                    {/* ======swip===== */}
                </span>
              </div>
          </section>

          
        </div>
        </div>
    </>
  )
}

export default Integrations