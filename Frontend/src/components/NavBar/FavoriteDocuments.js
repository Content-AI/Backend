import React, { useEffect,useState } from "react";
import {postData,fetchData} from "../../apis/apiService"
import { BACKEND_URL,BACK_END_API_FAV } from "../../apis/urls";
import { useSelector, useDispatch } from "react-redux";
import { _fav_data_ } from "../../features/Favorite";
import { FaTimes } from "react-icons/fa"; // Import required icons

import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const FavoriteDocuments = ({TOKEN}) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [favoriteDocuments, setFavoriteDocuments] = useState();

  const notifyerror = (message) => toast.error(message);
  const notifysuccess = (message) => toast.success(message);


  let Favorite = useSelector(
    (state) => state.SetFavorite.Favorite
  );


  const get_fav_doc = async() =>{
    const resp = await fetchData(BACKEND_URL+BACK_END_API_FAV,TOKEN)
    if(resp.status==200){
        dispatch(_fav_data_(resp.data))
    }
  }

  useEffect(()=>{
    get_fav_doc()
  },[])

  useEffect(()=>{
    setFavoriteDocuments(Favorite)
  },[Favorite])


  const removeFromFavorites = async(documentId) => {
    console.log(documentId)
    const updatedFavorites = favoriteDocuments.filter(
      (document) => document.id !== documentId
    );
    setFavoriteDocuments(updatedFavorites);

    const formData={
        "id":documentId,
        "fav":false
    }
    const resp = await postData(formData,BACKEND_URL + BACK_END_API_FAV,TOKEN)
    if(resp.status==201){
      notifysuccess("Removed from Favorite")
    }else{
      notifyerror("something went wrong")
    }
  };

  return (
    <div className="overflow-y-auto max-h-[120px]">
    
      <div className="grid grid-cols-1">
      {favoriteDocuments &&
        <>
            {favoriteDocuments.map((document) => (
            <div
                key={document.id}
                // font-size: 12px;
                // line-height: 0.25rem;
                // padding: 4px;
                className="dark:bg-dark dark:text-gray-200 p-[2px] ml-[2px] dark:hover:bg-gray-600 hover:bg-slate-200 hover:rounded-md flex items-center justify-between  group relative"
            >

                <div className="text-sm cursor-pointer pl-[3px]"
                onClick={()=>{
                    navigate(`/template_data/${document.id}?template_editing=edit_by_user&template_used=redirect_from_doc_page`)
                }}>{document.title}</div>
                <div className="flex items-center space-x-1 absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    className="text-red-500 hover:text-red-600"
                    onClick={() => removeFromFavorites(document.id)}
                >
                    <FaTimes size={16} />
                </button>
                </div>
            </div>
            ))}
        </>
      }
      </div>

    </div>
  );
};

export default FavoriteDocuments;
