$(document).ready(function(){
	if(localStorage.current_lang == "es"){

		//Index page
		$(".txtTouchToContinue").text("Toque la pantalla para continuar");
		$(".lblPasswordOpt").text("Contraseña");
		$(".lblEmailOpt").text("Correo Electrónico");
		$(".lblEmailPassword").text("Ingrese su contraseña o correo electrónico");
		$(".btn-access").text("Acceder");

		//Configuration Page
		$(".lblConfig").text("Configuración");
		$(".lblStoreNo").html("N° Tienda<span>*</span>");
		$(".storeNo").attr('placeholder',"Ingrese el número de tienda");
		$(".lblServerId").html("IP del Servidor<span>*</span>");
		$(".serverId").attr('placeholder',"Ingrese la IP del servidor");
		$(".lblPrinter").html("Impresora<span>*</span>");
		$(".btn-save").text("Guardar");
		$(".lblEmail").html("Correo Electrónico<span>*</span>");
		$(".emailUser").attr('placeholder',"contacto@email.com");
		$(".lblOldPassword").html("Contraseña anterior<span>*</span>");
		$(".lblPassword").html("Nueva Contraseña<span>*</span>");
		$(".lblConfirmPassword").html("Confirmar Contraseña<span>*</span>");
		$(".btn-finish").text("Finalizar");

		//Search page
		$(".txtGenderFilter").text("Género");
		$(".txtBrandFilter").text("Marca");
		$(".txtTypeFilter").text("Tipo");
		$(".txtSizeFilter").text("Talla");

		$(".btnClearSearch").text("Limpiar Búsqueda");
		$(".btnFilter").text("Aplicar Filtros");

		$(".notfound").text("No se han encontrado resultados");
		$(".lblClearFilters").text("Remover filtros");
		
		$(".txtSortby").text("Ordenar por ");
		if(localStorage.flag3orless == 1 && localStorage.threeOrLessOrderResults == "") $(".sort-dropdown").text("Seleccione");
		if(localStorage.flag3orless == 0 && localStorage.kioskOrderResults == "") $(".sort-dropdown").text("Seleccione");
		// $(".lowToHigh").text("Menor a mayor");
		// $(".highToLow").text("Mayor a menor");

		$(".txtStyleName").text("Estilo:");
		$(".appName3orless").text("Tres o menos");
		$(".appNameKiosk").text("Catálogo Kiosko");

		if(localStorage.flag3orless == 0){
			$(".appName3orless").text("Catálogo Kiosko");
		}

		//Product Detail Page
		$(".lblStyle").text("Estilo: ");
		$(".lblPrice").text("Precio:");
		$(".lblSize").text("Talla:");
		$(".lblOnHand").text("Unidades:");

		$(".lblRelatedProduct").text("Productos Relacionados");
		$(".txtNoRelated").text("No hay productos relacionados");

		$(".btn-back").text("Regresar");
		$(".btn-add-continue").text("Agregar y continuar");
		$(".btn-add-finish").text("Agregar y finalizar");
		$(".btn-CheckStores").text("Ver otras tiendas");

		//Cart Item Page
		$(".lblCompleteFields").text("Por favor, complete los campos");
		$(".lblName").html("Nombre<span>*</span>");
		$(".lblLastName").html("Apellido<span>*</span>");
		$(".lblCartItems").text("Productos agregados");
		$(".btn-clear-cart").text("Limpiar Todo");
		$(".btn-recover").text("Recuperar Carrito");
		$(".btn-done").text("Ticket");
		$(".txtEmail").attr('placeholder',"contacto@email.com");
		$(".detail-count-text1").text("Usted tiene ");
		$(".detail-count-text2").text(" producto(s) en su carrito.");


		//Registration Page
		$(".lblInstructions").text("Por favor, complete los campos requeridos para suscribirse");
		$(".lblNumber").html("Teléfono");
		$(".lblBirthDate").html("Fecha de Nacimiento");
		$(".appNameRegistration").text("Registro Cliente");
		$(".btn-submit").text("Enviar");
		$(".modal-title").text("Seleccione su fecha de nacimiento");
		
		//Menu Page
		$(".option1").text("Registro Cliente");
		$(".option2").text("Catálogo Kiosko");
		$(".option3").text("Tres o menos");

		//Order Page
		$(".btn-order").html("Ordenar")

		//Scan Product
		$(".txtSKU").attr('placeholder','Escanear producto');
		$(".txtScan").attr('placeholder','Escanear producto');

	}
	else{
		if(localStorage.flag3orless == 0){
			$(".appName3orless").text("Kiosk Catalog");
		}
	}
})