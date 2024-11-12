import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { environment } from './environment/environment';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { enableProdMode } from '@angular/core';
import { getAnalytics, logEvent } from "firebase/analytics";
if (environment.production) {
  enableProdMode();
}

// Initialize Firebase
const app = initializeApp(environment.firebase);
const analytics = getAnalytics(app);
console.log('getAnalytics', analytics)
logEvent(analytics, 'notification_received');
const auth = getAuth(app);

// Set persistence
setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.error('Persistence error:', error);
});

// Check Firebase configuration
const requiredKeys = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

function checkFirebaseConfig(firebaseConfig: any): void {
  const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);

  if (missingKeys.length > 0) {
    console.error('Missing Firebase configuration keys:', missingKeys);
  } else {
    console.log('Firebase configuration is valid.');
  }
}

checkFirebaseConfig(environment.firebase);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
