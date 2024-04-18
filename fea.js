
export class Sim {
    a = 127; // thermal diffusivity of gold
    length = 50; // mm
    width = 50; // mm
    lnodes = 20;
    wnodes = 20;
    time = 0; // seconds
    maximum = 100;
    minimum = 20;
    constructor(a) {
        this.a = a;
    }
    init() {
        
        this.nBM = [...Array(this.lnodes)].map(r => [...Array(this.wnodes)].map(v => false));
        this.nBM[0] = this.nBM[0].map((v, i) => 7<i && i<13);

        this.nTM = [...Array(this.lnodes)].map((r, i) => [...Array(this.wnodes)].map((v, j) => this.nBM[i][j] ? 100 : 20));

        this.dx = this.length / this.lnodes; // mm
        this.dy = this.width / this.wnodes; // mm
        this.dt = Math.min(this.dx * this.dx, this.dy * this.dy) / (4 * this.a); // seconds
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
            const cp = this.nTM.map(r => r.map(v => v));
            for (let i = 0; i < cp.length; i++) {
                for (let j = 0; j < cp[i].length; j++) {
                    if (this.nBM[i][j]) {
                        continue;
                    }
                    const dd_x = (bG(cp, i, j - 1) + bG(cp, i, j + 1) - 2 * cp[i][j]) / (this.dx * this.dx);
                    const dd_y = (bG(cp, i - 1, j) + bG(cp, i + 1, j) - 2 * cp[i][j]) / (this.dy * this.dy);
                    this.nTM[i][j] = this.dt * this.a * (dd_x + dd_y) + cp[i][j];
                }
            }
            this.time += this.dt;
        }
    }
}