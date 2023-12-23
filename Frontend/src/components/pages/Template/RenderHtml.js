import React, { useEffect, useState } from 'react';

const RenderHtml = ({ htmldata }) => {


  // console.log(htmldata.blocks[0].data.text)
  let data = " .... "
  try{
    data=htmldata?.blocks[0].data.text+htmldata?.blocks[1].data.text+htmldata?.blocks[2].data.text
  }catch(e){
    data="....."
  }
  const formattedContent = data
    .split('\n')
    .map((line, index) => (index === 0 ? line : `<br>${line}`))
    .join('');

  return (
        <div className='dark:text-white' dangerouslySetInnerHTML={{ __html: formattedContent }} />
    )};

export default RenderHtml;
