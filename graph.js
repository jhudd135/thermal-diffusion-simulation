import { subject } from "./controls.js";
import { Canvas } from "./canvas.js";
import { callE, registerE, simulationFrameUpdate } from "./events.js";

export function graphInit() {
    let focusTile;

    const tempDisplay = document.getElementById("tempDisplay");

    let dataPoints = [];

    registerE(simulationFrameUpdate, "trackTileTemp", (args) => {
        if (focusTile) {
            const temp = Math.round(subject.getTileTemp(focusTile) * 100) / 100;
            tempDisplay.value = temp;
            dataPoints.push({t:args.time, v:temp});
        }
    });


    Canvas.CANVAS.canvas.onclick = () => {
        const pos = Canvas.CANVAS.getMousePos();
        if (pos) {
            const tile = subject.getTile(pos);
            if (tile) {
                if (focusTile) {
                    focusTile.setSelected(false);
                }
                focusTile = tile;
                focusTile.setSelected(true);
                callE(simulationFrameUpdate, {time: subject.sim.time});
            }
        }
    };
}