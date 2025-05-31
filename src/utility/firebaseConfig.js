import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  projectId: process.env.FB_PROJECT_ID,
  storageBucket: process.env.FB_STORAGE_BUCKET,
  messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
  appId: process.env.FB_APP_ID,
}

// Initialize Firebase
const fireBaseApp = initializeApp(firebaseConfig)
const appFirebaseDb = getFirestore(fireBaseApp)
const appFireBaseAuth = getAuth(fireBaseApp)

export default { appFirebaseDb, appFireBaseAuth, fireBaseApp }
