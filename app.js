/* PIMX Weather Studio. All weather values originate from provider responses. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const D = WeatherData;
  const paths = {
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
    moon:'<path d="M20.5 13A9 9 0 0 1 11 3.5a9 9 0 1 0 9.5 9.5Z"/>',
    cloud:'<path d="M6 19a4 4 0 1 1 .4-8A6 6 0 0 1 18 9a5 5 0 0 1 0 10Z"/>',
    partly:'<path d="M12 3v2M3 12h2m1-6 1.5 1.5M18 6l-1.5 1.5"/><path d="M8 13a4.5 4.5 0 1 1 7-4"/><path d="M9 20a3.5 3.5 0 1 1 .5-7 5 5 0 0 1 9-2 4.5 4.5 0 0 1 0 9Z"/>',
    rain:'<path d="M5 15a3.5 3.5 0 1 1 .4-7A5.5 5.5 0 0 1 16 7a4 4 0 0 1 2 8H5m2 3-1 3m6-3-1 3m6-3-1 3"/>',
    snow:'<path d="M5 13a3.5 3.5 0 1 1 .4-7A5.5 5.5 0 0 1 16 5a4 4 0 0 1 2 8H5M8 16v6m-2-4 4 2m0-2-4 2m10-4v6m-2-4 4 2m0-2-4 2"/>',
    storm:'<path d="M5 14a3.5 3.5 0 1 1 .4-7A5.5 5.5 0 0 1 16 6a4 4 0 0 1 2 8h-2"/><path d="m12 12-4 6h4l-2 5 7-8h-5l2-3"/>',
    fog:'<path d="M5 13a3.5 3.5 0 1 1 .4-7A5.5 5.5 0 0 1 16 5a4 4 0 0 1 2 8H5M3 17h18M6 21h12"/>',
    grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    chart:'<path d="M3 3v18h18M6 15l5-5 4 3 6-8"/>', calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18M7 15h2m6 0h2m-10 3h2"/>',
    wind:'<path d="M3 8h12a3 3 0 1 0-3-3M2 12h17a3 3 0 1 1-3 3M4 16h5a3 3 0 1 1-3 3"/>', map:'<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5Zm6-2v16m6-14v16"/>', pin:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    history:'<path d="M3 11a9 9 0 1 1 2 7M3 4v7h7m2-5v6l4 2"/>', globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>', shield:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>', arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>',
    refresh:'<path d="M20 7a8 8 0 0 0-14-2L3 8m0-5v5h5m-4 9a8 8 0 0 0 14 2l3-3m0 5v-5h-5"/>', locate:'<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/>', search:'<circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/>', bookmark:'<path d="M6 3h12v18l-6-4-6 4V3Z"/>',
    'arrow-up':'<path d="M12 20V4m-5 5 5-5 5 5"/>', 'arrow-down':'<path d="M12 4v16m-5-5 5 5 5-5"/>', clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', sunrise:'<path d="M3 17h18M5 21h14M7 17a5 5 0 0 1 10 0M12 3v7m-3-4 3-3 3 3M3 10l2 2m14 0 2-2"/>', spark:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.01"/>', radar:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="m12 12 7-7"/><circle cx="12" cy="12" r="1"/>', play:'<path d="m8 4 12 8-12 8V4Z"/>', pause:'<path d="M8 4v16m8-16v16"/>', plus:'<path d="M12 4v16M4 12h16"/>', close:'<path d="m6 6 12 12M6 18 18 6"/>', download:'<path d="M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5"/>', droplet:'<path d="M12 2S5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13Z"/>', eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>', gauge:'<path d="M4 19a10 10 0 1 1 16 0M5 12h2m5-7v2m5 5h2m-7 4 5-7"/><circle cx="12" cy="16" r="1"/>', thermometer:'<path d="M9 14V5a3 3 0 0 1 6 0v9a5 5 0 1 1-6 0Zm3-8v11"/>', walk:'<circle cx="14" cy="4" r="2"/><path d="m8 10 4-3 3 5 4 1m-7-6-2 8 4 3 1 4m-5-7-4 7"/>'
  };
  const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.info}</svg>`;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { toast(t('storageError')); } };
  const defaults = [
    {name:'Tehran',fa:'تهران',country:'Iran',countryFa:'ایران',lat:35.6892,lon:51.389,timezone:'Asia/Tehran'},
    {name:'London',fa:'لندن',country:'United Kingdom',countryFa:'بریتانیا',lat:51.5085,lon:-0.1257,timezone:'Europe/London'},
    {name:'Dubai',fa:'دبی',country:'United Arab Emirates',countryFa:'امارات',lat:25.0657,lon:55.1713,timezone:'Asia/Dubai'},
    {name:'Tokyo',fa:'توکیو',country:'Japan',countryFa:'ژاپن',lat:35.6762,lon:139.6503,timezone:'Asia/Tokyo'}
  ];
  const last = read('pimx.weather.place', read('lastPlace', null));
  const oldSaved = read('savedCities', []);
  const saved = read('pimx.weather.cities', Array.isArray(oldSaved) ? oldSaved : []);
  const state = {
    lang: read('pimx.weather.lang','fa') === 'en' ? 'en' : 'fa', unit: read('pimx.weather.unit','C') === 'F' ? 'F' : 'C',
    light: read('pimx.weather.light',false) === true, place: D.validPlace(last) ? last : defaults[0],
    saved: (Array.isArray(saved) ? saved : []).filter(D.validPlace).slice(0,20),
    model:['best_match','ecmwf_ifs04','gfs_global','icon_global'].includes(read('pimx.weather.model','best_match'))?read('pimx.weather.model','best_match'):'best_match',weatherModel:'best_match',minutes:null,sky:null,skyKey:'',selectedPlanet:'Earth',solarRenderer:null,solarLoading:false,solarVisible:false,cameraMotion:!matchMedia('(prefers-reduced-motion: reduce)').matches,
    weather:null, air:null, retrieved:0, chartMode:'temperature_2m', days:7, day:0, loading:false,
    error:null, airError:false, history:null, historyLoading:false, controller:null, revision:0, historyRevision:0,
    cityWeather:new Map(), cityRevision:0, map:null, marker:null, radarLayer:null, radarFrames:[], radarHost:'', radarEnabled:false, radarTimer:null, radarLoaded:0, radarIndex:0
  };
  let dateModelControls;
  const t = (key, params = {}) => {
    let value = messages[key]?.[state.lang === 'fa' ? 0 : 1] || key;
    return value.replace(/\{(\w+)\}/g, (_, name) => String(params[name] ?? '—'));
  };
  const locale = () => state.lang === 'fa' ? 'fa-IR' : 'en-GB';
  const num = (value, digits = 0) => D.finite(value) ? new Intl.NumberFormat(locale(),{maximumFractionDigits:digits}).format(value) : '—';
  const temp = (value, degree = true) => { const v = D.temperature(value,state.unit); return D.finite(v) ? `${num(v)}${degree ? '°' : ''}` : '—'; };
  function zone() {
    const candidate=state.weather?.timezone || state.place.timezone;
    if(candidate)try {new Intl.DateTimeFormat('en',{timeZone:candidate});return candidate;}catch { /* Ignore invalid persisted timezone metadata. */ }
    return 'UTC';
  }
  const time = (epoch, options = {}) => D.finite(epoch) && epoch > 0 ? new Intl.DateTimeFormat(locale(),{timeZone:zone(),hour:'2-digit',minute:'2-digit',hour12:false,...options}).format(new Date(epoch*1000)) : '—';
  const date = (epoch, options = {}) => D.finite(epoch) ? new Intl.DateTimeFormat(locale(),{timeZone:zone(),month:'short',day:'numeric',...options}).format(new Date(epoch*1000)) : '—';
  const placeName = p => p.kind==='gps'?t('yourLocation'):p.kind==='map'?t('mapPoint'):state.lang === 'fa' && p.fa ? p.fa : p.name;
  const countryName = p => state.lang === 'fa' && p.countryFa ? p.countryFa : p.country || '';
  const placeKey = p => `${p.lat.toFixed(4)},${p.lon.toFixed(4)}`;
  const condition = code => weatherNames[code]?.[state.lang === 'fa' ? 0 : 1] || t('noData');
  const view = () => D.viewContext(state.weather,state.day,state.minutes);
  function weatherSample(){
    const context=view(),weather=state.weather;
    if(!context)return null;
    if(context.live)return weather.current;
    if(context.hour<0)return null;
    return Object.fromEntries(Object.entries(weather.hourly).map(([key,values])=>[key,values?.[context.hour] ?? null]));
  }
  function airSample(){
    const context=view();if(!context || !state.air)return null;
    if(context.live)return state.air.current;
    const i=D.hourIndex(state.air.hourly?.time,context.epoch);if(i<0)return null;
    const current=Object.fromEntries(Object.entries(state.air.hourly).map(([key,values])=>[key,values?.[i] ?? null]));
    return D.finite(current.us_aqi)?current:null;
  }
  function skySnapshot(){
    const context=view();if(!context || !window.SkyData)return null;
    const key=`${Math.floor(context.epoch/60)}/${context.start}/${context.end}/${placeKey(state.place)}`;
    if(state.skyKey!==key){state.sky=SkyData.snapshot(context.epoch,context.start,context.end,state.place.lat,state.place.lon);state.skyKey=key;}
    return state.sky;
  }
  function duration(seconds){return D.finite(seconds)?t('hoursMinutes',{h:num(Math.floor(seconds/3600)),m:num(Math.floor(seconds%3600/60))}):'—';}
  function modelName(){return ({best_match:'Best Match',ecmwf_ifs04:'ECMWF',gfs_global:'GFS',icon_global:'ICON'})[state.weatherModel];}
  const weatherIcon = (code, day = 1) => !D.finite(code) ? 'info' : code <= 1 ? (day ? 'sun':'moon') : code === 2 ? 'partly' : code === 3 ? 'cloud' : code < 50 ? 'fog' : code >= 95 ? 'storm' : [71,73,75,77,85,86].includes(code) ? 'snow' : 'rain';
  function toast(message) { $('toast').textContent=message; $('toast').hidden=false; clearTimeout(toast.timer); toast.timer=setTimeout(() => $('toast').hidden=true,4500); }
  function empty(message, retry = '') { return `<div class="empty-state">${esc(message)}${retry ? `<p></p><button class="button ghost" data-action="${retry}">${t('retry')}</button>` : ''}</div>`; }
  async function fetchJSON(url, signal) {
    const response = await fetch(url,{signal:AbortSignal.any([AbortSignal.timeout(18000),...(signal ? [signal]:[])])});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data=await response.json();
    if (data.error) throw new Error(data.reason || 'Provider error');
    return data;
  }
  function applyLanguage() {
    document.documentElement.lang=state.lang; document.documentElement.dir=state.lang==='fa'?'rtl':'ltr';
    document.querySelectorAll('[data-t]').forEach(e=>e.textContent=t(e.dataset.t));
    document.querySelectorAll('[data-placeholder]').forEach(e=>e.placeholder=t(e.dataset.placeholder));
    document.querySelectorAll('[data-label]').forEach(e=>e.setAttribute('aria-label',t(e.dataset.label)));
    document.querySelectorAll('.nav-link').forEach(e=>e.setAttribute('aria-label',t(e.querySelector('[data-t]').dataset.t)));
    $('searchInput').setAttribute('aria-label',t('searchPlaceholder'));
    $('languageButton').innerHTML=`${state.lang==='fa'?'EN':'FA'} ${icon('globe')}`;
    renderAll(); renderSaved(); renderHistory(); renderSources(); updateRadarTime();
    if(state.map) { state.map.invalidateSize(); updateMap(); }
  }
  function renderQuick() {
    $('quickCities').innerHTML=defaults.map((p,i)=>`<button class="quick-city ${placeKey(p)===placeKey(state.place)?'active':''}" data-quick="${i}">${esc(placeName(p))}</button>`).join('');
    const isSaved=state.saved.some(p=>placeKey(p)===placeKey(state.place));
    $('saveCityButton').classList.toggle('saved',isSaved);
    $('saveCityButton').setAttribute('aria-pressed',String(isSaved));
  }
  function renderStatus() {
    const banner=$('statusBanner');
    const message=state.loading ? t('loadingCity',{name:placeName(state.place)}) : state.error ? t(state.error) : state.retrieved && Date.now()-state.retrieved>30*60*1000 ? t('stale') : '';
    banner.hidden=!message; banner.innerHTML=`${state.loading?'<span class="loading-indicator"></span>':''}${esc(message)}`;
    $('overview').setAttribute('aria-busy',String(state.loading));
    $('refreshButton').disabled=state.loading;
    $('exportButton').disabled=!state.weather || state.loading;
    $('saveCityButton').disabled=state.loading || !state.weather;
    $('addCityButton').disabled=state.loading || !state.weather;
  }
  async function loadPlace(place, refresh = false) {
    if (!D.validPlace(place)) return;
    stopTime();
    state.controller?.abort(); state.controller=new AbortController();
    const signal=state.controller.signal; const revision=++state.revision;const requestedModel=state.model;
    const keepDate=state.weather&&(state.day>0||state.minutes!==null)?view()?.key:null;
    const same=state.weather && placeKey(place)===placeKey(state.place);
    state.place={...place}; state.loading=true; state.error=null;
    ++state.historyRevision; state.historyLoading=false;
    if (!same) {state.weather=null;state.air=null;state.history=null;state.retrieved=0;state.day=0;state.minutes=null;state.sky=null;state.skyKey='';state.airError=false;}
    renderAll(); renderHistory(); updateMap();
    const aqURL=`https://air-quality-api.open-meteo.com/v1/air-quality?${new URLSearchParams({latitude:place.lat,longitude:place.lon,current:'us_aqi,pm2_5,pm10,nitrogen_dioxide,ozone',hourly:'us_aqi,pm2_5,pm10,nitrogen_dioxide,ozone',forecast_days:'7',timezone:'auto',timeformat:'unixtime'})}`;
    const airPromise=fetchJSON(aqURL,signal).then(data=>({data})).catch(error=>({error}));
    try {
      const weather=await fetchJSON(D.forecastURL(place,requestedModel),signal);
      if (revision!==state.revision) return;
      if(!weather.current || !Array.isArray(weather.hourly?.time) || !Array.isArray(weather.daily?.time) || !weather.timezone) throw new Error('Incomplete provider response');
      // Validate the provider timezone before it reaches date formatters.
      new Intl.DateTimeFormat('en',{timeZone:weather.timezone});
      state.weather=weather;state.weatherModel=requestedModel;
      const sameDate=same&&keepDate?weather.daily.time.findIndex(epoch=>D.dateKey(epoch,weather.timezone)===keepDate):-1;
      if(sameDate>=0)state.day=sameDate;else {state.day=0;state.minutes=null;}
      state.place.timezone=weather.timezone;state.retrieved=Date.now();state.loading=false;
      state.cityWeather.set(placeKey(place),{current:weather.current,at:Date.now()});
      state.air=null;state.airError=false;
      write('pimx.weather.place',state.place);renderAll();renderHistory();updateMap();renderSaved();renderSources();
      const air=await airPromise;
      if (revision!==state.revision) return;
      state.air=air.data || null;state.airError=!!air.error;renderAir();renderMetrics();
      loadSavedWeather();
    } catch (error) {
      if(revision!==state.revision || signal.aborted) return;
      console.warn('Weather provider request failed:',error.message);
      state.loading=false;state.error=same?'retainedData':'networkError';
      if(!same) state.airError=true;
      renderAll();
    }
  }
  function renderAll() {
    renderStatus();renderQuick();renderDateControls();renderHero();renderSun();renderHourly();renderForecast();renderMetrics();renderAir();renderInsights();renderAstronomy();renderSolar();updateClock();
    ['C','F'].forEach(u=>{const e=$(`unit${u}`);e.classList.toggle('active',state.unit===u);e.setAttribute('aria-pressed',String(state.unit===u));});
    if(state.retrieved) $('fetchTime').textContent=t('retrievedAt',{time:time(state.retrieved/1000,{second:'2-digit'}),zone:zone()});
    else $('fetchTime').textContent=t('noData');
  }
  function renderDateControls(){
    const context=view(),d=state.weather?.daily;
    $('prevDay').disabled=!context||state.day===0;$('nextDay').disabled=!context||state.day>=d.time.length-1;
    $('datePicker').disabled=!context;$('solarSystemHour').disabled=!context;$('timePlay').disabled=!context;
    $('timePlay').setAttribute('aria-label',t(timeTimer?'pauseTime':'playTime'));
    $('modelSelect').value=state.model;
    if(!context){$('selectedDate').textContent='—';$('solarSystemHourDisplay').textContent='—';$('datePicker').value='';dateModelControls?.sync(D.dateKey(Date.now()/1000,zone()));return;}
    $('selectedDate').textContent=`${context.isToday?t('today'):date(context.epoch,{weekday:'long'})} · ${date(context.epoch,{year:'numeric'})}`;
    $('datePicker').min=D.dateKey(d.time[0],zone());$('datePicker').max=D.dateKey(d.time.at(-1),zone());$('datePicker').value=context.key;
    $('solarSystemHour').max=Math.floor((context.end-context.start)/60)-15;
    $('solarSystemHour').value=Math.floor((context.epoch-context.start)/60/15)*15;
    $('solarSystemHourDisplay').textContent=time(context.epoch);
    $('resetToNow').classList.toggle('radar-on',context.live);
    dateModelControls?.sync(D.dateKey(Date.now()/1000,zone()));
  }
  function changeDay(index){
    stopTime();
    if(!state.weather || index<0 || index>=state.weather.daily.time.length)return;
    state.day=index;state.minutes=null;if(index>=state.days)state.days=14;renderAll();
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
      ['overview','sunMoonDetails','planetInfoBox'].forEach(id=>$(id).animate([{opacity:.45,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:450,easing:'cubic-bezier(.2,.7,.2,1)'}));
    }
  }
  let timeTimer=null;
  function stopTime(){clearInterval(timeTimer);timeTimer=null;$('timePlay').setAttribute('aria-pressed','false');$('timePlay').setAttribute('aria-label',t('playTime'));$('timePlay').innerHTML=icon('play');}
  function playTime(){
    if(timeTimer){stopTime();return;}if(!view())return;
    $('timePlay').setAttribute('aria-pressed','true');$('timePlay').setAttribute('aria-label',t('pauseTime'));$('timePlay').innerHTML=icon('pause');
    timeTimer=setInterval(()=>{
      const context=view();if(!context){stopTime();return;}
      const next=context.epoch+3600;
      if(next>=context.end){if(state.day>=state.weather.daily.time.length-1){stopTime();return;}state.day++;const bounds=D.dayBounds(state.weather.daily.time[state.day],zone());state.minutes=Math.max(0,(next-bounds.start)/60);}
      else state.minutes=(next-context.start)/60;
      renderAll();
    },1000);
  }
  function renderHero() {
    $('placeName').textContent=placeName(state.place);
    $('placeRegion').textContent=[state.place.admin1,countryName(state.place)].filter(Boolean).join(' · ') || `${state.place.lat.toFixed(4)}°, ${state.place.lon.toFixed(4)}°`;
    const w=state.weather,c=weatherSample(),context=view(),i=state.day;
    document.querySelector('[data-t=currentConditions]').textContent=context&&!context.live?t('selectedForecast',{date:date(context.epoch),time:time(c?.time)}):t('currentConditions');
    $('currentTemp').textContent=temp(c?.temperature_2m,false);$('heroUnit').textContent=`°${state.unit}`;
    $('currentCondition').textContent=c?condition(c.weather_code):t(state.loading?'loading':'noData');
    $('currentWeatherIcon').innerHTML=c?icon(weatherIcon(c.weather_code,c.is_day)):'';
    $('heroFeels').textContent=c?t('feels',{value:`${temp(c.apparent_temperature)}${state.unit}`}):'—';
    $('todayHigh').textContent=t('high',{value:temp(w?.daily.temperature_2m_max?.[i])});
    $('todayLow').textContent=t('low',{value:temp(w?.daily.temperature_2m_min?.[i])});
    $('dataTime').textContent=c?t('dataAt',{time:time(c.time)}):'—';
    const night=c?.is_day===0, rain=c && [51,53,55,56,57,61,63,65,66,67,80,81,82,95,96,99].includes(c.weather_code);
    $('overview').style.background=night?'linear-gradient(115deg,#233345,#23384c 55%,#30455d)':rain?'linear-gradient(115deg,#354452,#455d6b)':'linear-gradient(115deg,#294052,#3b6775)';
    $('skyScene').innerHTML=`${night?'<div class="stars"></div>':''}<div class="orbit-ring"></div><div class="sky-orb ${night?'night':''}"></div>${c?.weather_code>1?'<div class="scene-cloud"></div><div class="scene-cloud second"></div>':''}${rain?'<div class="scene-rain"></div>':''}<svg class="landscape" viewBox="0 0 600 350" preserveAspectRatio="none"><path d="M0 350 70 260 130 277 252 96 300 145 362 75 430 178 480 161 600 285V350Z" fill="#446274" opacity=".55"/><path d="m140 260 112-164 48 49-39-11-24 45-14-8Z" fill="#b6c8cf" opacity=".18"/><path d="M0 350 100 306 240 231 303 269 415 202 490 260 600 230V350Z" fill="#294657"/><path d="M0 350 184 304 293 327 425 280 600 308V350Z" fill="#1d3544"/><g fill="none" stroke="#a4c8d3" stroke-opacity=".1"><path d="M0 341c200-70 320 60 600-37M0 330c200-70 320 60 600-37M0 319c200-70 320 60 600-37"/></g></svg>`;
  }
  function updateClock() {
    const now=Date.now()/1000;
    const context=view();
    $('localClock').textContent=state.weather || state.place.timezone ? `${time(context?.epoch ?? now)} · ${zone()}` : '—';
    $('todayDate').textContent=date(context?.epoch ?? now,{weekday:'long',year:'numeric'});
  }
  function renderSun() {
    const d=state.weather?.daily,i=state.day,context=view(),rise=d?.sunrise?.[i],set=d?.sunset?.[i],now=context?.epoch ?? Date.now()/1000;
    document.querySelector('.daylight-panel .small-tag').textContent=context?.isToday?t('today'):context?date(context.epoch):t('today');
    $('sunriseTime').textContent=time(rise);$('sunsetTime').textContent=time(set);
    const duration=d?.daylight_duration?.[i];
    $('daylightLength').textContent=D.finite(duration)?t('daylight',{h:num(Math.floor(duration/3600)),m:num(Math.floor(duration%3600/60))}):'—';
    let message='—';
    if(D.finite(rise)&&rise>0&&D.finite(set)&&set>0) {
      const seconds=now<rise?rise-now:now<set?set-now:null;
      message=seconds===null?t('afterSunset'):t(now<rise?'untilSunrise':'untilSunset',{h:num(Math.floor(seconds/3600)),m:num(Math.floor(seconds%3600/60))});
    } else if(D.finite(duration)) message=t(duration>43200?'polarDay':'polarNight');
    $('sunCountdown').textContent=message;
    const hasArc=D.finite(rise)&&rise>0&&D.finite(set)&&set>rise;
    const progress=hasArc?Math.max(0,Math.min(1,(now-rise)/(set-rise))):null;
    const angle=Math.PI*(1-(progress ?? 0));const x=140+105*Math.cos(angle),y=140-105*Math.sin(angle);
    $('sunArc').innerHTML=`<svg viewBox="0 0 280 165"><defs><linearGradient id="sunFill" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#d5f5a0" stop-opacity=".15"/><stop offset="1" stop-color="#d5f5a0" stop-opacity="0"/></linearGradient></defs><path d="M35 140A105 105 0 0 1 245 140Z" fill="url(#sunFill)"/><path d="M35 140A105 105 0 0 1 245 140" fill="none" stroke="var(--line)" stroke-width="2" stroke-dasharray="4 5"/><path d="M20 140h240" stroke="var(--line)"/>${hasArc?`<path d="M35 140A105 105 0 0 1 245 140" fill="none" stroke="var(--accent)" stroke-width="2" pathLength="100" stroke-dasharray="${progress*100} 100"/><circle cx="${x}" cy="${y}" r="15" fill="#d5f5a012"/><circle cx="${x}" cy="${y}" r="6" fill="var(--accent)"/>`:''}<circle cx="35" cy="140" r="3" fill="var(--muted)"/><circle cx="245" cy="140" r="3" fill="var(--muted)"/><text x="140" y="123" text-anchor="middle" fill="var(--muted)" font-size="10" font-family="Inter,Vazirmatn,sans-serif">${esc(hasArc?time(now):t('noData'))}</text></svg>`;
  }
  function nextHours() {
    const h=state.weather?.hourly,context=view();if(!h||!context)return [];
    if(!context.live)return D.dayIndices(h.time,context.epoch,zone());
    const i=context.hour;return i>=0?Array.from({length:Math.min(24,h.time.length-i)},(_,n)=>i+n):[];
  }
  function chartSVG(values, labels, color='var(--accent)', id='hour', valueFormatter=v=>num(v),second=null) {
    const actual=[...values,...(second || [])].filter(D.finite);if(!actual.length)return empty(t('noData'));
    const max=Math.max(...actual),min=Math.min(...actual),range=Math.max(max-min,1);
    const lower=min-range*.15,upper=max+range*.15,W=700,H=145,left=35,right=12,top=15,bottom=25;
    const x=i=>left+i*(W-left-right)/Math.max(values.length-1,1),y=v=>top+(upper-v)/(upper-lower)*(H-top-bottom);
    let segments=[],current=[];
    values.forEach((v,i)=>{if(D.finite(v))current.push([x(i),y(v)]);else if(current.length){segments.push(current);current=[];}});if(current.length)segments.push(current);
    const line=s=>s.map((p,i)=>`${i?'L':'M'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ');
    let secondPaths='';
    if(second){let run=[];const flush=()=>{if(run.length)secondPaths+=`<path d="${line(run)}" fill="none" stroke="#d9aa85" stroke-width="2"/>`;run=[];};second.forEach((v,i)=>{if(D.finite(v))run.push([x(i),y(v)]);else flush();});flush();}
    let grid='';for(let i=0;i<3;i++){const value=lower+(upper-lower)*i/2,yy=y(value);grid+=`<path d="M${left} ${yy}H${W-right}" stroke="var(--line)" stroke-dasharray="3 5"/><text x="0" y="${yy+3}" fill="var(--muted)" font-size="9">${esc(valueFormatter(value))}</text>`;}
    const step=Math.max(1,Math.ceil(values.length/6));
    const ticks=labels.map((label,i)=>i%step===0?`<text x="${x(i)}" y="${H-3}" text-anchor="middle" fill="var(--muted)" font-size="9">${esc(label)}</text>`:'').join('');
    const hit=values.map((v,i)=>D.finite(v)?`<rect class="chart-hit" x="${x(i)-((W-left-right)/Math.max(values.length-1,1))/2}" y="0" width="${(W-left-right)/Math.max(values.length-1,1)}" height="${H}" data-chart-index="${i}"/>`:'').join('');
    return `<svg class="weather-chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="${esc(t(id==='hour'?'hourlyTitle':'historyTitle'))}" style="font-family:Inter,Vazirmatn,sans-serif"><defs><linearGradient id="fill-${id}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${color}" stop-opacity=".16"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>${grid}${segments.map(s=>`<path d="${line(s)} L${s.at(-1)[0]},${H-bottom} L${s[0][0]},${H-bottom}Z" fill="url(#fill-${id})"/><path d="${line(s)}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round"/>`).join('')}${secondPaths}${ticks}${hit}</svg>`;
  }
  function renderHourly() {
    const indices=nextHours(),h=state.weather?.hourly;
    document.querySelector('[data-t=hourlyTitle]').textContent=view()?.live?t('hourlyTitle'):t('selectedHours');
    document.querySelectorAll('#chartModes button').forEach(e=>{const active=e.dataset.mode===state.chartMode;e.classList.toggle('active',active);e.setAttribute('aria-pressed',String(active));});
    if(!h || !indices.length) {$('hourlyChart').innerHTML=empty(t(state.loading?'loading':'noData'));$('hourlyCards').innerHTML='';return;}
    const values=indices.map(i=>state.chartMode==='temperature_2m'?D.temperature(h[state.chartMode]?.[i],state.unit):h[state.chartMode]?.[i]);
    const unit=state.chartMode==='temperature_2m'?`°${state.unit}`:state.chartMode==='precipitation_probability'?'%':'km/h';
    const labels=indices.map(i=>time(h.time[i]));
    $('hourlyChart').innerHTML=chartSVG(values,labels,state.chartMode==='precipitation_probability'?'var(--blue)':'var(--accent)');
    const tooltip=document.createElement('div');tooltip.className='chart-tooltip';tooltip.hidden=true;$('hourlyChart').append(tooltip);
    $('hourlyChart').querySelectorAll('[data-chart-index]').forEach(e=>{
      const show=()=>{const i=Number(e.dataset.chartIndex);tooltip.textContent=`${labels[i]} · ${num(values[i],1)} ${unit}`;tooltip.hidden=false;};
      e.addEventListener('pointerenter',show);e.addEventListener('pointerdown',show);e.addEventListener('pointerleave',()=>tooltip.hidden=true);
    });
    $('hourlyCards').innerHTML=indices.filter((_,n)=>n%3===0).map((i,n)=>`<div class="hour-card ${i===view()?.hour?'current':''}"><span class="time">${n===0&&view()?.live?t('now'):time(h.time[i])}</span>${icon(weatherIcon(h.weather_code?.[i],h.is_day?.[i]))}<strong>${temp(h.temperature_2m?.[i])}</strong><small>${num(h.precipitation_probability?.[i])}%</small></div>`).join('');
  }
  function renderForecast() {
    const d=state.weather?.daily;
    document.querySelectorAll('#forecastDays button').forEach(e=>{const active=Number(e.dataset.days)===state.days;e.classList.toggle('active',active);e.setAttribute('aria-pressed',String(active));});
    if(!d){$('forecastGrid').innerHTML=empty(t(state.loading?'loading':'noData'));$('dayDetail').hidden=true;return;}
    $('forecastGrid').innerHTML=d.time.slice(0,state.days).map((epoch,i)=>`<button class="forecast-day ${state.day===i?'active':''}" data-day="${i}" aria-pressed="${state.day===i}" aria-label="${esc(`${date(epoch,{weekday:'long'})}, ${condition(d.weather_code?.[i])}`)}"><span class="day-name">${i===0?t('today'):i===1?t('tomorrow'):date(epoch,{weekday:'short',month:undefined,day:undefined})}</span><span class="day-date">${date(epoch)}</span>${icon(weatherIcon(d.weather_code?.[i]))}<div class="day-temperatures"><strong>${temp(d.temperature_2m_max?.[i])}</strong><span>${temp(d.temperature_2m_min?.[i])}</span></div><div class="day-rain">${icon('droplet')}${num(d.precipitation_probability_max?.[i])}%</div></button>`).join('');
    document.querySelector('.forecast-note').textContent=`${t('forecastNote')} · ${t('modelHorizon',{model:modelName(),days:num(d.time.length)})}`;
    const i=state.day;
    $('dayDetail').hidden=false;
    const details=[[t('totalRain'),`${num(d.precipitation_sum?.[i],1)} mm`],[t('maxWind'),`${num(d.wind_speed_10m_max?.[i])} km/h`],[t('maxUV'),num(d.uv_index_max?.[i],1)],[t('sunrise'),time(d.sunrise?.[i])],[t('sunset'),time(d.sunset?.[i])]];
    $('dayDetail').innerHTML=`<div class="day-summary"><span class="day-summary-icon">${icon(weatherIcon(d.weather_code?.[i]))}</span><div><span>${t('dayWeather')}</span><strong>${esc(condition(d.weather_code?.[i]))}</strong></div></div><div class="day-detail-grid">${details.map(([label,value])=>`<div class="day-detail-item"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join('')}</div>`;
  }
  function renderMetrics() {
    const c=weatherSample(),h=state.weather?.hourly,context=view(),i=context?.hour ?? -1,hv=name=>i>=0?h[name]?.[i]:null,d=state.weather?.daily,n=state.day;
    const windDir=D.finite(c?.wind_direction_10m)?`${['N','NE','E','SE','S','SW','W','NW'][Math.round(c.wind_direction_10m/45)%8]} ${num(c.wind_direction_10m)}°`:'';
    const note=context?.live?t('currentModel'):t('viewSample',{time:time(c?.time)}),sky=skySnapshot(),aq=airSample();
    const items=[
      ['thermometer','feelsLike',temp(c?.apparent_temperature),state.unit,note,D.finite(c?.apparent_temperature)?(c.apparent_temperature+20)/70*100:null],
      ['droplet','humidity',num(c?.relative_humidity_2m),'%',note,c?.relative_humidity_2m],
      ['wind','wind',num(c?.wind_speed_10m),'km/h',`${windDir} · ${t('gusts',{value:num(c?.wind_gusts_10m)})}`,D.finite(c?.wind_speed_10m)?c.wind_speed_10m/60*100:null],
      ['gauge','surfacePressure',num(c?.surface_pressure),'hPa',note,D.finite(c?.surface_pressure)?(c.surface_pressure-800)/300*100:null],
      ['eye','visibility',num(D.finite(hv('visibility'))?hv('visibility')/1000:null,1),t('km'),t('hourlyModel'),D.finite(hv('visibility'))?hv('visibility')/20000*100:null],
      ['thermometer','dewPoint',temp(hv('dew_point_2m')),state.unit,t('hourlyModel'),D.finite(hv('dew_point_2m'))?(hv('dew_point_2m')+20)/60*100:null],
      ['droplet','probability',num(d?.precipitation_probability_max?.[n]),'%',`${t('totalRain')}: ${num(d?.precipitation_sum?.[n],1)} mm`,d?.precipitation_probability_max?.[n]],
      ['sun','uv',num(hv('uv_index'),1),'',t('hourlyModel'),D.finite(hv('uv_index'))?hv('uv_index')/12*100:null],
      ['wind','air',num(aq?.us_aqi),'US AQI',D.aqiCategory(aq?.us_aqi)>=0?t(['good','moderate','sensitive','unhealthy','veryUnhealthy','hazardous'][D.aqiCategory(aq.us_aqi)]):t('noData'),D.finite(aq?.us_aqi)?aq.us_aqi/300*100:null],
      ['sunrise','sunrise',time(d?.sunrise?.[n]),'',context?date(context.epoch):'—',null],
      ['sunrise','sunset',time(d?.sunset?.[n]),'',context?date(context.epoch):'—',null],
      ['moon','phaseLabel',sky?moonName(sky.moon.phase):'—','',sky?t('illumination',{value:num(sky.moon.illumination*100,1)}):'—',sky?sky.moon.illumination*100:null],
      ['gauge','pressure',num(c?.pressure_msl),'hPa',note,D.finite(c?.pressure_msl)?(c.pressure_msl-950):null],
      ['cloud','cloudCover',num(c?.cloud_cover),'%',note,c?.cloud_cover]
    ];
    $('metricsGrid').innerHTML=items.map(([ic,key,value,unit,detail,bar])=>`<div class="metric" data-metric="${key}"><div class="metric-top">${icon(ic)}<span>${t(key)}</span></div><div class="metric-value ${key==='phaseLabel'?'metric-text':''}">${esc(value)}<small>${esc(unit)}</small></div><div class="metric-note">${esc(detail)}</div><div class="metric-bar"><span style="width:${D.finite(bar)?Math.max(0,Math.min(100,bar)):0}%"></span></div></div>`).join('');
  }
  function renderAir() {
    const c=airSample();
    if(!c){$('airContent').innerHTML=empty(t(state.airError?'airError':state.air?'airBeyondRange':state.loading || state.weather?'loading':'noData'));return;}
    const index=D.aqiCategory(c.us_aqi),keys=['good','moderate','sensitive','unhealthy','veryUnhealthy','hazardous'],colors=['#b4df8f','#ead37d','#e7a474','#e87f86','#bda0e6','#b77591'];
    const color=colors[index] || 'var(--muted)',progress=D.finite(c.us_aqi)?Math.min(300,c.us_aqi)/300*100:0;
    $('airContent').innerHTML=`<div class="aqi-summary" style="--aq-color:${color}"><div class="aqi-ring" style="--aq-progress:${progress}%"><strong>${num(c.us_aqi)}</strong></div><div class="aqi-description"><h3>${index<0?t('noData'):t(keys[index])}</h3><p>${t('aqiDescription')}</p></div></div><div class="air-pollutants">${[['PM₂.₅','pm2_5'],['PM₁₀','pm10'],['NO₂','nitrogen_dioxide'],['O₃','ozone']].map(([label,key])=>`<div class="pollutant"><span>${label}</span><strong>${num(c[key],1)} <small>μg/m³</small></strong></div>`).join('')}</div><div class="aqi-scale" aria-hidden="true"></div><div class="air-data-time">${t('dataAt',{time:time(c.time)})}</div>`;
  }
  function renderInsights() {
    if(!state.weather){$('insightContent').innerHTML=empty(t(state.loading?'loading':'noData'));return;}
    const h=state.weather.hourly,indices=nextHours(),d=state.weather.daily,n=state.day;
    const valid=i=>['temperature_2m','wind_speed_10m','precipitation_probability','is_day'].every(k=>D.finite(h[k]?.[i]));
    const mild=i=>valid(i)&&h.is_day[i]===1&&h.temperature_2m[i]>=10&&h.temperature_2m[i]<=28&&h.wind_speed_10m[i]<20&&h.precipitation_probability[i]<30;
    let best=[],run=[];indices.forEach(i=>{if(mild(i)){run.push(i);if(run.length>best.length)best=[...run];}else run=[];});
    const rain=indices.find(i=>D.finite(h.precipitation_probability?.[i])&&h.precipitation_probability[i]>=50);
    const allRainKnown=indices.length>0&&indices.every(i=>D.finite(h.precipitation_probability?.[i]));
    const main=best.length?t('walkingTime',{start:time(h.time[best[0]]),end:time(h.time[best.at(-1)]+3600)}):indices.length>0&&indices.every(valid)?t('noWindowBody'):t('insufficientInsight');
    $('insightContent').innerHTML=`<div class="insight-main"><div class="insight-icon">${icon(best.length?'walk':'cloud')}</div><h3>${t(best.length?'walkingTitle':'noWindow')}</h3><p>${esc(main)}</p>${best.length?`<p class="insight-criteria">${t('walkingCriteria')}</p>`:''}</div><div class="insight-row">${icon('droplet')}<div><strong>${t('nextRain')}</strong><p>${esc(rain!==undefined?t('nextRainTime',{time:time(h.time[rain]),value:num(h.precipitation_probability[rain])}):allRainKnown?t('noRain'):t('noData'))}</p></div></div><div class="insight-row">${icon('sun')}<div><strong>${t('uvPeak')}</strong><p>${t('uvPeakValue',{value:num(d.uv_index_max?.[n],1)})}</p></div></div>`;
  }
  function renderAstronomy() {
    const sky=skySnapshot();
    if(!sky){$('astronomyContent').innerHTML=empty(t(state.loading?'loading':'noData'));$('sunMoonDetails').innerHTML=empty(t(state.loading?'loading':'noData'));$('astronomyDate').textContent='—';return;}
    $('astronomyDate').textContent=`${date(sky.epoch,{weekday:'long',year:'numeric'})} · ${time(sky.epoch)} · ${zone()}`;
    const m=sky.moon,s=sky.sun;
    $('astronomyContent').innerHTML=`<div class="moon-display">${moonDisc(m)}<div class="moon-info"><h3>${moonName(m.phase)}</h3><p>${t('illumination',{value:num(m.illumination*100,1)})}</p></div></div><div class="astro-row"><span>${t('moonAltitude')}</span><strong>${num(m.altitude,1)}°</strong></div><div class="astro-row"><span>${t('sunAltitude')}</span><strong>${num(s.altitude,1)}°</strong></div><div class="astro-row"><span>${t('moonDistance')}</span><strong>${num(m.distance)} km</strong></div><p class="astronomy-note">${t('astroNote')}</p>`;
    const event=value=>value===null?t('notOnDay'):time(value);
    const fields=(items)=>items.map(([key,value,id])=>`<div class="celestial-detail"><span>${t(key)}</span><strong id="${id}">${esc(value)}</strong></div>`).join('');
    const sunFields=[['sunrise',event(s.rise),'sunRiseDetail'],['sunset',event(s.set),'sunSetDetail'],['dayLength',duration(s.duration),'sunDayLengthDetail'],['solarNoon',event(s.noon),'sunSolarNoonDetail'],['sunAltitude',`${num(s.altitude,1)}°`,'sunAltitudeDetail'],['sunAzimuth',`${num(s.azimuth,1)}°`,'sunAzimuthDetail'],['maxAltitude',`${num(s.maxAltitude,1)}°`,'sunMaxAltitudeDetail'],['sunDistance',`${num(s.distance)} km`,'sunDistanceDetail']];
    const moonFields=[['phaseLabel',moonName(m.phase),'moonPhaseDetail'],['illuminationLabel',`${num(m.illumination*100,1)}%`,'moonIlluminationDetail'],['moonAge',`${num(m.age,2)} ${t('daysUnit')}`,'moonAgeDetail'],['moonrise',event(m.rise),'moonRiseDetail'],['moonset',event(m.set),'moonSetDetail'],['moonDuration',duration(m.duration),'moonDurationDetail'],['moonAltitude',`${num(m.altitude,1)}°`,'moonAltitudeDetail'],['moonAzimuth',`${num(m.azimuth,1)}°`,'moonAzimuthDetail'],['moonDistance',`${num(m.distance)} km`,'moonDistanceDetail']];
    $('sunMoonDetails').innerHTML=`<article class="celestial-card sun-card"><div class="celestial-header"><div class="sun-sculpture" aria-hidden="true"></div><div><h3>${t('sunName')}</h3><p>${t('skyStatus',{state:t(s.altitude>=0?'aboveHorizon':'belowHorizon'),alt:num(s.altitude,1),az:num(s.azimuth,1)})}</p></div></div><div class="celestial-grid">${fields(sunFields)}</div><div class="celestial-track">${skyTrack(sky,s,'sun')}</div><div class="celestial-status" id="sunStatus">${s.rise!==null&&s.set!==null?t('positionProgress',{value:num(Math.max(0,Math.min(100,(sky.epoch-s.rise)/(s.set-s.rise)*100)))}):t(s.duration>0?'polarDay':'polarNight')}</div></article><article class="celestial-card moon-card"><div class="celestial-header">${moonDisc(m)}<div><h3>${t('moonName')} · ${moonName(m.phase)}</h3><p>${t('illumination',{value:num(m.illumination*100,1)})}</p></div></div><div class="celestial-grid">${fields(moonFields)}</div><div class="celestial-track">${skyTrack(sky,m,'moon')}</div><div class="celestial-status" id="moonStatus">${t('skyStatus',{state:t(m.altitude>=0?'aboveHorizon':'belowHorizon'),alt:num(m.altitude,1),az:num(m.azimuth,1)})}</div></article>`;
  }
  function moonName(phase){return t(['newMoon','waxingCrescent','firstQuarter','waxingGibbous','fullMoon','waningGibbous','lastQuarter','waningCrescent'][Math.round(phase*8)%8]);}
  function moonDisc(moon){
    const f=moon.illumination,rx=Math.abs(2*f-1)*50,sweep=f>.5?1:0;
    const path=`M50 0 A50 50 0 0 1 50 100 A${Math.max(.001,rx)} 50 0 0 ${sweep} 50 0`;
    return `<div class="moon-sphere physical-moon" aria-hidden="true"><svg viewBox="0 0 100 100"><defs><radialGradient id="moon-light"><stop stop-color="#e9ece2"/><stop offset="1" stop-color="#9daaaa"/></radialGradient></defs><circle cx="50" cy="50" r="50" fill="#202b38"/><g ${moon.phase>.5?'transform="translate(100 0) scale(-1 1)"':''}><path d="${path}" fill="url(#moon-light)"/></g><g fill="#718084" opacity=".18"><circle cx="32" cy="27" r="8"/><circle cx="63" cy="64" r="11"/><circle cx="35" cy="74" r="5"/><circle cx="73" cy="35" r="4"/></g></svg></div>`;
  }
  function skyTrack(sky,body,key){
    const x=at=>35+(at-sky.start)/(sky.end-sky.start)*550,y=alt=>105-alt;
    const line=body.samples.map((sample,i)=>`${i?'L':'M'}${x(sample.at)},${y(sample.altitude)}`).join(' ');
    const color=key==='sun'?'#efd29a':'#99bef0';
    const labels=body.samples.filter((_,i)=>i%12===0).map(sample=>`<text x="${x(sample.at)}" y="210" text-anchor="middle" fill="var(--muted)" font-size="10">${esc(time(sample.at))}</text>`).join('');
    return `<svg viewBox="0 0 620 220" role="img" aria-label="${esc(t(key==='sun'?'sunAltitude':'moonAltitude'))}"><path d="M35 105H585" stroke="var(--line)" stroke-dasharray="4 5"/><text x="5" y="109" fill="var(--muted)" font-size="10">0°</text><path d="M35 15H585M35 195H585" stroke="var(--line)" opacity=".4"/><path d="${line}" fill="none" stroke="${color}" stroke-width="2"/><path d="M${x(sky.epoch)} 15V195" stroke="${color}" opacity=".2"/><circle cx="${x(sky.epoch)}" cy="${y(body.altitude)}" r="12" fill="${color}" opacity=".12"/><circle cx="${x(sky.epoch)}" cy="${y(body.altitude)}" r="5" fill="${color}"/>${labels}<text x="${Math.max(60,Math.min(550,x(sky.epoch)))}" y="${Math.max(14,y(body.altitude)-15)}" text-anchor="middle" fill="${color}" font-size="12">${esc(num(body.altitude,1))}°</text></svg>`;
  }
  function renderSolar(){
    const sky=skySnapshot();$('solarCanvas').style.visibility=sky?'visible':'hidden';$('planetLabels').hidden=!sky;$('solarStatus').hidden=!!sky;
    if(!sky){$('solarStatus').textContent=t(state.loading?'loading':'noData');$('planetInfoBox').innerHTML=empty(t(state.loading?'loading':'noData'));$('planetTable').innerHTML='';$('planetLegend').innerHTML='';$('solarDate').textContent='—';state.solarRenderer?.setVisible(false);return;}
    $('solarDate').textContent=`${date(sky.epoch,{year:'numeric'})} · ${time(sky.epoch)} · ${zone()}`;
    $('solarMotion').setAttribute('aria-pressed',String(state.cameraMotion));
    $('solarMotion').innerHTML=`${icon(state.cameraMotion?'pause':'play')}<span>${t('cameraMotion')}</span>`;
    $('planetLegend').innerHTML=sky.planets.map(p=>`<button class="planet-choice ${p.key===state.selectedPlanet?'active':''}" data-planet="${p.key}" aria-pressed="${p.key===state.selectedPlanet}"><span style="background:${p.color}"></span>${t(p.name)}<small>${p.au.toFixed(2)} AU</small></button>`).join('');
    const p=sky.planets.find(p=>p.key===state.selectedPlanet) || sky.planets[2];
    $('planetInfoBox').innerHTML=`<div class="planet-info-head"><span class="planet-mini" style="--planet-color:${p.color}"></span><div><h3>${t(p.name)}</h3><p>${date(sky.epoch)} · ${time(sky.epoch)}</p></div></div><div class="planet-info-grid"><div><span>${t('distanceSun')}</span><strong data-planet-distance="${p.key}">${num(p.distance,4)} AU</strong><small>${num(p.distance*SkyData.AU_KM/1e6,2)} ${t('millionKm')}</small></div><div><span>${t('solarCoords')}</span><strong class="planet-coordinates" data-planet-coordinates="${p.key}"><bdi>X ${num(p.x,5)} · Y ${num(p.y,5)} · Z ${num(p.z,5)}</bdi></strong><small>${t(p.z>=0?'abovePlane':'belowPlane')}</small></div><div><span>${t('planetAltitude')}</span><strong>${p.horizon?`${num(p.horizon.altitude,1)}°`:'—'}</strong><small>${p.horizon?t(p.horizon.altitude>=0?'aboveHorizon':'belowHorizon'):t('yourLocation')}</small></div><div><span>${t('planetAzimuth')}</span><strong>${p.horizon?`${num(p.horizon.azimuth,1)}°`:'—'}</strong><small>${t('meanDistance')} · ${num(p.au,3)} AU</small></div></div>`;
    $('planetTable').innerHTML=`<table class="planet-table"><thead><tr><th>${t('planetName')}</th><th>${t('distanceSun')} · AU</th><th>X · AU</th><th>Y · AU</th><th>Z · AU</th><th>${t('planetAltitude')}</th><th>${t('planetAzimuth')}</th></tr></thead><tbody>${sky.planets.map(p=>`<tr><td><button data-planet="${p.key}">${t(p.name)}</button></td><td>${num(p.distance,4)}</td><td>${num(p.x,5)}</td><td>${num(p.y,5)}</td><td>${num(p.z,5)}</td><td>${p.horizon?`${num(p.horizon.altitude,1)}°`:'—'}</td><td>${p.horizon?`${num(p.horizon.azimuth,1)}°`:'—'}</td></tr>`).join('')}</tbody></table>`;
    if(state.solarRenderer){state.solarRenderer.setVisible(state.solarVisible);state.solarRenderer.update(sky,state.selectedPlanet,state.lang);}
    else if(state.solarVisible)initSolarRenderer();
  }
  async function initSolarRenderer(){
    if(state.solarLoading||state.solarRenderer||!skySnapshot())return;
    state.solarLoading=true;
    try{
      const {createSolarSystem}=await import('./assets/solar-system.js');
      state.solarRenderer=createSolarSystem({container:$('solarCanvas'),labels:$('planetLabels'),motion:state.cameraMotion,onSelect:key=>{state.selectedPlanet=key;renderSolar();},onZoom:percent=>$('zoomLevel').textContent=`${num(percent)}%`,onFallback:()=>toast(t('webglFallback'))});
      state.solarRenderer.setVisible(state.solarVisible);state.solarRenderer.update(skySnapshot(),state.selectedPlanet,state.lang);
    }catch(error){console.warn('Solar renderer failed:',error.message);$('solarCanvas').innerHTML=empty(t('webglFallback'));}
    state.solarLoading=false;
  }
  let searchController=null,searchTimer=null,searchRevision=0,searchPlaces=[],searchActive=-1;
  const aliases={'تهران':'Tehran','لندن':'London','دبی':'Dubai','توکیو':'Tokyo','اصفهان':'Isfahan','شیراز':'Shiraz','مشهد':'Mashhad','تبریز':'Tabriz','رشت':'Rasht','کرج':'Karaj','اهواز':'Ahvaz','یزد':'Yazd','کرمان':'Kerman','بندرعباس':'Bandar Abbas','پاریس':'Paris','نیویورک':'New York','استانبول':'Istanbul'};
  function closeSearch() { $('searchResults').hidden=true;$('searchInput').setAttribute('aria-expanded','false');$('searchInput').removeAttribute('aria-activedescendant');searchActive=-1; }
  async function searchCities(query,revision) {
    searchController?.abort();searchController=new AbortController();
    $('searchResults').hidden=false;$('searchInput').setAttribute('aria-expanded','true');
    $('searchResults').innerHTML=`<div class="search-message">${t('loading')}</div>`;
    try {
      const data=await fetchJSON(`https://geocoding-api.open-meteo.com/v1/search?${new URLSearchParams({name:aliases[query] || query,count:'8',language:state.lang,format:'json'})}`,searchController.signal);
      if(revision!==searchRevision) return;
      searchPlaces=(data.results || []).map(p=>({name:p.name,country:p.country || '',admin1:p.admin1 || '',lat:p.latitude,lon:p.longitude,timezone:p.timezone})).filter(D.validPlace);
      searchActive=-1;
      $('searchResults').innerHTML=searchPlaces.length?searchPlaces.map((p,i)=>`<button class="search-result" id="search-result-${i}" role="option" aria-selected="false" data-search="${i}">${icon('pin')}<span><strong>${esc(p.name)}</strong><small>${esc([p.admin1,p.country].filter(Boolean).join(' · '))}</small></span></button>`).join(''):`<div class="search-message">${t('noResults')}</div>`;
    } catch(error) {if(revision===searchRevision&&!searchController.signal.aborted)$('searchResults').innerHTML=`<div class="search-message">${t('searchError')}</div>`;}
  }
  function selectSearch(index) {const place=searchPlaces[index];if(!place)return;closeSearch();$('searchInput').value='';loadPlace(place);}
  $('searchInput').addEventListener('input',()=>{
    const query=$('searchInput').value.trim(),revision=++searchRevision;clearTimeout(searchTimer);searchController?.abort();searchPlaces=[];
    if(query.length<2){closeSearch();return;}searchTimer=setTimeout(()=>searchCities(query,revision),350);
  });
  $('searchInput').addEventListener('keydown',event=>{
    if(event.key==='Escape'){closeSearch();return;}
    if(['ArrowDown','ArrowUp'].includes(event.key)&&searchPlaces.length&&!$('searchResults').hidden){
      event.preventDefault();searchActive=(searchActive+(event.key==='ArrowDown'?1:-1)+searchPlaces.length)%searchPlaces.length;
      $('searchInput').setAttribute('aria-activedescendant',`search-result-${searchActive}`);
      $('searchResults').querySelectorAll('[role=option]').forEach((e,i)=>e.setAttribute('aria-selected',String(i===searchActive)));
      $(`search-result-${searchActive}`).scrollIntoView({block:'nearest'});
    }
    if(event.key==='Enter'&&searchPlaces.length&&!$('searchResults').hidden){event.preventDefault();selectSearch(Math.max(0,searchActive));}
  });
  $('searchResults').addEventListener('click',event=>{const e=event.target.closest('[data-search]');if(e)selectSearch(Number(e.dataset.search));});
  document.addEventListener('pointerdown',event=>{if(!event.target.closest('.search-box'))closeSearch();});
  document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();$('searchInput').focus();$('searchInput').scrollIntoView({block:'center'});}});
  function saveCity() {
    if(!state.weather || state.loading)return;
    if(state.saved.some(p=>placeKey(p)===placeKey(state.place))){toast(t('alreadySaved'));return;}
    if(state.saved.length>=20){toast(t('maxCities'));return;}
    state.saved.push({...state.place});write('pimx.weather.cities',state.saved);renderSaved();renderQuick();toast(t('saved'));loadSavedWeather();
  }
  function renderSaved() {
    if(!state.saved.length){$('savedCities').innerHTML=empty(t('noCities'));return;}
    $('savedCities').innerHTML=state.saved.map((p,i)=>{
      const record=state.cityWeather.get(placeKey(p)),c=record?.current;
      const stale=record && Date.now()-record.at>=15*60*1000;
      return `<div class="saved-city"><button class="city-select" data-city="${i}">${icon(weatherIcon(c?.weather_code,c?.is_day))}<span class="city-info"><strong>${esc(placeName(p))}</strong><small>${esc(countryName(p))}${c?` · ${esc(stale?t('stale'):condition(c.weather_code))}`:''}</small></span><span class="city-temp">${temp(c?.temperature_2m)}</span></button><button class="icon-button city-remove" data-remove="${i}" aria-label="${esc(t('removeCity',{name:placeName(p)}))}">${icon('close')}</button></div>`;
    }).join('');
  }
  async function loadSavedWeather() {
    const revision=++state.cityRevision;
    const pending=state.saved.filter(p=>{const record=state.cityWeather.get(placeKey(p));return !record || Date.now()-record.at>=15*60*1000;});
    await Promise.allSettled(pending.map(async p=>{
      try {
        const data=await fetchJSON(`https://api.open-meteo.com/v1/forecast?${new URLSearchParams({latitude:p.lat,longitude:p.lon,current:'temperature_2m,weather_code,is_day',forecast_days:'1',timeformat:'unixtime'})}`);
        if(revision!==state.cityRevision)return;
        state.cityWeather.set(placeKey(p),{current:data.current || null,at:Date.now()});renderSaved();
      } catch {if(revision===state.cityRevision){state.cityWeather.delete(placeKey(p));renderSaved();}}
    }));
  }
  $('savedCities').addEventListener('click',event=>{
    const remove=event.target.closest('[data-remove]'),select=event.target.closest('[data-city]');
    if(remove){const i=Number(remove.dataset.remove);state.saved.splice(i,1);write('pimx.weather.cities',state.saved);renderSaved();renderQuick();toast(t('removed'));}
    else if(select)loadPlace(state.saved[Number(select.dataset.city)]);
  });
  function renderHistory() {
    if(state.historyLoading){$('historyContent').innerHTML=empty(t('loading'));return;}
    if(!state.history){$('historyContent').innerHTML=`<div class="empty-state">${icon('history')}<p>${t('historyHint')}</p><button id="loadHistory" class="button ghost" ${!state.weather?'disabled':''}>${t('loadHistory')}</button></div>`;return;}
    if(state.history.error){$('historyContent').innerHTML=empty(t('historyError'),'history');return;}
    const d=state.history.daily,high=d.temperature_2m_max || [],low=d.temperature_2m_min || [],rain=d.precipitation_sum || [];
    const values=high.map(v=>D.temperature(v,state.unit)),lowValues=low.map(v=>D.temperature(v,state.unit)),labels=d.time.map(epoch=>date(epoch));
    const missing=[high,low,rain].some(a=>a.length!==d.time.length || a.some(v=>!D.finite(v)));
    const mean=values=>{const numbers=values.filter(D.finite);return numbers.length?numbers.reduce((a,b)=>a+b,0)/numbers.length:null;};
    const hottest=D.summary(high,'max'),coldest=D.summary(low,'min'),maximumRain=D.summary(rain,'max');
    $('historyContent').innerHTML=`<div class="history-section-label">${t('tempHistory')}</div><div class="chart-legend"><span>${t('high',{value:''})}</span><span>${t('low',{value:''})}</span></div><div class="history-chart">${chartSVG(values,labels,'var(--blue)','history',v=>num(v),lowValues)}</div><div class="history-section-label">${t('rainHistory')}</div><div class="history-chart rain-history-chart">${rainHistoryChart(rain,labels)}</div><div class="history-stats"><div class="history-stat"><span>${t('warmest')}</span><strong>${temp(hottest)}</strong><small>${hottest===null?'—':date(d.time[high.indexOf(hottest)])}</small></div><div class="history-stat"><span>${t('coldest')}</span><strong>${temp(coldest)}</strong><small>${coldest===null?'—':date(d.time[low.indexOf(coldest)])}</small></div><div class="history-stat"><span>${t('rainSum')}</span><strong>${num(D.summary(rain,'sum'),1)} mm</strong></div><div class="history-stat"><span>${t('avgMax')}</span><strong>${temp(mean(high))}</strong></div><div class="history-stat"><span>${t('avgMin')}</span><strong>${temp(mean(low))}</strong></div><div class="history-stat"><span>${t('maxRain')}</span><strong>${num(maximumRain,1)} mm</strong><small>${maximumRain===null?'—':date(d.time[rain.indexOf(maximumRain)])}</small></div></div><div class="history-dates"><span>${date(d.time[0],{year:'numeric'})} — ${date(d.time.at(-1),{year:'numeric'})}</span><span>Open-Meteo · Reanalysis</span></div>${missing?`<p class="small muted">${t('incomplete')}</p>`:''}`;
    const container=$('historyContent').querySelector('.history-chart');
    const tooltip=document.createElement('div');tooltip.className='chart-tooltip';tooltip.hidden=true;container.style.position='relative';container.append(tooltip);
    container.querySelectorAll('[data-chart-index]').forEach(e=>{
      const show=()=>{const i=Number(e.dataset.chartIndex);tooltip.textContent=`${labels[i]} · ↑ ${temp(high[i])} · ↓ ${temp(low[i])} · ${num(rain[i],1)} mm`;tooltip.hidden=false;};
      e.addEventListener('pointerenter',show);e.addEventListener('pointerdown',show);e.addEventListener('pointerleave',()=>tooltip.hidden=true);
    });
    const rainContainer=$('historyContent').querySelector('.rain-history-chart');rainContainer.style.position='relative';const rainTooltip=document.createElement('div');rainTooltip.className='chart-tooltip';rainTooltip.hidden=true;rainContainer.append(rainTooltip);
    rainContainer.querySelectorAll('[data-rain-index]').forEach(element=>{const show=()=>{const i=Number(element.dataset.rainIndex);rainTooltip.textContent=`${labels[i]} · ${num(rain[i],1)} mm`;rainTooltip.hidden=false;};element.addEventListener('pointerenter',show);element.addEventListener('pointerdown',show);element.addEventListener('pointerleave',()=>rainTooltip.hidden=true);});
  }
  function rainHistoryChart(values,labels){
    if(!values.some(D.finite))return empty(t('noData'));
    const max=Math.max(1,D.summary(values,'max')),width=650/values.length;
    const bars=values.map((v,i)=>D.finite(v)?`<rect x="${35+i*width}" y="${120-v/max*100}" width="${Math.max(.5,width*.72)}" height="${v/max*100}" fill="var(--blue)" opacity=".65"/><rect data-rain-index="${i}" x="${35+i*width}" y="15" width="${width}" height="110" fill="transparent"/>`:'').join('');
    const step=Math.max(1,Math.ceil(values.length/6));
    return `<svg class="weather-chart" viewBox="0 0 700 145" preserveAspectRatio="none" role="img" aria-label="${esc(t('rainHistory'))}"><path d="M35 120H685M35 20H685" stroke="var(--line)" stroke-dasharray="3 5"/><text x="1" y="24" fill="var(--muted)" font-size="9">${num(max,1)}</text><text x="1" y="123" fill="var(--muted)" font-size="9">0</text>${bars}${labels.map((label,i)=>i%step===0?`<text x="${35+i*width}" y="142" fill="var(--muted)" font-size="9">${esc(label)}</text>`:'').join('')}</svg>`;
  }
  async function loadHistory() {
    if(!state.weather)return;
    const revision=++state.historyRevision,place={...state.place},period=Number($('historyPeriod').value),range=D.historicalRange(period,zone());
    state.historyLoading=true;renderHistory();
    try {
      const data=await fetchJSON(`https://archive-api.open-meteo.com/v1/archive?${new URLSearchParams({latitude:place.lat,longitude:place.lon,start_date:range.start,end_date:range.end,daily:'temperature_2m_max,temperature_2m_min,precipitation_sum',timezone:zone(),timeformat:'unixtime'})}`);
      if(revision!==state.historyRevision)return;
      if(!data.daily?.time?.length)throw new Error('No archive data');
      state.history={daily:data.daily,range};
    }catch {if(revision!==state.historyRevision)return;state.history={error:true};}
    state.historyLoading=false;renderHistory();
  }
  function initMap() {
    if(state.map)return;
    if(!window.L){$('weatherMap').innerHTML=empty(t('mapError'));return;}
    $('weatherMap').innerHTML='';
    state.map=L.map('weatherMap',{scrollWheelZoom:false,minZoom:2,maxZoom:12}).setView([state.place.lat,state.place.lon],6);
    const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(state.map);
    let errors=0;tiles.on('tileerror',()=>{if(++errors===1)toast(t('mapTilesError'));});
    state.marker=L.circleMarker([state.place.lat,state.place.lon],{radius:7,color:'#fff',weight:2,fillColor:'#466b87',fillOpacity:1}).addTo(state.map);
    updateMap();state.map.on('click',event=>loadPlace({name:t('mapPoint'),lat:event.latlng.lat,lon:((event.latlng.lng+180)%360+360)%360-180,kind:'map'}));
    new ResizeObserver(()=>state.map.invalidateSize()).observe($('weatherMap'));
  }
  function updateMap() {
    if(!state.map)return;
    state.map.setView([state.place.lat,state.place.lon],state.map.getZoom());state.marker.setLatLng([state.place.lat,state.place.lon]);
    const popup=document.createElement('div');popup.textContent=`${placeName(state.place)}${state.weather?` · ${temp(state.weather.current.temperature_2m)}${state.unit}`:''}`;
    state.marker.bindPopup(popup);
  }
  function stopRadar() {clearInterval(state.radarTimer);state.radarTimer=null;$('radarPlay').innerHTML=icon('play');}
  function updateRadarTime() {
    $('radarTimestamp').textContent=state.radarEnabled&&state.radarFrames.length?t('frameAt',{time:time(state.radarFrames[state.radarIndex].time)}):t('radarOff');
  }
  function showRadarFrame(index) {
    if(!state.map||!state.radarEnabled||!state.radarFrames.length)return;
    state.radarIndex=Math.max(0,Math.min(state.radarFrames.length-1,index));
    const frame=state.radarFrames[state.radarIndex];
    // RainViewer 2026: Universal Blue, past frames only, native zoom <= 7.
    const url=`${state.radarHost}${frame.path}/256/{z}/{x}/{y}/2/1_1.png`;
    if(state.radarLayer)state.radarLayer.setUrl(url);
    else {
      state.radarLayer=L.tileLayer(url,{opacity:.65,maxNativeZoom:7,maxZoom:12,attribution:'Radar: <a href="https://www.rainviewer.com/">RainViewer</a>'}).addTo(state.map);
      state.radarLayer.on('tileerror',()=>{$('radarNote').textContent=t('radarTilesError');stopRadar();});
    }
    $('radarSlider').value=state.radarIndex;updateRadarTime();
  }
  async function toggleRadar() {
    initMap();if(!state.map)return;
    if(state.radarEnabled){
      state.radarEnabled=false;stopRadar();if(state.radarLayer){state.map.removeLayer(state.radarLayer);state.radarLayer=null;}
      $('radarSlider').disabled=true;$('radarPlay').disabled=true;$('radarToggle').classList.remove('radar-on');$('radarToggle').setAttribute('aria-pressed','false');updateRadarTime();return;
    }
    $('radarToggle').disabled=true;
    try {
      if(Date.now()-state.radarLoaded>5*60*1000){
        const data=await fetchJSON('https://api.rainviewer.com/public/weather-maps.json');
        if(!data.radar?.past?.length || !/^https:\/\/[^/]+$/.test(data.host) || new URL(data.host).hostname!=='tilecache.rainviewer.com')throw new Error('No valid radar frames');
        state.radarFrames=data.radar.past.filter(f=>D.finite(f.time)&&/^\/v2\/radar\/[\w/.-]+$/.test(f.path));state.radarHost=data.host;state.radarLoaded=Date.now();
      }
      if(!state.radarFrames.length)throw new Error('No radar frames');
      state.radarEnabled=true;$('radarSlider').max=state.radarFrames.length-1;$('radarSlider').disabled=false;$('radarPlay').disabled=false;
      $('radarToggle').classList.add('radar-on');$('radarToggle').setAttribute('aria-pressed','true');$('radarNote').textContent=t('radarNote');
      showRadarFrame(state.radarFrames.length-1);
    } catch(error){console.warn('Radar request failed:',error.message);toast(t('radarError'));}
    finally{$('radarToggle').disabled=false;}
  }
  function renderSources() {
    const items=[
      ['Open-Meteo · Weather','sourceWeather','https://open-meteo.com/en/docs'],
      ['CAMS · Air quality','sourceAir','https://open-meteo.com/en/docs/air-quality-api'],
      ['Open-Meteo · Archive','sourceHistory','https://open-meteo.com/en/docs/historical-weather-api'],
      ['RainViewer · OpenStreetMap','sourceRadar','https://www.rainviewer.com/api/weather-maps-api.html'],
      ['Astronomy Engine · Astronomy','sourceAstronomy','https://github.com/cosinekitty/astronomy']
    ];
    const w=state.weather;
    $('sourceContent').innerHTML=`<p class="source-summary">${t('sourceIntro')}</p>${items.map(([title,key,url])=>`<div class="source-item"><h3><a href="${url}" target="_blank" rel="noopener">${title} ↗</a></h3><p>${t(key)}</p></div>`).join('')}<div class="source-item"><h3>${t('privacy')}</h3><p>${t('sourcePrivacy')}</p></div>${w?`<div class="source-meta">${t('forecastModel')}: ${modelName()}<br>${t('coordinates')}: <bdi>${state.place.lat.toFixed(4)}, ${state.place.lon.toFixed(4)}</bdi><br>${t('modelGrid')}: <bdi>${w.latitude}, ${w.longitude}</bdi><br>${t('elevation')}: <bdi>${num(w.elevation)} m</bdi><br>${t('dataAt',{time:date(w.current.time)+' '+time(w.current.time)})}<br>${t('retrievedAt',{time:time(state.retrieved/1000),zone:zone()})}</div>`:''}`;
  }
  function exportCSV() {
    if(!state.weather)return;
    const h=state.weather.hourly,fields=Object.keys(h).filter(k=>k!=='time');
    const rows=[['utc_timestamp','location_latitude','location_longitude',...fields.map(k=>`${k} [${state.weather.hourly_units?.[k] || ''}]`)],...h.time.map((epoch,i)=>[new Date(epoch*1000).toISOString(),state.place.lat,state.place.lon,...fields.map(k=>D.finite(h[k]?.[i])?h[k][i]:'')])];
    const content='\uFEFF'+rows.map(row=>row.map(value=>`"${String(value).replace(/"/g,'""')}"`).join(',')).join('\r\n');
    const blob=new Blob([content],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');
    link.href=url;link.download=`pimx-weather-${state.place.lat.toFixed(2)}-${state.place.lon.toFixed(2)}-${D.dateKey(state.weather.current.time,zone())}.csv`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast(t('exportReady'));
  }
  $('quickCities').addEventListener('click',event=>{const e=event.target.closest('[data-quick]');if(e)loadPlace(defaults[Number(e.dataset.quick)]);});
  $('refreshButton').addEventListener('click',()=>loadPlace(state.place,true));
  $('locationButton').addEventListener('click',()=>{
    if(!navigator.geolocation){toast(t('locationUnsupported'));return;}
    $('locationButton').disabled=true;
    navigator.geolocation.getCurrentPosition(position=>{
      $('locationButton').disabled=false;loadPlace({name:t('yourLocation'),lat:position.coords.latitude,lon:position.coords.longitude,kind:'gps'});
    },()=>{$('locationButton').disabled=false;toast(t('locationError'));},{enableHighAccuracy:true,timeout:15000,maximumAge:60000});
  });
  ['saveCityButton','addCityButton'].forEach(id=>$(id).addEventListener('click',saveCity));
  ['C','F'].forEach(unit=>$(`unit${unit}`).addEventListener('click',()=>{state.unit=unit;write('pimx.weather.unit',unit);renderAll();renderSaved();renderHistory();updateMap();}));
  $('languageButton').addEventListener('click',()=>{state.lang=state.lang==='fa'?'en':'fa';write('pimx.weather.lang',state.lang);closeSearch();++searchRevision;clearTimeout(searchTimer);searchController?.abort();applyLanguage();});
  $('themeButton').addEventListener('click',()=>{state.light=!state.light;write('pimx.weather.light',state.light);document.body.classList.toggle('light',state.light);$('themeButton').innerHTML=icon(state.light?'moon':'sun');});
  $('chartModes').addEventListener('click',event=>{const e=event.target.closest('[data-mode]');if(e){state.chartMode=e.dataset.mode;renderHourly();}});
  $('forecastDays').addEventListener('click',event=>{const e=event.target.closest('[data-days]');if(e){state.days=Number(e.dataset.days);renderForecast();}});
  $('forecastGrid').addEventListener('click',event=>{const e=event.target.closest('[data-day]');if(e)changeDay(Number(e.dataset.day));});
  $('prevDay').addEventListener('click',()=>changeDay(state.day-1));$('nextDay').addEventListener('click',()=>changeDay(state.day+1));
  $('datePicker').addEventListener('change',()=>{const index=state.weather?.daily.time.findIndex(epoch=>D.dateKey(epoch,zone())===$('datePicker').value);if(index>=0)changeDay(index);});
  $('solarSystemHour').addEventListener('input',()=>{stopTime();state.minutes=Number($('solarSystemHour').value);renderAll();});
  $('timePlay').addEventListener('click',playTime);
  $('resetToNow').addEventListener('click',()=>changeDay(0));
  $('modelSelect').addEventListener('change',()=>{state.model=$('modelSelect').value;write('pimx.weather.model',state.model);loadPlace(state.place,true);});
  $('solarSystemSection').addEventListener('click',event=>{const element=event.target.closest('[data-planet]');if(element){state.selectedPlanet=element.dataset.planet;renderSolar();}});
  $('zoomIn').addEventListener('click',()=>state.solarRenderer?.zoom(1.2));$('zoomOut').addEventListener('click',()=>state.solarRenderer?.zoom(1/1.2));$('zoomReset').addEventListener('click',()=>state.solarRenderer?.reset());
  $('solarMotion').addEventListener('click',()=>{state.cameraMotion=!state.cameraMotion;state.solarRenderer?.setMotion(state.cameraMotion);renderSolar();});
  $('historyContent').addEventListener('click',event=>{if(event.target.closest('#loadHistory,[data-action=history]'))loadHistory();});
  $('historyPeriod').addEventListener('change',loadHistory);
  $('radarToggle').addEventListener('click',toggleRadar);
  $('radarSlider').addEventListener('input',()=>{stopRadar();showRadarFrame(Number($('radarSlider').value));});
  $('radarPlay').addEventListener('click',()=>{
    if(state.radarTimer){stopRadar();return;}
    if(!state.radarEnabled)return;$('radarPlay').innerHTML=icon('pause');
    // Slow playback and browser tile caching keep requests below provider limits.
    state.radarTimer=setInterval(()=>showRadarFrame((state.radarIndex+1)%state.radarFrames.length),5000);
  });
  $('exportButton').addEventListener('click',exportCSV);
  ['sourceButton','dataInfoButton'].forEach(id=>$(id).addEventListener('click',()=>{renderSources();$('sourceDialog').showModal();}));
  $('closeDialog').addEventListener('click',()=>$('sourceDialog').close());
  $('sourceDialog').addEventListener('click',event=>{if(event.target===$('sourceDialog')){const rect=event.target.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)event.target.close();}});
  const links=[...document.querySelectorAll('.nav-link')];
  links.forEach(link=>{link.setAttribute('aria-label',t(link.querySelector('[data-t]').dataset.t));link.addEventListener('click',()=>links.forEach(e=>e.classList.toggle('active',e===link)));});
  const navObserver=new IntersectionObserver(entries=>{
    const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(visible)links.forEach(link=>{const active=link.getAttribute('href')===`#${visible.target.id}`;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
  },{rootMargin:'-85px 0px -50% 0px',threshold:[0,.2,.5]});
  links.forEach(link=>{const section=document.querySelector(link.getAttribute('href'));if(section)navObserver.observe(section);});
  const mapObserver=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){initMap();mapObserver.disconnect();}},{rootMargin:'200px'});mapObserver.observe($('weatherMap'));
  const solarObserver=new IntersectionObserver(entries=>{state.solarVisible=entries[0].isIntersecting;if(state.solarVisible)initSolarRenderer();state.solarRenderer?.setVisible(state.solarVisible);},{rootMargin:'150px'});solarObserver.observe($('solarSystem'));
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
    const reveal=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.animate([{opacity:0,transform:'perspective(900px) translateY(22px) rotateX(3deg)'},{opacity:1,transform:'perspective(900px) translateY(0) rotateX(0)'}],{duration:700,easing:'cubic-bezier(.2,.75,.25,1)'});reveal.unobserve(entry.target);}});},{threshold:.08});
    document.querySelectorAll('.panel').forEach(panel=>reveal.observe(panel));
    if(matchMedia('(pointer: fine)').matches){$('overview').addEventListener('pointermove',event=>{const box=$('overview').getBoundingClientRect();$('overview').style.setProperty('--tiltX',`${(event.clientY-box.top-box.height/2)/box.height*-4}deg`);$('overview').style.setProperty('--tiltY',`${(event.clientX-box.left-box.width/2)/box.width*4}deg`);});$('overview').addEventListener('pointerleave',()=>{$('overview').style.setProperty('--tiltX','0deg');$('overview').style.setProperty('--tiltY','0deg');});}
  }
  let lastRefreshCheck=Date.now();
  setInterval(()=>{
    updateClock();renderStatus();
    if(state.weather){renderDateControls();renderSun();renderAstronomy();renderSolar();if(view()?.live){renderHero();renderHourly();renderMetrics();renderAir();}}
    if(!document.hidden&&$('autoRefresh').checked&&!state.loading&&Date.now()-lastRefreshCheck>=15*60*1000){lastRefreshCheck=Date.now();loadPlace(state.place,true);}
  },60000);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stopRadar();stopTime();}else if($('autoRefresh').checked&&!state.loading&&state.retrieved&&Date.now()-state.retrieved>=15*60*1000){lastRefreshCheck=Date.now();loadPlace(state.place,true);}});
  document.querySelectorAll('[data-icon]').forEach(e=>e.innerHTML=icon(e.dataset.icon));
  document.body.classList.toggle('light',state.light);$('themeButton').innerHTML=icon(state.light?'moon':'sun');
  dateModelControls=WeatherControls.create({t,icon});
  applyLanguage();loadPlace(state.place);loadSavedWeather();
})();
