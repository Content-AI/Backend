import React from 'react'
import {ProgressBar, Label} from 'react-aria-components';

const Progressbar = (props) => {
  return (

    <ProgressBar value={props.percent_uploaded}>
        {({percentage, valueText}) => <>
            <Label>Uploading  </Label>
            <span className="value">{valueText}</span>
            <div className="bar">
            <div className="fill" style={{width: percentage + '%'}} />
            </div>
        </>}
    </ProgressBar>

  )
}

export default Progressbar