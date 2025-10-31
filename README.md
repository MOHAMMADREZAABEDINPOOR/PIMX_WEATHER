# 🌦️ PIMX_WEATHER

A comprehensive, feature-rich weather application with real-time forecasts, advanced astronomical visualizations, historical data analytics, and a beautiful responsive UI. Built with pure JavaScript and modern web technologies.

**Live Demo**: [pimx.pages.dev](https://pimx-weather.pages.dev)

---

## ✨ Key Features

### 🌍 **Smart Location Services**
- **Automatic GPS Detection**: Get instant weather data for your current location
- **IP-based Fallback**: Automatic location detection via IP geolocation if GPS is unavailable
- **Advanced City Search**: Autocomplete city search with real-time suggestions
- **Multi-City Management**: Save up to 20 cities and switch between them seamlessly
- **Persistent Storage**: Cities and preferences saved in browser localStorage

### 🌤️ **Comprehensive Weather Data**

#### Current Conditions
- **Real-time Temperature**: Current, feels-like, and daily min/max temperatures
- **Detailed Weather Stats** (13 stat cards with animated progress bars):
  - 🌡️ Feels Like Temperature
  - 💧 Humidity
  - 💨 Wind Speed & Direction
  - 🔽 Atmospheric Pressure
  - 👁️ Visibility
  - 💦 Dew Point
  - 🌧️ Precipitation
  - ☀️ UV Index
  - 🏭 Air Quality Index (AQI)
  - 🌅 Sunrise Time
  - 🌇 Sunset Time
  - 🌙 Moon Phase

#### Forecasts
- **24-Hour Hourly Forecast**: Detailed hour-by-hour predictions with weather icons
- **Extended Daily Forecast**: Choose between 7 or 14-day forecasts
- **Visual Weather Icons**: Beautiful animated icons for all weather conditions
- **Dynamic Themes**: UI automatically adapts to weather conditions (sunny, cloudy, rainy, snowy, night)

### 📊 **Historical Data & Analytics**

#### Interactive Charts
- **Precipitation History**: 
  - View data for past week, month, 6 months, or year
  - Interactive Chart.js line charts
  - Statistics: Total precipitation, average max/min, max daily precipitation
- **Temperature History**:
  - Historical temperature trends
  - Visual temperature charts

### ☀️🌙 **Advanced Astronomy Features**

#### Sun Arc Visualization 🎨
- **Beautiful Arc Chart**: Real-time visualization of sun's path across the sky using Quadratic Bezier Curves
- **Time Markers**: Visual markers for 9 AM, 12 PM, 3 PM, and 6 PM
- **Color Gradient**: Smooth gradient from sunrise to sunset
- **Glow Effects**: Animated glow effects and pulse animations
- **Live Position Tracking**: Real-time sun position with altitude angle display
- **Detailed Sun Information**:
  - 🌅 Sunrise Time
  - 🌇 Sunset Time
  - ⏱️ Day Length
  - 🌞 Solar Noon
  - 📐 Sun Altitude
  - 🧭 Sun Azimuth
  - ⬆️ Maximum Altitude
  - 🌍 Distance from Sun

#### Moon Arc Visualization 🌙
- **Moon Path Visualization**: Beautiful arc chart showing moon's journey across the sky
- **Twinkling Stars**: Animated stars in the night sky background
- **Night Visual Effects**: Atmospheric night-time visuals
- **Live Moon Tracking**: Real-time moon position display
- **Detailed Moon Information**:
  - 🌕 Moon Phase (8 phases with graphical display)
  - 💡 Illumination Percentage
  - 📅 Moon Age (days since new moon)
  - 🌜 Moonrise Time
  - 🌛 Moonset Time
  - ⏱️ Duration Above Horizon
  - 📐 Moon Altitude
  - 📏 Distance from Earth

#### Solar System Visualization 🪐
- **Real Astronomical Positions**: All 8 planets (Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune) with accurate VSOP87 calculations
- **Interactive Time Control**:
  - Hour slider (00:00 - 23:00) to observe planetary motion throughout the day
  - "Now" button to jump to current time
  - Real-time position updates
- **Zoom Controls**: Zoom in/out and reset for better viewing (0.5x to 2.0x)
- **Planet Details**: Click any planet to see:
  - Distance from Sun (AU)
  - 3D Coordinates (X, Y, Z)
  - Angle and position information
- **Visual Features**:
  - Saturn's rings
  - Earth's moon
  - Color-coded planet legend
- **Accuracy**: Positions accurate for any date/time (1800-2200 CE)

### 🎯 **User Experience**

#### Navigation & Controls
- **Day Navigation**: Click any day in the forecast to see detailed hourly breakdown
- **Date Selector**: Previous/Next day buttons with live date display
- **Live Clock**: Real-time local time display for selected city
- **Auto-refresh**: Weather data updates automatically

#### Customization
- **Multi-language Support**: 
  - 🇫🇷 Persian (Farsi)
  - 🇬🇧 English
  - Auto-detection based on browser/geolocation
- **Temperature Units**: Toggle between Celsius (°C) and Fahrenheit (°F)
- **Responsive Zoom**: Auto-optimized zoom levels for mobile, tablet, and desktop

#### Visual Design
- **Beautiful Animations**: 
  - Weather-specific animations (sun, clouds, rain, snow, night)
  - Loading screen animations
  - Smooth transitions and hover effects
- **Dynamic Color Themes**: UI adapts colors based on weather conditions
- **Progress Bar Animations**: Animated progress bars for all stat cards
- **SVG Graphics**: Custom SVG elements for astronomical visualizations

### 📱 **Responsive Design**
- **Mobile-First**: Optimized for all screen sizes
- **Breakpoint Support**: 
  - Mobile (≤560px)
  - Tablet (≤880px)
  - Desktop (>880px)
- **Touch-Friendly**: Optimized touch targets and gestures
- **Adaptive Layouts**: Grid and Flexbox layouts that adapt to screen size

---

## 🚀 Getting Started

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_WEATHER.git
   cd PIMX_WEATHER
   ```

2. **Open in browser**
   - Simply open `index.html` in any modern web browser
   - No build process or dependencies required!

3. **Start using**
   - Allow location access when prompted (optional)
   - Or search for any city worldwide

### Browser Requirements

- **Modern Browser**: Chrome, Firefox, Safari, Edge (latest versions)
- **JavaScript**: Must be enabled
- **Internet Connection**: Required for API calls

### No Installation Needed!

This is a pure client-side application:
- ✅ No server required
- ✅ No build process
- ✅ No npm/node dependencies (except CDN libraries)
- ✅ Works offline for saved cities (after initial load)

---

## 🌐 Data Sources & APIs

### Weather APIs
- **Primary**: [Open-Meteo](https://open-meteo.com) - Free, accurate, and reliable weather API
  - Forecast API: Real-time and future weather data
  - Archive API: Historical weather data
  - Air Quality API: Air pollution and AQI data
  - Geocoding API: City search and reverse geocoding

### Location Services
- **GPS**: Native browser geolocation API
- **IP Geolocation**: [ipapi.co](https://ipapi.co) - IP-based location detection

### Astronomical Calculations
- **VSOP87**: Variations Séculaires des Orbites Planétaires - Planetary position calculations
- **Kepler's Equation**: Solving for planetary orbits
- **Julian Day**: Astronomical date/time conversion
- **Reference Standards**: 
  - [JPL Horizons](https://ssd.jpl.nasa.gov/horizons/)
  - [Astronomical Algorithms by Jean Meeus](https://www.willbell.com/math/MC1.HTM)

---

## 🎨 Technologies Used

### Core Technologies
- **HTML5**: Semantic markup and modern HTML features
- **CSS3**: 
  - CSS Grid & Flexbox for layouts
  - CSS Animations & Transitions
  - CSS Variables (Custom Properties)
  - Media Queries for responsive design
- **Vanilla JavaScript (ES6+)**:
  - Modern ES6+ syntax
  - Async/Await for API calls
  - LocalStorage for data persistence
  - Canvas API for charts

### Libraries & Dependencies
- **Chart.js 4.4.0**: Interactive charts for historical data
- **Vazirmatn Font**: Persian/Arabic font support
- **Open-Meteo API**: Weather data provider

### File Structure
```
PIMX_WEATHER/
├── index.html          # Main HTML structure
├── styles.css          # Main stylesheet
├── animations.css      # Weather animations
├── app.js             # Main application logic
├── i18n.js            # Internationalization (i18n)
└── README.md          # Documentation
```

---

## 📝 Technical Details

### Sun/Moon Arc Calculation

The application uses **Quadratic Bezier Curves** to accurately represent the sun and moon's paths:

#### Mathematical Formula
```
Arc Path: M 20,130 Q 200,20 380,130
- Start point (sunrise): (20, 130)
- Control point (zenith): (200, 20)
- End point (sunset): (380, 130)
```

#### Position Calculation (JavaScript)
```javascript
t = (current time - sunrise) / (sunset - sunrise)  // 0 to 1
x = (1-t)² × x₀ + 2(1-t)t × xc + t² × x₁
y = (1-t)² × y₀ + 2(1-t)t × yc + t² × y₁
```

### Planetary Position Calculation

The solar system uses **precision astronomical algorithms**:

1. **Julian Day Number (JD)**: Converts any date/time to astronomical Julian Day
2. **VSOP87 Orbital Elements**: Calculates planetary orbital parameters
   - Semi-major axis (a)
   - Eccentricity (e)
   - Inclination (I)
   - Mean longitude (L)
   - Longitude of perihelion (ω̃)
   - Longitude of ascending node (Ω)
3. **Kepler's Equation**: Solves M = E - e·sin(E) using Newton-Raphson iteration
4. **True Anomaly**: Calculates actual planet position
5. **Heliocentric Coordinates**: Converts to 3D (X, Y, Z) coordinate system

#### Accuracy
- ✅ Valid for years 1800-2200 CE
- ✅ Position error < 1 degree
- ✅ Real-time updates
- ✅ Timezone-aware calculations

### Moon Phase Calculation

- Uses high-precision Julian Day formulas
- Moon age calculated to 0.1 day accuracy
- 8 distinct moon phases with visual representations

---

## 🔧 Advanced Features

### State Management
- Centralized app state object
- LocalStorage persistence for:
  - Saved cities (up to 20)
  - Temperature unit preference
  - Active city index
  - Solar system zoom level

### Performance Optimizations
- **Lazy Loading**: Charts loaded only when needed
- **Debounced Search**: City search debounced for performance
- **Efficient Rendering**: Only updates changed DOM elements
- **CDN Resources**: External libraries loaded from CDN

### Accessibility
- **Semantic HTML**: Proper HTML5 semantic elements
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Responsive Text**: Scalable font sizes

---

## 🎨 UI/UX Highlights

### Visual Design
- **Modern Card-Based Layout**: Clean, organized sections
- **Smooth Animations**: Weather-specific animations enhance user experience
- **Progress Indicators**: Animated progress bars for all metrics
- **Loading States**: Beautiful loading screen with progress bar
- **Toast Notifications**: User-friendly notification system

### Color Themes
Automatically switches based on weather:
- ☀️ **Sunny Day**: Warm yellows and oranges
- ☁️ **Cloudy**: Soft grays and whites
- 🌧️ **Rainy**: Cool blues and grays
- ❄️ **Snowy**: Bright whites and blues
- 🌙 **Night**: Dark blues and purples

---

## 📊 Features Summary

| Feature Category | Count | Details |
|-----------------|-------|---------|
| Weather Metrics | 13 | Comprehensive stat cards |
| Forecast Periods | 2 | 7-day / 14-day options |
| Historical Periods | 4 | Week, Month, 6 Months, Year |
| Astronomy Objects | 11 | Sun, Moon, 8 Planets |
| Languages | 2 | Persian, English |
| Temperature Units | 2 | Celsius, Fahrenheit |
| Saved Cities | 20 | Maximum storage |
| Chart Types | 2 | Precipitation, Temperature |

---

## 🐛 Troubleshooting

### Common Issues

**Location not detected**
- Check browser permissions for location access
- Try using IP-based location fallback
- Manually search for your city

**Weather data not loading**
- Check internet connection
- Verify API endpoints are accessible
- Check browser console for errors

**Sun/Moon position incorrect**
- Ensure device timezone is correct
- Refresh the page
- Check console logs for debug information

**Charts not displaying**
- Ensure Chart.js library loaded correctly
- Check browser console for errors
- Try refreshing the page

---

## 🔮 Future Enhancements

Potential features for future versions:
- 🌍 Weather maps integration
- 📱 Progressive Web App (PWA) support
- 🔔 Weather alerts and notifications
- 📈 More detailed climate data
- 🌐 Additional language support
- 🎨 More theme customization options

---

## 📄 License

This project is released under the **MIT License**. Feel free to use, modify, and distribute as needed.

---

## 👤 Author

**Mohammadreza Abedinpour**

- 🌐 **Website**: [pimx.pages.dev](https://pimx.pages.dev)
- 💻 **GitHub**: [@MOHAMMADREZAABEDINPOOR](https://github.com/MOHAMMADREZAABEDINPOOR)

---

## 🤝 Contributing

Contributions are welcome! If you find a bug or have a feature suggestion:

1. **Open an Issue**: Describe the problem or feature request
2. **Fork the Repository**: Create your own fork
3. **Create a Branch**: Work on your changes
4. **Submit a Pull Request**: Share your improvements

For bug reports, please include:
- Browser and version
- Operating system
- Steps to reproduce
- Expected vs actual behavior

---

## 🙏 Acknowledgments

- [Open-Meteo](https://open-meteo.com) for free weather API
- [Chart.js](https://www.chartjs.org/) for beautiful charts
- [JPL Horizons](https://ssd.jpl.nasa.gov/horizons/) for astronomical reference
- Jean Meeus for astronomical algorithms reference
- All contributors and users

---

**Made with ❤️ and ☕ by [Mohammadreza Abedinpour](https://pimx.pages.dev)**

*Last updated: 2025*
