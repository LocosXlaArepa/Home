$(document).ready(main);
// variables
var main_productos = [];

var id_obj,descripcion_obj,categoria_obj,estados_servicios_obj,horario_atencion_obj;



function main (){
    // Obtener los datos de JSON
     get_data();
    
    //  $('body').on('click', '#buscar-categoria', function(){
    //     caragar_categoria();
    // }) 

    $('body').on('change', '#categorias-productos', function(){
        caragar_categoria();
    }) 

    
    
}

// Cargar data
function get_data (){
    var array_temp =[];
    
   
    var url = "https://locosxlaarepa.github.io/Home/Data/data-base.json";
    
        fetch(url)
        .then(function(res){
            return res.json();
        })
        .then(function(rep){
           for (let i = 0; i < rep.comidas.length; i++) {
                id_obj =  rep.comidas[i].id;
                descripcion_obj =  rep.comidas[i].descripcion;
                categoria_obj = rep.comidas[i].descripcion.categoria;
                estados_servicios_obj = rep.comidas[i].estados_servicios;
                horario_atencion_obj = rep.comidas[i].horario_atencion;
                
                var obj = {id_obj,descripcion_obj,categoria_obj,estados_servicios_obj,horario_atencion_obj};
                array_temp.push(obj);
           }
           cargar_data(array_temp);
        //    cargar_categorias_combobox();        
        })    
        array_temp = main_productos;  
}

function cargar_data (data){
    var empresas_reciente = document.getElementById('empresas_reciente');
    var descr_servicios_horario = document.getElementById('descr-servicios-horario');
    var html = "";
    var html_service_hours = "";
    var getStatus = obtenerHora(data);    
    var getdaysSeriv = obtenerDaysService(data);
    var getStatusService = obtenerEstatusServices(data);
        html += `
                <div class="card-empresas">
                    <div class="card-image">
                        <img src="${data[0].descripcion_obj.img}">
                    </div>
                    <div class="card-opciones">
                            <span class="${getStatus.class_OpnClos}" id="h-s">
                                ${getStatus.ret}
                            </span>
                    </div>
                    <div class="card-descripcion">
                        <p>
                            ${data[0].descripcion_obj.producto} <br>
                            ${data[0].descripcion_obj.direccion} <br>
                            ${data[0].descripcion_obj.local}
                        </p>
                    </div>
                    <div class="ver-menu">
                        <a href="/Home/Menu/menu.html?id=${data[0].id_obj}">
                        <img src="https://i.postimg.cc/2Sf50ZDF/icon-menu.png">
                        Ver Menú
                        </a>
                    </div>
                </div>
                `;
        html_service_hours += 
        `
        ${getStatusService}
        ${getdaysSeriv}
        `;
    empresas_reciente.innerHTML += html;
    descr_servicios_horario.innerHTML += html_service_hours;
   
}


function removeDuplicates(originalArray, prop) {//Eliminar Duplicados de JSON
    var newArray = [];
    var lookupObject  = {};
    
    for(var i in originalArray) {
       lookupObject[originalArray[i][prop]] = originalArray[i];
    }
    for(i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
     return newArray;
}

function caragar_categoria (){
    var num_filtro = 0;
    var filtroArray = [];
    var selec = document.querySelector('#categorias-productos');
    var title = document.querySelector('#titulo-recientes');
    var empresas_reciente = document.querySelector('#empresas_reciente');
    

            for (let i = 0; i < main_productos.length; i++) {
                if (selec.value.toLowerCase() == main_productos[i].categoria_obj ) {
                    filtroArray[num_filtro] =  main_productos[i];
                    num_filtro++;
                }
            }
            if (selec.value == 'Selecciona una categoria' || selec.value == 'Todas') {
                  filtroArray = main_productos;
            }
            empresas_reciente.innerHTML = "";
            if (selec.value == 'Selecciona una categoria') {
                title.innerHTML = ` <h3>Recientes</h3>`;
            }else{
                title.innerHTML = ` <h3>${selec.value}</h3>`;
            }
            cargar_data(filtroArray);
}


function obtenerHora (data_){
    var dat = new Date();
    var arra = data_[0].horario_atencion_obj;
    var open_hora,close_hora;
    var hora = dat.getHours();
    var minuto = dat.getMinutes();
    var class_OpnClos;
    var ret = "";

    for (let i = 0; i < arra.length; i++) {
        if (i == (dat.getDay())) {
            open_hora = arra[i].open;
            close_hora = arra[i].close;
        }
    }
 
        if (hora >= open_hora && hora < close_hora) {
            if (hora > 12) {
                if (minuto < 10) {
                    ret = `${hora - 12}:0${minuto} pm - En Servicio`;
                }else{
                    ret = `${hora - 12}:${minuto} pm - En Servicio`;
                }
            }else{
                if (minuto < 10) {
                    ret = `${hora}:0${minuto} am - AbiertEn Servicio`;   
                }else{
                    ret = `${hora}:${minuto} am - AbiertEn Servicio`;
                }
            }
           
            class_OpnClos = `hora-status-open`;
        }
        else{
            if (hora > 12) {
                if (minuto < 10) {
                    ret = `${hora-12}:0${minuto} pm - Cerrado`;   
                }else{
                    ret = `${hora-12}:${minuto} pm - Cerrado`;
                }
            }else{
                if (minuto < 10) {
                    ret = `${hora}:0${minuto} am - Cerrado`;   
                }else{
                    ret = `${hora}:${minuto} am - Cerrado`;
                }
            }
            class_OpnClos = `hora-status-close`;
        }
    
    return {
        ret,
        class_OpnClos
    }
}

function obtenerEstatusServices (data_){
    var consumo_lugar_ = data_[0].estados_servicios_obj.consumo_lugar;
    var entrega_domicilio_ = data_[0].estados_servicios_obj.entrega_domicilio;
    var para_llevar_ = data_[0].estados_servicios_obj.para_llevar;
    var consumo_lugar_cla = 'servicio-no';
    var entrega_domicilio_cla = 'servicio-no';
    var para_llevar_cla = 'servicio-no';
    var cl_yes_no = 'X';
    var ed_yes_no = 'X';
    var pl_yes_no = 'X';
    
    if (consumo_lugar_) {
        consumo_lugar_cla = 'servicio-si';
        cl_yes_no = '✓';
    }
    if (entrega_domicilio_) {
        entrega_domicilio_cla = 'servicio-si';
        ed_yes_no = '✓';
    }
    if (para_llevar_) {
        para_llevar_cla = 'servicio-si';
        pl_yes_no = '✓';
    }

    var servicios_descr_html;

    servicios_descr_html =  `
                            <div class="servicios-descr">
                                <span class="servicio-title">SERVICIOS</span>
                                <div class="servicios-local">
                                    <span class="${entrega_domicilio_cla}">${ed_yes_no}</span> <span class="servicios-letter">Entrega a domicilio</span><br>
                                    <span class="${para_llevar_cla}">${pl_yes_no}</span> <span class="servicios-letter">Para llevar</span><br>
                                    <span class="${consumo_lugar_cla}">${cl_yes_no}</span> <span class="servicios-letter">Consumo en el lugar</span><br>
                                </div>
                            </div>
                            <br>
                            `;
        return servicios_descr_html;
}

function obtenerDaysService (data_){
    var array = data_[0].horario_atencion_obj;
    var days_hours_style;
    var dat = new Date();
    var html_day_hous = "";
    
    for (let i = 0; i < array.length; i++) {
        days_hours_style = `day-hours-no`;
        if ((dat.getDay()) == i) {
            days_hours_style = `day-hours-si`;
        }
        html_day_hous += `<p class="${days_hours_style}">${obtenerDia(i)}<br> ${obtenerHora_2(array[i].open)} - ${obtenerHora_2(array[i].close)}</p>`;
    }

    var ret =   `
            <div class="horarios-descr">
                <span class="horario-title">HORARIOS DE ATENCIÓN</span>
                <div class="time-servicios">
                    ${html_day_hous}
                </div>
            </div>
                `;
        return ret;
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

function obtenerDia (dia_number){
    var dia = "";
    if (dia_number == 0) {
         dia = `Domingo`
    }else 
    if (dia_number == 1) {
        dia = `Lunes`
    }else 
    if (dia_number == 2) {
        dia = `Martes`
    }else 
    if (dia_number == 3) {
        dia = `Miercoles`
    }else 
    if (dia_number == 4) {
        dia = `Jueves`
    }else 
    if (dia_number == 5) {
        dia = `Viernes`
    }else 
    if (dia_number == 6) {
        dia = `Sabado`
    }

    return dia;
}




