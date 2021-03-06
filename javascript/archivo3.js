/*
Codigo Realizado por: 
Carlos Mario Duque Mejía
Juan David Jimenez Lopez
Jorge Ivan Hurtado Imbachi
*/

//cada octeto de la ip ingresada, netid, hostid, dirrecciones para los host, bits para subred y  cantidad de direcciones de subred.
var ip1, ip2, ip3, ip4, netId, hostId, numHost, bitsSubred, dirSubred;
//mascara de subred binaria.
var maskBinario = new Array(32);
//mascara de subred decimal.
var maskDecimal = new Array();
//ip binario.
var ipBinario = new Array(32);
//ip decimal.
var ipDecimal = new Array();
//broadcast binario.
var broadcastBinario = new Array(32);
//broadcast decimal.
var broadcastDecimal = new Array();
//red binario.
var redBinario = new Array(32);
//red decimal.
var redDecimal = new Array();
//Matriz que almacena la primera direccion host y la ultima.
var rango = new Array(2);
//determina si la ejecucion es valida o no (errores).
var validez = true;
//especifica el mensaje de error que se debe mostrar.
var mensajeErr;
//determina si los datos de la ip la net id y los bits de subred han sido ingresados
var isIpIngresada = false;

/*
* ejecuta todos los metodos asociados a la primera parte de la ejecucion del tercer punto.
*/
function ejecutarTercerPunto() {
    limpiarFormulario();
    limpiarEntradas();
    leerDatos();
    recibirDatos();
    llenarDatos();
    crearTablaTotal(dirSubred - 1);
    

}

/*
*Se encarga de llamar a los metodos
*que obtendran sus valores a partir de los datos capturados en el metodo leerDatos().
*/
function recibirDatos() {
    if (isNaN(ip1) || isNaN(ip2) || isNaN(ip3) || isNaN(ip4) || isNaN(netId) || isNaN(bitsSubred)) {

        validez = false;
        mensajeErr = "Campos Vacios";
    } else {
        hostId = 32 - netId;
        if (ip1 < 0 || ip1 > 255 || ip2 < 0 || ip2 > 255 || ip3 < 0 || ip3 > 255 || ip4 < 0 || ip4 > 255 || netId < 0 || netId > 30 || bitsSubred >= (hostId - 1)) {
            validez = false;
            mensajeErr = "Valores fuera de Rango";
        } else if (!validarIp() || !validarNet()) {
            validez = false;
            mensajeErr = "Mascara de red o Direccion Ip Erroneas";
        }
        else {
            isIpIngresada = true;
            //hosts - 2 que serian la subred y el broadcast
            numHost = 2 ** (hostId - bitsSubred) - 2;
            dirSubred = 2 ** bitsSubred;
            obtenerMascara();
            obtenerBroadCast();
            obtenerRed();
        }
    }
}


/*
*Este metodo valida la netid para el ip ingresado
*/
function validarNet() {
    var posicion = ipBinario.lastIndexOf(1);

    if (netId - 1 < posicion) {
        return false;
    } else {
        return true;
    }
}

/**
 * envia la posicion del ultimo 1 para validar la netid
 * @returns retorna la posicion del ultimo 1 de la ip ingresada en binario
 */
function validarNetRandom() {
    var posicion = ipBinario.lastIndexOf(1);
    return posicion + 1;
}

/**
 * Metodo que valida la ip para que existan host.
 * @returns true si la ip es valida false en caso contrario
 */
function validarIp() {
    obtenerIp();
    if (ipBinario[30] == 1 || ipBinario[31] == 1) {
        return false;
    } else {
        return true;
    }
}
/*
*Se encarga de capturar los datos ingresados en los campos de texto.
*/
function leerDatos() {
    ip1 = parseInt(document.getElementById("octanteHostId1").value);
    ip2 = parseInt(document.getElementById("octanteHostId2").value);
    ip3 = parseInt(document.getElementById("octanteHostId3").value);
    ip4 = parseInt(document.getElementById("octanteHostId4").value);
    netId = parseInt(document.getElementById("mascaraSubRedId").value);
    bitsSubred = parseInt(document.getElementById("campoBitsSubNet").value);
}

/*
*Obtiene la mascara de subred en binario y decimal a partir del valor netId.
*/
function obtenerMascara() {

    for (var i = 0; i < netId; i++) {
        maskBinario[i] = 1;
    }
    for (var i = netId; i < 32; i++) {
        maskBinario[i] = 0;
    }
    maskDecimal = binarioADecimal(maskBinario);
}

/*
*Obtiene la ip en binario y decimal a partir de los datos ip1,ip2,ip3,ip4.
*/
function obtenerIp() {
    ipDecimal= new Array();
    var array1 = new Array(8), array2 = new Array(8), array3 = new Array(8), array4 = new Array(8);
    array1 = decimalABinario(ip1);
    array2 = decimalABinario(ip2);
    array3 = decimalABinario(ip3);
    array4 = decimalABinario(ip4);

    ipBinario = array1.concat(array2)
    ipBinario = ipBinario.concat(array3);
    ipBinario = ipBinario.concat(array4);

    ipDecimal.push(ip1)
    ipDecimal.push(ip2)
    ipDecimal.push(ip3)
    ipDecimal.push(ip4)
}

/*
*Obtiene la direccion de broadcast binaria y decimal a partir de la ip binaria.
*/
function obtenerBroadCast() {
    broadcastBinario = [].concat(ipBinario);

    for (var i = netId; i < 32; i++) {
        broadcastBinario[i] = 1;
    }

    broadcastDecimal = binarioADecimal(broadcastBinario);
}

/*
*Obtiene la direccion de red con la red binaria y la mascara binaria.
* se realiza la operacion and.
*/
function obtenerRed() {

    for (var i = 0; i < 32; i++) {

        redBinario[i] = ipBinario[i] * maskBinario[i];

    }
    redDecimal = binarioADecimal(redBinario);
}

/**
 * Obtiene la direccion ip de la subred especificada
 * @param {} numeroSubRed es el numero de la subred 
 * @returns retorna la direccion ip de la subred en binario
 * 
 * 11111111 000000000 01010101 ,111,10011 /24 nid=24 hid=8 bitsS=3
 * 
 * 7
 * 000000000000000111
 */
function obtenerSubred(numeroSubRed) {
    //numero de la subred en binario
    var numeroSubBinario = decimalABinario(numeroSubRed);
    //copia de la red principal que se convertira en la subred en binario
    var subred = [].concat(redBinario);

        while (numeroSubBinario.length < bitsSubred) {
            numeroSubBinario.unshift(0);
        }

        while (numeroSubBinario.length > bitsSubred) {
            numeroSubBinario.shift();
        }

    for (var j = 0; j < numeroSubBinario.length; j++) {
        subred[(j + netId)] = numeroSubBinario[j];
    }

    return subred;
}

/**
 * Obtiene el broadcast de la subred
 * @param {} subredBinario ip de la subred en binario (array)
 * @returns  devuelve el broadcast en binario
 */
function obtenerBroadcastSubred(subredBinario) {
    var broadcastS = [].concat(subredBinario);
    var total = netId + bitsSubred;

    for (var k = total; k < 32; k++) {
        broadcastS[k] = 1;
    }

    return broadcastS;
}

/*
*@param ip array de la ip en decimal.
*A partir una direccion decimal obtiene su direccion binaria en un octeto.
*@return retorna un array con la direccion en binario.
*/
function decimalABinario(ip) {
    var binario = new Array();
    while (ip > 1) {
        binario.unshift(ip % 2);
        ip = Math.floor(ip / 2);
    }
    binario.unshift(ip);

    if (binario.length < 8) {
        while (binario.length < 8) {
            binario.unshift(0);
        }
    }
    return binario;
}

/*
*@param binario array de una direccion ip en binario.
*A partir de la ip en binario obtiene la ip en decimal
*@return retorna un array con la direccion en decimal
*/
function binarioADecimal(binario) {
    var n1 = 0, n2 = 0, n3 = 0, n4 = 0;
    var decimal = new Array();

    binario = binario.reverse();
    for (var i = 0; i < binario.length; i++) {
        if (i < 8) {
                n1 = n1 + binario[i]*(2 ** i);
        } else if (i >= 8 && i <= 15) {
                n2 = n2 + binario[i]* (2 ** (i - 8));
        } else if (i >= 16 && i <= 23) {
                n3 = n3 + binario[i]* (2 ** (i - 16));
        } else if (i >= 24 && i <= 31) {
                n4 = n4 + binario[i]* (2 ** (i - 24));
        }
    }

    decimal.push(n4);
    decimal.push(n3);
    decimal.push(n2);
    decimal.push(n1);
    binario = binario.reverse();
    return decimal;
}

/*
*@param array de una direccion ip en decimal.
*Genera una cadena de la direccion ip deseada.
*@return cadena de la ip.
*/
function decimalAString(decimal) {
    var cadenaDecimal = "";

    for (var i = 0; i < decimal.length; i++) {
        cadenaDecimal += decimal[i];
        if (i != (decimal.length - 1)) {
            cadenaDecimal += ".";
        }

    }

    return cadenaDecimal;
}

/**
 * obtiene el rango de direcciones de los host en la red principal
 */
function obtenerExtremosDirecciones() {
    var hostInicial = new Array(), hostUltimo = new Array(), hostInicialD, hostPenultimoD;

    hostInicial = [].concat(redBinario);
    hostUltimo = [].concat(broadcastBinario);
    hostInicial[31] = 1;
    hostUltimo[31] = 0;
    hostInicialD = binarioADecimal(hostInicial);
    hostPenultimoD = binarioADecimal(hostUltimo);
    rango[0] = hostInicialD;
    rango[1] = hostPenultimoD;
}

/**
 * Obtiene el rango de direcciones de host de la subred especificada
 * @param {*} subred ip de la subred en binario(array)
 * @param {*} broadcast ip del broadcast de la subred en binario(array)
 * @returns 
 */
function obtenerRangoDireccionesSubRed(subred, broadcast) {
    var hostInicial = new Array(), hostUltimo = new Array(), hostInicialD, hostPenultimoD;
    var rangoSubred = new Array(2);

    hostInicial = [].concat(subred);
    hostUltimo = [].concat(broadcast);
    hostInicial[31] = 1;
    hostUltimo[31] = 0;
    hostInicialD = binarioADecimal(hostInicial);
    hostPenultimoD = binarioADecimal(hostUltimo);
    rangoSubred[0] = hostInicialD;
    rangoSubred[1] = hostPenultimoD;

    return rangoSubred;
}


/*
*Obtiene cada direccion de host que puede obtenerse.
@return retorna la cadena que contiene todas las direcciones de host.
*/
function obtenerListadoDireccionesHost() {
    var direcciones = "";
    for (var i = 0; i < numHost; i++) {
        redDecimal[3] = redDecimal[3] + 1;
        direcciones += decimalAString(redDecimal) + " || \n";
        if (redDecimal[3] == 255) {
            redDecimal[3] = 0;
            i++;
            if (redDecimal[2] < 255) {
                redDecimal[2] = redDecimal[2] + 1;
            } else {
                redDecimal[2] = 0
                if (redDecimal[1] < 255) {
                    redDecimal[1] = redDecimal[1] + 1;
                } else {
                    redDecimal[1] = 0;
                    if (redDecimal[0] < 255) {
                        redDecimal[0] = redDecimal[0] + 1;
                    }
                }
            }
            direcciones += decimalAString(redDecimal) + " || \n";
        }
    }

    return direcciones;
}

/*
*Limpia todos los campos de respuesta
*/
function limpiarFormulario() {
    document.getElementById("resultado1").innerHTML = "";
    document.getElementById("resultado2").innerHTML = "";
    document.getElementById("resultado3").innerHTML = "";
    document.getElementById("resultado4").innerHTML = "";
    document.getElementById("resultado5").innerHTML = "";
    document.getElementById("resultado6").innerHTML = "";
    document.getElementById("resultado7").innerHTML = "";
    document.getElementById("resultado8").innerHTML = "";
    document.getElementById("resultado9").innerHTML = "";
    document.getElementById("resultado10").innerHTML = "";
    document.getElementById("resultado11").innerHTML = "";
    document.getElementById("resultado12").innerHTML = "";
    document.getElementById("resultado13").innerHTML = "";
    document.getElementById("resultado14").innerHTML = "";

}

/**
 * Limpiar los campos y respuestas de ejercicios anteriores
 */
function limpiarEntradas() {
    document.getElementById("direccionSubRedEspecifica").value ="";
    document.getElementById("direccionBroadcastEspecifica").value = "";
    document.getElementById("numeroSubredParaHost").value= "";
    document.getElementById("numeroHostBuscado").value = "";
    document.getElementById("numeroSubredRangoHost").value = "";
    document.getElementById("octanteHost1").value = "";
    document.getElementById("octanteHost2").value = "";
    document.getElementById("octanteHost3").value = "";
    document.getElementById("octanteHost4").value = "";
    document.getElementById("octanteHost1,1").value = "";
    document.getElementById("octanteHost1,2").value = "";
    document.getElementById("octanteHost1,3").value = "";
    document.getElementById("octanteHost1,4").value = "";
    document.getElementById("octanteHost2,1").value = "";
    document.getElementById("octanteHost2,2").value = "";
    document.getElementById("octanteHost2,3").value = "";
    document.getElementById("octanteHost2,4").value = "";
    document.getElementById("numeroSubredUltimo").value = "";
    document.getElementById("cantidadH").value = "";
}

/**
 * genera una subred aleatoria para la tabla
 */
function generarSubredAleatoria() {
    document.getElementById("numeroSubred").value = Math.floor(Math.random() * dirSubred);
    crearTablaParcial();
}

/*
*ejecuta todos los metodos asociados al primer punto dados unos datos aleatorios
*/
function generarEjercicio3() {
    //ingreso de datos
    var numero;

    ip1 = Math.floor(Math.random() * 255);
    ip2 = Math.floor(Math.random() * 255);
    ip3 = Math.floor(Math.random() * 255);
    ip4 = llenarUltimoOcteto();
    obtenerIp();
    numero = validarNetRandom();
    netId = Math.floor(Math.random() * (31 - numero) + numero);
    bitsSubred = Math.floor(Math.random() * (31 - netId));//(32bits totales - netId(bits de la red)-2 para garantizar host)+1 para que el random si tome todos los valores

    document.getElementById("octanteHostId1").value = ip1;
    document.getElementById("octanteHostId2").value = ip2;
    document.getElementById("octanteHostId3").value = ip3;
    document.getElementById("octanteHostId4").value = ip4;
    document.getElementById("mascaraSubRedId").value = netId;
    document.getElementById("campoBitsSubNet").value = bitsSubred;

    recibirDatos();
    llenarDatos();
    crearTablaTotal(dirSubred-1);

    document.getElementById("direccionSubRedEspecifica").value = Math.floor(Math.random() * (dirSubred));
    insertarDireccionSubredEspecifica();

    document.getElementById("direccionBroadcastEspecifica").value = Math.floor(Math.random() * (dirSubred));
    insertarDireccionBroadcastEspecifica();

    document.getElementById("numeroSubredParaHost").value = Math.floor(Math.random() * (dirSubred));
    document.getElementById("numeroHostBuscado").value = Math.floor(Math.random() * (numHost));
    buscarHostEnSubRed();

    document.getElementById("numeroSubredRangoHost").value = Math.floor(Math.random() * (dirSubred));
    encontrarRangoParaHostSubred();

    var dirIp = [].concat(ipBinario);
    for (var i = (netId); i < 32; i++) {
        dirIp[i] = Math.floor(Math.random() * 2);
    }
    var dirIpDecimal = binarioADecimal(dirIp);

    document.getElementById("octanteHost1").value = dirIpDecimal[0];
    document.getElementById("octanteHost2").value = dirIpDecimal[1];
    document.getElementById("octanteHost3").value = dirIpDecimal[2];
    document.getElementById("octanteHost4").value = dirIpDecimal[3];

    determinarSubredDeHost();

    var h1 = [].concat(ipBinario);
    for (var i = (netId); i < 32; i++) {
        h1[i] = Math.floor(Math.random() * 2);
    }
    var h1Decimal = binarioADecimal(h1);

    document.getElementById("octanteHost1,1").value = h1Decimal[0];
    document.getElementById("octanteHost1,2").value = h1Decimal[1];
    document.getElementById("octanteHost1,3").value = h1Decimal[2];
    document.getElementById("octanteHost1,4").value = h1Decimal[3];

    var h2 = [].concat(ipBinario);
    for (var i = (netId); i < 32; i++) {
        h2[i] = Math.floor(Math.random() * 2);
    }
    var h2Decimal = binarioADecimal(h2);

    document.getElementById("octanteHost2,1").value = h2Decimal[0];
    document.getElementById("octanteHost2,2").value = h2Decimal[1];
    document.getElementById("octanteHost2,3").value = h2Decimal[2];
    document.getElementById("octanteHost2,4").value = h2Decimal[3];

    determinarSubredDireccionesIp();

    document.getElementById("numeroSubredUltimo").value = Math.floor(Math.random() * (dirSubred));
    document.getElementById("cantidadH").value = Math.floor(Math.random() * (numHost - 1) + 1);
    darNdireccionesIp()




}


/**
 * 
 * @returns el numero en decimal para el ultimo octeto respetando los dos espacios en 0
 */
function llenarUltimoOcteto() {
    var arregloNumeros = new Array(8);
    for (var i = 0; i < 6; i++) {
        arregloNumeros[i] = Math.floor(Math.random() * 2);
    }
    arregloNumeros[4] = 0;
    arregloNumeros[5] = 0;
    arregloNumeros[6] = 0;
    arregloNumeros[7] = 0;
    var numero = 0;
    var arregloNumeros1 = arregloNumeros.reverse();
    for (var i = 0; i < 8; i++) {
        numero = numero + arregloNumeros1[i] * (2 ** i);
    }
    return numero;
}

/**
 * llena todos los campos de respuesta de la primera parte del 3 punto
 */
function llenarDatos() {
    if (validez) {
        document.getElementById("err").innerHTML = "";
        document.getElementById("resultado1").innerHTML = decimalAString(redDecimal);
        document.getElementById("resultado2").innerHTML = decimalAString(broadcastDecimal);
        if (dirSubred != 1) {
            // console.log(dirSubred);
            document.getElementById("resultado3").innerHTML = dirSubred - 2;
        } else {
            document.getElementById("resultado3").innerHTML = 0;
        }
        document.getElementById("resultado4").innerHTML = numHost;
    } else {
        document.getElementById("err").innerHTML = mensajeErr;
        limpiarFormulario();
        validez = true;
    }

}

/**
 * obtener una fila llena para la tabla
 * @param {*} numSubred numero de la subred
 * @param {*} filas numero maximo de la subred
 * @returns 
 */
function obtenerFilaTabla(numSubred, filas) {
    var subred = obtenerSubred((numSubred));
    var broadcastS = obtenerBroadcastSubred(subred);
    var rangoS = obtenerRangoDireccionesSubRed(subred, broadcastS);

    var fila = document.createElement("tr");

    var celda1 = document.createElement("td");
    var textoCelda = document.createTextNode((numSubred));
    celda1.appendChild(textoCelda);
    celda1.setAttribute("border", "1");
    fila.appendChild(celda1);

    var celda2 = document.createElement("td");
    var textoCelda = document.createTextNode(decimalAString(binarioADecimal(subred)));
    celda2.appendChild(textoCelda);
    celda2.setAttribute("border", "1");
    fila.appendChild(celda2);

    var celda3 = document.createElement("td");
    var textoCelda = document.createTextNode(decimalAString(rangoS[0]) + " / " + decimalAString(rangoS[1]));
    celda3.appendChild(textoCelda);
    celda3.setAttribute("border", "1");
    fila.appendChild(celda3);

    var celda4 = document.createElement("td");
    var textoCelda = document.createTextNode(decimalAString(binarioADecimal(broadcastS)));
    celda4.appendChild(textoCelda);
    celda4.setAttribute("border", "1");
    fila.appendChild(celda4);

    if (numSubred == 0 || numSubred == filas) {
        var celda5 = document.createElement("td");
        var textoCelda = document.createTextNode("subred no utilizable");
        celda5.appendChild(textoCelda);
        celda5.setAttribute("border", "1");
        fila.appendChild(celda5);
    }

    return fila;
}

/**
 * Genera una tabla con los valores de todas las subredes posibles
 * @param {*} filas Numero de subredes
 */
function crearTablaTotal(filas) {

    var tabla = document.getElementById("tabla");
    tabla.innerHTML = "<tr><td>Numero subred</td><td>ip subred</td><td>rango de host</td><td>broadcast de la sudred</td></tr>";
    var tblBody = document.createElement("tbody");


    for (var i = 0; i <= filas; i++) {
        if (i <= 1023) {
            tblBody.appendChild(obtenerFilaTabla(i, filas));
        } else {
            i = filas;
            var fila = document.createElement("tr");

            var celda1 = document.createElement("td");
            var textoCelda = document.createTextNode(("..."));
            celda1.appendChild(textoCelda);
            celda1.setAttribute("border", "1");
            fila.appendChild(celda1);
            tblBody.appendChild(fila);
            tblBody.appendChild(obtenerFilaTabla(i, filas));
        }
    }
    tabla.appendChild(tblBody);

    tabla.setAttribute("border", "2");
}


/**
 * Genera una tabla con los valores de una subred especifica si el valor ingresado es vacio se hace la tabla de todas las subredes
 */
function crearTablaParcial() {

    if (isIpIngresada) {

        var numeroSubred = document.getElementById("numeroSubred").value;

        if (numeroSubred.length <= 0) {
            document.getElementById("err2").innerHTML = "";
            crearTablaTotal(dirSubred-1);
        } else {

            if (numeroSubred >= 0 && numeroSubred <= dirSubred - 1) {

                document.getElementById("err2").innerHTML = "";

                var tabla = document.getElementById("tabla");
                tabla.innerHTML = "<tr><td>Numero subred</td><td>ip subred</td><td>rango de host</td><td>broadcast de la sudred</td></tr>";
                var tblBody = document.createElement("tbody");

                tblBody.appendChild(obtenerFilaTabla(numeroSubred, dirSubred - 1));

                tabla.appendChild(tblBody);

                tabla.setAttribute("border", "2");
            } else {
                document.getElementById("err2").innerHTML = "Ingrese Subredes que esten entre: 0 y " + (dirSubred - 1);
            }

        }

    } else {
        document.getElementById("err2").innerHTML = "Debe ingresar La direccion ip principal, la net id y los bits para subred antes de consultar";
    }

}

/**
 * Genera la direccion ip de una subred especifica
 */
function insertarDireccionSubredEspecifica() {
    if (isIpIngresada) {
        var ipBinarioAux, ipDecimalAux = new Array();
        var direccionSubRedEspecifica = document.getElementById("direccionSubRedEspecifica").value;
        document.getElementById("resultado5").innerHTML = "";
        document.getElementById("errorAlInsertarDireccionSubredEspecifica").innerHTML = "";
        if (direccionSubRedEspecifica >= 0 && direccionSubRedEspecifica <= dirSubred - 1 && direccionSubRedEspecifica.length > 0) {
            ipBinarioAux = obtenerSubred(direccionSubRedEspecifica);
            ipDecimalAux = binarioADecimal(ipBinarioAux);
            document.getElementById("resultado5").innerHTML = decimalAString(ipDecimalAux);
        } else {


            document.getElementById("errorAlInsertarDireccionSubredEspecifica").innerHTML = "Debe ingresar un numero de una direccion subred existente";
        }

    } else {
        document.getElementById("errorAlInsertarDireccionSubredEspecifica").innerHTML = "Debe ingresar La direccion ip principal, la net id y los bits para subred antes de consultar";
    }
}

/**
 * Genera la direccion ip del broadcast de una subred especifica
 */
function insertarDireccionBroadcastEspecifica() {
    if (isIpIngresada) {
        var ipBinarioAux, ipDecimalAux, ipSubRedAux = new Array();
        var DireccionBroadcastEspecifica = document.getElementById("direccionBroadcastEspecifica").value;

        document.getElementById("resultado6").innerHTML = "";
        document.getElementById("errorAlInsertarBroadcastEspecifica").innerHTML = "";
        if (DireccionBroadcastEspecifica >= 0 && DireccionBroadcastEspecifica <= dirSubred - 1 && DireccionBroadcastEspecifica.length > 0) {
            ipSubRedAux = obtenerSubred(DireccionBroadcastEspecifica);
            ipBinarioAux = obtenerBroadcastSubred(ipSubRedAux);
            ipDecimalAux = binarioADecimal(ipBinarioAux);
            document.getElementById("resultado6").innerHTML = decimalAString(ipDecimalAux);
        } else {


            document.getElementById("errorAlInsertarBroadcastEspecifica").innerHTML = "Debe ingresar un numero de una direccion subred existente";
        }
    } else {
        document.getElementById("errorAlInsertarBroadcastEspecifica").innerHTML = "Debe ingresar La direccion ip principal, la net id y los bits para subred antes de consultar";
    }
}

/**
 * Esta funcion se encarga de buscar un host que pertenesca a la subred buscada
 * en caso de no estar se mostraran los avisos pertinentes
 */
function buscarHostEnSubRed() {


    if (isIpIngresada) {
        document.getElementById("errorBuscarHostEnSubred").innerHTML = "";
        document.getElementById("resultado7").innerHTML = "";

        var numeroSubred, numeroHost;
        numeroSubred = document.getElementById("numeroSubredParaHost").value;
        numeroHost = document.getElementById("numeroHostBuscado").value;
        if (numeroSubred.length <= 0 || numeroHost.length <= 0) {
            document.getElementById("errorBuscarHostEnSubred").innerHTML = "Campos vacios";

        } else {
            if (0 <= numeroSubred && numeroSubred < dirSubred) {
                if (numeroHost > 0 && numeroHost <= numHost) {
                    var direccionHost = calcularDireccionHost(numeroSubred, numeroHost);
                    document.getElementById("resultado7").innerHTML = direccionHost;
                } else {
                    document.getElementById("errorBuscarHostEnSubred").innerHTML = "Numero de host fuera de rango, desde 1, hasta " + numHost;
                }
            } else {
                document.getElementById("errorBuscarHostEnSubred").innerHTML = "Ingrese Subredes que esten entre: 0 y " + (dirSubred - 1);
            }
        }
    } else {
        document.getElementById("errorBuscarHostEnSubred").innerHTML = "Debe ingresar La direccion ip principal, la net id y los bits para subred antes de consultar";
    }
}


/**
 * Devuelve un host especifico de una subred especifica
 * @param {*} numeroSubred numero decimal de la subred
 * @param {*} numeroHost numero decimal de host
 * @returns cadena que representa el host buscado
 */
function calcularDireccionHost(numeroSubred, numeroHost) {

    var direccionSubRedEspecifica = obtenerSubred(numeroSubred);
    var direccionesHost = obtenerRangoDireccionesSubRed(direccionSubRedEspecifica, obtenerBroadcastSubred(direccionSubRedEspecifica));
    
    if(numeroHost==1){
        return decimalAString(direccionesHost[0]);
    }

    for (var i = 1; i < numeroHost; i++) {
        direccionesHost[0][3] += (1);
        if (direccionesHost[3] == 255) {
            direccionesHost[3] = 0;
            i++;
            if (direccionesHost[2] < 255) {
                direccionesHost[2] = direccionesHost[2] + 1;
            } else {
                direccionesHost[2] = 0
                if (direccionesHost[1] < 255) {
                    direccionesHost[1] = direccionesHost[1] + 1;
                } else {
                    direccionesHost[1] = 0;
                    if (direccionesHost[0] < 255) {
                        direccionesHost[0] = direccionesHost[0] + 1;
                    }
                }
            }
        }
    }
    return decimalAString(direccionesHost[0]);
}


/**
 * funcion que Devuelve El  rango  completo  de  direcciones  
 * que  se  pueden  asignar  a  los  hosts  de  una  subred específica, la ip y el broadcast
 */
function encontrarRangoParaHostSubred() {
    if (isIpIngresada) {
        var numSubred = document.getElementById("numeroSubredRangoHost").value;
        document.getElementById("resultado8").innerHTML = "";
        document.getElementById("resultado9").innerHTML = "";
        document.getElementById("resultado10").innerHTML = "";
        document.getElementById("resultado11").innerHTML = "";

        if (numSubred.length > 0 && numSubred >= 0 && numSubred <= dirSubred - 1) {
            document.getElementById("errorRango").innerHTML = "";
            var subred = obtenerSubred(numSubred);
            var broadcast = obtenerBroadcastSubred(subred);
            var rango = obtenerRangoDireccionesSubRed(subred, broadcast);

            document.getElementById("resultado8").innerHTML = decimalAString(binarioADecimal(subred));
            document.getElementById("resultado9").innerHTML = decimalAString(rango[0]) + " - primer host";
            document.getElementById("resultado10").innerHTML = decimalAString(rango[1]) + " - ultimo host";
            document.getElementById("resultado11").innerHTML = decimalAString(binarioADecimal(broadcast));
        } else {
            document.getElementById("errorRango").innerHTML = "Subred invalida";
        }
    } else {
        document.getElementById("errorRango").innerHTML = "Debe ingresar La direccion ip principal, la net id y los bits para subred antes de consultar";
    }
}

/**
 * Muestra la direccion de la subred de una ip ingresada 
 */
function determinarSubredDeHost() {
    if (isIpIngresada) {
        document.getElementById("resultado12").innerHTML = "";
        var octH1 = parseInt(document.getElementById("octanteHost1").value);
        var octH2 = parseInt(document.getElementById("octanteHost2").value);
        var octH3 = parseInt(document.getElementById("octanteHost3").value);
        var octH4 = parseInt(document.getElementById("octanteHost4").value);

        if (isNaN(octH1) || isNaN(octH2) || isNaN(octH3) || isNaN(octH4)) {

            document.getElementById("errHostSubred").innerHTML = "Campos Vacios";
        } else {
            if (octH1 < 0 || octH1 > 255 || octH2 < 0 || octH2 > 255 || octH3 < 0 || octH3 > 255 || octH4 < 0 || octH4 > 255) {
                document.getElementById("errHostSubred").innerHTML = "Valores fuera de Rango";
            } else {
                document.getElementById("errHostSubred").innerHTML = "";
                var ipHostBinario = retornarSubredHost(octH1, octH2, octH3, octH4);
                if (ipHostBinario != null) {
                    document.getElementById("resultado12").innerHTML = "la subred es la: "+descubrirNumeroSubred(ipHostBinario)+" direccion: "+decimalAString(binarioADecimal(ipHostBinario));
                } else {
                    document.getElementById("errHostSubred").innerHTML = "Debe ingresar una direccion ip que este en el mismo ambito que la principal";
                }
            }
        }
    } else {
        document.getElementById("errHostSubred").innerHTML = "Debe ingresar La direccion ip principal, la net id y los bits para subred antes de consultar";
    }
}

/**
 * metodo que obtiene el numero que reprenta la subred
 * @param {*} ipSubred direccion en binario de la subred
 * @returns 
 */
function descubrirNumeroSubred(ipSubred){

    var elevado=0, numero=0;

    for(var i=((netId-1)+bitsSubred);i>=netId;i--){
        numero=numero+2**(elevado)*(ipSubred[i]);
        elevado++;
    }

    console.log(numero);
    return numero;
}

/**
 * Retorna la direccion de la subred de una ip ingresada
 * @param {*} octH1 octeto 1
 * @param {*} octH2 octeto 2
 * @param {*} octH3 octeto 3
 * @param {*} octH4 octeto 4
 * @returns retorna un arreglo con la ip de la subred del host en binario
 */
function retornarSubredHost(octH1, octH2, octH3, octH4) {
    var verdad = true;
    var ipHostBinario;
    array1 = decimalABinario(octH1);
    array2 = decimalABinario(octH2);
    array3 = decimalABinario(octH3);
    array4 = decimalABinario(octH4);

    ipHostBinario = array1.concat(array2);
    ipHostBinario = ipHostBinario.concat(array3);
    ipHostBinario = ipHostBinario.concat(array4);

    for (var j = 0; j < netId && verdad; j++) {
        if (ipHostBinario[j] != ipBinario[j]) {
            verdad = false;
        }
    }

    if (verdad) {
        for (var i = (netId + bitsSubred); i < 32; i++) {
            ipHostBinario[i] = 0;
        }

        return ipHostBinario;
    } else {
        return null;
    }
}

/**
 * Determina si dos ip ingresadas tienen la misma subred o no
 */
function determinarSubredDireccionesIp() {
    if (isIpIngresada) {
        document.getElementById("resultado13").innerHTML = "";
        var oct1H1 = parseInt(document.getElementById("octanteHost1,1").value);
        var oct1H2 = parseInt(document.getElementById("octanteHost1,2").value);
        var oct1H3 = parseInt(document.getElementById("octanteHost1,3").value);
        var oct1H4 = parseInt(document.getElementById("octanteHost1,4").value);
        var oct2H1 = parseInt(document.getElementById("octanteHost2,1").value);
        var oct2H2 = parseInt(document.getElementById("octanteHost2,2").value);
        var oct2H3 = parseInt(document.getElementById("octanteHost2,3").value);
        var oct2H4 = parseInt(document.getElementById("octanteHost2,4").value);

        if (isNaN(oct1H1) || isNaN(oct1H2) || isNaN(oct1H3) || isNaN(oct1H4) || isNaN(oct2H1) || isNaN(oct2H2) || isNaN(oct2H3) || isNaN(oct2H4)) {

            document.getElementById("errDirecciones1,2").innerHTML = "Campos Vacios";
        } else {
            if (oct1H1 < 0 || oct1H1 > 255 || oct1H2 < 0 || oct1H2 > 255 || oct1H3 < 0 || oct1H3 > 255 || oct1H4 < 0 || oct1H4 > 255 || oct2H1 < 0 || oct2H1 > 255 || oct2H2 < 0 || oct2H2 > 255 || oct2H3 < 0 || oct2H3 > 255 || oct2H4 < 0 || oct2H4 > 255) {
                document.getElementById("errDirecciones1,2").innerHTML = "Valores fuera de Rango";
            } else {
                document.getElementById("errDirecciones1,2").innerHTML = "";
                var ipHostBinario1 = retornarSubredHost(oct1H1, oct1H2, oct1H3, oct1H4);
                var ipHostBinario2 = retornarSubredHost(oct2H1, oct2H2, oct2H3, oct2H4);
                if (ipHostBinario1 != null && ipHostBinario2 != null) {
                    var cadena1 = decimalAString(binarioADecimal(ipHostBinario1));
                    var cadena2 = decimalAString(binarioADecimal(ipHostBinario2));
                    var subred1 = descubrirNumeroSubred(ipHostBinario1);
                    var subred2 = descubrirNumeroSubred(ipHostBinario2);

                    if (cadena1 == cadena2) {
                        document.getElementById("resultado13").innerHTML = "SI, Ambas direcciones Ip pertenecen a la subred: " + subred1 +" direccion: "+cadena1;
                    } else {
                        document.getElementById("resultado13").innerHTML = "No, no pertenecen a la misma subred, La Ip 1 pertenece a la subred: "+subred1+" direccion: " + cadena1 + " y la Ip 2 pertenece a la subred: " + subred2 +" direccion: "+ cadena2;
                    }
                } else {
                    document.getElementById("errDirecciones1,2").innerHTML = "Debe ingresar direcciones ip que esten en el mismo ambito que la principal";
                }
            }
        }
    } else {
        document.getElementById("errDirecciones1,2").innerHTML = "Debe ingresar La direccion ip principal, la net id y los bits para subred antes de consultar";
    }

}

/**
 * dadas una cantidad n y la subred en decimal se generan n direcciones de host de la subred ingresada con limite en 1022
 */
function darNdireccionesIp() {
    if (isIpIngresada) {
        var numSubred = document.getElementById("numeroSubredUltimo").value;
        var cantidadH = document.getElementById("cantidadH").value;

        document.getElementById("resultado14").innerHTML = "";

        if (numSubred.length > 0 && numSubred >= 0 && numSubred < dirSubred && cantidadH.length > 0 && cantidadH > 0 && cantidadH <= numHost) {
            document.getElementById("errNDirecciones").innerHTML = "";
            var direccionSubRedEspecifica = binarioADecimal(obtenerSubred(numSubred));
            var direcciones = "";
            for (var i = 0; i < cantidadH; i++) {
                if (i < 1022) {
                    direccionSubRedEspecifica[3] = direccionSubRedEspecifica[3] + 1;
                    direcciones += decimalAString(direccionSubRedEspecifica) + " || \n";
                    if (direccionSubRedEspecifica[3] == 255) {
                        direccionSubRedEspecifica[3] = 0;
                        i++;
                        if (direccionSubRedEspecifica[2] < 255) {
                            direccionSubRedEspecifica[2] = direccionSubRedEspecifica[2] + 1;
                        } else {
                            direccionSubRedEspecifica[2] = 0
                            if (direccionSubRedEspecifica[1] < 255) {
                                direccionSubRedEspecifica[1] = direccionSubRedEspecifica[1] + 1;
                            } else {
                                direccionSubRedEspecifica[1] = 0;
                                if (direccionSubRedEspecifica[0] < 255) {
                                    direccionSubRedEspecifica[0] = direccionSubRedEspecifica[0] + 1;
                                }
                            }
                        }
                        direcciones += decimalAString(direccionSubRedEspecifica) + " || \n";
                    }
                } else {
                    direcciones += "....... ||";
                    direcciones += calcularDireccionHost(numSubred, (cantidadH - 1)) + "||";
                    i = cantidadH;
                }
            }
            document.getElementById("resultado14").innerHTML = direcciones;
        } else {
            document.getElementById("errNDirecciones").innerHTML = "Datos invalidos, ingrese una subred entre: 0 - " + (dirSubred - 1) + " , ingrese la cantidad de host entre: 1 - " + numHost;
        }

    } else {
        document.getElementById("errNDirecciones").innerHTML = "Debe ingresar La direccion ip principal, la net id y los bits para subred antes de consultar";
    }

}