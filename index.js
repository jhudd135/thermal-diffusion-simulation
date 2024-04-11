import { canvasInit, Canvas} from "./canvas.js";
import { createSubject, Subject } from "./simulation.js";

export function init() {
    canvasInit();
    Canvas.CANVAS.borderCanvas();

    const s = createSubject(30, 50, 7);
    s.startSim();

    
}