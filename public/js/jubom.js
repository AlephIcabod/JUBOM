const btnCerrar=document.getElementById("btnCerrarS")


const verificarSesion=()=>{
    firebase.auth().onAuthStateChanged(function(user) {        
        if (user) { 
            console.log(user.displayName);            
        }else{
                        
            console.log(user);
        }
    });
}

const cerrarSesion=()=>{        
    firebase.auth().signOut().then(function() {        
            location.href = "/";    
    }).catch(function(error) {
        console.log(error)
  });
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
      verificarSesion();
              console.log(btnCerrar)
      if (btnCerrar){
          btnCerrar.addEventListener("click",e=>{
              console.log(e)
              cerrarSesion();
          })
      }
    $(".button-collapse").sideNav();
    $('ul.tabs').tabs();
     $('.modal').modal();     
})()


