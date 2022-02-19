import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import asyncComponent from '../../../util/asyncComponent';


const examinationCalendar = ({match}) => (
  <div className="app-wrapper">
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/view`}/>
      <Redirect exact from={`${match.url}/qexamsview`} to={`${match.url}/qexamview`}/>
      <Route path={`${match.url}/view`} component={asyncComponent(() => import('./routes/view'))}/>
      <Route path={`${match.url}/qexamview`} component={asyncComponent(() => import('./routes/examview'))}/>
      <Route path={`${match.url}/addeditquestion`} component={asyncComponent(() => import('./routes/view/Components/AddEditQuestion'))}/>
      <Route path={`${match.url}/questionsgrid`} component={asyncComponent(() => import('./routes/view/Components/QuestionsView'))}/>
      <Route component={asyncComponent(() => import('app/routes/extraPages/routes/404'))}/>
    </Switch>
  </div>
);

export default examinationCalendar;
