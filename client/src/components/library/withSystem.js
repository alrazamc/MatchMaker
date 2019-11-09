import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadSystemValues } from '../../store/actions/SystemActions';

const withSystem = (names = []) => Component => props => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadSystemValues(names));
  }, [dispatch]);
  return <Component {...props} />
}
export default withSystem;