/* Pure data helpers shared by the dashboard and regression tests. */
(function (root) {
  'use strict';
  const finite = value => typeof value === 'number' && Number.isFinite(value);
  function validPlace(place) {
    return !!place && finite(place.lat) && finite(place.lon) && Math.abs(place.lat) <= 90 && Math.abs(place.lon) <= 180 && typeof place.name === 'string';
  }
  function hourIndex(times, now = Date.now() / 1000) {
    if (!Array.isArray(times) || !times.length || now < times[0] || now >= times.at(-1) + 3600) return -1;
    for (let i = times.length - 1; i >= 0; i--) if (times[i] <= now) return i;
    return -1;
  }
  function dateKey(epoch, timezone) {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(epoch * 1000));
    const get = type => parts.find(p => p.type === type).value;
    return `${get('year')}-${get('month')}-${get('day')}`;
  }
  function nextDate(key) {
    const day=new Date(`${key}T12:00:00Z`);day.setUTCDate(day.getUTCDate()+1);return day.toISOString().slice(0,10);
  }
  function localEpoch(key, minutes, timezone) {
    const target=Date.parse(`${key}T00:00:00Z`)/1000+minutes*60;
    let guess=target;
    const formatter=new Intl.DateTimeFormat('en-US',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
    const wall=epoch=>{
      const parts=formatter.formatToParts(new Date(epoch*1000)),get=type=>parts.find(p=>p.type===type).value;
      return Date.parse(`${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}Z`)/1000;
    };
    for(let i=0;i<5;i++){const difference=target-wall(guess);if(!difference)break;guess+=difference;}
    if(wall(guess)!==target)return null; // A civil time skipped by daylight saving does not exist.
    // Resolve repeated fall-back times consistently to their first occurrence.
    if(wall(guess-3600)===target)guess-=3600;
    return guess;
  }
  function dayBounds(epoch, timezone) {
    const key=dateKey(epoch,timezone);
    return {key,start:localEpoch(key,0,timezone),end:localEpoch(nextDate(key),0,timezone)};
  }
  function dayIndices(times, epoch, timezone) {
    const bounds=dayBounds(epoch,timezone);
    return (times || []).map((_,i)=>i).filter(i=>times[i]>=bounds.start&&times[i]<bounds.end);
  }
  function viewContext(weather,day,minutes,now=Date.now()/1000){
    const stamp=weather?.daily?.time?.[day];
    if(!finite(stamp))return null;
    const bounds=dayBounds(stamp,weather.timezone),isToday=bounds.key===dateKey(now,weather.timezone);
    const live=isToday&&minutes===null;
    const epoch=live?now:minutes===null?localEpoch(bounds.key,720,weather.timezone):Math.min(bounds.end-1,bounds.start+Math.max(0,minutes)*60);
    return {...bounds,epoch,live,isToday,hour:hourIndex(weather.hourly?.time,epoch)};
  }
  function historicalRange(days, timezone, now = Date.now() / 1000) {
    const localDate = dateKey(now, timezone);
    const end = new Date(`${localDate}T12:00:00Z`);
    end.setUTCDate(end.getUTCDate() - 7);
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - (days - 1));
    return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };
  }
  function temperature(value, unit) { return finite(value) ? (unit === 'F' ? value * 9 / 5 + 32 : value) : null; }
  function aqiCategory(value) { return !finite(value) || value < 0 ? -1 : value <= 50 ? 0 : value <= 100 ? 1 : value <= 150 ? 2 : value <= 200 ? 3 : value <= 300 ? 4 : 5; }
  function summary(values, operation) {
    const numbers = (values || []).filter(finite);
    if (!numbers.length) return null;
    return operation === 'sum' ? numbers.reduce((a, b) => a + b, 0) : operation === 'min' ? Math.min(...numbers) : Math.max(...numbers);
  }
  function forecastURL(place, model='best_match') {
    const params = new URLSearchParams({
      latitude: place.lat, longitude: place.lon, timezone: 'auto', timeformat: 'unixtime', forecast_days: '14',
      temperature_unit: 'celsius', wind_speed_unit: 'kmh', precipitation_unit: 'mm',
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
      hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,dew_point_2m,is_day,surface_pressure,pressure_msl,cloud_cover',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,daylight_duration,precipitation_sum,precipitation_probability_max,uv_index_max,wind_speed_10m_max'
    });
    const models={ecmwf_ifs04:14,gfs_global:14,icon_global:7};
    if(Object.hasOwn(models,model)){params.set('models',model);params.set('forecast_days',String(models[model]));}
    return `https://api.open-meteo.com/v1/forecast?${params}`;
  }
  const api = { finite, validPlace, hourIndex, dateKey, nextDate, localEpoch, dayBounds, dayIndices, viewContext, historicalRange, temperature, aqiCategory, summary, forecastURL };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.WeatherData = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
