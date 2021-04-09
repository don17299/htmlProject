/*
Codigo Realizado por: 
Carlos Mario Duque Mejía
Juan David Jimenez Lopez
Jorge Ivan Hurtado Imbachi
*/

var ip1, ip2, ip3, ip4, netId, hostId, dirHost;
var maskBinario= new Array(32);
var maskDecimal= new Array();
var ipBinario= new Array(32);
var ipDecimal= new Array();
var broadcastBinario= new Array(32);
var broadcastDecimal= new Array();
var redBinario= new Array(32);
var redDecimal= new Array();
var rango= new Array(2);

function recibirDatos(){
    ip1=parseInt(document.getElementById("ip1").value);
    ip2=parseInt(document.getElementById("ip2").value);
    ip3=parseInt(document.getElementById("ip3").value);
    ip4=parseInt(document.getElementById("ip4").value);
    netId=parseInt(document.getElementById("maskCampo").value);
    hostId=32-netId;
    dirHost=2**hostId-2;
    obtenerIp();
    obtenerMascara();
    obtenerBroadCast();
    obtenerRed();
}

function obtenerMascara(){

    for(var i=0;i<netId;i++){
        maskBinario[i]=1;
    }
    for(var i=netId;i<32;i++){
        maskBinario[i]=0;
    }
    maskDecimal=binarioADecimal(maskBinario);

    //console.log(maskBinario);
    //console.log(maskDecimal);
}

function obtenerIp(){
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
    
    //console.log(ipBinario);
    //console.log(ipDecimal);

}

function obtenerBroadCast(){
    broadcastBinario=[].concat(ipBinario);

    for(var i=netId;i<32;i++){
      broadcastBinario[i]=1;
    }

    //console.log(broadcastBinario)
    broadcastDecimal=binarioADecimal(broadcastBinario);
}

function obtenerRed(){

    for(var i=0;i<32;i++){
        if(ipBinario[i]&&maskBinario[i]==1){
            redBinario[i]=1;
        }else{
            redBinario[i]=0;
        }

    }
    redDecimal=binarioADecimal(redBinario);
}

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

    //binario=binario.reverse();

    //console.log(binario);
    return binario;
}

function binarioADecimalArrayDArrays(binario){
    var decimal= new Array();
    var n1,n2,n3,n4;

    for(var i=0;i<binario.length;i++){
        for(var j=0;j<binario[i],length;j++){
            for(var k=7;k>=0;k--){
               if(j==0){
                   n1=n1+2**k;
               }else if(j==1){
                   n2=n2+2**k;
                   } else if(j==2){
                       n3=n3+2**k;
                   }else if(j==3){
                       n4=n4+2**k;
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


function binarioADecimal(binario){
    var n1=0, n2=0, n3=0, n4=0;
    var decimal= new Array();

    binario=binario.reverse();
    for(var i=0;i<binario.length;i++){
        if(i<8){
           if(binario[i]==1){
            n1=n1+2**i;
                    }
        }else if(i>=8 && i<=15){
                if(binario[i]==1){
                 n2=n2+2**(i-8);
                         }
        } else if(i>=16 && i<=23){
                if(binario[i]==1){
                 n3=n3+2**(i-16);
                         }
        } else if(i>=24 && i<=31){
                if(binario[i]==1){
                 n4=n4+2**(i-24);
                         }

        }
    }

    decimal.push(n4);
    decimal.push(n3);
    decimal.push(n2);
    decimal.push(n1);
    binario=binario.reverse();
    return decimal;
}



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

function obtenerRangoDirecciones(){
    var host1= new Array(), host2= new Array(), hostd1, hostd2;

    host1=[].concat(redBinario);
    host2=[].concat(broadcastBinario);
    console.log(host1);
    console.log(host2);
    host1[31]=1;
    host2[31]=0;
    console.log(host1);
    console.log(host2);
    hostd1=binarioADecimal(host1);
    hostd2=binarioADecimal(host2);
    console.log(hostd1);
    console.log(hostd2);
    rango[0]=hostd1;
    rango[1]=hostd2;
}

function obtenerListadoDireccionesHost(){
    var host1=[].concat(rango[0]);
    var host2=[].concat(rango[1]);
    var direcciones=decimalAString(host1)+"// \n";
    //console.log(direcciones);
    for(var i=0;i<dirHost-1;i++){
        host1[3]=host1[3]+1
        direcciones+=decimalAString(host1)+"// \n";
        if(host1[3]==255){
            host1[3]=0;
            if(host1[2]<255){
            host1[2]=host1[2]+1;
            }else{
                host1[2]=0
                if(host1[1]<255){
                    host1[1]=host1[1]+1;
                }else{
                    host1[1]=0;
                    if(host1[0]<255){
                        host1[0]=host1[0]+1;
                    }else{
                        break;
                    }
                }
            }
            
        }
        //console.log(direcciones);
    }
    //direcciones+=decimalAString(host2);
    //console.log(direcciones);
    
    return direcciones;
}


function primerPunto(){
    recibirDatos();
    document.getElementById("r1").innerHTML=decimalAString(maskDecimal);
    document.getElementById("r2").innerHTML=decimalAString(broadcastDecimal);
    document.getElementById("r3").innerHTML=netId;
    document.getElementById("r4").innerHTML=hostId;
    document.getElementById("r5").innerHTML=dirHost;
    obtenerRangoDirecciones();
    document.getElementById("r6").innerHTML=decimalAString(redDecimal);
    document.getElementById("r7").innerHTML=decimalAString(rango[0]);
    document.getElementById("r8").innerHTML=decimalAString(rango[1]);
    document.getElementById("r9").innerHTML=decimalAString(broadcastDecimal);
    document.getElementById("r10").innerHTML=obtenerListadoDireccionesHost();





}
