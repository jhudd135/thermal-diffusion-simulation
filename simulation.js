import { Canvas } from "./canvas.js";

export class Subject {
    constructor(width, height, duration) {
        this.width = width;
        this.height = height;
        this.duration = duration;
    }
    get mpp() {return Canvas.CANVAS.width * 0.8 / this.width;}
    draw(t) {
        const nP = (7/9) * t / this.duration;
        const tlc = [0.1 * Canvas.CANVAS.width, 0.1 * Canvas.CANVAS.width];
        const sideLengths = [this.mpp * this.width, this.mpp * this.height]
        Canvas.CANVAS.drawRect(tlc, sideLengths);
        const grad = Canvas.CANVAS.context.createLinearGradient(tlc[0], tlc[1] - 0.4 * sideLengths[1], tlc[0], tlc[1] + 1.4 * sideLengths[1]);
        grad.addColorStop(nP + (2/9), "#0000FF");
        grad.addColorStop(nP, "#FF0000");
        Canvas.CANVAS.fillRect(tlc, sideLengths, grad);
    }
    startSim() {
        const start = performance.now();
        const interval = setInterval(() => {
            const delta = (performance.now() - start) / 1000;
            this.draw(delta);
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