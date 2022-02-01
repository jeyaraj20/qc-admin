import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import asyncComponent from '../../../util/asyncComponent';


const ExamSubCategory = ({match}) => (
  <div className="app-wrapper">
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/view`}/>
      <Redirect exact from={`${match.url}/commonedit`} to={`${match.url}/commonexamedit`}/>
      <Redirect exact from={`${match.url}/bankedit`} to={`${match.url}/bankexamedit`}/>
      <Redirect exact from={`${match.url}/sectionaledit`} to={`${match.url}/sectionalexamedit`}/>
      <Redirect exact from={`${match.url}/examslist`} to={`${match.url}/examsdatatable`}/>
      <Redirect exact from={`${match.url}/map`} to={`${match.url}/mapquestion`}/>
      <Redirect exact from={`${match.url}/examsview`} to={`${match.url}/examview`}/>
      <Redirect exact from={`${match.url}/questionsview`} to={`${match.url}/questionview`}/>
      <Route path={`${match.url}/view`} component={asyncComponent(() => import('./routes/view'))}/>
      <Route path={`${match.url}/commonexamedit`} component={asyncComponent(() => import('./routes/commonexamedit'))}/>
      <Route path={`${match.url}/bankexamedit`} component={asyncComponent(() => import('./routes/bankexamedit'))}/>
      <Route path={`${match.url}/sectionalexamedit`} component={asyncComponent(() => import('./routes/sectionalexamedit'))}/>
      <Route path={`${match.url}/examsdatatable`} component={asyncComponent(() => import('./routes/examsdatatable'))}/>
      <Route path={`${match.url}/mapquestion`} component={asyncComponent(() => import('./routes/mapquestion'))}/>
      <Route path={`${match.url}/examview`} component={asyncComponent(() => import('./routes/examview'))}/>
      <Route path={`${match.url}/questionview`} component={asyncComponent(() => import('./routes/questionview'))}/>
      <Route component={asyncComponent(() => import('app/routes/extraPages/routes/404'))}/>
    </Switch>
  </div>
);

export default ExamSubCategory;
