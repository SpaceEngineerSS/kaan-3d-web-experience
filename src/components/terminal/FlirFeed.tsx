"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
    v_uv = a_pos * 0.5 + 0.5;
    gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

// Luminance → white-hot grayscale with crushed blacks, sensor noise, faint scanlines, slight vignette.
const FRAG = `
precision mediump float;
uniform sampler2D u_tex;
uniform float u_time;
uniform vec2 u_res;
varying vec2 v_uv;
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main() {
    vec3 c = texture2D(u_tex, v_uv).rgb;
    float l = dot(c, vec3(0.299, 0.587, 0.114));
    l = smoothstep(0.16, 0.9, l);
    l = pow(l, 1.2);
    vec2 px = floor(v_uv * u_res);
    float n = hash(px + fract(u_time * 7.13) * vec2(113.0, 271.0)) - 0.5;
    l += n * 0.075;
    l *= 0.95 + 0.05 * sin(v_uv.y * u_res.y * 1.4);
    vec2 d = v_uv - 0.5;
    l *= 1.0 - dot(d, d) * 1.05;
    gl_FragColor = vec4(vec3(clamp(l, 0.0, 1.0)), 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
    const sh = gl.createShader(type);
    if (!sh) return null;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        gl.deleteShader(sh);
        return null;
    }
    return sh;
}

const pad = (n: number) => String(n).padStart(2, "0");

interface Props {
    src: string;
    still: string;
    stillAlt: string;
    label: string;
    caption: string;
    reducedMotion: boolean;
}

/**
 * P0 chase footage through a FLIR-style white-hot filter: a small raw WebGL canvas fed by a hidden
 * <video>. Plays only while on screen; reduced motion (or no WebGL) shows a grayscale still.
 */
export function FlirFeed({ src, still, stillAlt, label, caption, reducedMotion }: Props) {
    const box = useRef<HTMLDivElement>(null);
    const canvas = useRef<HTMLCanvasElement>(null);
    const video = useRef<HTMLVideoElement>(null);
    const tc = useRef<HTMLSpanElement>(null);
    const [failed, setFailed] = useState(false);
    const useStill = reducedMotion || failed;

    useEffect(() => {
        if (useStill) return;
        const cv = canvas.current;
        const vid = video.current;
        const el = box.current;
        if (!cv || !vid || !el) return;
        const gl = cv.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false, preserveDrawingBuffer: false });
        if (!gl) {
            queueMicrotask(() => setFailed(true));
            return;
        }
        const vs = compile(gl, gl.VERTEX_SHADER, VERT);
        const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
        const prog = gl.createProgram();
        if (!vs || !fs || !prog) {
            queueMicrotask(() => setFailed(true));
            return;
        }
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);
        gl.useProgram(prog);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, "a_pos");
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));

        const uTime = gl.getUniformLocation(prog, "u_time");
        const uRes = gl.getUniformLocation(prog, "u_res");
        gl.uniform1i(gl.getUniformLocation(prog, "u_tex"), 0);

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            cv.width = Math.max(1, Math.round(cv.clientWidth * dpr));
            cv.height = Math.max(1, Math.round(cv.clientHeight * dpr));
            gl.viewport(0, 0, cv.width, cv.height);
            gl.uniform2f(uRes, cv.width, cv.height);
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(cv);

        let raf = 0;
        let visible = false;
        const t0 = performance.now();
        const frame = (now: number) => {
            raf = 0;
            if (!visible || document.hidden) return;
            raf = requestAnimationFrame(frame);
            if (vid.readyState >= 2) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, vid);
            gl.uniform1f(uTime, (now - t0) / 1000);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            if (tc.current) {
                const t = vid.currentTime;
                tc.current.textContent = `${pad(Math.floor(t / 3600))}:${pad(Math.floor(t / 60) % 60)}:${pad(Math.floor(t) % 60)}:${pad(Math.floor((t % 1) * 25))}`;
            }
        };
        const start = () => {
            if (!visible || document.hidden) return;
            vid.play().catch(() => {});
            if (!raf) raf = requestAnimationFrame(frame);
        };
        const stop = () => {
            vid.pause();
            if (raf) cancelAnimationFrame(raf);
            raf = 0;
        };
        const io = new IntersectionObserver(([e]) => {
            visible = e.isIntersecting;
            if (visible) start();
            else stop();
        });
        io.observe(el);
        const onVis = () => (document.hidden ? stop() : start());
        document.addEventListener("visibilitychange", onVis);

        return () => {
            stop();
            io.disconnect();
            ro.disconnect();
            document.removeEventListener("visibilitychange", onVis);
            vid.removeAttribute("src");
            vid.load();
            gl.deleteTexture(tex);
            gl.deleteBuffer(buf);
            gl.deleteProgram(prog);
            gl.deleteShader(vs);
            gl.deleteShader(fs);
            gl.getExtension("WEBGL_lose_context")?.loseContext();
        };
    }, [useStill]);

    return (
        <figure className="m-0">
            <div ref={box} className="relative aspect-video w-full overflow-hidden border border-edge-2 bg-ink">
                {useStill ? (
                    <Image src={still} alt={stillAlt} fill sizes="(min-width: 768px) 32rem, 100vw" className="object-cover contrast-125 grayscale" />
                ) : (
                    <>
                        <video ref={video} src={src} muted playsInline loop preload="auto" aria-hidden className="pointer-events-none absolute h-px w-px opacity-0" />
                        <canvas ref={canvas} role="img" aria-label={label} className="absolute inset-0 h-full w-full" />
                    </>
                )}
                {/* Symbology: track box crosshair and corner readouts */}
                <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 160 90" preserveAspectRatio="none" fill="none">
                    <g stroke="rgba(236,239,244,0.8)" strokeWidth={1} vectorEffect="non-scaling-stroke">
                        <path d="M68 37V35H72M88 35H92V37M92 53V55H88M72 55H68V53" vectorEffect="non-scaling-stroke" />
                        <path d="M80 41V43.5M80 46.5V49M76 45H78.5M81.5 45H84" vectorEffect="non-scaling-stroke" />
                        <path d="M0 45H6M154 45H160M80 0V4M80 86V90" vectorEffect="non-scaling-stroke" stroke="rgba(236,239,244,0.4)" />
                    </g>
                </svg>
                <div className="t-tele pointer-events-none absolute inset-x-2 top-1.5 flex justify-between text-fg">
                    <span>FLIR // WHT-HOT</span>
                    <span ref={tc}>00:00:00:00</span>
                </div>
                <div className="t-tele pointer-events-none absolute inset-x-2 bottom-1.5 flex justify-between text-fg-2">
                    <span>TRK · AUTO</span>
                    <span>NFOV</span>
                </div>
            </div>
            <figcaption className="t-tele mt-2">{caption}</figcaption>
        </figure>
    );
}
