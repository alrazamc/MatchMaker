import React, { useEffect } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { connect } from 'react-redux';
import { changeRoutes } from '../../store/actions/routesActions';
import { inboxRoutes } from '../../config/routes';
import Inbox from './Inbox';

const InboxRouter = ({ changeRoutes }) => {
  let { path } = useRouteMatch();
  path = path.endsWith('/') ? path : path + '/';
  useEffect(() => {
    changeRoutes(inboxRoutes);
  }, [changeRoutes])
  return (
    <Switch>
      <Route path={`${path}sent`} component={Inbox} />
      <Route path={`${path}received`} component={Inbox} />
      <Route path={`${path}connections`} component={Inbox} />
    </Switch>
  );
}
 
export default connect(
  null, { changeRoutes }
)(InboxRouter);