const braintree=require("braintree"),
    router=require("express").Router(),
gateway = braintree.connect({
    environment:  braintree.Environment.Sandbox,
    merchantId:   'xm3z4md4hcsh2m9z',
    publicKey:    'gmxm9bdmqs2rjzwr',
    privateKey:   'cc11d50405e7de8e201732dafaeb4e78'
});


router.post("/",(req,res,next)=>{
    const method=req.body.payment,
        monto=req.body.monto
     gateway.transaction.sale({
        amount:monto,
        paymentMethodNonce:method,
        options:{
            submitForSettlement:true
        }
     },function(err,result){         
        if (result){
            console.log(result.Transaction)
            res.status(200).json({message:"ok",success:result.success,creditos:result})
        }else{
            res.status(400).json({message:"No ok",result:err})
        }
     })
})

module.exports=router