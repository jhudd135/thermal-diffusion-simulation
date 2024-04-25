import { callE, feaSimUpdate } from "./events.js";

export class Sim {
    a = 127; // thermal diffusivity of gold
    length = 50; // mm
    width = 50; // mm
    lnodes = 20;
    wnodes = 20;
    time = 0; // seconds
    d_temp = 100; // default number larger than cutoff
    dd_temp = 100; // default number larger than cutoff
    dataResolution = 0.01; // seconds
    lastDataReport = 0; // seconds
    constructor(w, l, a, initT, heaterT, maxNodes, heaterType) { // w and l in cm
        this.width = w * 10;
        this.length = l * 10;
        this.a = a;
        this.initT = initT;
        this.heaterT = heaterT;
        this.lnodes = maxNodes;
        this.wnodes = maxNodes;
        this.heaterType = heaterType;
    }
    init() {
        //calculate dx, dy, and dt
        if (this.length < this.width) { // width is greater, use it to determine node size
            this.dx = this.width / this.wnodes; // mm
            this.lnodes = Math.floor(this.length / this.dx); //make square-ish nodes based on 20 nodes wide
            this.dy = this.length / this.lnodes; // mm
        } else { // length is greater, use it to determine node size
            this.dy = this.length / this.lnodes; // mm
            this.wnodes = Math.floor(this.width / this.dy); //make square-ish nodes based on 20 nodes wide
            this.dx = this.width / this.wnodes; // mm
        }
        
        this.dt = Math.min(Math.min(this.dx * this.dx, this.dy * this.dy) / (4 * this.a), 0.1); // seconds

        //initialize matrices
        this.nBM = [...Array(this.lnodes)].map(r => [...Array(this.wnodes)].map(v => false));
        
        //set heater tiles according to heatertype
        switch (this.heaterType) {
            case "whole":
                this.nBM[0] = this.nBM[0].map((v, i) => true);
                break;
            case "half": 
                const lower = Math.floor(0.25 * this.wnodes);
                const upper = Math.floor(0.75 * this.wnodes);
                this.nBM[0] = this.nBM[0].map((v, i) => lower < i && i < upper);
                break;
            case "center":
                this.nBM[0][Math.floor(this.wnodes / 2)] = true;
                this.nBM[0][Math.floor((this.wnodes - 1) / 2)] = true;
                break;
        }
        
        this.nTM = [...Array(this.lnodes)].map((r, i) => [...Array(this.wnodes)].map((v, j) => this.nBM[i][j] ? this.heaterT : this.initT));
    }
    static boundGet(cp, i, j) {
        if (i < 0) {i = 0;}
        if (cp.length <= i) {i = cp.length - 1;}
        if (j < 0) {j = 0;}
        if (cp[i].length <= j) {j = cp[i].length - 1;}
        return cp[i][j];
    }
    sim(t, finish = false) {
        const bG = Sim.boundGet;
        while ((this.time < t || finish) && !this.equilibrium) {
            let d_temp = 0;
            const cp = this.nTM.map(r => r.map(v => v));
            for (let i = 0; i < cp.length; i++) {
                for (let j = 0; j < cp[i].length; j++) {
                    if (this.nBM[i][j]) {
                        continue;
                    }
                    const dd_x = (bG(cp, i, j - 1) + bG(cp, i, j + 1) - 2 * cp[i][j]) / (this.dx * this.dx);
                    const dd_y = (bG(cp, i - 1, j) + bG(cp, i + 1, j) - 2 * cp[i][j]) / (this.dy * this.dy);
                    const dij = this.dt * this.a * (dd_x + dd_y);
                    this.nTM[i][j] = dij + cp[i][j];

                    d_temp += Math.pow(this.heaterT - this.nTM[i][j], 2);
                }
            }
            // this.dd_temp = Math.abs(this.d_temp - d_temp) / (this.a * this.dt);
            // console.log(this.dd_temp);
            this.d_temp = d_temp;
            this.time += this.dt;
            if (this.dataResolution < this.time - this.lastDataReport) {
                callE(feaSimUpdate, {nTM: this.nTM.map(r => r.map(v => v)), time: this.time});
                this.lastDataReport = this.time;
            }
        }
    }
    get equilibrium() {
        return this.d_temp < 1;
    }
}