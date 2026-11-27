#!/usr/bin/env node
/**
 * Visual and performance capture over the Chrome DevTools Protocol. No dependencies:
 * Node 22+ (global WebSocket) and a local Chrome or Edge.
 *
 *   npm run build && npx next start -p 3210
 *   node scripts/capture.mjs http://localhost:3210                 # full matrix -> docs/perf/<label>/
 *   node scripts/capture.mjs http://localhost:3210 --label v5      # names the report
 *   node scripts/capture.mjs http://localhost:3210 --readme        # README shots -> docs/images/
 *   node scripts/capture.mjs http://localhost:3210 --only s02      # shots whose name contains "s02"
 *
 * Each shot records: average FPS over 3 s, renderer counters from window.__kaanStats (the page is
 * loaded with ?stats), horizontal overflow, and how many text blocks / leader labels are visible.
 */
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const args = process.argv.slice(2);
const flag = (name) => {
    const i = args.indexOf(name);
    return i >= 0 ? (args[i + 1] ?? true) : undefined;
};
const BASE = args.find((a) => /^https?:/.test(a)) ?? "http://localhost:3210";
const README = args.includes("--readme");
const LABEL = flag("--label") ?? "baseline";
const ONLY = flag("--only");
const OUT = README ? "docs/images" : join("docs/perf", LABEL);
const CHROME =
    process.env.CHROME ??
    (process.platform === "win32"
        ? "C:/Program Files/Google/Chrome/Application/chrome.exe"
        : process.platform === "darwin"
          ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
          : "google-chrome");

const WIDTHS = [
    { w: 1440, h: 900 },
    { w: 768, h: 1024, mobile: true },
    { w: 390, h: 844, mobile: true },
];
const SECTIONS = ["s01", "s02", "s03", "s04", "s05"];
const MODES = ["airframe", "xray", "aero", "eoir"];

function matrix() {
    const shots = [];
    for (const v of WIDTHS) {
        for (const id of SECTIONS) shots.push({ name: `${id}-${v.w}`, path: "/", scrollTo: `#${id}`, at: 0.5, ...v });
        shots.push({ name: `mum-t-${v.w}`, path: "/mum-t", ...v });
        shots.push({ name: `kaynaklar-${v.w}`, path: "/kaynaklar", ...v });
    }
    for (const m of MODES) {
        shots.push({ name: `mode-${m}-1440`, path: "/", scrollTo: "#s02", at: 0.5, mode: m, ...WIDTHS[0] });
        shots.push({ name: `mode-${m}-390`, path: "/", scrollTo: "#s02", at: 0.5, mode: m, ...WIDTHS[2] });
    }
    return shots;
}

const README_SHOTS = [
    { name: "s01", path: "/", w: 1440, h: 900 },
    { name: "s02", path: "/", w: 1440, h: 900, scrollTo: "#s02", at: 0.5 },
    { name: "s03", path: "/", w: 1440, h: 900, scrollTo: "#s03", at: 0.5 },
    { name: "s04", path: "/", w: 1440, h: 900, scrollTo: "#s04", at: 0.5 },
    { name: "s05", path: "/", w: 1440, h: 900, scrollTo: "#s05", at: 0.05 },
    { name: "mobile", path: "/", w: 390, h: 844, mobile: true },
];

let SHOTS = README ? README_SHOTS : matrix();
if (typeof ONLY === "string") SHOTS = SHOTS.filter((s) => s.name.includes(ONLY));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const port = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn(
    CHROME,
    [
        "--headless=new",
        `--remote-debugging-port=${port}`,
        `--user-data-dir=${join(tmpdir(), "kaan-capture-" + port)}`,
        "--hide-scrollbars",
        "--ignore-gpu-blocklist",
        "--enable-gpu-rasterization",
        "--use-angle=default",
        "--autoplay-policy=no-user-gesture-required",
        "about:blank",
    ],
    { stdio: "ignore" }
);

let targets;
for (let i = 0; i < 60 && !targets; i++) {
    try {
        targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
    } catch {
        await sleep(250);
    }
}
const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let seq = 0;
const waiting = new Map();
const consoleErrors = [];
ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && waiting.has(d.id)) {
        waiting.get(d.id)(d.result ?? d.error);
        waiting.delete(d.id);
    } else if (d.method === "Runtime.exceptionThrown") {
        consoleErrors.push(d.params.exceptionDetails?.exception?.description ?? d.params.exceptionDetails?.text);
    } else if (d.method === "Runtime.consoleAPICalled" && d.params.type === "error") {
        consoleErrors.push(d.params.args.map((a) => a.value ?? a.description).join(" "));
    }
};
const send = (method, params = {}) =>
    new Promise((r) => {
        const id = ++seq;
        waiting.set(id, r);
        ws.send(JSON.stringify({ id, method, params }));
    });
const evaluate = async (expression) => (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true }))?.result?.value;

await send("Page.enable");
await send("Runtime.enable");
mkdirSync(OUT, { recursive: true });

/** Runs in the page: FPS over `ms`, renderer counters, overflow and on-screen text density. */
const PROBE = (ms) => `(async () => {
  let n = 0; const t0 = performance.now();
  await new Promise((done) => { const f = (t) => { n++; if (t - t0 < ${ms}) requestAnimationFrame(f); else done(); }; requestAnimationFrame(f); });
  const fps = Math.round((n * 1000) / (performance.now() - t0));
  const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && cs.visibility !== "hidden" && Number(cs.opacity) > 0.05; };
  const blocks = [...document.querySelectorAll("[data-read]")].filter(vis).length;
  const labels = [...document.querySelectorAll("svg [data-slot]")].filter((el) => el.style.display !== "none" && Number(el.style.opacity || 1) > 0.05).length;
  return { fps, stats: window.__kaanStats ? { ...window.__kaanStats } : null,
    overflow: document.documentElement.scrollWidth > innerWidth, blocks, labels };
})()`;

const report = [];
let lastKey = "";
for (const s of SHOTS) {
    await send("Emulation.setDeviceMetricsOverride", { width: s.w, height: s.h, deviceScaleFactor: s.mobile ? 2 : 1, mobile: !!s.mobile });
    const key = `${s.path}|${s.w}`;
    const url = `${BASE}${s.path}?stats${s.mode ? `&mode=${s.mode}` : ""}`;
    if (key !== lastKey || s.mode) {
        await send("Page.navigate", { url });
        await sleep(1200);
        await evaluate(`localStorage.setItem("kaan-notice-v2","1"); 1`);
        await send("Page.navigate", { url });
        await sleep(4000);
        lastKey = s.mode ? "" : key;
    }
    if (s.scrollTo) {
        // Step down so lazy parts mount, then settle at `at` (0..1) of the target's scroll span.
        await evaluate(`(async () => { const t = document.querySelector(${JSON.stringify(s.scrollTo)}); if (!t) return -1;
          const top = t.getBoundingClientRect().top + scrollY; const span = Math.max(0, t.offsetHeight - innerHeight);
          const y = top + span * ${s.at ?? 0};
          const from = scrollY; const step = y > from ? 500 : -500;
          for (let p = from; step > 0 ? p < y : p > y; p += step) { scrollTo(0, p); await new Promise(r => setTimeout(r, 90)); }
          scrollTo(0, y); return y; })()`);
    } else {
        await evaluate(`scrollTo(0, 0); 1`);
    }
    await sleep(2200);
    const probe = (await evaluate(PROBE(3000))) ?? {};
    const r = await send("Page.captureScreenshot", { format: "png" });
    const file = join(OUT, `${s.name}.png`);
    writeFileSync(file, Buffer.from(r.data, "base64"));
    report.push({ name: s.name, path: s.path, width: s.w, mode: s.mode ?? null, ...probe });
    const st = probe.stats;
    console.log(
        `${file}  fps=${probe.fps ?? "?"}${st ? ` calls=${st.calls} tris=${st.triangles} pts=${st.points} geo=${st.geometries} tex=${st.textures}` : ""}${probe.overflow ? "  OVERFLOW" : ""}  blocks=${probe.blocks} labels=${probe.labels}`
    );
}

if (!README) {
    const out = join("docs/perf", `${LABEL}.json`);
    writeFileSync(out, JSON.stringify({ base: BASE, date: new Date().toISOString(), consoleErrors, shots: report }, null, 2) + "\n");
    console.log(out);
}
if (consoleErrors.length) console.log(`console errors: ${consoleErrors.length}\n  ${consoleErrors.slice(0, 5).join("\n  ")}`);

ws.close();
chrome.kill();
process.exit(0);
