import React, { useState,useEffect } from 'react'
import { Bar } from 'react-chartjs-2'

import { 
    Chart as ChartJs,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
} from 'chart.js'

ChartJs.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
)


// const users = [
//     {name:"Jan ",Token_Generated:100},
// ]

const CustomeGraph = (props) => {
    // console.log(props.userToken)

    const [userToken,setuserToken]=useState(null)

    useEffect(()=>{
        setuserToken(props.userToken)
    })

  return (
<div>
      {userToken && (
            <Bar
            data={{
                labels: userToken.map(user => user.name),
                datasets: [
                {
                    label: 'Token Generated',
                    data: userToken.map(user => user.Token_Generated),
                    backgroundColor: 'rgb(173, 216, 230)',
                },
                ],
            }}
            width={800}
            height={400}
            options={{
                animation: {
                duration: 1000, // Animation duration in milliseconds
                },
                scales: {
                y: {
                    beginAtZero: true,
                },
                },
            }}
            />
      )}
      {userToken==null
      ?
        <div className='w-[800px] h-[400px]'>
        </div>
      :
        null
      }
    </div>
  )
}

export default CustomeGraph