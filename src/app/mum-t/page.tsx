import type { Metadata } from "next";
import { MumTContent } from "@/components/mum-t/MumTContent";

export const metadata: Metadata = {
    title: "MUM-T | Tactical Data Link - KAAN",
    description:
        "Manned-Unmanned Teaming simulation: KAAN 5th-gen fighter coordinating with ANKA-3 UCAV wingmen via encrypted tactical data link.",
    authors: [
        { name: "Mehmet Gümüş", url: "https://github.com/SpaceEngineerSS" },
    ],
};

export default function MumTPage() {
    return <MumTContent />;
}
