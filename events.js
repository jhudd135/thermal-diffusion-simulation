export const simulationEquilibrium = "simulation_equilibrium";
export const controlsPlay = "controls_play";
export const controlsPause = "controls_pause";

const events = {};

export function callE(ev, args = null) {
    Object.keys(events[ev]).forEach(ln => {
        events[ev][ln](args);
    });
}

export function registerE(ev, name, callback) {
    if (!(ev in events)) {
        events[ev] = {};
    }
    events[ev][name] = callback;
}

export function deregisterE(ev, name) {
    if (ev in events && name in events[ev]) {
        delete events[ev][name];
        if (!events[ev]) {
            delete events[ev];
        }
        return true;
    }
    return false;
}

