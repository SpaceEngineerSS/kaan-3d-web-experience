import Link from "next/link";

export default function NotFound() {
    return (
        <main id="main" className="flex min-h-[100svh] items-end pb-[12vh]">
            <div className="wrap grid gap-10 md:grid-cols-12">
                <div className="md:col-span-7">
                    <p className="t-label">404</p>
                    <h1 className="t-display mt-4">Sayfa bulunamadı</h1>
                    <p className="t-lede mt-6 max-w-[44ch]">
                        Aradığınız adres bu sitede yok. Bağlantı eskimiş ya da yanlış yazılmış olabilir.
                    </p>
                    <p className="t-body mt-2 max-w-[44ch] text-muted" lang="en">
                        Page not found. The link may be out of date or mistyped.
                    </p>
                    <Link href="/" className="btn mt-10">
                        <span aria-hidden>←</span> Ana sayfa / Home
                    </Link>
                </div>
            </div>
        </main>
    );
}
