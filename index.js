import { canvasInit, Canvas} from "./canvas.js";
import { createSubject, Subject } from "./simulation.js";
import { controlsInit } from "./controls.js";
import { clockInit } from "./clock.js";

export function init() {
    canvasInit();
    controlsInit();
    Canvas.CANVAS.borderCanvas();
    clockInit();
}