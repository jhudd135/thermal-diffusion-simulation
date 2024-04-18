
export class Sim {
    a = 127; // thermal diffusivity of gold
    length = 50; // mm
    width = 50; // mm
    lnodes = 20;
    wnodes = 20;
    time = 0; // seconds
    diff = 100; // default number larger than cutoff
    constructor(w, l, a, initT, heaterT) { // w and l in cm
        this.width = w * 10;
        this.length = l * 10;
        this.a = a;
        this.initT = initT;
        this.heaterT = heaterT;
    }
    init() {
        //calculate dx, dy, and dt
        this.dx = this.width / this.wnodes; // mm
        
        //make square-ish nodes based on 20 nodes wide
        this.lnodes = Math.floor(this.length / this.dx)

        this.dy = this.length / this.lnodes; // mm
        this.dt = Math.min(this.dx * this.dx, this.dy * this.dy) / (4 * this.a); // seconds

        //initialize matrices
        this.nBM = [...Array(this.lnodes)].map(r => [...Array(this.wnodes)].map(v => false));
        this.nBM[0] = this.nBM[0].map((v, i) => 7<i && i<13);

        this.nTM = [...Array(this.lnodes)].map((r, i) => [...Array(this.wnodes)].map((v, j) => this.nBM[i][j] ? this.heaterT : this.initT));
    }
    static boundGet(cp, i, j) {
        if (i < 0) {i = 0;}
        if (cp.length <= i) {i = cp.length - 1;}
        if (j < 0) {j = 0;}
        if (cp[i].length <= j) {j = cp[i].length - 1;}
        return cp[i][j];
    }
    sim(t) {
        const bG = Sim.boundGet;
        while (this.time < t) {
            let diff = 0;
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

                    diff += dij;
                }
            }
            this.diff = diff;
            this.time += this.dt;
        }
    }
    get equilibrium() {
        return this.diff < 1;
    }
}