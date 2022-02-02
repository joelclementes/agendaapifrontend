class Agenda {
    constructor(reset = false) {
        // Definimos la url de nuestra api backend
        this.url = "http://localhost/agendaapibackend/index.php/";

        if (reset) {
            // Llamamos este método para mostrar los registros existentes
            new Agenda().agenda_select_all();

            // Cuando hacemos clic en el botón guardar
            document.querySelector("#btnGuardar").addEventListener("click", () => {
                // Buscamos en Session Storage en el navegador a ver si existe este elemento
                let id = sessionStorage.getItem("id");
                if (id == null) {
                    // Si no existe, quiere decir que es un registro nuevo y se insertará a la BD
                    new Agenda().agenda_insert();
                } else {
                    // Si existe, es porque se hizo clic en el botón Editar y se llevó ahí el id del registro
                    new Agenda().agenda_update();
                }
            });
        }
    }

    async peticion(url = "", datos = "") {
        // Este método es el que hace las peticiones al backend, especificado en la propiedad url
        try {
            // #Creamos cadenaFetch para unir la url y las variables
            let cadenaFetch = `${url}?${datos}`;

            // #Hacemos la petición a través de fetch y mientras no obtenemos respuesta no continúa la ejecución
            // Por eso usamos await
            let response = await fetch(cadenaFetch);

            // Recibimos la respuesta y lo almacenamos en resultado, que es lo que retornará este método
            // en formato json
            let resultado = await response.json();
            return resultado;
        } catch (error) {
            console.log(error);
        }
    }

    async agenda_select_all() {
        try {
            // En datos_url especificamos las variables que recibirá la api por método get
            let datos_url = `proceso=AGENDA_SELECT_ALL`;

            // Enviamos la petición y la respuesta es almacenada en la variable datos con formato json
            let datos = await new Agenda().peticion(this.url, datos_url);

            // Iteramos el objeto para crear la lista de registros con sus respectivos datos y botones
            let strElementos = `
            <ul class="list-group">`;
                for (let d of datos) {
                strElementos += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div><a>${d.nombre} - ${d.correo}</a><div>
                    <button class="btn btn-success" onclick="new Agenda().fnMuestraDatos(${d.id},'${d.nombre}','${d.correo}')">Editar</button>
                    <button class="btn btn-light" onclick="new Agenda().agenda_delete(${d.id})">Eliminar</button>
                </li>`;
            }
            strElementos += `
            </ul>`;

            // La cadena se pasa al elemento HTML con id listaagenda, que se encuentra en index.html
            document.querySelector("#listaagenda").innerHTML = strElementos;

            // Limpiamos los inputs
            document.querySelector("#nombre").value = "";
            document.querySelector("#correo").value = "";

            // Si existiera el item id en la Session Storage, es eliminado
            sessionStorage.removeItem("id");
        } catch (error) {
            console.log(error);
        }
    }

    async agenda_insert() {
        let divMsg = document.querySelector("#error");
        divMsg.innerHTML = "";

        // Obtenemos los valores dados por el usuario
        const nombre = document.querySelector("#nombre").value;
        const correo = document.querySelector("#correo").value;

        // Validamos que no falte ningún dato
        if (nombre == "" || correo == "") {
            divMsg.innerHTML = "Debe ingresar nombre y correo";
            return;
        }

        try {
            // En datos_url especificamos las variables que recibirá la api por método get
            const datos_url = `proceso=AGENDA_INSERT&nombre=${nombre}&correo=${correo}`;

            // Enviamos la petición y la respuesta es almacenada en la variable datos con formato json
            let datos = await new Agenda().peticion(this.url, datos_url);
            if (datos != 1) {
                divMsg.innerHTML = "Hubo algún error al guardar";
                return;
            }

            // Una vez ejecutada la petición y sin error, refrescamos la lista de registros
            new Agenda().agenda_select_all();
        } catch (error) {
            console.log(error);
        }
    }

    async agenda_update(){
        let divMsg = document.querySelector("#error");
        divMsg.innerHTML = "";

        // Obtenemos los valores dados por el usuario
        const nombre = document.querySelector("#nombre").value;
        const correo = document.querySelector("#correo").value;

        // Validamos que no falte ningún dato
        if (nombre == "" || correo == "") {
            divMsg.innerHTML = "Debe ingresar nombre y correo";
            return;
        }

        try {
            // En datos_url especificamos las variables que recibirá la api por método get
            const datos_url = `proceso=AGENDA_UPDATE&id=${sessionStorage.getItem("id")}&nombre=${nombre}&correo=${correo}`;

            // Enviamos la petición y la respuesta es almacenada en la variable datos con formato json
            let datos = await new Agenda().peticion(this.url, datos_url);
            if (datos != 1) {
                divMsg.innerHTML = "Hubo algún error al actualizar";
                return;
            }

            // Una vez ejecutada la petición y sin error, refrescamos la lista de registros
            new Agenda().agenda_select_all();
        } catch (error) {
            console.log(error);
        }
    }

    fnMuestraDatos(id,nombre,correo){
        // Método que utiliza el botón Editar
        sessionStorage.setItem("id",id);
        document.querySelector("#nombre").value = nombre;
        document.querySelector("#correo").value = correo;
    }

    async agenda_delete(id){
        // Método que llama el botón Eliminar
        let divMsg = document.querySelector("#error");
        divMsg.innerHTML = "";

        try {
            // En datos_url especificamos las variables que recibirá la api por método get
            const datos_url = `proceso=AGENDA_DELETE&id=${id}`;

            // Enviamos la petición y la respuesta es almacenada en la variable datos con formato json
            let datos = await new Agenda().peticion(this.url, datos_url);
            if (datos != 1) {
                divMsg.innerHTML = "Hubo algún error al eliminar";
                return;
            }

            // Una vez ejecutada la petición y sin error, refrescamos la lista de registros
            new Agenda().agenda_select_all();
        } catch (error) {
            console.log(error);
        }
    }
}

window.onload = () => new Agenda(true);
