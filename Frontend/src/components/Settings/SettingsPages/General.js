import React ,{useEffect} from 'react'
import Settings from '../Settings'
import { setDocumentTitle } from '../../NavBar/DynamicTitle';

const General = () => {


    useEffect(() => {
        setDocumentTitle("General Page");
    }, []);
    
  return (
    <>
      {/* <Settings/> */}
        <div className='flex flex-col ml-[150px]'>
            <div>
                <h1 className='text-[18px] font-bold'>General Settings</h1>
            </div>
            <div className='mt-3'>
            <label
                    htmlFor="company_name"
                    className="block text-sm font-semibold text-gray-800"
                >
                    Company Name
                </label>
                <input
                    type="company_name"
                    id="company_name"
                    name="company_name"
                    autoComplete="off"
                    className="block w-[400px] px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                />
            </div>
            <div className='mt-3'>
            <label
                    htmlFor="primary_website_domain"
                    className="block text-sm font-semibold text-gray-800"
                >
                    Your Website
                </label>
                <input
                    type="primary_website_domain"
                    id="primary_website_domain"
                    name="primary_website_domain"
                    autoComplete="off"
                    placeholder='www.your_website.com'
                    className="block w-[400px] px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                />
            </div>
            <div className='mt-3'>
            <label
                    htmlFor="billing"
                    className="block text-sm font-semibold text-gray-800"
                >
                    Billing Email
                </label>
                <input
                    type="billing"
                    id="billing"
                    name="billing"
                    autoComplete="off"
                    className="block w-[400px] px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                />
            </div>

            <div className='mt-3'>
                <button
                    className="font-bold text-white bg-[#334977] p-2 w-[100px] rounded-md"
                >
                    save
                </button>
            </div>
        </div>

    </>
  )
}

export default General