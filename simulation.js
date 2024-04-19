import { Canvas } from "./canvas.js";
import { setClock } from "./clock.js";
import { callE, simulationEquilibrium } from "./events.js";
import { Sim } from "./fea.js";

function interpolate(a, b, n) { // min, max, normal
    return a + (b - a) * n
}
function HEXtoRGB(str) {
    str = str.substring(1)
    const result = [];
    for (let i = 0; i < 6; i+=2) {
        result.push(parseInt(str.substr(i, 2), 16))
    }
    return result;
}
function RGBtoHEX(rgb) {
    let result = "#";
    rgb.forEach(c => {
        result += Math.floor(c).toString(16).padStart(2, "0");
    });
    return result;
}

function interpolateRGB(min, max, n) {
    return RGBtoHEX(HEXtoRGB(min).map((c, i) => interpolate(c, HEXtoRGB(max)[i], n)))
}

export class Subject {
    constructor(width, length, diffusivity, initialTemperature, heaterTemperature) {
        this.sim = new Sim(width, length, diffusivity, initialTemperature, heaterTemperature);
        this.sim.init();
    }
    get mpp() {return Canvas.CANVAS.width * 0.8 / this.sim.width;}
    draw() {
        const tlc = [0.1 * Canvas.CANVAS.width, 0.1 * Canvas.CANVAS.width];
        const nodeSideLengths = [this.mpp * this.sim.dx, this.mpp * this.sim.dy]

        for (let i = 0; i < this.sim.lnodes; i++) {
            for (let j = 0; j < this.sim.wnodes; j++) {
                const rgb = interpolateRGB("#0000FF", "#FF0000", (this.sim.nTM[i][j] - this.sim.initT) / (this.sim.heaterT - this.sim.initT));
                Canvas.CANVAS.fillRect([tlc[0] + j * nodeSideLengths[0], tlc[1] + i * nodeSideLengths[1]], nodeSideLengths, rgb);
            }
        }
    }
    startSim() {
        const start = performance.now() - this.sim.time * 1000;
        const interval = setInterval(() => {
            const delta = (performance.now() - start) / 1000;
            this.sim.sim(delta);
            this.draw();
            setClock(this.sim.time);
            if (this.sim.equilibrium) {
                this.stopSim();
                callE(simulationEquilibrium);
            }
        }, 1000/10);
        this.interval = interval;
    }
    stopSim() {
        clearInterval(this.interval);
    }
}

export function createSubject(width, length, diffusivity, initialTemperature, heaterTemperature) {
    const subject = new Subject(width, length, diffusivity, initialTemperature, heaterTemperature);
    subject.draw(0);
    return subject;
}