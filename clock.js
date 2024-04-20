import { registerE, simulationFrameUpdate } from "./events.js";

export function clockInit() {
    const clock = document.getElementById("clock");
    registerE(simulationFrameUpdate, "updateClock", (args) => {
        clock.value = Math.round(args.time * 100) / 100;
    });
}