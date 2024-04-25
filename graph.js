import { subject } from "./controls.js";
import { Canvas, processCanvas } from "./canvas.js";
import { callE, registerE, simulationFrameUpdate, controlsReset, feaSimUpdate } from "./events.js";
import { interpolateRGB } from "./rgb.js";

export function graphInit() {
    let focusTile;

    const tempDisplay = document.getElementById("tempDisplay");
    const GRAPH = processCanvas(document.getElementById("graph"));

    let dataPoints = [];

    registerE(feaSimUpdate, "trackTileTemp", (args) => {
        if (focusTile) {
            const temp = Math.round(args.nTM[focusTile.i][focusTile.j] * 100) / 100;
            if (args.time != 0) {dataPoints.push({t: Math.round(args.time * 100) / 100, v: temp});}
        }
    });

    registerE(simulationFrameUpdate, "drawGraph", (args) => {
        GRAPH.cleanCanvas();
        if (2 < dataPoints.length) {
            const tStart = dataPoints[0].t
            const tEnd = dataPoints[dataPoints.length - 1].t;
            const tRange = tEnd - tStart
            const pps = GRAPH.width / tRange;
            const ppd = GRAPH.height / subject.sim.heaterT;

            tempDisplay.value = dataPoints[dataPoints.length - 1].v;

            // graph
            for (let i = 0; i < dataPoints.length - 1; i++) {
                const cp = dataPoints[i];
                const np = dataPoints[i + 1];
                const rgb = interpolateRGB("#0000FF", "#FF0000", (cp.v - subject.sim.initT) / (subject.sim.heaterT - subject.sim.initT));
                GRAPH.drawLine([cp.t * pps, GRAPH.height - cp.v * ppd], [np.t * pps, GRAPH.height - np.v * ppd], rgb);
            }
            // legend
            GRAPH.drawText([100, 15], "1 second");
            GRAPH.drawLine([100, 20], [pps + 100, 20]);
            GRAPH.drawText([100, 35], "10 °C");
            GRAPH.drawLine([100, 40], [100, 40 + ppd * 10]);
            // axes
            const timeD = Math.max(5, Math.floor(tRange / 10));
            const timeTicks = Math.ceil(tRange / timeD);
            for (let i = 0; i < timeTicks; i++) {
                const tx = i * timeD * pps;
                GRAPH.drawLine([tx, GRAPH.height], [tx, GRAPH.height - 10])
                GRAPH.drawText([tx + 5, GRAPH.height - 10], i * timeD)
            }
            const tempD = 10;
            const tempTicks = Math.ceil(subject.sim.heaterT / tempD);
            for (let i = 0; i < tempTicks; i++) {
                const ty = GRAPH.height - i * tempD * ppd;
                GRAPH.drawLine([0, ty], [5, ty]);
                GRAPH.drawText([10, ty], i * tempD);
            }
        }
    });

    registerE(controlsReset, "clearData", () => {
        dataPoints = [];
    });

    Canvas.CANVAS.canvas.onclick = () => {
        if (subject.sim.time == 0) {
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
        }
    };
}