// Grados Web 2015 
// Software para la percepción y el reconocimiento de los grados en escalas modo-tonales
// Autor: Pedro Omar Baracaldo R. profesor asociado, departamento de música, Universidad de los Andes
// email: pbaracal@uniandes.edu.co

var listaGrados = [];
var tonMayor = [0,2,4,5,7,9,11,12];
var tonMenorNatural = [0,2,3,5,7,8,10,12];
var tonMenorArmonica = [0,2,3,5,7,8,11,12];
var tonUsuario = []; // Vacío al iniciar.
var tonica = 7; // Do al iniciar.
var etiquetasMayor = ['FA','FA#/SOLb','SOL','LAb','LA','SIb','SI/DOb','DO','DO#/REb','RE','MIb','MI'];
var etiquetasMenor = ['fa','fa#','sol','sol#/lab','la','la#/sib','si','do','do#','re','re#/mib','mi'];
var modo = 0; // variable para cargar el modo correspondiente: 0 = Mayor, 1 = menor natural, 2 = menor armónico y 3 = menor melódico.
var nomtonMayor = ['FA Mayor','FA# Mayor','SOL Mayor','LAb Mayor','LA Mayor','SIb Mayor','SI Mayor','DO Mayor','DO# Mayor','RE Mayor','MIb Mayor','MI Mayor'];
var listaSonidos = ['Fa3.mp3','Fas3.mp3','Sol3.mp3','Lab3.mp3','La3.mp3','Sib3.mp3','Si3.mp3','Do4.mp3','Dos4.mp3','Re4.mp3','Mib4.mp3','Mi4.mp3','Fa4.mp3','Fas4.mp3','Sol4.mp3','Lab4.mp3','La4.mp3','Sib4.mp3','Si4.mp3','Do5.mp3','Dos5.mp3','Re5.mp3','Mib5.mp3','Mi5.mp3'];
var mover = false;
var teclas = ['tecla1.png','tecla2.png','tecla3.png','tecla4.png','tecla5.png','tecla6.png','tecla7.png','tecla8.png','tecla9.png','tecla10.png','tecla11.png','tecla12.png','tecla13.png','tecla14.png','tecla15.png','tecla16.png','tecla17.png','tecla18.png','tecla19.png','tecla20.png','tecla21.png','tecla22.png','tecla23.png','tecla24.png'];
var coordsTeclado = [-5, 15, 29, 46, 61, 78, 97, 127, 142, 157, 175, 190];
var idTonalidades = ["#FA", "#FAs", "#SOL", "#LAb", "#LA", "#SIb", "#SI", "#DO", "#DOs", "#RE", "#MIb", "#MI"];
var gradoGrafs = ["grado1.png","grado2.png","grado3.png","grado4.png","grado5.png","grado6.png","grado7.png","grado8.png","gradop.png"];
var posMarcasSerie = [458, 498, 538, 578, 617, 656, 696, 736, 775, 815];
var tamañoSerie = 0;
var grado = 0;
var gradoSelUsuario = 0;
var posGradop = 0; // guarda posición de gradop cuando el usuario hace click en gradop y queda fijo frente a algún grado
var meta = 0; // cantidad de ejercicios
var nota = 0;
var audioElement = null;
var arpegio = [0,2,4,7];
var aciertos = 0;
var pifias = 0;
var estado = 0; // 0 = Ajustar meta inicila
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
		var cad = "<audio src = '" + listaSonidos[i] + "' id = '" + 
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
	$("#gradop").css("left", 450);
	$("#gradop").css("top", 140);

	for (var i = 1; i < 9; i++) {
		$(document).ready(function(){
			var nom = "#grado" + i + "-1";
	      $("#grado" + i + "-1").hover(  // función para mover grado ? frente a grados de respuesta.
	        function(event){
	            //debugger
	            $("#gradop").appendTo(nom);
	            $("#gradop").css("position", "relative");
	            $("#gradop").css("left", 1);
	            $("#gradop").css("top", 1);
	            $("#sombraGrados").css("display", "inline");
	            var x = $(nom).position();
	            $("#sombraGrados").css("top", x.top);
	        },
	        function(event){
	            $("#gradop").appendTo("#pantprinc");
	            $("#gradop").css("position", "absolute");
	            $("#gradop").css("left", 450);
	            $("#gradop").css("top", 140);
	            $("#sombraGrados").css("display", "none");
	        }
	      );

	    });

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

function ajustarTonalidad(num, $obj) {
	estado = 2;
	listaGrados = [0,1,2,3,4,5,6,7];
	tonica = num;
	
	$("#teclado").css('top', coordsTeclado[num]);
	$("#grado1").css('left', 300);
	$("#grado2").css('left', 300);
	$("#grado3").css('left', 300);
	$("#grado4").css('left', 300);
	$("#grado5").css('left', 300);
	$("#grado6").css('left', 300);
	$("#grado7").css('left', 300);
	$("#grado8").css('left', 300);

	$(".tonal").css('border', "2px solid rgb(80,80,80)"); // asi se llama una clase de objetos.
	$(".tonal").css('color', "rgb(80,80,80)");
	$obj.css('border', "3px solid orange");
	$obj.css('color', "rgb(0,160,255)");

	animarHorizontal("#grado1", 300, 370, 1, 10, function() {
		esperarFinAudio();
		animarHorizontal("#grado2", 300, 370, 1, 10, function() {
			esperarFinAudio();
			animarHorizontal("#grado3", 300, 370, 1, 10, function() {
				esperarFinAudio();
				animarHorizontal("#grado4", 300, 370, 1, 10, function() {
					esperarFinAudio();
					animarHorizontal("#grado5", 300, 370, 1, 10, function() {
						esperarFinAudio();
						animarHorizontal("#grado6", 300, 370, 1, 10, function() {
							esperarFinAudio();
							animarHorizontal("#grado7", 300, 370, 1, 10, function() {
								esperarFinAudio();
								animarHorizontal("#grado8", 300, 370, 1, 10, function() {
									esperarFinAudio();
									document.getElementById('teclado').src = "teclado.png";
									estado = 3;
									$("#encabezado").text("Escoge un Nuevo sonido");
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

function evaluar() {
	estado = 7;
	var lisRom = ["I.", "II.", "III.", "IV.", "V.", "VI.", "VII.", "I agudo."];
	if (grado == posGradop) {
		$("#encabezado").text("Muy bien, ha sonado el grado " + lisRom[posGradop]);
		document.getElementById("gradop").src = gradoGrafs[grado];
		esperarTocarGrado(grado, true,true, 1500, function() {
		aciertos++;
		$("#marcador1").text(aciertos);
		$("#encabezado").text("Selecciona un Nuevo sonido");
		$(".g1").css("background-color","");
		if (aciertos >= meta) {
			$("#encabezado").text("¡ Muy bien ! has alcanzado la meta propuesta.");
			seleccionarMeta();
		} else {
			estado = 3;
		}});
	} else {
		$("#encabezado").text("Intenta con otro grado.");
		var nom = "#grado" + (posGradop + 1) + "-1"; 
		$(nom).css("background-color","rgb(50,50,50)"); // marca con gris el sonido equivocado
		$(nom).unbind("mouseenter mouseleave"); // desactiva efecto HOVER, no permite una segunda respuesta en este grado
		if (gradoSelUsuario == posGradop) { // evita que el usuario evalúe un sonido equivocado mas de una vez
			$("#encabezado").text("Pruebe ubicando el sonido ? frente a otro grado.");
			esperaMoverGrado();
		} else{
			pifias++;
			$("#marcador2").text(pifias);
			esperaMoverGrado();
		};	
	};
	gradoSelUsuario = posGradop;
}

function seleccionarTonalidad() {
	estado = 1;  // espera a que se oprima un boton de tonalidad.
    $("#encabezado").text("Selecciona una tonalidad.");
}

function seleccionarMeta(){
	estado = 0;
	aciertos = 0;
	pifias = 0;
	meta = prompt("Define una Meta: \n ¿Con cuántos sonidos desea practicar?")
	seleccionarTonalidad();
	$("#gradop").css("display", "none");
	$("#sombraGrados").css("display", "none");
	$("#marcador1").text(aciertos);
	$("#marcador2").text(pifias);
	$(".tonal").css('border', "2px solid rgb(80,80,80)");
	$(".tonal").css('color', "rgb(80,80,80)");
	document.getElementById('teclado').src = "teclado.png";
}

function oirNuevoSonido() {
    estado = 4;
    $("#gradop").appendTo("#pantprinc");
	$("#gradop").css("position", "absolute");
	$("#gradop").css("left", 915);
	$("#gradop").css("top", 140);
    document.getElementById('teclado').src = "teclado.png";
    document.getElementById('gradop').src = "gradop.png";
    $("#gradop").css("display", "inline");
    var x = $("#gradop").position().left
    if (x == 915 || x == 450) {
        $("#gradop").css("top", 140);
        seleccionarGrado();
        animarHorizontal("#gradop", 915, 450, 5, 10, esperaMoverGrado);
        gradoSelUsuario = 0;
    }
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

function inicio() {
	iniGrados();

	// Ciclo para cargar nombres de tonalidades segun el modo activo.
	for (var i = 0; i <= etiquetasMayor.length; i++) {
		if (modo == 0) {
			$(idTonalidades[i]).text(etiquetasMayor[i]);
			tonUsuario = tonMayor;
		} else{
			$(idTonalidades[i]).text(etiquetasMenor[i]);
		};		
	};
	
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
		} else if (estado == 3) {
			estado = 15;
			oirArpegio(3);
		}
	});

	$("#evaluar").on("click", "", function (evento) {
		if (estado == 6 ) {
			evaluar();
		};
	});

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
	

	seleccionarMeta();
}

