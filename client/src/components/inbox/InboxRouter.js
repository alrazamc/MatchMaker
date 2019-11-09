import React, { useEffect } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { connect } from 'react-redux';
import { changeRoutes } from '../../store/actions/routesActions';
import { inboxRoutes } from '../../config/routes';
import SentRequests from './sent/SentRequests';
import ReceivedRequests from './received/ReceivedRequests';
import Connections from './connections/Connections';

const InboxRouter = ({ changeRoutes }) => {
  let { path } = useRouteMatch();
  path = path.endsWith('/') ? path : path + '/';
  useEffect(() => {
    changeRoutes(inboxRoutes);
  }, [changeRoutes])
  return (
    <Switch>
      <Route path={`${path}sent`} component={SentRequests} />
      <Route path={`${path}received`} component={ReceivedRequests} />
      <Route path={`${path}connections`} component={Connections} />
    </Switch>
  );
}
 
export default connect(
  null, { changeRoutes }
)(InboxRouter);