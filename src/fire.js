import firebase from 'firebase/app';
import 'firebase/database';

import { firebaseConfig } from "./config.js";

var fire = firebase.initializeApp(firebaseConfig);
export default fire;
