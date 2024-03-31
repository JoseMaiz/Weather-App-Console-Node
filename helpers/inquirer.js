const inquirer = require("inquirer");
const colors = require("colors");
// const { validate } = require("uuid");

const preguntas = [

    {
        type: "list",
        name: "opcion",
        message: "¿Que deseas hacer?",
        choices: [
            {
                value: 1,
                name: `${"1.".green} Buscar ciudad`
            },
            {
                value: 2,
                name: `${"2.".green} historial`
            },
            {
                value: 0,
                name: `${"0.".green} Salir`
            },
        ]
    }
];

const inquirerMenu = async ()=>{
    console.clear();
    console.log("==========================".green);
    console.log("  Seleccione uns opcion".white);
    console.log("==========================\n".green);
    
    const {opcion} = await inquirer.prompt(preguntas);
    return opcion;
}

const inquirerPausa = async ()=>{
    const question = [
        {
            type: "input",
            name: "pausa",
            message: `Presione ${"ENTER".green} para continuar\n`,
        }
    ]
    console.log("\n");
    await inquirer.prompt(question);
}

const leerInput = async (message)=>{
    const question =[
        {
            type: "input",
            name: "desc",
            message,
            validate(value){
                if(value.length === 0){
                    return "Por favor ingrese un valor";
                }
                return true;
            }

        }
    ];
    const {desc} = await inquirer.prompt(question);
    return desc;
}

const listarLugares = async (lugares=[])=>{
    const choices = lugares.map( (lugar,i) =>{
        const idx = colors.green(i+1);
        return{
            value: lugar.id,
            name: `${idx}. ${lugar.nombre}`
        }
    });

    choices.unshift({
        value: "0",
        name: `${"0".green} Cancelar`,
    });
    const preguntas = [
        {
            type: "list",
            name: "id",
            message: "Seleccione lugar:",
            choices
        }
    ];

    const {id} = await inquirer.prompt(preguntas);
    return id;
}


const confirmar = async (message) =>{
    const question = [
        {
            type: "confirm",
            name: "ok",
            message,
        }
    ]
    const {ok} = await inquirer.prompt(question);//*El valor que me regresa la question de type "confirm" es booleano
    return ok
}

const mostrarListadoChecklist = async (tareas=[])=>{
    const choices = tareas.map( (tarea,i) =>{
        const idx = colors.green(i+1);
        return{
            value: tarea.id,
            name: `${idx}. ${tarea.desc}`,
            checked: (tarea.completadoEn) ? true : false,
        }
    });

    const pregunta = [
        {
            type: "checkbox",
            name: "ids",
            message: "Selecciones",
            choices
        }
    ];

    const {ids} = await inquirer.prompt(pregunta);
    return ids;
}

module.exports = {
    inquirerMenu,
    inquirerPausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoChecklist,
}