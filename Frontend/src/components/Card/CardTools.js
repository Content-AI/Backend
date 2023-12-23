import React,{useState,useEffect} from "react";
import { BACKEND_URL } from "../../apis/urls";
import { useNavigate } from "react-router-dom";
import { Premium } from "../pages/ImageGenerator/Premium";

const CardTools = (props) => {

  const navigate = useNavigate()

  return (
    <div className="card flex p-6 min-h-[144px] border border-border rounded-xl hover:bg-slate-100 cursor-pointer transition-all duration-300"
    onClick={()=>{
      navigate(`/template/${props.id}?custom=normal_user`)
    }}
    title={"open "+props.title}
    >
      <div className="icon flex-none w-14 h-14 p-2 bg-blue-700/10 rounded-xl">
        <img src={props.icon} alt={props.title} className="block w-8 h-8" />
      </div>
      <div className="content relative flex-auto pl-4">
        <div className="title flex items-center justify-between gap-2 mb-2">
          <h4 className="text-sm font-bold leading-none">{props.title}</h4>
          {props.isPremium && (
                <Premium/>
          )}
        </div>
        <p className="text-sm">{props.description}</p>
      </div>
    </div>
  );
};

export default CardTools;
