import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import asyncComponent from '../../../util/asyncComponent';


const Reports = ({match}) => (
  <div className="app-wrapper">
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/view`}/>
      <Route path={`${match.url}/view`} component={asyncComponent(() => import('./routes/view'))}/>
      <Route path={`${match.url}/notes/view`} component={asyncComponent(() => import('./routes/notes'))}/>
      <Route path={`${match.url}/videos/view`} component={asyncComponent(() => import('./routes/videos'))}/>
      <Route component={asyncComponent(() => import('app/routes/extraPages/routes/404'))}/>
    </Switch>
  </div>
);

export default Reports;
