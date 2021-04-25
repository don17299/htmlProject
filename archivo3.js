/*
Codigo Realizado por: 
Carlos Mario Duque Mejía
Juan David Jimenez Lopez
Jorge Ivan Hurtado Imbachi
*/

//cada octeto de la ip ingresada, netid, hostid, dirrecciones para los host, bits para subred y direcciones de subred.
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
//arreglo que almacena la primera direccion host y la ultima.
var rango = new Array(2);
//determina si la ejecucion es valida o no (errores).
var validez = true;
//especifica el mensaje de error que se debe mostrar.
var mensajeErr;

/*
* ejecuta todos los metodos asociados al primer punto dados unos datos especificados por el usuario.
*/
function ejecutarTercerPunto() {
    leerDatos();
    recibirDatos();
    llenarDatos();
    crearTablaTotal(dirSubred);

}

/*
*Se encarga de llamar a los metodos
*que obtendran sus valores a partir de los datos capturados en el metodo leerDatos().
*/
function recibirDatos() {
    //esto es magico
    if (isNaN(ip1) || isNaN(ip2) || isNaN(ip3) || isNaN(ip4) || isNaN(netId) || isNaN(bitsSubred)) {

        validez = false;
        mensajeErr = "Campos Vacios";
    } else {
        if (ip1 < 0 || ip1 > 255 || ip2 < 0 || ip2 > 255 || ip3 < 0 || ip3 > 255 || ip4 < 0 || ip4 > 255 || netId < 15 || netId > 30 || bitsSubred > hostId || bitsSubred < 2) {
            validez = false;
            mensajeErr = "Valores fuera de Rango";
        } else if (!validarIp() || !validarNet()) {
            validez = false;
            mensajeErr = "Mascara de red o Direccion Ip Erroneas";
        }
        else {
            hostId = 32 - netId;
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

function validarNetRandom() {
    var posicion = ipBinario.lastIndexOf(1);
    return posicion + 1;
}


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
 * @param {} numeroSubRed es la subred en formato decimal 
 * @returns retorna la direccion ip de la subred en binario
 */
function obtenerSubred(numeroSubRed) {
    var arreglo = decimalABinario(numeroSubRed);
    var subred = [].concat(redBinario);

    if (arreglo.length < bitsSubred) {
        while (arreglo.length < bitsSubred) {
            arreglo.unshift(0);
        }
    } else {
        if (arreglo.length > bitsSubred) {
            while (arreglo.length > bitsSubred) {
                arreglo.shift();
            }
        }
    }
    for (var j = 0; j < arreglo.length; j++) {
        subred[(j + netId)] = arreglo[j];
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
*A partir una direccion decimal obtiene su direccion binaria.
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
*@param binario array de una direccion ip en binario en el cual hay 4 posiciones correspondientes a los cuatro octetos.
*A partir de la ip en binario obtiene la ip en decimal
*@return retorna un array con la direccion en decimal
*/
function binarioADecimalArrayDArrays(binario) {
    var decimal = new Array();
    var n1, n2, n3, n4;

    for (var i = 0; i < binario.length; i++) {
        for (var j = 0; j < binario[i], length; j++) {
            for (var k = 7; k >= 0; k--) {
                if (j == 0) {
                    n1 = n1 + 2 ** k;
                } else if (j == 1) {
                    n2 = n2 + 2 ** k;
                } else if (j == 2) {
                    n3 = n3 + 2 ** k;
                } else if (j == 3) {
                    n4 = n4 + 2 ** k;
                }

            }
        }
    }

    decimal.push(n1);
    decimal.push(n2);
    decimal.push(n3);
    decimal.push(n4);

    return decimal;
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
            if (binario[i] == 1) {
                n1 = n1 + 2 ** i;
            }
        } else if (i >= 8 && i <= 15) {
            if (binario[i] == 1) {
                n2 = n2 + 2 ** (i - 8);
            }
        } else if (i >= 16 && i <= 23) {
            if (binario[i] == 1) {
                n3 = n3 + 2 ** (i - 16);
            }
        } else if (i >= 24 && i <= 31) {
            if (binario[i] == 1) {
                n4 = n4 + 2 ** (i - 24);
            }

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
    var hostInicial = new Array(), hostPenultimo = new Array(), hostInicialD, hostPenultimoD;

    hostInicial = [].concat(redBinario);
    hostPenultimo = [].concat(broadcastBinario);
    hostInicial[31] = 1;
    hostPenultimo[31] = 0;
    hostInicialD = binarioADecimal(hostInicial);
    hostPenultimoD = binarioADecimal(hostPenultimo);
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
    var hostInicial = new Array(), hostPenultimo = new Array(), hostInicialD, hostPenultimoD;
    var rangoSubred = new Array(2);

    hostInicial = [].concat(subred);
    hostPenultimo = [].concat(broadcast);
    hostInicial[31] = 1;
    hostPenultimo[31] = 0;
    hostInicialD = binarioADecimal(hostInicial);
    hostPenultimoD = binarioADecimal(hostPenultimo);
    rangoSubred[0] = hostInicialD;
    rangoSubred[1] = hostPenultimoD;

    return rangoSubred;
}


/*
*Obtiene cada direccion de host que puesde obtenerse.
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

/*
*ejecuta todos los metodos asociados al primer punto dados unos datos aleatorios
*/
function generarEjercicio3() {
    var isMascara = false;
    var isIp = false;
    var numero = 0;


    ip1 = Math.floor(Math.random() * 255);
    ip2 = Math.floor(Math.random() * 255);
    ip3 = Math.floor(Math.random() * 255);
    while (!isIp) {
        ip4 = Math.floor(Math.random() * 255);
        isIp = validarIp();
    }

    netId = Math.floor(Math.random() * (30 - 15) + 15);
    numero = validarNetRandom();
    while (!isMascara) {
        netId = Math.floor(Math.random() * (30 - numero) + numero);
        isMascara = validarNet();
    }
    document.getElementById("ip1").value = ip1;
    document.getElementById("ip2").value = ip2;
    document.getElementById("ip3").value = ip3;
    document.getElementById("ip4").value = ip4;
    document.getElementById("maskCampo").value = netId;
    recibirDatos();
    llenarDatos();

}

/**
 * llena todos los campos de respuesta
 */
function llenarDatos() {
    if (validez) {
        document.getElementById("err").innerHTML = "";
        document.getElementById("resultado1").innerHTML = decimalAString(redDecimal);
        document.getElementById("resultado2").innerHTML = decimalAString(broadcastDecimal);
        document.getElementById("resultado3").innerHTML = dirSubred - 2;
        document.getElementById("resultado4").innerHTML = numHost;
    } else {
        document.getElementById("err").innerHTML = mensajeErr;
        limpiarFormulario();
        validez = true;
    }

}



function crearTablaTotal(filas) {

    var tabla = document.getElementById("tabla");
    tabla.innerHTML = "<tr><td>Numero subred</td><td>ip subred</td><td>rango de host</td><td>broadcast de la sudred</td></tr>";
    var tblBody = document.createElement("tbody");


    for (var i = 0; i < filas; i++) {
        var subred = obtenerSubred((i));
        var broadcastS = obtenerBroadcastSubred(subred);
        var rangoS = obtenerRangoDireccionesSubRed(subred, broadcastS);

        var fila = document.createElement("tr");

        var celda1 = document.createElement("td");
        var textoCelda = document.createTextNode((i));
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

        if (i == 0 || i == filas - 1) {
            var celda5 = document.createElement("td");
            var textoCelda = document.createTextNode("subred no utilizable");
            celda5.appendChild(textoCelda);
            celda5.setAttribute("border", "1");
            fila.appendChild(celda5);
        }

        tblBody.appendChild(fila);
    }
    tabla.appendChild(tblBody);

    tabla.setAttribute("border", "2");
}


function crearTablaParcial() {

    var numeroSubred = document.getElementById("numeroSubred").value;

    if (numeroSubred.length <= 0) {
        document.getElementById("err2").innerHTML = "";
        crearTablaTotal(dirSubred);
    } else {

        if (numeroSubred >= 0 && numeroSubred <= dirSubred - 1) {

            document.getElementById("err2").innerHTML = "";

            var tabla = document.getElementById("tabla");
            tabla.innerHTML = "<tr><td>Numero subred</td><td>ip subred</td><td>rango de host</td><td>broadcast de la sudred</td></tr>";
            var tblBody = document.createElement("tbody");

            var subred = obtenerSubred((numeroSubred));
            var broadcastS = obtenerBroadcastSubred(subred);
            var rangoS = obtenerRangoDireccionesSubRed(subred, broadcastS);

            var fila = document.createElement("tr");

            var celda1 = document.createElement("td");
            var textoCelda = document.createTextNode((numeroSubred));
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

            if (numeroSubred == 0 || numeroSubred == dirSubred - 1) {
                var celda5 = document.createElement("td");
                var textoCelda = document.createTextNode("subred no utilizable");
                celda5.appendChild(textoCelda);
                celda5.setAttribute("border", "1");
                fila.appendChild(celda5);
            }

            tblBody.appendChild(fila);

            tabla.appendChild(tblBody);

            tabla.setAttribute("border", "2");
        } else {
            document.getElementById("err2").innerHTML = "Ingrese Subredes que esten entre: 0 y " + (dirSubred - 1);
        }

    }



}

function insertarDireccionSubredEspecifica() {
    var ipBinarioAux, ipDecimalAux = new Array();
    var direccionSubRedEspecifica = document.getElementById("direccionSubRedEspecifica").value;
    console.log(direccionSubRedEspecifica);
    document.getElementById("resultado5").innerHTML = "";
    document.getElementById("errorAlInsertarDireccionSubredEspecifica").innerHTML = "";
    if (direccionSubRedEspecifica >= 0 && direccionSubRedEspecifica <= dirSubred - 1) {
        ipBinarioAux = obtenerSubred(direccionSubRedEspecifica);
        ipDecimalAux = binarioADecimal(ipBinarioAux);
        document.getElementById("resultado5").innerHTML = ipDecimalAux;
    } else {


        document.getElementById("errorAlInsertarDireccionSubredEspecifica").innerHTML = "Debe ingresar un numero de una direccion subred existente";
    }


}

function insertarDireccionBroadcastEspecifica() {
    var ipBinarioAux, ipDecimalAux, ipSubRedAux = new Array();
    var DireccionBroadcastEspecifica = document.getElementById("direccionBroadcastEspecifica").value;

    document.getElementById("resultado6").innerHTML = "";
    document.getElementById("errorAlInsertarBroadcastEspecifica").innerHTML = "";
    if (DireccionBroadcastEspecifica >= 0 && DireccionBroadcastEspecifica <= dirSubred - 1) {
        ipSubRedAux = obtenerSubred(DireccionBroadcastEspecifica);
        ipBinarioAux = obtenerBroadcastSubred(ipSubRedAux);
        ipDecimalAux = binarioADecimal(ipBinarioAux);
        document.getElementById("resultado6").innerHTML = ipDecimalAux;
    } else {


        document.getElementById("errorAlInsertarBroadcastEspecifica").innerHTML = "Debe ingresar un numero de una direccion broadcast existente";
    }
}

/**
 * Esta funcion se encarga de buscar un host que pertenesca a la subred buscada
 * en caso de no estar se mostraran los avisos pertinentes
 */
function buscarHostEnSubRed(){

    document.getElementById("errorBuscarHostEnSubred").innerHTML = "";
    document.getElementById("resultado7").innerHTML = "";  

    var numeroSubred, numeroHost, mensajeError="";
    numeroSubred = document.getElementById("numeroSubredParaHost").value;
    numeroHost = document.getElementById("numeroHostBuscado").value;
    console.log(numeroSubred);
    if(numeroSubred.length <= 0 || numeroHost.length <= 0){
        document.getElementById("errorBuscarHostEnSubred").innerHTML="Campos vacios";

    }else { 
        if(0 <= numeroSubred && numeroSubred < dirSubred){
            if(numeroHost>=0 && numeroHost < numHost){
                var direccionHost = calcularDireccionHost(numeroSubred,numeroHost);
                document.getElementById("resultado7").innerHTML = direccionHost;
            }else{
                document.getElementById("errorBuscarHostEnSubred").innerHTML="Numero de host fuera de rango, desde 0, hasta "+(numHost-1);
            }
        }else{
            document.getElementById("errorBuscarHostEnSubred").innerHTML = "Ingrese Subredes que esten entre: 0 y " + (dirSubred - 1);
        }   
    }
}


function calcularDireccionHost(numeroSubred, numeroHost){

    var direccionSubRedEspecifica = obtenerSubred(numeroSubred);
    var direccionesHost = obtenerRangoDireccionesSubRed(direccionSubRedEspecifica, obtenerBroadcastSubred(direccionSubRedEspecifica));

    for (var i = 0; i < numeroHost; i++){
        direccionesHost[0][3]+=(1);
            if(direccionesHost[3]==255){
                direccionesHost[3]=0;
                i++;
                if(direccionesHost[2]<255){
                    direccionesHost[2]=direccionesHost[2]+1;
                }else{
                    direccionesHost[2]=0
                    if(direccionesHost[1]<255){
                        direccionesHost[1]=direccionesHost[1]+1;
                    }else{
                        direccionesHost[1]=0;
                        if(direccionesHost[0]<255){
                            direccionesHost[0]=direccionesHost[0]+1;
                        }
                    }
                }
            }
    }
    return decimalAString(direccionesHost[0]);
}


/**
 * funcion que hace esto queEl  rango  completo  de  direcciones  
 * que  se  pueden  asignar  a  los  hosts  de  una  subred específica
 */
function encontrarRangoParaHostSubred(){
    document.getElementById("numeroSubredRangoHost").value();

}
