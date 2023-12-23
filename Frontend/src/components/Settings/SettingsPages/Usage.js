import React, { useEffect, useState } from 'react'
import Settings from '../Settings'
import { useSelector, useDispatch } from "react-redux";
import Table from './Table'
import { BACKEND_URL,BACK_END_API_TOKEN_GENERATED,BACK_END_API_TEAM_TEMPLATE_USER,BACK_END_API_SINGLE_TEMPLATE_USE,BACK_END_API_SINGLE_TOKEN_GENERATED,BACK_END_API_SINGLE_TEAM_TOKEN_GENERATED,BACK_END_API_TEAM_TOKEN_GENERATED, BACK_END_API_COUNT_CUSTOM_TEMPLATE } from '../../../apis/urls';

import TooltipInfo from '../../Icons/TooltipInfo';
import CustomeGraph from './Graph/CustomeGraph';
import './Usage.css'

import {fetchData} from "../../../apis/apiService"

const Usage = (props) => {

  const [userToken,setuserToken]=useState(null)
  const [userTotalToken,setuserTotalToken]=useState(null)

  const [pointSelectedPayload, setPointSelectedPayload] = useState(null);
  
  const [template_used, settemplate_used] = useState(null);
  
  const [template_use_token_used_by_users, settemplate_use_token_used_by_users] = useState(null);

  
  const [chartData, setChartData] = useState(null);

  let TOKEN = useSelector(
    (state) => state.SetAuthenticationToken.AuthenticationToken
  );


  let list_token_generated_by_user = useSelector(
    (state) => state.SetListTokenGeneratedByUser.ListTokenGeneratedByUser
  );


  useEffect(() => {
    if (list_token_generated_by_user != null) {
      setChartData(list_token_generated_by_user.data)
    }
  }, [])


  // ==========pending and team member list============
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('Team Member');
  const [selectedButton, setselectedButton] = useState(false)

  const menuItems = ['Team Member', 'Pending Members'];

  const get_the_individual_data = async()=>{
    setuserToken(null)
    const resp = await fetchData(BACKEND_URL+BACK_END_API_TOKEN_GENERATED,TOKEN)
    if(resp.status==200){
        setuserToken(resp.data.data)
        setuserTotalToken(resp.data.total)
      }
    }
    const get_the_team_data = async()=>{
      setuserToken(null)
      const resp = await fetchData(BACKEND_URL+BACK_END_API_TEAM_TOKEN_GENERATED,TOKEN)
      if(resp.status==200){
        setuserToken(resp.data.data)
        setuserTotalToken(resp.data.total)
        // console.log("TEAM : ",resp.data.data)
    }
  }
    const get_the_team_template_used_team = async()=>{
      setuserToken(null)
      const resp = await fetchData(BACKEND_URL+BACK_END_API_TEAM_TEMPLATE_USER,TOKEN)
      if(resp.status==200){
        settemplate_used(resp.data.total_count)
    }
  }
    const get_the_single_template_used_team = async()=>{
      setuserToken(null)
      const resp = await fetchData(BACKEND_URL+BACK_END_API_SINGLE_TEMPLATE_USE,TOKEN)
      if(resp.status==200){
        settemplate_used(resp.data.total)
    }
  }
    const get_the_list_users_token_and_template_used_by_team = async()=>{
      setuserToken(null)
      const resp = await fetchData(BACKEND_URL+BACK_END_API_SINGLE_TEAM_TOKEN_GENERATED,TOKEN)
      if(resp.status==200){
        settemplate_use_token_used_by_users(resp.data)
    }
  }
    const get_single_list_users_token_and_template_used_by_team = async()=>{
      setuserToken(null)
      const resp = await fetchData(BACKEND_URL+BACK_END_API_SINGLE_TOKEN_GENERATED,TOKEN)
      if(resp.status==200){
        settemplate_use_token_used_by_users(resp.data)
    }
  }




    useEffect(()=>{
      if(TOKEN!=null){
          get_the_team_data()
          get_the_team_template_used_team()
          get_the_list_users_token_and_template_used_by_team()
      }
  },[TOKEN])




  return (
    <>
      {chartData &&

        <div className="ml-[50px] mr-[50px] sm:ml-[100px] mt-10 ">
        {/* <div className="ml-[50px] mr-[50px] sm:ml-[100px] mt-10 scrollable-div"> */}
        <div className="max-w-4xl">
          <div className="justify-flex-start mb-4 flex items-center">
            <h2 className="dark:text-white mb-1 pb-1 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">Usage</h2>
          </div>

            {/* ========select options for individual and teams=======+ */}
            <div className="relative flex  w-full ">
              <div>

                <button
                  onClick={() => {
                    setselectedButton(false)
                    get_the_team_data()
                    get_the_team_template_used_team()
                    get_the_list_users_token_and_template_used_by_team()
                  }}
                  type="button"
                  className={selectedButton 
                  ? " justify-center dark:bg-gray-800 dark:text-gray-300  rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 " 
                  : "justify-center dark:bg-gray-800 dark:text-gray-300 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-slate-100 text-sm font-medium text-gray-700  "
                  }
                >
                  Team Member
                </button>
              </div>
              <div className='ml-2'>
                <button
                  onClick={() => {
                    setselectedButton(true)
                    get_the_individual_data()
                    get_the_single_template_used_team()
                    get_single_list_users_token_and_template_used_by_team()
                  }}
                  type="button"
                  className={selectedButton 
                  ? " justify-center dark:bg-gray-800 dark:text-gray-300 rounded-md border border-gray-300 shadow-sm px-4 py-2 text-sm bg-slate-100 font-medium text-gray-700  " 
                  : "justify-center dark:bg-gray-800 dark:text-gray-300  rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  }
                >
                  Individual
                </button>
              </div>
            </div>

            {/* ========select options for individual and teams=======+ */}
            <div className="mb-6">
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">


                <div title="info about creation" className="dark:bg-gray-800 dark:border-slate-600 dark:text-gray-300 rounded-lg bg-white px-4 py-5 ring-1 ring-gray-200 sm:p-6">
                  <div className="flex items-center text-sm font-medium text-gray-500">
                    <div className='dark:text-gray-300'>Words generated</div>
                    <div>

                      <TooltipInfo
                        text="Usage of Token by User"
                      />

                    </div>
                  </div>

                  <div className="dark:text-gray-300 my-1 text-3xl font-semibold text-gray-900">
                    {userTotalToken && userTotalToken}
                  </div>

                </div>


                <div title="info about creation" className="dark:bg-gray-800 dark:border-slate-600 dark:text-gray-300 rounded-lg bg-white px-4 py-5 ring-1 ring-gray-200 sm:p-6">
                  <div className="flex items-center text-sm font-medium text-gray-500">
                    <div className='dark:text-gray-300'>Templates</div>
                      <div>
                        <TooltipInfo
                          text="Template Used"
                        />
                      </div>
                    </div>
                    <div className="dark:text-gray-300 my-1 text-3xl font-semibold text-gray-900">
                    {template_used && template_used}
                    </div>
                </div>
              </div>
            </div>
            {/* =========chart============ */}

            <CustomeGraph AUTH_TOKEN={props.AUTH_TOKEN} userToken={userToken} />

            {/* =========chart============ */}

            {template_use_token_used_by_users &&
              <Table Data={template_use_token_used_by_users} total_data={list_token_generated_by_user}/>
            }

          </div>
        </div>


      }

    </>
  )
}

export default Usage