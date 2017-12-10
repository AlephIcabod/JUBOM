const Buscar=(tipo,query)=>{
    return fetch(`/busqueda?tipo=${tipo}&query=${query}`).then(res=>res.json())
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
})()


function BuscarCanciones(query){
    const canciones=document.getElementById("listCanciones")
    Buscar("track",query).then(data=>{
        console.log(data)        
        let items=data.tracks.items;
        canciones.innerHTML="";
        items.forEach(a => {
            canciones.innerHTML+=`
            <li class="collection-item avatar valign-wrapper cancion"
            data-id="${a.id}" data-name="${a.name}" onclick="reproducir(this)">
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
    console.log(el)
}
function abrirAlbum(index){
    let id=index.dataset.id;    
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
            <li class="collection-item avatar valign-wrapper cancion" onclick="reproducir(this)" data-name="${i.name}">              
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
            <li class="collapsible-header collection-item avatar valign-wrapper" data-id="${i.id}" onclick="abrirAlbum(this)" data-image=${i.images[0]?i.images[0].url:''}>
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
    const Loading=document.getElementById("loading")
    let content=document.querySelector("#modal .modal-content")
    Loading.classList.remove('hide')
    fetch("/busqueda/artista/"+id)
    .then(r=>r.json())
    .then(d=>{
        console.log(d)
        Loading.classList.add('hide')
        content.innerHTML+=`
        <ul class="collection">`
        d.tracks.forEach(i=>{
            content.innerHTML+=`
            <li class="collection-item avatar valign-wrapper cancion" onclick="reproducir(this)" data-name="${i.name}">              
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
            data-id="${a.id}" onclick="abrirArtista(this)">
            <img src="${a.images[0]?a.images[0].url:''}" alt="" class="circle" />
            <span class="title"> ${a.name}</span>

            </li>`
              
        });
    })
}