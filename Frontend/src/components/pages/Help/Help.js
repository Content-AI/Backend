// Help.js
import React from 'react';
import LiveChat from './LiveChat'; 
import TicketForm from './TicketForm'; 
import Guide from './Guide';

const Help = (props) => {


  return (
    <div className=" min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* ================================== */}
      <div className="max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
        <p className="dark:text-white mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Welcome to our Help & Support</p>
        <p className=" dark:text-white mt-3 text-xl text-gray-500 max-w-prose">Our platform will provide you with the best help and support.</p>
        <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <LiveChat AUTH_TOKEN={props.AUTH_TOKEN}/>
              <TicketForm AUTH_TOKEN={props.AUTH_TOKEN}/>
            </div>
        </div>
      </div>
      <div className="max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Guide</p>
        <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Guide/>
            </div>
        </div>
      </div>
      {/* ================================== */}
      </div>
  );
};

export default Help;
