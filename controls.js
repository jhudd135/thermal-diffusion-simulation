import { createSubject } from "./simulation.js";
import materialJSON from "./materials.json" with {type: "json"};
import { setClock } from "./clock.js";

export function controlsInit() {

    const materialSelect = document.getElementById("materialSelect");
    const setSim = document.getElementById("setSimButton");
    const toggleSim = document.getElementById("toggleSimButton");

    const heater_temperature = document.getElementById("heater_temperature");
    const material_starting_temperature = document.getElementById("material_starting_temperature");
    const material_width = document.getElementById("material_width");
    const material_length = document.getElementById("material_length");
    const thermal_diffusivity = document.getElementById("thermal_diffusivity");

    Object.keys(materialJSON.materials).forEach((m, i) => {
        const option = document.createElement("option");
        option.value = m;
        option.innerText = m.substring(0, 1).toUpperCase() + m.substring(1);
        materialSelect.appendChild(option);
        if (i == 0) {
            thermal_diffusivity.value = materialJSON.materials[m].diffusivity;
        }
    });

    materialSelect.onchange = () => {
        thermal_diffusivity.value = materialJSON.materials[materialSelect.value].diffusivity;
    }
    
    let subject;

    const start_s_f = () => {
        subject.startSim();
        toggleSim.innerText = "Pause Simulation";
    }
    const stop_s_f = () => {
        subject.stopSim();
        toggleSim.innerText = "Play Simulation";
    }
    setSim.onclick = () => {
        const result = {
            ht: parseFloat(heater_temperature.value), 
            mst: parseFloat(material_starting_temperature.value), 
            w: parseFloat(material_width.value), 
            l: parseFloat(material_length.value), 
            td: parseFloat(thermal_diffusivity.value)
        };
        if (subject) {stop_s_f();}
        subject = createSubject(result.w, result.l, result.td, result.mst, result.ht);
        setClock(0);
    };

    const simRunning = () => toggleSim.innerText == "Pause Simulation";
    toggleSim.onclick = () => {
        if (!simRunning()) {
            start_s_f();
        } else {
            stop_s_f();
        }
    };


}