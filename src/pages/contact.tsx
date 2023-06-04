import * as React from "react";

const Contact = () => {

  return (

    <div>
      <small> You are running this application in mode.: 
      <b>{process.env.NODE_ENV}</b>
      </small>

      <div>
        <small> REACT_APP_NOT_SECRET_CODE:  
        <b> {import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET}</b>
        </small>
      </div>
    </div>
  );
}

export default Contact