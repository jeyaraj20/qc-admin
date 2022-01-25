import React, { useState, useEffect } from 'react';
import CardBox from "components/CardBox/index";
import DataTable from "./Components/Datatable";
import Button from '@material-ui/core/Button';
import * as exammainCategoryService from '../../../../../services/exammainCategoryService';

const ExamMaincategoryview = props => {
 
 

  // useEffect(() => {
  //   async function fetchData() {
  //     await mapCategories()
  //   }
  //   fetchData();
  // }, [])

  // const mapCategories = async () => {
  //   const { data: res } = await exammainCategoryService.getExamMainCategory();
  //   const { category: categoryres } = res
  //   setCategoryData(categoryres);

  // }

  return (
    <div className="row animated slideInUpTiny animation-duration-3">
      <CardBox styleName="col-12" cardStyle=" p-0">
        <DataTable/>
      </CardBox>
    </div>
  );
}

export default ExamMaincategoryview;