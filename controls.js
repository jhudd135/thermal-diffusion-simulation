import { createSubject } from "./simulation.js";
import materialJSON from "./materials.json" with {type: "json"};

export function controlsInit() {

    const materialSelect = document.getElementById("materialSelect");
    const start = document.getElementById("startButton");

    const heater_temperature = document.getElementById("heater_temperature");
    const material_starting_temperature = document.getElementById("material_starting_temperature");
    const material_width = document.getElementById("material_width");
    const material_length = document.getElementById("material_length");
    const thermal_diffusivity = document.getElementById("thermal_diffusivity");

    Object.keys(materialJSON.materials).forEach(m => {
        const option = document.createElement("option");
        option.value = m;
        option.innerText = m.substring(0, 1).toUpperCase() + m.substring(1);
        materialSelect.appendChild(option);
    });

    materialSelect.onchange = () => {
        thermal_diffusivity.value = materialJSON.materials[materialSelect.value].diffusivity;
    }
    
    start.onclick = () => {
        const result = {
            ht: parseFloat(heater_temperature.value), 
            mst: parseFloat(material_starting_temperature.value), 
            w: parseFloat(material_width.value), 
            l: parseFloat(material_length.value), 
            td: parseFloat(thermal_diffusivity.value)
        };
        
        const subject = createSubject(result.w, result.l, result.td, result.mst, result.ht);
        subject.startSim();
    };
}