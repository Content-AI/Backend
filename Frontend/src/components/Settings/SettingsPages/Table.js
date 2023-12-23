import React , {useEffect,useState} from 'react';

const Table = (props) => {



  const [tableData,settableData]=useState(null)

  useEffect(()=>{
    settableData(props.Data)
  })

  return (
      <div className="flex flex-col mt-4 mb-2">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th scope="col" className="dark:text-white px-6 py-3 text-left text-xs font-bold text-black">User</th>
                    <th scope="col" className="dark:text-white px-6 py-3 text-left text-xs font-bold text-black">Credits used</th>
                    <th scope="col" className="dark:text-white px-6 py-3 text-left text-xs font-bold text-black">Templates</th>
                    {/* <th scope="col" className="dark:text-white px-6 py-3 text-left text-xs font-bold text-black">projects</th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {tableData &&
                  <>
                    {tableData.map((data,index)=>{
                      return (
                          <tr key={index}>
                              <td className="dark:text-white px-6 py-4 whitespace-nowrap text-sm font-medium text-black ">{data.name}</td>
                              <td className="dark:text-white px-6 py-4 whitespace-nowrap text-sm text-black ">{data.token_generated}</td>
                              <td className="dark:text-white px-6 py-4 whitespace-nowrap text-sm text-black ">{data.template_count}</td>
                              {/* <td className="dark:text-white px-6 py-4 whitespace-nowrap text-sm text-black ">{data.projects}</td>               */}
                          </tr>
                      )
                    })}
                  </>
                }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Table;
