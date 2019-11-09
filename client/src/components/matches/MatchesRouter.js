import React, { useEffect } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { connect } from 'react-redux';
import { changeRoutes } from '../../store/actions/routesActions';
import { matchesRoutes } from '../../config/routes';
import Suggestions from './suggestions/Suggestions';
import Shortlisted from './shortlisted/Shortlisted';

const MatchesRouter = ({ changeRoutes }) => {
  let { path } = useRouteMatch();
  path = path.endsWith('/') ? path : path + '/';
  useEffect(() => {
    changeRoutes(matchesRoutes);
  }, [changeRoutes])
  return (
    <Switch>
      <Route path={`${path}suggestions`} component={Suggestions} />
      <Route path={`${path}shortlisted`} component={Shortlisted} />
    </Switch>
  );
}
 
export default connect(
  null, { changeRoutes }
)(MatchesRouter);