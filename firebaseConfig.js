// Importiere die benötigten Funktionen aus dem SDK
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";

// Firebase-Konfiguration aus Umgebungsvariablen laden
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Firebase initialisieren
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Funktion zum Speichern einer Nachricht
async function saveResponse(userMessage, responseText) {
  try {
    await addDoc(collection(db, "botResponses"), {
      message: userMessage,
      response: responseText
    });
    console.log("Antwort gespeichert!");
  } catch (e) {
    console.error("Fehler beim Speichern der Nachricht: ", e);
  }
}

// Funktion zum Abrufen einer Antwort
async function getResponse(userMessage) {
  const querySnapshot = await getDocs(collection(db, "botResponses"));
  querySnapshot.forEach((doc) => {
    if (doc.data().message === userMessage) {
      console.log("Antwort gefunden: ", doc.data().response);
    }
  });
}
