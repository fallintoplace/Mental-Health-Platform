import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBVQ2OS6X_56pjC0xy51mbph7VnwVBiBlg",
  authDomain: "phq9-authentication.firebaseapp.com",
  projectId: "phq9-authentication",
  storageBucket: "phq9-authentication.appspot.com",
  messagingSenderId: "256152399579",
  appId: "1:256152399579:web:6990bbd10c6138eab8e6fe",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp.firestore();
