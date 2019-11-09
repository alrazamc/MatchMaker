import React, { useEffect } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { connect } from 'react-redux';
import { changeRoutes } from '../../store/actions/routesActions';
import { searchRoutes } from '../../config/routes';
import Search from './Search';

const SearchRouter = ({ changeRoutes }) => {
  let { path } = useRouteMatch();
  path = path.endsWith('/') ? path : path + '/';
  useEffect(() => {
    changeRoutes(searchRoutes);
  }, [changeRoutes])
  return (
    <Switch>
      <Route path={`${path}basic`} component={Search} />
      <Route path={`${path}advanced`} component={Search} />
    </Switch>
  );
}
 
export default connect(
  null, { changeRoutes }
)(SearchRouter);