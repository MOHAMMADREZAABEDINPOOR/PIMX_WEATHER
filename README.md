<div align="center">

<!-- ============================================================================== -->
<!-- DYNAMIC ANIMATED CAPSULE HEADER                                                -->
<!-- ============================================================================== -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=1,12,24,30&height=220&section=header&text=PIMX_WEATHER&fontSize=42&fontAlignY=35&desc=%E2%9A%A1%20Precision%20Meteorological%20%26%20VSOP87%20Astronomical%20Suite&descFontSize=16&descAlignY=62" alt="PIMX_WEATHER Banner" width="100%" />

<!-- ============================================================================== -->
<!-- ANIMATED TYPING SVG TELEMETRY                                                 -->
<!-- ============================================================================== -->
<a href="https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_WEATHER">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=20&duration=2800&pause=1000&color=00D2FF&center=true&vCenter=true&width=780&lines=Multi-Model+Numerical+Forecasts+(ECMWF%2C+GFS%2C+ICON);Real-Time+VSOP87+Planetary+Traversing+%26+Kepler+Orbits;Animated+Canvas+Solar+Arc+%26+Twilight+Stage+Visualization;Lunar+Age%2C+Synodic+Cycle+%26+Illumination+Geometry;Live+RainViewer+Radar+%26+Interactive+OpenStreetMap+Overlay;Zero-Dependency+Vanilla+JavaScript+Operating+at+60+FPS" alt="Typing SVG" />
</a>

<br/>

<!-- ============================================================================== -->
<!-- BADGES MATRIX                                                                  -->
<!-- ============================================================================== -->
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge&logo=opensourceinitiative)](https://opensource.org/licenses/MIT)
[![JavaScript: ES6+](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Open-Meteo](https://img.shields.io/badge/API-Open--Meteo-007ACC?style=for-the-badge&logo=open-source-initiative&logoColor=white)](https://open-meteo.com/)
[![HTML5 Canvas](https://img.shields.io/badge/Graphics-HTML5_Canvas_60FPS-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://html.spec.whatwg.org/)
[![CSS Grid & Flexbox](https://img.shields.io/badge/Styling-Modern_Glassmorphism-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![Bilingual: EN / FA](https://img.shields.io/badge/Localization-English_%26_Persian-008080?style=for-the-badge)](https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_WEATHER)
[![Read in Persian](https://img.shields.io/badge/مطالعه_به_فارسی-Persian_README-008080?style=for-the-badge)](#persian-documentation)

<p align="center">
  <b>PIMX_WEATHER</b> is an advanced, zero-dependency atmospheric and astrophysics web application engineered in pure Vanilla JavaScript. Harmonizing multi-model numerical weather forecasts (ECMWF, GFS, ICON) with genuine celestial mechanics (VSOP87 planetary trajectories, solar azimuth and elevation arcs, and lunar phase illumination algorithms), PIMX_WEATHER delivers scientific precision with an artistic, responsive glassmorphic interface.
</p>

<!-- ============================================================================== -->
<!-- QUICK NAVIGATION ANCHORS                                                       -->
<!-- ============================================================================== -->
[Project Overview](#-project-overview--scientific-vision) •
[Directory Anatomy](#-exhaustive-directory--file-anatomy) •
[Astrophysics Mathematics](#-astrophysics--orbital-mechanics-mathematics) •
[Forecast Models](#-multi-model-meteorological-engines) •
[In-Depth Features](#-in-depth-functional-capabilities) •
[Quick Start](#-quick-start--local-execution) •
[توضیحات فارسی](#persian-documentation) •
[Roadmap](#-strategic-engineering-roadmap) •
[License](#-license--open-source-attribution)

</div>

---

## ⚡ Project Overview & Scientific Vision

> *"Weather is not merely a single temperature number; it is an intricate thermodynamic dance between solar radiation, planetary rotation, atmospheric pressure gradients, and celestial alignment."*

### Why We Built PIMX_WEATHER
Mainstream commercial weather apps are plagued by three fundamental flaws:
1. **Commercial Bloat & Tracking Scripts**: Commercial weather providers inject dozens of telemetry cookies, heavy tracking beacons, and intrusive advertisements that consume memory and drain battery life.
2. **Opaque Single-Source Forecasting**: Most applications rely on a single, proprietary predictive model that frequently misses micro-climatic shifts and local convective thunderstorms.
3. **Absence of Astronomical Context**: Weather is fundamentally driven by astronomical variables — the sun's elevation angle, the duration of twilight, and lunar gravitational cycles — yet conventional apps omit this data completely.

### The PIMX_WEATHER Solution
**PIMX_WEATHER** re-establishes a clean, scientific, educational platform:
- 🌌 **Astrophysical Mechanics**: Implements genuine equations of orbital motion (VSOP87 approximations) to solve for the solar hour angle, solar zenith, equation of time, and lunar phase geometry directly in client-side code.
- 🌐 **Multi-Model Consensus**: Users can dynamically switch between the European ECMWF, the American NOAA GFS, and the German DWD ICON numerical models to compare forecasts.
- ⚡ **Zero Framework Dependencies**: Zero megabytes of external JavaScript bundles. Built entirely with Vanilla JavaScript, semantic HTML5, and hardware-accelerated CSS animations operating at a consistent 60 FPS.
- 🗺️ **Live Satellite & Rain Radar**: Seamless integration with RainViewer Doppler radar tiles overlaid on OpenStreetMap.

---

## 📂 Exhaustive Directory & File Anatomy

```
d:/code/weather/
│
├── index.html                       # Semantic HTML5 single-page application structure, viewport meta & widget layout
├── app.js                           # Core application engine: API fetching, geolocation, physics calculations & UI rendering
├── i18n.js                          # Exhaustive English & Persian bilingual dictionary (over 740 technical terms mapped)
├── styles.css                       # Primary layout rules, CSS Grid / Flexbox declarations, responsive breakpoints & base styles
├── redesign.css                     # Modern glassmorphic cards, typography polish, neon glow filters & widget themes
├── animations.css                   # Dynamic GPU-accelerated CSS keyframe animations (rainfall, solar rays, cloud drifting)
└── README.md                        # Master comprehensive bilingual documentation
```

---

## 🧮 Astrophysics & Orbital Mechanics Mathematics

PIMX_WEATHER avoids pre-compiled static lookup tables. Instead, it computes astronomical parameters in real time using celestial coordinate geometry:

### 1. Solar Declination ($\delta$) & Equation of Time ($EoT$)
The angular distance of the Sun north or south of the celestial equator:
$$\delta = 23.45^\circ \cdot \sin\left(\frac{360}{365} (284 + N)\right)$$
Where $N$ is the day of the year ($1 \le N \le 365$).

The Equation of Time (discrepancy between apparent solar time and mean solar time):
$$EoT = 9.87 \sin(2B) - 7.53 \cos(B) - 1.5 \sin(B)$$
Where $B = \frac{360}{365} (N - 81)$.

### 2. Solar Hour Angle ($H$) & Solar Altitude ($h$)
$$\sin(h) = \sin(\phi) \sin(\delta) + \cos(\phi) \cos(\delta) \cos(H)$$
Where $\phi$ is the observer's geographic latitude and $H$ is the local hour angle derived from solar noon.

### 3. Atmospheric Refraction Correction ($R$)
Near the horizon, atmospheric refraction bends solar rays, altering apparent sunrise and sunset:
$$R = \frac{1.02}{\tan\left(h + \frac{10.3}{h + 5.11}\right)}$$

### 4. Lunar Phase Geometry & Illumination Fraction ($k$)
The illuminated fraction of the Moon's visible disk:
$$k = \frac{1 + \cos(\psi)}{2}$$
Where $\psi$ is the Earth-Moon-Sun phase angle calculated across the 29.53-day synodic lunar cycle.

---

## 🌐 Multi-Model Meteorological Engines

Users can toggle between the world's most sophisticated numerical weather prediction models:

| Model | Sponsoring Agency | Grid Resolution | Update Frequency | Primary Strength |
| :--- | :--- | :--- | :--- | :--- |
| **ECMWF IFS** | European Centre for Medium-Range Weather Forecasts | ~9 km | 2x Daily | Internationally recognized as the most accurate medium-range atmospheric model. |
| **NOAA GFS** | National Oceanic and Atmospheric Administration (USA) | ~13 km | 4x Daily | Exceptional long-range global pattern tracking and jet stream trajectory modeling. |
| **DWD ICON** | Deutscher Wetterdienst (Germany) | ~7 km | 4x Daily | High-density grid resolution optimal for regional topography and micro-climates. |
| **Best Match Ensemble** | Open-Meteo Machine Learning Blended Pipeline | Dynamic | Hourly | Statistically weights predictions based on localized historical accuracy. |

---

## ⚡ In-Depth Functional Capabilities

### 1. ☀️ Dynamic Solar Arc Visualizer
- Renders an interactive Canvas arc simulating the Sun's daily trajectory from astronomical dawn to dusk.
- Displays exact local times for:
  - **Astronomical Twilight**: Sun is $18^\circ$ below horizon; total darkness begins/ends.
  - **Nautical Twilight**: Sun is $12^\circ$ below horizon; horizon is distinguishable at sea.
  - **Civil Twilight**: Sun is $6^\circ$ below horizon; streetlights activate.
  - **Solar Noon**: The Sun reaches its highest meridian altitude for the day.

### 2. 🌙 Precision Lunar Observation Station
- Calculates lunar age in days (from New Moon to Full Moon).
- Renders SVG lunar illumination states with accurate crater shading.
- Displays moonrise, moonset, and distance from Earth in kilometers.

### 3. 🗺️ Live Doppler Radar & Cloud Cover Map
- Integrates real-time RainViewer Doppler radar feeds.
- Displays interactive playback controls (Play, Pause, Step-forward) visualizing rain precipitation patterns over the preceding 2 hours.

### 4. 📈 Hourly Thermodynamic Trends
- Interactive smooth cubic Bézier charts rendering 24-hour temperature, dewpoint, humidity, UV index, and atmospheric pressure trends.

---

## 🚀 Quick Start & Local Execution

Because PIMX_WEATHER is built in pure Vanilla JavaScript, no heavy build tools, npm packages, or bundlers are needed!

```bash
# 1. Clone repository
git clone https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_WEATHER.git
cd PIMX_WEATHER

# 2. Launch any static HTTP server:
# Using Python 3:
python -m http.server 8080

# Using Node.js npx:
npx serve .

# 3. Open in browser:
# Navigate to http://localhost:8080
```

---

## Persian Documentation
### 🇮🇷 مستندات فوق‌العاده مفصل، جامع و فنی به زبان فارسی

### ۱. مقدمه و چرایی توسعه پروژه PIMX_WEATHER
پروژه **PIMX_WEATHER** یک شاهکار مهندسی وب در حوزه هواشناسی، اخترشناسی محاسباتی و فیزیک جو است که به زبان **جاوااسکریپت خالص (Vanilla JS)** و بدون اتکا به هیچ‌گونه فریم‌ورک سنگین (مانند ری‌اکت یا ویو) توسعه یافته است.

بسیاری از وب‌سایت‌های هواشناسی تجاری به انبوهی از تبلیغات آزاردهنده، اسکریپت‌های ردیابی اطلاعات کاربر و داده‌های غیردقیق محدود شده‌اند. هدف از خلق **PIMX_WEATHER**، ارائه یک پلتفرم علمی، کاملاً رایگان، دو زبانه (فارسی و انگلیسی) و با طراحی مدرن شیشه‌ای (Glassmorphism) بود که بتواند وضعیت جوی زمین را با محاسبات واقعی حرکت اجرام آسمانی پیوند دهد.

---

### ۲. کالبدشکافی فنی فایل‌ها و ساختار پروژه
- **`index.html`**: ساختار کلی نرم‌افزار شامل ویجت‌های کارت آب‌وهوای لحظه‌ای، نمودار ۲۴ ساعته، نوار انیمیشنی گذر خورشید، پنجره رادار زنده ابرها و اطلس منظومه شمسی.
- **`app.js`**: مغز متفکر برنامه؛ شامل کدهای ارتباط ناهمگام با وب‌سرویس جهانی Open-Meteo، حل عددی معادلات نجومی کپلر، محاسبه گرگ‌ومیش‌های سه‌گانه، و رندر نمودارهای برداری با شتاب گرافیکی سخت‌افزاری.
- **`i18n.js`**: فرهنگ لغت جامع و دو زبانه شامل بیش از ۷۴۰ واژه تخصصی اقلیم‌شناسی و نجوم به همراه نگاشت چیدمان راست‌چین (RTL) و هماهنگی با زبان فارسی.
- **`styles.css` و `redesign.css`**: استایل‌دهی مدرن تاریک (Dark Mode) با متغیرهای CSS و انیمیشن‌های نرم که ظاهری شبیه به سیستم‌عامل‌های آینده‌نگرانه به پروژه بخشیده است.
- **`animations.css`**: انیمیشن‌های قطرات باران، رعدوبرق، تابش نور خورشید و مه‌آلود بودن هوا که با پردازنده گرافیکی (GPU) رندر می‌شوند تا کمترین مصرف باتری را داشته باشند.

---

### ۳. ویژگی‌های منحصربه‌فرد علمی:
1. **پشتیبانی از ۴ مدل بزرگ هواشناسی جهان:**
   * امکان مقایسه پیش‌بینی‌های مدل اروپایی (ECMWF - دقیق‌ترین مدل جهان)، مدل آمریکایی (GFS)، مدل آلمانی (ICON) و مدل تلفیقی با هوش مصنوعی.
2. **محاسبات زاویه‌ای خورشید (Solar Arc):**
   * شبیه‌سازی دقیق زمان ظهر شرعی، ارتفاع خورشید از افق، طول روز و گرگ‌ومیش‌های سه‌گانه (نجومی، دریایی، و مدنی).
3. **رادار زنده بارش ماهواره‌ای:**
   * نقشه تعاملی با کنترل پخش و توقف برای دیدن حرکت توده‌های باران در ۲ ساعت گذشته.
4. **دانشنامه ماه و منظومه شمسی:**
   * محاسبه سن ماه به روز، درصد روشنایی قرص ماه و فاصله لحظه‌ای ماه و خورشید از موقعیت مکانی شما.

---

## 🗺️ Strategic Engineering Roadmap

- [x] **v1.0**: Core Vanilla JS engine, Open-Meteo API integration, 7-day synoptic forecast.
- [x] **v1.5**: Astronomical sun arc Canvas visualizer, lunar phase calculations, RainViewer radar.
- [ ] **v2.0**: Three.js WebGL 3D celestial sphere rendering true star constellations above observer location.
- [ ] **v2.5**: Extreme weather alerts with WebPush notifications and sound alarms for severe storms.
- [ ] **v3.0**: Decentralized P2P personal weather station (PWS) integration via MQTT IoT telemetry.

---

## 📜 License & Open Source Attribution

Distributed under the **MIT License**. Free for educational, scientific, commercial, and personal exploration.

---

<div align="center">

<!-- ============================================================================== -->
<!-- ANIMATED CAPSULE FOOTER                                                        -->
<!-- ============================================================================== -->
<img src="./assets/footer.svg" alt="PIMX_WEATHER 3D Footer" width="100%" />

<sub>Architected with dedication and astronomical passion by <a href="https://github.com/MOHAMMADREZAABEDINPOOR"><b>MOHAMMADREZA ABEDINPOOR</b></a>. If PIMX_WEATHER illuminates your horizons, please leave a ⭐!</sub>

</div>
