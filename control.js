window.onload = init;

function init() {
    nombreTab = null;
    oldnombre = null;
    visibe_modal = null;
    mainTable = null;
    table1Full = false;
    table2Full = false;
    table3Full = false;
    phpStrings = new Array();
    ulLista = document.getElementById("navbartop");
    onClickLoad();
    image1 = document.getElementById("image1");
    document.getElementById("btnAceptarAgregar").onclick= function(){agregarProductoClick();};
    btnInventario = document.getElementById("btnInventarioNavBarTop");
    btnOrdenTrabajo = document.getElementById("btnOrdenNavBarTop");
    btnNotaGarantia = document.getElementById("btnNotaGNavBarTop");
    btnNotaVenta = document.getElementById("btnNotaVNavBarTop");
    document.getElementById("btnAceptarRemover").onclick = removerProductoClick;
    btnInventario.onclick = function(){openCity("Manejo de Inventario");};
    btnOrdenTrabajo.onclick = function(){openCity("OrdenTrabajo");};
    btnNotaGarantia.onclick = function(){openCity("NotaGarantia");};
    btnNotaVenta.onclick = function(){openCity("NotaVenta");};
    btnAceptarEditar = document.getElementById("btnAceptarEditar");
    btnAceptarEditar.onclick = function(){editarProductoClick(i);};
    document.getElementById("btnCrearOrden").onclick=crearOrden;           
}

function crearOrden(){

        arregloServicios = new Array();
        arregloProductos = new Array();
        indexServicios = 0;
        indexProductos = 0;
        visibe_modal =document.getElementById("crearOrdenTrabajo");  
        visibe_modal.style.display="block";
        document.getElementById("fechaRecepcionOrden").valueAsDate=new Date(); 
        //document.getElementById("fechaEntregaOrden").valueAsDate=new Date();
        document.getElementById("totalOrdenNueva").onchange = function(){updateRestante();};
        document.getElementById("adelantoOrdenNueva").onchange = function(){updateRestante();};
        document.getElementById("productos_usados_input").onclick = function(){insertTableData(2);};
        document.getElementById("servicios_usados_input").onclick = function(){insertTableData(3);};

}
function insertTableData(index){
    
    
    phpStrings=["readProductos.php","readProductos.php","readServicios.php"];
    if(index == 1){
        mainTable = document.getElementById("mytable");
        
    }
    if(index == 2){
        document.getElementById("productos_usar_modal").style.display = "block";
        document.getElementById("search2").value = "";
        myFunction(2);
        mainTable = document.getElementById("mytable2");
    }
    if(index == 3){
        document.getElementById("servicios_usar_modal").style.display = "block";
        document.getElementById("search3").value = "";
        myFunction(3);
        mainTable = document.getElementById("mytable3");   
    }

    var request = new XMLHttpRequest();
    request.open("GET","http://is2016.atwebpages.com/moflesyradiadores/"+phpStrings[index-1]);
//    request.open("GET","http://is2016.atwebpages.com/moflesyradiadores/readProductos.php");
    request.onload = function(){

        if(index == 1 && (!table1Full) ){
                llenarTable(request.responseText,index);
                table1Full = true;
                
        }
        if(index == 2 && (!table2Full) ){
                llenarTable(request.responseText,index);
                table2Full = true;
        }
        if(index == 3 && (!table3Full) ){
                llenarTable(request.responseText,index);
                table3Full = true;
        }
    };
    request.send(null);
}
function fillServicios(){

        document.getElementById("servicios_usados_input").value = arregloServicios.toString();
        document.getElementById('servicios_usar_modal').style.display='none';
}
function fillProductos(){
        
        document.getElementById("productos_usados_input").value = arregloProductos.toString();
        document.getElementById('productos_usar_modal').style.display='none';
}
function llenarTable(request,index){
        var productos = JSON.parse(request);
        document.getElementById("btn_aceptar_productos_usar").onclick = function(){fillProductos();};
        document.getElementById("btn_aceptar_servicios_usar").onclick = function(){fillServicios();};

        
        for(var i = 0; i < productos.data.length; i++){      
            if(index == 1 ){
                var row = mainTable.insertRow(-1);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                var cell5 = row.insertCell(4);
                
                cell1.innerHTML = productos.data[i].Nombre;
                cell2.innerHTML = productos.data[i].Cantidad;
                cell3.innerHTML = productos.data[i].Fecha;
                cell4.innerHTML = "<a href='javascript:handleIcon(2,"+request+","+i+")'><img class='removerIcon'src='iconoRemover.png'></a>";
                cell5.innerHTM = "<a href='javascript:handleIcon(3,"+request+","+i+")'><img class='removerIcon'src='iconoEditar.png'></a>";
              
                
            }
             if(index == 2 ){
                //PRODUCTOS
                var row = mainTable.insertRow(-1);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                
                cell4 = row.insertCell(3);
                cell2.innerHTML= productos.data[i].Nombre;
                cell1.innerHTML= "<input type='checkbox' name='producto' value='usar' onclick = 'productoEscojido("+request+","+i+")'>";
                cell3.innerHTML= productos.data[i].Cantidad;
                cell4.innerHTML="<input id='cantidadProductoAgregar' type='number' class='w3-input table2Input' min='1' onchange = ' ' >"; 
                
            }
             if(index == 3 ){
                //SERVICIOS
                var row = mainTable.insertRow(-1);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                
                cell2.innerHTML =productos.data[i].nombre;
                cell3.innerHTML =productos.data[i].meses;
                cell1.innerHTML = "<input type='checkbox' name='servicio' value='usar' onclick = 'servicioEscojido("+request+","+i+")' >";
                
            }
        }
           
}

function servicioEscojido(servicios,i){
        var flag = false;
        console.log("servicio Escojido");
      
         for(var x = 0; x < arregloServicios.length; x++){
            if(arregloServicios[x] == servicios.data[i].nombre){
                arregloServicios.splice(x,1);
                var nArray = new Array();
                flag = true;
                indexServicios--;
            }
        }
        if(!flag){
            arregloServicios[indexServicios++]= servicios.data[i].nombre;
            console.log(indexServicios);
        }
}

function productoEscojido(productos,i){
        
        var flag = false;
        for(var x = 0; x < arregloProductos.length; x++){
            if(arregloProductos[x] == productos.data[i].Nombre){
                arregloProductos.splice(x,1);
                flag = true;
                indexProductos--;
            }
        }
        if(!flag){
            arregloProductos[indexProductos++] = productos.data[i].Nombre;
        }
}

function updateRestante(){
        var restante = document.getElementById("restanteOrdenNueva");
        var totalOrdenNueva = document.getElementById("totalOrdenNueva");
        var adelanto = document.getElementById("adelantoOrdenNueva");
        
        if(Number(adelanto.value) > Number(totalOrdenNueva.value)){
                adelanto.value = Number(totalOrdenNueva.value);
        }
        restante.value = Number(totalOrdenNueva.value)- Number(adelanto.value);
        adelanto.setAttribute("max",totalOrdenNueva.value);
}

function handleIcon(num,request,i){
        if(num ==1){
                if(i===0){
                        document.getElementById("AlertBox").style.display = "none";
                }
                document.getElementById("id01").style.display="block"; 
                document.getElementById("cantidadProductoAgregar").value = "";
                oldnombre = document.getElementById("nombreProductoAgregar").value;
                
                document.getElementById("nombreProductoAgregar").value = "";
        }
        if(num ==2){
                document.getElementById("removerProducto").style.display="block";
                document.getElementById("nomProductoRemover").innerHTML =request.data[i].Nombre;
                document.getElementById("canProductoRemover").innerHTML =request.data[i].Cantidad;
                document.getElementById("btnAceptarRemover").onclick = removerProductoClick;
                console.log("Nombre del Producto 1: "+document.getElementById("nomProductoRemover").innerHTML);
        }
        if(num==3){
                beforeEditName= request.data[i].Nombre;
                beforeEditCantidad =  request.data[i].Cantidad;
                document.getElementById("editarProducto").style.display="block";
                document.getElementById("nombreProductoEditar").setAttribute("value", request.data[i].Nombre);
                oldnombre = document.getElementById("nombreProductoEditar").value;
                console.log(oldnombre);
                document.getElementById("cantidadProductoEditar").setAttribute("value", request.data[i].Cantidad);    
        }
}


function onClickSave(){	localStorage.setItem("posicionTab",JSON.stringify(nombreTab));
            }
function onClickLoad(){
        nombreTab = JSON.parse(localStorage.getItem("posicionTab"));
        if(nombreTab){
            openCity(nombreTab);
        }else{
            nombreTab = "Manejo de Inventario";
            openCity("Manejo de Inventario");
        }    
}

function openCity(cityName) {
            
            var x = document.getElementsByClassName("city"),i;
            for (i = 0; i < x.length; i++) {
               x[i].style.display = "none";
            }
            document.getElementById(cityName).style.display = "block";
            if(cityName == "Manejo de Inventario"){
                changeNavBarColors(1);
                insertTableData(1);
            }
            if(cityName== "OrdenTrabajo"){
                changeNavBarColors(2);
            }
            if(cityName == "NotaGarantia"){
               changeNavBarColors(3);
            }if(cityName == "NotaVenta"){
               changeNavBarColors(4);
            }
            nombreTab= cityName;
            
            onClickSave();
}
function changeNavBarColors(indexA){
    var lista = document.getElementById("navbartop");
    var nodelist = lista.getElementsByClassName("child");
    for(i=1;i<5;i++){
        if(i != indexA){
            if (nodelist[i].className.indexOf("w3-theme") == -1) {
                nodelist[i].className += " w3-theme";
            }
             nodelist[i].className = nodelist[i].className.replace(" w3-theme-l1", "");
            }else{
                nodelist[indexA].className = nodelist[indexA].className.replace(" w3-theme", "");
                nodelist[indexA].className += " w3-theme-l1";
            }
    }            
}

function myFunction(index) {
    var input, filter, table, tr, td, i,x;
    if(index == 1){
            input = document.getElementById("search1");
            table = document.getElementById("mytable");
            x = 0;
    }
    if(index == 2){
            input = document.getElementById("search2");
            table = document.getElementById("mytable2");
            x = 1;
    }
    if(index == 3){
            input = document.getElementById("search3");
            table = document.getElementById("mytable3");
            x=1;
    }
    
    filter = input.value.toUpperCase();
    
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[x];
        if (td) {
          if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        }
    }
}
function removerProductoClick(){
        var nomRemover = document.getElementById("nomProductoRemover").innerHTML;
        console.log("http://is2016.atwebpages.com/moflesyradiadores/removeProducto.php?nombre="+nomRemover);
        var request = new XMLHttpRequest();
        
        request.open("GET","http://is2016.atwebpages.com/moflesyradiadores/removeProducto.php?nombre="+nomRemover);
        request.onload = function(){
                console.log(request.responseText);
                document.getElementById("removerProducto").style.display = "none";
                location.reload();
        };
        request.send(null);  
}
function editarProductoClick(id){ 
            var newnombre = document.getElementById("nombreProductoEditar").value;
            var newcantidad = document.getElementById("cantidadProductoEditar").value;
            var cantidadMas = document.getElementById("cantidadMasEditar").value;
            newcantidad=Number(newcantidad)+Number(cantidadMas);
            var request = new XMLHttpRequest();
            request.open("GET","http://is2016.atwebpages.com/moflesyradiadores/editProducto.php?nombre="+oldnombre+"&newnombre="+newnombre+"&cantidad="+newcantidad);
            request.onload = function(){
                //console.log(request.responseText); 
            };
            request.send(null);
            location.reload();
}
function agregarProductoClick(){
            var nombre = document.getElementById("nombreProductoAgregar");
            var cantidad = document.getElementById("cantidadProductoAgregar").value;
            var request = new XMLHttpRequest();            
            if(cantidad>0){
                request.open("GET","http://is2016.atwebpages.com/moflesyradiadores/addProducto.php?nombre="+nombre.value+"&cantidad="+cantidad);
                    request.onload = function(){
                        //location.reload();
                        showAlertAgregado(request.responseText);
                    };
                    request.send(null);       
            }
            else{
                alert("La cantidad debe ser mayor a 0");
            }    
}

function showAlertAgregado(request){
    if(request){
        document.getElementById("id01").style.display="none";
        document.getElementById("AlertBox").style.display="block";
        document.getElementById("btnAlert1").onclick= function(){handleIcon(1,"",0);};
     } 
}