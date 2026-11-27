import { notifyTerminal, terminal } from "@/lib/terminal/state";

/**
 * Procedural hangar sound, synthesised with Web Audio. No files. Off by default; the AudioContext is
 * created on the first click that turns it on and suspended whenever the tab is hidden or sound is off.
 *
 *  room     brown noise through a 220 Hz low-pass: the hangar air
 *  turbine  55 / 110 Hz sines, frequency-modulated, plus a narrow 1.6 kHz noise whine;
 *           level follows the airframe section and scroll speed
 *  click    3 ms noise burst through a 2.4 kHz band-pass on every mode change
 */

interface Graph {
    ctx: AudioContext;
    master: GainNode;
    turbine: GainNode;
    whine: GainNode;
    fm: OscillatorNode;
    clickBuf: AudioBuffer;
}

let graph: Graph | null = null;
let raf = 0;

function noiseBuffer(ctx: AudioContext, seconds: number, brown: boolean) {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    let seed = 2024;
    for (let i = 0; i < len; i++) {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        const white = seed / 2147483648 - 1;
        if (brown) {
            // leaky integrator: −6 dB/octave
            last = (last + 0.02 * white) / 1.02;
            d[i] = last * 3.5;
        } else d[i] = white;
    }
    return buf;
}

function build(): Graph {
    const ctx = new AudioContext({ latencyHint: "playback" });
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    const room = ctx.createBufferSource();
    room.buffer = noiseBuffer(ctx, 4, true);
    room.loop = true;
    const roomLp = ctx.createBiquadFilter();
    roomLp.type = "lowpass";
    roomLp.frequency.value = 220;
    const roomGain = ctx.createGain();
    roomGain.gain.value = 0.55;
    room.connect(roomLp).connect(roomGain).connect(master);
    room.start();

    const turbine = ctx.createGain();
    turbine.gain.value = 0;
    turbine.connect(master);
    const fm = ctx.createOscillator();
    fm.frequency.value = 3.1;
    const fmDepth = ctx.createGain();
    fmDepth.gain.value = 1.4;
    fm.connect(fmDepth);
    for (const [f, detune, g] of [
        [55, -3, 0.5],
        [110, 3, 0.28],
    ] as const) {
        const o = ctx.createOscillator();
        o.type = "sine";
        o.frequency.value = f;
        o.detune.value = detune;
        fmDepth.connect(o.frequency);
        const og = ctx.createGain();
        og.gain.value = g;
        o.connect(og).connect(turbine);
        o.start();
    }
    fm.start();

    const whineSrc = ctx.createBufferSource();
    whineSrc.buffer = noiseBuffer(ctx, 2, false);
    whineSrc.loop = true;
    const whineBp = ctx.createBiquadFilter();
    whineBp.type = "bandpass";
    whineBp.frequency.value = 1600;
    whineBp.Q.value = 18;
    const whine = ctx.createGain();
    whine.gain.value = 0;
    whineSrc.connect(whineBp).connect(whine).connect(master);
    whineSrc.start();

    return { ctx, master, turbine, whine, fm, clickBuf: noiseBuffer(ctx, 0.003, false) };
}

function loop() {
    raf = requestAnimationFrame(loop);
    const g = graph;
    if (!g || document.hidden) return;
    const t = g.ctx.currentTime;
    // Airframe section (index 1) is loudest; scroll speed spins it up.
    const sectionLevel = terminal.section === 1 ? 1 : terminal.section === 0 ? 0.35 : 0.15;
    const speed = Math.min(1, Math.abs(terminal.velocity) / 2500);
    const level = Math.min(1, sectionLevel * 0.7 + speed * 0.5);
    g.turbine.gain.setTargetAtTime(0.06 + 0.22 * level, t, 0.25);
    g.whine.gain.setTargetAtTime(0.004 + 0.02 * level, t, 0.25);
    g.fm.frequency.setTargetAtTime(3 + 9 * level, t, 0.4);
}

const onVisibility = () => {
    if (!graph) return;
    if (document.hidden) void graph.ctx.suspend();
    else if (terminal.sound) void graph.ctx.resume();
};

export function setSound(on: boolean) {
    if (typeof window === "undefined") return;
    terminal.sound = on;
    notifyTerminal();
    if (on) {
        if (!graph) {
            graph = build();
            document.addEventListener("visibilitychange", onVisibility);
        }
        void graph.ctx.resume();
        graph.master.gain.setTargetAtTime(0.5, graph.ctx.currentTime, 0.4);
        if (!raf) raf = requestAnimationFrame(loop);
    } else if (graph) {
        const g = graph;
        g.master.gain.setTargetAtTime(0, g.ctx.currentTime, 0.15);
        cancelAnimationFrame(raf);
        raf = 0;
        window.setTimeout(() => {
            if (!terminal.sound) void g.ctx.suspend();
        }, 600);
    }
}

/** Mechanical click for mode changes. Silent unless sound is on. */
export function click() {
    const g = graph;
    if (!g || !terminal.sound || g.ctx.state !== "running") return;
    const src = g.ctx.createBufferSource();
    src.buffer = g.clickBuf;
    const bp = g.ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 2400;
    bp.Q.value = 2;
    const gain = g.ctx.createGain();
    gain.gain.value = 0.9;
    src.connect(bp).connect(gain).connect(g.ctx.destination);
    src.start();
}
