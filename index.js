import { canvasInit, Canvas} from "./canvas.js";
import { createSubject, Subject } from "./simulation.js";
import { controlsInit } from "./controls.js";

export function init() {
    canvasInit();
    controlsInit();
    Canvas.CANVAS.borderCanvas();    
}