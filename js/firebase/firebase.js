const firebaseConfig = {
  apiKey: "AIzaSyCKRpcRTSrsvfHiA7Zr2ifrTtJU4B1vlXg",
  authDomain: "crud-fatec-clave.firebaseapp.com",
  databaseURL: "https://crud-fatec-clave-default-rtdb.firebaseio.com",
  projectId: "crud-fatec-clave",
  storageBucket: "crud-fatec-clave.appspot.com",
  messagingSenderId: "856453715225",
  appId: "1:856453715225:web:058e01024e74487d1c6188"
};
  //inicializando o Firebase
  firebase.initializeApp(firebaseConfig)
  //efetuando a ligação com o database
  const database = firebase.database()