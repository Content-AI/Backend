import React from 'react';
import { FRONT_END_URL_GOOGLE_PARAM } from '../../../apis/urls';
import GoogleIcon from '../../Icons/GoogleIcon';

const GoogleAuthComponent = () => {
    const clientId = '65857693177-41t814nhrml22jptcfdrcqveumamp8al.apps.googleusercontent.com';
    const redirectUri = FRONT_END_URL_GOOGLE_PARAM; // Replace with your actual frontend URL
    // const redirectUri = "http://localhost:3000/google"; // Replace with your actual frontend URL
    const scope = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'; // Include the email scope


  
    const initiateGoogleOAuth = () => {
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token`;
      window.location.replace(authUrl);
    };
  
    return (
      <div>
       <button onClick={initiateGoogleOAuth} className="flex items-center bg-black text-white p-3 max-width:[400px] h-[40px] min-width:[200px] rounded cursor-pointer transition-transform transform">
            <GoogleIcon/>
                Login with Google
            </button>

      </div>
    );
  };

export default GoogleAuthComponent;
