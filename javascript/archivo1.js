/*
Codigo Realizado por: 
Carlos Mario Duque Mejía
Juan David Jimenez Lopez
Jorge Ivan Hurtado Imbachi
*/

//cada octeto de la ip ingresada, netid, hostid y dirrecciones para los host.
var ip1, ip2, ip3, ip4, netId, hostId, numHost;
//mascara de subred binaria.
var maskBinario= new Array(32);
//mascara de subred decimal.
var maskDecimal= new Array();
//ip binario.
var ipBinario= new Array(32);
//ip decimal.
var ipDecimal= new Array();
//broadcast binario.
var broadcastBinario= new Array(32);
//broadcast decimal.
var broadcastDecimal= new Array();
//red binario.
var redBinario= new Array(32);
//red decimal.
var redDecimal= new Array();
//arreglo que almacena la primera direccion host y la ultima.
var rango= new Array(2);
//determina si la ejecucion es valida o no (errores).
var validez=true;
//especifica el mensaje de error que se debe mostrar.
var mensajeErr;

/*
* ejecuta todos los metodos asociados al primer punto dados unos datos especificados por el usuario.
*/
function ejecutarPrimerPunto(){
    leerDatos();
    recibirDatos();
    llenarDatos();
}

/*
*Se encarga de llamar a los metodos
*que obtendran sus valores a partir de los datos capturados en el metodo leerDatos().
*/
function recibirDatos(){
    
    if(isNaN(ip1) || isNaN(ip2) || isNaN(ip3) || isNaN(ip4) || isNaN(netId)){
        
        validez=false;
        mensajeErr="Campos Vacios";
    }else{obtenerIp();
        if(ip1<0||ip1>255||ip2<0||ip2>255||ip3<0||ip3>255||ip4<0||ip4>255||netId<0||netId>30){
            validez=false;
        mensajeErr="Valores fuera de Rango";
        }else if(!validarIp()|| !validarNet()){
            validez =false;
            mensajeErr="Mascara de red o Direccion Ip Erroneas";
        }
        else {
        hostId=32-netId;
        numHost=2**hostId-2;
        obtenerMascara();
        obtenerBroadCast();
        obtenerRed();
        }
    }
}


/*
*Este metodo valida la netid para el ip ingresado
*/
function validarNet(){
    var posicion = ipBinario.lastIndexOf(1);
    
    if(netId-1 < posicion){
        return false;
    } else {
        return true;
    }
}

/**
 * envia la posicion del ultimo 1 para validar la netid
 * @returns retorna la posicion del ultimo 1 de la ip ingresada en binario
 */
function validarNetRandom(){
    var posicion = ipBinario.lastIndexOf(1);
    
    return posicion+1;
}

/**
 * Metodo que valida la ip para que existan host.
 * @returns true si la ip es valida false en caso contrario
 */
function validarIp(){
    obtenerIp();
    if(ipBinario[30]==1 || ipBinario[31]==1){
        return false;
    }else{
        return true;
    }
}
/*
*Se encarga de capturar los datos ingresados en los campos de texto.
*/
function leerDatos(){
    ip1=parseInt(document.getElementById("ip1").value);
    ip2=parseInt(document.getElementById("ip2").value);
    ip3=parseInt(document.getElementById("ip3").value);
    ip4=parseInt(document.getElementById("ip4").value);
    netId=parseInt(document.getElementById("maskCampo").value);
}

/*
*Obtiene la mascara de subred en binario y decimal a partir del valor netId.
*/
function obtenerMascara(){

    for(var i=0;i<netId;i++){
        maskBinario[i]=1;
    }
    for(var i=netId;i<32;i++){
        maskBinario[i]=0;
    }
    maskDecimal=binarioADecimal(maskBinario);
}

/*
*Obtiene la ip en binario y decimal a partir de los datos ip1,ip2,ip3,ip4.
*/
function obtenerIp(){
    ipDecimal=new Array();
    var array1=new Array(8), array2=new Array(8), array3=new Array(8), array4=new Array(8);
    array1=decimalABinario(ip1);
    array2=decimalABinario(ip2);
    array3=decimalABinario(ip3);
    array4=decimalABinario(ip4);

    ipBinario=array1.concat(array2)
    ipBinario=ipBinario.concat(array3);
    ipBinario=ipBinario.concat(array4);
    
    ipDecimal.push(ip1)
    ipDecimal.push(ip2)
    ipDecimal.push(ip3)
    ipDecimal.push(ip4)
}

/*
*Obtiene la direccion de broadcast binaria y decimal a partir de la ip binaria.
*/
function obtenerBroadCast(){
    broadcastBinario=[].concat(ipBinario);

    for(var i=netId;i<32;i++){
      broadcastBinario[i]=1;
    }

    broadcastDecimal=binarioADecimal(broadcastBinario);
}

/*
*Obtiene la direccion de red con la red binaria y la mascara binaria.
*/
function obtenerRed(){

    for(var i=0;i<32;i++){

        redBinario[i]=ipBinario[i]*maskBinario[i];
        /*
        if(ipBinario[i]&&maskBinario[i]==1){
            redBinario[i]=1;
        }else{
            redBinario[i]=0;
        }*/
    }
    redDecimal=binarioADecimal(redBinario);
}

/*
*@param ip array de la ip en decimal.
*A partir una direccion decimal obtiene su direccion binaria.
*@return retorna un array con la direccion en binario.
*/
function decimalABinario(ip){
    var binario= new Array();
        while(ip>1){
        binario.unshift(ip%2);
        ip=Math.floor(ip/2);
    }
    binario.unshift(ip);

    if(binario.length<8){
        while(binario.length<8){
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
function binarioADecimal(binario){
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
function decimalAString(decimal){
    var cadenaDecimal="";

    for(var i=0;i<decimal.length;i++){
        cadenaDecimal+=decimal[i];
        if(i!=(decimal.length-1)){
            cadenaDecimal+=".";
        }

    }

    return cadenaDecimal;
}

/*
*Obtiene el rango de direcciones(host1 y host final) y los almacena en el array rango.
*/
function obtenerExtremosDirecciones(){
    var hostInicial= new Array(), hostUltimo= new Array(), hostInicialD, hostUltimoD;

    hostInicial=[].concat(redBinario);
    hostUltimo=[].concat(broadcastBinario);
    hostInicial[31]=1;
    hostUltimo[31]=0;
    hostInicialD=binarioADecimal(hostInicial);
    hostUltimoD=binarioADecimal(hostUltimo);
    rango[0]=hostInicialD;
    rango[1]=hostUltimoD;
}

/*
*Obtiene cada direccion de host que puede obtenerse. limitada a 1022 host
@return retorna la cadena que contiene todas las direcciones de host.
*/
function obtenerListadoDireccionesHost(){
   var direcciones="";
    for(var i=0;i<numHost;i++){
        if(i<1022){
        redDecimal[3]=redDecimal[3]+1;
        direcciones+=decimalAString(redDecimal)+" || \n";
        if(redDecimal[3]==255){
            redDecimal[3]=0;
            i++;
            if(redDecimal[2]<255){
            redDecimal[2]=redDecimal[2]+1;
            }else{
                redDecimal[2]=0
                if(redDecimal[1]<255){
                    redDecimal[1]=redDecimal[1]+1;
                }else{
                    redDecimal[1]=0;
                    if(redDecimal[0]<255){
                        redDecimal[0]=redDecimal[0]+1;
                    }
                }
            }
          direcciones+=decimalAString(redDecimal)+" || \n";  
        }
      }else{
          direcciones+="....... ||";
          broadcastDecimal[3]=broadcastDecimal[3]-1;
          direcciones+=decimalAString(broadcastDecimal)+"||";
          i=numHost;
      }
    }
    
    return direcciones;
}

/*
*Limpia todos los campos de respuesta
*/
function limpiarFormulario(){
    document.getElementById("r1").innerHTML="";
    document.getElementById("r2").innerHTML="";
    document.getElementById("r3").innerHTML="";
    document.getElementById("r4").innerHTML="";
    document.getElementById("r5").innerHTML="";
    document.getElementById("r6").innerHTML="";
    document.getElementById("r7").innerHTML="";
    document.getElementById("r8").innerHTML="";
    document.getElementById("r9").innerHTML="";
    document.getElementById("r10").innerHTML="";

}

/*
*ejecuta todos los metodos asociados al primer punto dados unos datos aleatorios
*/
function generarEjercicio1(){
    var isMascara=false;
    var isIp=false;
    var numero=0;

    
    ip1=Math.floor( Math.random() * 255);
    ip2=Math.floor( Math.random() * 255);
    ip3=Math.floor( Math.random() * 255);
    while(!isIp){
    ip4=Math.floor( Math.random() * 255);
    isIp=validarIp();
    }

    netId=Math.floor( Math.random() * 30);
    numero=validarNetRandom();
    while(!isMascara){
    netId=Math.floor( Math.random() * (30 - numero) + numero);
    isMascara=validarNet();
    }
    document.getElementById("ip1").value=ip1;
    document.getElementById("ip2").value=ip2;
    document.getElementById("ip3").value=ip3;
    document.getElementById("ip4").value=ip4;
    document.getElementById("maskCampo").value=netId;
    recibirDatos();
    llenarDatos();

}

/**
 * llena todos los campos de respuesta
 */
function llenarDatos(){
    if(validez){
    document.getElementById("err").innerHTML="";
    document.getElementById("r1").innerHTML=decimalAString(maskDecimal);
    document.getElementById("r2").innerHTML=decimalAString(broadcastDecimal);
    document.getElementById("r3").innerHTML=netId;
    document.getElementById("r4").innerHTML=hostId;
    document.getElementById("r5").innerHTML=numHost;
    obtenerExtremosDirecciones();
    document.getElementById("r6").innerHTML=decimalAString(redDecimal);
    document.getElementById("r7").innerHTML=decimalAString(rango[0])+" - primer host";
    document.getElementById("r8").innerHTML=decimalAString(rango[1])+" - ultimo host";
    document.getElementById("r9").innerHTML=decimalAString(broadcastDecimal);
    document.getElementById("r10").innerHTML=obtenerListadoDireccionesHost();
    }else{
        document.getElementById("err").innerHTML= mensajeErr;
        limpiarFormulario();
        validez=true;
    }

}

