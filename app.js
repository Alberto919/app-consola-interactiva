require('colors');
const { inquirerMenu, pausa, leerInput, listadoTareasBorrar, confirmar, mostraListadoCheckList } = require('./helpers/inquirer');
const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const Tareas = require('./models/tareas');

const main = async () => {

    let opt = '';
    const tareas = new Tareas();
    const tareasDB = leerDB();

    if (tareasDB) {
        // Cargar las tareas
        tareas.cargarTareasFromArray(tareasDB);
    }

    do {
        //Imprime el menú
        opt = await inquirerMenu();

        switch (opt) {
            case '1':
                //crear opcion
                const desc = await leerInput('Descripcion: ')
                tareas.crearTarea(desc);
                break;
            case '2':
                tareas.listadoCompleto();
                break;
            case '3':
                // listar completadas
                tareas.listarPendientesCompletadas();
                break;
            case '4':
                // listar pendientes
                tareas.listarPendientesCompletadas(false);
                break;
            case '5':
                // completadas / pendiente
                const ids = await mostraListadoCheckList(tareas.listadoArr);
                tareas.toggleCompletadas(ids);
                break;
            case '6':
                // borrar tarea
                const id = await listadoTareasBorrar(tareas.listadoArr);
                if (id != '0') {
                    const ok = await confirmar('¿Estas seguro?')
                    if (ok) {
                        tareas.borrarTarea(id);
                        console.log("\n");
                        console.log('Tarea Borrada')
                    }
                }
                break;
        }

        guardarDB(tareas.listadoArr);

        await pausa();

    } while (opt !== '0');

    //pausa();
}

main();