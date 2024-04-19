import { subject } from "./controls.js";
import { Canvas } from "./canvas.js";

function getTile() {
    const pos = Canvas.CANVAS.getMousePos();
    if (pos) {
        const tile = subject.getTile(pos);
        if (tile) {
            const temp = subject.getNodeTemp(tile[0], tile[1]);
            console.log(tile, temp);
        }
    }
}

export function graphInit() {
    Canvas.CANVAS.canvas.onclick = getTile;
}