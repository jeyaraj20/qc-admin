import React, { useState, useEffect } from 'react';
import CardBox from "components/CardBox/index";
import QuestionsView from "./view/QuestionsView";
import * as QueryString from "query-string"

const Qbankcategoryview = props => {
  const params = QueryString.parse(props.location.search);
  let categoryIdprops=params.categoryId;
  let datatypeprops=params.datatype;
  let subcategoryIdprops=params.subcategoryId;

  return (
    <div className="row animated slideInUpTiny animation-duration-3">
      <CardBox 
       styleName="col-12" cardStyle=" p-0">
        <QuestionsView categoryIdprops={categoryIdprops}
      datatypeprops={datatypeprops}
      subcategoryIdprops={subcategoryIdprops} />
      </CardBox>
    </div>
  );
}

export default Qbankcategoryview;