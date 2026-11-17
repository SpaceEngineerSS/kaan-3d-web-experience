#!/usr/bin/env node
/**
 * Screenshots for the README, taken from a running build over the Chrome DevTools Protocol.
 * No dependencies: Node 22+ (global WebSocket) and a local Chrome or Edge.
 *
 *   npm run build && npx next start -p 3210
 *   CHROME="C:/Program Files/Google/Chrome/Application/chrome.exe" node scripts/capture.mjs http://localhost:3210
 */
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const BASE = process.argv[2] ?? "http://localhost:3210";
const OUT = "docs/images";
const CHROME =
    process.env.CHROME ??
    (process.platform === "win32"
        ? "C:/Program Files/Google/Chrome/Application/chrome.exe"
        : process.platform === "darwin"
          ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
          : "google-chrome");

/** name, path, viewport, what to do before the shot */
const SHOTS = [
    { name: "hero", path: "/", w: 1440, h: 900 },
    { name: "specs", path: "/", w: 1440, h: 900, scrollTo: "#specs", offset: 380 },
    { name: "cockpit", path: "/", w: 1440, h: 900, scrollTo: "#cockpit", offset: 380, wait: 2500 },
    { name: "mumt", path: "/mum-t", w: 1440, h: 900, wait: 2500 },
    { name: "mobile", path: "/", w: 390, h: 844, mobile: true },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const port = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${join(tmpdir(), "kaan-capture-" + port)}`, "--hide-scrollbars", "about:blank"], { stdio: "ignore" });

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
ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && waiting.has(d.id)) {
        waiting.get(d.id)(d.result);
        waiting.delete(d.id);
    }
};
const send = (method, params = {}) =>
    new Promise((r) => {
        const id = ++seq;
        waiting.set(id, r);
        ws.send(JSON.stringify({ id, method, params }));
    });
const evaluate = (expression) => send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });

await send("Page.enable");
await send("Runtime.enable");
mkdirSync(OUT, { recursive: true });

for (const s of SHOTS) {
    await send("Emulation.setDeviceMetricsOverride", { width: s.w, height: s.h, deviceScaleFactor: s.mobile ? 2 : 1, mobile: !!s.mobile });
    await send("Page.navigate", { url: BASE + s.path });
    await sleep(1500);
    // Hide the one-time notice bar for clean shots.
    await evaluate(`localStorage.setItem("kaan-notice-v2","1"); location.reload(); 1`);
    await sleep(3500);
    if (s.scrollTo) {
        // Step down so lazy chapters mount and reveals fire, then settle on the target.
        await evaluate(`(async () => { const t = document.querySelector(${JSON.stringify(s.scrollTo)}); const y = t.getBoundingClientRect().top + scrollY + (${s.offset ?? 0}) - 72; for (let p = 0; p < y; p += 600) { scrollTo(0, p); await new Promise(r => setTimeout(r, 120)); } scrollTo(0, y); return y; })()`);
    }
    await sleep(s.wait ?? 1600);
    const r = await send("Page.captureScreenshot", { format: "png" });
    writeFileSync(join(OUT, `${s.name}.png`), Buffer.from(r.data, "base64"));
    console.log(`${OUT}/${s.name}.png`);
}

ws.close();
chrome.kill();
process.exit(0);
