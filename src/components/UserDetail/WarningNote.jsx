import React from 'react'

export const WarningNote = ({handleDeleteUser, handleWarning}) => {
  return (

    <div className="warningboard">
      <h4>Are you sure you wanna delete this account</h4>
      <div className="deleteOptions">
        <p onClick={handleDeleteUser}>Yes</p>
          <div className="vl"></div>
        <p onClick={handleWarning}>No</p>
      </div>
    </div>

  )
}



export const MessageNote = ({message}) => {
    return (
        <div className='warningboard'>
            {message}
    
        </div>
    )
}

export const UploadImage = () => {
  
}
