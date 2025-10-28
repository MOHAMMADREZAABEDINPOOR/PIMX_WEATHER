// Initialize i18n
(async function initI18n() {
	console.log('🌐 Initializing i18n...');
	await setLanguageByLocation();
	console.log('✅ Language set to:', currentLang);
	applyTranslations();
	console.log('✅ Translations applied');
})();

// Loading Screen
window.addEventListener('load', () => {
	const loadingScreen = document.getElementById('loadingScreen');
	setTimeout(() => {
		loadingScreen.classList.add('hidden');
		setTimeout(() => {
			loadingScreen.style.display = 'none';
		}, 600);
	}, 1500); // نمایش لودینگ حداقل 1.5 ثانیه
});

// App State
const state = {
	unit: localStorage.getItem('unit') || 'C',
	place: null,
	weather: null,
	savedCities: JSON.parse(localStorage.getItem('savedCities') || '[]'),
	activeCityIndex: parseInt(localStorage.getItem('activeCityIndex') || '0'),
	historyData: null,
	airQuality: null,
	currentDayView: 7,
	selectedDayIndex: 0, // 0 = امروز
	solarSystemHour: null, // null = ساعت فعلی، در غیر این صورت ساعت دستی
	solarSystemZoom: getDefaultZoom(), // مقیاس zoom (0.5 تا 2.0)
};

// تابع تعیین zoom پیش‌فرض بر اساس سایز صفحه
function getDefaultZoom() {
	const width = window.innerWidth;
	if (width <= 460) return 0.5;      // موبایل خیلی کوچک
	if (width <= 560) return 0.60;      // موبایل
	if (width <= 767) return 0.75;      // تبلت کوچک
	if (width <= 880) return 1.0;      // تبلت
	return 1.2;                         // دسکتاپ
}

// Constants
const OPEN_METEO = {
	forecast: 'https://api.open-meteo.com/v1/forecast',
	search: 'https://geocoding-api.open-meteo.com/v1/search',
	reverse: 'https://geocoding-api.open-meteo.com/v1/reverse',
	airQuality: 'https://air-quality-api.open-meteo.com/v1/air-quality',
	archive: 'https://archive-api.open-meteo.com/v1/archive',
};
const IP_API = 'https://ipapi.co/json/';
const MAX_CITIES = 20;

// Elements
const el = {
	searchInput: document.getElementById('searchInput'),
	suggestions: document.getElementById('suggestions'),
	useLocation: document.getElementById('useLocation'),
	unitC: document.getElementById('unitC'),
	unitF: document.getElementById('unitF'),
	cityTabs: document.getElementById('cityTabs'),
	addCity: document.getElementById('addCity'),
	placeName: document.getElementById('placeName'),
	selectedDate: document.getElementById('selectedDate'),
	prevDay: document.getElementById('prevDay'),
	nextDay: document.getElementById('nextDay'),
	updatedAt: document.getElementById('updatedAt'),
	icon: document.getElementById('currentIcon'),
	temp: document.getElementById('temp'),
	condition: document.getElementById('condition'),
	feelsLike: document.getElementById('feelsLike'),
	humidity: document.getElementById('humidity'),
	wind: document.getElementById('wind'),
	pressure: document.getElementById('pressure'),
	visibility: document.getElementById('visibility'),
	dewpoint: document.getElementById('dewpoint'),
	precip: document.getElementById('precip'),
	uvIndex: document.getElementById('uvIndex'),
	aqi: document.getElementById('aqi'),
	sunrise: document.getElementById('sunrise'),
	sunset: document.getElementById('sunset'),
	moonPhase: document.getElementById('moonPhase'),
	hourlyList: document.getElementById('hourlyList'),
	dailyList: document.getElementById('dailyList'),
	toast: document.getElementById('toast'),
	view7d: document.getElementById('view7d'),
	view14d: document.getElementById('view14d'),
	sunTrackRise: document.getElementById('sunTrackRise'),
	sunTrackSet: document.getElementById('sunTrackSet'),
	sunStatus: document.getElementById('sunStatus'),
	moonTrackRise: document.getElementById('moonTrackRise'),
	moonTrackSet: document.getElementById('moonTrackSet'),
	moonStatus: document.getElementById('moonStatus'),
	moonCanvas: document.getElementById('moonCanvas'),
	moonPhaseNameBig: document.getElementById('moonPhaseNameBig'),
	moonIllumination: document.getElementById('moonIllumination'),
	solarSystem: document.getElementById('solarSystem'),
	precipChart: document.getElementById('precipChart'),
	tempChart: document.getElementById('tempChart'),
	historyStats: document.getElementById('historyStats'),
	localTime: document.getElementById('localTime'),
	solarSystemHour: document.getElementById('solarSystemHour'),
	solarSystemHourDisplay: document.getElementById('solarSystemHourDisplay'),
	resetToNow: document.getElementById('resetToNow'),
	zoomIn: document.getElementById('zoomIn'),
	zoomOut: document.getElementById('zoomOut'),
	zoomReset: document.getElementById('zoomReset'),
	zoomLevel: document.getElementById('zoomLevel'),
	sunAltitudeArc: document.getElementById('sunAltitudeArc'),
	moonAltitudeArc: document.getElementById('moonAltitudeArc'),
};

let precipChartInstance = null;
let tempChartInstance = null;
let clockInterval = null;

// ========= STAT CARD ANIMATIONS =========
function updateStatCard(elementId, value, barId = null, barPercent = 0) {
	const valueEl = document.getElementById(elementId);
	if (!valueEl) return;
	
	valueEl.textContent = value;
	
	if (barId) {
		const barEl = document.getElementById(barId);
		if (barEl) {
			// Reset animation
			barEl.style.width = '0%';
			setTimeout(() => {
				barEl.style.width = `${Math.min(Math.max(barPercent, 0), 100)}%`;
			}, 50);
		}
	}
}

function normalizeTemp(temp) {
	// Normalize temperature to 0-100% (assuming -20°C to 50°C range)
	if (temp == null) return 0;
	return Math.min(Math.max(((temp + 20) / 70) * 100, 0), 100);
}

function normalizePressure(pressure) {
	// Normalize pressure to 0-100% (assuming 950-1050 hPa range)
	if (pressure == null) return 50;
	return Math.min(Math.max(((pressure - 950) / 100) * 100, 0), 100);
}

function normalizeVisibility(visibility) {
	// Normalize visibility to 0-100% (assuming 0-20 km range)
	if (visibility == null) return 0;
	const visKm = visibility / 1000;
	return Math.min(Math.max((visKm / 20) * 100, 0), 100);
}

// ========= LIVE CLOCK =========
function startLiveClock(timezone) {
	// پاک کردن اینتروال قبلی
	if (clockInterval) {
		clearInterval(clockInterval);
	}
	
	// تابع برای به‌روزرسانی ساعت
	function updateClock() {
		try {
			const now = new Date();
			const localTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
			
			const hours = localTime.getHours().toString().padStart(2, '0');
			const minutes = localTime.getMinutes().toString().padStart(2, '0');
			const seconds = localTime.getSeconds().toString().padStart(2, '0');
			
			const timeStr = `${hours}:${minutes}:${seconds}`;
			
			// نمایش بر اساس زبان فعلی
			if (currentLang === 'fa') {
				const persianTime = timeStr.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
			el.localTime.textContent = persianTime;
			} else {
				el.localTime.textContent = timeStr;
			}
		} catch (e) {
			console.error('❌ Clock error:', e);
			el.localTime.textContent = '—';
		}
	}
	
	// اجرای فوری و سپس هر ثانیه
	updateClock();
	clockInterval = setInterval(updateClock, 1000);
}

// Utilities
const debounce = (fn, ms = 250) => {
	let t;
	return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
};

// Format number based on current language
const formatNumber = (v) => {
	if (v == null) return '—';
	if (currentLang === 'fa') {
		return typeof v === 'number' ? v.toLocaleString('fa-IR') : String(v).replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
	} else {
		return typeof v === 'number' ? v.toLocaleString('en-US') : String(v);
	}
};

const toFa = (v) => v == null ? '—' : (typeof v === 'number' ? v.toLocaleString('fa-IR') : String(v).replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]));
const msToKmh = (ms) => Math.round(ms * 3.6);
const cToF = (c) => Math.round(c * 9/5 + 32);
const fmtTemp = (c) => c == null ? '—' : (state.unit === 'C' ? `${formatNumber(Math.round(c))}°` : `${formatNumber(cToF(c))}°`);
const fmtPercent = (n) => n == null ? '—' : `${formatNumber(Math.round(n))}%`;
const fmtMm = (n) => n == null ? '—' : `${formatNumber(Math.round(n))} mm`;
const fmtKm = (n) => n == null ? '—' : `${formatNumber(Math.round(n/1000))} km`;
const fmthPa = (n) => n == null ? '—' : `${formatNumber(Math.round(n))} hPa`;
const tzDate = (iso, tz) => new Date(new Date(iso).toLocaleString('en-US', { timeZone: tz }));
const fmtTime = (iso, tz) => {
	const locale = currentLang === 'fa' ? 'fa-IR' : 'en-US';
	const hour12 = currentLang !== 'fa'; // Use 12-hour for English, 24-hour for Persian
	return tzDate(iso, tz).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12 });
};
const fmtDayName = (iso, tz) => {
	const locale = currentLang === 'fa' ? 'fa-IR' : 'en-US';
	return tzDate(iso, tz).toLocaleDateString(locale, { weekday: 'long' });
};
const fmtDateShort = (iso, tz) => {
	const locale = currentLang === 'fa' ? 'fa-IR' : 'en-US';
	return tzDate(iso, tz).toLocaleDateString(locale, { month: 'short', day: 'numeric' });
};
const fmtDateLong = (iso, tz) => {
	const locale = currentLang === 'fa' ? 'fa-IR' : 'en-US';
	return tzDate(iso, tz).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
};

function showToast(msg, timeout = 3000) {
	el.toast.textContent = msg;
	el.toast.classList.add('show');
	setTimeout(() => el.toast.classList.remove('show'), timeout);
}

// Moon phase calculation با Moon Age دقیق
function getMoonPhase(date) {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	
	// محاسبه Julian Day Number
	let c = 0, e = 0;
	if (month < 3) {
		c = year - 1;
		e = month + 12;
	} else {
		c = year;
		e = month;
	}
	const jd = Math.floor((365.25 * (c + 4716))) + Math.floor((30.6001 * (e + 1))) + day - 1524.5;
	
	// New Moon reference (2000-01-06 18:14 UTC = JD 2451550.26)
	const newMoonRef = 2451550.26;
	const synodicMonth = 29.530588853; // طول یک ماه قمری
	
	// محاسبه Moon Age (تعداد روزهایی که از ماه نو گذشته)
	const daysSinceNewMoon = jd - newMoonRef;
	const moonAge = daysSinceNewMoon % synodicMonth;
	
	// فاز به صورت درصد (0 = نو، 0.5 = بدر، 1 = نو)
	const phase = moonAge / synodicMonth;
	
	// درصد روشنایی
	let illumination;
	if (phase < 0.5) {
		illumination = Math.round(phase * 200); // 0% → 100%
	} else {
		illumination = Math.round((1 - phase) * 200); // 100% → 0%
	}
	
	// نام فاز بر اساس Moon Age
	let phaseName, phaseEmoji;
	if (moonAge < 1.84) {
		phaseName = t('moonNew'); phaseEmoji = '🌑';
	} else if (moonAge < 5.53) {
		phaseName = t('moonWaxingCrescent'); phaseEmoji = '🌒';
	} else if (moonAge < 9.23) {
		phaseName = t('moonFirstQuarter'); phaseEmoji = '🌓';
	} else if (moonAge < 12.91) {
		phaseName = t('moonWaxingGibbous'); phaseEmoji = '🌔';
	} else if (moonAge < 16.61) {
		phaseName = t('moonFull'); phaseEmoji = '🌕';
	} else if (moonAge < 20.30) {
		phaseName = t('moonWaningGibbous'); phaseEmoji = '🌖';
	} else if (moonAge < 23.99) {
		phaseName = t('moonLastQuarter'); phaseEmoji = '🌗';
	} else if (moonAge < 27.69) {
		phaseName = t('moonWaningCrescent'); phaseEmoji = '🌘';
	} else {
		phaseName = t('moonNew'); phaseEmoji = '🌑';
	}
	
	console.log('🌙 Moon Phase Calculation:');
	console.log('Date:', date.toLocaleDateString('fa-IR'));
	console.log('Julian Day:', jd);
	console.log('Moon Age (days):', moonAge.toFixed(2));
	console.log('Phase (0-1):', phase.toFixed(4));
	console.log('Illumination:', illumination + '%');
	console.log('Phase Name:', phaseEmoji, phaseName);
	
	return { 
		name: `${phaseEmoji} ${phaseName}`, 
		phase: phase, 
		moonAge: moonAge,
		illumination,
		emoji: phaseEmoji
	};
}

// ========= PLANETARY POSITION CALCULATIONS (Astronomical) =========
// تبدیل تاریخ به Julian Day Number
function dateToJulianDay(date) {
	const a = Math.floor((14 - (date.getMonth() + 1)) / 12);
	const y = date.getFullYear() + 4800 - a;
	const m = (date.getMonth() + 1) + 12 * a - 3;
	
	let jd = date.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4);
	jd = jd - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
	
	const hours = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
	jd += (hours - 12) / 24;
	
	return jd;
}

// محاسبه تعداد قرن‌های جولیان از J2000.0
function julianCenturies(jd) {
	return (jd - 2451545.0) / 36525.0;
}

// نرمال‌سازی زاویه به بازه 0-360
function normalizeAngle(angle) {
	angle = angle % 360;
	if (angle < 0) angle += 360;
	return angle;
}

// محاسبه موقعیت سیارات بر اساس عناصر مداری
function calculatePlanetPosition(planetName, date) {
	const jd = dateToJulianDay(date);
	const T = julianCenturies(jd);
	
	const orbitalElements = {
		'mercury': {
			a: 0.38709927,
			e: 0.20563593 + 0.00001906 * T,
			I: 7.00497902 - 0.00594749 * T,
			L: 252.25032350 + 149472.67411175 * T,
			w_bar: 77.45779628 + 0.16047689 * T,
			Omega: 48.33076593 - 0.12534081 * T
		},
		'venus': {
			a: 0.72333566,
			e: 0.00677672 - 0.00004107 * T,
			I: 3.39467605 - 0.00078890 * T,
			L: 181.97909950 + 58517.81538729 * T,
			w_bar: 131.60246718 + 0.00268329 * T,
			Omega: 76.67984255 - 0.27769418 * T
		},
		'earth': {
			a: 1.00000261,
			e: 0.01671123 - 0.00004392 * T,
			I: 0.00001531 - 0.01294668 * T,
			L: 100.46457166 + 35999.37244981 * T,
			w_bar: 102.93768193 + 0.32327364 * T,
			Omega: 0.0
		},
		'mars': {
			a: 1.52371034,
			e: 0.09339410 + 0.00007882 * T,
			I: 1.84969142 - 0.00813131 * T,
			L: 355.43299958 + 19140.30268499 * T,
			w_bar: 336.06023395 + 0.44441088 * T,
			Omega: 49.55953891 - 0.29257343 * T
		},
		'jupiter': {
			a: 5.20288700,
			e: 0.04838624 - 0.00013253 * T,
			I: 1.30439695 - 0.00183714 * T,
			L: 34.39644051 + 3034.74612775 * T,
			w_bar: 14.72847983 + 0.21252668 * T,
			Omega: 100.47390909 + 0.20469106 * T
		},
		'saturn': {
			a: 9.53667594,
			e: 0.05386179 - 0.00050991 * T,
			I: 2.48599187 + 0.00193609 * T,
			L: 49.95424423 + 1222.49362201 * T,
			w_bar: 92.59887831 - 0.41897216 * T,
			Omega: 113.66242448 - 0.28867794 * T
		},
		'uranus': {
			a: 19.18916464,
			e: 0.04725744 - 0.00004397 * T,
			I: 0.77263783 - 0.00242939 * T,
			L: 313.23810451 + 428.48202785 * T,
			w_bar: 170.95427630 + 0.40805281 * T,
			Omega: 74.01692503 + 0.04240589 * T
		},
		'neptune': {
			a: 30.06992276,
			e: 0.00859048 + 0.00005105 * T,
			I: 1.77004347 + 0.00035372 * T,
			L: 304.88003542 + 218.45945325 * T,
			w_bar: 44.96476227 - 0.32241464 * T,
			Omega: 131.78422574 - 0.00508664 * T
		}
	};
	
	const elem = orbitalElements[planetName];
	if (!elem) return { x: 0, y: 0, z: 0, distance: 0 };
	
	const M = normalizeAngle(elem.L - elem.w_bar);
	
	let E = M * Math.PI / 180;
	const e = elem.e;
	for (let i = 0; i < 10; i++) {
		const dE = (E - e * Math.sin(E) - M * Math.PI / 180) / (1 - e * Math.cos(E));
		E -= dE;
		if (Math.abs(dE) < 1e-8) break;
	}
	
	const v = 2 * Math.atan2(
		Math.sqrt(1 + e) * Math.sin(E / 2),
		Math.sqrt(1 - e) * Math.cos(E / 2)
	);
	
	const r = elem.a * (1 - e * Math.cos(E));
	
	const x_orbital = r * Math.cos(v);
	const y_orbital = r * Math.sin(v);
	
	const I = elem.I * Math.PI / 180;
	const Omega = elem.Omega * Math.PI / 180;
	const w = (elem.w_bar - elem.Omega) * Math.PI / 180;
	
	const x_ecl = (Math.cos(w) * Math.cos(Omega) - Math.sin(w) * Math.sin(Omega) * Math.cos(I)) * x_orbital +
				  (-Math.sin(w) * Math.cos(Omega) - Math.cos(w) * Math.sin(Omega) * Math.cos(I)) * y_orbital;
	const y_ecl = (Math.cos(w) * Math.sin(Omega) + Math.sin(w) * Math.cos(Omega) * Math.cos(I)) * x_orbital +
				  (-Math.sin(w) * Math.sin(Omega) + Math.cos(w) * Math.cos(Omega) * Math.cos(I)) * y_orbital;
	const z_ecl = (Math.sin(w) * Math.sin(I)) * x_orbital + (Math.cos(w) * Math.sin(I)) * y_orbital;
	
	return { x: x_ecl, y: y_ecl, z: z_ecl, distance: r };
}

// محاسبه ارتفاع و سمت (altitude & azimuth) خورشید
function calculateSunAltitude(date, lat, lon) {
	const jd = dateToJulianDay(date);
	const T = julianCenturies(jd);
	
	// Mean longitude of Sun
	const L0 = normalizeAngle(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
	
	// Mean anomaly of Sun
	const M = normalizeAngle(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
	const M_rad = M * Math.PI / 180;
	
	// Equation of center
	const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M_rad) +
			  (0.019993 - 0.000101 * T) * Math.sin(2 * M_rad) +
			  0.000289 * Math.sin(3 * M_rad);
	
	// True longitude
	const sunLon = normalizeAngle(L0 + C);
	const sunLon_rad = sunLon * Math.PI / 180;
	
	// Obliquity of ecliptic
	const epsilon = (23.439291 - 0.0130042 * T - 0.00000016 * T * T + 0.000000504 * T * T * T) * Math.PI / 180;
	
	// Declination
	const delta = Math.asin(Math.sin(epsilon) * Math.sin(sunLon_rad));
	
	// Equation of Time (minutes)
	const E = 4 * (L0 - 0.0057183 - normalizeAngle(L0 - M) + C);
	
	// Hour angle - اصلاح شده برای محاسبه دقیق با استفاده از UTC
	const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
	const longitudeCorrection = lon / 15; // تبدیل طول جغرافیایی به ساعت
	const localSolarTime = utcHours + longitudeCorrection + E / 60;
	const hourAngle = (localSolarTime - 12) * 15; // degrees
	const H_rad = hourAngle * Math.PI / 180;
	
	const lat_rad = lat * Math.PI / 180;
	
	// Altitude
	const altitude = Math.asin(
		Math.sin(lat_rad) * Math.sin(delta) +
		Math.cos(lat_rad) * Math.cos(delta) * Math.cos(H_rad)
	) * 180 / Math.PI;
	
	// Azimuth
	const azimuth = Math.atan2(
		Math.sin(H_rad),
		Math.cos(H_rad) * Math.sin(lat_rad) - Math.tan(delta) * Math.cos(lat_rad)
	) * 180 / Math.PI + 180;
	
	// DEBUG: لاگ اطلاعات برای بررسی
	console.log('🌞 Sun Altitude Calculation:');
	console.log('  UTC Time:', date.toISOString());
	console.log('  Latitude:', lat.toFixed(2), '  Longitude:', lon.toFixed(2));
	console.log('  UTC Hours:', utcHours.toFixed(2));
	console.log('  Longitude Correction:', longitudeCorrection.toFixed(2), 'hours');
	console.log('  Local Solar Time:', localSolarTime.toFixed(2), 'hours');
	console.log('  Hour Angle:', hourAngle.toFixed(2), 'degrees');
	console.log('  Declination:', (delta * 180 / Math.PI).toFixed(2), 'degrees');
	console.log('  ✅ ALTITUDE:', altitude.toFixed(2), 'degrees');
	console.log('  ✅ AZIMUTH:', normalizeAngle(azimuth).toFixed(2), 'degrees');
	
	return { altitude, azimuth: normalizeAngle(azimuth) };
}

// محاسبه تقریبی ارتفاع و سمت ماه
function calculateMoonAltitude(date, lat, lon, moonPhase) {
	const sunAlt = calculateSunAltitude(date, lat, lon);
	
	// تقریب ساده: ماه در فاز کامل (0.5) در مقابل خورشید است
	const phaseDeg = moonPhase * 360;
	const moonAzimuth = normalizeAngle(sunAlt.azimuth + phaseDeg);
	
	// تقریب ارتفاع: بر اساس فاز و موقعیت خورشید
	const oppositeAltitude = -sunAlt.altitude;
	const moonAltitude = oppositeAltitude + (Math.sin(phaseDeg * Math.PI / 180) * 15);
	
	return { altitude: moonAltitude, azimuth: moonAzimuth };
}

// رسم قوس نمایش ارتفاع (altitude arc)
function renderAltitudeArc(container, altitude, color) {
	if (!container) return;
	
	container.innerHTML = '';
	
	// محدود کردن altitude به 0-90 درجه
	const clampedAlt = Math.max(0, Math.min(90, altitude));
	
	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('width', '100');
	svg.setAttribute('height', '60');
	svg.setAttribute('viewBox', '0 0 100 60');
	
	// خط افق
	const horizon = document.createElementNS('http://www.w3.org/2000/svg', 'line');
	horizon.setAttribute('x1', '10');
	horizon.setAttribute('y1', '50');
	horizon.setAttribute('x2', '90');
	horizon.setAttribute('y2', '50');
	horizon.setAttribute('stroke', 'rgba(255,255,255,0.3)');
	horizon.setAttribute('stroke-width', '1');
	svg.appendChild(horizon);
	
	// قوس آسمان
	const skyArc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	skyArc.setAttribute('d', 'M 10,50 Q 50,10 90,50');
	skyArc.setAttribute('fill', 'none');
	skyArc.setAttribute('stroke', 'rgba(135,206,235,0.3)');
	skyArc.setAttribute('stroke-width', '1');
	skyArc.setAttribute('stroke-dasharray', '2,2');
	svg.appendChild(skyArc);
	
	// محاسبه موقعیت بر اساس ارتفاع
	const t = clampedAlt / 90;
	const x = 10 + 80 * 0.5;
	const y = 50 - (40 * t);
	
	// خط ارتفاع
	const altLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
	altLine.setAttribute('x1', '50');
	altLine.setAttribute('y1', '50');
	altLine.setAttribute('x2', x.toString());
	altLine.setAttribute('y2', y.toString());
	altLine.setAttribute('stroke', color);
	altLine.setAttribute('stroke-width', '2');
	altLine.setAttribute('opacity', '0.7');
	svg.appendChild(altLine);
	
	// دایره نمایش جسم آسمانی
	const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	circle.setAttribute('cx', x.toString());
	circle.setAttribute('cy', y.toString());
	circle.setAttribute('r', '4');
	circle.setAttribute('fill', color);
	svg.appendChild(circle);
	
	// انیمیشن
	const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
	animate.setAttribute('attributeName', 'r');
	animate.setAttribute('values', '4;5;4');
	animate.setAttribute('dur', '2s');
	animate.setAttribute('repeatCount', 'indefinite');
	circle.appendChild(animate);
	
	// نمایش عدد ارتفاع
	const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	text.setAttribute('x', '50');
	text.setAttribute('y', '8');
	text.setAttribute('text-anchor', 'middle');
	text.setAttribute('fill', color);
	text.setAttribute('font-size', '10');
	text.setAttribute('font-weight', 'bold');
	text.textContent = `${formatNumber(Math.round(clampedAlt))}°`;
	svg.appendChild(text);
	
	container.appendChild(svg);
}

// Moon rise/set (simplified approximation)
function getMoonRiseSet(date, lat, lon, sunrise, sunset) {
	const moonPhase = getMoonPhase(date);
	const sr = new Date(sunrise);
	const ss = new Date(sunset);
	const dayLength = (ss - sr) / 1000 / 3600;
	
	// تقریب ساده: ماه معمولا با تاخیر نسبت به خورشید طلوع می‌کند
	const moonRise = new Date(sr.getTime() + (moonPhase.phase * 24 * 3600 * 1000));
	const moonSet = new Date(ss.getTime() + (moonPhase.phase * 24 * 3600 * 1000));
	
	return { moonrise: moonRise.toISOString(), moonset: moonSet.toISOString() };
}

// محاسبه فاصله ماه از زمین (تقریبی)
function calculateMoonDistance(date) {
	// محاسبه بر اساس Julian Day
	const jd = dateToJulianDay(date);
	const T = (jd - 2451545.0) / 36525.0;
	
	// Mean longitude of Moon
	const Lm = normalizeAngle(218.316 + 481267.881 * T);
	
	// Mean anomaly of Moon
	const M = normalizeAngle(134.963 + 477198.868 * T) * Math.PI / 180;
	
	// Mean elongation
	const D = normalizeAngle(297.850 + 445267.112 * T) * Math.PI / 180;
	
	// فاصله ماه (km) - فرمول ساده شده
	// فاصله متوسط: 384,400 km
	// بیشترین: ~406,700 km (apogee)
	// کمترین: ~356,500 km (perigee)
	const distance = 385000 - 21000 * Math.cos(M) - 3700 * Math.cos(2*D - M);
	
	return distance;
}

// UV Index label
function getUVLabel(uv) {
	if (uv == null) return '—';
	const val = formatNumber(Math.round(uv));
	if (uv < 3) return `${val} - ${t('uvLow')}`;
	if (uv < 6) return `${val} - ${t('uvModerate')}`;
	if (uv < 8) return `${val} - ${t('uvHigh')}`;
	if (uv < 11) return `${val} - ${t('uvVeryHigh')}`;
	return `${val} - ${t('uvExtreme')}`;
}

// AQI label
function getAQILabel(aqi) {
	if (aqi == null) return '—';
	const val = Math.round(aqi);
	const valStr = formatNumber(val);
	if (val <= 50) return `${valStr} - ${t('aqiGood')}`;
	if (val <= 100) return `${valStr} - ${t('aqiModerate')}`;
	if (val <= 150) return `${valStr} - ${t('aqiUnhealthySensitive')}`;
	if (val <= 200) return `${valStr} - ${t('aqiUnhealthy')}`;
	if (val <= 300) return `${valStr} - ${t('aqiVeryUnhealthy')}`;
	return `${valStr} - ${t('aqiHazardous')}`;
}

// Weather code mapping
function weatherCodeToInfo(code, isDay = 1) {
	const weatherKeys = {
		0: 'sunny',
		1: 'partlyCloudy',
		2: 'cloudy',
		3: 'cloudy',
		45: 'fog',
		48: 'rime',
		51: 'drizzleLight',
		53: 'drizzle',
		55: 'drizzleHeavy',
		56: 'freezingDrizzle',
		57: 'freezingDrizzle',
		61: 'rain',
		63: 'rainModerate',
		65: 'rainHeavy',
		66: 'freezingRain',
		67: 'freezingRain',
		71: 'snowLight',
		73: 'snow',
		75: 'snowHeavy',
		77: 'snowGrains',
		80: 'showers',
		81: 'showersModerate',
		82: 'showersHeavy',
		85: 'snowShowers',
		86: 'snowShowers',
		95: 'thunderstorm',
		96: 'hail',
		99: 'hail',
	};
	
	const iconMap = {
		0: 'sunny', 1: 'sunny', 2: 'cloudy', 3: 'cloudy',
		45: 'cloudy', 48: 'cloudy',
		51: 'rainy', 53: 'rainy', 55: 'rainy', 56: 'rainy', 57: 'rainy',
		61: 'rainy', 63: 'rainy', 65: 'rainy', 66: 'rainy', 67: 'rainy',
		71: 'snowy', 73: 'snowy', 75: 'snowy', 77: 'snowy',
		80: 'rainy', 81: 'rainy', 82: 'rainy',
		85: 'snowy', 86: 'snowy',
		95: 'rainy', 96: 'rainy', 99: 'rainy'
	};
	
	const key = iconMap[code] || 'cloudy';
	const labelKey = weatherKeys[code] || 'cloudy';
	const label = t(labelKey);
	
	return { key, label, theme: (isDay ? key + '-day' : 'night') };
}

// Icon rendering
function renderIcon(container, type, size = 'large') {
	container.innerHTML = '';
	container.className = 'wx-icon' + (size === 'small' ? ' small' : '');
	if (type === 'sunny') {
		const sun = document.createElement('div');
		sun.className = 'sun';
		sun.innerHTML = '<div class="core"></div><div class="rays"></div>';
		container.appendChild(sun);
		return;
	}
	const big = document.createElement('div'); big.className = 'cloud big';
	const small = document.createElement('div'); small.className = 'cloud small';
	container.appendChild(big); container.appendChild(small);
	if (type === 'rainy') {
		for (let i = 0; i < 14; i++) {
			const d = document.createElement('div');
			d.className = 'drop';
			d.style.left = `${18 + Math.random() * 60}%`;
			d.style.animationDelay = `${Math.random() * 1.2}s`;
			d.style.animationDuration = `${1.1 + Math.random() * 0.8}s`;
			container.appendChild(d);
		}
	}
	if (type === 'snowy') {
		for (let i = 0; i < 12; i++) {
			const f = document.createElement('div');
			f.className = 'flake';
			f.style.left = `${18 + Math.random() * 60}%`;
			f.style.animationDelay = `${Math.random() * 1.8}s`;
			f.style.animationDuration = `${2.2 + Math.random() * 1.4}s`;
			container.appendChild(f);
		}
	}
}

function setTheme(info) {
	const b = document.body;
	b.classList.remove('theme-default', 'theme-sunny-day', 'theme-cloudy', 'theme-rainy', 'theme-snowy', 'theme-night');
	switch (info.theme) {
		case 'sunny-day': b.classList.add('theme-sunny-day'); break;
		case 'cloudy-day': b.classList.add('theme-cloudy'); break;
		case 'rainy-day': b.classList.add('theme-rainy'); break;
		case 'snowy-day': b.classList.add('theme-snowy'); break;
		case 'night': b.classList.add('theme-night'); break;
		default: b.classList.add('theme-default');
	}
}

// Data fetching
async function fetchJson(url) {
	const res = await fetch(url);
	if (!res.ok) throw new Error('خطا در دریافت اطلاعات');
	return res.json();
}

async function geocodeSearch(q) {
	const url = `${OPEN_METEO.search}?name=${encodeURIComponent(q)}&count=8&language=fa&format=json`;
	const data = await fetchJson(url);
	return (data.results || []).map(r => ({
		name: r.name,
		country: r.country || '',
		admin1: r.admin1 || '',
		lat: r.latitude,
		lon: r.longitude,
		timezone: r.timezone
	}));
}

async function reverseGeocode(lat, lon) {
	try {
		// ابتدا با زبان فارسی تلاش می‌کنیم
		let url = `${OPEN_METEO.reverse}?latitude=${lat}&longitude=${lon}&language=fa&format=json`;
		console.log('🔍 Reverse Geocoding (FA):', url);
		let data = await fetchJson(url);
		console.log('📍 Reverse Geocode Response (FA):', data);
		
		let r = data.results && data.results[0];
		
		// اگر نتیجه‌ای نگرفتیم، با زبان انگلیسی امتحان می‌کنیم
		if (!r) {
			console.log('🔄 Trying English...');
			url = `${OPEN_METEO.reverse}?latitude=${lat}&longitude=${lon}&language=en&format=json`;
			data = await fetchJson(url);
			console.log('📍 Reverse Geocode Response (EN):', data);
			r = data.results && data.results[0];
		}
		
		if (!r) {
			console.warn('⚠️ No results from reverse geocode');
			return null;
		}
		
		const place = { 
			name: r.name || r.city || r.locality || t('yourLocation'), 
			country: r.country || '', 
			admin1: r.admin1 || '', 
			timezone: r.timezone 
		};
		console.log('✅ Location found:', place.name);
		return place;
	} catch (e) { 
		console.error('❌ Reverse geocode error:', e);
		return null; 
	}
}

async function fetchWeather(lat, lon) {
	const url = `${OPEN_METEO.forecast}?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,is_day,surface_pressure,visibility,dew_point_2m,uv_index&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,uv_index_max&timezone=auto&forecast_days=16`;
	const data = await fetchJson(url);
	return normalizeWeather(data);
}

async function fetchAirQuality(lat, lon) {
	try {
		const url = `${OPEN_METEO.airQuality}?latitude=${lat}&longitude=${lon}&current=us_aqi&timezone=auto`;
		const data = await fetchJson(url);
		return data.current?.us_aqi;
	} catch { return null; }
}

async function fetchHistoricalData(lat, lon, period) {
	const end = new Date();
	const start = new Date();
	switch (period) {
		case 'week': start.setDate(end.getDate() - 7); break;
		case 'month': start.setMonth(end.getMonth() - 1); break;
		case '6months': start.setMonth(end.getMonth() - 6); break;
		case 'year': start.setFullYear(end.getFullYear() - 1); break;
	}
	const startStr = start.toISOString().split('T')[0];
	const endStr = end.toISOString().split('T')[0];
	const url = `${OPEN_METEO.archive}?latitude=${lat}&longitude=${lon}&start_date=${startStr}&end_date=${endStr}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
	try {
		const data = await fetchJson(url);
		return data.daily;
	} catch { return null; }
}

function normalizeWeather(data) {
	const tz = data.timezone || 'auto';
	let current = {};
	if (data.current) {
		current = {
			time: data.current.time,
			tempC: data.current.temperature_2m,
			apparentC: data.current.apparent_temperature,
			humidity: data.current.relative_humidity_2m,
			precipMm: data.current.precipitation ?? 0,
			code: data.current.weather_code,
			windMs: data.current.wind_speed_10m,
			isDay: data.current.is_day,
			pressure: data.current.surface_pressure,
			visibility: data.current.visibility,
			dewpoint: data.current.dew_point_2m,
			uvIndex: data.current.uv_index,
		};
	}
	const hourly = [];
	if (data.hourly?.time) {
		for (let i = 0; i < data.hourly.time.length; i++) {
			hourly.push({
				time: data.hourly.time[i],
				tempC: data.hourly.temperature_2m?.[i],
				humidity: data.hourly.relative_humidity_2m?.[i],
				precipProb: data.hourly.precipitation_probability?.[i],
				precipMm: data.hourly.precipitation?.[i],
				code: data.hourly.weather_code?.[i],
				windMs: data.hourly.wind_speed_10m?.[i],
				uvIndex: data.hourly.uv_index?.[i],
			});
		}
	}
	const daily = [];
	if (data.daily?.time) {
		for (let i = 0; i < data.daily.time.length; i++) {
			daily.push({
				time: data.daily.time[i],
				code: data.daily.weather_code?.[i],
				minC: data.daily.temperature_2m_min?.[i],
				maxC: data.daily.temperature_2m_max?.[i],
				sunrise: data.daily.sunrise?.[i],
				sunset: data.daily.sunset?.[i],
				precipSum: data.daily.precipitation_sum?.[i],
				precipProbMax: data.daily.precipitation_probability_max?.[i],
				uvIndexMax: data.daily.uv_index_max?.[i],
			});
		}
	}
	return { timezone: tz, current, hourly, daily };
}

// Render for selected day
function renderSelectedDay() {
	if (!state.place || !state.weather) return;
	const tz = state.weather.timezone;
	const dayData = state.weather.daily[state.selectedDayIndex];
	if (!dayData) return;
	
	// شروع ساعت زنده
	startLiveClock(tz);
	
	// Update date selector
	if (state.selectedDayIndex === 0) {
		el.selectedDate.textContent = t('today');
	} else if (state.selectedDayIndex === 1) {
		el.selectedDate.textContent = t('tomorrow');
	} else {
		el.selectedDate.textContent = fmtDayName(dayData.time, tz);
	}
	
	// Get hourly data for that day
	const dayStr = dayData.time.split('T')[0];
	const hourlyForDay = state.weather.hourly.filter(h => h.time.startsWith(dayStr));
	
	// If today, use current weather; otherwise use first hour of the day or average
	let displayData;
	if (state.selectedDayIndex === 0 && state.weather.current) {
		displayData = state.weather.current;
	} else if (hourlyForDay.length > 0) {
		const midDay = hourlyForDay[Math.floor(hourlyForDay.length / 2)];
		displayData = {
			time: midDay.time,
			tempC: (dayData.maxC + dayData.minC) / 2,
			apparentC: midDay.tempC,
			humidity: midDay.humidity,
			precipMm: dayData.precipSum,
			code: dayData.code,
			windMs: midDay.windMs,
			isDay: 1,
			pressure: null,
			visibility: null,
			dewpoint: null,
			uvIndex: dayData.uvIndexMax,
		};
	} else {
		displayData = {
			time: dayData.time,
			tempC: (dayData.maxC + dayData.minC) / 2,
			apparentC: null,
			humidity: null,
			precipMm: dayData.precipSum,
			code: dayData.code,
			windMs: null,
			isDay: 1,
			pressure: null,
			visibility: null,
			dewpoint: null,
			uvIndex: dayData.uvIndexMax,
		};
	}
	
	const info = weatherCodeToInfo(displayData.code, displayData.isDay);
	setTheme(info);
	
	// ساخت نام محل
	let displayName = state.place.name;
	
	// اگر از موقعیت کاربر استفاده شده، اضافه کردن "(موقعیت شما)"
	if (state.place.isUserLocation) {
		displayName = `${state.place.name} (${t('yourLocation')})`;
	}
	
	const nameParts = [displayName, state.place.admin1, state.place.country].filter(Boolean);
	el.placeName.textContent = nameParts.join('، ');
	el.updatedAt.textContent = `${fmtDateLong(dayData.time, tz)}`;
	
	renderIcon(el.icon, info.key);
	el.temp.textContent = fmtTemp(displayData.tempC);
	el.condition.textContent = info.label;
	// Update stat cards with animations
	updateStatCard('feelsLike', fmtTemp(displayData.apparentC), 'feelsLikeBar', normalizeTemp(displayData.apparentC));
	updateStatCard('humidity', fmtPercent(displayData.humidity), 'humidityBar', displayData.humidity || 0);
	
	const windKmh = displayData.windMs == null ? 0 : msToKmh(displayData.windMs);
	updateStatCard('wind', displayData.windMs == null ? '—' : `${formatNumber(windKmh)} km/h`, 'windBar', Math.min(windKmh / 100 * 100, 100));
	
	updateStatCard('pressure', fmthPa(displayData.pressure), 'pressureBar', normalizePressure(displayData.pressure));
	updateStatCard('visibility', fmtKm(displayData.visibility), 'visibilityBar', normalizeVisibility(displayData.visibility));
	updateStatCard('dewpoint', fmtTemp(displayData.dewpoint));
	
	const precipProb = dayData.precipProbMax != null ? dayData.precipProbMax : 0;
	updateStatCard('precip', dayData.precipProbMax != null ? `${fmtPercent(dayData.precipProbMax)} ${t('chance')}` : fmtMm(displayData.precipMm), 'precipBar', precipProb);
	
	updateStatCard('uvIndex', getUVLabel(displayData.uvIndex), 'uvBar', Math.min((displayData.uvIndex || 0) / 11 * 100, 100));
	
	const aqiValue = state.selectedDayIndex === 0 && state.airQuality != null ? state.airQuality : 0;
	updateStatCard('aqi', state.selectedDayIndex === 0 && state.airQuality != null ? getAQILabel(state.airQuality) : '—', 'aqiBar', Math.min(aqiValue / 300 * 100, 100));
	
	updateStatCard('sunrise', dayData.sunrise ? fmtTime(dayData.sunrise, tz) : '—');
	updateStatCard('sunset', dayData.sunset ? fmtTime(dayData.sunset, tz) : '—');
	
	const dateForMoon = new Date(dayData.time);
	const moonData = getMoonPhase(dateForMoon);
	updateStatCard('moonPhase', moonData.name);
	
	renderHourlyForDay(hourlyForDay, tz);
	renderDaily();
	renderSunMoonTracks(dayData, tz, dateForMoon);
	renderSolarSystem(moonData.phase);
}

function renderHourlyForDay(hourlyData, tz) {
	el.hourlyList.innerHTML = '';
	if (hourlyData.length === 0) {
		el.hourlyList.innerHTML = `<div style="color: var(--muted); padding: 20px; text-align: center;">${t('noHourlyData')}</div>`;
		return;
	}
	hourlyData.forEach(h => {
		const item = document.createElement('div');
		item.className = 'hour';
		const icon = document.createElement('div');
		const info = weatherCodeToInfo(h.code, 1);
		renderIcon(icon, info.key, 'small');
		
		const timeDiv = document.createElement('div');
		timeDiv.className = 'time';
		timeDiv.textContent = fmtTime(h.time, tz);
		
		const tempDiv = document.createElement('div');
		tempDiv.className = 't';
		tempDiv.textContent = fmtTemp(h.tempC);
		
		const precipDiv = document.createElement('div');
		precipDiv.className = 'p';
		precipDiv.textContent = h.precipProb != null ? fmtPercent(h.precipProb) : '';
		
		item.appendChild(timeDiv);
		item.appendChild(icon);
		item.appendChild(tempDiv);
		item.appendChild(precipDiv);
		el.hourlyList.appendChild(item);
	});
}

function renderDaily() {
	const tz = state.weather.timezone;
	el.dailyList.innerHTML = '';
	const days = state.currentDayView === 7 ? 7 : 14;
	state.weather.daily.slice(0, days).forEach((d, idx) => {
		const card = document.createElement('div'); 
		card.className = 'day';
		if (idx === state.selectedDayIndex) {
			card.style.background = 'rgba(124,211,255,0.15)';
			card.style.borderColor = 'rgba(124,211,255,0.5)';
		}
		card.style.cursor = 'pointer';
		card.addEventListener('click', (e) => {
			e.preventDefault();
			changeSelectedDay(idx);
		});
		
		const icon = document.createElement('div');
		const info = weatherCodeToInfo(d.code, 1);
		renderIcon(icon, info.key, 'small');
		
		const nameEl = document.createElement('div'); 
		nameEl.className = 'name'; 
		nameEl.textContent = idx === 0 ? t('today') : (idx === 1 ? t('tomorrow') : fmtDayName(d.time, tz));
		
		const dateEl = document.createElement('div'); 
		dateEl.className = 'date'; 
		dateEl.textContent = fmtDateShort(d.time, tz);
		
		const minmax = document.createElement('div'); 
		minmax.className = 'minmax'; 
		minmax.textContent = `${fmtTemp(d.maxC)} / ${fmtTemp(d.minC)}`;
		
		card.appendChild(nameEl); 
		card.appendChild(dateEl); 
		card.appendChild(icon); 
		card.appendChild(minmax);
		el.dailyList.appendChild(card);
	});
}

function changeSelectedDay(dayIndex) {
	state.selectedDayIndex = dayIndex;
	
	// ریست ساعت
	if (dayIndex === 0) {
		state.solarSystemHour = null;
		const now = new Date();
		if (el.solarSystemHour) {
			el.solarSystemHour.value = now.getHours();
			const hourStr = now.getHours().toString().padStart(2, '0');
			const minStr = now.getMinutes().toString().padStart(2, '0');
			if (el.solarSystemHourDisplay) {
				el.solarSystemHourDisplay.textContent = `${formatNumber(hourStr)}:${formatNumber(minStr)}`;
			}
		}
	} else {
		state.solarSystemHour = 12;
		if (el.solarSystemHour) {
			el.solarSystemHour.value = 12;
		}
		if (el.solarSystemHourDisplay) {
			el.solarSystemHourDisplay.textContent = `${formatNumber('12')}:${formatNumber('00')}`;
		}
	}
	
	renderSelectedDay();
}

function renderSunMoonTracks(dayData, tz, date) {
	if (!dayData.sunrise || !dayData.sunset) return;
	
	// استفاده از timezone دقیق برای محاسبه زمان فعلی
	const now = new Date();
	const sr = new Date(dayData.sunrise);
	const ss = new Date(dayData.sunset);
	
	// DEBUG: برای بررسی دقیق زمان‌ها
	console.log('🌅 Debug Sun Position:');
	console.log('Timezone:', tz);
	console.log('Current Time (UTC):', now.toISOString());
	console.log('Current Time (Local TZ):', now.toLocaleString('fa-IR', { timeZone: tz, hour12: false }));
	console.log('Sunrise (UTC):', sr.toISOString(), '→ Local:', fmtTime(dayData.sunrise, tz));
	console.log('Sunset (UTC):', ss.toISOString(), '→ Local:', fmtTime(dayData.sunset, tz));
	console.log('Timestamps - Now:', now.getTime(), 'Sunrise:', sr.getTime(), 'Sunset:', ss.getTime());
	console.log('Time comparisons:');
	console.log('  now < sr:', now < sr, '(before sunrise)');
	console.log('  now > ss:', now > ss, '(after sunset)');
	console.log('  sr < now < ss:', now >= sr && now <= ss, '(sun is up)');
	
	// نمایش ساعت طلوع و غروب زیر ایموجی‌ها
	const sunRiseLabel = document.getElementById('sunRiseTimeLabel');
	const sunSetLabel = document.getElementById('sunSetTimeLabel');
	if (sunRiseLabel) sunRiseLabel.textContent = fmtTime(dayData.sunrise, tz);
	if (sunSetLabel) sunSetLabel.textContent = fmtTime(dayData.sunset, tz);
	
	// Sun position
	const isToday = state.selectedDayIndex === 0;
	let sunPercent = 0;
	let sunStatusText = '';
	
	if (isToday) {
		if (now < sr) {
			sunPercent = 0;
			const minutesUntil = Math.floor((sr - now) / 60000);
			const hoursUntil = Math.floor(minutesUntil / 60);
			const minsRemaining = minutesUntil % 60;
			sunStatusText = `🌅 ${t('sunNotRisen')}\n${hoursUntil > 0 ? formatNumber(hoursUntil) + ' ' + t('hour') + ' ' + t('and') + ' ' : ''}${formatNumber(minsRemaining)} ${t('minute')} ${t('untilRise')}`;
		} else if (now > ss) {
			sunPercent = 100;
			const minutesSince = Math.floor((now - ss) / 60000);
			const hoursSince = Math.floor(minutesSince / 60);
			const minsSince = minutesSince % 60;
			sunStatusText = `🌇 ${t('sunSet')}\n${hoursSince > 0 ? formatNumber(hoursSince) + ' ' + t('hour') + ' ' + t('and') + ' ' : ''}${formatNumber(minsSince)} ${t('minute')} ${t('sinceSet')}`;
		} else {
			sunPercent = ((now - sr) / (ss - sr)) * 100;
			const remaining = Math.floor((ss - now) / 60000);
			const hoursLeft = Math.floor(remaining / 60);
			const minsLeft = remaining % 60;
			const elapsed = Math.floor((now - sr) / 60000);
			const hoursElapsed = Math.floor(elapsed / 60);
			const minsElapsed = elapsed % 60;
			
			// DEBUG
			console.log('☀️ Sun is UP!');
			console.log('Time since sunrise (ms):', now - sr);
			console.log('Total day length (ms):', ss - sr);
			console.log('Position %:', sunPercent);
			
			sunStatusText = `☀️ ${t('sunRisen')}\n${t('position')}: ${formatNumber(Math.round(sunPercent))}% ${t('ofPath')}\n${hoursLeft > 0 ? formatNumber(hoursLeft) + ' ' + t('hour') + ' ' + t('and') + ' ' : ''}${formatNumber(minsLeft)} ${t('minute')} ${t('untilSet')} | ${hoursElapsed > 0 ? formatNumber(hoursElapsed) + ' ' + t('hour') + ' ' + t('and') + ' ' : ''}${formatNumber(minsElapsed)} ${t('minute')} ${t('untilRise')}`;
		}
	} else {
		sunPercent = 50;
		const dayLengthHours = ((ss - sr) / 3600000).toFixed(1);
		sunStatusText = `${t('dayLength')}: ${formatNumber(parseFloat(dayLengthHours))} ${t('hour')}`;
	}
	
	// محاسبه موقعیت روی قوس (Quadratic Bezier Curve)
	const bezierT = sunPercent / 100; // 0 to 1
	const x0 = 50, y0 = 160;  // شروع (طلوع)
	const xc = 300, yc = 30;  // نقطه کنترل (اوج)
	const x1 = 550, y1 = 160; // پایان (غروب)
	
	const sunX = Math.pow(1 - bezierT, 2) * x0 + 2 * (1 - bezierT) * bezierT * xc + Math.pow(bezierT, 2) * x1;
	const sunY = Math.pow(1 - bezierT, 2) * y0 + 2 * (1 - bezierT) * bezierT * yc + Math.pow(bezierT, 2) * y1;
	
	const sunMarker = document.getElementById('sunPositionMarker');
	if (sunMarker) {
		// اگر امروز نیست، خورشید را مخفی کن
		if (!isToday) {
			sunMarker.style.display = 'none';
		} else {
			sunMarker.style.display = 'block';
			
			const circles = sunMarker.querySelectorAll('circle');
			const sunEmoji = sunMarker.querySelector('text');
			
			// به‌روزرسانی موقعیت دایره‌ها
			circles.forEach(circle => {
				circle.setAttribute('cx', sunX);
				circle.setAttribute('cy', sunY);
			});
			
			// به‌روزرسانی موقعیت ایموجی خورشید
			if (sunEmoji) {
				sunEmoji.setAttribute('x', sunX);
				sunEmoji.setAttribute('y', sunY + 13);
			}
			
			// به‌روزرسانی زاویه خورشید
			const sunAngleText = document.getElementById('sunAngleText');
			if (sunAngleText && state.place) {
				const sunAlt = calculateSunAltitude(now, state.place.lat, state.place.lon);
				sunAngleText.setAttribute('x', sunX);
				sunAngleText.setAttribute('y', sunY - 25);
				sunAngleText.textContent = `${formatNumber(Math.round(Math.max(0, sunAlt.altitude)))}°`;
			}
			
			// به‌روزرسانی باکس اطلاعات
			const infoBox = document.getElementById('sunInfoBox');
			if (infoBox) {
				const rect = infoBox.querySelector('rect');
				// قرار دادن باکس در سمت راست خورشید
				const boxX = sunX + 10;
				const boxY = sunY - 35;
				rect.setAttribute('x', boxX);
				rect.setAttribute('y', boxY);
				
				// به‌روزرسانی متن‌های داخل باکس
				const percentText = document.getElementById('sunPercentText');
				const timeLeftText = document.getElementById('sunTimeLeftText');
				const altText = document.getElementById('sunAltText');
				
				if (percentText) {
					percentText.setAttribute('x', boxX + 50);
					percentText.setAttribute('y', boxY + 18);
					percentText.textContent = `${formatNumber(Math.round(sunPercent))}% ${t('ofPath')}`;
				}
				
				if (timeLeftText) {
					timeLeftText.setAttribute('x', boxX + 50);
					timeLeftText.setAttribute('y', boxY + 32);
					if (now >= sr && now <= ss) {
						const remaining = Math.floor((ss - now) / 60000);
						const hoursLeft = Math.floor(remaining / 60);
						const minsLeft = remaining % 60;
						const hourUnit = currentLang === 'fa' ? 'س' : 'h';
						const minUnit = currentLang === 'fa' ? 'د' : 'm';
						const andWord = currentLang === 'fa' ? ' و ' : ' ';
						const untilSet = currentLang === 'fa' ? 'تا غروب' : t('untilSet');
						timeLeftText.textContent = `${hoursLeft > 0 ? formatNumber(hoursLeft) + hourUnit : ''}${hoursLeft > 0 ? andWord : ''}${formatNumber(minsLeft)}${minUnit} ${untilSet}`;
					} else if (now < sr) {
						const minutesUntil = Math.floor((sr - now) / 60000);
						const hoursUntil = Math.floor(minutesUntil / 60);
						const minsRemaining = minutesUntil % 60;
						const hourUnit = currentLang === 'fa' ? 'س' : 'h';
						const minUnit = currentLang === 'fa' ? 'د' : 'm';
						const andWord = currentLang === 'fa' ? ' و ' : ' ';
						const untilRise = currentLang === 'fa' ? 'تا طلوع' : t('untilRise');
						timeLeftText.textContent = `${hoursUntil > 0 ? formatNumber(hoursUntil) + hourUnit : ''}${hoursUntil > 0 ? andWord : ''}${formatNumber(minsRemaining)}${minUnit} ${untilRise}`;
					} else {
						timeLeftText.textContent = t('sunSet');
					}
				}
				
				if (altText && state.place) {
					altText.setAttribute('x', boxX + 50);
					altText.setAttribute('y', boxY + 46);
					const sunAlt = calculateSunAltitude(now, state.place.lat, state.place.lon);
					altText.textContent = `${t('altitude')}: ${formatNumber(Math.round(Math.max(0, sunAlt.altitude)))}°`;
				}
			}
			
			// نمایش/مخفی کردن بر اساس وضعیت
			sunMarker.style.opacity = (now < sr || now > ss) ? '0.3' : '1';
			
			// افزودن event listener برای نمایش باکس اطلاعات با کلیک و hover (فقط یک بار)
			if (!sunMarker.dataset.listenersAdded) {
				sunMarker.style.cursor = 'pointer';
				
				// برای دسکتاپ: hover
				sunMarker.addEventListener('mouseenter', () => {
					const box = document.getElementById('sunInfoBox');
					if (box) box.style.opacity = '1';
				});
				sunMarker.addEventListener('mouseleave', () => {
					const box = document.getElementById('sunInfoBox');
					const marker = document.getElementById('sunPositionMarker');
					if (box && marker && !marker.dataset.clicked) box.style.opacity = '0';
				});
				
				// برای موبایل: click/touch
				sunMarker.addEventListener('click', (e) => {
					e.stopPropagation();
					const box = document.getElementById('sunInfoBox');
					const marker = document.getElementById('sunPositionMarker');
					if (box && marker) {
						const isVisible = box.style.opacity === '1';
						box.style.opacity = isVisible ? '0' : '1';
						marker.dataset.clicked = isVisible ? '' : 'true';
					}
				});
				
				sunMarker.dataset.listenersAdded = 'true';
			}
		}
	}
	
	// محاسبه و نمایش altitude/azimuth خورشید
	if (state.place && isToday) {
		const sunAlt = calculateSunAltitude(now, state.place.lat, state.place.lon);
		const altStr = `${t('altitude')}: ${formatNumber(Math.round(sunAlt.altitude))}°`;
		const azStr = `${t('azimuth')}: ${formatNumber(Math.round(sunAlt.azimuth))}°`;
		sunStatusText += `\n${altStr} | ${azStr}`;
		
		// رسم قوس ارتفاع
		if (el.sunAltitudeArc) {
			renderAltitudeArc(el.sunAltitudeArc, sunAlt.altitude, '#ffa500');
		}
	}
	
	el.sunStatus.textContent = sunStatusText;
	
	// Moon
	const moonTimes = getMoonRiseSet(date, state.place.lat, state.place.lon, dayData.sunrise, dayData.sunset);
	
	// نمایش ساعت طلوع و غروب زیر ایموجی‌های ماه
	const moonRiseLabel = document.getElementById('moonRiseTimeLabel');
	const moonSetLabel = document.getElementById('moonSetTimeLabel');
	if (moonRiseLabel) moonRiseLabel.textContent = fmtTime(moonTimes.moonrise, tz);
	if (moonSetLabel) moonSetLabel.textContent = fmtTime(moonTimes.moonset, tz);
	
	const mr = new Date(moonTimes.moonrise);
	const ms = new Date(moonTimes.moonset);
	let moonPercent = 50;
	let moonStatusText = '';
	
	if (isToday) {
		if (now < mr) {
			moonPercent = 0;
			const minutesUntil = Math.floor((mr - now) / 60000);
			const hoursUntil = Math.floor(minutesUntil / 60);
			const minsRemaining = minutesUntil % 60;
			moonStatusText = `🌜 ${t('moonNotRisen')}\n${hoursUntil > 0 ? formatNumber(hoursUntil) + ' ' + t('hour') + ' ' + t('and') + ' ' : ''}${formatNumber(minsRemaining)} ${t('minute')} ${t('untilRise')}`;
		} else if (now > ms) {
			moonPercent = 100;
			const minutesSince = Math.floor((now - ms) / 60000);
			const hoursSince = Math.floor(minutesSince / 60);
			const minsSince = minutesSince % 60;
			moonStatusText = `🌛 ${t('moonSet')}\n${hoursSince > 0 ? formatNumber(hoursSince) + ' ' + t('hour') + ' ' + t('and') + ' ' : ''}${formatNumber(minsSince)} ${t('minute')} ${t('sinceSet')}`;
		} else {
			moonPercent = ((now - mr) / (ms - mr)) * 100;
			const remaining = Math.floor((ms - now) / 60000);
			const hoursLeft = Math.floor(remaining / 60);
			const minsLeft = remaining % 60;
			const elapsed = Math.floor((now - mr) / 60000);
			const hoursElapsed = Math.floor(elapsed / 60);
			const minsElapsed = elapsed % 60;
			moonStatusText = `🌙 ${t('moonRisen')}\n${t('position')}: ${formatNumber(Math.round(moonPercent))}% ${t('ofPath')}\n${hoursLeft > 0 ? formatNumber(hoursLeft) + ' ' + t('hour') + ' ' + t('and') + ' ' : ''}${formatNumber(minsLeft)} ${t('minute')} ${t('untilSet')} | ${hoursElapsed > 0 ? formatNumber(hoursElapsed) + ' ' + t('hour') + ' ' + t('and') + ' ' : ''}${formatNumber(minsElapsed)} ${t('minute')} ${t('untilRise')}`;
		}
	} else {
		moonPercent = 50;
		const moonLengthHours = ((ms - mr) / 3600000).toFixed(1);
		moonStatusText = `${t('moonDuration')}: ${formatNumber(parseFloat(moonLengthHours))} ${t('hour')}`;
	}
	
	// محاسبه موقعیت ماه روی قوس (Quadratic Bezier Curve) - استفاده از همان مختصات
	const bezierTMoon = moonPercent / 100; // 0 to 1
	const moonX = Math.pow(1 - bezierTMoon, 2) * x0 + 2 * (1 - bezierTMoon) * bezierTMoon * xc + Math.pow(bezierTMoon, 2) * x1;
	const moonY = Math.pow(1 - bezierTMoon, 2) * y0 + 2 * (1 - bezierTMoon) * bezierTMoon * yc + Math.pow(bezierTMoon, 2) * y1;
	
	const moonMarker = document.getElementById('moonPositionMarker');
	if (moonMarker) {
		// اگر امروز نیست، ماه را مخفی کن
		if (!isToday) {
			moonMarker.style.display = 'none';
		} else {
			moonMarker.style.display = 'block';
			
			const circles = moonMarker.querySelectorAll('circle');
			const moonEmoji = moonMarker.querySelector('text');
			
			// به‌روزرسانی موقعیت دایره‌ها
			circles.forEach(circle => {
				circle.setAttribute('cx', moonX);
				circle.setAttribute('cy', moonY);
			});
			
			// به‌روزرسانی موقعیت ایموجی ماه
			if (moonEmoji) {
				moonEmoji.setAttribute('x', moonX);
				moonEmoji.setAttribute('y', moonY + 12);
			}
			
			// به‌روزرسانی زاویه ماه
			const moonAngleText = document.getElementById('moonAngleText');
			if (moonAngleText && state.place) {
				const moonAlt = calculateMoonAltitude(now, state.place.lat, state.place.lon);
				moonAngleText.setAttribute('x', moonX);
				moonAngleText.setAttribute('y', moonY - 25);
				moonAngleText.textContent = `${formatNumber(Math.round(Math.max(0, moonAlt.altitude)))}°`;
			}
			
			// به‌روزرسانی باکس اطلاعات
			const moonInfoBoxEl = document.getElementById('moonInfoBox');
			if (moonInfoBoxEl) {
				const rect = moonInfoBoxEl.querySelector('rect');
				// قرار دادن باکس در سمت راست ماه
				const boxX = moonX + 10;
				const boxY = moonY - 35;
				rect.setAttribute('x', boxX);
				rect.setAttribute('y', boxY);
				
				// به‌روزرسانی متن‌های داخل باکس
				const percentText = document.getElementById('moonPercentText');
				const timeLeftText = document.getElementById('moonTimeLeftText');
				const phaseText = document.getElementById('moonPhaseText');
				
				if (percentText) {
					percentText.setAttribute('x', boxX + 50);
					percentText.setAttribute('y', boxY + 18);
					percentText.textContent = `${formatNumber(Math.round(moonPercent))}% ${t('ofPath')}`;
				}
				
				if (timeLeftText) {
					timeLeftText.setAttribute('x', boxX + 50);
					timeLeftText.setAttribute('y', boxY + 32);
					if (now >= mr && now <= ms) {
						const remaining = Math.floor((ms - now) / 60000);
						const hoursLeft = Math.floor(remaining / 60);
						const minsLeft = remaining % 60;
						const hourUnit = currentLang === 'fa' ? 'س' : 'h';
						const minUnit = currentLang === 'fa' ? 'د' : 'm';
						const andWord = currentLang === 'fa' ? ' و ' : ' ';
						const untilSet = currentLang === 'fa' ? 'تا غروب' : t('untilSet');
						timeLeftText.textContent = `${hoursLeft > 0 ? formatNumber(hoursLeft) + hourUnit : ''}${hoursLeft > 0 ? andWord : ''}${formatNumber(minsLeft)}${minUnit} ${untilSet}`;
					} else if (now < mr) {
						const minutesUntil = Math.floor((mr - now) / 60000);
						const hoursUntil = Math.floor(minutesUntil / 60);
						const minsRemaining = minutesUntil % 60;
						const hourUnit = currentLang === 'fa' ? 'س' : 'h';
						const minUnit = currentLang === 'fa' ? 'د' : 'm';
						const andWord = currentLang === 'fa' ? ' و ' : ' ';
						const untilRise = currentLang === 'fa' ? 'تا طلوع' : t('untilRise');
						timeLeftText.textContent = `${hoursUntil > 0 ? formatNumber(hoursUntil) + hourUnit : ''}${hoursUntil > 0 ? andWord : ''}${formatNumber(minsRemaining)}${minUnit} ${untilRise}`;
					} else {
						timeLeftText.textContent = t('sunSet');
					}
				}
				
				if (phaseText) {
					phaseText.setAttribute('x', boxX + 50);
					phaseText.setAttribute('y', boxY + 46);
					const moonData = getMoonPhase(date);
					phaseText.textContent = moonData.name;
				}
			}
			
			// نمایش/مخفی کردن بر اساس وضعیت
			moonMarker.style.opacity = (now < mr || now > ms) ? '0.3' : '1';
			
			// افزودن event listener برای نمایش باکس اطلاعات با کلیک و hover (فقط یک بار)
			if (!moonMarker.dataset.listenersAdded) {
				moonMarker.style.cursor = 'pointer';
				
				// برای دسکتاپ: hover
				moonMarker.addEventListener('mouseenter', () => {
					const box = document.getElementById('moonInfoBox');
					if (box) box.style.opacity = '1';
				});
				moonMarker.addEventListener('mouseleave', () => {
					const box = document.getElementById('moonInfoBox');
					const marker = document.getElementById('moonPositionMarker');
					if (box && marker && !marker.dataset.clicked) box.style.opacity = '0';
				});
				
				// برای موبایل: click/touch
				moonMarker.addEventListener('click', (e) => {
					e.stopPropagation();
					const box = document.getElementById('moonInfoBox');
					const marker = document.getElementById('moonPositionMarker');
					if (box && marker) {
						const isVisible = box.style.opacity === '1';
						box.style.opacity = isVisible ? '0' : '1';
						marker.dataset.clicked = isVisible ? '' : 'true';
					}
				});
				
				moonMarker.dataset.listenersAdded = 'true';
			}
		}
	}
	
	// محاسبه و نمایش altitude/azimuth ماه
	if (state.place && isToday) {
		const moonPhaseData = getMoonPhase(date);
		const moonAlt = calculateMoonAltitude(now, state.place.lat, state.place.lon, moonPhaseData.phase);
		const altStr = `${t('altitude')}: ${formatNumber(Math.round(moonAlt.altitude))}°`;
		const azStr = `${t('azimuth')}: ${formatNumber(Math.round(moonAlt.azimuth))}°`;
		moonStatusText += `\n${altStr} | ${azStr}`;
		
		// رسم قوس ارتفاع
		if (el.moonAltitudeArc) {
			renderAltitudeArc(el.moonAltitudeArc, moonAlt.altitude, '#87ceeb');
		}
	}
	
	el.moonStatus.textContent = moonStatusText;
	
	// Moon visual
	const moonData = getMoonPhase(date);
	el.moonPhaseNameBig.textContent = moonData.name;
	el.moonIllumination.textContent = `${t('illuminationLabel')}: ${formatNumber(moonData.illumination)}% | ${t('ageLabel')}: ${formatNumber(Math.round(moonData.moonAge))} ${t('day')}`;
	renderMoonPhase(moonData);
	
	// پر کردن جزئیات کامل خورشید و ماه
	updateSunDetails(sr, ss, date, isToday, now, tz);
	updateMoonDetails(moonData, moonTimes, mr, ms, date, isToday, now, tz);
}

// به‌روزرسانی جزئیات کامل خورشید
function updateSunDetails(sr, ss, date, isToday, now, tz) {
	// 1. طلوع خورشید
	const riseDetail = document.getElementById('sunRiseDetail');
	if (riseDetail) riseDetail.textContent = fmtTime(sr.toISOString(), tz);
	
	// 2. غروب خورشید
	const setDetail = document.getElementById('sunSetDetail');
	if (setDetail) setDetail.textContent = fmtTime(ss.toISOString(), tz);
	
	// 3. طول روز
	const dayLengthDetail = document.getElementById('sunDayLengthDetail');
	if (dayLengthDetail) {
		const durationMs = ss - sr;
		const hours = Math.floor(durationMs / 3600000);
		const minutes = Math.floor((durationMs % 3600000) / 60000);
		dayLengthDetail.textContent = `${formatNumber(hours)} ${t('hour')} ${t('and')} ${formatNumber(minutes)} ${t('minute')}`;
	}
	
	// 4. اوج خورشید (Solar Noon) - وسط بین طلوع و غروب
	const solarNoonDetail = document.getElementById('sunSolarNoonDetail');
	if (solarNoonDetail) {
		const solarNoonTime = new Date((sr.getTime() + ss.getTime()) / 2);
		solarNoonDetail.textContent = fmtTime(solarNoonTime.toISOString(), tz);
	}
	
	// 5. زاویه خورشید (Altitude)
	const altitudeDetail = document.getElementById('sunAltitudeDetail');
	if (altitudeDetail && state.place && isToday) {
		const sunAlt = calculateSunAltitude(now, state.place.lat, state.place.lon);
		altitudeDetail.textContent = `${formatNumber(Math.round(Math.max(0, sunAlt.altitude)))}°`;
	} else if (altitudeDetail) {
		altitudeDetail.textContent = '—';
	}
	
	// 6. سمت خورشید (Azimuth)
	const azimuthDetail = document.getElementById('sunAzimuthDetail');
	if (azimuthDetail && state.place && isToday) {
		const sunAlt = calculateSunAltitude(now, state.place.lat, state.place.lon);
		azimuthDetail.textContent = `${formatNumber(Math.round(sunAlt.azimuth))}°`;
	} else if (azimuthDetail) {
		azimuthDetail.textContent = '—';
	}
	
	// 7. حداکثر ارتفاع (در زمان solar noon)
	const maxAltitudeDetail = document.getElementById('sunMaxAltitudeDetail');
	if (maxAltitudeDetail && state.place) {
		const solarNoonTime = new Date((sr.getTime() + ss.getTime()) / 2);
		const maxSunAlt = calculateSunAltitude(solarNoonTime, state.place.lat, state.place.lon);
		maxAltitudeDetail.textContent = `${formatNumber(Math.round(Math.max(0, maxSunAlt.altitude)))}°`;
	} else if (maxAltitudeDetail) {
		maxAltitudeDetail.textContent = '—';
	}
	
	// 8. فاصله از خورشید (تقریباً 1 AU = 149,597,870.7 km)
	// می‌توانیم یک محاسبه ساده برای تغییر فاصله در طول سال انجام دهیم
	const distanceDetail = document.getElementById('sunDistanceDetail');
	if (distanceDetail) {
		// محاسبه فاصله زمین از خورشید بر اساس روز سال
		const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
		// زمین در حضیض (نزدیک‌ترین به خورشید) در اوایل ژانویه و در اوج (دورترین) در اوایل ژوئیه
		const eccentricity = 0.0167; // اختلاف مداری زمین
		const meanDistance = 149597870.7; // km
		// تقریب ساده بر اساس روز سال
		const angleRad = ((dayOfYear - 3) * 2 * Math.PI) / 365.25; // 3 ژانویه = حضیض تقریبی
		const distance = meanDistance * (1 - eccentricity * Math.cos(angleRad));
		
		distanceDetail.textContent = `${formatNumber(Math.round(distance))} ${t('km')}`;
	}
}

// به‌روزرسانی جزئیات کامل ماه
function updateMoonDetails(moonData, moonTimes, mr, ms, date, isToday, now, tz) {
	// 1. فاز ماه
	const phaseDetail = document.getElementById('moonPhaseDetail');
	if (phaseDetail) phaseDetail.textContent = moonData.name;
	
	// 2. روشنایی
	const illuminationDetail = document.getElementById('moonIlluminationDetail');
	if (illuminationDetail) illuminationDetail.textContent = `${formatNumber(moonData.illumination)}%`;
	
	// 3. عمر ماه
	const ageDetail = document.getElementById('moonAgeDetail');
	if (ageDetail) ageDetail.textContent = `${formatNumber(parseFloat(moonData.moonAge.toFixed(2)))} ${t('day')}`;
	
	// 4. طلوع ماه
	const riseDetail = document.getElementById('moonRiseDetail');
	if (riseDetail) riseDetail.textContent = fmtTime(moonTimes.moonrise, tz);
	
	// 5. غروب ماه
	const setDetail = document.getElementById('moonSetDetail');
	if (setDetail) setDetail.textContent = fmtTime(moonTimes.moonset, tz);
	
	// 6. مدت حضور (Duration)
	const durationDetail = document.getElementById('moonDurationDetail');
	if (durationDetail) {
		const durationMs = ms - mr;
		const hours = Math.floor(durationMs / 3600000);
		const minutes = Math.floor((durationMs % 3600000) / 60000);
		durationDetail.textContent = `${formatNumber(hours)} ${t('hour')} ${t('and')} ${formatNumber(minutes)} ${t('minute')}`;
	}
	
	// 7. زاویه ماه (Altitude)
	const altitudeDetail = document.getElementById('moonAltitudeDetail');
	if (altitudeDetail && state.place && isToday) {
		const moonAlt = calculateMoonAltitude(now, state.place.lat, state.place.lon, moonData.phase);
		altitudeDetail.textContent = `${formatNumber(Math.round(Math.max(0, moonAlt.altitude)))}°`;
	} else if (altitudeDetail) {
		altitudeDetail.textContent = '—';
	}
	
	// 8. فاصله از زمین
	const distanceDetail = document.getElementById('moonDistanceDetail');
	if (distanceDetail) {
		const distance = calculateMoonDistance(date);
		distanceDetail.textContent = `${formatNumber(Math.round(distance))} ${t('km')}`;
	}
}

function renderMoonPhase(moonData) {
	const { phase, moonAge, illumination } = moonData;
	
	// پایه ماه با دهانه‌ها و دریاها
	const moonBase = 'radial-gradient(circle at 38% 35%, #e8e8e8 0%, #d5d5d5 20%, #a8a8a8 60%, #7a7a7a 85%, #5a5a5a 100%)';
	
	console.log('🎨 Rendering Moon Phase:', moonAge.toFixed(2), 'days, illumination:', illumination + '%');
	
	// محاسبه سایه بر اساس Moon Age دقیق
	const dayInCycle = moonAge; // 0-29.53 روز
	
	// ماه نو (New Moon) - روزهای 0-1 و 28-29
	if (dayInCycle < 1 || dayInCycle > 28.5) {
		el.moonCanvas.style.background = `
			radial-gradient(circle, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 100%),
			${moonBase}
		`;
		el.moonCanvas.style.boxShadow = '0 0 20px rgba(100,120,150,0.2), inset 0 0 60px rgba(0,0,0,0.9)';
	}
	// هلال اول (Waxing Crescent) - روزهای 1-7
	else if (dayInCycle < 7) {
		// سایه از راست به چپ کم می‌شود
		const shadowPercent = 100 - (dayInCycle / 7) * 100;
		el.moonCanvas.style.background = `
			radial-gradient(ellipse ${shadowPercent}% 100% at 100% 50%, rgba(0,0,0,0.92) 0%, transparent 50%),
			${moonBase}
		`;
		el.moonCanvas.style.boxShadow = '0 0 30px rgba(200,220,255,0.3), inset -20px -15px 40px rgba(0,0,0,0.7)';
	}
	// تربیع اول (First Quarter) - روز 7-8
	else if (dayInCycle < 8) {
		el.moonCanvas.style.background = `
			linear-gradient(90deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.88) 49%, transparent 50%),
			${moonBase}
		`;
		el.moonCanvas.style.boxShadow = '0 0 35px rgba(200,220,255,0.4), inset -15px -15px 35px rgba(0,0,0,0.6)';
	}
	// احدب اول (Waxing Gibbous) - روزهای 8-14
	else if (dayInCycle < 14) {
		// سایه از چپ کم می‌شود
		const shadowPercent = 100 - ((dayInCycle - 7) / 7) * 100;
		el.moonCanvas.style.background = `
			radial-gradient(ellipse ${shadowPercent}% 100% at 0% 50%, rgba(0,0,0,0.85) 0%, transparent 50%),
			${moonBase}
		`;
		el.moonCanvas.style.boxShadow = '0 0 40px rgba(200,220,255,0.45), inset -12px -12px 30px rgba(0,0,0,0.5)';
	}
	// بدر (Full Moon) - روزهای 14-16
	else if (dayInCycle < 16) {
		el.moonCanvas.style.background = moonBase;
		el.moonCanvas.style.boxShadow = '0 0 60px rgba(200,220,255,0.7), inset -10px -10px 25px rgba(0,0,0,0.3), inset 5px 5px 20px rgba(255,255,255,0.2)';
	}
	// احدب دوم (Waning Gibbous) - روزهای 16-22
	else if (dayInCycle < 22) {
		// سایه از راست شروع می‌شود
		const shadowPercent = ((dayInCycle - 15) / 7) * 100;
		el.moonCanvas.style.background = `
			radial-gradient(ellipse ${shadowPercent}% 100% at 100% 50%, rgba(0,0,0,0.85) 0%, transparent 50%),
			${moonBase}
		`;
		el.moonCanvas.style.boxShadow = '0 0 40px rgba(200,220,255,0.45), inset 12px -12px 30px rgba(0,0,0,0.5)';
	}
	// تربیع دوم (Last Quarter) - روز 22-23
	else if (dayInCycle < 23) {
		el.moonCanvas.style.background = `
			linear-gradient(270deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.88) 49%, transparent 50%),
			${moonBase}
		`;
		el.moonCanvas.style.boxShadow = '0 0 35px rgba(200,220,255,0.4), inset 15px -15px 35px rgba(0,0,0,0.6)';
	}
	// هلال دوم (Waning Crescent) - روزهای 23-29
	else {
		// سایه از چپ بیشتر می‌شود
		const shadowPercent = ((dayInCycle - 22) / 7) * 100;
		el.moonCanvas.style.background = `
			radial-gradient(ellipse ${shadowPercent}% 100% at 0% 50%, rgba(0,0,0,0.92) 0%, transparent 50%),
			${moonBase}
		`;
		el.moonCanvas.style.boxShadow = '0 0 30px rgba(200,220,255,0.3), inset 20px -15px 40px rgba(0,0,0,0.7)';
	}
}

function renderSolarSystem(moonPhase) {
	el.solarSystem.innerHTML = '';
	
	// تنظیم locale برای تمام تابع
	const locale = currentLang === 'fa' ? 'fa-IR' : 'en-US';
	const hour12 = currentLang !== 'fa';
	
	// محاسبه تاریخ دقیق
	const selectedDayData = state.weather?.daily?.[state.selectedDayIndex];
	let currentDate;
	if (selectedDayData && state.place) {
		const tz = state.weather.timezone;
		const dateStr = selectedDayData.time;
		currentDate = new Date(new Date(dateStr).toLocaleString('en-US', { timeZone: tz }));
		
		if (state.solarSystemHour !== null) {
			currentDate.setHours(state.solarSystemHour, 0, 0, 0);
		} else if (state.selectedDayIndex === 0) {
			const now = new Date();
			currentDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
		} else {
			currentDate.setHours(12, 0, 0, 0);
		}
	} else {
		currentDate = new Date();
		if (state.solarSystemHour !== null) {
			currentDate.setHours(state.solarSystemHour, 0, 0, 0);
		}
	}
	
	console.log('🪐 موقعیت سیارات برای:', currentDate.toLocaleString('fa-IR'));
	
	const sun = document.createElement('div');
	sun.className = 'sun-center';
	sun.title = `${t('sun')} - ${currentDate.toLocaleDateString(locale)} ${currentDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12 })}`;
	el.solarSystem.appendChild(sun);
	
	const planets = [
		{ nameKey: 'mercury', cls: 'mercury', key: 'mercury', orbitRadius: 0.387, displayRadius: 35, size: 10 },
		{ nameKey: 'venus', cls: 'venus', key: 'venus', orbitRadius: 0.723, displayRadius: 55, size: 14 },
		{ nameKey: 'earth', cls: 'earth', key: 'earth', orbitRadius: 1.000, displayRadius: 70, size: 16, hasMoon: true },
		{ nameKey: 'mars', cls: 'mars', key: 'mars', orbitRadius: 1.524, displayRadius: 90, size: 13 },
		{ nameKey: 'jupiter', cls: 'jupiter', key: 'jupiter', orbitRadius: 5.203, displayRadius: 160, size: 28 },
		{ nameKey: 'saturn', cls: 'saturn', key: 'saturn', orbitRadius: 9.537, displayRadius: 220, size: 24 },
		{ nameKey: 'uranus', cls: 'uranus', key: 'uranus', orbitRadius: 19.191, displayRadius: 280, size: 20 },
		{ nameKey: 'neptune', cls: 'neptune', key: 'neptune', orbitRadius: 30.069, displayRadius: 340, size: 18 },
	];
	
	const zoom = state.solarSystemZoom || 1.0;
	
	planets.forEach(p => {
		const orbit = document.createElement('div');
		orbit.className = 'planet-orbit';
		const orbitSize = p.displayRadius * 2 * zoom;
		orbit.style.width = orbit.style.height = `${orbitSize}px`;
		el.solarSystem.appendChild(orbit);
		
		// محاسبه موقعیت واقعی نجومی
		const pos = calculatePlanetPosition(p.key, currentDate);
		const scale = (p.displayRadius / p.orbitRadius) * zoom;
		const x = pos.x * scale;
		const y = -pos.y * scale; // معکوس کردن Y برای تطابق با CSS (بالا منفی است)
		
		const planetName = t(p.nameKey);
		const zPosition = pos.z > 0 ? 'بالای صفحه' : 'زیر صفحه';
		console.log(`${planetName}: فاصله ${pos.distance.toFixed(3)} AU، موقعیت (${x.toFixed(1)}, ${y.toFixed(1)})px، Z: ${pos.z.toFixed(3)} (${zPosition})`);
		
		// DEBUG خاص زحل
		if (p.key === 'saturn') {
			console.log('🪐 زحل جزئیات کامل:');
			console.log('  - x:', x.toFixed(2), 'px');
			console.log('  - y:', y.toFixed(2), 'px');
			console.log('  - displayRadius:', p.displayRadius);
			console.log('  - scale:', scale.toFixed(2));
			console.log('  - zoom:', zoom);
		}
		
		const planet = document.createElement('div');
		planet.className = `planet ${p.cls}`;
		planet.style.left = `calc(50% + ${x}px - ${p.size/2}px)`;
		planet.style.top = `calc(50% + ${y}px - ${p.size/2}px)`;
		
		// تنظیم z-index و opacity بر اساس موقعیت Z
		// سیاراتی که z منفی دارند پشت خورشید هستند
		if (pos.z < 0) {
			// سیاره پشت خورشید (زیر صفحه)
			planet.style.zIndex = '5';
			const opacity = 1.0 - Math.abs(pos.z) * 0.2;
			planet.style.opacity = Math.max(0.6, Math.min(1.0, opacity)).toString();
		} else {
			// سیاره جلوی خورشید (بالای صفحه)
			planet.style.zIndex = '15';
			const opacity = 1.0 - Math.abs(pos.z) * 0.1;
			planet.style.opacity = Math.max(0.85, Math.min(1.0, opacity)).toString();
		}
		
		const distanceAU = pos.distance.toFixed(2);
		const distanceMKM = (pos.distance * 149.6).toFixed(1);
		planet.title = `${planetName}\n${t('distance')}: ${formatNumber(parseFloat(distanceAU))} AU (${formatNumber(parseFloat(distanceMKM))} ${t('millionKm')})\n${t('date')}: ${currentDate.toLocaleDateString(locale)} ${currentDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12 })}`;
		
		const label = document.createElement('div');
		label.className = 'planet-label';
		label.textContent = planetName;
		planet.appendChild(label);
		
		el.solarSystem.appendChild(planet);
		
		if (p.hasMoon) {
			const moon = document.createElement('div');
			moon.className = 'planet moon';
			const moonAngle = moonPhase * Math.PI * 2;
			const moonDist = 18;
			const mx = Math.cos(moonAngle) * moonDist;
			const my = Math.sin(moonAngle) * moonDist;
			moon.style.left = `${mx}px`;
			moon.style.top = `${my}px`;
			moon.title = t('moon');
			planet.appendChild(moon);
		}
	});
	
	// برچسب تاریخ
	const dateLabel = document.createElement('div');
	dateLabel.style.cssText = 'position: absolute; top: 10px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.7); padding: 6px 12px; border-radius: 8px; font-size: 11px; color: var(--accent); border: 1px solid var(--border);';
	dateLabel.textContent = `${currentDate.toLocaleDateString(locale)} - ${currentDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12 })}`;
	el.solarSystem.appendChild(dateLabel);
}

// Historical charts
async function loadHistoricalData(period = 'week') {
	if (!state.place) return;
	const data = await fetchHistoricalData(state.place.lat, state.place.lon, period);
	if (!data) return;
	state.historyData = data;
	renderPrecipChart(data);
	renderTempChart(data);
	renderHistoryStats(data);
}

function renderPrecipChart(data) {
	const ctx = el.precipChart.getContext('2d');
	if (precipChartInstance) precipChartInstance.destroy();
	
	const locale = currentLang === 'fa' ? 'fa-IR' : 'en-US';
	const labels = data.time.map(t => {
		const d = new Date(t);
		return d.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
	});
	
	precipChartInstance = new Chart(ctx, {
		type: 'bar',
		data: {
			labels,
			datasets: [{
				label: t('precipitation') + ' (mm)',
				data: data.precipitation_sum,
				backgroundColor: 'rgba(124, 211, 255, 0.5)',
				borderColor: 'rgba(124, 211, 255, 1)',
				borderWidth: 1,
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: { labels: { color: '#e9edf3', font: { family: 'Vazirmatn' } } },
			},
			scales: {
				y: { 
					ticks: { color: '#a8b3c7' },
					grid: { color: 'rgba(255,255,255,0.1)' }
				},
				x: { 
					ticks: { color: '#a8b3c7', font: { family: 'Vazirmatn' } },
					grid: { color: 'rgba(255,255,255,0.05)' }
				}
			}
		}
	});
}

function renderTempChart(data) {
	const ctx = el.tempChart.getContext('2d');
	if (tempChartInstance) tempChartInstance.destroy();
	
	const locale = currentLang === 'fa' ? 'fa-IR' : 'en-US';
	const labels = data.time.map(t => {
		const d = new Date(t);
		return d.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
	});
	
	tempChartInstance = new Chart(ctx, {
		type: 'line',
		data: {
			labels,
			datasets: [
				{
					label: currentLang === 'fa' ? 'حداکثر دما' : 'Max Temperature',
					data: data.temperature_2m_max,
					borderColor: 'rgba(255, 107, 107, 1)',
					backgroundColor: 'rgba(255, 107, 107, 0.1)',
					tension: 0.3,
				},
				{
					label: currentLang === 'fa' ? 'حداقل دما' : 'Min Temperature',
					data: data.temperature_2m_min,
					borderColor: 'rgba(78, 205, 196, 1)',
					backgroundColor: 'rgba(78, 205, 196, 0.1)',
					tension: 0.3,
				}
			]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: { labels: { color: '#e9edf3', font: { family: 'Vazirmatn' } } },
			},
			scales: {
				y: { 
					ticks: { color: '#a8b3c7' },
					grid: { color: 'rgba(255,255,255,0.1)' }
				},
				x: { 
					ticks: { color: '#a8b3c7', font: { family: 'Vazirmatn' } },
					grid: { color: 'rgba(255,255,255,0.05)' }
				}
			}
		}
	});
}

function renderHistoryStats(data) {
	const totalPrecip = data.precipitation_sum.reduce((a, b) => a + (b || 0), 0);
	const avgMax = data.temperature_2m_max.reduce((a, b) => a + b, 0) / data.temperature_2m_max.length;
	const avgMin = data.temperature_2m_min.reduce((a, b) => a + b, 0) / data.temperature_2m_min.length;
	const maxPrecip = Math.max(...data.precipitation_sum);
	
	el.historyStats.innerHTML = `
		<div class="stat-item">
			<div class="stat-label">${t('totalPrecip')}</div>
			<div class="stat-value">${fmtMm(totalPrecip)}</div>
		</div>
		<div class="stat-item">
			<div class="stat-label">${t('avgMax')}</div>
			<div class="stat-value">${fmtTemp(avgMax)}</div>
		</div>
		<div class="stat-item">
			<div class="stat-label">${t('avgMin')}</div>
			<div class="stat-value">${fmtTemp(avgMin)}</div>
		</div>
		<div class="stat-item">
			<div class="stat-label">${t('maxDaily')}</div>
			<div class="stat-value">${fmtMm(maxPrecip)}</div>
		</div>
	`;
}

// Saved Cities
function renderCityTabs() {
	el.cityTabs.innerHTML = '';
	if (state.savedCities.length === 0) {
		el.cityTabs.innerHTML = `<div style="color: var(--muted); padding: 8px;">${t('noCitiesSaved')}</div>`;
		return;
	}
	state.savedCities.forEach((city, idx) => {
		const tab = document.createElement('div');
		tab.className = 'city-tab' + (idx === state.activeCityIndex ? ' active' : '');
		tab.innerHTML = `<span>${city.name}</span>`;
		
		const closeBtn = document.createElement('button');
		closeBtn.className = 'close';
		closeBtn.innerHTML = '×';
		closeBtn.title = 'حذف';
		closeBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			removeCity(idx);
		});
		
		tab.appendChild(closeBtn);
		tab.addEventListener('click', () => switchToCity(idx));
		el.cityTabs.appendChild(tab);
	});
}

function addCurrentCity() {
	if (!state.place) {
		showToast(t('selectCityFirst'));
		return;
	}
	if (state.savedCities.length >= MAX_CITIES) {
		showToast(t('maxCitiesReached').replace('${max}', formatNumber(MAX_CITIES)));
		return;
	}
	const exists = state.savedCities.some(c => 
		Math.abs(c.lat - state.place.lat) < 0.01 && 
		Math.abs(c.lon - state.place.lon) < 0.01
	);
	if (exists) {
		showToast(t('cityAlreadySaved'));
		return;
	}
	state.savedCities.push({ ...state.place });
	state.activeCityIndex = state.savedCities.length - 1;
	saveCities();
	renderCityTabs();
	showToast(`${state.place.name} ${t('cityAdded')}`);
}

function removeCity(idx) {
	const cityName = state.savedCities[idx].name;
	state.savedCities.splice(idx, 1);
	if (state.activeCityIndex >= state.savedCities.length) {
		state.activeCityIndex = Math.max(0, state.savedCities.length - 1);
	}
	saveCities();
	renderCityTabs();
	if (state.savedCities.length > 0) {
		switchToCity(state.activeCityIndex);
	}
	showToast(`${cityName} ${t('cityRemoved')}`);
}

async function switchToCity(idx) {
	if (idx < 0 || idx >= state.savedCities.length) return;
	state.activeCityIndex = idx;
	localStorage.setItem('activeCityIndex', idx);
	const city = state.savedCities[idx];
	try {
		const weather = await fetchWeather(city.lat, city.lon);
		const aqi = await fetchAirQuality(city.lat, city.lon);
		state.place = { ...city, timezone: weather.timezone, isUserLocation: false };
		state.weather = weather;
		state.airQuality = aqi;
		state.selectedDayIndex = 0;
		renderSelectedDay();
		renderCityTabs();
		await loadHistoricalData('week');
	} catch (e) {
		showToast(t('fetchError'));
	}
}

function saveCities() {
	localStorage.setItem('savedCities', JSON.stringify(state.savedCities));
	localStorage.setItem('activeCityIndex', state.activeCityIndex);
}

// Location
function getGeoPosition() {
	return new Promise((resolve, reject) => {
		if (!('geolocation' in navigator)) return reject(new Error('عدم دسترسی به موقعیت'));
		navigator.geolocation.getCurrentPosition(
			pos => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
			reject,
			{ enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
		);
	});
}

async function getIpLocation() {
	try {
		const data = await fetchJson(IP_API);
		if (data && data.latitude && data.longitude) return { lat: data.latitude, lon: data.longitude };
		throw new Error('no ip loc');
	} catch { return null; }
}

async function loadByLocation(lat, lon) {
	console.log('📍 Loading location:', lat, lon);
	
	// نمایش موقعیت شما در حین دریافت اسم شهر
	showToast(t('loadingLocation'));
	
	const placeMeta = await reverseGeocode(lat, lon);
	
	// اگر reverse geocode کار نکرد، از نام پیش‌فرض استفاده کن
	let finalPlace;
	const yourLoc = t('yourLocation');
	if (placeMeta && placeMeta.name && placeMeta.name !== yourLoc) {
		// اسم شهر پیدا شد
		finalPlace = placeMeta;
		console.log('✅ City found:', finalPlace.name);
	} else {
		// اسم شهر پیدا نشد، از Nominatim استفاده می‌کنیم
		console.log('⚠️ Trying Nominatim as fallback...');
		try {
			const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=${currentLang === 'fa' ? 'fa' : 'en'}`;
			const response = await fetch(nominatimUrl, {
				headers: {
					'User-Agent': 'WeatherApp/1.0'
				}
			});
			const data = await response.json();
			console.log('🗺️ Nominatim response:', data);
			
			if (data && data.address) {
				const addr = data.address;
				const cityName = addr.city || addr.town || addr.village || addr.county || addr.state || yourLoc;
				finalPlace = {
					name: cityName,
					country: addr.country || '',
					admin1: addr.state || addr.province || '',
					timezone: 'auto'
				};
				console.log('✅ Nominatim city found:', cityName);
			} else {
				finalPlace = { name: yourLoc, country: '', admin1: '' };
			}
		} catch (e) {
			console.error('❌ Nominatim error:', e);
			finalPlace = { name: yourLoc, country: '', admin1: '' };
		}
	}
	
	console.log('🌍 Final place name:', finalPlace.name);
	
	const weather = await fetchWeather(lat, lon);
	const aqi = await fetchAirQuality(lat, lon);
	state.place = { ...finalPlace, lat, lon, timezone: weather.timezone, isUserLocation: true };
	state.weather = weather;
	state.airQuality = aqi;
	state.selectedDayIndex = 0;
	renderSelectedDay();
	localStorage.setItem('lastPlace', JSON.stringify(state.place));
	await loadHistoricalData('week');
}

// Search
function openSuggestions(items) {
	el.suggestions.innerHTML = '';
	items.forEach((p, idx) => {
		const it = document.createElement('div'); 
		it.className = 'item'; 
		it.tabIndex = 0; 
		it.setAttribute('role', 'option'); 
		it.id = `sugg-${idx}`;
		it.innerHTML = `<div class="title">${p.name}</div><div class="sub">${[p.admin1, p.country].filter(Boolean).join('، ')}</div>`;
		it.addEventListener('click', () => selectPlace(p));
		it.addEventListener('keydown', (e) => { if (e.key === 'Enter') selectPlace(p); });
		el.suggestions.appendChild(it);
	});
	el.suggestions.classList.toggle('open', items.length > 0);
}

function closeSuggestions() {
	el.suggestions.classList.remove('open');
	el.suggestions.innerHTML = '';
}

async function selectPlace(p) {
	closeSuggestions();
	el.searchInput.value = `${p.name}${p.admin1 ? '، ' + p.admin1 : ''}`;
	try {
		const weather = await fetchWeather(p.lat, p.lon);
		const aqi = await fetchAirQuality(p.lat, p.lon);
		state.place = { ...p, timezone: weather.timezone, isUserLocation: false };
		state.weather = weather;
		state.airQuality = aqi;
		state.selectedDayIndex = 0;
		renderSelectedDay();
		localStorage.setItem('lastPlace', JSON.stringify(state.place));
		await loadHistoricalData('week');
	} catch (e) {
		showToast(t('fetchError'));
	}
}

// Event listeners
el.searchInput.addEventListener('input', debounce(async () => {
	const q = el.searchInput.value.trim();
	if (q.length < 2) { closeSuggestions(); return; }
	try {
		const items = await geocodeSearch(q);
		openSuggestions(items);
	} catch { }
}, 300));

document.addEventListener('click', (e) => {
	if (!el.suggestions.contains(e.target) && e.target !== el.searchInput) closeSuggestions();
});

el.useLocation.addEventListener('click', async () => {
	try {
		const { lat, lon } = await getGeoPosition();
		await loadByLocation(lat, lon);
		const cityName = state.place?.name || t('yourLocation');
		showToast(`${cityName} ${t('locationDetected')}`);
	} catch {
		showToast(t('locationDenied'));
		const ipLoc = await getIpLocation();
		if (ipLoc) { 
			await loadByLocation(ipLoc.lat, ipLoc.lon); 
			const cityName = state.place?.name || t('yourLocation');
			showToast(`${cityName} ${t('locationFromIP')}`);
		}
		else { 
			showToast(t('locationFailed')); 
			await loadByLocation(35.6892, 51.3890); 
		}
	}
});

el.addCity.addEventListener('click', addCurrentCity);

el.prevDay.addEventListener('click', (e) => {
	e.preventDefault();
	if (state.selectedDayIndex > 0) {
		state.selectedDayIndex--;
		renderSelectedDay();
	}
});

el.nextDay.addEventListener('click', (e) => {
	e.preventDefault();
	const maxDays = state.weather?.daily?.length || 7;
	if (state.selectedDayIndex < maxDays - 1) {
		state.selectedDayIndex++;
		renderSelectedDay();
	}
});

el.view7d.addEventListener('click', () => {
	state.currentDayView = 7;
	el.view7d.classList.add('active');
	el.view14d.classList.remove('active');
	renderDaily();
});

el.view14d.addEventListener('click', () => {
	state.currentDayView = 14;
	el.view14d.classList.add('active');
	el.view7d.classList.remove('active');
	renderDaily();
});

document.querySelectorAll('.history-tab').forEach(tab => {
	tab.addEventListener('click', async () => {
		document.querySelectorAll('.history-tab').forEach(t => t.classList.remove('active'));
		tab.classList.add('active');
		const period = tab.dataset.period;
		await loadHistoricalData(period);
	});
});

function applyUnitButtons() {
	el.unitC.classList.toggle('active', state.unit === 'C');
	el.unitC.setAttribute('aria-pressed', state.unit === 'C');
	el.unitF.classList.toggle('active', state.unit === 'F');
	el.unitF.setAttribute('aria-pressed', state.unit === 'F');
}

el.unitC.addEventListener('click', () => { 
	state.unit = 'C'; 
	localStorage.setItem('unit', 'C'); 
	applyUnitButtons(); 
	renderSelectedDay(); 
	if (state.historyData) {
		renderTempChart(state.historyData);
		renderHistoryStats(state.historyData);
	}
});

el.unitF.addEventListener('click', () => { 
	state.unit = 'F'; 
	localStorage.setItem('unit', 'F'); 
	applyUnitButtons(); 
	renderSelectedDay(); 
	if (state.historyData) {
		renderTempChart(state.historyData);
		renderHistoryStats(state.historyData);
	}
});

// Language toggle buttons
const langFa = document.getElementById('langFa');
const langEn = document.getElementById('langEn');

if (langFa) {
	langFa.addEventListener('click', async () => {
		changeLanguage('fa');
		langFa.classList.add('active');
		langEn.classList.remove('active');
		if (state.weather) {
			// Restart live clock with new language
			if (state.weather.timezone) {
				startLiveClock(state.weather.timezone);
			}
			renderSelectedDay();
			// Re-render charts with new language
			if (state.historyData) {
				renderPrecipChart(state.historyData);
				renderTempChart(state.historyData);
				renderHistoryStats(state.historyData);
			}
		}
	});
}

if (langEn) {
	langEn.addEventListener('click', async () => {
		changeLanguage('en');
		langEn.classList.add('active');
		langFa.classList.remove('active');
		if (state.weather) {
			// Restart live clock with new language
			if (state.weather.timezone) {
				startLiveClock(state.weather.timezone);
			}
			renderSelectedDay();
			// Re-render charts with new language
			if (state.historyData) {
				renderPrecipChart(state.historyData);
				renderTempChart(state.historyData);
				renderHistoryStats(state.historyData);
			}
		}
	});
}

// Set initial language button state
function applyLangButtons() {
	if (currentLang === 'fa') {
		langFa?.classList.add('active');
		langEn?.classList.remove('active');
	} else {
		langEn?.classList.add('active');
		langFa?.classList.remove('active');
	}
}

// Apply language buttons on load
setTimeout(() => applyLangButtons(), 100);

// کنترل ساعت منظومه شمسی
if (el.solarSystemHour) {
	el.solarSystemHour.addEventListener('input', () => {
		const hour = parseInt(el.solarSystemHour.value);
		state.solarSystemHour = hour;
		const hourStr = hour.toString().padStart(2, '0');
		if (el.solarSystemHourDisplay) {
			el.solarSystemHourDisplay.textContent = `${formatNumber(hourStr)}:${formatNumber('00')}`;
		}
		
		if (state.weather) {
			const selectedDayData = state.weather.daily[state.selectedDayIndex];
			const dateForMoon = new Date(selectedDayData.time);
			const moonData = getMoonPhase(dateForMoon);
			renderSolarSystem(moonData.phase);
		}
	});
}

if (el.resetToNow) {
	el.resetToNow.addEventListener('click', () => {
		if (state.selectedDayIndex === 0) {
			state.solarSystemHour = null;
			const now = new Date();
			const hour = now.getHours();
			if (el.solarSystemHour) {
				el.solarSystemHour.value = hour;
			}
			const hourStr = hour.toString().padStart(2, '0');
			const minStr = now.getMinutes().toString().padStart(2, '0');
			if (el.solarSystemHourDisplay) {
				el.solarSystemHourDisplay.textContent = `${formatNumber(hourStr)}:${formatNumber(minStr)}`;
			}
		} else {
			state.solarSystemHour = 12;
			if (el.solarSystemHour) {
				el.solarSystemHour.value = 12;
			}
			if (el.solarSystemHourDisplay) {
				el.solarSystemHourDisplay.textContent = `${formatNumber('12')}:${formatNumber('00')}`;
			}
		}
		
		if (state.weather) {
			const selectedDayData = state.weather.daily[state.selectedDayIndex];
			const dateForMoon = new Date(selectedDayData.time);
			const moonData = getMoonPhase(dateForMoon);
			renderSolarSystem(moonData.phase);
		}
	});
}

// کنترل zoom منظومه شمسی
if (el.zoomIn) {
	el.zoomIn.addEventListener('click', () => {
		if (state.solarSystemZoom < 2.0) {
			state.solarSystemZoom = Math.min(2.0, state.solarSystemZoom + 0.1);
			if (el.zoomLevel) {
				const percent = Math.round(state.solarSystemZoom * 100);
				el.zoomLevel.textContent = `${formatNumber(percent)}%`;
			}
			if (state.weather) {
				const selectedDayData = state.weather.daily[state.selectedDayIndex];
				const dateForMoon = new Date(selectedDayData.time);
				const moonData = getMoonPhase(dateForMoon);
				renderSolarSystem(moonData.phase);
			}
		}
	});
}

if (el.zoomOut) {
	el.zoomOut.addEventListener('click', () => {
		if (state.solarSystemZoom > 0.5) {
			state.solarSystemZoom = Math.max(0.5, state.solarSystemZoom - 0.1);
			if (el.zoomLevel) {
				const percent = Math.round(state.solarSystemZoom * 100);
				el.zoomLevel.textContent = `${formatNumber(percent)}%`;
			}
			if (state.weather) {
				const selectedDayData = state.weather.daily[state.selectedDayIndex];
				const dateForMoon = new Date(selectedDayData.time);
				const moonData = getMoonPhase(dateForMoon);
				renderSolarSystem(moonData.phase);
			}
		}
	});
}

if (el.zoomReset) {
	el.zoomReset.addEventListener('click', () => {
		state.solarSystemZoom = getDefaultZoom();
		if (el.zoomLevel) {
			const percent = Math.round(state.solarSystemZoom * 100);
			el.zoomLevel.textContent = `${formatNumber(percent)}%`;
		}
		if (state.weather) {
			const selectedDayData = state.weather.daily[state.selectedDayIndex];
			const dateForMoon = new Date(selectedDayData.time);
			const moonData = getMoonPhase(dateForMoon);
			renderSolarSystem(moonData.phase);
		}
	});
}

// تنظیم خودکار zoom در resize (با debounce)
let resizeTimeout;
window.addEventListener('resize', () => {
	clearTimeout(resizeTimeout);
	resizeTimeout = setTimeout(() => {
		const newZoom = getDefaultZoom();
		// فقط اگر تغییر معناداری در zoom باشد
		if (Math.abs(newZoom - state.solarSystemZoom) > 0.05) {
			state.solarSystemZoom = newZoom;
			if (el.zoomLevel) {
				const percent = Math.round(state.solarSystemZoom * 100);
				el.zoomLevel.textContent = `${formatNumber(percent)}%`;
			}
			if (state.weather) {
				const selectedDayData = state.weather.daily[state.selectedDayIndex];
				const dateForMoon = new Date(selectedDayData.time);
				const moonData = getMoonPhase(dateForMoon);
				renderSolarSystem(moonData.phase);
			}
		}
	}, 250); // صبر 250ms بعد از آخرین resize
});

// مخفی کردن باکس‌های اطلاعات با کلیک در جای دیگر
document.addEventListener('click', () => {
	const sunBox = document.getElementById('sunInfoBox');
	const moonBox = document.getElementById('moonInfoBox');
	const sunMarker = document.getElementById('sunPositionMarker');
	const moonMarker = document.getElementById('moonPositionMarker');
	
	if (sunBox) sunBox.style.opacity = '0';
	if (moonBox) moonBox.style.opacity = '0';
	if (sunMarker) sunMarker.dataset.clicked = '';
	if (moonMarker) moonMarker.dataset.clicked = '';
});

// Init
(async function init() {
	console.log('🚀 Initializing app...');
	
	applyUnitButtons();
	renderCityTabs();
	
	// تنظیم اولیه نوار ساعت
	const now = new Date();
	if (el.solarSystemHour) {
		el.solarSystemHour.value = now.getHours();
	}
	if (el.solarSystemHourDisplay) {
		const hourStr = now.getHours().toString().padStart(2, '0');
		const minStr = now.getMinutes().toString().padStart(2, '0');
		el.solarSystemHourDisplay.textContent = `${formatNumber(hourStr)}:${formatNumber(minStr)}`;
	}
	
	// تنظیم اولیه zoom
	if (el.zoomLevel) {
		const percent = Math.round(state.solarSystemZoom * 100);
		el.zoomLevel.textContent = `${formatNumber(percent)}%`;
	}
	
	if (state.savedCities.length > 0 && state.activeCityIndex < state.savedCities.length) {
		console.log('📍 Loading saved city:', state.savedCities[state.activeCityIndex].name);
		await switchToCity(state.activeCityIndex);
		return;
	}
	
	const last = localStorage.getItem('lastPlace');
	if (last) {
		console.log('📍 Loading last place from localStorage...');
		try {
			const p = JSON.parse(last);
			console.log('📍 Last place:', p.name, p.lat, p.lon);
			const weather = await fetchWeather(p.lat, p.lon);
			const aqi = await fetchAirQuality(p.lat, p.lon);
			// حفظ isUserLocation از localStorage، اگر وجود نداشت false
			state.place = { ...p, timezone: weather.timezone };
			state.weather = weather;
			state.airQuality = aqi;
			console.log('✅ Weather loaded successfully for:', p.name);
			renderSelectedDay();
			await loadHistoricalData('week');
		} catch (e) {
			console.error('❌ Error loading last place:', e);
			// پاک کردن lastPlace خراب از localStorage
			localStorage.removeItem('lastPlace');
		}
	}
	
	if (!state.weather) {
		console.log('🌍 No weather data loaded yet, detecting location...');
		try {
			console.log('📍 Trying geolocation...');
			const { lat, lon } = await getGeoPosition();
			console.log('✅ Geolocation detected:', lat, lon);
			await loadByLocation(lat, lon);
		} catch (e) {
			console.log('⚠️ Geolocation failed, trying IP location...', e.message);
			const ipLoc = await getIpLocation();
			if (ipLoc) {
				console.log('✅ IP location detected:', ipLoc.lat, ipLoc.lon);
				await loadByLocation(ipLoc.lat, ipLoc.lon);
			} else {
				console.log('⚠️ IP location failed, loading Tehran...');
				await loadByLocation(35.6892, 51.3890);
			}
		}
	}
	
	console.log('✅ App initialized successfully!');
})();
