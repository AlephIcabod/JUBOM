const btnCerrar=document.getElementById("btnCerrarS")
const Loading=document.getElementById("loading")
const Content=document.getElementById("content")
var usuario

const verificarSesion=(cb)=>{
    firebase.auth().onAuthStateChanged(function(user) {        
        if (user) {
            Loading.classList.add("hide")      
            Content.classList.remove("hide")            
            if(cb) cb(user)
            if (window.location.pathname=="/"){
                window.location.href="/app"
            }
        }else{            
            Loading.classList.add("hide")      
            Content.classList.remove("hide")
            if(window.location.pathname!=="/"){                
                window.location.href="/"
            }
        }
    });
}

const cerrarSesion=()=>{        
    firebase.auth().signOut().then(function() {        
            location.href = "/";    
    }).catch(function(error) {        
  });
}


function Asociar (prov){    
    let provider;
    switch(prov){
        case "F":provider = new firebase.auth.FacebookAuthProvider();break;
        case "T":provider = new firebase.auth.TwitterAuthProvider();break;
        case "G":provider = new firebase.auth.GoogleAuthProvider();break;
    }
    firebase.auth().currentUser.linkWithPopup(provider).then(function(result) {
    var credential = result.credential;
    var user = result.user; 
    console.log(result)  
    }).catch(function(error) {
        console.log(error)
    });
}

function LoginRedes(prov){
    let provider;
    switch(prov){
        case "F":provider = new firebase.auth.FacebookAuthProvider();break;
        case "T":provider = new firebase.auth.TwitterAuthProvider();break;
        case "G":provider = new firebase.auth.GoogleAuthProvider();break;
    }
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);firebase.auth().signInWithPopup(provider).then(function(result){
    var credential = result.credential;
    var user = result.user; 
        window.location.href="/app"
    }).catch(function(error) {
        console.log(error)
        alert("No se pudo iniciar sesion")
    });
}


function obtenerDatosUsuario(user){
    let database=firebase.database();
    let encontrado=false;
    let usuarioEncontrado;
    let usuario=database.ref("/usuarios/")
    usuario.on('value',snap=>{
        snap.forEach(child=> {
            let uid=child.val().uid
            if (uid==user.uid){
                encontrado=true
                usuarioEncontrado=child.val()
            }
        });

        if (!encontrado){
            usuarioEncontrado=usuario.push({
                uid:user.uid,
                nombre:user.displayName||user.email||user.phoneNumber,
                creditos:50
            })
        }
        console.log("encontrado",usuarioEncontrado,usuarioEncontrado.key)
    })
}
(function (){
    var config = {
        apiKey: "AIzaSyCKIEvZXPu8dyWyflhOZ65vSJ9ZbSk1_fc",
        authDomain: "jubom-64471.firebaseapp.com",
        databaseURL: "https://jubom-64471.firebaseio.com",
        projectId: "jubom-64471",
        storageBucket: "jubom-64471.appspot.com",
        messagingSenderId: "592109724621"
      };
      firebase.initializeApp(config);
      verificarSesion(obtenerDatosUsuario);




      if (btnCerrar){
          btnCerrar.addEventListener("click",e=>{              
              cerrarSesion();
          })
      }
    $(".button-collapse").sideNav();
    $('ul.tabs').tabs();
     $('.modal').modal();     
})()


