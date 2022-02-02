class Agenda {
    constructor(reset = false) {
        // Definimos la url de nuestro CRUD
        this.url = "http://localhost/agendaapi/index.php/";

        if (reset) {
            new Agenda().agenda_select_all();

            document.querySelector("#btnGuardar").addEventListener("click", () => {
                let id = sessionStorage.getItem("id");
                if (id == null) {
                    new Agenda().agenda_insert();
                } else {
                    new Agenda().agenda_update();
                }
            });
        }
    }

    async peticion(url = "", datos = "") {
        try {
            let cadenaFetch = `${url}?${datos}`;
            let response = await fetch(cadenaFetch);
            let resultado = await response.json();
            return resultado;
        } catch (error) {
            console.log(error);
        }
    }

    async agenda_select_all() {
        try {
            let datos_url = `proceso=AGENDA_SELECT_ALL`;
            let datos = await new Agenda().peticion(this.url, datos_url);
            let strElementos = `
            <ul class="list-group">
      `;
            for (let d of datos) {
                strElementos += `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <div><a>${d.nombre}</a><div>
            <button class="btn btn-success" onclick="new Agenda().fnMuestraDatos(${d.id},'${d.nombre}','${d.correo}')">Editar</button>
            
            <button class="btn btn-light" onclick="new Agenda().agenda_delete(${d.id})">Eliminar</button>
        </li>`;
            }
            strElementos += `</ul>`;
            document.querySelector("#listaagenda").innerHTML = strElementos;
            document.querySelector("#nombre").value = "";
            document.querySelector("#correo").value = "";
            sessionStorage.removeItem("id");
        } catch (error) {
            console.log(error);
        }
    }

    async agenda_insert() {
        let divMsg = document.querySelector("#error");
        divMsg.innerHTML = "";
        const nombre = document.querySelector("#nombre").value;
        const correo = document.querySelector("#correo").value;
        if (nombre == "" || correo == "") {
            divMsg.innerHTML = "Debe ingresar nombre y correo";
            return;
        }

        try {
            const datos_url = `proceso=AGENDA_INSERT&nombre=${nombre}&correo=${correo}`;
            let datos = await new Agenda().peticion(this.url, datos_url);
            if (datos != 1) {
                divMsg.innerHTML = "Hubo algún error al guardar";
                return;
            }
            new Agenda().agenda_select_all();
        } catch (error) {
            console.log(error);
        }
    }

    async agenda_update(){
        let divMsg = document.querySelector("#error");
        divMsg.innerHTML = "";
        const nombre = document.querySelector("#nombre").value;
        const correo = document.querySelector("#correo").value;
        if (nombre == "" || correo == "") {
            divMsg.innerHTML = "Debe ingresar nombre y correo";
            return;
        }

        try {
            const datos_url = `proceso=AGENDA_UPDATE&id=${sessionStorage.getItem("id")}&nombre=${nombre}&correo=${correo}`;
            let datos = await new Agenda().peticion(this.url, datos_url);
            if (datos != 1) {
                divMsg.innerHTML = "Hubo algún error al actualizar";
                return;
            }
            new Agenda().agenda_select_all();
        } catch (error) {
            console.log(error);
        }
    }

    fnMuestraDatos(id,nombre,correo){
        sessionStorage.setItem("id",id);
        document.querySelector("#nombre").value = nombre;
        document.querySelector("#correo").value = correo;
    }

    async agenda_delete(id){
        let divMsg = document.querySelector("#error");
        divMsg.innerHTML = "";

        try {
            const datos_url = `proceso=AGENDA_DELETE&id=${id}`;
            let datos = await new Agenda().peticion(this.url, datos_url);
            if (datos != 1) {
                divMsg.innerHTML = "Hubo algún error al eliminar";
                return;
            }
            new Agenda().agenda_select_all();
        } catch (error) {
            console.log(error);
        }
    }
}

window.onload = () => new Agenda(true);
