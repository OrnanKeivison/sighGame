import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCoIEWv60lgwu3ReKZGKCqQag7Dt7Rwyp0",
  authDomain: "sighgame-bb4e4.firebaseapp.com",
  databaseURL: "https://sighgame-bb4e4-default-rtdb.firebaseio.com",
  projectId: "sighgame-bb4e4",
  storageBucket: "sighgame-bb4e4.appspot.com",
  messagingSenderId: "1063544326327",
  appId: "1:1063544326327:android:f955e4ed716570417f2532"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
