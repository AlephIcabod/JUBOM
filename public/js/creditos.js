(function(){
    const buton=document.getElementById("submit-button")

    braintree.dropin.create({
        authorization: 'sandbox_qwn44pgs_xm3z4md4hcsh2m9z',
        container:"#dropin-container",
        locale: 'es_MX'        
    },function(err,instance){
        buton.addEventListener('click',function(){
            monto=document.getElementById("montoCreditos").value
            instance.requestPaymentMethod(function(reqPayErr,payload){
                $.ajax({
                    type:"POST",
                    url:"/checkout",
                    data:{"payment":payload.nonce,"monto":monto}
                })
                .done(function(res){                    
                    if (res.success){
                        let database=firebase.database();         
                        let userKey=localStorage.getItem("userKey"),            
                            creditosnuevos=parseInt(res.creditos.transaction.amount)                            
                            database.ref("/usuarios/"+userKey).once('value')
                            .then(snap=>{
                                let creditos=snap.val().creditos+creditosnuevos
                                database.ref("/usuarios/"+userKey).set({
                                    nombre:snap.val().nombre,
                                    uid:snap.val().uid,
                                    creditos:creditos
                                })
                            })
                            
                    }else{
                        alert("Hubo un error")
                    }
                })
            })
        })
    })
})()