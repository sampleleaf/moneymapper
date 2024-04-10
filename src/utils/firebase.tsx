import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: `${import.meta.env.VITE_FIRE_apiKey}`,
  authDomain: import.meta.env.VITE_FIRE_authDomain,
  projectId: import.meta.env.VITE_FIRE_projectId,
  storageBucket: import.meta.env.VITE_FIRE_storageBucket,
  messagingSenderId: import.meta.env.VITE_FIRE_messagingSenderId,
  appId: import.meta.env.VITE_FIRE_appId,
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
