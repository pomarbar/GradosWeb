// Grados Web 2015 
// Software para la percepción y el reconocimiento de los grados en escalas modo-tonales
// Autor: Pedro Omar Baracaldo R. profesor asociado, departamento de música, Universidad de los Andes
// email: pbaracal@uniandes.edu.co

var tonalidadUsuario = [];
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
var nombresMarca = ["#marcaColumna1","#marcaColumna2","#marcaColumna3","#marcaColumna4","#marcaColumna5","#marcaColumna6","#marcaColumna7","#marcaColumna8","#marcaColumna9","#marcaColumna10"];
var teclas = ['tecla1.png','tecla2.png','tecla3.png','tecla4.png','tecla5.png','tecla6.png','tecla7.png','tecla8.png','tecla9.png','tecla10.png','tecla11.png','tecla12.png','tecla13.png','tecla14.png','tecla15.png','tecla16.png','tecla17.png','tecla18.png','tecla19.png','tecla20.png','tecla21.png','tecla22.png','tecla23.png','tecla24.png'];
var coordsTeclado = [60,73,86,99,112,125,138,164,177,190,203,216];
var idTonalidades = ["#FA", "#FAs", "#SOL", "#LAb", "#LA", "#SIb", "#SI", "#DO", "#DOs", "#RE", "#MIb", "#MI"];
var gradoGrafs = ["grado1.png","grado2.png","grado3.png","grado4.png","grado5.png","grado6.png","grado7.png","grado8.png","gradop.png"];
var posMarcasSerie = [458, 498, 538, 578, 617, 656, 696, 736, 775, 815];
var grado = 0;
var listaGrados = [];
var posgradop = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]; // guarda posición de gradop cuando el usuario hace click en gradop1 y queda fijo frente a algún grado
var meta = 0; // cantidad de ejercicios
var nota = 0;
var audioElement = null;
var arpegio = [0,2,4,7];
var aciertos = 0;
var pifias = 0;
var idsTamanoSerie = ["#uno","#dos","#tres","#cuatro","#cinco","#seis","#siete","#ocho","#nueve","#diez"];
var serieUsuario = 1;
var estado = 29; // 20 = Entrada al programa. Ajustar tamaño de serie de grados.
				// 0 = Ajustar meta inicial
				// 1 = Seleccione una tonalidad
				// 2 = esta sonando una tonalidad
				// 3 = esperando un nuevo sonido. Permite oir cada grado al pasar por encima el mouse.
				// 4 = oye nuevo sonido, entra gradop1. Permite oir tonalidad.
				// 5 = (gradop1 esta fuera de los grados) espera a que gradop1 se ubique en un grado
				// 6 = espera que usuario evalue. permiter mover gradop1 a otro grado
				// 7 = evalua respuesta de gradop1
				// 8 = escucha parte de tonalidad cuando no se ha elegido un nuevo sonido
				// 9 = escucha parte de tonalidad después de ha ber elegido un nuevo sonido
				// 10 = confirma si quiere un nuevo sonido, antes de ubicar gradop1
				// 11 = escucha parte de tonalidad después de haber ubicado gradop1 en algún grado
				// 12 = repite sonido después de ubicar gradop1
				// 13 = confirma si quiere un nuevo sonido, después de ubicar gradop1

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

//variable con la posicion en el texto. Ajustar siempre a 0
var pos = 0;
//variable con el texto a mostrar
var texto = " ";
// donde se va a mostrar el texto
var miDiv = "encabezado";
// tempo de aparición del texto
var vel = 50;

//creo una funcion para cambiar el texto
function animarTexto(){
   //incremento la posicion en 1 y extraigo el texto a mostrar en este momento.
   pos = pos + 1;
   var textoActual = texto.substring(0,pos);
   //capturo el div donde se pone el texto
   var t = document.getElementById(miDiv);
   t.textContent = textoActual;
   //controla la cantidad de veces que se llama a la funcion 'animarTexto'
   if (pos <= texto.length){
      //llama varias veces a la función 'animarTexto'
      setTimeout(animarTexto,vel);
   }
};

// Funcion para tocar y/o mostrar el grado seleccionado
// @p param grad = número del grado, entre 0 y 7
// @ param tocar = boolean, solo toca el grado si es verdadero
// @ param ver = boolean, solo muestra el grado en el teclado si es verdadero
function tocarGrado(grad, tocar, ver) {
 	var son = tonica + tonUsuario[grad];
 	
 	if (ver) {
 		document.getElementById('teclado').src = teclas[son];
 	};
 	if (tocar) {
 		
		audioElement = document.getElementById('son' + son);
		if (audioElement == null) {
			alert("No se encontró elemento de audio son" + son);
		} else{
			audioElement.pause(); // detiene el sonido
			audioElement.currentTime = 0; // rebobina el sonido
			audioElement.play();
		};
	};
 }

function tocarListaGrados(estadoNum, oir, ver) {
	var listaGradosP = ["gradop1","gradop2","gradop3","gradop4","gradop5","gradop6","gradop7","gradop8"];
	//$(".grado").css("opacity", 0.3);
	pes = 0;
	function tocaSiguienteGrado(){
		//alert("Entró tocar siguiente grado.");
		if(pes < listaGrados.length) {
			$(".portada").css("left", 0);
			tocarGrado(listaGrados[pes], oir, ver);
			setTimeout(tocaSiguienteGrado, 900);
			pes++;
		}else {
			estado = estadoNum;
		};
	}
	tocaSiguienteGrado();
}

// Funcion que selecciona un número al azar dentro de un rango dado
function aleatorio(minimo, maximo) {
	var numero = Math.floor(Math.random() * (maximo - minimo + 1) + minimo);
	return numero;
}


var gradosSeleccionados = [[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
var gradosActivos = [0,0,0,0,0,0,0,0];
function seleccionarGrado(num){
	if (tonalidadUsuario.length == 0){
		tonalidadUsuario = [0,1,2,3,4,5,6,7];
	}
	var g = aleatorio(0,tonalidadUsuario.length - 1);
	cambiarOpacityGrados(0.4);
	grado = tonalidadUsuario[g];
	tonalidadUsuario.splice(g,1);
	listaGrados.push(grado);
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
				$(sel).css('left', x);
			},
			tempo,
			function() {
				if (funcionDespues != null) {
					$(sel).css('left', xfinal);
					funcionDespues()
				}
			}
		)
}
/**
 * Prepara cada columna para recibir la respuesta del usuario
 *
 * @param serie número de columna
 * @param i numero de grado (fila) en la columna
 *
 * @return vacío
 */
function alistarColumna(serie, i) {
				var nom1 = "#grado" + i ;
				var nom = nom1 + "-" + serie;
				var s = (tonica + 1) + tonUsuario[i-1];
				var nom2 = "tecla" + s + ".png";
		      $("#grado" + i + "-" + serie).hover(  // función para mover grado ? frente a grados de respuesta.
			  	function(event){
			            //debugger
			           // cambiarOpacityGrados(0.5);
				        if (estado == 5 && posgradop[serie-1] !== listaGrados[serie-1]) {
				            $("#gradop" + serie).appendTo(nom);
				            $("#gradop" + serie).css("position", "relative");
				            $("#gradop" + serie).css("left", 0);
				            $("#gradop" + serie).css("top", 0);
				            $("#sombraGrado" + serie).css("display", "inline");
				            var x = $(nom).position();
				            $("#sombraGrado" + serie).css("top", x.top + 1);
				            $(nom1).css("opacity", 0.9); //resalta el grado seleccionado
				            document.getElementById('teclado').src = nom2; // ilumina la tecla del grado seleccionado
				        };
				    },
			        function(event){
			        	if (estado == 5 && posgradop[serie-1] !== listaGrados[serie-1]) {
				            $("#gradop" + serie).appendTo("#pantprinc");
				            $("#gradop" + serie).css("position", "absolute");
				            $("#gradop" + serie).css("left", 490 + (39 * (serie-1)));
				            $("#gradop" + serie).css("top", 145);
				            $("#sombraGrado" + serie).css("display", "none");
				            if (gradosActivos[i - 1] == 0) { // si este grado no ha sido seleccionado
				            	$(nom1).css("opacity", 0.4); //le devuelve su transparencia baja
				            };
				            document.getElementById('teclado').src = "teclado.png";
			            };
			        }
		      );

			$("#gradop" + serie).click(function(){	// Desactiva la función HOVER
				var p = $("#gradop" + serie).position();
				// Este condicional evita que se desactive el efecto HOVER si gradop1 no está
				// ubicado en uno de los círculos punteados para recibir respuesta. Evita pasar al
				// siguiente estado donde el programa espera que el usuario pida EVALUAR su respuesta.
				if (p.top !== 145) {
					$("#grado1-" + serie).unbind("mouseenter mouseleave");
					$("#grado2-" + serie).unbind("mouseenter mouseleave");
					$("#grado3-" + serie).unbind("mouseenter mouseleave");
					$("#grado4-" + serie).unbind("mouseenter mouseleave");
					$("#grado5-" + serie).unbind("mouseenter mouseleave");
					$("#grado6-" + serie).unbind("mouseenter mouseleave");
					$("#grado7-" + serie).unbind("mouseenter mouseleave");
					$("#grado8-" + serie).unbind("mouseenter mouseleave");
					if (estado == 5) {
						objetopadre = $(this).parent().attr("id");
						gradoTemp = +(objetopadre[objetopadre.length - 3]) - 1;
						gradosSeleccionados[serie-1][posgradop] = 1;//registro de grados selesccionados en los diferentes intentos de respuesta en cada columna
						gradosActivos[gradoTemp] = 1;
						posgradop[serie-1] = gradoTemp;
/*

						$("#grado1-" + serie).click(function() { // Criterio para evaluar seleccion de usuario
							posgradop[serie-1] = 0;
							gradosSeleccionados[serie-1][0] = 1;
						});
						$("#grado2-" + serie).click(function() {
			   				posgradop[serie-1] = 1;
			   				gradosSeleccionados[serie-1][1] = 1;
						});
						$("#grado3-" + serie).click(function() {
			   				posgradop[serie-1] = 2;
			   				gradosSeleccionados[serie-1][2] = 1;
						});
						$("#grado4-" + serie).click(function() {
			   				posgradop[serie-1] = 3;
			   				gradosSeleccionados[serie-1][3] = 1;
						});
						$("#grado5-" + serie).click(function() {
			   				posgradop[serie-1] = 4;
			   				gradosSeleccionados[serie-1][4] = 1;
						});
						$("#grado6-" + serie).click(function() {
			   				posgradop[serie-1] = 5;
			   				gradosSeleccionados[serie-1][5] = 1;
						});
						$("#grado7-" + serie).click(function() {
			   				posgradop[serie-1] = 6;
			   				gradosSeleccionados[serie-1][6] = 1;
						});
						$("#grado8-" + serie).click(function() {
			   				posgradop[serie-1] = 7;
			   				gradosSeleccionados[serie-1][7] = 1;
						}); */
					}; 
					estado = 6; // espera evaluar principalmente
					for (var i = listaGrados.length; i > 0; i--) {
						var postemp = $("#gradop" + i).position();
						if (postemp.top == 145) {
							estado = 5;
						};
					};
					
					$("#encabezado").css("color","lime");
		    		$("#encabezado").text("Evalúe su respuesta");
		    	};
			});
	//}; 	
}

function esperaMoverGrado() {
	estado = 5;
	// $("#gradop1").on("dragstart", "", function (evento) {
	// 	drag(evento);
	// });
	for (var serie = 1; serie <= serieUsuario; serie++) {
		if (posgradop[serie-1] !== listaGrados[serie-1]) {
			$("#gradop" + serie).appendTo("#pantprinc");
			$("#gradop" + serie).css("position", "absolute");
			$("#gradop" + serie).css("left", 490 + (39 * (serie-1)));
			$("#gradop" + serie).css("top", 145);
		} else {
			$("#grado1-" + serie).unbind("mouseenter mouseleave");
			$("#grado2-" + serie).unbind("mouseenter mouseleave");
			$("#grado3-" + serie).unbind("mouseenter mouseleave");
			$("#grado4-" + serie).unbind("mouseenter mouseleave");
			$("#grado5-" + serie).unbind("mouseenter mouseleave");
			$("#grado6-" + serie).unbind("mouseenter mouseleave");
			$("#grado7-" + serie).unbind("mouseenter mouseleave");
			$("#grado8-" + serie).unbind("mouseenter mouseleave");
		};	
		for (var i = 1; i <= 8; i++) {
			alistarColumna(serie, i);	
		};
	};
	// pasa a estado 6 cuando se ubique gradop1 en algún grado o
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
	tonalidadUsuario = [0,1,2,3,4,5,6,7];
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
									cambiarOpacityGrados("0.4");
									$("#encabezado").css("color","rgb(0,200,255)");
									$("#encabezado").css("left", 500);
									$("#encabezado").css("top", 460);
									texto = "Haz click en Nuevo sonido";
									if (serieUsuario > 1) {
										texto = "Haz click en Nueva serie";
									};
									pos = 0;
									if ($("#encabezado").text() == texto) {
									} else{
										animarTexto();
									};
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
	// Esconde gradosp y su sombra azul
	$(".gp").css("display", "none");
	$(".sgp").css("display", "none");
	// Borra fondo gris de circulos de respuesta.
	$(".gris").css("background-color","");
	// Baja luminosidad de grados
	$(".grado").css("opacity",0.4);
	// Ajusta el teclado en 'blanco'
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

function textoMetaAlcanzada() {
	$("#encabezado").css("color","yellow");
	$("#encabezado").text("¡ Muy bien ! has alcanzado la meta propuesta.");
}

function respBuena() {
		$("#marcador1").text(aciertos);
		$("#encabezado").css("color","rgb(0,255,255)");
		$(".g1").css("background-color","");
		if (aciertos >= meta) {
			setTimeout(textoMetaAlcanzada, 1500); // para poder ver ultimo texto de grados acertados
			estado = 0;
			t = 900 * listaGrados.length;
			setTimeout(guardarGrados, t + 2000);
			setTimeout(ajustarMenusAGris, t + 3500);
			setTimeout(titulo2, t + 4200);
		} else {
			estado = 3;
		}
}

function evaluar() {
	estado = 7;
	var lisRom = ["I", "II", "III", "IV", "V", "VI", "VII", "I agudo"];

	var cuantosbien = 0;
	for (var i = listaGrados.length; i >= 1; i--) {
		for (var k = 8; k >= 1; k--) {
			var posGrado = $("#grado" + k + "-" + i).html();
			if (posGrado !== "" && listaGrados[i - 1] == k - 1) {
				cuantosbien++;
			};
		};
	};
	// Respuesta buena y meta alcanzada
	if (cuantosbien == listaGrados.length) {
		aciertos++;
		$("#encabezado").css("color","rgb(210,255,255)");
		var mensaje = "Muy bien, ha sonado el grado ";
		//debugger
		if (listaGrados.length > 1) {
			mensaje = "Muy bien, han sonado los grados ";
		}
		sep = "";
		for (var i = 0; i <= listaGrados.length - 1; i++) {
			mensaje += sep + lisRom[listaGrados[i]];
			if (i == listaGrados.length - 2) {
			sep = " y ";
			} else{
				sep = ", ";
			};
			if (i == listaGrados.length - 1) {
				mensaje += ".";
			};
			document.getElementById("gradop" + (i + 1)).src = gradoGrafs[listaGrados[i]];
		};
		tocarListaGrados(3, true, true);		
		$("#encabezado").text(mensaje);
		respBuena();
		// Respuesta buena y meta aun no alcanzada
		if (aciertos < meta) {
			pos = 0;
			texto = "Haz click en Nuevo sonido";
			if (serieUsuario > 1) {
				texto = "Selecciona una Nueva serie";
			};
			var t = 1000 * listaGrados.length;
			setTimeout(animarTexto,t);
		};
	} else {
		// Respuesta equivocada
		$("#encabezado").css("color","white");
		$("#encabezado").text("Intenta con otro grado.");
		
		for (var i = listaGrados.length - 1; i >= 0; i--) {
			if (posgradop[i] !== listaGrados[i]) {
				var nom = "#grado" + (posgradop[i] + 1) + "-" + (i + 1);
				$(nom).css("background-color","rgb(50,50,50)"); // marca con gris el sonido equivocado
				//$(nom).unbind("mouseenter mouseleave"); // desactiva efecto HOVER, no permite una segunda respuesta en este grado
				var nx = "#grado" + (posgradop[i] + 1);
				$(nx).css("opacity",0.4); // opaca sonido de respuesta equivocada
				gradosActivos[posgradop[i]] = 0; // deselecciona este grado como respuesta activa, es decir, como la respuesta es incorrecta se desactiva.
				if (gradosSeleccionados[i][posgradop[i]] == 1) { // evita que el usuario evalúe un sonido equivocado mas de una vez
					$("#encabezado").text("Pruebe ubicando el sonido ? frente a otro grado.");
					if (posgradop[i] !== listaGrados[i]) {
						esperaMoverGrado();
					};
				} else{
					gradosSeleccionados[i][posgradop[i]] = 1; //controlador para evitar contar dos o mas veces como error el mismo grado
					pifias++;
					if (posgradop[i] !== listaGrados[i]) {
						esperaMoverGrado();
					};
				};	
			};
		};
		$("#marcador2").text(pifias);
		for (var i = listaGrados.length - 1; i >= 0; i--) {
			// Restituye los grados activos buenos que se hayan desactivado en el anterior FOR
			// cuando una respuesta equivocada es igual a una correcta en otra columna.
			// Esto para que el hover no baje la luminosidad de un grado de respuesta carrecta.
			if (posgradop[i] == listaGrados[i]) {
				gradosActivos[posgradop[i]] = 1;
				var mnx = "#grado" + (posgradop[i] + 1);
				$(mnx).css("opacity",0.9); // enciende sonido de respuesta correcta
			};
		};
	};
}

function seleccionarTonalidad() {
	estado = 1;  // espera a que se oprima un boton de tonalidad.
	$("#gradop1").css("display", "none");
	$(".sgp").css("display", "none");
	$("#marcador1").text(aciertos);
	$("#marcador2").text(pifias);
	document.getElementById('teclado').src = "teclado.png";

	$("#marcoTonalidades").css('border', "1px solid rgb(0,124,250)");
	$("#titulo").css('color', "rgb(210,100,20)");
	$(".tonal").css('border', "2px solid rgb(80,80,80)");
	$(".tonal").css('color', "rgb(80,80,80)");
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
	$("#encabezado").css("color","rgb(0,180,255)");
	texto = "Escoge un número en Tamaño de la serie";
	vel = 8;
	if ($("#encabezado").text() == texto) {
	} else{
		animarTexto();
	};
	$("#fondoEntrada").css("width", 0);
	$("#fondoEntrada").css("height", 0);
	setTimeout(seleccionarTamañoSerie, 500);
}
//Primer estado, seleccionar tamaño de la serie
function seleccionarTamañoSerie() {
	estado = 20;
	activarHoverTamañoSerie(0);
	$("#tituloSerie").css("color","rgb(130,130,130)");
}

function hoverSerieSola(marca, indiceMarca) {

		$(idsTamanoSerie[indiceMarca]).hover(function(){
    	$(idsTamanoSerie[indiceMarca]).css("color", "rgb(170,170,170)");
    	$(nombresMarca[indiceMarca]).css("opacity","0.9");
    	mostrarOcultarDashedCircles(0);
    	mostrarOcultarDashedCircles(indiceMarca + 1);
    		}, function(){
    	$(idsTamanoSerie[indiceMarca]).css("color", "rgb(60,60,60)");
    	$(nombresMarca[indiceMarca]).css("opacity","0.4");
    	//if (marca > indiceMarca) {
    		mostrarOcultarDashedCircles(0);
    		mostrarOcultarDashedCircles(marca);
    	//};
	});
}

// Activa total y parcialmente el efecto HOVER
function activarHoverTamañoSerie(num){
	var lista2 = ["#marcaColumna1","#marcaColumna2","#marcaColumna3","#marcaColumna4","#marcaColumna5","#marcaColumna6","#marcaColumna7","#marcaColumna8","#marcaColumna9","#marcaColumna10"];

	$(".numserie").css("color","rgb(60,60,60)");
	$(".marca").css("color","rgb(60,60,60)");

	for (var i = 0; i <= 9; i++) {
		hoverSerieSola(num, i);
	};

	 if (num >= 1) {
	 	$(".numserie").css("color","rgb(60,60,60)");
	 	$(".marca").css("opacity","0.4");
		for (var i = num-1; i >= 0; i--) {
			$(idsTamanoSerie[i]).unbind("mouseenter mouseleave");
			$(idsTamanoSerie[i]).css("color", "rgb(170,170,170)");
	    	$(nombresMarca[i]).css("opacity","0.9");
		}
	 	setTimeout(titulo2, 500);
	 }
	

	// if (num >= 1) {
	// 	$(".numserie").css("color","rgb(60,60,60)");
	// 	$(".marca").css("opacity","0.4");
	// 	$(idsTamanoSerie[0]).unbind("mouseenter mouseleave");
	// 	$(idsTamanoSerie[0]).css("color", "rgb(170,170,170)");
 //    	$(lista2[0]).css("opacity","0.9");
 //    	if (num >= 2) {
 //    		$(idsTamanoSerie[1]).unbind("mouseenter mouseleave");
	// 		$(idsTamanoSerie[1]).css("color", "rgb(170,170,170)");
 //    		$(lista2[1]).css("opacity","0.9");
 //    		if (num >= 3) {
	//     		$(idsTamanoSerie[2]).unbind("mouseenter mouseleave");
	// 			$(idsTamanoSerie[2]).css("color", "rgb(170,170,170)");
	//     		$(lista2[2]).css("opacity","0.9");
	//     		if (num >= 4) {
	// 	    		$(idsTamanoSerie[3]).unbind("mouseenter mouseleave");
	// 				$(idsTamanoSerie[3]).css("color", "rgb(170,170,170)");
	// 	    		$(lista2[3]).css("opacity","0.9");
	// 	    		if (num >= 5) {
	// 		    		$(idsTamanoSerie[4]).unbind("mouseenter mouseleave");
	// 					$(idsTamanoSerie[4]).css("color", "rgb(170,170,170)");
	// 		    		$(lista2[4]).css("opacity","0.9");
	// 		    		if (num >= 6) {
	// 			    		$(idsTamanoSerie[5]).unbind("mouseenter mouseleave");
	// 						$(idsTamanoSerie[5]).css("color", "rgb(170,170,170)");
	// 			    		$(lista2[5]).css("opacity","0.9");
	// 			    		if (num >= 7) {
	// 				    		$(idsTamanoSerie[6]).unbind("mouseenter mouseleave");
	// 							$(idsTamanoSerie[6]).css("color", "rgb(170,170,170)");
	// 				    		$(lista2[6]).css("opacity","0.9");
	// 				    		if (num >= 8) {
	// 					    		$(idsTamanoSerie[7]).unbind("mouseenter mouseleave");
	// 								$(idsTamanoSerie[7]).css("color", "rgb(170,170,170)");
	// 					    		$(lista2[7]).css("opacity","0.9");
	// 					    		if (num >= 9) {
	// 						    		$(idsTamanoSerie[8]).unbind("mouseenter mouseleave");
	// 									$(idsTamanoSerie[8]).css("color", "rgb(170,170,170)");
	// 						    		$(lista2[8]).css("opacity","0.9");
	// 						    		if (num >= 10) {
	// 							    		$(idsTamanoSerie[9]).unbind("mouseenter mouseleave");
	// 										$(idsTamanoSerie[9]).css("color", "rgb(170,170,170)");
	// 							    		$(lista2[9]).css("opacity","0.9");
	// 							    	};
	// 						    	};
	// 					    	};
	// 				    	};
	// 			    	};
	// 		    	};
	// 	    	};
	//     	};
 //    	};
    	
	//};
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
	estado = 0;
	// Titulo 2
	$("#encabezado").css("color","rgb(0,180,255)");
	// Reubica "encabezado", instrucciones a usuario
	$("#encabezado").css("top", 70);
	$("#encabezado").css("left", 5);
	texto = "Selecciona un número en Meta";
	pos = 0;
	if ($("#encabezado").text() == texto) {
	} else{
		animarTexto();
	};
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
	estado = 21;
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
	$("#encabezado").css("top", 223);
	$("#encabezado").css("left", 0);
	texto = "Selecciona una Clase de escala";
	pos = 0;
	if ($("#encabezado").text() == texto) {
	} else{
		animarTexto();
	};
	setTimeout(mostrarMenuEscala, 500);
}

function mostrarMenuEscala() {
	$("#tituloModos").css("color","rgb(210,100,20)");
	$("#marcoModos").css("border","1px solid rgb(0,124,250)");
	$(".modo").css('border', "2px solid rgb(80,80,80)");
	$(".modo").css('color', "rgb(80,80,80)");
}

function ajustarModo(obj) {
	cargarModo();
	$(".modo").css('border', "2px solid rgb(60,60,60)"); // asi se llama una clase de objetos.
	$(".modo").css('color', "rgb(60,60,60)");
	$(obj).css('border', "2px solid rgb(210,100,20)");
	$(obj).css('color', "rgb(0,100,255)");
	$("#encabezado").css("color","rgb(0,180,255)");
	$("#encabezado").css("top", 338);
	$("#encabezado").css("left", 20);
	texto = "Selecciona una tonalidad.";
	pos = 0;
	if ($("#encabezado").text() == texto) {
	} else{
		animarTexto();
	};
	setTimeout(seleccionarTonalidad, 500);
}

function ocultaGradosp() {
	$(".gp").css("left", 955);
	$(".gp").css("display", "none");
}

var numGradoSerie = 1;
function oirNuevoSonido() {
    estado = 4;
    posgradop = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]; //inicializa
    if (numGradoSerie <= serieUsuario) {
	   	$("#gradop" + numGradoSerie).appendTo("#pantprinc");
		$("#gradop" + numGradoSerie).css("position", "absolute");
		$("#gradop" + numGradoSerie).css("left", 955);
		$("#gradop" + numGradoSerie).css("top", 145);
	    document.getElementById('teclado').src = "teclado.png";
	    document.getElementById("gradop" + numGradoSerie).src = "gradop.png";
	    $("#gradop" + numGradoSerie).css("display", "inline");
	    var x = $("#gradop" + numGradoSerie).position().left
	    if (x == 955 || x == 490 + (numGradoSerie-1) * 39) {
	        $("#gradop" + numGradoSerie).css("top", 145);
	        seleccionarGrado(numGradoSerie);
	        var velocidad = (955 -(490 + (39 * (numGradoSerie - 1)))) / 600;
	        animarHorizontal("#gradop" + numGradoSerie, 955, 490 + (39 * (numGradoSerie-1)), 10 * velocidad, 10, function(){
	        	numGradoSerie++;
	        	var date = new Date();
//- date.getMilliseconds()
	    		setTimeout(oirNuevoSonido, 100 ); // tiempo entre los gradop en una serie.
	        });
	    }
	    
	} else {
		esperaMoverGrado();
    	setTimeout(titulox, 1000);
    }
}

function titulox() {
	estado = 5;
	//$("#encabezado").css("color","white");
	if (listaGrados.length == 1) {
		$("#encabezado").text("Ubica el sonido ? frente a un grado");
	} else{
		$("#encabezado").text("Ubica cada sonido ? frente a un grado");
	};
    
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

function iluminar(obj, num) {
	var f = function() {
		if (num < 1) {
			num = num + 0.1;
			$(obj).css("opacity", num);
			setTimeout(f,60);
		};
	}
	f();
}

function apagar(obj, num) {
	var f = function() {
		if (num > 0) {
			num = num - 0.1;
			$(obj).css("opacity", num);
			setTimeout(f,60);
		};
	}
	f();
}

function portada1() {
	if (estado == 29) {
		iluminar("#portada1", 0);
	};
}
function portada2() {
	if (estado == 29) {
		iluminar("#portada2", 0);
	};
}
function portada3() {
	if (estado == 29) {
		iluminar("#portada3", 0);
	};
}

function creditos1() {
	if (estado == 29) {
		iluminar("#creditos1", 0);
	};
}
function creditos2() {
	if (estado == 29) {
		iluminar("#creditos2", 0);
	};
}
function creditos3() {
	if (estado == 29) {
		iluminar("#creditos3", 0);
	};
}
function creditos4() {
	if (estado == 29) {
		iluminar("#creditos4", 0);
	};
}
function creditos5() {
	if (estado == 29) {
		iluminar("#creditos5", 0);
	};
}
function creditos6() {
	if (estado == 29) {
		iluminar("#creditos6", 0);
	};
}
function boton1() {
	if (estado == 29) {
		//estado = 30; // Cerrar portada y entrar al programa
		$("#boton1").css("color", "rgb(90,90,90)");
		$("#boton1").css("border", "2px solid rgb(90,90,90)");
	};
}

function cerrarPortada() {
	apagar("#fondoEntrada", 1.0);
	$("#boton1").css("color", "rgb(0,0,0)"); // esconde boton ENTRAR
	$("#boton1").css("border", "");
	$("#boton1").text("");
	$("#boton1").css("top", 0);
	$("#boton1").css("left", 0);
	$(".portada").css("top", 0);
	$(".portada").css("left", 0);
	$(".portada").css("width", 0);
	$(".portada").css("height", 0);
	setTimeout(titulo1, 300);
}

function resetTeclado() {
	document.getElementById('teclado').src = "teclado.png";
}

function oirArpegio(num) {
	nota = 0;
	var ton = tonica + 1; // Calcula el # del archivo grafico del acorde segun la tonalidad 
	if (modo > 0) {  	  // y el modo seleccionados por el usuario
		ton = ton + 12;
	}; 
	var f = function() {
		if (nota < arpegio.length) {
			tocarGrado(arpegio[nota], true, true);
			nota++;
			setTimeout(f,930);
		} else {
			document.getElementById('teclado').src = "tonal" + ton + ".png";
			tocarGrado(0, true, false);
			tocarGrado(2, true, false);
			tocarGrado(4, true, false);
			tocarGrado(7, true, false);
			estado = num;
			setTimeout(resetTeclado,950);
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

function mostrarOcultarDashedCircles(num) {
	var listaC = [".g1", ".g2", ".g3", ".g4", ".g5", ".g6", ".g7", ".g8", ".g9", ".g10"];
	if (num == 0) {
		for (var i = 0; i <= listaC.length - 1; i++) {
			 $(listaC[i]).css("border", "");
		};
	} else if (num == 1) {
		$(".g1").css("border", "1px dashed gray");
	} else if (num > 1) {
		for (var i = 0; i <= num - 1; i++) {
			 $(listaC[i]).css("border", "1px dashed gray");
		};
	};
}

function clickTamanoSerie(num) {
	$(idsTamanoSerie[num-1]).on("click", "", function () {
		if (estado == 20 || estado == 0) {
			serieUsuario = num;
			if (num == 1) { 
				$("#nuevosonido").text("Nuevo sonido");
				$("#repetirsonido").text("Repetir sonido");
			} else {
				$("#nuevosonido").text("Nueva serie");
				$("#repetirsonido").text("Repetir serie");
			};
			mostrarOcultarDashedCircles(0);
			mostrarOcultarDashedCircles(num);
			activarHoverTamañoSerie(num);
		}
	});
}

function inicio() {
	iniGrados();

	$("#boton1").on( "mouseenter", function() {
		if (estado == 29) {
			$("#boton1").css("color", "rgb(0,100,255)");
			$("#boton1").css("border", "2px solid rgb(210,100,20)");
		}
	});

	$("#boton1").on( "mouseleave", function() {
		if (estado == 29) {
			$("#boton1").css("color", "rgb(90,90,90)");
			$("#boton1").css("border", "2px solid rgb(90,90,90)");
		}
	});

	$("#boton1").on("click", "", function () {
		if (estado == 29) {
			estado = 31;
			apagar(".portada", 1.0);
			setTimeout(cerrarPortada, 1000);
		}
	});


	$("#nuevosonido").on( "mouseover", function() {
		$("#nuevosonido").unbind("mouseenter mouseleave");
		$("#nuevosonido").css("background-color", "");
  		if (estado == 3 || estado == 5 || estado == 6) {
			$("#nuevosonido").hover(function(){
    		$(this).css("background-color", "rgb(0,0,70)");
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
    		$(this).css("background-color", "rgb(0,0,70)");
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
    		$(this).css("background-color", "rgb(0,0,70)");
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
    		$(this).css("background-color", "rgb(0,0,60)");
    		}, function(){
    		$(this).css("background-color", "");
			});
		}else{
			$("#evaluar").css("background-color", "");
		};
	});

	$("#nuevosonido").on("click", "", function (evento) {
		$(".sgp").css("display", "none");
		//Se necesita inicializar en inactivo hover de todos los circulos en las columnas de respuesta debajo de los gradop.
		if (estado == 3) {
			listaGrados = [];
			ocultaGradosp();
			gradosSeleccionados = [[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
			gradosActivos = [0,0,0,0,0,0,0,0];
			numGradoSerie = 1;
			$(".gris").css("background-color","");
           	oirNuevoSonido();
       } else if (estado == 5) {
       		estado = 10;
       		if (confirm("¿Está seguro que desea cambiar de sonido?")) {
       			listaGrados = [];
       			ocultaGradosp();
       			gradosSeleccionados = [[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
       			gradosActivos = [0,0,0,0,0,0,0,0];
       			numGradoSerie = 1;
       			$(".gris").css("background-color","");
       			oirNuevoSonido();
       		} else {
       			esperaMoverGrado();
       		};
       } else if (estado == 6) {
       		estado = 13;
       		if (confirm("¿Está seguro que desea cambiar de sonido?")) {
       			listaGrados = [];
       			ocultaGradosp();
       			gradosSeleccionados = [[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
       			gradosActivos = [0,0,0,0,0,0,0,0];
       			numGradoSerie = 1;
       			$(".gris").css("background-color","");
       			oirNuevoSonido();
       		} else {
       			estado = 6;
       		};
       };

	});

	$("#repetirsonido").on("click", "", function (evento) {
		pos = 0;
		//tocarListaGrados();
		if (estado == 5) {
			estado = 14;
			tocarListaGrados(5, true, false);
		} else if (estado == 6){
			estado = 12;
			tocarListaGrados(6, true, false);
			//esperarTocarGrado(grado, true, false, 1050, pasaa6);
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
	for (var i = idsTamanoSerie.length - 1; i >= 0; i--) {
		clickTamanoSerie(i + 1);
	};


	// Click sobre botones de Meta
	$("#meta1").on("click", "", function () {
		if (estado == 0 || estado == 21) {
			desactivarHoverTamañoSerie();
			ajustarMeta(3,this);
		}
	});
	$("#meta2").on("click", "", function () {
		if (estado == 0 || estado == 21) {
			desactivarHoverTamañoSerie();
			ajustarMeta(4,this);
		}
	});
	$("#meta3").on("click", "", function () {
		if (estado == 0 || estado == 21) {
			desactivarHoverTamañoSerie();
			ajustarMeta(5,this);
		}
	});
	$("#meta4").on("click", "", function () {
		if (estado == 0 || estado == 21) {
			desactivarHoverTamañoSerie();
			ajustarMeta(6,this);
		}
	});
	$("#meta5").on("click", "", function () {
		if (estado == 0 || estado == 21) {
			desactivarHoverTamañoSerie();
			ajustarMeta(7,this);
		}
	});
	$("#meta6").on("click", "", function () {
		if (estado == 0 || estado == 21) {
			desactivarHoverTamañoSerie();
			ajustarMeta(8,this);
		}
	});
	$("#meta7").on("click", "", function () {
		if (estado == 0 || estado == 21) {
			desactivarHoverTamañoSerie();
			ajustarMeta(9,this);
		}
	});
	$("#meta8").on("click", "", function () {
		if (estado == 0 || estado == 21) {
			desactivarHoverTamañoSerie();
			ajustarMeta(10,this);
		}
	});
	$("#meta9").on("click", "", function () {
		if ( estado == 0 || estado == 21) {
			desactivarHoverTamañoSerie();
			ajustarMeta(11,this);
		}
	});
	$("#meta10").on("click", "", function () {
		if (estado == 0 || estado == 21) {
			desactivarHoverTamañoSerie();
			ajustarMeta(12,this);
		}
	});
	$("#meta11").on("click", "", function () {
		if (estado == 0 || estado == 21) {
			desactivarHoverTamañoSerie();
			ajustarMeta(13,this);
		}
	});
	$("#meta12").on("click", "", function () {
		if (estado == 0 || estado == 21) {
			desactivarHoverTamañoSerie();
			ajustarMeta(14,this);
		}
	});
	$("#meta13").on("click", "", function () {
		if (estado == 0 || estado == 21) {
			desactivarHoverTamañoSerie();
			ajustarMeta(15,this);
		}
	});
	$("#meta14").on("click", "", function () {
		if (estado == 0 || estado == 21) {
			desactivarHoverTamañoSerie();
			ajustarMeta(16,this);
		}
	});
	$("#meta15").on("click", "", function () {
		if (estado == 0 || estado == 21) {
			desactivarHoverTamañoSerie();
			ajustarMeta(17,this);
		}
	});
	$("#meta16").on("click", "", function () {
		if (estado == 0 || estado == 21) {
			desactivarHoverTamañoSerie();
			ajustarMeta(18,this);
		}
	});
	$("#meta17").on("click", "", function () {
		if (estado == 0 || estado == 21) {
			desactivarHoverTamañoSerie();
			ajustarMeta(19,this);
		}
	});
	$("#meta18").on("click", "", function () {
		if (estado == 0 || estado == 21) {
			desactivarHoverTamañoSerie();
			ajustarMeta(20,this);
		}
	});

	// Click sobre botones de tipo de Escala
	$("#modo1").on("click", "", function (evento) {
		if (estado == 21 || estado == 1) {
			modo = 0;
			tonUsuario = tonMayor;
			ajustarModo(this);
		}
	});
	$("#modo2").on("click", "", function (evento) {
		if (estado == 21 || estado == 1) {
			modo = 1;
			tonUsuario = tonMenorArmonica;
			ajustarModo(this);
		}
	});
	$("#modo3").on("click", "", function (evento) {
		if (estado == 21 || estado == 1) {
			modo = 2;
			tonUsuario = tonMenorNatural;
			ajustarModo(this);
		}
	});
	$("#modo4").on("click", "", function (evento) {
		if (estado == 21 || estado == 1) {
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
	
	setTimeout(portada1, 400); //Inicia presentación del programa
	setTimeout(portada2, 0);
	setTimeout(portada3, 2400);
	setTimeout(creditos1, 3400); 
	setTimeout(creditos2, 4400); 
	setTimeout(creditos3, 5400); 
	setTimeout(creditos4, 6400); 
	setTimeout(creditos5, 7400); 
	setTimeout(creditos6, 8400);
	setTimeout(boton1, 500); 
}

