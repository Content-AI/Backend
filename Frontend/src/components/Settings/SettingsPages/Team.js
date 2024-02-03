import React, { useEffect, useRef, useState } from 'react';
import Settings from '../Settings'
import Pagination from './Pagination';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { BACKEND_URL,BACK_END_API_TEAM_LIMIT, BACK_END_API_REMOVE_INVITE_WORKSHOP, BACK_END_API_CHANGE_PERMISSION, BACK_END_API_PENDING_INVITE_WORKSHOP, BACK_END_API_REMOVE_USER, BACK_END_API_INVITE_GENERATE_LINK, BACK_END_API_INVITE_WORKSHOP, BACK_END_API_CHECK_ADMIN, BACK_END_API_WORKSPACE_USERS_LIST } from '../../../apis/urls'
import { fetchData, postData } from '../../../apis/apiService'
import { Transition } from "@headlessui/react";
import LoadingPage from '../../LoadingPage';
import ProgressBar from "./ProgressBar";
import DropDowIcon from '../../Icons/DropDowIcon';
import TeamInviteDisable from '../../Icons/TeamInviteDisable';
import InviteTeamMember from '../../Icons/InviteTeamMember';
import SearchIcon from '../../Icons/SearchIcon';
import CopyIcon from '../../Icons/CopyIcon';
import DeleteIcon from '../../Icons/DeleteIcon';
import Upgradenow from './Modal/Upgradenow';
import AddMoreSeat from './Modal/AddMoreSeat';
import { NavIcons, SealCheck } from "../../Icons";


import { setDocumentTitle } from '../../NavBar/DynamicTitle';


const Team = () => {
  const navigate = useNavigate()
  const divRef = useRef(null);

  const [progressValue, setProgressValue] = useState(2);

  useEffect(() => {
    setDocumentTitle("Team Page");
}, []);

  const notifyerror = (message) => toast.error(message);
  const notifysucces = (message) => toast.success(message);

  const notifycopy = (message) => toast.success(message, {
    style: {
      padding: '10px',
      color: '#713200',
    },
    iconTheme: {
      primary: '#713200',
      secondary: '#FFFAEE',
    },
  });

  const [loadingpage, setloadingpage] = useState(false)

  const [popupinvitemodal, setpopupinvitemodal] = useState(false)

  const [workspacelist, setworkspacelist] = useState(null)
  const [invite_check, setinvite_check] = useState(false)
  const [initial_invitation_link, set_initial_invitation_link] = useState(null)

  const [pending_invitation, set_pending_invitation] = useState(null)

  let WorkspaceId = useSelector(
    (state) => state.SetWorkspaceId.WorkspaceId
  );

  let ChosenWorkspaceId = useSelector(
    (state) => state.SetChosenWorkspaceId.ChosenWorkspaceId
  );
  let TOKEN = useSelector(
    (state) => state.SetAuthenticationToken.AuthenticationToken
  );


  let PROFILE_DATA = useSelector(
    (state) => state.SetFullProfile.Fullprofile
  );
  let Subscriptions = useSelector(
    (state) => state.SetSubscriptions.Subscriptions
  );
  let SubscriptionsData = useSelector(
    (state) => state.SetSubscriptionsData.SubscriptionsData
  );

  useEffect(() => {
    if(SubscriptionsData!=null){
      // console.log('SubscriptionsData : ', SubscriptionsData.user.subscription_type)
    }
  }, [])


  const get_workshop_user_list = async () => {
    const resp = await fetchData(BACKEND_URL + BACK_END_API_WORKSPACE_USERS_LIST + ChosenWorkspaceId["Workspace_Id"], TOKEN)
    if (resp.status = 200) {
      setworkspacelist(resp.data)
    }
    const resp_pending_invitation = await fetchData(BACKEND_URL + BACK_END_API_PENDING_INVITE_WORKSHOP + ChosenWorkspaceId["Workspace_Id"], TOKEN)
    if (resp_pending_invitation.status = 200) {
      set_pending_invitation(resp_pending_invitation.data)
    }
    const resp_check = await fetchData(BACKEND_URL + BACK_END_API_CHECK_ADMIN + "?workspace_id=" + ChosenWorkspaceId["Workspace_Id"], TOKEN)
    if (resp_check.status == 200) {
      setinvite_check(true)
    } else {
      setinvite_check(false)
    }
  }

  useEffect(() => {
    // setworkspacelist(WorkspaceId)
    if (ChosenWorkspaceId != null) {
      get_workshop_user_list()
    }
  }, [])


  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 2; // Replace this with the total number of pages

  // Function to handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // You can perform any data fetching or updating logic here
  };

  const invite_modal = () => {
    setpopupinvitemodal(true)
    // console.log("show invitation modal")
  }

  // ================email====================
  const [email, setEmail] = useState('');
  const [emails, setEmails] = useState([]);
  const [sendinginvitation, setsendinginvitation] = useState(false);
  const [error, setError] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError('');
  };

  const handleEmailKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (isValidEmail(email)) {
        setEmails([...emails, email.trim()]);
        setEmail('');
        setError('');
      } else {
        notifyerror("email must be valid")
        setError('Invalid email format');
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

  const send_invitation = async () => {
    setsendinginvitation(true)
    const formData = {
      email: emails,
      workspace_id: ChosenWorkspaceId.Workspace_Id
    }

    const resp = await postData(formData, BACKEND_URL + BACK_END_API_INVITE_WORKSHOP, TOKEN)

    if (resp.status == 200) {
      notifysucces("Users are invited")
      setEmail('')
      setEmails([])
    } else {
      try{
        if(resp.response.data.message){
            notifyerror(resp.response.data.message)
        }else{
          notifyerror("Invitation failed")
        }
      }catch(e){
        notifyerror("Invitation failed")
      }
    }
    setsendinginvitation(false)

  }


  // =========Generate new link for invitation=============

  const get_the_initial_invitation_generate_link = async () => {
    const resp = await fetchData(BACKEND_URL + BACK_END_API_INVITE_GENERATE_LINK + "?new=no&workspace_id=" + ChosenWorkspaceId["Workspace_Id"], TOKEN)
    if (resp.status == 200) {
      set_initial_invitation_link(resp.data)
    }
  }
  const generate_invitation_generate_link = async () => {
    const resp = await fetchData(BACKEND_URL + BACK_END_API_INVITE_GENERATE_LINK + "?new=yes&workspace_id=" + ChosenWorkspaceId["Workspace_Id"], TOKEN)
    if (resp.status == 200) {
      set_initial_invitation_link(resp.data)
    }
  }

  const delete_link = async () => {
    const resp = await fetchData(BACKEND_URL + BACK_END_API_INVITE_GENERATE_LINK + "?new=delete&workspace_id=" + ChosenWorkspaceId["Workspace_Id"], TOKEN)
    set_initial_invitation_link(null)
  }



  useEffect(() => {
    if (ChosenWorkspaceId != null) {
      get_the_initial_invitation_generate_link()
    }
  }, [])



  // ============copy link==============
  const inputRef = useRef(null);

  const handleCopyClick = () => {
    inputRef.current.select();
    notifycopy("Link Copied")
    document.execCommand('copy');
  };



  // =========change the permission of user===================
  const update_permission = async (formData) => {
    setloadingpage(true)
    const resp = await postData(formData, BACKEND_URL + BACK_END_API_CHANGE_PERMISSION + ChosenWorkspaceId["Workspace_Id"], TOKEN)
    if (resp.status == 200) {
      notifysucces("permission updated")
      get_workshop_user_list()
      setloadingpage(false)

    } else {
      notifyerror("something went wrong")
      setloadingpage(false)
    }
  }
  const remove_user = async (formData) => {
    setloadingpage(true)
    const resp = await postData(formData, BACKEND_URL + BACK_END_API_REMOVE_USER + ChosenWorkspaceId["Workspace_Id"], TOKEN)
    if (resp.status == 200) {
      notifysucces("user remove")
      get_workshop_user_list()
      setloadingpage(false)

    } else {
      notifyerror("something went wrong")
      setloadingpage(false)
    }
  }

  const SelectField = ({ options, onSelect, defaultValue, role_of_user, data_index }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(defaultValue || '');

    useEffect(() => {
      if (defaultValue) {
        setSelectedOption(defaultValue);
      }
    }, [defaultValue]);

    const handleOptionSelect = (value) => {
      setSelectedOption(value);
      onSelect(value);
      setIsOpen(false);
    };


    return (
      <div className="">

        <div>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 group flex items-center px-4 py-2 text-sm focus:outline-none hover:bg-gray-100"
          >

            {selectedOption ? (
              selectedOption
            ) : (
              <span className="text-gray-400">{role_of_user}</span>
            )}
            <DropDowIcon />
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
          <div className="origin-top-left absolute z-10 mt-2 w-auto rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">




            {options.map((option, index) => (
              <div key={option.value} role="none">
                <button
                  onClick={() => {
                    handleOptionSelect(option.value);
                    const formData = {}
                    if (option.value == "Admin") {
                      formData["id"] = workspacelist[data_index]["id"]
                      formData["perm"] = true
                      formData["email"] = workspacelist[data_index].team_member_user.email
                    } else {
                      formData["id"] = workspacelist[data_index]["id"]
                      formData["perm"] = false
                      formData["email"] = workspacelist[data_index].team_member_user.email
                    }

                    update_permission(formData)

                  }}
                  className={`${selectedOption === option.value ? 'bg-gray-100' : ''
                    } text-gray-700 w-full group flex items-center px-4 py-2 text-sm focus:outline-none hover:bg-gray-100`}
                  role="menuitem"
                  tabIndex="-1"
                >
                  {option.label}

                </button>
              </div>
            ))}



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


  // ==========pending and team member list============
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('Team Member');

  const menuItems = ['Team Member', 'Pending Members'];

  const handleMenuItemSelect = (item) => {
    setSelectedItem(item);
    setIsDropdownOpen(false);
  };

  const get_invitation_member = async (id) => {

    const resp_pending_invitation = await fetchData(BACKEND_URL + BACK_END_API_PENDING_INVITE_WORKSHOP + ChosenWorkspaceId["Workspace_Id"], TOKEN)
    if (resp_pending_invitation.status = 200) {
      set_pending_invitation(resp_pending_invitation.data)
    }
  }

  const remove_invitation_member = async (id) => {
    setloadingpage(true)
    const resp = await fetchData(BACKEND_URL + BACK_END_API_REMOVE_INVITE_WORKSHOP + id, TOKEN)
    if (resp.status == 200) {
      notifysucces("Invitation removed")
      get_invitation_member()
      setloadingpage(false)

    } else {
      notifyerror("something went wrong")
      setloadingpage(false)
    }
  }




  // ======= Team member limit========
  const [team_limit,set_team_limit]=useState(0)
  const [total_limit_check,set_total_limit_check]=useState(0)
  
  const get_the_team_limit = async()=>{
    const resp = await fetchData(BACKEND_URL+BACK_END_API_TEAM_LIMIT,TOKEN)
      if(resp.status==200){
        set_team_limit(parseInt(resp.data.data, 10))
      }else{}
    }
    
    useEffect(()=>{
      set_total_limit_check(team_limit)
    },[team_limit])

    useEffect(()=>{
      get_the_team_limit()
    },[])


    // useEffect(()=>{
    //   if(workspacelist!=null){
    //     console.log(workspacelist["length"])
    //     console.log(total_limit_check)
    //     console.log(workspacelist["length"] > total_limit_check)
    //   }
    // },[])


  return (
    <>
      {/* <Settings /> */}

      {loadingpage
        ?
        <LoadingPage />
        :
        <>
        <div className="px-4 sm:px-6 ml-4 sm:ml-20 mr-4 sm:mr-20 mt-10">
  <div className="dark:text-white mb-4 flex items-center justify-between">
    <h2 className="mb-1 pb-1 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">Team</h2>
  </div>
  <div className="flex flex-col">
    <span className="mb-3"></span>
    <div className="mb-6 flex flex-row content-start justify-between gap-6">
      <div className="flex-grow flex flex-col gap-2">
        {SubscriptionsData && (
          <>
            {SubscriptionsData.user.plan === "starter" ? (
              <>
                <div className="container mt-3">
                  <ProgressBar value={1} maxValue={1} />
                  <span className="font-bold">
                    Out of 1 member.
                    <p>1 team member already exists.</p>
                  </span>
                </div>
                <div className="mt-4 md:mt-0 break-words bg-red-400 text-black p-2 w-full shadow-lg rounded-md">
                  <span className="font-semibold">
                    For inviting team member. Need to be a premium user?
                    <button
                      className="font-semibold underline underline-offset-2 cursor-pointer"
                      onClick={() => {
                        navigate("/settings/subscription_plan");
                      }}
                    >
                      Upgrade now
                    </button>
                  </span>
                </div>
              </>
            ) : (
              <>
                {SubscriptionsData && (
                  <>
                    {/* Your existing code for different subscription scenarios */}
                    {SubscriptionsData.user.status === "trial" && SubscriptionsData.user.plan === "starter" && SubscriptionsData.user.subscription_type === "monthly" || SubscriptionsData.user.status === "trial" && SubscriptionsData.user.plan === "starter" && SubscriptionsData.user.subscription_type === "annually" ? (
                      <>
                        <div className="container mt-3">
                          <span className="font-bold">
                            1 Team member.
                          </span>
                        </div>
                        <TeamInviteDisable />
                        <div>
                          <span>
                            Need more seats?
                            <AddMoreSeat subscription_data={SubscriptionsData} TOKEN={TOKEN} />
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        {workspacelist && (
                          <>
                            {Subscriptions.status === "trial" ? (
                              <>
                                <div className="container mt-3">
                                  <ProgressBar value={1} maxValue={1} />
                                  <span className="font-bold">
                                    Out of {team_limit + 1} member.
                                    <p>
                                      {workspacelist && workspacelist[0]["member_no"] + " "}
                                      team member already exists.
                                    </p>
                                  </span>
                                </div>
                              </>
                            ) : (
                              <div className="container mt-3">
                                <ProgressBar value={workspacelist[0]["member_no"]} maxValue={team_limit} />
                                <span className="font-bold">
                                  Out of {team_limit} member.
                                  <p>
                                    {workspacelist && workspacelist[0]["member_no"] + " "}
                                    team member already exists.
                                  </p>
                                </span>
                              </div>
                            )}
                          </>
                        )}
                        {Subscriptions && (
                          <>
                            {/* Your existing code for different subscription scenarios */}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
    <div>
      <div className="dark:bg-gray-800 dark:text-gray-300 relative inline-block text-left w-full mt-4 mb-4 sm:w-48">
        <div className='dark:bg-gray-800 dark:text-gray-300'>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            type="button"
            className="dark:bg-gray-800 dark:text-gray-300 inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {selectedItem}
            <DropDowIcon />
          </button>
        </div>
        {isDropdownOpen && (
          <div className="dark:bg-gray-800 dark:text-gray-300 origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              {menuItems.map((item, index) => (
                <button
                  key={item}
                  onClick={() => handleMenuItemSelect(item)}
                  className="dark:bg-gray-800 dark:text-gray-300 block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    <div className="mb-10 ring-1 ring-gray-200 md:rounded-lg overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-slate-200">
          <tr>
            <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold uppercase text-gray-700">
              Member
            </th>
            {selectedItem === "Team Member" ? (
              <>
                <th scope="col" className="text-left text-xs font-semibold uppercase text-gray-700">
                  Role
                </th>
                <th scope="col" className="text-left text-xs font-semibold uppercase text-gray-700">
                  Joined
                </th>
              </>
            ) : (
              <th scope="col" className="text-left text-xs font-semibold uppercase text-gray-700">
                Invite at
              </th>
            )}
            <th scope="col" className="text-left text-xs font-semibold uppercase text-gray-700">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-slate-100">
          {/* Your existing code for table rows */}
          {workspacelist && (
            <>
              {ChosenWorkspaceId["admin_or_not"] === true ? (
                <>
                  {selectedItem === "Team Member" ? (
                    <>
                      {workspacelist.map((data, index) => (
                        <tr key={index}>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img
                                  className='flex h-10 w-10 items-center justify-center rounded-full text-base font-bold text-white bg-slate-400'
                                  src="https://uffiafilestorage.s3.amazonaws.com/frontend-images/default.png"
                                />
                              </div>
                              <div className="ml-4 truncate">
                                <div className="truncate font-medium leading-5 text-gray-900">
                                  {data["team_member_user"]["first_name"]}
                                </div>
                                <div className="truncate text-sm leading-5 text-gray-500">
                                  {data["team_member_user"]["email"]}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className=" sm:table-cell">
                            {PROFILE_DATA.email === data["team_member_user"]["email"] ? (
                              <>
                                <button className="text-gray-700 group flex items-center px-4 py-2 text-sm focus:outline-none hover:bg-gray-100">
                                  Admin
                                </button>
                              </>
                            ) : (
                              <>
                                <SelectField
                                  options={[
                                    { label: 'Admin', value: 'Admin' },
                                    { label: 'Member', value: 'Member' },
                                  ]}
                                  defaultValue={selectedRoles[index]}
                                  onSelect={(value) => handleSelectData(index, value)}
                                  role_of_user={workspacelist[index]["admin_or_not"] ? "Admin" : "Member"}
                                  data_index={index}
                                />
                              </>
                            )}
                          </td>
                          <td className=" sm:table-cell">
                            {data["team_member_user"]["created_at"]}
                          </td>
                          <td className=" sm:table-cell text-blue-500">
                            {PROFILE_DATA.email === data["team_member_user"]["email"] ? null : (
                              <>
                                {ChosenWorkspaceId["admin_or_not"] === true ? (
                                  <>
                                    <button
                                      onClick={() => {
                                        const formData = {};
                                        formData["id"] = data.id;
                                        remove_user(formData);
                                      }}
                                    >
                                      Remove
                                    </button>
                                  </>
                                ) : null}
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <>
                      {pending_invitation.map((data, index) => {
                        return (
                          <tr key={index}>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  <img
                                    className='flex h-10 w-10 items-center justify-center rounded-full text-base font-bold text-white bg-slate-400'
                                    src="/default.png"
                                  />
                                </div>
                                <div className="ml-4 truncate">
                                  <div className="truncate font-medium leading-5 text-gray-900"></div>
                                  <div className="truncate text-sm leading-5 text-gray-500">{data["email"]}</div>
                                </div>
                              </div>
                            </td>
                            <td className="hidden sm:table-cell">{data["created_at"]}</td>
                            <td className="hidden sm:table-cell text-blue-500">
                              {ChosenWorkspaceId["admin_or_not"] === true ? (
                                <>
                                  <button
                                    onClick={() => {
                                      remove_invitation_member(data.id);
                                    }}
                                  >
                                    Remove
                                  </button>
                                </>
                              ) : null}
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  )}
                </>
              ) : (
                <>
                  {workspacelist.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className='flex h-10 w-10 items-center justify-center rounded-full text-base font-bold text-white bg-slate-400'
                                src="https://uffiafilestorage.s3.amazonaws.com/frontend-images/default.png"
                              />
                            </div>
                            <div className="ml-4 truncate">
                              <div className="truncate font-medium leading-5 text-gray-900">
                                {data["team_member_user"]["first_name"]}
                              </div>
                              <div className="truncate text-sm leading-5 text-gray-500">{data["team_member_user"]["email"]}</div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell">
                          {data.admin_or_not ? "Admin" : "Member"}
                        </td>
                        <td className="hidden sm:table-cell">{data["team_member_user"]["created_at"]}</td>
                        <td className="hidden sm:table-cell text-blue-500"></td>
                      </tr>
                    );
                  })}
                </>
              )}
            </>
          )}
        </tbody>
      </table>
    </div>
  </div>
</div>

         
        </>
      }




      {/* =========invite popup modal start from here============ */}
      {popupinvitemodal
        ?
        <>
          <div className="fixed inset-0 z-40 overflow-y-auto" id="headlessui-dialog-:r27:" role="dialog" aria-modal="true" data-headlessui-state="open">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-50 opacity-100" id="headlessui-dialog-overlay-:r28:" aria-hidden="true" data-headlessui-state="open"></div>
              <div className="relative h-full bg-white text-gray-900 rounded-md shadow-xl align-top sm:align-middle w-full sm:w-[416px] md:w-[640px] opacity-100 translate-y-0 sm:scale-100">
                <div className="flex flex-col p-6">
                  <div className="dark:bg-gray-800 dark:text-gray-200 dark:border-slate-500 -m-6 divide-y divide-gray-200">
                    <div className=" p-6 space-y-4">
                      <div className="space-y-1">
                        <h1 className="dark:text-white mb-2 text-lg font-semibold text-gray-900">
                          Select a Workspace
                        </h1>
                        <div className="flex">
                          <h1 className='text-[20px]'>
                            Invite a new member via E-mail or Link
                          </h1>
                        </div>
                        {/* ================Input email=================== */}
                        <div>
                          <div>
                            {emails.map((enteredEmail, index) => (
                              <span key={index} className="dark:text-black bg-gray-300 p-1 m-1 rounded">
                                {enteredEmail}
                                <button
                                  className="ml-3 dark:text-black font-bold text-[12px]"
                                  onClick={() => handleRemoveEmail(index)}
                                >
                                  X
                                </button>
                              </span>
                            ))}
                          </div>
                          <input
                            type="email"
                            placeholder="Enter email ( press enter to add email )"
                            value={email}
                            onChange={handleEmailChange}
                            onKeyDown={handleEmailKeyDown}
                            className="dark:text-black border border-gray-300 p-2 rounded mt-2 w-full"
                          />
                        </div>
                        {emails &&
                          <>
                            {emails.length > 0
                              ?
                              <>
                                {sendinginvitation
                                  ?
                                  <div className='mt-4 mb-4'>
                                    <button className="bg-gray-400  text-white font-bold py-2 px-4 rounded-lg w-[200px]">
                                      Sending Invitation
                                    </button>
                                  </div>
                                  :
                                  <div className='mt-4 mb-4'>

                                    <button className="bg-[#334977] text-white font-bold py-2 px-4 rounded-lg w-[200px]"
                                      onClick={() => {
                                        send_invitation()
                                      }}>
                                      Send invite
                                    </button>
                                  </div>
                                }
                              </>
                              :
                              <div className='mt-4 mb-4'>
                                <button className="bg-gray-400 text-white font-bold py-2 px-4 rounded-lg w-[200px]"
                                  disabled>
                                  Send invite
                                </button>
                              </div>
                            }
                          </>
                        }
                        {/* ================Input email=========================== */}
                        {/* ===============Generate link========================== */}
                        {initial_invitation_link
                          ?
                          <>
                            <div className="dark:bg-gray-800 dark:text-gray-200 dark:border-slate-500 flex flex-col gap-4 bg-white rounded-2xl border border-gray-200 p-4">
                              <div className="text-gray-900 text-lg font-semibold dark:text-white">Generate a link</div>
                              <div className="text-gray-600 text-sm dark:text-white">This link will expire on {initial_invitation_link.expire_time}</div>
                              <div className="flex gap-4 items-center">
                                <div className="grow">
                                  <div className="space-y-1.5 w-full">
                                    <label for="teamInviteId" className="text-sm font-medium block text-gray-900 placeholder:text-gray-400 transition-[color] duration-150 ease-in-out"><span className="flex items-center space-x-1"><span></span></span></label>
                                    <div className="py-1 flex items-center gap-2 bg-white w-full px-3 rounded-lg ring-1 hover:ring-2 transition-all duration-150 ease-in-out ring-gray-200 outline-none focus-within:!ring-1">
                                      <div className="flex items-center grow gap-2 py-1.5">
                                        <div className="flex gap-1 grow">
                                          <input
                                            id="teamInviteId"
                                            type="text"
                                            ref={inputRef}
                                            readOnly
                                            className="block w-full text-gray-900 placeholder:text-gray-400 text-sm font-normal resize-none outline-none"
                                            value={initial_invitation_link.link}
                                          /></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-2">
                                  <button type="button" className="transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-2 active:ring-1"
                                    onClick={handleCopyClick}>
                                    <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                                      <div className="flex items-center gap-2">
                                        Copy link
                                        <CopyIcon />
                                      </div>
                                    </span>
                                  </button>
                                </div>
                                <div className="mt-2">
                                  <button type="button" className="transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-2 active:ring-1"
                                    onClick={() => {
                                      delete_link()
                                    }}>
                                    <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                                      <div className="flex items-center gap-2">
                                        Delete
                                        <DeleteIcon />
                                      </div>
                                    </span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </>
                          :
                          <>
                            <div className="dark:bg-gray-800 dark:text-gray-200 dark:border-slate-500 flex flex-col gap-4 bg-white rounded-2xl border border-gray-200 p-4 mt-[10px]">
                              <div className="text-gray-900 text-lg font-semibold dark:text-white">Generate a link</div>
                              <div className="text-gray-600 text-sm dark:text-white">Generate a unique link you can share with your team to join your account. This link will expire in 10 days.</div>
                              <div>
                                <button type="button" className="transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-2 active:ring-1"
                                  onClick={() => {
                                    generate_invitation_generate_link()
                                  }}
                                >
                                  <span className="flex items-center justify-center mx-auto space-x-2 select-none">
                                    Generate link</span></button></div>
                            </div>
                          </>
                        }

                        {/* ===============Generate link========================== */}
                      </div>
                    </div>
                    <div className='p-4 m-4'>
                      <button className="float-right m-5 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() => {
                          setpopupinvitemodal(false)
                          setEmails([])
                        }}>
                        close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </>
        :
        null}

    </>
  )
}

export default Team