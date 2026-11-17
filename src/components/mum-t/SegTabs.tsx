"use client";

import { useRef, type KeyboardEvent } from "react";

interface SegTabsProps<T extends string> {
    /** Prefix for tab and panel ids: tabs are `${idPrefix}-tab-${id}`, the panel is `${idPrefix}-panel`. */
    idPrefix: string;
    label: string;
    items: { id: T; label: string }[];
    value: T;
    onChange: (id: T) => void;
    className?: string;
}

/** A segmented tablist with arrow-key navigation. Pair it with one element carrying role="tabpanel". */
export function SegTabs<T extends string>({ idPrefix, label, items, value, onChange, className = "" }: SegTabsProps<T>) {
    const refs = useRef<(HTMLButtonElement | null)[]>([]);

    const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
        const i = items.findIndex((it) => it.id === value);
        let next = -1;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % items.length;
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + items.length) % items.length;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = items.length - 1;
        if (next < 0) return;
        e.preventDefault();
        onChange(items[next].id);
        refs.current[next]?.focus();
    };

    return (
        <div role="tablist" aria-label={label} className={`seg flex-wrap ${className}`} onKeyDown={onKey}>
            {items.map((it, i) => (
                <button
                    key={it.id}
                    ref={(el) => {
                        refs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`${idPrefix}-tab-${it.id}`}
                    aria-selected={value === it.id}
                    aria-controls={`${idPrefix}-panel`}
                    tabIndex={value === it.id ? 0 : -1}
                    onClick={() => onChange(it.id)}
                    className="pointer-coarse:min-h-11!"
                >
                    {it.label}
                </button>
            ))}
        </div>
    );
}
