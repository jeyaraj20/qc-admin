import React, { useState, useEffect } from 'react';
import CardBox from "components/CardBox/index";
import ExamView from "./ExamView";
import * as QueryString from "query-string"

const View = props => {

  const params = QueryString.parse(props.location.search);
  let qidparams=params.qid;
  let modeparams=params.mode;
  let maincategoryparams=params.maincategory;
  let subcategoryparams=params.subcategory;

 
  return (
    <div className="row animated slideInUpTiny animation-duration-3">
      <CardBox styleName="col-12" cardStyle=" p-0">
        <ExamView qidparams={qidparams} modeparams={modeparams}
          maincategoryparams={maincategoryparams} subcategoryparams={subcategoryparams}
        />
      </CardBox>
    </div>
  );
}

export default View;