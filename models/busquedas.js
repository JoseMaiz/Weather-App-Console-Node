const fs = require("fs");
const axios = require('axios');

class Busquedas{
    historial = [];
    dbPath = "./db/database.json"

    constructor(){
        this.leerDB();
    }
    get historialCapitalizado(){
        return this.historial.map(lugar =>{
            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));
            return palabras.join(' ');
        })
    }

    get paramsMapbox(){
        return {
            " access_token": process.env.MAPBOX_KEY,
             "limit" : 5,
             "language" : "es"
        }
    }


    async ciudad(lugar=""){

        try {
            //peticion http

            const intance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            });
            const resp = await intance.get()
            
            return resp.data.features.map(lugar =>({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));//Regresara un arreglo todos los lugares que coincidan con "lugar" con sus debido datos
            
        } catch (error) {
            return [];
        }     
    }

    async climaLugar(lat,lon){
        try {
            const intance2 = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather` ,
                params: {
                    lat,
                    lon,
                    "appid": process.env.OPENWEATHER_KEY,
                    "units": "metric",
                    "lang": "es",
                },//*Nota: esto se puede simplificar con un get y a ese get se le manda lat y lon y el get tendra todos los otros parametros. ej: {...this.paramsWeather,lat,lon}.
            })

            const resp2 = await intance2.get()
            
            return {
                desc: resp2.data.weather[0].description,
                min: resp2.data.main.temp_min,
                max: resp2.data.main.temp_max, 
                temp: resp2.data.main.temp,
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial(lugar = ""){
        //TODO: Prevenir duplicados
        if(this.historial.includes(lugar.toLocaleLowerCase() )){
            return;
        }
        this.historial = this.historial.splice(0,5);

        this.historial.unshift(lugar.toLocaleLowerCase());

        //Grabar DB
        this.guardarDB();
    }

    guardarDB(){
        const payload = {
            historial: this.historial,
        };
        fs.writeFileSync(this.dbPath,JSON.stringify(payload));
    }

    leerDB(){
        if(!fs.existsSync(this.dbPath)){
            return;
        }

        const info = fs.readFileSync(this.dbPath,{encoding:"utf-8"});
        const data = JSON.parse(info);
        this.historial = data.historial;

    }

}


module.exports = Busquedas;
