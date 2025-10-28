# 🌦️ PIMX_WEATHER

An advanced weather application with real-time forecasts, astronomical data visualization, and beautiful responsive UI.

## ✨ Features

### 🌍 Location
- Automatic GPS location detection
- IP-based location fallback
- City search with autocomplete
- Save up to 20 cities and switch between them

### 🌤️ Weather Forecasting
- Current conditions with complete details
- Hourly forecast (24 hours)
- Daily forecast (7 or 14 days)
- Beautiful animations for sunny, cloudy, rainy, and snowy conditions
- Dynamic themes based on weather conditions

### 📊 Historical Statistics
- Precipitation data for past week/month/6 months/year
- Interactive charts with Chart.js
- Temperature and precipitation statistics

### ☀️🌙 Astronomy
- **Sun Arc Chart** (New! 🎨):
  - Beautiful visualization of the sun's actual path across the sky
  - Time markers (9 AM, 12 PM, 3 PM, 6 PM)
  - Color gradient from sunrise to sunset
  - Glow effects and pulse animations
  - Precise position calculation using Quadratic Bezier Curves
  
- **Moon Arc Chart** (New! 🌙):
  - Beautiful arc for moon's path
  - Twinkling animated stars
  - Night visual effects
  
- **Realistic Moon Phases**: Graphical display of 8 moon phases with craters and seas
  
- **Solar System with Real Astronomical Positions**:
  - 8 planets (Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune)
  - Accurate calculations based on VSOP87 and Keplerian algorithms
  - Planet positions for **any date** and **any time**
  - Hour slider to change time and observe planetary motion
  - Display distance, coordinates, and angle for each planet
  - Real-time updates when changing day or time
  - Saturn's rings + Earth's moon
  
- Sunrise/sunset and moonrise/moonset times
- Day and night length
- UV Index

### 🎯 Day Navigation
- Click on any day → entire page updates
- Hour-by-hour display for that day
- Previous/Next buttons for quick switching

### 📱 Responsive Design
- Fully responsive
- Optimized for mobile, tablet, and desktop

## 🚀 How to Use

1. Open `index.html` in your browser
2. Allow location access (optional)
3. Or search for your desired city

## 🌐 Data Sources & Algorithms

### APIs Used:
- **Weather**: [Open-Meteo](https://open-meteo.com) - Most accurate free API
- **Air Quality**: Open-Meteo Air Quality API
- **Historical Archive**: Open-Meteo Archive API
- **Geocoding**: Open-Meteo Geocoding API

### Astronomical Algorithms:
- **VSOP87**: For calculating planetary orbital elements
- **Kepler's Equation**: For precise planetary position calculation
- **Julian Day**: For date and time conversion
- Reference: [JPL Horizons](https://ssd.jpl.nasa.gov/horizons/) and [Astronomical Algorithms by Jean Meeus](https://www.willbell.com/math/MC1.HTM)

## 🎨 Technologies

- HTML5
- CSS3 (Grid, Flexbox, Animations)
- Vanilla JavaScript (ES6+)
- Chart.js for charts
- Vazirmatn Font

## 📝 Technical Notes

### Sun/Moon Position Calculation on Arc (New! 🎨)

The sun and moon charts use **Quadratic Bezier Curves** to display the actual path in the sky:

#### Calculation Formula:
```
Arc: M 20,130 Q 200,20 380,130
- Start point (sunrise): (20, 130)
- Control point (peak): (200, 20)
- End point (sunset): (380, 130)
```

#### Position Calculation (x, y):
```javascript
t = (current time - sunrise) / (sunset - sunrise)  // 0 to 1
x = (1-t)² × 20 + 2(1-t)t × 200 + t² × 380
y = (1-t)² × 130 + 2(1-t)t × 20 + t² × 130
```

### Planetary Position Calculation (New! 🚀)

This application uses **precise astronomical algorithms** to calculate real planetary positions:

#### 1. **Julian Day Number (JD)**
- Convert date and time to Julian Day Number
- Accuracy down to the second
- Reference: J2000.0 (January 1, 2000, 12:00 UTC)

#### 2. **Planetary Orbital Elements**
For each planet, the following parameters are calculated:
- `a` (Semi-major axis): Major radius of orbit in AU
- `e` (Eccentricity): Orbital eccentricity
- `I` (Inclination): Angle of deviation from ecliptic plane
- `L` (Mean longitude)
- `ω̃` (Longitude of perihelion)
- `Ω` (Longitude of ascending node)

These values are calculated based on **VSOP87** and updated over time.

#### 3. **Solving Kepler's Equation**
```
M = E - e·sin(E)
```
- `M`: Mean Anomaly
- `E`: Eccentric Anomaly (solved iteratively using Newton-Raphson method)
- `e`: Eccentricity

#### 4. **True Anomaly Calculation**
```
v = 2·atan2(√(1+e)·sin(E/2), √(1-e)·cos(E/2))
```

#### 5. **Conversion to Heliocentric Coordinates**
Each planet's position is calculated in 3D coordinate system (X, Y, Z) relative to the Sun.

#### Calculation Accuracy:
- ✅ Accurate for time range 1800-2200 CE
- ✅ Error less than 1 degree for planetary positions
- ✅ Real-time updates when changing time
- ✅ Local timezone consideration

### Moon Phase Calculation
Uses Julian Day formula with high precision. Moon Age calculation (from last new moon) accurate to tenth of a day.

### Moonrise/Moonset
Uses simple approximation based on moon phase. For higher accuracy, astronomical libraries can be used.

### Timezone
All calculations are based on the selected city's timezone.

### Time Control in Solar System
- **Today**: Planetary positions calculated for current time (updated with "Now" button)
- **Other days**: Default time is 12:00 PM
- **Hour slider**: Change time from 00:00 to 23:00 and observe planetary motion

## 🔧 Troubleshooting

### Sun in Wrong Position
- Refresh the browser
- Check console
- Make sure your device timezone is correct

### Moon Not Displaying
- Navigate a few days forward/backward for phase change
- Refresh

### Data Not Displaying
- Check internet connection
- Check console for errors

## 📄 License

This project is released under the MIT License.

## 🤝 Contributing

For bug reports or improvement suggestions, please create an Issue.

---

Made with ❤️ and ☕

