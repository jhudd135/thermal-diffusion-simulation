import { Canvas } from "./canvas.js";
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
    constructor(duration) {
        this.duration = duration;
        this.sim = new Sim(127);
        this.sim.init();
    }
    get mpp() {return Canvas.CANVAS.width * 0.8 / this.sim.width;}
    draw() {
        // const nP = (7/9) * t / this.duration;
        const tlc = [0.1 * Canvas.CANVAS.width, 0.1 * Canvas.CANVAS.width];
        const nodeSideLengths = [this.mpp * this.sim.dx, this.mpp * this.sim.dy]
        // Canvas.CANVAS.drawRect(tlc, sideLengths);
        // const grad = Canvas.CANVAS.context.createLinearGradient(tlc[0], tlc[1] - 0.4 * sideLengths[1], tlc[0], tlc[1] + 1.4 * sideLengths[1]);
        // grad.addColorStop(nP + (2/9), "#0000FF");
        // grad.addColorStop(nP, "#FF0000");
        // Canvas.CANVAS.fillRect(tlc, sideLengths, grad);

        for (let i = 0; i < this.sim.lnodes; i++) {
            for (let j = 0; j < this.sim.wnodes; j++) {
                const rgb = interpolateRGB("#0000FF", "#FF0000", (this.sim.nTM[i][j] - this.sim.minimum) / (this.sim.maximum - this.sim.minimum));
                Canvas.CANVAS.fillRect([tlc[0] + j * nodeSideLengths[0], tlc[1] + i * nodeSideLengths[1]], nodeSideLengths, rgb);
            }
        }
    }
    startSim() {
        const start = performance.now();
        const interval = setInterval(() => {
            const delta = (performance.now() - start) / 1000;
            this.sim.sim(delta)
            this.draw();
        }, 1000/10);
        setTimeout(() => {
            clearInterval(interval);
        }, this.duration * 1000 - 20);
    }
}

export function createSubject(width, height, duration) {
    const subject = new Subject(width, height, duration);
    subject.draw(0);
    return subject;
}