import React, { useState, useEffect } from 'react';
import CardBox from "components/CardBox/index";
import DataTable from "./Components/Datatable";
import Button from '@material-ui/core/Button';
import * as locationService from '../../../../../services/locationService';
import * as adminService from '../../../../../services/adminService';
import * as studentService from '../../../../../services/studentService';
const Studentsview = props => {
  const [stateData, setStateData] = useState([]);
  const [headerData, setHeaderData] = useState([
    {
      label: 'S.No',
      field: 'sno',
      width: 5,
    },
    {
      label: 'Register Number',
      field: 'stud_regno',
      width: 100,
    },
    {
      label: 'Name',
      field: 'stud_fname',
      width: 100,
    },
    {
      label: 'Email',
      field: 'stud_email',
      width: 5,
    },
    {
      label: 'Mobile',
      field: 'stud_mobile',
      width: 5,
    },
    {
      label: 'Date',
      field: 'stud_date',
      width: 5,
    },
    {
      label: 'Edit',
      field: 'edit',
      width: 5,
    },
    {
      label: 'View',
      field: 'view',
      width: 5,
    },
    {
      label: 'Select',
      field: 'select',
      width: 5,
    }
  ])

  
  return (
    <div className="row animated slideInUpTiny animation-duration-3">
      <CardBox styleName="col-12" cardStyle=" p-0">
        <DataTable columns={headerData} />
      </CardBox>
    </div>
  );
}

export default Studentsview;