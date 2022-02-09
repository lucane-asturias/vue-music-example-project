import firebase from 'firebase/app'; // core module
import 'firebase/auth'; // authentication module
import 'firebase/firestore'; // firestore database
import 'firebase/storage'; // cloud storage

const firebaseConfig = {
  apiKey: "AIzaSyBL-Vq1oR3CrCe0NcMPJBM3949BBos_q8Y",
  authDomain: "music-c14fa.firebaseapp.com",
  projectId: "music-c14fa",
  storageBucket: "music-c14fa.appspot.com", // buckets are the physical location where data is stored
  appId: "1:168569828117:web:e19a721203a8b8b6772f1c"
};

// Initialize Firebase by connecting to it
// It'll return an instance of reibase we can use to communicating with it
firebase.initializeApp(firebaseConfig);

// variables that references auth and db from firebase
const auth = firebase.auth();
const db = firebase.firestore();

const storage = firebase.storage();

// note: the collection doesn't need to exist for Firebase to select it
const usersCollection = db.collection('users');
const songsCollection = db.collection('songs');
const commentsCollection = db.collection('comments');

export {
    auth, 
    db,
    usersCollection,
    songsCollection,
    commentsCollection,
    storage
}