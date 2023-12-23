import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import { FaArrowLeft } from "react-icons/fa";


const DarkModeTemplate = () => {

    let DarkMode = useSelector((state)=>state.SetDarkMode.DarkMode)

    const render_button = () =>{
            if(DarkMode){
                return (
                    <FaArrowLeft />
                )
            }else{
                return (
                    <FaArrowLeft />
                )
  
      }}

  return (
        render_button()
  )
}

export default DarkModeTemplate