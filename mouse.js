export const mouseScreenPos = [0, 0];

export function mouseInit() {
    document.onmousemove = (ev) => {
        mouseScreenPos[0] = ev.clientX;
        mouseScreenPos[1] = ev.clientY;
    }
}