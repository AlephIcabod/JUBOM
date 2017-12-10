var COSTO=5;

const Buscar=(tipo,query)=>{
    showLoading()
    let content=document.querySelector("#modal .modal-content");
    content.innerHTML=""
    return fetch(`/busqueda?tipo=${tipo}&query=${query}`).then(res=>{
        hideLoading(); return res.json()})
}

(function(){      
    document.getElementById("buscarArtista").addEventListener("keyup",e=>{      
        if(e.keyCode==13){            
            BuscarArtists(e.target.value)
        }
    })
    document.getElementById("buscarAlbum").addEventListener("keyup",e=>{      
        if(e.keyCode==13){            
            BuscarAlbums(e.target.value)
        }
    })
    document.getElementById("buscarCancion").addEventListener("keyup",e=>{      
        if(e.keyCode==13){            
            BuscarCanciones(e.target.value)
        }
    })

    BuscarAlbums("a")
    BuscarArtists("a")
    BuscarCanciones("a")
    initLista();
})()


function BuscarCanciones(query){
    const canciones=document.getElementById("listCanciones")
    Buscar("track",query).then(data=>{        
        let items=data.tracks.items;
        canciones.innerHTML="";
        items.forEach(a => {
            canciones.innerHTML+=`
            <li class="collection-item avatar valign-wrapper cancion"
            data-id="${a.id}" data-name="${a.name} ${a.artists[0].name} ${a.album.name}" data-text="${a.name}#&${a.artists[0].name}#&${a.album.name}" onclick="reproducir(this)">
            <img src="${a.album.images[0]?a.album.images[0].url:''}" alt="" class="circle" />
            <div>
            <p class="title"> ${a.name}</p>
            <p > ${a.artists[0].name}-- ${a.album.name} -- $5</p>
            </div>
            </li>`              
        });
    })
}

function reproducir(el){
    let nombre=el.dataset.name;
    let userKey=localStorage.getItem("userKey")
    let database=firebase.database();
    let cola=database.ref("/videos")
    let text=el.dataset.text   
    database.ref("/usuarios/"+userKey).once('value')
    .then(snap=>{        
        let uid=snap.val().uid
        let creditos=snap.val().creditos
        if (creditos>=COSTO){
        let video=cola.push({usuario:uid,video:nombre,text:text})
        database.ref("/usuarios/"+userKey).set({
            nombre:snap.val().nombre,
            uid:snap.val().uid,
            creditos:creditos-COSTO
        }).then((r)=>{
            Materialize.toast("Se ha agregado una cancion a la lista",4000);
            $("#modal").modal("close")
        })
        }else{
            Materialize.toast("No tienes suficientes creditos para agregar canciones, compra más créditos",4000);
            $("#modal").modal("close")
        }
    });
}


function abrirAlbum(index){
    let id=index.dataset.id;
    let album=index.dataset.album;    
    const Loading=document.getElementById("loading")
    let content=document.querySelector("#modal .modal-content")
    Loading.classList.remove('hide')
    fetch("/busqueda/album/"+id)
    .then(r=>r.json())
    .then(d=>{
        Loading.classList.add('hide')
        content.innerHTML+=`
        <ul class="collection">`
        d.items.forEach(i=>{
            content.innerHTML+=`
            <li class="collection-item avatar valign-wrapper cancion" onclick="reproducir(this)" data-name="${i.name} ${i.artists[0].name} ${album}" data-text="${i.name}#&${i.artists[0].name}#&${album}">              
              <div>
                <p class="title">${i.name}</p>              
                <small> ${i.artists[0].name} -- $5 </small>
              </div>
              <a href="#!" class="rigth-align">
                <i class="material-icons"> play_arrow</i>
                </a>
            </li>
            `
        })
        content.innerHTML+="</ul>"        
        $("#modal").modal('open')
    })
}

function BuscarAlbums(query){
    const albums=document.getElementById("listAlbums")
    let lista=albums.querySelector(".collapsible")
    albums.removeChild(lista)
    lista=document.createElement("ul")
    lista.classList.add("collapsible","collection")
    lista.dataset.collapsible="accordion"    
    Buscar("album",query)
    .then(data=>{              
        const items=data.albums.items
        items.forEach((i,j)=>{
            lista.innerHTML+=`  
            <li class="collapsible-header collection-item avatar valign-wrapper" data-id="${i.id}" data-album="${i.name}" onclick="abrirAlbum(this)" data-image=${i.images[0]?i.images[0].url:''}>
              <img src="${i.images[0]?i.images[0].url:''}" alt="" class="circle"/>
              <div>
              <p class="title"> ${i.name}</p>
              <p>${i.artists[0].name}</p>
              </div>            
            </li>`

        })
        albums.appendChild(lista)
    })

    

    
}


function abrirArtista(el){
    let id=el.dataset.id;
    let artista=el.dataset.artista;    
    const Loading=document.getElementById("loading")
    let content=document.querySelector("#modal .modal-content")
    Loading.classList.remove('hide')
    fetch("/busqueda/artista/"+id)
    .then(r=>r.json())
    .then(d=>{        
        Loading.classList.add('hide')
        content.innerHTML+=`
        <ul class="collection">`
        d.tracks.forEach(i=>{
            content.innerHTML+=`
            <li class="collection-item avatar valign-wrapper cancion" onclick="reproducir(this)" data-name="${i.name} ${artista} ${i.album.name}" data-text="${i.name}#&${artista}#&${i.album.name}">              
              <div>
                <p class="title">${i.name}</p>              
                <small> ${i.album.name} -- $5 </small>
              </div>
              <a href="#!" class="rigth-align">
                <i class="material-icons"> play_arrow</i>
                </a>
            </li>
            `
        })
        content.innerHTML+="</ul>"        
        $("#modal").modal('open')
    })
}

function BuscarArtists(query){
    const artistas=document.getElementById("listArtistas")
    Buscar("artist",query).then(data=>{        
        let items=data.artists.items;
        artistas.innerHTML="";
        items.forEach(a => {
            artistas.innerHTML+=`
            <li class="collection-item avatar valign-wrapper artista"
            data-id="${a.id}" data-artista="${a.name}" onclick="abrirArtista(this)">
            <img src="${a.images[0]?a.images[0].url:''}" alt="" class="circle" />
            <span class="title"> ${a.name}</span>

            </li>`
              
        });
    })
}

function initLista(){
    let database=firebase.database();
    let cola=database.ref("/videos")
    let lista=document.getElementById("reproductorList")   
    lista.innerHTML="";
    let user=localStorage.getItem("userID")
    showLoading();    
    cola.on("child_added",function(snap){updateLista(snap)})
    cola.on("child_removed",function(snap){removeElement(snap)})
}

function removeElement(snap){
    let li =document.getElementById(snap.key)
    let lista=document.getElementById("reproductorList")
    lista.removeChild(li)

}

function updateLista(nuevo){    
    let lista=document.getElementById("reproductorList"),
    li=document.createElement("li"),
    cancion=nuevo.val(),
    datos=cancion.text.split("#&")
    let user=localStorage.getItem("userID")
    li.classList.add("collection-item","avatar")
    li.dataset.idCancion=nuevo.key
    li.id=nuevo.key
    if (cancion.usuario===user){
        li.innerHTML=`<span class="title">${datos[0]}</span>
        <p>Artista: ${datos[1]}<br>
           Album: ${datos[2]} 
        </p>
        <a href="#!" class="secondary-content"><i class="material-icons red-text">delete</i></a>`
        li.querySelector("a").addEventListener("click",(e)=>eliminarCancion(li))
    }else{
        li.innerHTML=`<span class="title">${datos[0]}</span>
        <p>Artista: ${datos[1]}<br>
           Album: ${datos[2]} 
        </p>`
    }
    lista.appendChild(li)
    
}

function eliminarCancion(e){
    let id=e.dataset.idCancion
    let lista=document.getElementById("reproductorList")
    let database=firebase.database();
    database.ref("/videos/"+id).set(null)
    .then(function(){        
        Materialize.toast("Se ha eliminado una cancion de la lista",4000);
    })

}