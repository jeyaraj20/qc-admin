import React, { useState, useEffect } from 'react';
import CardBox from "components/CardBox/index";
import DataTable from "./Components/Datatable";
import Button from '@material-ui/core/Button';
import * as locationService from '../../../../../services/locationService';

const Statecategoryview = props => {

   
  
  return (
    <div className="row animated slideInUpTiny animation-duration-3">
      <CardBox styleName="col-12" cardStyle=" p-0">
        <DataTable/>
      </CardBox>
    </div>
  );
}

export default Statecategoryview;