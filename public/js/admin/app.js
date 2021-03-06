const MY_KEY = 'AIzaSyCjgxxmv7gKm-EcLNiod3Ub31oTzKNo8p8';
const TARGETID = "video";

let config = {
    apiKey: "AIzaSyCKIEvZXPu8dyWyflhOZ65vSJ9ZbSk1_fc",
    authDomain: "jubom-64471.firebaseapp.com",
    databaseURL: "https://jubom-64471.firebaseio.com",
    projectId: "jubom-64471",
    storageBucket: "jubom-64471.appspot.com",
    messagingSenderId: "592109724621"
};
firebase.initializeApp(config);
const database = firebase.database();
let playList = database.ref("/videos");
playList.on("child_added", agregaADOM);
playList.on("child_removed", eliminaDeDOM);
let key;
let primero = false;


function agregaADOM(datos, previo) {

    let data = datos.val();
    let titulo = data.text.split('#&')[0];
    let artista = data.text.split('#&')[1];
    $("#playlist ul").append(`<li id="${datos.key}" data-cancion="${titulo} ${artista}" data-text="${data.text}" data-usuario="${data.usuario}">Cancion: ${titulo}. Artista: ${artista}</li>`);
    if (!primero) {
        primero = true;
        key = datos.key;
        insertVideoInTargetId(data.video, TARGETID);
        database.ref("/videos/" + key).set({
            text: datos.val().text,
            usuario: datos.val().usuario,
            video: datos.val().video,
            activa: true,
        })
    }
}

function eliminaDeDOM(datos, previo) {
  //  $(`#${datos.key}`).remove();
  let ul=document.querySelector("#playlist ul");
  let first = document.querySelector("#playlist ul li");
    ul.removeChild(first)
    if (datos.val().activa) {
        first = document.querySelector("#playlist ul li");
        if(!first){
            primero=false;
            let content = document.querySelector("#container");
            let child = document.getElementById(TARGETID);
            content.removeChild(child);
            return;
        }
        insertVideoInTargetId(first.dataset.cancion,TARGETID);
        key=first.id;
        database.ref("/videos/" + first.id).set({
            text: first.dataset.text,
            usuario: first.dataset.usuario,
            video: first.dataset.cancion,
            activa: true,
        });
    }
}


let insertVideoInTargetId = (query, targetId, funcFinal) => {
    let results = 1;
    let orderType = 'relevance';
    return new Promise((resolve, rejected) => {
        $.ajax({
            url: `https://www.googleapis.com/youtube/v3/search`,
            type: 'GET',
            async: true,
            data: `part=snippet&maxResults=${results}&order=relevance&q=${query}&type=video&fields=items/id/videoId&key=${MY_KEY}`,
            dataType: 'json',
            success: function (json) {
                createVideo(targetId, json.items[0].id.videoId, 720, 1080);
            },
            error: function (xhr, status) {
                rejected("Existio un error.");
            }
        });
    })
}


let createVideo = (targetId, videoId, height, width) => {
    container=document.getElementById("container")
    container.innerHTML=""
    div=document.createElement("div")
    div.id=targetId
    container.appendChild(div)
    let reproductor = new YT.Player(targetId, {
        height: '100%',
        width: '100%',
        videoId: `${videoId}`,
        events: {
            'onReady': function(event){
                event.target.playVideo();    
                done = false;      
            },
            'onStateChange': function(event){
                if (event.data == YT.PlayerState.PLAYING && !done) {
                    //setTimeout(funcionFinal, (reproductor.getDuration() - 1) * 1000);
                    setTimeout(function(){
                        reproductor.stopVideo();
                        database.ref("/videos/" + key).remove();
                    },  (reproductor.getDuration() - 1) * 1000);
                    done = true;
                }        
            }
        }
    });


}

done=false

const verificarSesion=(cb,cb2)=>{
    firebase.auth().onAuthStateChanged(function(user) {
       if (user){
           if (user.providerData.length==1&&user.providerData[0].providerId=="password"){
               if (window.location.pathname=="/admin"){
                    pintarAdminConsola();
                }
           }else{
               window.location.href="/app"
           } 
       }else{ 
            if(window.location.pathname!="/admin")
                window.location.href="/admin"         
            pintarLogin();
       }       
    });
}

verificarSesion();

function loginAdmin(){
    let email=document.getElementById("email").value,
        password=document.getElementById("pass").value
    firebase.auth().signInWithEmailAndPassword(email, password)    
    .catch(function(error) {
        // Handle Errors here.
        Materialize.toast("Credenciales incorrectas",5000);
        // ...
      });

}


function pintarLogin(){
    document.querySelector("main").classList.add("main")
    let container=document.getElementById("containerMain")
    container.innerHTML=`
    <form onsubmit="return false">
        <h3 class="center"> Administración de Jubom</h3>
        <div class="row">
            <div class="input-field text-white">
                <input id="email" type="email" class="validate">
                <label for="email" class=""> Correo electronico</label>
            </div>
            <div class="input-field">
                <input id="pass" type="password" class="validate ">
                <label for="pass" class=""> Contraseña</label>
            </div>
            <div class="input-field right">
                <button class="btn" id="btnLogin" onclick="loginAdmin()"> Entrar</button>
            </div>
        </div>
    </form>`
}

function pintarAdminConsola(){
    document.querySelector("main").classList.remove("main")
    let container=document.getElementById("containerMain")
    container.innerHTML=`
    <nav>
        <div class="nav-wrapper">
        <a href="/admin" class="brand-logo left">Jubom</a>
        <ul id="nav-mobile" class="right hide-on-med-and-down">
        <li><a href="/reproductor">Reproduccion</a></li>
        <li><a onclick="cerrarSesion()">Salir</a></li>        
        </ul>
        </div>
    </nav>
    <div class="container">
    <h3 class="center">Página de administración de Costos de Reproducción</h3>
    <form id="principal">
        <label for="creditos">Créditos por defecto: </label>
        <input type="number" name="creditos" id="creditos" required>

        <label for="costo">Costo de la reproducción:</label>
        <input type="number" name="costo" id="costo" required>

        <label for="totalReproducciones">Ingreso del día</label>
        <input type="number" name="totalReproducciones" id="totReproducciones" disabled>

        <input type="submit" value="Aceptar" class="btn">
    </form>
    </div>`

    cambiarParametros()
}


function cambiarParametros(){    
    let costo = database.ref("/admin/costo");
    let creditos = database.ref("/admin/creditos");
    let costoHTML = document.getElementById("costo");
    let creditosHTML = document.getElementById("creditos");

    let totReproduc = document.getElementById("totReproducciones");
    let fecha = new Date();
    let indexFecha = `${fecha.getDate()}-${fecha.getMonth()+1}-${fecha.getFullYear()}`;
    let datosReproducciones = database.ref("/transacciones/" + indexFecha);

    datosReproducciones.on('value',snap=>{
        if(snap.val().totalTransacciones){
            totReproduc.value = snap.val().totalTransacciones;
        }else{
            totReproduc.value = 0;
        }
    })
    
    costo.on('value',snap=>{
        costoHTML.value = snap.val();
    })
    creditos.on('value',snap=>{
        creditosHTML.value = snap.val();
    })
    document.getElementById("principal").addEventListener("submit",event=>{
        event.preventDefault();
        let cos = parseInt(costoHTML.value);
        let cred = parseInt(creditosHTML.value);            
        database.ref("/admin").set({
            costo:cos,
            creditos:cred
        }).then(()=>Materialize.toast("Cambios guardados exitosamente",5000))
    })
}


function cerrarSesion(){
    firebase.auth().signOut().then(function() {        
        location.href = "/";    
    }).catch(function(error) {        
    });
}