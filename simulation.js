import { Canvas } from "./canvas.js";
import { callE, registerE, simulationEquilibrium, simulationFrameUpdate } from "./events.js";
import { Sim } from "./fea.js";
import { interpolateRGB } from "./rgb.js";


export class Subject {
    constructor(width, length, diffusivity, initialTemperature, heaterTemperature, heaterType) {
        this.sim = new Sim(width, length, diffusivity, initialTemperature, heaterTemperature, 30, heaterType);
        this.sim.init();

        this.tlc = [0.1 * Canvas.CANVAS.width, 0.1 * Canvas.CANVAS.width];
        this.sl = [this.ppm * this.sim.dx, this.ppm * this.sim.dy];
        this.tM = this.sim.nTM.map((r, i) => r.map((c, j) => new Tile(i, j)));

        registerE(simulationFrameUpdate, "drawCall", () => {this.draw();});
    }
    get ppm() {return Math.min(Canvas.CANVAS.width * 0.8 / this.sim.width, Canvas.CANVAS.height * 0.8 / this.sim.length);}
    draw() {
        Canvas.CANVAS.cleanCanvas();
        const last = [];
        for (let i = 0; i < this.tM.length; i++) {
            for (let j = 0; j < this.tM[i].length; j++) {
                const rgb = interpolateRGB("#0000FF", "#FF0000", (this.sim.nTM[i][j] - this.sim.initT) / (this.sim.heaterT - this.sim.initT));
                const tile = this.tM[i][j];
                tile.fillT(this.tlc, this.sl, rgb);
                if (tile.selected) {
                    last.push(tile);
                } 
            }
        }
        last.forEach(t => {
            t.borderT(this.tlc, this.sl, "#22FF22");
        })
    }
    startSim(speed) {
        const offset = this.sim.time;
        const start = performance.now();
        const interval = setInterval(() => {
            const delta = (performance.now() - start) * speed / 1000 + offset;
            this.sim.sim(delta);
            callE(simulationFrameUpdate, {time: this.sim.time});
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
    finishSim() {
        this.stopSim();
        this.sim.sim(0, true);
        callE(simulationFrameUpdate, {time: this.sim.time});
        callE(simulationEquilibrium);
    }
    getTileTemp(tile) {
        return this.sim.nTM[tile.i][tile.j];
    }
    getTile(pos) {
        const x = pos[0];
        const y = pos[1];
        const brc = [this.tlc[0] + this.sl[0] * this.sim.wnodes, this.tlc[1] + this.sl[1] * this.sim.lnodes];
        if (this.tlc[0] < x && x < brc[0] && this.tlc[1] < y && y < brc[1]) {
            const pos = [Math.floor((x - this.tlc[0]) / this.sl[0]), Math.floor((y - this.tlc[1]) / this.sl[1])];
            return this.tM[pos[1]][pos[0]];
        }
        return null;
    }
}

class Tile {
    constructor(i, j) {
        this.i = i;
        this.j = j;
        this.selected = false;
    }
    setSelected(sel) {
        this.selected = sel;
    }
    adjustedTlc(tlc, sl) {
        return [tlc[0] + this.j * sl[0], tlc[1] + this.i * sl[1]];
    }
    fillT(tlc, sl, color) {
        Canvas.CANVAS.fillRect(this.adjustedTlc(tlc, sl), sl, color);
    }
    borderT(tlc, sl, color) {
        Canvas.CANVAS.drawRect(this.adjustedTlc(tlc, sl), sl, color);
    }
}