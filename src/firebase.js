import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCAsxgwWnyCDeCuMNK8CC-afmzJ96a0SdY",
  authDomain: "lampoon-ad-ap.firebaseapp.com",
  projectId: "lampoon-ad-ap",
  storageBucket: "lampoon-ad-ap.firebasestorage.app",
  messagingSenderId: "537475114195",
  appId: "1:537475114195:web:7f595a24e97d6fb098a026"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);