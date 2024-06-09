// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDJC_L8XKa1rP4meBcGJomr_be49qg20RE",
    authDomain: "blogging-website-5568d.firebaseapp.com",
    projectId: "blogging-website-5568d",
    storageBucket: "blogging-website-5568d.appspot.com",
    messagingSenderId: "625668954554",
    appId: "1:625668954554:web:65e951820a9bd3c735e583"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);




// MAKING GOOGLE AUTHINCATION
const provider = new GoogleAuthProvider()

const auth = getAuth()

export const googleAuth = async () => {
    let user = null;

    await signInWithPopup(auth, provider)
        .then((result) => {
            user = result.user
        })
        .catch((error) => {
            console.log(error)
        })

    return user;
}