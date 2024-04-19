import { canvasInit, Canvas} from "./canvas.js";
import { createSubject, Subject } from "./simulation.js";
import { controlsInit } from "./controls.js";
import { clockInit } from "./clock.js";
import { mouseInit } from "./mouse.js";
import { graphInit } from "./graph.js";

export function init() {
    canvasInit();
    controlsInit();
    Canvas.CANVAS.borderCanvas();
    clockInit();
    mouseInit();
    graphInit();
}