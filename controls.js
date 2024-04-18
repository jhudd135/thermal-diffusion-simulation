import { createSubject } from "./simulation.js";

// function calculateTime() {
//     let mass = parseFloat(document.getElementById("mass").value);
//     let specific_heat_capacity = parseFloat(document.getElementById("specific_heat_capacity").value);
//     let heater_temperature = parseFloat(document.getElementById("heater_temperature").value);
//     let material_starting_temperature = parseFloat(document.getElementById("material_starting_temperature").value);
//     let material_height = parseFloat(document.getElementById("material_height").value);
//     let material_width = parseFloat(document.getElementById("material_width").value);
//     let material_length = parseFloat(document.getElementById("material_length").value);
//     let thermal_conductivity = parseFloat(document.getElementById("thermal_conductivity").value);

//     if (!isNaN(mass) && !isNaN(specific_heat_capacity) && !isNaN(heater_temperature) && !isNaN(material_starting_temperature) && !isNaN(material_height) && !isNaN(material_width) && !isNaN(material_length) && !isNaN(thermal_conductivity)) {
//         let totalTime = 40 * ((mass * specific_heat_capacity * (heater_temperature - material_starting_temperature)) / (thermal_conductivity * ((heater_temperature - material_starting_temperature) / material_length)));
//         document.getElementById("result").innerText = "Total time for all tasks: " + totalTime + " seconds";
//         return {m: mass, shc: specific_heat_capacity, ht: heater_temperature, mst: material_starting_temperature, h: material_height, w: material_width, l: material_length, tc: thermal_conductivity, t: totalTime};
//     } else {
//         document.getElementById("result").innerText = "Please enter valid numbers for all tasks.";
//     }
// }

export function controlsInit() {
    const calculate = document.getElementById("calculateButton");
    calculate.onclick = calculateTime;

    const start = document.getElementById("startButton");
    start.onclick = () => {
        const heater_temperature = parseFloat(document.getElementById("heater_temperature").value);
        const material_starting_temperature = parseFloat(document.getElementById("material_starting_temperature").value);
        const material_width = parseFloat(document.getElementById("material_width").value);
        const material_length = parseFloat(document.getElementById("material_length").value);
        const thermal_diffusivity = parseFloat(document.getElementById("thermal_diffusivity").value);

        const result = {ht: heater_temperature, mst: material_starting_temperature, w: material_width, l: material_length, td: thermal_diffusivity}
        
        const subject = createSubject(result.w, result.l, result.td, result.mst, result.ht);
        subject.startSim();
    };
}

// document.getElementById("materialSelect").addEventListener("change", function() {
//     var materialSelect = document.getElementById("materialSelect");
//     var thermalDiffusivityInput = document.getElementById("thermal_diffusivity");

//     var selectedMaterial = materialSelect.value;
//     alert("HELLO")
//     // Assign thermal diffusivity based on selected material
//     switch (selectedMaterial) {
//         case "copper":
//             thermalDiffusivityInput.value = 0.0000098; // Thermal diffusivity for copper
//             break;
//         case "aluminum":
//             thermalDiffusivityInput.value = 0.0000097; // Thermal diffusivity for aluminum
//             break;
//         case "steel":
//             thermalDiffusivityInput.value = 0.0000048; // Thermal diffusivity for steel
//             break;
//         // Add cases for more materials as needed
//         default:
//             thermalDiffusivityInput.value = ""; // Default value if material not found
//     }
//     alert(thermalDiffusivityInput.value);
// });