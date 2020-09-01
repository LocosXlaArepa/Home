$(document).ready(main);
// variables
var main_productos = [];
var categoria_menu_array = [];
var id_obj,descripcion_obj,categoria_obj,menu_obj;
var nombre_menu , descripcion_menu , valor_menu , id_menu, cantida_menu;
var check_Cart = 0;
var num_band = 0;
var domicilio = 4000;
var boton_envio_band = 0;

var button_variable = document.querySelector('#button-variable');


function main (){
    // Obtener los datos de JSON
     get_data(); 
     verify_(); 
    
    $('body').on('change', '#categoria-menu-combobox', function(){
        cargar_categorias_menu();
    });

     //-------------------Llamada a la funcion de Continuar pedido 
     $('body').on('click', '.continuar-pedido', function(){
        $('.pedido-tiket').removeClass('animate__animated animate__bounceInDown'); 
        $('.pedido-tiket').addClass('animate__animated animate__bounceOutUp');
        setTimeout(function(){
            $('.pedido-tiket').removeClass('Active');
        },500); 
    })

    // --------------------------Llamada a la funcion de Añadir a Pedido
    $('body').on('click', '.pedido-anadir-butt', function(){
        var id_desc_menu = $(this).attr('id_desc_menu');
        var aclaracion_pedido_text = document.getElementById('aclaracion-pedido-text').value;
        var pedidos_cantidad_input = document.querySelector('#pedidos-cantidad-input').value;
        // enlistar_producto_menu(id_desc_menu);
        if (aclaracion_pedido_text == "") {
            GuardarDatosLS(id_desc_menu,`Ninguna`,(pedidos_cantidad_input*1));
        }else{
            GuardarDatosLS(id_desc_menu,aclaracion_pedido_text,(pedidos_cantidad_input*1));
        }
        $('.margen-pedido').removeClass('animate__animated animate__bounceInLeft');
        $('.margen-pedido').addClass('animate__animated animate__bounceOutLeft');  
        setTimeout(function(){
            $('.margen-pedido').removeClass('Active-margen-pedido');
        },500);
        pintar_cantidad_carrito();
    }) 

    // -------------------------------Llamada a la funcion mostrar carrito
    $('body').on('click', '.tiket-compra', function(){
        $('.pedido-tiket').addClass('Active'); 
        $('.pedido-tiket').removeClass('animate__animated animate__bounceOutUp');       
        $('.pedido-tiket').addClass('animate__animated animate__bounceInDown'); 
    }) 

   
    // --------------------------Llama a la funcion de ver mas Producto
    $('body').on('click','.pedido-ver-mas',function(){
        var id_desc_menu = $(this).attr('id_desc_menu');
        $('.margen-pedido').addClass('Active-margen-pedido');
        $('.margen-pedido').removeClass('animate__animated animate__bounceOutLeft');
        $('.margen-pedido').addClass('animate__animated animate__bounceInLeft');
        // alert(id_desc_menu)  
        ver_mas_producto(id_desc_menu);
        // window.location.hash="no-back-button";
        // window.location.hash="Again-No-back-button";//esta linea es necesaria para chrome
        // window.onhashchange=function(){window.location.hash="no-back-button";}
    })

    // --------------------------Cerrar a la funcion de ver mas Producto
    $('body').on('click','.atras-pedido-button',function(){
        $('.margen-pedido').removeClass('animate__animated animate__bounceInLeft');
        $('.margen-pedido').addClass('animate__animated animate__bounceOutLeft');  
        setTimeout(function(){
            $('.margen-pedido').removeClass('Active-margen-pedido');
        },500);
    })

    
    // -----------------------------Limpiar Tiket 
    $('body').on('click','#limpiar-tiket-button',function(){
        localStorage.removeItem('product_cart_menu');
        CargarDatosLS();
        pintar_cantidad_carrito();
    })

    // --------------------------Cerrar a la funcion de Datos Usuario
    // $('body').on('click','#',function(){
    //     $('.margen-pedido').removeClass('Active-margen-pedido');  
    // })
     // ----------------------------- Abrir a la funcion de Datos Usuario
     $('body').on('click','.button-tiket',function(){
        $('.datos-user').addClass('Active-datos-user'); 
        $('.datos-user').removeClass('animate__animated animate__bounceOutRight');
        $('.datos-user').addClass('animate__animated animate__bounceInRight');
        mostrarDatosUserInput();
        valoresTicketFinal();
    })

    // ----------------------------- Cerrar a la funcion de Datos Usuario
    $('body').on('click','#button-Atras-pedido',function(){
        $('.datos-user').removeClass('animate__animated animate__bounceInRight');
        $('.datos-user').addClass('animate__animated animate__bounceOutRight');  
        setTimeout(function(){
            $('.datos-user').removeClass('Active-datos-user');
        },500);


    })

     // ----------------------------- Solicitud de envios 
     $('body').on('click','#button-solicitar-pedido',function(){
        
        var val_hor_dia = Validacion_Hora_Dia();
        
        if (val_hor_dia) {
            // alert('Enviado')
            var veryf = verifyInput();
    
            console.log(veryf.very);
    
            if (veryf.very) {
                // alert('todo Ok')
                $('.modal-envio-exit').addClass('Active-modal-envio-exit');  
                UserdataGuardarDatosLS();
                SendMessageTiket();
                modalExit();
    
            }else{
                alert(veryf.alert_data_user)
            }
        }else{
            $('.alertas-panel').addClass('Active-alertas-panel');
            alertaOpenClosedLocal();
        }
    })

    // --------------------------------- Boton de Envio 
    $('body').on('click','#checkbox-envio-b',function(){
        var envio_check = document.getElementById("checkbox-envio-b").checked;
    
        if (envio_check) {
            // alert('si')
            domicilio = 4000;
            $('.alertas-panel').addClass('Active-alertas-panel');  
            alertaDomicilio();
            calcular_total_tiket();
            pintar_cantidad_carrito();
        }else{
            // alert('no')
            domicilio = 0;
            $('.alertas-panel').addClass('Active-alertas-panel');  
            alertaDomicilio();
            calcular_total_tiket();
            pintar_cantidad_carrito();
        }

        console.log(domicilio);
    })

    $('body').on('click','#butt-alert-id',function (){
        $('.alertas-panel').removeClass('Active-alertas-panel');  
    })
    // id="butt-modal-exit-id"

    // ------------------------------------------------ Boton para quitar modal de envio
    $('body').on('click','#butt-modal-exit-id',function (){
        $('.datos-user').removeClass('Active-datos-user');  
        $('.pedido-tiket').removeClass('Active');
        localStorage.removeItem('product_cart_menu');
        CargarDatosLS();
        pintar_cantidad_carrito(); 
        $('.modal-envio-exit').removeClass('Active-modal-envio-exit');  
        console.log('Enviado Con Exito');
    })
    
    
}
// ----------------------------------------------- Obtener datos de DB
function get_data (){
    var array_temp =[];
    var url = window.location.search;
    var url_id = url.split(`?id=`).join("");
   
    var url = "https://locosxlaarepa.github.io/Home/Data/data-base.json";    
        fetch(url)
        .then(function(res){
            return res.json();
        })
        .then(function(respuesta){
            for (let i = 0; i < respuesta.comidas.length; i++) {
                
                if (respuesta.comidas[i].id == url_id) {
                    id_obj =  respuesta.comidas[i].id;
                    descripcion_obj =  respuesta.comidas[i].descripcion;
                    categoria_obj = respuesta.comidas[i].descripcion.categoria;
                    menu_obj = respuesta.comidas[i].menu;
                    horario_atencion_obj = respuesta.comidas[i].horario_atencion;
                    
                    var obj = {id_obj,descripcion_obj,categoria_obj,menu_obj,horario_atencion_obj};
                    array_temp.push(obj);
                }
            }
           cargar_data(array_temp);  
        })    
        array_temp = main_productos;  
}

// ----------------------------------------------- Cargar datos de empresas 
function cargar_data (data){
    var info_tienda= document.getElementById('info-tienda');
    var html = "";
    
    for (let i = 0; i < data.length; i++) {
            html += `
                <div class="card-empresas">
                    <div class="card-opciones"></div>
                    <div class="card-image">
                        <img src="${data[i].descripcion_obj.img}">
                    </div>
                    <div class="card-descripcion">
                        <p>
                            <strong>Nombre:</strong> ${data[i].descripcion_obj.nombre} <br>
                            <strong>Producto:</strong> ${data[i].descripcion_obj.producto} <br>
                            <strong>Local:</strong> ${data[i].descripcion_obj.local}
                        </p>
                    </div>
                </div>
                `;
    }
    // info_tienda.innerHTML += html;
    cargar_categorias_menu_combobox();
}

// ----------------------------------------------- Cargar las categorias en el combobox principal 
function cargar_categorias_menu_combobox (){ 
    categoria_menu_array = main_productos[0].menu_obj;
    var selector = document.querySelector('#categoria-menu-combobox');

        if (categoria_menu_array != undefined) {
            for (let i = 0; i < (categoria_menu_array.length); i++) {               
                selector.options[i] = new Option(`${categoria_menu_array[i].categoria_menu}`.replace(/\b[a-z]/g,c=>c.toUpperCase())); 
            }
            cargar_categorias_menu();
        }           
}

//------------------------------------------------ Cargar el menu de la empresa
function cargar_categorias_menu (){
    
    var productos_menu = document.getElementById('productos-menu');
    var selec = document.querySelector('#categoria-menu-combobox');
    var info_tienda= document.getElementById('info-tienda');
    var html = "";
    var band = 0;
    var arra_temp_menu =[];
    info_tienda.innerHTML = "";

    for (let i = 0; i < categoria_menu_array.length; i++) {
       if (selec.value.toLowerCase() == categoria_menu_array[i].categoria_menu) {
         console.log(categoria_menu_array[i]);
        // ------------- Aqui ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                 info_tienda.innerHTML += `
                        <div class="card-empresas">
                            <div class="card-image">
                                <img src="${categoria_menu_array[i].img_menu}">
                            </div>
                            <div class="card-descripcion">
                                <p>
                                    ${categoria_menu_array[i].categoria_menu.toUpperCase()} <br>
                                </p>
                            </div>
                        </div>
                 `;

                arra_temp_menu = categoria_menu_array[i].descripcion_menu;

                if (arra_temp_menu.length == 0) {
                    band = 1;
                }
                else
                {

                    for (let i = 0; i < arra_temp_menu.length; i++) {

                        html += `
                        <div class="margen-ejemplo">
                            <div class="pedido-ver-mas" id_desc_menu="${arra_temp_menu[i].id_descripcion_menu}">
                                <div class="pedido-ejemplo" >
                                    <div class="image-pedido">
                                        <img src="${arra_temp_menu[i].img}" alt="">
                                    </div>
                                    <div class="descr-pedido">
                                        <div class="descr-title">
                                            <p>
                                            ${arra_temp_menu[i].nombre.replace(/\b[a-z]/g,c=>c.toUpperCase())}
                                            </p>
                                        </div>
                                        <div class="descripcion-producto">
                                            ${arra_temp_menu[i].descripcion}
                                        </div>
                                        <div class="precio-button">
                                            <span>Precio: $ ${new Intl.NumberFormat().format(arra_temp_menu[i].valor)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                                `;
                    }
                }        
       }
    }

    if (band == 1) {
        productos_menu.innerHTML = 
                `<div class="no-menu">
                    <p>No Hay Menú Que Mostrar</p>
                 </div>
                `;
    }else{
        productos_menu.innerHTML = "";
        productos_menu.innerHTML += html;

    }

     
}

// ----------------------------------------------- MOSTRAR VER MAS PRODRUCTO

function ver_mas_producto (id_del_producto){
    var selec = document.querySelector('#categoria-menu-combobox');
    var margen_pedido = document.querySelector('.margen-pedido');
    var band = 0;
    var arra_temp_menu =[];
    var Aclarar_messa = `Ejemplo: No quiero cebolla en mi Hamburguesa`;
    
    for (let i = 0; i < categoria_menu_array.length; i++) {
        if (selec.value.toLowerCase() == categoria_menu_array[i].categoria_menu) {
             arra_temp_menu = categoria_menu_array[i].descripcion_menu;
             if (arra_temp_menu == undefined) {
                 band = 1;
             }
             else
             {
                 for (let i = 0; i < arra_temp_menu.length; i++) {
                     if (arra_temp_menu[i].id_descripcion_menu == id_del_producto) {
                        margen_pedido.innerHTML = `
                        <div class="anadir-a-pedido">
                            <div class="descipcin-pedido-scroll">
                                <div class="image-pedido-amplia">
                                    <img src="${arra_temp_menu[i].img}" alt="">
                                </div>
                                <div class="title-descripcion-precio">
                                    <span class="title-pedo">${arra_temp_menu[i].nombre.replace(/\b[a-z]/g,c=>c.toUpperCase())}</span>
                                    <p>${arra_temp_menu[i].descripcion}</p>
                                    <span class="precio-pedo">Precio: $ ${new Intl.NumberFormat().format(arra_temp_menu[i].valor)}</span>
                                </div>
                                <div class="pedido-cantidad">
                                    <p><span id="pedido-cantidad-span">Cantidad 1</span></p>
                                    <div class="pedido-cantidad-buttos">
                                        <button onclick="menosCantidadPedido()"> - </button>
                                        <input type="text" value="1" disabled id="pedidos-cantidad-input">
                                        <button onclick="masCantidadPedido()"> + </button>
                                    </div>
                                </div>
                                <div class="aclaracion-pedido">
                                    <label for="text">¿Deseas Algo Especial en Tu Pedido?</label>
                                    <textarea name="" id="aclaracion-pedido-text" placeholder="${Aclarar_messa}" cols="40" rows="15"></textarea>
                                </div>
                            </div>
                            <div class="buttons-pedido">
                                <button class="atras-pedido-button">Atras</button>
                                <button class="pedido-anadir-butt" id_desc_menu="${arra_temp_menu[i].id_descripcion_menu}">Añadir a Pedido</button>
                            </div>
                        </div>
                        `; 
                    }
                }
            }            
        }
    }
}


// ---------------------------------------------- QUITAR CANTIDAD A PEDIDDO
function menosCantidadPedido (){
     var pedidos_cantidad_input = document.querySelector('#pedidos-cantidad-input');
     var pedido_cantidad_span = document.querySelector('#pedido-cantidad-span');
     var vari = (pedidos_cantidad_input.value*1) - 1;

    if (pedidos_cantidad_input.value == 1) {
        alert('No Puede ser Cero la cantidad ¡¡¡')
    }else{
        pedidos_cantidad_input.value = `${vari}`;
        pedido_cantidad_span.innerHTML = `Cantidad ${vari}`;
    }
}

// ---------------------------------------------- AGREGAR CANTIDAD A PEDIDDO
function masCantidadPedido (){
    var pedidos_cantidad_input = document.querySelector('#pedidos-cantidad-input');
    var pedido_cantidad_span = document.querySelector('#pedido-cantidad-span');
    var vari = (pedidos_cantidad_input.value*1) + 1;
    pedidos_cantidad_input.value = `${vari}`;
    pedido_cantidad_span.innerHTML = `Cantidad ${vari}`;
}



// ----------------------------------------------- GUARDAR DATOS AL LS
function GuardarDatosLS(id_del_producto,aclaracion_pedido_text,pedidos_cantidad_input){

    var url = window.location.search;
    var url_id = url.split(`?id=`).join("");
    var selec = document.querySelector('#categoria-menu-combobox');
    var band = 0;
    var arra_temp_menu =[];
    var productos_Carro;
    var id_repetido;
    
    for (let i = 0; i < categoria_menu_array.length; i++) {
        if (selec.value.toLowerCase() == categoria_menu_array[i].categoria_menu) {
             arra_temp_menu = categoria_menu_array[i].descripcion_menu;
             if (arra_temp_menu == undefined) {
                 band = 1;
             }
             else
             {
                 for (let i = 0; i < arra_temp_menu.length; i++) {
                     if (arra_temp_menu[i].id_descripcion_menu == id_del_producto) {
                         productos_Carro = 
                            {
                                id_category: url_id*1,
                                id_menu: `${selec.value.toLowerCase()}${arra_temp_menu[i].id_descripcion_menu}`,
                                nombre_menu: arra_temp_menu[i].nombre,
                                // descripcion_menu: arra_temp_menu[i].descripcion,
                                aclarar_menu: aclaracion_pedido_text,
                                valor_menu: arra_temp_menu[i].valor,
                                cantida_menu: pedidos_cantidad_input
                            }
                            // console.log(productos_Carro);
                            id_repetido = productos_Carro.id_menu;
                            
                            // console.log(id_repetido);
                            // var prueba = productos_Carro.id_menu.split(`${selec.value.toLowerCase()}`).join("");
                            // console.log(prueba);
                    }
                }
            }            
        }
    }
    
    if (localStorage.getItem('product_cart_menu') === null) {
        let product_cart_menu = [];
        product_cart_menu.push(productos_Carro);
        localStorage.setItem('product_cart_menu', JSON.stringify(product_cart_menu));
            CargarDatosLS();
    }else{
        let product_cart_menu = JSON.parse(localStorage.getItem('product_cart_menu'));
        var verificar = buscarRepetido(id_repetido);

        // console.log(verificar)
        if (verificar == 0) {
            product_cart_menu.push(productos_Carro);
            localStorage.setItem('product_cart_menu', JSON.stringify(product_cart_menu));
            CargarDatosLS();
        }   
    }      
} 

//------------------------------------------------ Cargar Datos del Carrito de Compras en el LS
function CargarDatosLS(){
    
    var product_cart_menu = JSON.parse(localStorage.getItem('product_cart_menu'));
    let principal_tiket_scroll = document.getElementById('principal-tiket-scroll');
    // console.log(product_cart_menu.length);
    if (product_cart_menu==null) {
        principal_tiket_scroll.innerHTML = "";
    }else{
        principal_tiket_scroll.innerHTML = "";
        for (let i = 0; i < product_cart_menu.length; i++) {
            var valor_producto = (product_cart_menu[i].valor_menu * product_cart_menu[i].cantida_menu);
            principal_tiket_scroll.innerHTML += 
                    `
                    <div class="productos-enlistados">
                        <div class="productos-enlistados-header">
                            <div class="title-enlistado">
                                <strong>${product_cart_menu[i].nombre_menu.replace(/\b[a-z]/g,c=>c.toUpperCase())}</strong>
                            </div>
                        </div>
                        <div class="productos-enlistados-descripcion">
                            <p>
                                <span><strong>Pedido Especial: </strong>${product_cart_menu[i].aclarar_menu}</span>
                            </p>
                        </div>
                        <div class="prod-list-precio-cantidad">
                            <div class="precio-cantidad">
                                Precio: <span>$ ${new Intl.NumberFormat().format(product_cart_menu[i].valor_menu)}</span> <br>
                                Cantidad: <span>${product_cart_menu[i].cantida_menu}</span>
                            </div>
                            <div class="button-cantidad">
                                <button onclick="quitarCantidad('${product_cart_menu[i].id_menu}')">-</button>
                                <input type="text" value="${product_cart_menu[i].cantida_menu}" disabled/>
                                <button onclick="agregarCantidad('${product_cart_menu[i].id_menu}')">+</button>                           
                            </div>
                        </div>
                        <div class="delete-enlistado">
                                <p><b>Total: </b>$ ${new Intl.NumberFormat().format(valor_producto)}</p>
                                <button id="" onclick="EliminarDatos('${product_cart_menu[i].id_menu}')">Eliminar de Pedido</button>
                        </div>
                    </div>
                    <hr>
                    `;
        }
    }  
    calcular_total_tiket();
}

//------------------------------------------------ Funcion patra Evaluar el total
function calcular_total_tiket(){
    var total=0;
    var total_tiket = document.getElementById('total-tiket-value');
    var product_cart_menu = JSON.parse(localStorage.getItem('product_cart_menu'));

    if (product_cart_menu==null) {
        
    }else{
        for (let i = 0; i < product_cart_menu.length; i++) {
               total = total + ((product_cart_menu[i].cantida_menu)*product_cart_menu[i].valor_menu);
        }
    }  
    // console.log(total);
    total = total + domicilio;
    total_tiket.innerHTML = new Intl.NumberFormat().format(total);
    if (total == 0) {
        button_variable.innerHTML = `Nuevo Pedido`;
        document.getElementById('button-tiket-id').disabled=true;
        $('.button-tiket').addClass('button-tiket-id');
    }else{
        button_variable.innerHTML = `Continuar Pedido`;
        document.getElementById('button-tiket-id').disabled=false;
        $('.button-tiket').removeClass('button-tiket-id');
    }
}

//------------------------------------------------ Funcion para agreagar cantidad a el pedido
function agregarCantidad (id_ls){
    var product_cart_menu = JSON.parse(localStorage.getItem('product_cart_menu'));
    if (product_cart_menu==null) {
        
    }else{
        for (let i = 0; i < product_cart_menu.length; i++) {
            if (product_cart_menu[i].id_menu == id_ls) {
                product_cart_menu[i].cantida_menu = product_cart_menu[i].cantida_menu + 1;
            }
        }
    } 
    localStorage.setItem('product_cart_menu', JSON.stringify(product_cart_menu));
    CargarDatosLS();
    calcular_total_tiket();
    pintar_cantidad_carrito();
}

//------------------------------------------------ Funcion para Quitar cantidad a el pedido
function quitarCantidad (id_ls){
    var product_cart_menu = JSON.parse(localStorage.getItem('product_cart_menu'));
    

    if (product_cart_menu==null) {
        
    }else{
        for (let i = 0; i < product_cart_menu.length; i++) {
            if (product_cart_menu[i].id_menu == id_ls) {
                if (product_cart_menu[i].cantida_menu > 1) {
                    product_cart_menu[i].cantida_menu = product_cart_menu[i].cantida_menu - 1;
                }else{
                    num_band = num_band + 1;
                    if (num_band > 5) {
                        alert('No Puede ser menor que 1')   
                        num_band = 0;
                    }
                }
            }
        }
    } 
    localStorage.setItem('product_cart_menu', JSON.stringify(product_cart_menu));
    CargarDatosLS();
    calcular_total_tiket();
}

// ----------------------------------------------- Funcion para enviar mensaje en Whatsapp // Correo
function SendMessageTiket (){

    emailjs.init("user_Q1oCdU6sYvaSzqe0Nemcf");
    let user_data = JSON.parse(localStorage.getItem('user-dataV2'));
    var product_cart_menu = JSON.parse(localStorage.getItem('product_cart_menu'));
    var product_message = "";
    var user_message = "";
    var message_final = "";
    var tipo_envio = 'Para Llevar';
    var valor_total = 0;
    var dat = new Date();
    var numer_pedido;
    

        if (domicilio > 0) {
            tipo_envio = 'Entrega a Domicilio';
        }


        if (product_cart_menu==null) {
            
        }else{
            for (let i= 0; i < product_cart_menu.length; i++) {
            leng_lar = "";
            valor_total = valor_total + (product_cart_menu[i].valor_menu * product_cart_menu[i].cantida_menu);
            product_message += `
                            <p>
                                PRODUCTO ${i+1} <br>
                                Categoria: ${product_cart_menu[i].nombre_menu.replace(/\b[a-z]/g,c=>c.toUpperCase())} <br>
                                Pedido Especial: ${product_cart_menu[i].aclarar_menu} <br>
                                Cantidad: ${product_cart_menu[i].cantida_menu} <br>
                                Valor: $ ${new Intl.NumberFormat().format((product_cart_menu[i].valor_menu * product_cart_menu[i].cantida_menu))} <br>
                                --------------------------------- <br>
                            </p>
                                `;
            }
            
            product_message += `
                            <p>
                                VALOR PEDIDO: $ ${new Intl.NumberFormat().format(valor_total)} <br>
                                DOMICILIO: $ ${new Intl.NumberFormat().format(domicilio)} <br>
                                VALOR TOTAL: $ ${new Intl.NumberFormat().format(valor_total+domicilio)} <br>
                                TIPO DE PEDIDO: ${tipo_envio}
                            </p>
                            `;
        }  

        message_final += `
                    ${user_message}
                    ${product_message}    
                    `;
    


        console.log(message_final);

        
        numer_pedido = `${dat.getFullYear()}${dat.getMonth()+1}${dat.getDate()}${dat.getHours()}${dat.getMinutes()}${dat.getMilliseconds()}`


        var template_params = {

            "pedido_number": numer_pedido,
            "user_nombre": user_data.ls_user_nombre.replace(/\b[a-z]/g,c=>c.toUpperCase()),
            "user_numero": user_data.ls_user_telefono,
            "user_direccion": user_data.ls_user_direccion,
            "user_barrio": user_data.ls_user_barrio.replace(/\b[a-z]/g,c=>c.toUpperCase()),
            "message_html": product_message
        }
         
         var service_id = "default_service";
         var template_id = "template_bhFVw0Nr";
         emailjs.send(service_id, template_id, template_params);


    // var tipo_envio = 'Para Llevar';
    // let user_data = JSON.parse(localStorage.getItem('user-data'));
    // var product_cart_menu = JSON.parse(localStorage.getItem('product_cart_menu'));
    // var message = "";
    // var number = "573103368887";
    // var valor_total = 0;
    // var mas_domicilio = ''
    // var leng_lar;

    // if (domicilio > 0) {
    //     tipo_envio = 'Entrega a Domicilio';
    //     mas_domicilio = 'Mas Envio';
    // }

    // if (product_cart_menu==null) {
        
    // }else{
    //     for (let i= 0; i < product_cart_menu.length; i++) {
    //       leng_lar = "";
    //       valor_total = valor_total + (product_cart_menu[i].valor_menu * product_cart_menu[i].cantida_menu);
    //       if (product_cart_menu[i].nombre_menu.replace(/\b[a-z]/g,c=>c.toUpperCase()).length > 22) {
    //           leng_lar = '||';
    //       }
    //             message += ` 
    //                         PRODUCTO ${i+1}

    //                         Categoria: ${product_cart_menu[i].nombre_menu.replace(/\b[a-z]/g,c=>c.toUpperCase())}
                            
    //                         Pedido Especial: ${product_cart_menu[i].aclarar_menu}
                            
    //                         Cantidad: ${product_cart_menu[i].cantida_menu}
                            
    //                         Valor: $ ${new Intl.NumberFormat().format((product_cart_menu[i].valor_menu * product_cart_menu[i].cantida_menu))}
                            
    //                         ---------------------------------

    //                         `;
    //     }
    //     valor_total = valor_total + domicilio;
    //     message +=  `
    //                 Valor Total: $ ${new Intl.NumberFormat().format(valor_total)} ${mas_domicilio}
                    
    //                 Nombre: ${user_data.ls_user_nombre}

    //                 Dirección: ${user_data.ls_user_direccion}

    //                 Barrio: ${user_data.ls_user_barrio}

    //                 Tipo de Pedido: ${tipo_envio}

    //                 `;
    // }   

    // console.log(message);
    
    // var url = `https://api.whatsapp.com/send?phone=${number}&text=${message}`;

    // window.open(url);
}


// ------------------------------------------------ Creacion de los datos del Usuario en local storage

function UserdataGuardarDatosLS (){

    var user_nombre = document.querySelector('#nombre-user').value;
    var user_telefono = document.querySelector('#telefono-user').value;
    var user_direccion= document.querySelector('#direccion-user').value;
    var user_barrio = document.querySelector('#barrio-user').value;

    var user_data_ls = {
        ls_user_nombre: user_nombre,
        ls_user_telefono: user_telefono,
        ls_user_direccion: user_direccion,
        ls_user_barrio: user_barrio
    }

    if (localStorage.getItem('user-dataV2') === null) {
        localStorage.setItem('user-dataV2', JSON.stringify(user_data_ls));
    }else{
        let user_data = JSON.parse(localStorage.getItem('user-dataV2'));

        user_data.ls_user_nombre = user_nombre;
        user_data.ls_user_telefono = user_telefono;
        user_data.ls_user_direccion = user_direccion;
        user_data.ls_user_barrio = user_barrio;

        localStorage.setItem('user-dataV2', JSON.stringify(user_data));
    }    
}

//-----------------------Eliminar tareas de Tiket de compras 
function EliminarDatos(id_menu){
    
    var product_cart_menu = JSON.parse(localStorage.getItem('product_cart_menu'));

    for (let i = 0; i < product_cart_menu.length; i++) {
        if (product_cart_menu[i].id_menu == id_menu) {
            product_cart_menu.splice(i,1);
        }
    }
    localStorage.setItem('product_cart_menu',JSON.stringify(product_cart_menu));
    CargarDatosLS();
    calcular_total_tiket();
    pintar_cantidad_carrito();
}

//------------------------------------------------ Funcion para Buscar si hay productos repetidos 
function  buscarRepetido(id_del_producto){
    var bol = 0;
    var dos = id_del_producto;
    let product_cart = JSON.parse(localStorage.getItem('product_cart_menu'));

    for (let i = 0; i < product_cart.length; i++) {
        var uno = product_cart[i].id_menu;
        
        if (uno == dos) {
            // console.log('No haga nada')
            alert('Este Producto ya esta Enlistado')
            bol=1;
        }else{
            // console.log('Ingrese Nuevo Producto')
        }
    }

    return bol;
}

// ----------------------------------------------- Verificar tiket de pagina 
function verify_ (){
    if (verify_category() == 0) {
        localStorage.removeItem('product_cart_menu');
        CargarDatosLS();
     }else{
        CargarDatosLS();
     }
     pintar_cantidad_carrito();
}

// ----------------------------------------------- Verificar en que pagina se encuentra para borrar el tiket
function verify_category (){

    var url = window.location.search;
    var url_id = url.split(`?id=`).join("");
    var product_cart_menu = JSON.parse(localStorage.getItem('product_cart_menu'));
    var retu = 0;

    if (product_cart_menu==null) {
        
    }else{
        for (let i = 0; i < product_cart_menu.length; i++) {
            
            if (product_cart_menu[i].id_category == (url_id*1)) {
                retu = 1;
                break;
            }
        }
    }   
    return retu;
}

// ----------------------------------------------- Pintar Cantidad de Carrito 
function pintar_cantidad_carrito (){
    var product_cart_menu = JSON.parse(localStorage.getItem('product_cart_menu'));
    var cantidad_productos = document.querySelector('#cantidad-productos');
    var pedido_precio = document.querySelector('.pedido-precio');
    var cantidad = 0;
    var precio = 0;


    if (product_cart_menu==null) {
        
    }else{
        for (let i = 0; i < product_cart_menu.length; i++) {
            cantidad = cantidad + (product_cart_menu[i].cantida_menu);
            precio = precio + ((product_cart_menu[i].cantida_menu)*product_cart_menu[i].valor_menu);
        }
    }  
    precio = precio +domicilio;

    if (product_cart_menu == null || product_cart_menu.length == 0) {
        $('.tiket-compra').removeClass('Active-tiket-compra');
    }else{
        $('.tiket-compra').addClass('Active-tiket-compra');
    }
        cantidad_productos.innerHTML = cantidad;
        pedido_precio.innerHTML = `$ ${new Intl.NumberFormat().format(precio)}`;

}

// --------------------------------------------------- Mostrar los datos de user en los input 
function mostrarDatosUserInput (){
    let user_data = JSON.parse(localStorage.getItem('user-dataV2'));
    console.log(user_data);
    if (user_data == null) {
        
    }else{
        document.getElementById('nombre-user').value = user_data.ls_user_nombre;
        document.getElementById('direccion-user').value = user_data.ls_user_direccion;
        document.getElementById('barrio-user').value = user_data.ls_user_barrio;
        document.getElementById('telefono-user').value = user_data.ls_user_telefono;
    }
}

// ----------------------------------------------------- Validacion Solo letras 
function soloLetras(e){
    key = e.keyCode || e.which;
    tecla = String.fromCharCode(key).toLowerCase();
    letras = " áéíóúabcdefghijklmnñopqrstuvwxyz";
    especiales = "8-37-39-46";

    tecla_especial = false
    for(var i in especiales){
         if(key == especiales[i]){
             tecla_especial = true;
             break;
         }
     }

     if(letras.indexOf(tecla)==-1 && !tecla_especial){
         return false;
     }
 }

 // ----------------------------------------------------- Validacion Solo Numeros 
function solonumeros(e){
    key = e.keyCode || e.which;
    tecla = String.fromCharCode(key).toLowerCase();
    letras = " 0123456789";
    especiales = "8-37-39-46";

    tecla_especial = false
    for(var i in especiales){
         if(key == especiales[i]){
             tecla_especial = true;
             break;
         }
     }

     if(letras.indexOf(tecla)==-1 && !tecla_especial){
         return false;
     }
 }

 // ----------------------------------------------------- Validacion Solo letras y numeros 
function soloLetrasynumeros(e){
    key = e.keyCode || e.which;
    tecla = String.fromCharCode(key).toLowerCase();
    letras = " áéíóúabcdefghijklmnñopqrstuvwxyz0123456789-";
    especiales = "8-37-39-46";

    tecla_especial = false
    for(var i in especiales){
         if(key == especiales[i]){
             tecla_especial = true;
             break;
         }
     }

     if(letras.indexOf(tecla)==-1 && !tecla_especial){
         return false;
     }
 }

// ------------------------------------------------------------------ verificacion de datos de usuario

 function verifyInput (){
      var nombre_user = document.querySelector('#nombre-user');
      var telefono_user = document.querySelector('#telefono-user');
      var direccion_user = document.querySelector('#direccion-user');
      var barrio_user = document.querySelector('#barrio-user');
      var alert_data_user = '';
      var very = true;
      var band_ver = 0;

    if (nombre_user.value.length == 0) {
        very = false;
        if (band_ver == 0) {
            alert_data_user = 'El nombre no Puede ir vacio';
            band_ver = 1;
        }
    }else{
        if (nombre_user.value.length > 30) {
            very = false;
            if (band_ver == 0) {
                alert_data_user = 'El nombre no Puede ser mayor a 30 caracteres';
                band_ver = 1;
            }
        }
    }

    if (telefono_user.value.length == 0) {
        very = false;
        if (band_ver == 0) {
            alert_data_user = 'El numero no puede ir vacio';
            band_ver = 1;
        }
    }else{
        if (telefono_user.value.length != 10) {
            very = false;
            if (band_ver == 0) {
                alert_data_user = 'El numero debe ser de 10 caracteres';
                band_ver = 1;
            }
        }
    }
    
    if (direccion_user.value.length == 0) {
        very = false;
        if (band_ver == 0) {
            alert_data_user = 'La direccion no puede estar vacio';
            band_ver = 1;
        }
    }
    if (barrio_user.value.length == 0) {
        very = false;
        if (band_ver == 0) {
            alert_data_user = 'El Barrio no puede estar vacio';
            band_ver = 1;
        }
    }

    return {
        very: very,
        alert_data_user: alert_data_user
    };
 }

//  ----------------------------------------------------------- alerta de domicilio ON o OFF

 function alertaDomicilio (){
      var alerta_id = document.querySelector('#alerta-id');
      var img_alerta = '';
      var message_alert = '';

        if (domicilio == 0) {
            img_alerta = `https://i.postimg.cc/RhrddyDY/domicilio-no.png`;
            message_alert = `Estas quitando la opción de domicilio, esto significa que tú tendras que recoger tu pedido en el propio local...`;
        }
        else{
            img_alerta = `https://i.postimg.cc/GhF773rx/domicilio-si.png`;
            message_alert = `Estas seleccionando la opción de domicilio, esto significa que reciviras tu pedido en la dicección que proporciones...`;
        }

        alerta_id.innerHTML = 
                `
                <div class="img-alerta">
                    <img src="${img_alerta}" alt="">
                </div>
                <div class="descr-alerta">
                    <p>${message_alert}</p>
                </div>
                <div class="butt-alert" >
                    <button id="butt-alert-id">Aceptar</button>
                </div>
                `;
 }


 
//  ----------------------------------------------------------- alerta de Open/close local

function alertaOpenClosedLocal (){
    var alerta_id = document.querySelector('#alerta-id');
    var img_alerta = '';
    var message_alert = '';
    var proxima_open = '';
    var reopen_f = reopen();

    img_alerta = `https://i.postimg.cc/2jhNCDMW/Cerrado-1.png`;
    message_alert = `En estos momentos el Local se encuentra Fuera de servicio.
                     Puedes Peditr tu Pedido la proxima vez que abra:`;
    proxima_open = `${obtenerMesShort(reopen_f.mes_nu)} ${reopen_f.dia_number} / ${reopen_f.dia} / ${obtenerHora_2(reopen_f.open_hora)}`;

      alerta_id.innerHTML = 
              `
              <div class="img-alerta">
                  <img src="${img_alerta}" alt="">
              </div>
              <div class="descr-alerta">
                  <p>${message_alert}</p>
                  <p class="re-open-service">${proxima_open}</p>
              </div>
              <div class="butt-alert" >
                  <button id="butt-alert-id">Aceptar</button>
              </div>
              `;
}



 function valoresTicketFinal (){

    var total=0;
    var domicilio_final = document.querySelector('#domicilio-final');
    var valor_pedido_final = document.querySelector('#valor-pedido-final');
    var valor_total_final = document.querySelector('#valor-total-final');
    var tipo_envio_final = document.querySelector('#tipo-envio-final');
    var product_cart_menu = JSON.parse(localStorage.getItem('product_cart_menu'));
    var tipo_domicilio = 'Domicilio';

    if (domicilio == 0) {
        tipo_domicilio = 'Para llevar';
    }

        if (product_cart_menu==null) {
        
        }else{
            for (let i = 0; i < product_cart_menu.length; i++) {
                total = total + ((product_cart_menu[i].cantida_menu)*product_cart_menu[i].valor_menu);
            }
        } 

        domicilio_final.innerHTML = `$ ${new Intl.NumberFormat().format(domicilio)}`;
        valor_pedido_final.innerHTML = `$ ${new Intl.NumberFormat().format(total)}`;
        valor_total_final.innerHTML = `$ ${new Intl.NumberFormat().format(total+domicilio)}`;
        tipo_envio_final.innerHTML = `${tipo_domicilio}`;
 }

function modalExit (){
      var modal_descripcion = document.querySelector('#modal-descripcion-id'); 
      var img_modal_exit = 'https://i.postimg.cc/MTkYGjQG/14704.png';
      var mensaje_modal_exit = 'Enviado Con Exito'
      
      modal_descripcion.innerHTML = 
      `
        <div class="img-modal-exit">
                <img src="https://i.postimg.cc/rynQS71x/cargando.gif" alt="">
        </div>
        <div class="descr-modal-exit">
                <span>Cargando....</span>
        </div>
        <div class="butt-modal-exit">
            <button id="butt-modal-exit-id">Aceptar</button>
        </div>
        
      `;

      setTimeout(function(){
        modal_descripcion.innerHTML = 
            `
            <div class="img-modal-exit">
                    <img src="${img_modal_exit}" alt="">
            </div>
            <div class="descr-modal-exit">
                    <span>${mensaje_modal_exit}<span>
            </div>
            <div class="butt-modal-exit">
                <button id="butt-modal-exit-id">Aceptar</button>
            </div>
            `;
      },2500);
 }


 
function Validacion_Hora_Dia (){
    var dat = new Date();
    var arra = main_productos[0].horario_atencion_obj;
    var hora = dat.getHours();
    var diaActual = dat.getDay();
    var open_hora,close_hora,dia;
    var service;
   

    for (let i = 0; i < arra.length; i++) {
        if (i == diaActual) {
            open_hora = arra[i].open;
            close_hora = arra[i].close;
            dia = arra[i].day;
        }
    }
    
   if (hora >= open_hora && hora < close_hora) {
            service = true;
   }else{
            service = false;
   }    

    return service;
}


function reopen (){
    var dat = new Date();
    var arra = main_productos[0].horario_atencion_obj;
    var hora = dat.getHours();
    var diaActual = dat.getDay();
    var open_hora,dia,dia_number,mes_nu;
    var open_hora_2;

    let hoy = new Date();
    let DIA_EN_MILISEGUNDOS = 24 * 60 * 60 * 1000;
    let manana = new Date(hoy.getTime() + DIA_EN_MILISEGUNDOS);

    for (let i = 0; i < arra.length; i++) {
        if (i == diaActual) {
            open_hora_2 = arra[i].open;
        }
    }


    console.log(manana.getMonth());

    if (hora < open_hora_2) {
    
        for (let i = 0; i < arra.length; i++) {
            if (i == diaActual) {
                open_hora = arra[i].open;
                dia = arra[i].day;
                dia_number = dat.getDate();
                mes_nu = dat.getMonth();
            }
        }

    }else{
       
        diaActual++;

        if (diaActual == 6) {
            diaActual = 0;
        }

        for (let i = 0; i < arra.length; i++) {
            if (i == diaActual) {
                open_hora = arra[i].open;
                dia = arra[i].day;
                dia_number = manana.getDate();
                mes_nu = manana.getMonth();
            }
        }

    }

    return{
        open_hora,
        dia,
        dia_number,
        mes_nu
    }

}

function obtenerHora_2 (hora){
    var ret = "";

    if (hora >= 16 && hora < 23) {
        if (hora > 12) {
            ret = `${hora - 12}:00 pm`;
        }else{
            ret = `${hora}:00 am`;   
        }
    }
    else{
        if (hora > 12) {
            ret = `${hora-12}:00 pm`;               
        }else{
            ret = `${hora}:00 am`;
        }
    }

    return ret;
}

function obtenerMesShort (mes_number){
    var mes = "";
    if (mes_number == 0) {
         mes = `Ene`
    }else 
    if (mes_number == 1) {
        mes = `Feb`
    }else 
    if (mes_number == 2) {
        mes = `Mar`
    }else 
    if (mes_number == 3) {
        mes = `Abr`
    }else 
    if (mes_number == 4) {
        mes = `May`
    }else 
    if (mes_number == 5) {
        mes = `Jun`
    }else 
    if (mes_number == 6) {
        mes = `Jul`
    }else 
    if (mes_number == 7) {
        mes = `Ago`
    }else 
    if (mes_number == 8) {
        mes = `Sep`
    }else 
    if (mes_number == 9) {
        mes = `Oct`
    }else 
    if (mes_number == 10) {
        mes = `Nov`
    }else 
    if (mes_number == 11) {
        mes = `Dic`
    }

    return mes;
}

