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

        this.tlc = [0.1 * Canvas.CANVAS.width, 0.1 * Canvas.CANVAS.width];
        this.sl = [this.mpp * this.sim.dx, this.mpp * this.sim.dy];
        this.tM = this.sim.nTM.map((r, i) => r.map((c, j) => new Tile([this.tlc[0] + j * this.sl[0], this.tlc[1] + i * this.sl[1]], this.sl)));
    }
    get mpp() {return Canvas.CANVAS.width * 0.8 / this.sim.width;}
    draw() {
        for (let i = 0; i < this.tM.length; i++) {
            for (let j = 0; j < this.tM[i].length; j++) {
                const rgb = interpolateRGB("#0000FF", "#FF0000", (this.sim.nTM[i][j] - this.sim.initT) / (this.sim.heaterT - this.sim.initT));
                this.tM[i][j].fillT(rgb);
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
    getNodeTemp(j, i) {
        return this.sim.nTM[i][j];
    }
    getTile(pos) {
        const x = pos[0];
        const y = pos[1];
        const brc = [this.tlc[0] + this.sl[0] * this.sim.wnodes, this.tlc[1] + this.sl[1] * this.sim.lnodes];
        if (this.tlc[0] < x && x < brc[0] && this.tlc[1] < y && y < brc[1]) {
            return [Math.floor((x - this.tlc[0]) / this.sl[0]), Math.floor((y - this.tlc[1]) / this.sl[1])];
        }
        return null;
    }
}

class Tile {
    constructor(tlc, sl) {
        this.tlc = tlc;
        this.sl = sl;
    }
    fillT(color) {
        Canvas.CANVAS.fillRect(this.tlc, this.sl, color);
    }
}

export function createSubject(width, length, diffusivity, initialTemperature, heaterTemperature) {
    const subject = new Subject(width, length, diffusivity, initialTemperature, heaterTemperature);
    subject.draw(0);
    return subject;
}