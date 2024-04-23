import { Subject } from "./simulation.js";
import materialJSON from "./materials.json" assert {type: "json"};
import { callE, controlsPause, controlsPlay, controlsReset, registerE, simulationEquilibrium, simulationFrameUpdate } from "./events.js";

export let subject;
export function controlsInit() {

    
    const setSim = document.getElementById("setSimButton");
    const toggleSim = document.getElementById("toggleSimButton");
    const simulationSpeed = document.getElementById("simulationSpeed");
    const simToEnd = document.getElementById("simToEnd");

    const material_select = document.getElementById("material_select");
    const heater_temperature = document.getElementById("heater_temperature");
    const material_starting_temperature = document.getElementById("material_starting_temperature");
    const material_width = document.getElementById("material_width");
    const material_length = document.getElementById("material_length");
    const thermal_diffusivity = document.getElementById("thermal_diffusivity");
    const heater_type = document.getElementById("heater_type");

    Object.keys(materialJSON.materials).forEach((m, i) => {
        const option = document.createElement("option");
        option.value = m;
        option.innerText = m.substring(0, 1).toUpperCase() + m.substring(1);
        material_select.appendChild(option);
        if (i == 0) {
            thermal_diffusivity.value = materialJSON.materials[m].diffusivity;
        }
    });

    material_select.onchange = () => {
        thermal_diffusivity.value = materialJSON.materials[material_select.value].diffusivity;
    }

    simulationSpeed.onchange = () => {
        callE(controlsPause);
    }
    
    setSim.onclick = () => {
        callE(controlsReset);
    };

    toggleSim.onclick = () => {
        if (toggleSim.innerText == "Play Simulation") {
            callE(controlsPlay);
        } else if (toggleSim.innerText == "Pause Simulation") {
            callE(controlsPause);
        } else if (toggleSim.innerText == "Restart Simulation") {
            callE(controlsReset);
        }
    };

    simToEnd.onclick = () => {
        subject.finishSim();
    }

    registerE(controlsPlay, "playSimulation", () => {
        subject.startSim(parseFloat(simulationSpeed.value));
        toggleSim.innerText = "Pause Simulation";
        toggleSim.style.backgroundColor = "#0000FF";
    });
    registerE(controlsPause, "pauseSimulation", () => {
        subject.stopSim();
        toggleSim.innerText = "Play Simulation";
        toggleSim.style.backgroundColor = "#00FF00";
    });
    registerE(controlsReset, "resetSimulation", () => {
        const result = {
            ht: parseFloat(heater_temperature.value), 
            mst: parseFloat(material_starting_temperature.value), 
            w: parseFloat(material_width.value), 
            l: parseFloat(material_length.value), 
            td: parseFloat(thermal_diffusivity.value),
            htype: heater_type.value
        };
        if (subject) {callE(controlsPause);}
        subject = new Subject(result.w, result.l, result.td, result.mst, result.ht, result.htype);
        callE(simulationFrameUpdate, {time: 0});
    });
    registerE(simulationEquilibrium, "setToggleButton", () => {
        toggleSim.innerText = "Restart Simulation";
        toggleSim.style.backgroundColor = "#FF0000";
    });
}