import { getFirestore } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
}

// Initialize Firebase
const fireBaseApp = initializeApp(firebaseConfig)
const db = getFirestore(fireBaseApp)

export default { db, fireBaseApp }
