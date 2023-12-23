import React from "react";
import { render } from "react-dom";
import { Line } from "react-chartjs-2";


const LineCharComponent = () => {
    
const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "My First dataset",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [1000, 200,100,1500,3000,2500,300]
      }
    ]
  };
  
  //const myRef = React.createRef();
  const lineOptions = {
    onClick: (e, element) => {
      if (element.length > 0) {
        var ind = element[0]._index;
        alert(ind);
      }
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false
          }
        }
      ],
      yAxes: [
        {
          // stacked: true,
          gridLines: {
            display: false
          },
          ticks: {
            beginAtZero: true,
            // Return an empty string to draw the tick line but hide the tick label
            // Return `null` or `undefined` to hide the tick line entirely
            userCallback(value) {
              // Convert the number to a string and splite the string every 3 charaters from the end
              value = value.toString();
            //   value = value.split(/(?=(?:...)*$)/);
  
              // Convert the array to a string and format the output
            //   value = value.join(".");
              return `${value} Token`;
            }
          }
        }
      ]
    },
    legend: {
      display: false
    },
    tooltips: {
      enabled: false
    }
  };
  
  const styles = {
    fontFamily: "sans-serif",
    textAlign: "center"
  };

  return (
    <Line data={data} options={lineOptions} />
  )
}

export default LineCharComponent