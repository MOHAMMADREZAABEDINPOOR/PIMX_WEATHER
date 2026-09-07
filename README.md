<div align="center">

# 🌦️ PIMX_WEATHER ☀️🪐
### Precision Astronomical & Meteorological Suite with Real-Time VSOP87 Orbital Tracking

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![JavaScript: ES6+](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Open-Meteo](https://img.shields.io/badge/API-Open--Meteo-007ACC?style=for-the-badge&logo=open-source-initiative&logoColor=white)](https://open-meteo.com/)
[![HTML5 / Canvas](https://img.shields.io/badge/HTML5-Canvas_Animations-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://html.spec.whatwg.org/)
[![Read in Persian](https://img.shields.io/badge/مطالعه_به_فارسی-Persian_README-008080?style=for-the-badge)](#-توضیحات-کامل-فارسی-persian-documentation)

<p align="center">
  A visually mesmerizing, zero-dependency atmospheric and astrophysics web application. Combines hyper-local real-time weather analytics with celestial physics algorithms (VSOP87 planetary trajectories, solar azimuth and elevation arcs, and lunar phase illumination calculations).
</p>

[Key Features](#-key-features) •
[Mathematical Physics](#-mathematical--astronomical-foundation) •
[Quick Start](#-quick-start) •
[توضیحات فارسی](#-توضیحات-کامل-فارسی-persian-documentation) •
[License](#-license)

</div>

---

## ⚡ Key Features

- 🌡️ **Comprehensive Atmospheric Telemetry**:
  - Real-time temperature, dew point, relative humidity, atmospheric pressure (hPa), and air density.
  - 24-hour granular forecasts and 7-day extended synoptic outlook.
  - Wind speed vectors, gust forecasts, and compass direction gauges.
- ☀️ **Solar Arc & Sun Elevation Tracker**:
  - Live animated SVG and Canvas solar progression showing true solar noon, golden hour, dawn, and dusk.
  - Dynamic twilight stages (civil, nautical, and astronomical twilight).
- 🌙 **High-Precision Moon Phase Engine**:
  - Calculates accurate lunar age (synodic month cycle of 29.53 days), percentage of illumination, and moonrise/moonset times.
- 🌍 **Dual Language (EN / FA)**:
  - Complete native localization with Right-to-Left (RTL) typography and Persian calendar synchronization.
- ⚡ **Zero Heavy Frameworks**: Pure Vanilla JavaScript for instantaneous 60 FPS rendering on any mobile or desktop browser.

---

## 🧮 Mathematical & Astronomical Foundation

The celestial mechanics in PIMX_WEATHER do not rely on static tables; they solve real equations of motion:

1. **Solar Declination ($\delta$) & Equation of Time ($EoT$)**:
   $$\delta = 23.45^\circ \cdot \sin\left(\frac{360}{365} (284 + N)\right)$$
   Where $N$ is the day of the year.

2. **Solar Altitude Angle ($h$)**:
   $$\sin(h) = \sin(\phi) \sin(\delta) + \cos(\phi) \cos(\delta) \cos(H)$$
   Where $\phi$ is the observer's latitude and $H$ is the solar hour angle.

3. **Moon Illumination Fraction ($k$)**:
   $$k = \frac{1 + \cos(\psi)}{2}$$
   Where $\psi$ is the Earth-Moon-Sun phase angle.

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
Navigate to `http://localhost:8080` in your web browser.

---

## 🇮🇷 توضیحات کامل فارسی (Persian Documentation)

### معرفی پروژه سامانه هواشناسی و محاسبات نجومی PIMX_WEATHER
پروژه **PIMX_WEATHER** یک وب‌اپلیکیشن فوق‌العاده سریع، زیبا و دو زبانه (فارسی و انگلیسی) برای نمایش وضعیت آب و هوا و محاسبات دقیق نجومی خورشید و ماه است. این نرم‌افزار بدون نیاز به هیچ فریم‌ورک سنگینی با جاوااسکریپت خالص توسعه یافته و علاوه بر داده‌های جوی استاندارد (دما، رطوبت، باد و فشار هوا)، موقعیت مداری خورشید، گرگ‌ومیش‌های سه‌گانه و فازهای ماه را با فرمول‌های واقعی اخترفیزیک شبیه‌سازی می‌کند.

### ویژگی‌های شاخص:
1. **داده‌های هواشناسی دقیق و بدون نیاز به API Key:**
   * دریافت مستقیم اطلاعات اقلیمی از سرویس Open-Meteo با دقت فوق‌العاده بالا.
2. **شبیه‌ساز بصری حرکت خورشید (Solar Arc):**
   * نمایش زنده طلوع، غروب، زمان ظهر شرعی و ارتفاع زاویه‌ای خورشید در آسمان با انیمیشن تعاملی.
3. **فازهای دقیق ماه (Lunar Tracker):**
   * محاسبه دقیق درصد روشنایی ماه و سن قمری با شبیه‌سازی گرافیکی حالت‌های ماه (هلال، تربیع، بدر).
4. **رابط کاربری دوزبانه و استاندارد:**
   * تغییر لحظه‌ای زبان بین انگلیسی و فارسی با هماهنگی کامل فونت‌های فارسی و چیدمان راست‌به‌چپ (RTL).

---

## 📜 License

Distributed under the **MIT License**. Free for educational, commercial, and personal use.

---

<div align="center">
  <sub>Developed by <a href="https://github.com/MOHAMMADREZAABEDINPOOR">MOHAMMADREZA ABEDINPOOR</a>. If you appreciate astronomical engineering, leave a ⭐!</sub>
</div>
