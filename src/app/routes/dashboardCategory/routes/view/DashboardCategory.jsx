import React from 'react';
import CardBox from "components/CardBox/index";
import DataTable from "./Components/Datatable";

const DashboardCategoryview = props => {
  return (
    <div className="row animated slideInUpTiny animation-duration-3">
      <CardBox styleName="col-12" cardStyle=" p-0">
        <DataTable />
      </CardBox>
    </div>
  );
}

export default DashboardCategoryview;