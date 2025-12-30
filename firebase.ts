import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDKGE2qdxuV9ugYga8Luw3QzYRwvD3xM5o",
  authDomain: "vang-anh-bd21c.firebaseapp.com",
  projectId: "vang-anh-bd21c",
  storageBucket: "vang-anh-bd21c.firebasestorage.app",
  messagingSenderId: "246040395102",
  appId: "1:246040395102:web:c1a62eb2358d19dc42e3cf"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Connect to specific database 'vanganh-portal'
export const db = getFirestore(app, "vanganh-portal");
// Connect to specific bucket 'gs://vanganh-portal'
export const storage = getStorage(app, "gs://vanganh-portal");
