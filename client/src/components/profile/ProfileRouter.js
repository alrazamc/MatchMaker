import React, { useEffect } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import Profile from './myProfile/Profile';
import Photos from './photos/Photos';
import PartnerPreference from './preference/PartnerPreference';
import AccountSettings from './AccountSettings/AccountSettings';
import { connect } from 'react-redux';
import { changeRoutes } from '../../store/actions/routesActions';
import { profileRoutes } from '../../config/routes';
import Dashboard from './dashboard/Dashboard';

const ProfileRouter = ({ changeRoutes }) => {
  let { path } = useRouteMatch();
  path = path.endsWith('/') ? path : path + '/';
  useEffect(() => {
    changeRoutes(profileRoutes);
  }, [changeRoutes])
  return (
    <Switch>
      <Route path={`${path}dashboard`} component={Dashboard} />
      <Route path={`${path}profile`} component={Profile} />
      <Route path={`${path}photos`} component={Photos} />
      <Route path={`${path}partner-preference`} component={PartnerPreference}/>
      <Route path={`${path}account-settings`} component={AccountSettings}/>
    </Switch>
  );
}
 
export default connect(
  null, { changeRoutes }
)(ProfileRouter);