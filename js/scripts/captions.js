$(document).ready(function(){
	if(localStorage.current_lang == "es"){

		//Index page
		$(".txtTouchToContinue").text("Toque la pantalla para continuar");
		$(".lblPasswordOpt").text("Contraseña");
		$(".lblEmailOpt").text("Correo Electrónico");
		$(".lblEmailPassword").text("Ingrese su contraseña o correo electrónico");
		$(".btnDone").text("Listo");

		//Configuration Page
		$(".lblStoreNo").text("N° Tienda");
		$(".storeNo").attr('placeholder',"Ingrese el número de tienda");
		$(".lblServerId").text("IP del Servidor");
		$(".serverId").attr('placeholder',"Ingrese la IP del servidor");
		$(".btn-save").text("Guardar");
		$(".lblEmail").text("Correo Electrónico");
		$(".emailUser").attr('placeholder',"contacto@email.com");
		$(".lblOldPassword").text("Contraseña anterior");
		$(".lblPassword").text("Nueva Contraseña");
		$(".lblConfirmPassword").text("Confirmar Contraseña");
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
		
		$(".txtPrice").text("Precio");
		$(".sort-dropdown").text("Seleccione");
		$(".lowToHigh").text("Menor a Mayor");
		$(".highToLow").text("Mayor a Menor");

		$(".txtStyleName").text("Estilo:");

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

		//Cart Item Page
		$(".lblCompleteFields").text("Por favor, complete los campos");
		$(".lblName").text("Nombres");
		$(".lblLastName").text("Apellidos");
		$(".lblCartItems").text("Productos agregados");
		$(".btn-clear-cart").text("Limpiar Todo");
		$(".btn-recover").text("Recuperar Carrito");
		$(".btn-done").text("Listo");
		$(".txtEmail").attr('placeholder',"contacto@email.com");
	}
})