import type { ReactNode } from "react";

interface ChapterProps {
    id: string;
    /** Chapter index, shown as "03". */
    index: number;
    label: string;
    title: ReactNode;
    lede?: ReactNode;
    /** Cover the 3D scene with the page ground. */
    solid?: boolean;
    tight?: boolean;
    className?: string;
    /** Optional element at the right of the header row (controls, a source note). */
    aside?: ReactNode;
    children?: ReactNode;
}

/**
 * Standard chapter: a left rail with the chapter number and label, the title and lede to its right,
 * content below on the full grid. Server component; interactive children opt into the client.
 */
export function Chapter({ id, index, label, title, lede, solid, tight, className = "", aside, children }: ChapterProps) {
    return (
        <section
            id={id}
            aria-labelledby={`${id}-title`}
            className={`chapter ${solid ? "chapter--solid" : ""} ${tight ? "chapter--tight" : ""} ${className}`}
        >
            <div className="wrap">
                <header className="grid gap-6 md:grid-cols-12 md:gap-8">
                    <div className="md:col-span-3 lg:col-span-2">
                        <div className="flex items-baseline gap-3 border-t border-edge pt-3 md:block">
                            <span className="t-data text-sm text-accent">{String(index).padStart(2, "0")}</span>
                            <span className="t-label md:mt-1 md:block">{label}</span>
                        </div>
                    </div>
                    <div className="md:col-span-9 lg:col-span-8">
                        <h2 id={`${id}-title`} className="t-h2 max-w-[18ch]" data-reveal="mask">
                            {title}
                        </h2>
                        {lede && (
                            <p className="t-lede mt-6 max-w-[58ch]" data-reveal>
                                {lede}
                            </p>
                        )}
                    </div>
                    {aside && <div className="md:col-span-12 lg:col-span-2 lg:self-end">{aside}</div>}
                </header>
                {children && <div className="mt-12 md:mt-16">{children}</div>}
            </div>
        </section>
    );
}

/** Small "Source:" line under a figure or table. */
export function SourceNote({ children }: { children: ReactNode }) {
    return <p className="mt-4 text-[0.8125rem] leading-relaxed text-faint">{children}</p>;
}
