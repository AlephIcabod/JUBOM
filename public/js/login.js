var recaptchaVerifier = new firebase.auth.RecaptchaVerifier('captha',{
	size : 'invisible'
});

//Renderisamos el Google Captcha
recaptchaVerifier.render().then(function(widgetId) {
  window.recaptchaWidgetId = widgetId;
});


$('#frm-phone').submit(function(e){
	e.preventDefault();
	let proceso =$(this).data('proceso');	
	if(proceso == 1){
		enviarSMS();
	}else if(proceso == 2){
		verificarCodigo();
	}
});




enviarSMS = function(){
	let phone = $('#phone').intlTelInput("getNumber");
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
	firebase.auth().signInWithPhoneNumber(phone, recaptchaVerifier)
		    .then(function (confirmationResult) {		      
		      window.confirmationResult = confirmationResult;		      
		      $('#btn_change').fadeIn();
			  $('#frm-phone').data('proceso',2);
	      	  $('#div-code').fadeIn();
	      	  $('#btn_phone').html('Registrar');
		    }).catch(function (error) {
				console.log('error',error)
				grecaptcha.reset(window.recaptchaWidgetId);
				recaptchaVerifier.render().then(function(widgetId) {
					grecaptcha.reset(widgetId);
				});
			}
		);


}





verificarCodigo = function(){
	var code = $('#code').val();
	window.confirmationResult.confirm(code).then(function (result) {

		var user = result.user;

		user.updateProfile({
			displayName: "Usuario"  + user.phoneNumber			
		}).then(function() {
			location.href = "/app";
			console.log('actualizado')
		}, function(error) {		
		});
		
	}).catch(function (error) {

		console.log('Error',error)

	 	$('#code_error').text(error.message);
	 	

	});

}


reiniciar = function(){

	// Or, if you haven't stored the widget ID:
	recaptchaVerifier.render().then(function(widgetId) {
		grecaptcha.reset(widgetId);
	});

			
	$('#frm-phone').data('proceso',1);
  	$('#div-code').fadeOut();
  	$('#btn_phone').html('ENVIAR SMS');
}