// Translation System for Weather App
const translations = {
	fa: {
		// Header
		appName: 'PIMX_WEATHER',
		searchPlaceholder: 'شهر را جستجو کنید...',
		useLocation: '📍 موقعیت من',
		unitC: '°C',
		unitF: '°F',
		forecastModel: 'مدل پیش‌بینی',
		modelBest: 'بهترین تطبیق',
		modelECMWF: 'ECMWF',
		modelGFS: 'GFS',
		modelICON: 'ICON',
		navCities: 'شهرها',
		navNow: 'اکنون',
		navHourly: 'ساعتی',
		navDaily: 'روزانه',
		navMap: 'نقشه',
		navHistory: 'تاریخچه',
		navAstronomy: 'نجوم',
		navSolarSystem: 'منظومه',
		radarMap: '🗺️ رادار و نقشه',
		radarPlay: 'پخش',
		radarStop: 'توقف',
		radarAttribution: 'رادار: RainViewer • نقشه: OpenStreetMap',
		mapUnavailable: 'نقشه بارگذاری نشد.',
		dataSource: 'منبع',
		dataModel: 'مدل',
		dataElevation: 'ارتفاع',
		dataCoords: 'مختصات',
		
		// Cities
		savedCities: 'شهرهای ذخیره‌شده',
		addCity: '+ افزودن',
		
		// Date selector
		today: 'امروز',
		tomorrow: 'فردا',
		
		// Current weather
		feelsLike: 'حس‌شده',
		humidity: 'رطوبت',
		wind: 'باد',
		pressure: 'فشار',
		visibility: 'دید',
		dewpoint: 'نقطه شبنم',
		precipitation: 'بارش',
		uvIndex: 'شاخص UV',
		airQuality: 'کیفیت هوا',
		sunrise: 'طلوع',
		sunset: 'غروب',
		moonPhase: 'فاز ماه',
		
		// Forecast
		upcomingHours: 'ساعت‌های آینده',
		dailyForecast: 'پیش‌بینی روزانه',
		days7: '۷ روز',
		days14: '۱۴ روز',
		
		// History
		precipHistory: '📊 آمار تاریخی بارندگی',
		tempHistory: '🌡️ آمار تاریخی دما',
		lastWeek: 'هفته گذشته',
		lastMonth: 'ماه گذشته',
		last6Months: '۶ ماه گذشته',
		lastYear: 'سال گذشته',
		
		// History stats
		totalPrecip: 'مجموع بارش',
		avgMax: 'میانگین حداکثر',
		avgMin: 'میانگین حداقل',
		maxDaily: 'بیشترین بارش روزانه',
		warmestDay: 'گرم‌ترین روز',
		coldestDay: 'سردترین روز',
		
		// Astronomy
		sunMoon: '☀️ خورشید و ماه',
		sunPosition: 'موقعیت خورشید',
		sunPositionDesc: '(نمودار زنده حرکت خورشید در طول روز)',
		moonPosition: 'موقعیت ماه',
		
		// Sun details
		sunriseTime: 'طلوع خورشید',
		sunsetTime: 'غروب خورشید',
		dayLength: 'طول روز',
		solarNoon: 'اوج خورشید',
		sunAltitude: 'زاویه خورشید',
		sunAzimuth: 'سمت خورشید',
		maxAltitude: 'حداکثر ارتفاع',
		distanceFromSun: 'فاصله از خورشید',
		
		// Moon details
		moonPhaseDetail: 'فاز ماه',
		illumination: 'روشنایی',
		moonAge: 'عمر ماه',
		moonrise: 'طلوع ماه',
		moonset: 'غروب ماه',
		moonDuration: 'مدت حضور',
		moonAltitude: 'زاویه ماه',
		distanceFromEarth: 'فاصله از زمین',
		
	// Solar System
	solarSystem: '🪐 منظومه شمسی - موقعیت‌های واقعی نجومی',
	hour: 'ساعت',
	now: 'اکنون',
	zoomIn: '🔍+',
	zoomOut: '🔍−',
	reset: '🔄',
	note: 'نکته',
	solarSystemNote1: 'فواصل واقعی سیارات بسیار زیاد است. برای نمایش بهتر، از مقیاس فشرده استفاده شده است.',
	solarSystemNote2: 'موقعیت سیارات با استفاده از الگوریتم‌های نجومی VSOP87 محاسبه شده و بر اساس تاریخ و ساعت انتخابی شما دقیق است.',
	solarPickPlanet: 'یک سیاره را انتخاب کنید',
	solarPickPlanetHint: 'روی یکی از سیاره‌ها بزنید تا جزئیات دقیق نمایش داده شود.',
	solarCoords: 'مختصات (AU)',
	abovePlane: 'بالای صفحهٔ مداری',
	belowPlane: 'پایین صفحهٔ مداری',
	
	// Planets
	mercury: 'عطارد',
	venus: 'زهره',
	earth: 'زمین',
	mars: 'مریخ',
	jupiter: 'مشتری',
	saturn: 'زحل',
	uranus: 'اورانوس',
	neptune: 'نپتون',
	moon: 'ماه',
	
	// Planet/Sun tooltips
	distance: 'فاصله',
	date: 'تاریخ',
	millionKm: 'میلیون کیلومتر',
	sun: 'خورشید',
	
	// Moon phases
	moonNew: 'نو',
	moonWaxingCrescent: 'هلال اول',
	moonFirstQuarter: 'تربیع اول',
	moonWaxingGibbous: 'احدب اول',
	moonFull: 'بدر',
	moonWaningGibbous: 'احدب دوم',
	moonLastQuarter: 'تربیع دوم',
	moonWaningCrescent: 'هلال دوم',
	
	// Weather conditions
		moonlit: 'مهتابی',
		sunny: 'آفتابی',
		partlyCloudy: 'صاف تا کمی ابری',
		cloudy: 'ابری',
		overcast: 'ابری',
		fog: 'مه',
		rime: 'مه یخ‌زده',
		drizzleLight: 'نم‌نم باران',
		drizzle: 'باران ملایم',
		drizzleHeavy: 'باران شدید',
		freezingDrizzle: 'نم‌نم یخ‌زده',
		rain: 'باران',
		rainModerate: 'باران متوسط',
		rainHeavy: 'باران شدید',
		freezingRain: 'یخ‌باران',
		snowLight: 'برف سبک',
		snow: 'برف',
		snowHeavy: 'برف سنگین',
		snowGrains: 'دانه‌های برف',
		showers: 'رگبار پراکنده',
		showersModerate: 'رگبار',
		showersHeavy: 'رگبار شدید',
		snowShowers: 'رگبار برف',
		thunderstorm: 'طوفان تندری',
		hail: 'تندر با تگرگ',
		
		// UV levels
		uvLow: 'کم',
		uvModerate: 'متوسط',
		uvHigh: 'بالا',
		uvVeryHigh: 'خیلی بالا',
		uvExtreme: 'شدید',
		
		// AQI levels
		aqiGood: 'خوب',
		aqiModerate: 'متوسط',
		aqiUnhealthySensitive: 'ناسالم برای گروه‌های حساس',
		aqiUnhealthy: 'ناسالم',
		aqiVeryUnhealthy: 'خیلی ناسالم',
		aqiHazardous: 'خطرناک',
		
		// Messages
		locationDetected: 'شناسایی شد',
		locationDenied: 'اجازه دسترسی به موقعیت رد شد. تلاش برای تشخیص از طریق IP...',
		locationFromIP: 'از طریق IP شناسایی شد',
		locationFailed: 'امکان تشخیص موقعیت نیست. تهران اعمال شد.',
		cityAdded: 'ذخیره شد',
		cityRemoved: 'حذف شد',
		cityAlreadySaved: 'این شهر قبلاً ذخیره شده است',
		maxCitiesReached: 'حداکثر ${max} شهر می‌توانید ذخیره کنید',
		selectCityFirst: 'لطفاً ابتدا یک شهر را انتخاب کنید',
		fetchError: 'خطا در دریافت اطلاعات شهر انتخاب‌شده',
		loadingLocation: 'در حال دریافت اطلاعات موقعیت...',
		loadingYourLocation: 'در حال گرفتن اطلاعات موقعیت شما',
		loadingCityInfo: 'در حال دریافت اطلاعات شهر مورد نظر',
		loadingModel: 'در حال تغییر مدل پیش‌بینی...',
		slowConnection: 'اتصال اینترنت ضعیف است',
		noHistoricalData: 'داده‌های تاریخی برای این دوره در دسترس نیست',
		noData: 'داده‌ای موجود نیست',
		
		// Footer
		copyright: '© 2025',
		allRightsReserved: '. تمامی حقوق محفوظ است.',
		
		// Loading
		loadingTitle: 'PIMX_WEATHER',
		loadingText: 'در حال بارگذاری اطلاعات...',
		
		// Location Permission
		locationPermissionTitle: 'دسترسی به موقعیت مکانی',
		locationPermissionMessage: 'برای نمایش دقیق وضعیت آب و هوا، لطفاً دسترسی به موقعیت مکانی و GPS را فعال کنید.',
		locationPermissionAllow: 'اجازه دادن',
		locationPermissionDeny: 'رد کردن',
		locationPermissionNote: '💡 می‌توانید بعداً از دکمه "موقعیت من" استفاده کنید.',
		
		// Other
		yourLocation: 'موقعیت شما',
		noCitiesSaved: 'هیچ شهری ذخیره نشده',
		noHourlyData: 'داده ساعتی در دسترس نیست',
		hours: 'ساعت',
		minutes: 'دقیقه',
		days: 'روز',
		and: 'و',
		
	// Time units
	am9: '۹ صبح',
	pm12: '۱۲ ظهر',
	pm3: '۳ بعدازظهر',
	
	// Sun/Moon position text
	sunNotRisen: 'خورشید درنیامده',
	sunRisen: 'خورشید در آسمان است',
	sunSet: 'خورشید غروب کرده',
	moonNotRisen: 'ماه درنیامده',
	moonRisen: 'ماه در آسمان است',
	moonSet: 'ماه غروب کرده',
	untilRise: 'تا طلوع',
	untilSet: 'تا غروب',
	sinceSet: 'از غروب گذشته',
	position: 'موقعیت',
	ofPath: 'از مسیر',
	altitude: 'ارتفاع',
	azimuth: 'سمت',
	illuminationLabel: 'روشنایی',
	ageLabel: 'عمر',
	dayLength: 'طول روز',
	hour: 'ساعت',
	minute: 'دقیقه',
	day: 'روز',
	and: 'و',
	chance: 'احتمال',
	noHourlyData: 'داده ساعتی در دسترس نیست',
	noCitiesSaved: 'هیچ شهری ذخیره نشده',
	km: 'کیلومتر',
	note: 'نکته',
	solarSystemNote1: 'فواصل واقعی سیارات بسیار زیاد است. برای نمایش بهتر، از مقیاس فشرده استفاده شده است.',
	solarSystemNote2: 'موقعیت سیارات با استفاده از الگوریتم‌های نجومی VSOP87 محاسبه شده و بر اساس تاریخ و ساعت انتخابی شما دقیق است.',
	sunPosition: 'موقعیت خورشید',
	sunPositionDesc: '(نمودار زنده حرکت خورشید در طول روز)',
	moonPosition: 'موقعیت ماه',
	
	// Sun/Moon Details Labels
	sunriseTime: 'طلوع خورشید',
	sunsetTime: 'غروب خورشید',
	solarNoon: 'اوج خورشید',
	sunAltitude: 'زاویه خورشید',
	sunAzimuth: 'سمت خورشید',
	maxAltitude: 'حداکثر ارتفاع',
	distanceFromSun: 'فاصله از خورشید',
	moonPhaseDetail: 'فاز ماه',
	illumination: 'روشنایی',
	moonAge: 'عمر ماه',
	moonrise: 'طلوع ماه',
	moonset: 'غروب ماه',
	moonDuration: 'مدت حضور',
	moonAltitude: 'زاویه ماه',
	distanceFromEarth: 'فاصله از زمین',
},

en: {
		// Header
		appName: 'PIMX_WEATHER',
		searchPlaceholder: 'Search for a city...',
		useLocation: '📍 Use My Location',
		unitC: '°C',
		unitF: '°F',
		forecastModel: 'Forecast model',
		modelBest: 'Best match',
		modelECMWF: 'ECMWF',
		modelGFS: 'GFS',
		modelICON: 'ICON',
		navCities: 'Cities',
		navNow: 'Now',
		navHourly: 'Hourly',
		navDaily: 'Daily',
		navMap: 'Map',
		navHistory: 'History',
		navAstronomy: 'Astronomy',
		navSolarSystem: 'Solar system',
		radarMap: '🗺️ Radar & Map',
		radarPlay: 'Play',
		radarStop: 'Stop',
		radarAttribution: 'Radar: RainViewer • Map: OpenStreetMap',
		mapUnavailable: 'Map failed to load.',
		dataSource: 'Source',
		dataModel: 'Model',
		dataElevation: 'Elevation',
		dataCoords: 'Coords',
		
		// Cities
		savedCities: 'Saved Cities',
		addCity: '+ Add',
		
		// Date selector
		today: 'Today',
		tomorrow: 'Tomorrow',
		
		// Current weather
		feelsLike: 'Feels Like',
		humidity: 'Humidity',
		wind: 'Wind',
		pressure: 'Pressure',
		visibility: 'Visibility',
		dewpoint: 'Dew Point',
		precipitation: 'Precipitation',
		uvIndex: 'UV Index',
		airQuality: 'Air Quality',
		sunrise: 'Sunrise',
		sunset: 'Sunset',
		moonPhase: 'Moon Phase',
		
		// Forecast
		upcomingHours: 'Upcoming Hours',
		dailyForecast: 'Daily Forecast',
		days7: '7 Days',
		days14: '14 Days',
		
		// History
		precipHistory: '📊 Precipitation History',
		tempHistory: '🌡️ Temperature History',
		lastWeek: 'Last Week',
		lastMonth: 'Last Month',
		last6Months: 'Last 6 Months',
		lastYear: 'Last Year',
		
		// History stats
		totalPrecip: 'Total Precipitation',
		avgMax: 'Average Maximum',
		avgMin: 'Average Minimum',
		maxDaily: 'Max Daily Precipitation',
		warmestDay: 'Warmest Day',
		coldestDay: 'Coldest Day',
		
		// Astronomy
		sunMoon: '☀️ Sun & Moon',
		sunPosition: 'Sun Position',
		sunPositionDesc: '(Live diagram of sun movement throughout the day)',
		moonPosition: 'Moon Position',
		
		// Sun details
		sunriseTime: 'Sunrise',
		sunsetTime: 'Sunset',
		dayLength: 'Day Length',
		solarNoon: 'Solar Noon',
		sunAltitude: 'Sun Altitude',
		sunAzimuth: 'Sun Azimuth',
		maxAltitude: 'Max Altitude',
		distanceFromSun: 'Distance from Sun',
		
		// Moon details
		moonPhaseDetail: 'Moon Phase',
		illumination: 'Illumination',
		moonAge: 'Moon Age',
		moonrise: 'Moonrise',
		moonset: 'Moonset',
		moonDuration: 'Duration',
		moonAltitude: 'Moon Altitude',
		distanceFromEarth: 'Distance from Earth',
		
	// Solar System
	solarSystem: '🪐 Solar System - Accurate Astronomical Positions',
	hour: 'Hour',
	now: 'Now',
	zoomIn: '🔍+',
	zoomOut: '🔍−',
	reset: '🔄',
	note: 'Note',
	solarSystemNote1: 'Actual distances between planets are very large. A compressed scale is used for better display.',
	solarSystemNote2: 'Planet positions are calculated using VSOP87 astronomical algorithms and are accurate based on your selected date and time.',
	solarPickPlanet: 'Select a planet',
	solarPickPlanetHint: 'Click a planet to see detailed position info.',
	solarCoords: 'Coordinates (AU)',
	abovePlane: 'Above orbital plane',
	belowPlane: 'Below orbital plane',
	
	// Planets
	mercury: 'Mercury',
	venus: 'Venus',
	earth: 'Earth',
	mars: 'Mars',
	jupiter: 'Jupiter',
	saturn: 'Saturn',
	uranus: 'Uranus',
	neptune: 'Neptune',
	moon: 'Moon',
	
	// Planet/Sun tooltips
	distance: 'Distance',
	date: 'Date',
	millionKm: 'million km',
	sun: 'Sun',
	
	// Moon phases
	moonNew: 'New',
	moonWaxingCrescent: 'Waxing Crescent',
	moonFirstQuarter: 'First Quarter',
	moonWaxingGibbous: 'Waxing Gibbous',
	moonFull: 'Full',
	moonWaningGibbous: 'Waning Gibbous',
	moonLastQuarter: 'Last Quarter',
	moonWaningCrescent: 'Waning Crescent',
	
	// Weather conditions
		moonlit: 'Moonlit',
		sunny: 'Sunny',
		partlyCloudy: 'Partly Cloudy',
		cloudy: 'Cloudy',
		overcast: 'Overcast',
		fog: 'Fog',
		rime: 'Rime Fog',
		drizzleLight: 'Light Drizzle',
		drizzle: 'Drizzle',
		drizzleHeavy: 'Heavy Drizzle',
		freezingDrizzle: 'Freezing Drizzle',
		rain: 'Rain',
		rainModerate: 'Moderate Rain',
		rainHeavy: 'Heavy Rain',
		freezingRain: 'Freezing Rain',
		snowLight: 'Light Snow',
		snow: 'Snow',
		snowHeavy: 'Heavy Snow',
		snowGrains: 'Snow Grains',
		showers: 'Showers',
		showersModerate: 'Moderate Showers',
		showersHeavy: 'Heavy Showers',
		snowShowers: 'Snow Showers',
		thunderstorm: 'Thunderstorm',
		hail: 'Thunderstorm with Hail',
		
		// UV levels
		uvLow: 'Low',
		uvModerate: 'Moderate',
		uvHigh: 'High',
		uvVeryHigh: 'Very High',
		uvExtreme: 'Extreme',
		
		// AQI levels
		aqiGood: 'Good',
		aqiModerate: 'Moderate',
		aqiUnhealthySensitive: 'Unhealthy for Sensitive Groups',
		aqiUnhealthy: 'Unhealthy',
		aqiVeryUnhealthy: 'Very Unhealthy',
		aqiHazardous: 'Hazardous',
		
		// Messages
		locationDetected: 'detected',
		locationDenied: 'Location access denied. Trying to detect via IP...',
		locationFromIP: 'detected via IP',
		locationFailed: 'Unable to detect location. Defaulting to Tehran.',
		cityAdded: 'saved',
		cityRemoved: 'removed',
		cityAlreadySaved: 'This city is already saved',
		maxCitiesReached: 'You can save up to ${max} cities',
		selectCityFirst: 'Please select a city first',
		fetchError: 'Error fetching city data',
		loadingLocation: 'Getting location information...',
		loadingYourLocation: 'Getting your location information',
		loadingCityInfo: 'Getting information for selected city',
		loadingModel: 'Updating forecast model...',
		slowConnection: 'Slow internet connection',
		noHistoricalData: 'Historical data not available for this period',
		noData: 'No data available',
		
		// Footer
		copyright: '© 2025',
		allRightsReserved: '. All rights reserved.',
		
		// Loading
		loadingTitle: 'PIMX_WEATHER',
		loadingText: 'Loading data...',
		
		// Location Permission
		locationPermissionTitle: 'Location Access',
		locationPermissionMessage: 'To show accurate weather information, please enable location access and turn on your GPS.',
		locationPermissionAllow: 'Allow',
		locationPermissionDeny: 'Deny',
		locationPermissionNote: '💡 You can use the "Use My Location" button later.',
		
		// Other
		yourLocation: 'Your Location',
		noCitiesSaved: 'No cities saved',
		noHourlyData: 'No hourly data available',
		hours: 'hours',
		minutes: 'minutes',
		days: 'days',
		and: 'and',
		
	// Time units
	am9: '9 AM',
	pm12: '12 PM',
	pm3: '3 PM',
	
	// Sun/Moon position text
	sunNotRisen: 'Sun not risen',
	sunRisen: 'Sun is up',
	sunSet: 'Sun has set',
	moonNotRisen: 'Moon not risen',
	moonRisen: 'Moon is up',
	moonSet: 'Moon has set',
	untilRise: 'until rise',
	untilSet: 'until set',
	sinceSet: 'since set',
	position: 'Position',
	ofPath: 'of path',
	altitude: 'Altitude',
	azimuth: 'Azimuth',
	illuminationLabel: 'Illumination',
	ageLabel: 'Age',
	dayLength: 'Day length',
	hour: 'hour',
	minute: 'minute',
	day: 'day',
	and: 'and',
	chance: 'chance',
	noHourlyData: 'No hourly data available',
	noCitiesSaved: 'No cities saved',
	km: 'kilometers',
	note: 'Note',
	solarSystemNote1: 'Actual distances between planets are very large. A compressed scale is used for better display.',
	solarSystemNote2: 'Planet positions are calculated using VSOP87 astronomical algorithms and are accurate based on your selected date and time.',
	sunPosition: 'Sun Position',
	sunPositionDesc: '(Live diagram of sun movement throughout the day)',
	moonPosition: 'Moon Position',
	
	// Sun/Moon Details Labels
	sunriseTime: 'Sunrise',
	sunsetTime: 'Sunset',
	solarNoon: 'Solar Noon',
	sunAltitude: 'Sun Altitude',
	sunAzimuth: 'Sun Azimuth',
	maxAltitude: 'Max Altitude',
	distanceFromSun: 'Distance from Sun',
	moonPhaseDetail: 'Moon Phase',
	illumination: 'Illumination',
	moonAge: 'Moon Age',
	moonrise: 'Moonrise',
	moonset: 'Moonset',
	moonDuration: 'Duration',
	moonAltitude: 'Moon Altitude',
	distanceFromEarth: 'Distance from Earth',
}
};

// Language state
let currentLang = 'en';

// Get translation
function t(key) {
	return translations[currentLang][key] || key;
}

// Detect user country
async function detectUserCountry() {
	try {
		// Try to get country from IP
		const response = await fetch('https://ipapi.co/json/');
		const data = await response.json();
		console.log('🌍 Country detected:', data.country_code);
		return data.country_code;
	} catch (e) {
		console.error('❌ Country detection failed:', e);
		return 'IR'; // Default to Iran
	}
}

// Set language based on location
async function setLanguageByLocation() {
	// Check if user has manually selected a language
	const savedLang = localStorage.getItem('language');
	if (savedLang) {
		currentLang = savedLang;
		console.log('✅ Using saved language:', currentLang);
		return;
	}
	
	// Detect country
	const country = await detectUserCountry();
	
	// Set language based on country (default to English)
	if (country === 'IR') {
		currentLang = 'fa';
		console.log('🇮🇷 Iran detected - Using Persian');
	} else {
		currentLang = 'en';
		console.log('🌍 Default - Using English');
	}
	
	localStorage.setItem('language', currentLang);
}

// Change language manually
function changeLanguage(lang) {
	currentLang = lang;
	localStorage.setItem('language', lang);
	console.log('🔄 Language changed to:', lang);
	applyTranslations();
}

// Apply translations to DOM
function applyTranslations() {
	// Set HTML direction and lang attribute
	const html = document.documentElement;
	html.setAttribute('lang', currentLang);
	html.setAttribute('dir', currentLang === 'fa' ? 'rtl' : 'ltr');
	
	// Update all elements with data-i18n attribute
	document.querySelectorAll('[data-i18n]').forEach(el => {
		const key = el.getAttribute('data-i18n');
		if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
			el.placeholder = t(key);
		} else {
			const text = t(key);
			// Keep emoji if exists
			if (el.textContent.includes('📍')) {
				el.innerHTML = text;
			} else {
				el.textContent = text;
			}
		}
	});
	
	// Update title
	document.title = t('appName');
	
	// Update loading text
	const loadingText = document.querySelector('.loading-text');
	if (loadingText) loadingText.textContent = t('loadingText');
	
	const loadingTitle = document.querySelector('.loading-title');
	if (loadingTitle) loadingTitle.textContent = t('loadingTitle');
	
	// Update footer
	const footer = document.querySelector('.app-footer p');
	if (footer) {
		footer.innerHTML = `${t('copyright')} <a href="https://pimx.pages.dev" target="_blank" rel="noopener noreferrer">PIMX</a>${t('allRightsReserved')}`;
	}
	
	// Update static elements
	updateStaticElements();
	
	console.log('✅ Translations applied for:', currentLang);
}

// Update static text elements
function updateStaticElements() {
	// City header
	const cityHeader = document.querySelector('.city-header h3');
	if (cityHeader) cityHeader.textContent = t('savedCities');
	
	const addCityBtn = document.getElementById('addCity');
	if (addCityBtn) addCityBtn.innerHTML = t('addCity');
	
	// Selected date (if today)
	const selectedDate = document.getElementById('selectedDate');
	if (selectedDate && selectedDate.textContent === 'امروز') {
		selectedDate.textContent = t('today');
	}
	
	// Stat cards labels
	const statLabels = {
		'feelsLike': t('feelsLike'),
		'humidity': t('humidity'),
		'wind': t('wind'),
		'pressure': t('pressure'),
		'visibility': t('visibility'),
		'dewpoint': t('dewpoint'),
		'precip': t('precipitation'),
		'uvIndex': t('uvIndex'),
		'aqi': t('airQuality'),
		'sunrise': t('sunrise'),
		'sunset': t('sunset'),
		'moonPhase': t('moonPhase')
	};
	
	// Update stat card labels
	document.querySelectorAll('.stat-label').forEach(el => {
		const parentCard = el.closest('.stat-card');
		if (!parentCard) return;
		
		if (parentCard.classList.contains('temp-card')) el.textContent = t('feelsLike');
		else if (parentCard.classList.contains('humidity-card')) el.textContent = t('humidity');
		else if (parentCard.classList.contains('wind-card')) el.textContent = t('wind');
		else if (parentCard.classList.contains('pressure-card')) el.textContent = t('pressure');
		else if (parentCard.classList.contains('visibility-card')) el.textContent = t('visibility');
		else if (parentCard.classList.contains('dew-card')) el.textContent = t('dewpoint');
		else if (parentCard.classList.contains('rain-card')) el.textContent = t('precipitation');
		else if (parentCard.classList.contains('uv-card')) el.textContent = t('uvIndex');
		else if (parentCard.classList.contains('aqi-card')) el.textContent = t('airQuality');
		else if (parentCard.classList.contains('sunrise-card')) el.textContent = t('sunrise');
		else if (parentCard.classList.contains('sunset-card')) el.textContent = t('sunset');
		else if (parentCard.classList.contains('moon-card')) el.textContent = t('moonPhase');
	});
	
	// Hourly section
	const hourlySection = document.querySelector('#hourly h3');
	if (hourlySection) hourlySection.textContent = t('upcomingHours');
	
	// Daily section
	const dailySection = document.querySelector('#daily h3');
	if (dailySection) dailySection.textContent = t('dailyForecast');
	
	// View buttons
	const view7d = document.getElementById('view7d');
	const view14d = document.getElementById('view14d');
	if (view7d) view7d.textContent = t('days7');
	if (view14d) view14d.textContent = t('days14');
	
	// Astronomy section
	const sunMoonTitle = document.querySelector('.astronomy-card > h3');
	if (sunMoonTitle) sunMoonTitle.textContent = t('sunMoon');
	
	// Update SVG time labels
	const am9Label = document.querySelector('.time-label-am9');
	const pm12Label = document.querySelector('.time-label-pm12');
	const pm3Label = document.querySelector('.time-label-pm3');
	if (am9Label) am9Label.textContent = t('am9');
	if (pm12Label) pm12Label.textContent = t('pm12');
	if (pm3Label) pm3Label.textContent = t('pm3');
}
