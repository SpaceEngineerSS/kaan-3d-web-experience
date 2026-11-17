"use client";
/* eslint-disable react-hooks/immutability -- three.js objects and the shared scroll source are mutated imperatively by design (render loop, not React state). */

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useLanguage } from "@/context/LanguageContext";
import { useDeviceProfile } from "@/hooks/useDeviceProfile";
import { visorCopy } from "@/content/flight";
import { HelmetDisplay } from "./HelmetDisplay";
import type { ScrollSource } from "./FlightScene";

const FlightScene = dynamic(() => import("./FlightScene").then((m) => m.FlightScene), { ssr: false });

/** Scroll track length, in viewport heights. */
const TRACK_VH = 560;

/**
 * Chapter 02: the climb-out seen through the TULGAR visor. A pinned full-screen 3D scene scrubbed by scroll;
 * the helmet symbology reads the aircraft's live state. Text beats pass over it.
 */
export function FlightExperience() {
    const { locale } = useLanguage();
    const c = visorCopy[locale];
    const profile = useDeviceProfile();
    const section = useRef<HTMLElement>(null);
    const scroll = useMemo<ScrollSource>(() => ({ target: 0 }), []);
    const visor = useRef(0);
    const [near, setNear] = useState(false);
    const [inView, setInView] = useState(false);
    const [tabVisible, setTabVisible] = useState(true);

    useEffect(() => {
        const el = section.current;
        if (!el) return;
        const update = () => {
            const r = el.getBoundingClientRect();
            const span = r.height - window.innerHeight;
            scroll.target = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
        };
        update();
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        // Mount the scene a screen early so shaders compile before it is seen.
        const pre = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "100% 0px" });
        const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
        pre.observe(el);
        io.observe(el);
        const onVis = () => setTabVisible(!document.hidden);
        document.addEventListener("visibilitychange", onVis);
        return () => {
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
            pre.disconnect();
            io.disconnect();
            document.removeEventListener("visibilitychange", onVis);
        };
    }, [scroll]);

    const active = inView && tabVisible;
    const show3d = profile.ready && profile.tier > 0 && !profile.reducedMotion;

    return (
        <section ref={section} id="visor" aria-labelledby="visor-title" className="relative bg-ink" style={{ height: `${TRACK_VH}svh` }}>
            <div className="sticky top-0 h-[100svh] overflow-hidden">
                {show3d && near ? (
                    <FlightScene profile={profile} scroll={scroll} active={active} onPov={(on) => (visor.current = on ? 1 : 0)} />
                ) : (
                    // Reduced motion or no WebGL: a still from the real footage.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src="/media/clips/wide.jpg" alt="" className="h-full w-full object-cover" />
                )}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink to-transparent" />
                {show3d && <HelmetDisplay visor={visor} vfov={58} active={active && near} label={c.hmdLabel} />}

                <header className="absolute inset-x-0 top-0 z-10 pt-24">
                    <div className="wrap flex items-baseline gap-4">
                        <span className="t-data text-sm text-hmd">{c.index}</span>
                        <h2 id="visor-title" className="t-h3 text-[clamp(1.25rem,1rem+1vw,1.9rem)]">
                            {c.title}
                        </h2>
                    </div>
                </header>
                <p className="absolute inset-x-0 bottom-5 z-10 mx-auto max-w-2xl px-6 text-center text-[0.75rem] leading-snug text-fg-2/85">{c.note}</p>
            </div>

            {c.beats.map((b) => (
                <article key={b.id} aria-labelledby={`${b.id}-t`} className="absolute inset-x-0 z-10" style={{ top: `${b.at * (TRACK_VH - 100)}svh` }}>
                    <div className="wrap flex min-h-[100svh] items-center">
                        <div className={`plate w-full max-w-md p-6 sm:p-7 ${b.side === "right" ? "ml-auto" : ""}`}>
                            <p className="t-label text-hmd">{b.label}</p>
                            <h3 id={`${b.id}-t`} className="t-h3 mt-3 text-[clamp(1.6rem,1.2rem+1.4vw,2.4rem)] leading-[0.95]">
                                {b.title}
                            </h3>
                            <p className="t-body mt-4 text-[0.9375rem]">{b.body}</p>
                            {b.facts && (
                                <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-edge pt-4">
                                    {b.facts.map((f) => (
                                        <div key={f.k}>
                                            <dt className="t-label text-[0.6875rem]">{f.k}</dt>
                                            <dd className="t-data mt-1 text-[0.8125rem] text-fg">{f.v}</dd>
                                        </div>
                                    ))}
                                </dl>
                            )}
                        </div>
                    </div>
                </article>
            ))}
        </section>
    );
}
