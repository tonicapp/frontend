import { initializeApp, getApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

const config = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
};

export function getFirebaseApp() {
  if (getApps().length == 0) {
    return initializeApp(config)
  }

  return getApp()
}

export function getCloudFirestore() {
  const app = getFirebaseApp()

  return getFirestore()
}

export function getFirebaseStorage() {
  const app = getFirebaseApp()

  return getStorage()
}

export function getFirebaseAuth() {
  const app = getFirebaseApp()

  return getAuth()
}
