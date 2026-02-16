# KAAN - 5. Nesil Savas Ucagi Interaktif Web Deneyimi

<p align="center">
  <img src="public/og-image.png" alt="KAAN 5th Generation Fighter" width="100%"/>
</p>

> **YASAL UYARI (LEGAL DISCLAIMER)**
> Bu proje, **Mehmet Gumus (SpaceEngineerSS)** tarafindan gelistirilmis kar amaci gutmeyen bir **FAN-MADE (Hayran Yapimi)** calismasidir.
>
> 1. Bu web sitesi **TUSAS (Turk Havacilik ve Uzay Sanayii)** ile resmi bir baga sahip degildir.
> 2. "KAAN" ismi, tasarimlari ve ilgili tum materyaller TUSAS'in tescilli markasdir.
> 3. Bu proje yalnizca WebGL, Next.js ve 3D animasyon yeteneklerini sergilemek amaciyla uretilmis bir "Konsept Portfolyo" calismasidir.
> 4. Icerikte yer alan gorseller ve videolar, kamuya acik kaynaklardan egitim amacli derlenmistir.
> 5. Projenin herhangi bir ticari amaci **yoktur**.

**Canli Demo:** [kaan-3d-web-experience.vercel.app](https://kaan-3d-web-experience.vercel.app)

---

## Proje Hakkinda

Turkiye'nin 5. nesil milli muharip ucagi KAAN'in modern web teknolojileri ile nasil sunulabilecegine dair bir vizyon projesidir. Gercek zamanli 3D render, post-processing efektleri, kokpit simulasyonu, silah sistemleri, aviyonik mimari diyagrami ve interaktif gorev haritasi gibi ileri duzey ozellikler icerir.

---

## Teknoloji Yigini

| Teknoloji | Kullanim |
|-----------|----------|
| **Next.js 16** | App Router, SSR, Turbopack |
| **React 19** | Hooks, Context API, Dynamic Imports |
| **React Three Fiber** | 3D sahne, STL model render |
| **@react-three/postprocessing** | Bloom, Vignette, Chromatic Aberration |
| **@react-three/drei** | Environment, Stars, Html overlays |
| **Three.js** | WebGL, BufferGeometry, MeshPhysicalMaterial |
| **GSAP** | Scroll animasyonlari, gecisler |
| **Tailwind CSS v4** | Utility-first stil sistemi |
| **TypeScript 5** | Tip guvenli gelistirme |
| **Web Audio API** | Dinamik motor sesi, sonik patlama, SFX |
| **Canvas API** | Kokpit MFD, RCS grafigi, ucus zarfi, gorev haritasi |
| **Lucide React** | Ikon kutuphanesi |

---

## Ozellikler

### 3D Sahne ve Gorsel
- 3D KAAN modeli (STL) -- MeshPhysicalMaterial ile gercekci metal yuzey
- Post-processing: Bloom, Vignette, Chromatic Aberration
- Afterburner partikul sistemi (200 partikul + iz efekti)
- Yildizli gokyuzu arka plani
- X-Ray wireframe modu
- 5 kamera on-ayari (On, Yan, Ust, Arka, Kokpit) -- aninda snap gecis
- Mouse parallax ve scroll-driven rotasyon
- Glow mesh efekti

### Bolumler ve Icerik
- **Scroll Sections** -- Typewriter efekti, radar tarama cizgisi, HUD animasyonlari
- **Teknik Ozellikler** -- 6 spec karti, tiklanabilir detay panelleri, CountUp animasyonu
- **Ucus Zarfi** -- Mach vs irtifa interaktif Canvas grafigi, superseyir bolgesi
- **G-Force Simulatoru** -- 3G/6G/9G butonlari, tunel gorusu, kirmizi ekran, titresim
- **Kokpit Dashboard** -- 4 panelli MFD (Taktik Harita, Durum, HSI, Silah)
- **TULGAR HMD** -- Dunya ilki renkli HMD, interaktif HUD simulasyonu
- **Aviyonik Mimari** -- 9 dugumlu IMA platform diyagrami, tiklanabilir sistemler
- **Teknoloji Detaylari** -- 4 genisletilebilir kart (Stealth, Aviyonik, Itki, Yapi)
- **RCS Analizi** -- Polar radar kesit alani gorsellestirmesi (goreli seviyeler)
- **Silah Sistemleri** -- 7 gorev profili, Stealth/Karma/Beast mod etiketleri
- **Gorev Briefing** -- Taktik harita, 3 animasyonlu gorev rotasi (CAP, Taarruz, SEAD)
- **Karsilastirma Grafigi** -- KAAN vs F-22 vs F-35 radar/spider chart
- **Boyut Karsilastirma** -- KAAN vs F-16/F-35/Su-57/Eurofighter gorsel barlar
- **Loyal Wingman** -- KAAN + KIZILELMA + ANKA-3 ekosistem diyagrami
- **Yerli Motor** -- TF35000 bolumu, Blok 10/20/30 gecis sureci
- **Uretim & Ihracat** -- 250+ ucak hedefi, Endonezya anlasma, program ortaklari
- **Bilgi Kartlari** -- 8 adet "Biliyor muydunuz?" fact card
- **Timeline** -- 2010'dan 2032'ye 11 kilometre tasi
- **Video Briefing** -- Modal video oynatici
- **Fotograf Galerisi** -- Yatay scroll, lightbox, klavye navigasyon
- **Spec Sheet Indirme** -- Tek tikla TXT dosyasi olarak teknik ozellikler

### UX ve Etkilesim
- Gece/Gunduz tema (otomatik saat algilama)
- TR/EN dil destegi (anlik gecis)
- Scroll ilerleme gostergesi (sol kenar, yuzde + bolum isimleri)
- Sag kenar sahne kontrolleri (X-Ray, Kamera)
- Mobil alt navigasyon cubugu
- Boot sekansli yukleme ekrani (BIOS tarzi sistem baslatma)
- Dinamik ses motoru (scroll hizina bagli pitch, sonik patlama)
- Konami kodu Easter egg (afterburner patlamasi)
- Klavye kisayollari modali
- PWA destegi (offline, standalone)
- Erisileblirlik (skip-to-content, focus-visible, ARIA)

---

## Klavye Kisayollari

| Kisayol | Islev |
|---------|-------|
| `N` | Gece/Gunduz modu |
| `M` | Ses ac/kapat |
| `L` | TR/EN dil degistir |
| `X` | X-Ray modu |
| `1-5` | Kamera on-ayarlari |
| `0` | Kamera sifirla |
| `F` | Tam ekran |
| `?` | Kisayollar modali |
| `Esc` | Lightbox / panel kapat |

---

## Kurulum

```bash
git clone https://github.com/SpaceEngineerSS/kaan-3d-web-experience.git
cd kaan-3d-web-experience

npm install

npm run dev
```

[http://localhost:3000](http://localhost:3000) adresini tarayicinizda acin.

---

## Proje Yapisi

```
kaansite/
├── public/
│   ├── models/KAAN/         # 3D STL model
│   ├── gallery/             # 12 galeri gorseli
│   ├── videos/kaan.mp4      # Ucus videosu
│   ├── og-image.png         # Open Graph gorseli
│   ├── manifest.json        # PWA manifest
│   └── cursor.png           # Ozel imlec
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout (meta, fontlar, SEO)
│   │   ├── page.tsx         # Ana sayfa (tum bolumler)
│   │   ├── not-found.tsx    # Ozel 404 sayfasi
│   │   └── globals.css      # Global stiller, animasyonlar
│   ├── components/
│   │   ├── HeroScene.tsx           # 3D Canvas sahne + post-processing
│   │   ├── KaanModel.tsx           # STL model + kamera preset + X-Ray
│   │   ├── AfterburnerEffect.tsx   # Motor partikul sistemi
│   │   ├── ScrollSections.tsx      # GSAP scroll animasyonlari
│   │   ├── SpecsGrid.tsx           # Teknik ozellikler (genisletilebilir)
│   │   ├── FlightEnvelope.tsx      # Ucus zarfi diyagrami
│   │   ├── GForceSimulator.tsx     # G-kuvveti simulasyonu
│   │   ├── TulgarSection.tsx       # TULGAR HMD bolumu
│   │   ├── AvionicsArchitecture.tsx # IMA platform diyagrami
│   │   ├── TechnologyDetails.tsx   # Teknoloji kartlari
│   │   ├── RCSVisualization.tsx    # RCS polar grafigi
│   │   ├── WeaponConfig.tsx        # 7 silah profili
│   │   ├── MissionBriefing.tsx     # Taktik gorev haritasi
│   │   ├── SizeComparison.tsx      # Boyut karsilastirma
│   │   ├── LoyalWingman.tsx        # Ekosistem diyagrami
│   │   ├── EngineSection.tsx       # TF35000 motor bolumu
│   │   ├── ProductionSection.tsx   # Uretim, ihracat, ortaklar
│   │   ├── FactCards.tsx           # Bilgi kartlari
│   │   ├── Timeline.tsx            # Kronoloji (2010-2032)
│   │   ├── VideoBriefing.tsx       # Video oynatici
│   │   ├── TechnicalArchive.tsx    # Fotograf galerisi
│   │   ├── SceneControls.tsx       # X-Ray / Kamera kontrolleri
│   │   ├── ScrollProgress.tsx      # Scroll ilerleme gostergesi
│   │   ├── MobileBottomNav.tsx     # Mobil alt navigasyon
│   │   ├── KonamiOverlay.tsx       # Easter egg efekti
│   │   ├── ShortcutsModal.tsx      # Klavye kisayollari
│   │   ├── SpecSheetDownload.tsx   # TXT spec indirme
│   │   ├── RadarLoader.tsx         # Boot sekansli yukleme
│   │   ├── Navbar.tsx              # Navigasyon + KONSEPT rozeti
│   │   ├── Footer.tsx              # Footer + yasal bildirim
│   │   ├── LegalDisclaimer.tsx     # Giris uyarisi
│   │   ├── ErrorBoundary.tsx       # WebGL hata yonetimi
│   │   ├── CountUp.tsx             # Sayi animasyonu
│   │   ├── GlitchText.tsx          # Glitch efekti
│   │   ├── ServiceWorkerRegistration.tsx # PWA
│   │   └── ui/
│   │       ├── CockpitDashboard.tsx    # 4-panel MFD kokpit
│   │       ├── ComparisonChart.tsx     # Radar/spider grafik
│   │       ├── HUDOverlay.tsx          # HUD nisangah overlay
│   │       └── SoundEngine.tsx         # Web Audio ses sistemi
│   ├── hooks/
│   │   ├── useMouseParallax.ts     # Mouse parallax
│   │   ├── useKeyboardShortcuts.ts # Klavye kisayollari
│   │   └── useKonamiCode.ts        # Konami kodu algilama
│   ├── context/
│   │   ├── LanguageContext.tsx      # TR/EN dil saglayici
│   │   └── ThemeContext.tsx         # Gece/gunduz tema
│   └── lib/
│       └── translations.ts         # Tum ceviriler
└── package.json
```

---

## Komutlar

```bash
npm run dev      # Gelistirme sunucusu (localhost:3000)
npm run build    # Production build (Turbopack)
npm run start    # Production sunucusu
npm run lint     # ESLint kontrolu
```

---

## Fair Use Kapsami

| Ilke | Uygulama |
|------|----------|
| **Amac** | Egitim ve portfolyo, ticari degil |
| **Nitelik** | Orijinal kod + kamusal gorseller |
| **Oran** | Tum kod %100 orijinal, gorseller kamuya acik kaynaklardan |
| **Etki** | TUSAS'in ticari faaliyetlerine zarar vermez |

### Yasal Koruma Katmanlari

1. **Giris Ekrani Uyarisi** -- "RESMI SITE DEGILDIR" bildirimi
2. **Navbar Rozeti** -- "KONSEPT" / "FAN PROJECT" etiketi
3. **Footer Bildirimi** -- TUSAS marka haklari bildirimi

---

## Lisans

Kaynak kodu **MIT Lisansi** altinda sunulmaktadir. Gorsel varliklar, 3D modeller ve "KAAN" markasi TUSAS/TAI'nin mulkiyetindedir ve yalnizca konsept gosterim amaciyla kullanilmistir.

**Non-commercial use only.** Ticari kullanim icin TUSAS'tan ayri izin alinmasi gerekmektedir.

---

<p align="center">
  <strong>Mehmet Gumus</strong> tarafindan gelistirildi<br>
  <a href="https://github.com/SpaceEngineerSS">github.com/SpaceEngineerSS</a>
</p>
