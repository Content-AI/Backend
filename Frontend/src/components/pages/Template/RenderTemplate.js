import React, { useEffect, useState } from 'react'

const RenderTemplate = ({htmldata}) => {

  return (
      <>
          <div dangerouslySetInnerHTML={{ __html: htmldata }} />
      </>
  )
}

export default RenderTemplate