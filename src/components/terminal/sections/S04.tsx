"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useT } from "@/context/LanguageContext";
import { NODE_PROFILE, s04Copy, type NodeId } from "@/content/terminal";
import { terminal } from "@/lib/terminal/state";
import { useSectionFade } from "@/components/terminal/useSectionFade";


const NODES: NodeId[] = ["kaanNode", "anka1", "anka2", "kizilelma"];
import { Schematic } from "./s04/Schematic";

export function S04() {
    const t = useT();
    const c = t(s04Copy);
    const [selected, setSelected] = useState<NodeId | null>(null);
    const section = useRef<HTMLElement>(null);
    const layer = useRef<HTMLDivElement>(null);
    useSectionFade(section, layer);
    const buttons = useRef<Partial<Record<NodeId, HTMLButtonElement | null>>>({});

    // Keep the node buttons over the projected anchors.
    useEffect(() => {
        const el = section.current;
        const box = layer.current;
        if (!el || !box) return;
        let raf = 0;
        let visible = false;
        const tick = () => {
            raf = 0;
            if (!visible || document.hidden) return;
            raf = requestAnimationFrame(tick);
            const r = box.getBoundingClientRect();
            for (const id of NODES) {
                const b = buttons.current[id];
                if (!b) continue;
                const a = terminal.anchors[id];
                const inside = a && a.visible && a.x > r.left && a.x < r.right && a.y > r.top && a.y < r.bottom;
                if (!inside) {
                    if (b.style.visibility !== "hidden") b.style.visibility = "hidden";
                    continue;
                }
                b.style.visibility = "visible";
                b.style.transform = `translate3d(${(a.x - r.left - 18).toFixed(1)}px, ${(a.y - r.top - 18).toFixed(1)}px, 0)`;
            }
        };
        const start = () => {
            if (!raf && visible && !document.hidden) raf = requestAnimationFrame(tick);
        };
        const io = new IntersectionObserver(([e]) => {
            visible = e.isIntersecting;
            if (visible) start();
            else if (raf) {
                cancelAnimationFrame(raf);
                raf = 0;
            }
        });
        io.observe(el);
        document.addEventListener("visibilitychange", start);
        return () => {
            if (raf) cancelAnimationFrame(raf);
            io.disconnect();
            document.removeEventListener("visibilitychange", start);
        };
    }, []);

    useEffect(() => {
        if (!selected) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [selected]);

    const pick = (id: NodeId) => setSelected((s) => (s === id ? null : id));
    const profileId = selected ? NODE_PROFILE[selected] : null;
    const profile = profileId ? c.profiles[profileId] : null;

    return (
        <section ref={section} id="s04" aria-labelledby="s04-title" className="pointer-events-none relative min-h-[150svh]">
            <div ref={layer} className="relative min-h-[100svh] md:sticky md:top-0 md:h-[100svh]">
                {/* Node buttons, positioned over the scene's anchors each frame */}
                <div>
                    {NODES.map((id) => (
                        <button
                            key={id}
                            ref={(b) => {
                                buttons.current[id] = b;
                            }}
                            type="button"
                            aria-label={`${c.nodes[id]}: ${c.open}`}
                            aria-expanded={selected === id}
                            aria-controls="s04-panel"
                            onClick={() => pick(id)}
                            style={{ visibility: "hidden" }}
                            className={`cross pointer-events-auto absolute left-0 top-0 z-10 h-9 w-9 border ${selected === id ? "border-accent" : "border-transparent hover:border-edge-2"}`}
                        />
                    ))}
                </div>

                <div className="wrap grid min-h-[100svh] grid-cols-12 grid-rows-[auto_1fr_auto] gap-x-6 gap-y-4 pb-14 pt-20 sm:pb-16 md:pt-28 md:h-full md:min-h-0">
                    <header data-keepout data-read className="col-span-12 max-w-[42ch] md:col-span-5">
                        <p className="t-tele mb-3 text-fg-2">{c.index}</p>
                        <h2 id="s04-title" className="t-h2 text-fg">
                            {c.title}
                        </h2>
                        <p className="t-body mt-4 border-t border-edge pt-3 text-[var(--step--1)]">{c.lede}</p>
                    </header>

                    {/* Fallback list of nodes */}
                    <nav aria-label={c.nodesLabel} className="col-span-12 row-start-3 self-end bg-ink/92 md:col-span-4 lg:col-span-3">
                        <p className="t-tele border-b border-edge-2 pb-1.5 text-fg">{c.nodesLabel}</p>
                        <ul className="m-0 list-none p-0">
                            {NODES.map((id, i) => (
                                <li key={id} className="flex items-center justify-between border-b border-edge">
                                    <span className="t-tele text-faint">{String(i + 1).padStart(2, "0")}</span>
                                    <button
                                        type="button"
                                        className="toggle pointer-events-auto"
                                        aria-expanded={selected === id}
                                        aria-controls="s04-panel"
                                        aria-pressed={selected === id}
                                        data-live={selected === id}
                                        onClick={() => pick(id)}
                                    >
                                        {c.nodes[id]}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <Link href="/mum-t" className="t-tele link pointer-events-auto mt-3 inline-block text-fg-2">
                            → {c.link}
                        </Link>
                    </nav>

                    <div id="s04-panel" className="col-span-12 row-start-4 self-end md:row-start-3 md:col-span-7 md:col-start-6 lg:col-span-5 lg:col-start-8" aria-live="polite">
                        {profile && profileId && (
                            <div className="pointer-events-auto border border-edge-2 bg-ink">
                                <div className="flex items-center justify-between border-b border-edge px-3">
                                    <p className="t-tele m-0 py-2 text-fg">
                                        {profile.name} <span className="text-muted">{"// "}{profile.role}</span>
                                    </p>
                                    <button type="button" className="toggle" onClick={() => setSelected(null)}>
                                        {c.close}
                                    </button>
                                </div>
                                {profile.tag && <p className="t-tele m-0 border-b border-edge px-3 py-1.5 normal-case tracking-[0.04em] text-caution">{profile.tag}</p>}
                                <div className="border-b border-edge px-3 py-2">
                                    <Schematic active={profileId} phases={c.phases} ring={c.ring} />
                                </div>
                                <dl className="m-0 px-3">
                                    {profile.rows.map((row) => (
                                        <div key={row.k} className="t-tele flex justify-between gap-4 border-b border-edge py-[5px] last:border-b-0">
                                            <dt>{row.k}</dt>
                                            <dd className="m-0 text-right text-fg-2">{row.v}</dd>
                                        </div>
                                    ))}
                                </dl>
                                <p className="t-tele m-0 border-t border-edge px-3 py-1.5 normal-case tracking-[0.04em] text-faint">{profile.source}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
