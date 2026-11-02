import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

const app = initializeApp({
  apiKey: 'AIzaSyCUgp9YM_EPNV_gDn1WUIgi36wG4LXTPug',
  authDomain: 'scottadamsai-a33bb.firebaseapp.com',
  projectId: 'scottadamsai-a33bb',
  storageBucket: 'scottadamsai-a33bb.firebasestorage.app',
  messagingSenderId: '793456642494',
  appId: '1:793456642494:web:5ad5ce6dff45acce35d1ef',
  measurementId: 'G-8X6XS1KSQR',
});

// Local development uses a browser-specific token registered in Firebase Console.
// Vite removes this branch from production builds.
if (
  import.meta.env.DEV &&
  ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)
) {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider('6LdDWGkrAAAAAP67KnKq_mFDzafh_NRMiUxY6Ihh'),
  isTokenAutoRefreshEnabled: true,
});

export const askQuestion = httpsCallable(getFunctions(app), 'ask');
