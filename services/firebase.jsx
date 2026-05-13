import { AppRegistry, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';

// 1. Initialize Firebase if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp();
}

// 2. Register background handler for notifications
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

export default firebase;