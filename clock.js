let clock;
export function clockInit() {
    clock = document.getElementById("clock");
}

export function setClock(time) {
    clock.value = Math.round(time * 100) / 100;
}