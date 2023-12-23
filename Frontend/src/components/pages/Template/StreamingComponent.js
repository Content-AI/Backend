import React, { useState } from 'react';
import RenderHtmlData from "./RenderHtmlData";

function StreamingComponent() {


    const [streamedData, setStreamedData] = useState('');
    const [abortController, setAbortController] = useState(new AbortController());
  
    const startStreaming = async () => {
      const controller = new AbortController();
      setAbortController(controller); // Update the AbortController
  
      try {
        const response = await fetch('http://localhost:8000/v1/template/stream_data', {
          signal: controller.signal,
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const reader = response.body.getReader();
  
        while (true) {
          const { done, value } = await reader.read();

  
          if (done || controller.signal.aborted) {
            break;
          }


          // for openai
          const textData = new TextDecoder().decode(value); // Convert binary data to text
          const jsonData = JSON.parse(textData.replace(/'/g, '"'));
          console.log(jsonData["content"])
          
          
          // for azure
          // const textData = new TextDecoder().decode(value);
          // const jsonData = JSON.parse(textData.replace(/'/g, '"'));
          // console.log(jsonData["content"])

          if(jsonData["content"]!="@@stop@@"){
              // for openai
              setStreamedData(prevData => prevData + jsonData["content"]);

              // for azure
              // setStreamedData(prevData => prevData + jsonData["content"]);
          }else{
            abortController.abort(); 
          }
  
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    const stopStreaming = () => {
      abortController.abort();
    };

  return (
    <div>
      <button onClick={startStreaming} className='bg-slate-500 text-white p-4 mr-4'>Start </button>
      <button onClick={stopStreaming} className='bg-slate-500 text-white p-4'>Stop </button>
      <div className="text-white bg-blue px-4 py-3 mx-4 rounded-2xl ">
                <RenderHtmlData  htmldata={streamedData}/>
            </div>
    </div>
  );
}

export default StreamingComponent;
