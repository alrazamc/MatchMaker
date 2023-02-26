import React, { useEffect, useState, Suspense } from 'react';
import AppPreloader from './components/template/AppPreloader';
import { connect } from 'react-redux';
import { loadAuth } from './store/actions/AuthActions';
import { updateLastActive } from './store/actions/ProfileActions';
import AppPublic from './AppPublic';
const AppPrivate = React.lazy(() => import('./AppPrivate'));

function App({ isAuthLoaded, loadAuth, updateLastActive, uid }) {
  const [activeInterval, setActiveInterval] = useState(null);
  useEffect(() => {
    loadAuth(); //check if user already signed-in on page load
  }, [loadAuth]);
  
  useEffect(() => {
    if(!uid) //not logged in or logged out
    {
      if(activeInterval) //on logout, disable active ping xhr
      {
        clearInterval(activeInterval);
        setActiveInterval(null);
      }
      return;
    }
    if(activeInterval) return; //active PING xhr is already registered
    updateLastActive(); //set user last active in his/her profile
    setActiveInterval( //keep updating user last active time after X minutes 
      setInterval(updateLastActive, process.env.REACT_APP_ACTIVE_INTERVAL * 60 * 1000)
    );
    return () => {
      activeInterval && clearInterval(activeInterval) && setActiveInterval(null);
    }
  }, [updateLastActive, uid, activeInterval]);

  if(!isAuthLoaded) return <AppPreloader message="Loading App..." />;
  if(!uid) return <AppPublic />;
  if(uid)
    return <Suspense fallback={<AppPreloader message="Signing in..." />}>
        <AppPrivate />
      </Suspense>
  return <AppPreloader message="Something went wrong..." />
}

const mapStateToProps = state => {
  return {
    isAuthLoaded: state.auth.isLoaded,
    uid: state.auth.uid ? state.auth.uid : null
  }
}

export default connect(mapStateToProps, { loadAuth, updateLastActive })(App);
