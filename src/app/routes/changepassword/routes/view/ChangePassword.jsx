import React, { useState, useEffect } from 'react';
import CardBox from "components/CardBox/index";
import ChangePasswordForm from "./Components/Form";

const Changepasswordview = props => {
  return (
    <div style={{ padding: '5%', paddingLeft: '15%' }} className="row animated slideInUpTiny animation-duration-3">
      <CardBox styleName="col-10" cardStyle=" p-0">
        <ChangePasswordForm />
      </CardBox>
    </div>
  );

}



export default Changepasswordview;