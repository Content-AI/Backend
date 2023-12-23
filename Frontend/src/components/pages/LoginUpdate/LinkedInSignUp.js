import React from 'react';
import axios from 'axios';
import { FRONT_END_URL_PARAM } from '../../../apis/urls';
import LinkedInIcon from '../../Icons/LinkedInIcon';

const LinkedInSignUp = () => {
  const handleLinkedInSignIn = async () => {
    const response_type = "code"
    const client_id = "86nbyoaj3py59q"
    try {
      // Step 1: Initiate OAuth flow
      window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=${response_type}&client_id=${client_id}&redirect_uri=${FRONT_END_URL_PARAM}&scope=openid%20profile%20w_member_social%20email`;
    } catch (error) {
      console.error('Error initiating LinkedIn sign-in:', error);
    }
  };

 

  return (
    <div>
        <button
          onClick={handleLinkedInSignIn}
          className="flex items-center bg-[#0288D1] text-white p-3 max-width:[400px] h-[40px] min-width:[200px] rounded cursor-pointer transition-transform transform"
        >
          <LinkedInIcon className="w-6 h-6 mr-2" /> {/* Adjust the width and height */}
          Login with LinkedIn
        </button>
    </div>
  );
};

export default LinkedInSignUp;
