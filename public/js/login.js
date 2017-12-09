var recaptchaVerifier = new firebase.auth.RecaptchaVerifier('captha',{
	size : 'invisible'
});

//Renderisamos el Google Captcha
recaptchaVerifier.render().then(function(widgetId) {
  window.recaptchaWidgetId = widgetId;
});


$('#frm-phone').submit(function(e){
	e.preventDefault();
	//1 ->  ENVIO SMS
	//2-> VALIDO EL CODIGO 

	let proceso 	=	$(this).data('proceso');
	console.log('Proceso ', proceso);

	if(proceso == 1){
		enviarSMS();
	}else if(proceso == 2){
		verificarCodigo();
	}
});




enviarSMS = function(){

	let phone = $('#phone').intlTelInput("getNumber");
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
	firebase.auth().signInWithPhoneNumber(phone, recaptchaVerifier)
		    .then(function (confirmationResult) {
		      // SMS sent. Prompt user to type the code from the message, then sign the
		      // user in with confirmationResult.confirm(code).
		      window.confirmationResult = confirmationResult;
		      console.log('enviado?')

		      //ACtivamos eeste input
		      $('#btn_change').fadeIn();
			  $('#frm-phone').data('proceso',2);
	      	  $('#div-code').fadeIn();
	      	  $('#btn_phone').html('Registrar');


		    }).catch(function (error) {

				console.log('error',error)

			  // Error; SMS not sent
			  // ...
			  //
				grecaptcha.reset(window.recaptchaWidgetId);

				// Or, if you haven't stored the widget ID:
				recaptchaVerifier.render().then(function(widgetId) {
					grecaptcha.reset(widgetId);
				});
			}
		);


}





verificarCodigo = function(){


	var code = $('#code').val();
	console.log('Codigo',code);
	//getCodeFromUserInput();



	window.confirmationResult.confirm(code).then(function (result) {
		// User signed in successfully.
		console.log(result);
		
		var user = result.user;

		user.updateProfile({
			displayName: "Usuario"  + user.phoneNumber,
			email: 	"edwinbalbin@outlook.com",
		}).then(function() {
			// Update successful.
			location.href = "/app";
			console.log('actualizado')
		}, function(error) {
			// An error happened.
		});
		//actualizamos su nombrE?
		// ...
	}).catch(function (error) {

		console.log('Error',error)
	  // User couldn't sign in (bad verification code?)
	  // ...7
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