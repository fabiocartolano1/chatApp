import logo from './logo.svg';
import React, { Component, useState, useEffect, useRef }  from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyCqb3JIeYjtUNj3lf_jMn1kWLFymflp4yw",
  authDomain: "superchat-6a688.firebaseapp.com",
  databaseURL: "https://superchat-6a688-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "superchat-6a688",
  storageBucket: "superchat-6a688.appspot.com",
  messagingSenderId: "982978695276",
  appId: "1:982978695276:web:9b10635e786f264c410849",
  measurementId: "G-4QVJDCY7MS"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {
  const [user] = useAuthState(auth);
  test()

  return (
    <div className="App">
      <header className="App-header">
        <h1>Salut les potes 🔥</h1>
       <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn /> }
      </section>
    </div>
  );
}

function SignIn(){
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <button onClick={signInWithGoogle}>Sign in with Google </button>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}
function test(){
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt','desc')

  let [messages] = useCollectionData(query, {idField: 'id'});
  console.log(messagesRef)
}

function ChatRoom(){

  const dummy = useRef()

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt','desc').limit(25);

  let [m] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue ] = useState('')

  const sendMessage = async(e) => {
    e.preventDefault();

    const { uid, photoURL} = auth.currentUser;

    if(formValue.length < 100 && formValue.length != 0){
      await messagesRef.add({
        text : formValue,
        createdAt : firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL
      })
    }
    else if (formValue.length >= 100){
      alert('arrete de spam')
    }
    else if (formValue.length == 0){
      alert('ca sert a quoi d\'envoyer un message vide ?')
    }
    

    setFormValue('');

    dummy.current.scrollIntoView({behavior : 'smooth'});
  }
  return (
    <>
    <main>
      {m && m.reverse().map(msg => <ChatMessage key={msg.id} message = {msg} />)}
      <div ref={dummy}></div>
    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />

      <button type='submit'>🕊️</button>
    </form>
    </>
  )
}

function ChatMessage(props){
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  
  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL}/>
      <p>{text}</p>
    </div>
  
  )
}

export default App;
