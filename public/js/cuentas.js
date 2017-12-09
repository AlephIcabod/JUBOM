(function(){
    const asociados=document.getElementById("asociados")
    const asociar=document.getElementById("asociar")
    verificarSesion(
        function(user){
            user.providerData.forEach(p => {                
                console.log(p)
                const name=p.providerId.split(".")[0]
                let nuevo=document.createElement('li')
                if (name!="phone"){
                    asociar.querySelector(`.${name}`).classList.add('hide')
                    nuevo.innerHTML=`<img src="${p.photoURL}" alt="" class="circle">
                    <span class="title">${p.displayName}</span>
                    <p>${name}</p>`
                }else{
                    nuevo.innerHTML=`<i alt="" class="circle material-icons">phone_android</i>
                    <span class="title">${p.phoneNumber}</span>
                    <p>Celular</p>`
                }                
                nuevo.classList.add('collection-item')
                nuevo.classList.add('avatar')
                
                asociados.appendChild(nuevo)
            });        
        }
    )
    

})()