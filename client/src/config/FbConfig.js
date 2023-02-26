import firebase from 'firebase/app'; 
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/messaging';


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};
if (!firebase.apps.length)
  firebase.initializeApp(firebaseConfig);
firebase.firestore();
export const messaging = firebase.messaging();

export const monitorDeviceToken = callback => {
  messaging.onTokenRefresh(() => {
    messaging.getToken().then((refreshedToken) => {
     callback(refreshedToken);
    }).catch((err) => {
    });
  });
}

export const reqNotificationPermission = async (callback) => {
  try
  {
    const currentToken = await messaging.getToken();
    if (currentToken)
    {
      callback(currentToken);
    }else{
      await messaging.requestPermission();
      const token = await messaging.getToken();
      callback(token);
    }
  }catch(err)
  {
    
  }
}
export default firebase;