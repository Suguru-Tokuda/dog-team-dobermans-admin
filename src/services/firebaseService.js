import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import * as api from '../api.json';

const isProd = window.location.toString().indexOf('dogteamdobermans-admin.web.app') !== -1;

let apiParams;

if (isProd === true) {
    apiParams = api.production;
} else {
    apiParams = api.dev;
}

const firebaseConfig = {
    apiKey: apiParams.firebaseConfigParams.apiKey,
    authDomain: apiParams.firebaseConfigParams.authDomain,
    databaseURL: apiParams.firebaseConfigParams.databaseURL,
    projectId: apiParams.firebaseConfigParams.projectId,
    storageBucket: apiParams.firebaseConfigParams.storageBucket,
    messagingSenderId: apiParams.firebaseConfigParams.messagingSenderId,
    appId: apiParams.firebaseConfigParams.appId
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const auth = firebase.auth();

auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(() => {
    })
    .catch(err => {
        console.log(err);
    });

export {
    storage, auth, firebase as default
};