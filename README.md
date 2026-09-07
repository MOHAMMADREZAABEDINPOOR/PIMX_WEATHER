<div align="center">

# 🌦️ PIMX_WEATHER ☀️🪐
### High-Precision Astronomical & Meteorological Analytics Suite with VSOP87 Orbital Tracking

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![JavaScript: ES6+](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Open-Meteo](https://img.shields.io/badge/API-Open--Meteo-007ACC?style=for-the-badge&logo=open-source-initiative&logoColor=white)](https://open-meteo.com/)
[![HTML5 / Canvas](https://img.shields.io/badge/HTML5-Canvas_Animations-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://html.spec.whatwg.org/)
[![Read in Persian](https://img.shields.io/badge/مطالعه_به_فارسی-Persian_README-008080?style=for-the-badge)](#-توضیحات-فوقالعاده-جامع-فارسی-persian-documentation)

<p align="center">
  A zero-dependency atmospheric and astrophysics web application. Merges hyper-local real-time weather analytics (ECMWF, GFS, ICON numerical models) with genuine celestial mechanics (VSOP87 planetary trajectories, solar azimuth and elevation arcs, and lunar phase illumination algorithms).
</p>

[Project Overview](#-project-overview) •
[Directory Structure](#-directory--file-structure) •
[Astrophysics Mathematics](#-astrophysics--orbital-mathematics) •
[Weather Models](#-numerical-forecast-models-supported) •
[Quick Start](#-quick-start) •
[توضیحات فارسی](#-توضیحات-فوقالعاده-جامع-فارسی-persian-documentation) •
[License](#-license)

</div>

---

## 🎯 Project Overview

Most weather websites are cluttered with tracking scripts, paywalled historical data, and imprecise single-model predictions. **PIMX_WEATHER** provides an open, scientific alternative:
1. **Multi-Model Consensus**: Compares predictions from the European Centre for Medium-Range Weather Forecasts (ECMWF), NOAA's Global Forecast System (GFS), and the German Weather Service (ICON).
2. **Astrophysical Integration**: Computes real-time solar declination, true solar noon, twilight stages, and lunar phase geometry directly in client-side JavaScript.
3. **Zero Framework Bloat**: Built in pure Vanilla JavaScript (ES6+), CSS Grid/Flexbox, and HTML5 Canvas, achieving 60 FPS performance even on low-end mobile devices.

---

## 📂 Directory & File Structure

```
weather/
│
├── index.html                       # Semantic HTML5 single-page application structure
├── app.js                           # Core application engine, API fetching & celestial calculations
├── i18n.js                          # Exhaustive English & Persian bilingual dictionary (740+ terms)
├── styles.css                       # Primary layout, typography, responsive breakpoints & themes
├── redesign.css                     # Modern glassmorphic cards, widgets & typography polish
├── animations.css                   # Dynamic CSS keyframe animations for rain, sun rays & clouds
└── README.md                        # Master comprehensive bilingual documentation
```

---

## 🧮 Astrophysics & Orbital Mathematics

Rather than fetching static almanacs, PIMX_WEATHER computes celestial coordinates dynamically:

### 1. Solar Declination ($\delta$) & Hour Angle ($H$)
$$\delta = 23.45^\circ \cdot \sin\left(\frac{360}{365} (284 + N)\right)$$
$$\cos(H) = -\tan(\phi) \cdot \tan(\delta)$$
Where $N$ is the day of the year and $\phi$ is the observer's geographic latitude.

### 2. Solar Zenith & Altitude Angle ($h$)
$$\sin(h) = \sin(\phi) \sin(\delta) + \cos(\phi) \cos(\delta) \cos(H)$$

### 3. Lunar Phase Illumination Fraction ($k$)
$$k = \frac{1 + \cos(\psi)}{2}$$
Calculates the illuminated lunar disk percentage across the 29.53-day synodic month.

---

## 🌐 Numerical Forecast Models Supported

| Model | Source Organization | Resolution | Update Frequency | Specialty |
| :--- | :--- | :--- | :--- | :--- |
| **ECMWF IFS** | European Union | ~9 km | 2x Daily | Gold standard for medium-range precision. |
| **GFS** | NOAA (United States) | ~13 km | 4x Daily | Excellent for broad precipitation systems. |
| **ICON** | DWD (Germany) | ~7 km | 4x Daily | Superior alpine and micro-climate forecasting. |
| **Best Match** | Dynamic Multi-Model Ensemble | Dynamic | Real-Time | Blends the highest-confidence outputs per location. |

---

## 🚀 Quick Start

No API keys, build steps, or bundle compilers needed!

```bash
# 1. Clone the repository
git clone https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_WEATHER.git
cd PIMX_WEATHER

# 2. Run with any local server:
# Using Python:
python -m http.server 8080

# Or using Node.js:
npx serve .
```
Open `http://localhost:8080` in your web browser.

---

## 🇮🇷 توضیحات فوق‌العاده جامع فارسی (Persian Documentation)

### ۱. معرفی پروژه سامانه هواشناسی PIMX_WEATHER
پروژه **PIMX_WEATHER** یک سامانه هواشناسی و نجومی پیشرفته، فوق‌العاده سریع و دوزبانه است که بر پایه استانداردهای علمی اخترفیزیک و مدل‌های عددی بین‌المللی هواشناسی بنا شده است. این نرم‌افزار بدون نیاز به هیچ فریم‌ورک حجیم و سنگین، با استفاده از جاوااسکریپت خالص (Vanilla JS) ساخته شده و بدون تبلیغات، داده‌های آب‌وهوا و موقعیت اجرام آسمانی را با دقتی بی‌نظیر نمایش می‌دهد.

---

### ۲. تشریح ساختار فایل‌های پروژه
- **`index.html`**: ساختار کلی صفحه شامل ویجت‌های دما، نمودارهای ۲۴ ساعته، رادار زنده ابری، ردیاب خورشید و فازهای ماه.
- **`app.js`**: موتور اصلی محاسباتی برنامه؛ شامل توابع ارتباط با وب‌سرویس Open-Meteo، حل معادلات مکانیک مداری کپلر و مدیریت موقعیت‌یابی جغرافیایی (GPS).
- **`i18n.js`**: فرهنگ لغت جامع بیش از ۷۴۰ واژه تخصصی به دو زبان فارسی و انگلیسی برای ترجمه بومی و چیدمان راست‌چین.
- **`styles.css` و `redesign.css`**: کدهای استایل‌دهی مدرن با تم تاریک (Dark Mode)، طراحی شیشه‌ای و هماهنگ با تایپوگرافی فارسی.
- **`animations.css`**: انیمیشن‌های نرم بارش باران، تابش خورشید و گذر ابرها با شتاب‌دهنده گرافیکی GPU.

---

### ۳. امکانات برجسته علمی و کاربردی:
1. **پشتیبانی از ۴ مدل جهانی پیش‌بینی هوا:**
   * امکان سوئیچ میان مدل اروپایی (ECMWF)، مدل آمریکایی (GFS)، مدل آلمانی (ICON) و مدل تلفیقی هوشمند.
2. **شبیه‌ساز بصری حرکت خورشید (Solar Arc):**
   * نمایش ارتفاع خورشید، گرگ‌ومیش نجومی، ظهر شرعی و انیمیشن زنده حرکت خورشید در آسمان شهر انتخابی شما.
3. **رادار زنده بارش (Rain Radar):**
   * نقشه تعاملی رادار باران و رعد و برق متصل به ماهواره‌های هواشناسی RainViewer و OpenStreetMap.
4. **دانشنامه نجوم و منظومه شمسی:**
   * اطلاعات دقیق فاز ماه، فاصله ماه و خورشید از زمین و سن ماه قمری.

---

## 📜 License

Distributed under the **MIT License**. Free for educational, commercial, and personal use.

---

<div align="center">
  <sub>Engineered by <a href="https://github.com/MOHAMMADREZAABEDINPOOR">MOHAMMADREZA ABEDINPOOR</a>. If this project shines light on your skies, leave a ⭐!</sub>
</div>
