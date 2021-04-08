/*
Codigo Realizado por: 
Carlos Mario Duque Mejía
Juan David Jimenez Lopez
Jorge Ivan Hurtado Imbachi
*/

var ip1, ip2, ip3, ip4, netId, hostId;
var mask= new Array(32);
var ip= new Array(32);
var broadcast= new Array(32);

function recibirIp(){
    ip1=parseInt(document.getElementById("ip1").value);
    ip2=parseInt(document.getElementById("ip2").value);
    ip3=parseInt(document.getElementById("ip3").value);
    ip4=parseInt(document.getElementById("ip4").value);
    netId=parseInt(document.getElementById("maskCampo").value);
    hostId=32-netId;

}

function obtenerMascara(){

    for(var i=0;i<netId;i++){
        mask[i]=1;
    }
    for(var i=netId;i<32;i++){
        mask[i]=0;
    }

    console.log(mask);
}

function obtenerIp(){
    var array1=new Array(8), array2=new Array(8), array3=new Array(8), array4=new Array(8);
    array1=decimalABinario(ip1);
    array2=decimalABinario(ip2);
    array3=decimalABinario(ip3);
    array4=decimalABinario(ip4);

    ip=array1.concat(array2)
    ip=ip.concat(array3);
    ip=ip.concat(array4);
    console.log(ip)
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

    console.log(binario);
    return binario;
}

function binarioADecimal(binario){
    var n1=0, n2=0, n3=0, n4=0;
    var num;
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

    num=n4+"."+n3+"."+n2+"."+n1;
    return num;
}

function mascaraSubred(){
    
    document.getElementById("r1").innerHTML=binarioADecimal(mask);
}

function broadCast(){
    var broad= new Array(32);
    broad=[].concat(ip);

    for(var i=netId;i<32;i++){
      broad[i]=1;
    }

    document.getElementById("r2").innerHTML=binarioADecimal(broad);
}


function primerPunto(){
    recibirIp();
    obtenerMascara();
    mascaraSubred();
    obtenerIp();
    broadCast();
    document.getElementById("r3").innerHTML=netId;
    document.getElementById("r4").innerHTML=hostId;
    document.getElementById("r5").innerHTML=2**hostId-2;




}
