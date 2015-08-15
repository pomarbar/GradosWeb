// Grados Web 2015 
// Software para la percepción y el reconocimiento de los grados en escalas modo-tonales
// Autor: Pedro Omar Baracaldo R. profesor asociado, departamento de música, Universidad de los Andes
// email: pbaracal@uniandes.edu.co

var listaGrados = [];
var tonMayor = [0,2,4,5,7,9,11,12];
var tonMenorNatural = [0,2,3,5,7,8,10,12];
var tonMenorArmonica = [0,2,3,5,7,8,11,12];
var tonUsuario = [0,2,4,5,7,9,11,12];
var tonica = 7;
var nomtonMayor = ['FA Mayor','FA# Mayor','SOL Mayor','LAb Mayor','LA Mayor','SIb Mayor','SI Mayor','DO Mayor','DO# Mayor','RE Mayor','MIb Mayor','MI Mayor'];
var listaSonidos = ['Fa3.mp3','Fas3.mp3','Sol3.mp3','Lab3.mp3','La3.mp3','Sib3.mp3','Si3.mp3','Do4.mp3','Dos4.mp3','Re4.mp3','Mib4.mp3','Mi4.mp3','Fa4.mp3','Fas4.mp3','Sol4.mp3','Lab4.mp3','La4.mp3','Sib4.mp3','Si4.mp3','Do5.mp3','Dos5.mp3','Re5.mp3','Mib5.mp3','Mi5.mp3'];
var mover = false;
var teclas = ['tecla1.png','tecla2.png','tecla3.png','tecla4.png','tecla5.png','tecla6.png','tecla7.png','tecla8.png','tecla9.png','tecla10.png','tecla11.png','tecla12.png','tecla13.png','tecla14.png','tecla15.png','tecla16.png','tecla17.png','tecla18.png','tecla19.png','tecla20.png','tecla21.png','tecla22.png','tecla23.png','tecla24.png'];
var coordsTeclado = [-5, 15, 29, 46, 61, 78, 97, 127, 142, 157, 175, 190];
var idTonalidades = ["#FA", "#FAs", "#SOL", "#LAb", "#LA", "#SIb", "#SI", "#DO", "#DOs", "#RE", "#MIb", "#MI"];
var gradoGrafs = ["grado1.png","grado2.png","grado3.png","grado4.png","grado5.png","grado6.png","grado7.png","grado8.png","gradop.png"];
var grado = 0;
var gradoSelUsuario = 0;
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
				// 11 =  escucha parte de tonalidad después de haber ubicado gradop en algún grado
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

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.originalEvent.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    //var data = ev.originalEvent.dataTransfer.getData("text");
   
    $("#gradop").css("left", $(ev.target).position().left + 1);
    $("#gradop").css("top", $(ev.target).position().top + 1);
    estado = 6; // espera evaluar principalmente
    $("#encabezado").text("Evalúe su respuesta");
}

function esperaMoverGrado() {
	estado = 5;
	$("#gradop").on("dragstart", "", function (evento) {
		drag(evento);
	});

	for (var i = 1; i < 9; i++) {
		$("#grado" + i + "-1").on("drop", "", function (evento) {
			drop(evento);
		});
		$("#grado" + i + "-1").on("dragover", "", function (evento) {
			allowDrop(evento);
		});
		 // $("#grado" + i + "-1").mouseover(function (evento) {
		 // 	$("#gradop").css("top", $(evento.target).position().top + 1);;
		 // });

		 // $("#grado" + i + "-1").mouseout(function (evento){
		 // 	$("#gradop").css("top", 130);
		 // });
	};
	$("#encabezado").text("Ubica el sonido ? frente a un grado");
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
	$("#nomTon").html(nomtonMayor[num]);
	$("#teclado").css('top', coordsTeclado[num]);
	$("#grado1").css('left', 300);
	$("#grado2").css('left', 300);
	$("#grado3").css('left', 300);
	$("#grado4").css('left', 300);
	$("#grado5").css('left', 300);
	$("#grado6").css('left', 300);
	$("#grado7").css('left', 300);
	$("#grado8").css('left', 300);

	$(".tonal").css('border', "");
	$obj.css('border', "1px solid white");

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
	var y = $("#gradop").position().top;
	for (var i = 0; i < 8; i++) {
		pos = $("#grado" + (i + 1) + "-1").position().top;
		if (pos + 1 == y) {
			break;
		};
	};

	if (grado == i) {
		$("#encabezado").text("Muy bien, ha sonado el grado " + lisRom[i]);
		document.getElementById("gradop").src = gradoGrafs[grado];
		esperarTocarGrado(grado, true,true, 1500, function() {
		aciertos++;
		$("#marcador1").text(aciertos);
		if (aciertos >= meta) {
			$("#encabezado").text("¡ Muy bien ! has alcanzado la meta propuesta.");
			seleccionarMeta();
		} else {
			estado = 3;
		}});
	} else {
		$("#encabezado").text("Intenta con otro grado.");
		if (gradoSelUsuario == i) { // evita que el usuario evalúe un sonido equivocado mas de una vez
			$("#encabezado").text("Pruebe ubicando el sonido ? frente a otro grado.");
		} else{
			pifias++;
			$("#marcador2").text(pifias);
			estado = 6;
		};	
	};
	gradoSelUsuario = i;
}

function seleccionarTonalidad() {
	estado = 1;  // espera a que se oprima un boton de tonalidad.
    $("#encabezado").text("Selecciona una tonalidad.");
}

function seleccionarMeta(){
	estado = 0;
	aciertos = 0;
	pifias = 0;
	meta = prompt("¿Cuántos ejercicios desea hacer?")
	seleccionarTonalidad();
	$("#gradop").css("display", "none");
	$("#marcador1").text(aciertos);
	$("#marcador2").text(pifias);
}

function oirNuevoSonido() {
    estado = 4;
    document.getElementById('teclado').src = "teclado.png";
    document.getElementById('gradop').src = "gradop.png";
    $("#gradop").css("display", "inline");
    var x = $("#gradop").position().left
    if (x == 915 || x == 450) {
        $("#gradop").css("top", 130);
        seleccionarGrado();
        animarHorizontal("#gradop", 915, 450, 5, 10, esperaMoverGrado);
        gradoSelUsuario = 0;
    }
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

	$("#nuevosonido").on("click", "", function (evento) {
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
		if (estado == 6) {
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

