/**
 * TULGAR's 40° × 32° field of view drawn to scale (10 units per degree), with representative colour symbology.
 * Static SVG: the symbology is illustrative, not ASELSAN's format.
 */
const G = "#00E05A";
const R = "#FF3B30";
const Y = "#FFD21F";
const GREY = "#7A7A7A";

export function TulgarFrame({ title }: { title: string }) {
    const hdgTicks = [50, 55, 60, 65, 70, 75, 80];
    const hx = (h: number) => 240 + (h - 65) * 10;

    return (
        <svg viewBox="0 0 520 400" className="block h-auto w-full" role="img" aria-label={title} fontFamily="var(--font-mono)" fontSize="17">
            <rect width="520" height="400" fill="#000" />

            {/* Visor field of view. */}
            <rect x="40" y="20" width="400" height="320" fill="none" stroke={GREY} strokeWidth="1.5" />

            {/* Heading tape. */}
            <line x1="150" y1="58" x2="330" y2="58" stroke={G} strokeWidth="1.5" />
            {hdgTicks.map((h) => (
                <line key={h} x1={hx(h)} y1={58} x2={hx(h)} y2={h % 10 === 0 ? 46 : 51} stroke={G} strokeWidth="1.5" />
            ))}
            <text x={hx(60)} y="40" fill={G} textAnchor="middle">06</text>
            <text x={hx(70)} y="40" fill={G} textAnchor="middle">07</text>
            <path d="M240 62 l-6 10 h12 z" fill={G} />

            {/* Horizon and pitch ladder (pitch about +2.4°). */}
            <path d="M60 204 H205 M275 204 H420" stroke={G} strokeWidth="1.5" />
            <path d="M175 154 H215 M265 154 H305 M175 154 v8 M305 154 v8" stroke={G} strokeWidth="1.5" fill="none" />
            <text x="160" y="160" fill={G} textAnchor="end">5</text>
            <path d="M175 254 H215 M265 254 H305 M175 254 v-8 M305 254 v-8" stroke={G} strokeWidth="1.5" strokeDasharray="8 6" fill="none" />
            <text x="160" y="260" fill={G} textAnchor="end">5</text>

            {/* Flight path marker. */}
            <circle cx="240" cy="200" r="7" fill="none" stroke={G} strokeWidth="2" />
            <path d="M219 200 H233 M247 200 H261 M240 193 V185" stroke={G} strokeWidth="2" />

            {/* Airspeed and altitude. */}
            <rect x="62" y="168" width="62" height="26" fill="none" stroke={G} strokeWidth="1.5" />
            <text x="93" y="187" fill={G} textAnchor="middle">330</text>
            <text x="62" y="222" fill={G}>M 0.81</text>
            <text x="62" y="246" fill={G}>G 1.0</text>
            <rect x="346" y="168" width="80" height="26" fill="none" stroke={G} strokeWidth="1.5" />
            <text x="386" y="187" fill={G} textAnchor="middle">24000</text>

            {/* Hostile target designator with altitude and range. */}
            <rect x="344" y="96" width="26" height="26" fill="none" stroke={R} strokeWidth="2" />
            <path d="M347 115 L357 105 L367 115" fill="none" stroke={R} strokeWidth="2" />
            <text x="378" y="104" fill={R}>31</text>
            <text x="378" y="124" fill={R}>46</text>

            {/* Unidentified track: half quatrefoil. */}
            <path d="M104 124 A6 6 0 0 1 110 118 A6 6 0 0 1 122 118 A6 6 0 0 1 128 124 Z" fill="none" stroke={Y} strokeWidth="2" />
            <text x="116" y="146" fill={Y} textAnchor="middle">35</text>

            {/* Dimensions. */}
            <path d="M40 362 H440 M40 355 V369 M440 355 V369" stroke={GREY} strokeWidth="1.2" />
            <text x="240" y="390" fill={GREY} textAnchor="middle">40°</text>
            <path d="M462 20 V340 M455 20 H469 M455 340 H469" stroke={GREY} strokeWidth="1.2" />
            <text x="476" y="186" fill={GREY}>32°</text>
        </svg>
    );
}
