import { registerRootComponent } from 'expo';
//import { getMessaging } from '@react-native-firebase/messaging'; // Modular import
import App from './App';

// Modular background handler
//getMessaging().setBackgroundMessageHandler(async remoteMessage => {
 // console.log('Message handled in the background!', remoteMessage);
//});

registerRootComponent(App);