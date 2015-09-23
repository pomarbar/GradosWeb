// Grados Web 2015 
// Software para la percepción y el reconocimiento de los grados en escalas modo-tonales
// Autor: Pedro Omar Baracaldo R. profesor asociado, departamento de música, Universidad de los Andes
// email: pbaracal@uniandes.edu.co

var listaGrados = [];
var tonMayor = [0,2,4,5,7,9,11,12];
var tonMenorNatural = [0,2,3,5,7,8,10,12];
var tonMenorArmonica = [0,2,3,5,7,8,11,12];
var tonMenorMelódica = [0,2,3,5,7,9,11,12];
var tonUsuario = []; // Vacío al iniciar.
var tonica = 7; // Do al iniciar.
var etiquetasMayor = ['FA','FA#/SOLb','SOL','LAb','LA','SIb','SI/DOb','DO','DO#/REb','RE','MIb','MI'];
var etiquetasMenor = ['fa','fa#','sol','sol#/lab','la','la#/sib','si','do','do#','re','re#/mib','mi'];
var modo = 0; // variable para cargar el modo correspondiente: 0 = Mayor, 1 = menor natural, 2 = menor armónico y 3 = menor melódico.
var nomtonMayor = ['FA Mayor','FA# Mayor','SOL Mayor','LAb Mayor','LA Mayor','SIb Mayor','SI Mayor','DO Mayor','DO# Mayor','RE Mayor','MIb Mayor','MI Mayor'];
var listaSonidos = ['Fa3.mp3','Fas3.mp3','Sol3.mp3','Lab3.mp3','La3.mp3','Sib3.mp3','Si3.mp3','Do4.mp3','Dos4.mp3','Re4.mp3','Mib4.mp3','Mi4.mp3','Fa4.mp3','Fas4.mp3','Sol4.mp3','Lab4.mp3','La4.mp3','Sib4.mp3','Si4.mp3','Do5.mp3','Dos5.mp3','Re5.mp3','Mib5.mp3','Mi5.mp3'];
var mover = false;
var teclas = ['tecla1.png','tecla2.png','tecla3.png','tecla4.png','tecla5.png','tecla6.png','tecla7.png','tecla8.png','tecla9.png','tecla10.png','tecla11.png','tecla12.png','tecla13.png','tecla14.png','tecla15.png','tecla16.png','tecla17.png','tecla18.png','tecla19.png','tecla20.png','tecla21.png','tecla22.png','tecla23.png','tecla24.png'];
var coordsTeclado = [60,73,86,99,112,125,138,164,177,190,203,216];
var idTonalidades = ["#FA", "#FAs", "#SOL", "#LAb", "#LA", "#SIb", "#SI", "#DO", "#DOs", "#RE", "#MIb", "#MI"];
var gradoGrafs = ["grado1.png","grado2.png","grado3.png","grado4.png","grado5.png","grado6.png","grado7.png","grado8.png","gradop.png"];
var posMarcasSerie = [458, 498, 538, 578, 617, 656, 696, 736, 775, 815];
var tamañoSerie = 0;
var respuestasGrados = [0,0,0,0,0,0,0,0];
var grado = 0;
var gradoSelUsuario = 10;
var posGradop = 0; // guarda posición de gradop cuando el usuario hace click en gradop y queda fijo frente a algún grado
var meta = 0; // cantidad de ejercicios
var nota = 0;
var audioElement = null;
var arpegio = [0,2,4,7];
var aciertos = 0;
var pifias = 0;
var estado = 0; // 20 = Entrada al programa. Ajustar tamaño de serie de grados.
				// 0 = Ajustar meta inicial
				// 1 = Seleccione una tonalidad
				// 2 = esta sonando una tonalidad
				// 3 = esperando un nuevo sonido
				// 4 = oye nuevo sonido, entra gradop
				// 5 = (gradop esta fuera de los grados) espera a que gradop se ubique en un grado
				// 6 = espera que usuario evalue. permiter mover gradop a otro grado
				// 7 = evalua respuesta de gradop
				// 8 = escucha parte de tonalidad cuando no se ha elegido un nuevo sonido
				// 9 = escucha parte de tonalidad después de ha ber elegido un nuevo sonido
				// 10 = confirma si quiere un nuevo sonido, antes de ubicar gradop
				// 11 = escucha parte de tonalidad después de haber ubicado gradop en algún grado
				// 12 = repite sonido después de ubicar gradop
				// 13 = confirma si quiere un nuevo sonido, después de ubicar gradop

// Mientras que lo retornado por funCondicion sea verdadero ejecuta funAccion, 
// entre una ejecución y otra hace una pausa de espera milisegundo.
// Una vez termina la ejecución porque la función funCondicion retorna falso ejecuta funDespues
// Inspirado en
//   http://stackoverflow.com/questions/210821/how-can-i-give-control-back-briefly-to-the-browser-during-intensive-javascript
function mientras_con_espera(funCondicion, funAccion, espera, funDespues) {
	var f = function () {
		if (funCondicion()) {
			funAccion();
			setTimeout( f, espera)
		} else {
			funDespues();
		}
  	};
	f();
}

function iniGrados() {
	for (var i = 0; i < listaSonidos.length; i++) {
		var cad = "<audio class = 'aud' src = '" + listaSonidos[i] + "' id = '" + 
			"son" + i + "' preload = 'auto'></audio>";
		$("#audios").append(cad);
	};
}
// Funcion para tocar y/o mostrar el grado seleccionado
// @p param grad = número del grado, entre 0 y 7
// @ param tocar = boolean, solo toca el grado si es verdadero
// @ param ver = boolean, solo muestra el grado en el teclado si es verdadero
function tocarGrado(grad, tocar, ver)
 {
 	var son = tonica + tonUsuario[grad];
 	
 	if (ver) {
 		document.getElementById('teclado').src = teclas[son];
 	};
 	if (tocar) {
 		
		audioElement = document.getElementById('son' + son);
		if (audioElement == null) {
			alert("No se encontró elemento de audio son" + son);
		} else{
			audioElement.play();
		};
	};
 }

// Funcion que selecciona un número al azar dentro de un rango dado
function aleatorio(minimo, maximo) {
	var numero = Math.floor(Math.random() * (maximo - minimo + 1) + minimo);
	return numero;
}


function seleccionarGrado(){
	if (listaGrados.length == 0){
		listaGrados = [0,1,2,3,4,5,6,7];
	}
	var g = aleatorio(0,listaGrados.length - 1);
	cambiarOpacityGrados(0.5);
	grado = listaGrados[g];
	listaGrados.splice(g,1);
	tocarGrado(grado, true, false);
	return grado;
}

// Esta funcion debe llamarse al final, si quiere algo despues, hacerlo a traves de FUNCIONDESPUES
// @param sel selector de los elementos a mover
function animarHorizontal(sel, xinicial, xfinal, tamPaso, tempo,funcionDespues) {
	$(sel).css('left', xinicial);
	mientras_con_espera( 
			function() {
				var x = $(sel).position().left;
				if (xinicial < xfinal) {
					return x < xfinal;
				} else {
					return x > xfinal;
				}
			},
			function() {
				var x = $(sel).position().left
				if (xinicial < xfinal) {
					x += tamPaso;
				} else {
					x -= tamPaso;
				}
				$(sel).css('left', x)
			},
			tempo,
			function() {
				if (funcionDespues != null) {
					funcionDespues()
				}
			}
		)
}


function esperaMoverGrado() {
	estado = 5;
	// $("#gradop").on("dragstart", "", function (evento) {
	// 	drag(evento);
	// });
	$("#gradop").appendTo("#pantprinc");
	$("#gradop").css("position", "absolute");
	$("#gradop").css("left", 490);
	$("#gradop").css("top", 140);

	for (var i = 1; i < 9; i++) {
		//$(document).ready(function(){
			(function(){
			var nom1 = "#grado" + i ;
			var nom = nom1 + "-1";
			var s = (tonica + 1) + tonUsuario[i-1];
			var nom2 = "tecla" + s + ".png";
	      $("#grado" + i + "-1").hover(  // función para mover grado ? frente a grados de respuesta.
	        function(event){
	            //debugger
	            cambiarOpacityGrados(0.5);
	            $("#gradop").appendTo(nom);
	            $("#gradop").css("position", "relative");
	            $("#gradop").css("left", 0);
	            $("#gradop").css("top", 0);
	            $("#sombraGrados").css("display", "inline");
	            var x = $(nom).position();
	            $("#sombraGrados").css("top", x.top + 1);
	            $(nom1).css("opacity", 0.9); //resalta el grado seleccionado
	            document.getElementById('teclado').src = nom2;
	        },
	        function(event){
	            $("#gradop").appendTo("#pantprinc");
	            $("#gradop").css("position", "absolute");
	            $("#gradop").css("left", 490);
	            $("#gradop").css("top", 140);
	            $("#sombraGrados").css("display", "none");
	            $(nom1).css("opacity", 0.5); //devuelve la transparencia baja del grado
	            document.getElementById('teclado').src = "teclado.png";
	        }
	      );
	  	})();
	    //});

		$("#gradop").click(function(){	// Desactiva la función HOVER
			var p = $("#gradop").position();
			// Este condicional evita que se desactive el efecto HOVER si gradop no está
			// ubicado en uno de los círculos punteados para recibir respuesta. Evita pasar al
			// siguiente estado donde el programa espera que el usuario pida EVALUAR su respuesta.
			if (p.top !== 140) {
				$("#grado1-1").unbind("mouseenter mouseleave");
				$("#grado2-1").unbind("mouseenter mouseleave");
				$("#grado3-1").unbind("mouseenter mouseleave");
				$("#grado4-1").unbind("mouseenter mouseleave");
				$("#grado5-1").unbind("mouseenter mouseleave");
				$("#grado6-1").unbind("mouseenter mouseleave");
				$("#grado7-1").unbind("mouseenter mouseleave");
				$("#grado8-1").unbind("mouseenter mouseleave");

				$("#grado1-1").click(function() { // Criterio para evaluar seleccion de usuario
	   				posGradop = 0;
				});
				$("#grado2-1").click(function() {
	   				posGradop = 1;
				});
				$("#grado3-1").click(function() {
	   				posGradop = 2;
				});
				$("#grado4-1").click(function() {
	   				posGradop = 3;
				});
				$("#grado5-1").click(function() {
	   				posGradop = 4;
				});
				$("#grado6-1").click(function() {
	   				posGradop = 5;
				});
				$("#grado7-1").click(function() {
	   				posGradop = 6;
				});
				$("#grado8-1").click(function() {
	   				posGradop = 7;
				});
				estado = 6; // espera evaluar principalmente
				$("#encabezado").css("color","lime");
	    		$("#encabezado").text("Evalúe su respuesta");
	    	};
		});
	};
	
	// pasa a estado 6 cuando se ubique gradop en algún grado o
	// a estado 9 si oprime boton oir tonalidad
	
}

function esperarFinAudio() {
	if (!audioElement.ended) {
		setTimeout(esperarFinAudio, 100);
	}
}

function cambiarOpacityGrados(num) {
	$("#grado1").css("opacity",num);
	$("#grado2").css("opacity",num);
	$("#grado3").css("opacity",num);
	$("#grado4").css("opacity",num);
	$("#grado5").css("opacity",num);
	$("#grado6").css("opacity",num);
	$("#grado7").css("opacity",num);
	$("#grado8").css("opacity",num);
}

function ajustarTonalidad(num, $obj) {
	estado = 2;
	listaGrados = [0,1,2,3,4,5,6,7];
	tonica = num;
	
	$("#teclado").css('top', coordsTeclado[num]);
	$("#grado1").css('left', 340);
	$("#grado2").css('left', 340);
	$("#grado3").css('left', 340);
	$("#grado4").css('left', 340);
	$("#grado5").css('left', 340);
	$("#grado6").css('left', 340);
	$("#grado7").css('left', 340);
	$("#grado8").css('left', 340);
	cambiarOpacityGrados("0.9");

	$(".tonal").css('border', "2px solid rgb(60,60,60)"); // asi se llama una clase de objetos.
	$(".tonal").css('color', "rgb(60,60,60)");
	$obj.css('border', "2px solid rgb(210,100,20)");
	$obj.css('color', "rgb(0,100,255)");

	animarHorizontal("#grado1", 340, 410, 1, 10, function() {
		esperarFinAudio();
		animarHorizontal("#grado2", 340, 410, 1, 10, function() {
			esperarFinAudio();
			animarHorizontal("#grado3", 340, 410, 1, 10, function() {
				esperarFinAudio();
				animarHorizontal("#grado4", 340, 410, 1, 10, function() {
					esperarFinAudio();
					animarHorizontal("#grado5", 340, 410, 1, 10, function() {
						esperarFinAudio();
						animarHorizontal("#grado6", 340, 410, 1, 10, function() {
							esperarFinAudio();
							animarHorizontal("#grado7", 340, 410, 1, 10, function() {
								esperarFinAudio();
								animarHorizontal("#grado8", 340, 410, 1, 10, function() {
									esperarFinAudio();
									document.getElementById('teclado').src = "teclado.png";
									estado = 3;
									$("#encabezado").css("color","rgb(0,200,255)");
									$("#encabezado").text("Escoge un Nuevo sonido");
									setTimeout(cambiarOpacityGrados("0.5"), 800);
								});
								tocarGrado(7,true, true);
								});
							tocarGrado(6,true,true);
							});
						tocarGrado(5,true,true);
						});
					tocarGrado(4,true,true);
					});
				tocarGrado(3,true,true);
				});
			tocarGrado(2,true,true);
			});
		tocarGrado(1,true,true);
	});
	tocarGrado(0,true,true);
}

function ajustarMenusAGris() {
	// Ajusta a gris menú Meta
	$(".meta").css('border', "2px solid rgb(60,60,60)"); // asi se llama una clase de objetos.
	$(".meta").css('color', "rgb(60,60,60)");
	$("#meta").css('color', "rgb(60,60,60)");
	$("#marcoMeta").css('border', "2px solid rgb(60,60,60)");
	// Ajusta a gris menú Escala
	$("#tituloModos").css("color","rgb(60,60,60)");
	$("#marcoModos").css("border","1px solid rgb(60,60,60)");
	$(".modo").css('border', "2px solid rgb(60,60,60)");
	$(".modo").css('color', "rgb(60,60,60)");
	// Ajusta a gris menú Tonalidad
	$(".tonal").css('border', "2px solid rgb(60,60,60)"); // asi se llama una clase de objetos.
	$(".tonal").css('color', "rgb(60,60,60)");
	$("#marcoTonalidades").css('border', "2px solid rgb(60,60,60)");
	$("#titulo").css('color', "rgb(60,60,60)");
	// Ajusta a gris marcadores y los pone en ceros
	$("#marcador1").css("color","rgb(60,60,60)");
	$("#marcador2").css("color","rgb(60,60,60)");
	$("#marcador1").text("0");
	$("#marcador2").text("0");
}

function guardarGrados() {
	// Esconde gradop y su sombra azul
	$("#gradop").css("display", "none");
	$("#sombraGrados").css("display", "none");
	// Ajusta al teclado en 'blanco'
	document.getElementById('teclado').src = "teclado.png";
	// Guarda grados
	animarHorizontal("#grado1", 410, 340, 1, 10, function() {});
	animarHorizontal("#grado2", 410, 340, 1, 10, function() {});
	animarHorizontal("#grado3", 410, 340, 1, 10, function() {});
	animarHorizontal("#grado4", 410, 340, 1, 10, function() {});
	animarHorizontal("#grado5", 410, 340, 1, 10, function() {});
	animarHorizontal("#grado6", 410, 340, 1, 10, function() {});
	animarHorizontal("#grado7", 410, 340, 1, 10, function() {});
	animarHorizontal("#grado8", 410, 340, 1, 10, function() {});
}

function evaluar() {
	estado = 7;
	var lisRom = ["I.", "II.", "III.", "IV.", "V.", "VI.", "VII.", "I agudo."];
	if (grado == posGradop) {
		$("#encabezado").css("color","rgb(210,255,255)");
		$("#encabezado").text("Muy bien, ha sonado el grado " + lisRom[posGradop]);
		document.getElementById("gradop").src = gradoGrafs[grado];
		esperarTocarGrado(grado, true,true, 1500, function() {
		aciertos++;
		$("#marcador1").text(aciertos);
		$("#sombraGrados").css("display", "none");
		$("#encabezado").css("color","rgb(0,255,255)");
		$("#encabezado").text("Selecciona un Nuevo sonido");
		$(".g1").css("background-color","");
		if (aciertos >= meta) {
			$("#encabezado").css("color","yellow");
			$("#encabezado").text("¡ Muy bien ! has alcanzado la meta propuesta.");
			estado = 0;
			setTimeout(guardarGrados, 1000);
			setTimeout(ajustarMenusAGris, 2000);
			setTimeout(titulo2, 2500);
		} else {
			estado = 3;
		}});
	} else {
		$("#encabezado").css("color","white");
		$("#encabezado").text("Intenta con otro grado.");
		var nom = "#grado" + (posGradop + 1) + "-1"; 
		$(nom).css("background-color","rgb(50,50,50)"); // marca con gris el sonido equivocado
		$(nom).unbind("mouseenter mouseleave"); // desactiva efecto HOVER, no permite una segunda respuesta en este grado
		if (respuestasGrados[posGradop] == 1) { // evita que el usuario evalúe un sonido equivocado mas de una vez
			$("#encabezado").text("Pruebe ubicando el sonido ? frente a otro grado.");
			esperaMoverGrado();
		} else{
			respuestasGrados[posGradop] = 1; //controlador para evitar contar dos o mas veces como error el mismo grado
			pifias++;
			$("#marcador2").text(pifias);
			esperaMoverGrado();
		};	
	};
	gradoSelUsuario = posGradop;
}

function seleccionarTonalidad() {
	estado = 1;  // espera a que se oprima un boton de tonalidad.
	$("#gradop").css("display", "none");
	$("#sombraGrados").css("display", "none");
	$("#marcador1").text(aciertos);
	$("#marcador2").text(pifias);
	document.getElementById('teclado').src = "teclado.png";

	$("#marcoTonalidades").css('border', "1px solid rgb(0,124,250)");
	$("#titulo").css('color', "rgb(210,100,20)");
	$(".tonal").css('border', "2px solid rgb(80,80,80)");
	$(".tonal").css('color', "rgb(80,80,80)");
	$("#encabezado").css("color","rgb(0,180,255)");
    $("#encabezado").text("Selecciona una tonalidad.");

}

function activarHover(lista1Objetos, lista2Objetos) {
	
	for (var i = lista1Objetos.length - 1; i >= 0; i--) {
		n = lista1Objetos[i];
		m = lista2Objetos[i];
		$(n).hover(function(){
	    	$(n).css("color", "rgb(170,170,170)");
	    	$(m).css("opacity","0.9");
	    		}, function(){
	    	$(n).css("color", "rgb(50,50,50)");
	    	$(m).css("opacity","0.4");
		});
	};
	
}

//ENTRADA
function titulo1() {
	$("#encabezado").text("Escoge un número en Tamaño de la serie:");
	setTimeout(seleccionarTamañoSerie, 500);
}
//Primer estado, seleccionar tamaño de la serie
function seleccionarTamañoSerie() {
	estado = 20;
	activarHoverTamañoSerie(0);
	$("#tituloSerie").css("color","rgb(130,130,130)");
}

function activarHoverTamañoSerie(num){
	var lista1 = ["#uno","#dos","#tres","#cuatro","#cinco","#seis","#siete","#ocho","#nueve","#diez"];
	var lista2 = ["#marcaColumna1","#marcaColumna2","#marcaColumna3","#marcaColumna4","#marcaColumna5","#marcaColumna6","#marcaColumna7","#marcaColumna8","#marcaColumna9","#marcaColumna10"];
	
	$(".numserie").css("color","rgb(80,80,80)");
	$(".marca").css("color","rgb(80,80,80)");
	$(lista1[0]).hover(function(){
    	$(lista1[0]).css("color", "rgb(170,170,170)");
    	$(lista2[0]).css("opacity","0.9");
    		}, function(){
    	$(lista1[0]).css("color", "rgb(60,60,60)");
    	$(lista2[0]).css("opacity","0.4");
	});
	$(lista1[1]).hover(function(){
    	$(lista1[1]).css("color", "rgb(170,170,170)");
    	$(lista2[1]).css("opacity","0.9");
    		}, function(){
    	$(lista1[1]).css("color", "rgb(60,60,60)");
    	$(lista2[1]).css("opacity","0.4");
	});
	$(lista1[2]).hover(function(){
    	$(lista1[2]).css("color", "rgb(170,170,170)");
    	$(lista2[2]).css("opacity","0.9");
    		}, function(){
    	$(lista1[2]).css("color", "rgb(60,60,60)");
    	$(lista2[2]).css("opacity","0.4");
	});
	$(lista1[3]).hover(function(){
    	$(lista1[3]).css("color", "rgb(170,170,170)");
    	$(lista2[3]).css("opacity","0.9");
    		}, function(){
    	$(lista1[3]).css("color", "rgb(60,60,60)");
    	$(lista2[3]).css("opacity","0.4");
	});
	$(lista1[4]).hover(function(){
    	$(lista1[4]).css("color", "rgb(170,170,170)");
    	$(lista2[4]).css("opacity","0.9");
    		}, function(){
    	$(lista1[4]).css("color", "rgb(60,60,60)");
    	$(lista2[4]).css("opacity","0.4");
	});
	$(lista1[5]).hover(function(){
    	$(lista1[5]).css("color", "rgb(170,170,170)");
    	$(lista2[5]).css("opacity","0.9");
    		}, function(){
    	$(lista1[5]).css("color", "rgb(60,60,60)");
    	$(lista2[5]).css("opacity","0.4");
	});
	$(lista1[6]).hover(function(){
    	$(lista1[6]).css("color", "rgb(170,170,170)");
    	$(lista2[6]).css("opacity","0.9");
    		}, function(){
    	$(lista1[6]).css("color", "rgb(60,60,60)");
    	$(lista2[6]).css("opacity","0.4");
	});
	$(lista1[7]).hover(function(){
    	$(lista1[7]).css("color", "rgb(170,170,170)");
    	$(lista2[7]).css("opacity","0.9");
    		}, function(){
    	$(lista1[7]).css("color", "rgb(60,60,60)");
    	$(lista2[7]).css("opacity","0.4");
	});
	$(lista1[8]).hover(function(){
    	$(lista1[8]).css("color", "rgb(170,170,170)");
    	$(lista2[8]).css("opacity","0.9");
    		}, function(){
    	$(lista1[8]).css("color", "rgb(60,60,60)");
    	$(lista2[8]).css("opacity","0.4");
	});
	$(lista1[9]).hover(function(){
    	$(lista1[9]).css("color", "rgb(170,170,170)");
    	$(lista2[9]).css("opacity","0.9");
    		}, function(){
    	$(lista1[9]).css("color", "rgb(60,60,60)");
    	$(lista2[9]).css("opacity","0.4");
	});
	if (num >= 1) {
		$(".numserie").css("color","rgb(60,60,60)");
		$(".marca").css("opacity","0.4");
		$(lista1[0]).unbind("mouseenter mouseleave");
		$(lista1[0]).css("color", "rgb(170,170,170)");
    	$(lista2[0]).css("opacity","0.9");
    	if (num >= 2) {
    		$(lista1[1]).unbind("mouseenter mouseleave");
			$(lista1[1]).css("color", "rgb(170,170,170)");
    		$(lista2[1]).css("opacity","0.9");
    		if (num >= 3) {
	    		$(lista1[2]).unbind("mouseenter mouseleave");
				$(lista1[2]).css("color", "rgb(170,170,170)");
	    		$(lista2[2]).css("opacity","0.9");
	    		if (num >= 4) {
		    		$(lista1[3]).unbind("mouseenter mouseleave");
					$(lista1[3]).css("color", "rgb(170,170,170)");
		    		$(lista2[3]).css("opacity","0.9");
		    		if (num >= 5) {
			    		$(lista1[4]).unbind("mouseenter mouseleave");
						$(lista1[4]).css("color", "rgb(170,170,170)");
			    		$(lista2[4]).css("opacity","0.9");
			    		if (num >= 6) {
				    		$(lista1[5]).unbind("mouseenter mouseleave");
							$(lista1[5]).css("color", "rgb(170,170,170)");
				    		$(lista2[5]).css("opacity","0.9");
				    		if (num >= 7) {
					    		$(lista1[6]).unbind("mouseenter mouseleave");
								$(lista1[6]).css("color", "rgb(170,170,170)");
					    		$(lista2[6]).css("opacity","0.9");
					    		if (num >= 8) {
						    		$(lista1[7]).unbind("mouseenter mouseleave");
									$(lista1[7]).css("color", "rgb(170,170,170)");
						    		$(lista2[7]).css("opacity","0.9");
						    		if (num >= 9) {
							    		$(lista1[8]).unbind("mouseenter mouseleave");
										$(lista1[8]).css("color", "rgb(170,170,170)");
							    		$(lista2[8]).css("opacity","0.9");
							    		if (num >= 10) {
								    		$(lista1[9]).unbind("mouseenter mouseleave");
											$(lista1[9]).css("color", "rgb(170,170,170)");
								    		$(lista2[9]).css("opacity","0.9");
								    	};
							    	};
						    	};
					    	};
				    	};
			    	};
		    	};
	    	};
    	};
    	setTimeout(titulo2, 500);
	};
}

function desactivarHoverTamañoSerie() {
	$("#uno").unbind("mouseenter mouseleave");
	$("#dos").unbind("mouseenter mouseleave");
	$("#tres").unbind("mouseenter mouseleave");
	$("#cuatro").unbind("mouseenter mouseleave");
	$("#cinco").unbind("mouseenter mouseleave");
	$("#seis").unbind("mouseenter mouseleave");
	$("#siete").unbind("mouseenter mouseleave");
	$("#ocho").unbind("mouseenter mouseleave");
	$("#nueve").unbind("mouseenter mouseleave");
	$("#diez").unbind("mouseenter mouseleave");
	$("#marcaColumna1").unbind("mouseenter mouseleave");
	$("#marcaColumna2").unbind("mouseenter mouseleave");
	$("#marcaColumna3").unbind("mouseenter mouseleave");
	$("#marcaColumna4").unbind("mouseenter mouseleave");
	$("#marcaColumna5").unbind("mouseenter mouseleave");
	$("#marcaColumna6").unbind("mouseenter mouseleave");
	$("#marcaColumna6").unbind("mouseenter mouseleave");
	$("#marcaColumna7").unbind("mouseenter mouseleave");
	$("#marcaColumna8").unbind("mouseenter mouseleave");
	$("#marcaColumna9").unbind("mouseenter mouseleave");
	$("#marcaColumna10").unbind("mouseenter mouseleave");
}

function titulo2() {
	
	// Titulo 2
	$("#encabezado").css("color","rgb(0,180,255)");
	$("#encabezado").text("Selecciona un número en Meta");
	setTimeout(seleccionarMeta, 500);
}

function seleccionarMeta(){
	aciertos = 0;
	pifias = 0;
	$("#meta").css("color","rgb(210,100,20)");
	$("#marcoMeta").css("border","1px solid rgb(0,124,250)");
	$(".meta").css('border', "2px solid rgb(80,80,80)");
	$(".meta").css('color', "rgb(80,80,80)");
}

function ajustarMeta(num, obj) {
	estado = 0;
	$(".meta").css('border', "2px solid rgb(60,60,60)"); // asi se llama una clase de objetos.
	$(".meta").css('color', "rgb(60,60,60)");
	$(obj).css('border', "2px solid rgb(210,100,20)");
	$(obj).css('color', "rgb(0,100,255)");
	$("#marcador1").css("color","rgb(0,200,0)");
	$("#marcador2").css("color","rgb(120,120,120)");
	meta = num;
	setTimeout(titulo3, 500);
}

function titulo3() {
	$("#encabezado").css("color","rgb(0,180,255)");
	$("#encabezado").text("Selecciona una Clase de escala");
	setTimeout(mostrarMenuEscala, 500);
}

function mostrarMenuEscala() {
	$("#tituloModos").css("color","rgb(210,100,20)");
	$("#marcoModos").css("border","1px solid rgb(0,124,250)");
	$(".modo").css('border', "2px solid rgb(80,80,80)");
	$(".modo").css('color', "rgb(80,80,80)");
}

function ajustarModo(obj) {
	cargarModo()
	$(".modo").css('border', "2px solid rgb(60,60,60)"); // asi se llama una clase de objetos.
	$(".modo").css('color', "rgb(60,60,60)");
	$(obj).css('border', "2px solid rgb(210,100,20)");
	$(obj).css('color', "rgb(0,100,255)");
	setTimeout(seleccionarTonalidad, 500);
}

function oirNuevoSonido() {
    estado = 4;
    $("#gradop").appendTo("#pantprinc");
	$("#gradop").css("position", "absolute");
	$("#gradop").css("left", 955);
	$("#gradop").css("top", 140);
    document.getElementById('teclado').src = "teclado.png";
    document.getElementById('gradop').src = "gradop.png";
    $("#gradop").css("display", "inline");
    var x = $("#gradop").position().left
    if (x == 955 || x == 490) {
        $("#gradop").css("top", 140);
        seleccionarGrado();
        animarHorizontal("#gradop", 955, 490, 5, 10, esperaMoverGrado);
        gradoSelUsuario = 10;
        respuestasGrados = [0,0,0,0,0,0,0,0];
    }
    $("#encabezado").css("color","white");
    $("#encabezado").text("Ubica el sonido ? frente a un grado");
}

function esperarTocarGrado(grado, tocar, ver, lapso, funDespues) {
	var salir = false;
	var f = function () {
		if (!salir) {
			tocarGrado(grado, tocar, ver);
			salir = true;
			setTimeout( f, lapso)
		} else if(funDespues != null) {
			funDespues();
		}
  	};
	f();
}

function oirArpegio(num) {
	nota = 0;
	var f = function() {
		if (nota < arpegio.length) {
			tocarGrado(arpegio[nota], true, true);
			nota++;
			setTimeout(f,930);
		} else {
			tocarGrado(0, true, false);
			tocarGrado(2, true, false);
			tocarGrado(4, true, false);
			tocarGrado(7, true, false);
			estado = num;
		};
	}
	f();
}

function pasaa5() {
	estado = 5;
}

function pasaa6() {
	estado = 6;
}

function cargarModo() {
	// Ciclo para cargar nombres de tonalidades segun el modo activo.
	for (var i = 0; i <= etiquetasMayor.length; i++) {
		if (modo == 0) {
			$(idTonalidades[i]).text(etiquetasMayor[i]);
			tonUsuario = tonMayor;
		} else{
			$(idTonalidades[i]).text(etiquetasMenor[i]);
		};		
	};
}

function iluminarOpacarGrado(num, obj, luz) {
	if (luz) {
		tocarGrado(num,true,true);
		$(obj).css("opacity", 0.9);
	} else{
		var son = tonica + tonUsuario[num];
		var nomb = 'son' + son;
		audioElement = document.getElementById(nomb);
		audioElement.pause(); // detiene el sonido
		audioElement.currentTime = 0; // rebobina el sonido
		document.getElementById('teclado').src = "teclado.png";
		$(obj).css("opacity", 0.5);
	};
}

function inicio() {
	iniGrados();

	$("#nuevosonido").on( "mouseover", function() {
		$("#nuevosonido").unbind("mouseenter mouseleave");
		$("#nuevosonido").css("background-color", "");
  		if (estado == 3 || estado == 5 || estado == 6) {
			$("#nuevosonido").hover(function(){
    		$(this).css("background-color", "rgb(35,35,35)");
    		}, function(){
    		$(this).css("background-color", "");
			});
		}else{
			$("#nuevosonido").css("background-color", "");
		};
	});
	
	$("#repetirsonido").on( "mouseover", function() {
		$("#repetirsonido").unbind("mouseenter mouseleave");
  		if (estado == 3 || estado == 5 || estado == 6) {
			$("#repetirsonido").hover(function(){
    		$(this).css("background-color", "rgb(35,35,35)");
    		}, function(){
    		$(this).css("background-color", "");
			});
		}else{
			$("#repetirsonido").css("background-color", "");
		};
	});

	$("#oirtonalidad").on( "mouseover", function() {
		$("#oirtonalidad").unbind("mouseenter mouseleave");
  		if (estado == 3 || estado == 5 || estado == 6) {
			$("#oirtonalidad").hover(function(){
    		$(this).css("background-color", "rgb(35,35,35)");
    		}, function(){
    		$(this).css("background-color", "");
			});
		}else{
			$("#oirtonalidad").css("background-color", "");
		};
	});

	$("#evaluar").on( "mouseover", function() {
		$("#evaluar").unbind("mouseenter mouseleave");
  		if (estado == 3 || estado == 5 || estado == 6) {
			$("#evaluar").hover(function(){
    		$(this).css("background-color", "rgb(35,35,35)");
    		}, function(){
    		$(this).css("background-color", "");
			});
		}else{
			$("#evaluar").css("background-color", "");
		};
	});

	$("#nuevosonido").on("click", "", function (evento) {
		$("#sombraGrados").css("display", "none");
		if (estado == 3) {
           oirNuevoSonido();
       } else if (estado == 5) {
       		estado = 10;
       		if (confirm("¿Está seguro que desea cambiar de sonido?")) {
       			oirNuevoSonido();
       		} else {
       			esperaMoverGrado();
       		};
       } else if (estado == 6) {
       		estado = 13;
       		if (confirm("¿Está seguro que desea cambiar de sonido?")) {
       			oirNuevoSonido();
       		} else {
       			estado = 6;
       		};
       };

	});

	$("#repetirsonido").on("click", "", function (evento) {
		if (estado == 5) {
			estado = 14;
			esperarTocarGrado(grado, true, false, 1050, pasaa5);
		} else if (estado == 6){
			estado = 12;
			esperarTocarGrado(grado, true, false, 1050, pasaa6);
		}

	});

	$("#oirtonalidad").on("click", "", function (evento) {
		if (estado == 5) {
			estado = 9;
			oirArpegio(5);
		} else if (estado == 6) {
			estado = 11;
			oirArpegio(6);
		} 
		// else if (estado == 3) {
		// 	estado = 15;
		// 	oirArpegio(3);
		// }
	});

	$("#evaluar").on("click", "", function (evento) {
		if (estado == 6 ) {
			evaluar();
		};
	});

	// Mouseenter sobre botones azules de Grado.
	// Destaca grado, lo visualiza en el teclado 
	// y hace sonar el sonido correspondiente
	$("#grado1").on("mouseenter", function () {
		if (estado == 3) {
			iluminarOpacarGrado(0, this, true);
		}
	});
	$("#grado2").on("mouseenter", function () {
		if (estado == 3) {
			iluminarOpacarGrado(1, this, true);
		}
	});
	$("#grado3").on("mouseenter", function () {
		if (estado == 3) {
			iluminarOpacarGrado(2, this, true);
		}
	});
	$("#grado4").on("mouseenter", function () {
		if (estado == 3) {
			iluminarOpacarGrado(3, this, true);
		}
	});
	$("#grado5").on("mouseenter", function () {
		if (estado == 3) {
			iluminarOpacarGrado(4, this, true);
		}
	});
	$("#grado6").on("mouseenter", function () {
		if (estado == 3) {
			iluminarOpacarGrado(5, this, true);
		}
	});
	$("#grado7").on("mouseenter", function () {
		if (estado == 3) {
			iluminarOpacarGrado(6, this, true);
		}
	});
	$("#grado8").on("mouseenter", function () {
		if (estado == 3) {
			iluminarOpacarGrado(7, this, true);
		}
	});

	// Mouseleave sobre botones azules de Grado.
	// Opaca el grado, borra el sonido del teclado 
	// y silencia el sonido
	$("#grado1").on("mouseleave", function () {
		if (estado == 3) {
			iluminarOpacarGrado(0, this, false);
		}
	});
	$("#grado2").on("mouseleave", function () {
		if (estado == 3) {
			iluminarOpacarGrado(1, this, false);
		}
	});
	$("#grado3").on("mouseleave", function () {
		if (estado == 3) {
			iluminarOpacarGrado(2, this, false);
		}
	});
	$("#grado4").on("mouseleave", function () {
		if (estado == 3) {
			iluminarOpacarGrado(3, this, false);
		}
	});
	$("#grado5").on("mouseleave", function () {
		if (estado == 3) {
			iluminarOpacarGrado(4, this, false);
		}
	});
	$("#grado6").on("mouseleave", function () {
		if (estado == 3) {
			iluminarOpacarGrado(5, this, false);
		}
	});
	$("#grado7").on("mouseleave", function () {
		if (estado == 3) {
			iluminarOpacarGrado(6, this, false);
		}
	});
	$("#grado8").on("mouseleave", function () {
		if (estado == 3) {
			iluminarOpacarGrado(7, this, false);
		}
	});

	// Click sobre botones de Tamaño de serie.
	$("#uno").on("click", "", function () {
		if (estado == 20) {
			activarHoverTamañoSerie(1);
		}
	});
	$("#dos").on("click", "", function () {
		if (estado == 20) {
			activarHoverTamañoSerie(2);
		}
	});
	$("#tres").on("click", "", function () {
		if (estado == 20) {
			activarHoverTamañoSerie(3);
		}
	});
	$("#cuatro").on("click", "", function () {
		if (estado == 20) {
			activarHoverTamañoSerie(4);
		}
	});
	$("#cinco").on("click", "", function () {
		if (estado == 20) {
			activarHoverTamañoSerie(5);
		}
	});
	$("#seis").on("click", "", function () {
		if (estado == 20) {
			activarHoverTamañoSerie(6);
		}
	});
	$("#siete").on("click", "", function () {
		if (estado == 20) {
			activarHoverTamañoSerie(7);
		}
	});
	$("#ocho").on("click", "", function () {
		if (estado == 20) {
			activarHoverTamañoSerie(8);
		}
	});
	$("#nueve").on("click", "", function () {
		if (estado == 20) {
			activarHoverTamañoSerie(9);
		}
	});
	$("#diez").on("click", "", function () {
		if (estado == 20) {
			activarHoverTamañoSerie(10);
		}
	});

	// Click sobre botones de Meta
	$("#meta1").on("click", "", function () {
		if (estado == 20 || estado == 0) {
			desactivarHoverTamañoSerie();
			ajustarMeta(3,this);
		}
	});
	$("#meta2").on("click", "", function () {
		if (estado == 20 || estado == 0) {
			desactivarHoverTamañoSerie();
			ajustarMeta(4,this);
		}
	});
	$("#meta3").on("click", "", function () {
		if (estado == 20 || estado == 0) {
			desactivarHoverTamañoSerie();
			ajustarMeta(5,this);
		}
	});
	$("#meta4").on("click", "", function () {
		if (estado == 20 || estado == 0) {
			desactivarHoverTamañoSerie();
			ajustarMeta(6,this);
		}
	});
	$("#meta5").on("click", "", function () {
		if (estado == 20 || estado == 0) {
			desactivarHoverTamañoSerie();
			ajustarMeta(7,this);
		}
	});
	$("#meta6").on("click", "", function () {
		if (estado == 20 || estado == 0) {
			desactivarHoverTamañoSerie();
			ajustarMeta(8,this);
		}
	});
	$("#meta7").on("click", "", function () {
		if (estado == 20 || estado == 0) {
			desactivarHoverTamañoSerie();
			ajustarMeta(9,this);
		}
	});
	$("#meta8").on("click", "", function () {
		if (estado == 20 || estado == 0) {
			desactivarHoverTamañoSerie();
			ajustarMeta(10,this);
		}
	});
	$("#meta9").on("click", "", function () {
		if (estado == 20 || estado == 0) {
			desactivarHoverTamañoSerie();
			ajustarMeta(11,this);
		}
	});
	$("#meta10").on("click", "", function () {
		if (estado == 20 || estado == 0) {
			desactivarHoverTamañoSerie();
			ajustarMeta(12,this);
		}
	});
	$("#meta11").on("click", "", function () {
		if (estado == 20 || estado == 0) {
			desactivarHoverTamañoSerie();
			ajustarMeta(13,this);
		}
	});
	$("#meta12").on("click", "", function () {
		if (estado == 20 || estado == 0) {
			desactivarHoverTamañoSerie();
			ajustarMeta(14,this);
		}
	});
	$("#meta13").on("click", "", function () {
		if (estado == 20 || estado == 0) {
			desactivarHoverTamañoSerie();
			ajustarMeta(15,this);
		}
	});
	$("#meta14").on("click", "", function () {
		if (estado == 20 || estado == 0) {
			desactivarHoverTamañoSerie();
			ajustarMeta(16,this);
		}
	});
	$("#meta15").on("click", "", function () {
		if (estado == 20 || estado == 0) {
			desactivarHoverTamañoSerie();
			ajustarMeta(17,this);
		}
	});
	$("#meta16").on("click", "", function () {
		if (estado == 20 || estado == 0) {
			desactivarHoverTamañoSerie();
			ajustarMeta(18,this);
		}
	});
	$("#meta17").on("click", "", function () {
		if (estado == 20 || estado == 0) {
			desactivarHoverTamañoSerie();
			ajustarMeta(19,this);
		}
	});
	$("#meta18").on("click", "", function () {
		if (estado == 20 || estado == 0) {
			desactivarHoverTamañoSerie();
			ajustarMeta(20,this);
		}
	});

	// Click sobre botones de tipo de Escala
	$("#modo1").on("click", "", function (evento) {
		if (estado == 0 || estado == 1) {
			modo = 0;
			tonUsuario = tonMayor;
			ajustarModo(this);
		}
	});
	$("#modo2").on("click", "", function (evento) {
		if (estado == 0 || estado == 1) {
			modo = 1;
			tonUsuario = tonMenorArmonica;
			ajustarModo(this);
		}
	});
	$("#modo3").on("click", "", function (evento) {
		if (estado == 0 || estado == 1) {
			modo = 2;
			tonUsuario = tonMenorNatural;
			ajustarModo(this);
		}
	});
	$("#modo4").on("click", "", function (evento) {
		if (estado == 0 || estado == 1) {
			modo = 3;
			tonUsuario = tonMenorMelódica;
			ajustarModo(this);
		}
	});

	// Click sobre botones de Tonalidades
	$(idTonalidades[0]).on("click", "", function (evento) {
		if (estado == 1 || estado == 3) {
			ajustarTonalidad(0, $(this));
		}
	});

	$(idTonalidades[1]).on("click", "", function (evento) {
		if (estado == 1 || estado == 3) {
			ajustarTonalidad(1, $(this));
		}
	});		
	$(idTonalidades[2]).on("click", "", function (evento) {
		if (estado == 1 || estado == 3) {
			ajustarTonalidad(2, $(this));
		}
	});
	$(idTonalidades[3]).on("click", "", function (evento) {
		if (estado == 1 || estado == 3) {
			ajustarTonalidad(3, $(this));
		}
	});
	$(idTonalidades[4]).on("click", "", function (evento) {
		if (estado == 1 || estado == 3) {
			ajustarTonalidad(4, $(this));
		}
	});
	$(idTonalidades[5]).on("click", "", function (evento) {
		if (estado == 1 || estado == 3) {
			ajustarTonalidad(5, $(this));
		}
	});
	$(idTonalidades[6]).on("click", "", function (evento) {
		if (estado == 1 || estado == 3) {
			ajustarTonalidad(6, $(this));
		}
	});
	$(idTonalidades[7]).on("click", "", function (evento) {
		if (estado == 1 || estado == 3) {
			ajustarTonalidad(7, $(this));
		}
	});
	$(idTonalidades[8]).on("click", "", function (evento) {
		if (estado == 1 || estado == 3) {
			ajustarTonalidad(8, $(this));
		}
	});
	$(idTonalidades[9]).on("click", "", function (evento) {
		if (estado == 1 || estado == 3) {
			ajustarTonalidad(9, $(this));
		}
	});
	$(idTonalidades[10]).on("click", "", function (evento) {
		if (estado == 1 || estado == 3) {
			ajustarTonalidad(10, $(this));
		}
	});
	$(idTonalidades[11]).on("click", "", function (evento) {
		if (estado == 1 || estado == 3) {
			ajustarTonalidad(11, $(this));
		}
	});
	
	setTimeout(titulo1, 800); // Estado inicial del juego.
}

