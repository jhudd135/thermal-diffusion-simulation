import { mouseScreenPos } from "./mouse.js";

/** Encapsulates HTMLCanvasElement. */
export class Canvas {
    get context() {
        return this.canvas.getContext("2d");
    }
    get width() {
        return this.canvas.width;
    }
    get height() {
        return this.canvas.height;
    }
    constructor(canvas) {
        this.canvas = canvas;
    }
    cleanCanvas() {
        this.context.clearRect(0, 0, this.width, this.height);
    }
    drawLine(begin, end, stroke = "black", width = 1) {
        const ctx = this.context;
        if (stroke) {
            ctx.strokeStyle = stroke;
        }
        if (width) {
            ctx.lineWidth = width;
        }
        ctx.beginPath();
        ctx.moveTo(begin[0], begin[1]);
        ctx.lineTo(end[0], end[1]);
        ctx.stroke();
    }
    drawPolygon(points, fill = "black") {
        const ctx = this.context;
        if (fill) {
            ctx.fillStyle = fill;
        }
        ctx.beginPath();
        ctx.moveTo(...points[0]);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(...points[i]);
        }
        ctx.fill();
    }
    drawPolyline(points, stroke = "black") {
        const ctx = this.context;
        if (stroke) {
            ctx.strokeStyle = stroke;
        }
        ctx.beginPath();
        ctx.moveTo(...points[0]);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(...points[i]);
        }
        ctx.stroke();
    }
    fillRect(topLeft, sideLengths, fill = "black") {
        let ver = 0,
            hor = 0;
        if (typeof sideLengths === "number") {
            ver = sideLengths;
            hor = sideLengths;
        } else {
            hor = sideLengths[0];
            ver = sideLengths[1];
        }
        const ctx = this.context;
        ctx.fillStyle = fill;
        ctx.fillRect(...topLeft, hor, ver);
    }
    drawRect(topLeft, sideLengths, stroke = "black", width = 1) {
        let ver = 0,
            hor = 0;
        if (typeof sideLengths === "number") {
            ver = sideLengths;
            hor = sideLengths;
        } else {
            hor = sideLengths[0];
            ver = sideLengths[1];
        }
        this.drawLine(topLeft, [topLeft[0] + hor, topLeft[1]], stroke, width);
        this.drawLine(topLeft, [topLeft[0], topLeft[1] + ver], stroke, width);
        this.drawLine([topLeft[0] + hor, topLeft[1] + ver], [topLeft[0] + hor, topLeft[1]], stroke, width);
        this.drawLine([topLeft[0] + hor, topLeft[1] + ver], [topLeft[0], topLeft[1] + ver], stroke, width);
    }
    drawArc(center, radius, startAngle, endAngle, stroke = "black", width = 1) {
        const ctx = this.context;
        if (stroke) {
            ctx.strokeStyle = stroke;
        }
        if (width) {
            ctx.lineWidth = width;
        }
        ctx.beginPath();
        ctx.ellipse(center[0], center[1], radius, radius, 0, startAngle, endAngle);
        ctx.stroke();
    }
    drawCircle(center, radius, stroke = "black", width = 1) {
        this.drawArc(center, radius, 0, 2 * Math.PI, stroke, width);
    }
    drawText(point, text, font = "10px Arial") {
        const ctx = this.context;
        if (font) {
            ctx.font = font;
        }
        ctx.fillText(text, point[0], point[1]);
    }
    borderCanvas() {
        this.drawRect([0, 0], [this.width, this.height], "black", 2);
    }
    getMousePos() {
        const rect = this.canvas.getBoundingClientRect();
        const pos = [mouseScreenPos[0] - rect.left, mouseScreenPos[1] - rect.top];
        return 0 < pos[0] && pos[0] < this.width && 0 < pos[1] && pos[1] < this.height ? pos : null;
    }
    static CANVAS;
}


export function canvasInit() {
    const htmlCanvas = document.getElementsByTagName("canvas")[0];
    htmlCanvas.width = htmlCanvas.offsetWidth;
    htmlCanvas.height = htmlCanvas.offsetHeight;
    Canvas.CANVAS = new Canvas(htmlCanvas);
}