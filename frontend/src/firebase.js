import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCyf5iB7biOplohFZgIghcgTD-oWWD5YpI",
  authDomain: "haveit-13e7a.firebaseapp.com",
  projectId: "haveit-13e7a",
  appId: "1:542152486588:web:aae2b62001eefecbb5aab9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);