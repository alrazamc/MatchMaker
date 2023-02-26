import axios from "axios";
import { actionTypes  } from '../store/actions/AuthActions';

export const configureAxios = (store) => {
  axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
  axios.interceptors.request.use(  config => {
      if(config.url.startsWith('http') && !config.url.startsWith(process.env.REACT_APP_BASE_URL)) return config;
      if (!config.headers.Authorization) {
        const token = localStorage.getItem(process.env.REACT_APP_JWT_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    error => Promise.reject(error)
  );
  axios.interceptors.response.use( response => response
      ,
    error => {
      if(error.response && error.response.status === 401) //unAuthroized
      {
        localStorage.removeItem(process.env.REACT_APP_JWT_TOKEN);
        localStorage.removeItem(process.env.REACT_APP_FB_TOKEN);
        const action = {
          type: actionTypes.AUTH_FAILED,
          message: error.response.data && error.response.data.message ? error.response.data.message : ""
        }
        store.dispatch(action);
        return Promise.reject(new Error(action.message));
      }else
      {
        return Promise.reject(error);
      }
    }
  )
}