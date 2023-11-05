/* VARIABLES */
const formulario = document.querySelector("#formulario");
const tareas = document.querySelector("#tareas");
const total = document.querySelector("#total");
const completadas = document.querySelector("#completadas");
let task = [];

/* EVENTOS */
(() => {
    formulario.addEventListener('submit', validarFormulario);
    tareas.addEventListener("click", eliminarTarea);
    tareas.addEventListener("click", completarTarea);
    document.addEventListener("DOMContentLoaded", () => {
        let datosLS = JSON.parse(localStorage.getItem("tareas")) || [];
        task = datosLS;
        agregarHTML();
    });
})();

/* FUNCIONES */
function validarFormulario(e) {
    e.preventDefault();
    const tareaInput = document.querySelector("#tarea");
    const prioridadInput = document.querySelector("#prioridad");

    const tarea = tareaInput.value;
    const prioridad = prioridadInput.value;

    if (tarea.trim().length === 0) {
        console.log('Campo de tarea vacío');
        return;
    }

    const objTarea = { id: Date.now(), tarea, prioridad, estado: false };
    task = [...task, objTarea];
    formulario.reset();

    agregarHTML();
}

function agregarHTML() {
    while (tareas.firstChild) {
        tareas.removeChild(tareas.firstChild);
    }

    const tasksByPriority = {
        alta: [],
        media: [],
        baja: [],
    };

    if (task.length > 0) {
        task.forEach(item => {
            if (item.prioridad === "alta") {
                tasksByPriority.alta.push(item);
            } else if (item.prioridad === "media") {
                tasksByPriority.media.push(item);
            } else if (item.prioridad === "baja") {
                tasksByPriority.baja.push(item);
            }
        });

        const orderedTasks = [
            ...tasksByPriority.alta,
            ...tasksByPriority.media,
            ...tasksByPriority.baja,
        ];

        orderedTasks.forEach(item => {
            const elemento = document.createElement('div');
            elemento.classList.add('item-tarea');
            elemento.innerHTML = `
                <p class="${item.prioridad} ${item.estado ? 'completa' : ''}">${item.tarea}</p>
                <div class="botones">
                    <button class="eliminar" data-id="${item.id}">x</button>
                    <button class="completada" data-id="${item.id}">?</button>
                </div>
            `;
            tareas.appendChild(elemento);
        });
    } else {
        const mensaje = document.createElement("h5");
        mensaje.textContent = "~SIN TAREAS~"
        tareas.appendChild(mensaje)
    }

    let totalTareas = task.length;
    let tareasCompletas = task.filter(item => item.estado === true).length;

    total.textContent = `Total tareas: ${totalTareas}`;
    completadas.textContent = `Tareas Completadas: ${tareasCompletas}`;

    localStorage.setItem("tareas", JSON.stringify(task));
}



function eliminarTarea(e) {
    if (e.target.classList.contains("eliminar")) {
        const tareaID = Number(e.target.getAttribute("data-id"));
        const nuevasTareas = task.filter((item) => item.id !== tareaID);
        task = nuevasTareas;
        agregarHTML();
    }
}

function completarTarea(e) {
    if (e.target.classList.contains("completada")) {
        const tareaID = Number(e.target.getAttribute("data-id"));
        const nuevasTareas = task.map(item => {
            if (item.id === tareaID) {
                item.estado = !item.estado;
                return item;
            } else {
                return item;
            }
        });

        task = nuevasTareas;
        agregarHTML();
    }
}

const ordenarBtn = document.querySelector("#ordenarBtn");
ordenarBtn.addEventListener("click", () => {
    const tareasCompletadas = task.filter(item => item.estado === true);
    const tareasPendientes = task.filter(item => item.estado === false);
    task = [...tareasPendientes, ...tareasCompletadas];
    agregarHTML();
});