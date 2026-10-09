const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const D=require('../weather-data.js');
const zone='Asia/Tehran',base=D.localEpoch(D.dateKey(Date.now()/1000,zone),0,zone);
const times=Array.from({length:336},(_,i)=>base+i*3600),days=Array.from({length:14},(_,i)=>base+i*86400);
const values={temperature_2m:44,relative_humidity_2m:100,apparent_temperature:48,is_day:1,precipitation:12,weather_code:45,wind_speed_10m:48,wind_direction_10m:315,wind_gusts_10m:68,pressure_msl:1018,surface_pressure:883,cloud_cover:100,visibility:50000,dew_point_2m:28,precipitation_probability:100,uv_index:11};
const raw={timezone:zone,latitude:35.6892,longitude:51.389,elevation:1200,current:{time:Math.floor(Date.now()/1000),...values},hourly:{time:times,...Object.fromEntries(Object.entries(values).map(([key,value])=>[key,times.map(()=>value)]))},daily:{time:days,...Object.fromEntries(Object.entries({temperature_2m_max:44,temperature_2m_min:-12,weather_code:45,precipitation_sum:25,precipitation_probability_max:100,wind_speed_10m_max:48,uv_index_max:11}).map(([key,value])=>[key,days.map(()=>value)])),sunrise:days.map(day=>day+6*3600),sunset:days.map(day=>day+18*3600)}};
const air={timezone:zone,current:{time:raw.current.time,us_aqi:151,pm2_5:62,pm10:83,nitrogen_dioxide:28,ozone:43},hourly:{time:times,...Object.fromEntries(Object.entries({us_aqi:151,pm2_5:62,pm10:83,nitrogen_dioxide:28,ozone:43}).map(([key,value])=>[key,times.map(()=>value)]))}};
const widths=[300,320,360,390,430,540,640,760,761,820,900,1000,1001,1100,1200,1250,1440,1920,2560,3840];
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader'],...(process.platform==='win32'?{channel:'chrome'}:{})});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>{
   localStorage.setItem('pimx.weather.unit','"F"');
   localStorage.setItem('pimx.weather.place',JSON.stringify({name:'San Fernando del Valle de Catamarca',fa:'سان فرناندو دل بایه د کاتامارکا',country:'Argentina',countryFa:'آرژانتین',lat:-28.4696,lon:-65.7852,timezone:'America/Argentina/Catamarca'}));
   localStorage.setItem('pimx.weather.cities',JSON.stringify([{name:'San Fernando del Valle de Catamarca',country:'Argentina',lat:-28.4696,lon:-65.7852,timezone:'America/Argentina/Catamarca'}]));
  });
  await page.route('https://**/*',route=>route.abort());
  await page.route('https://api.open-meteo.com/**',route=>route.fulfill({json:raw}));
  await page.route('https://air-quality-api.open-meteo.com/**',route=>route.fulfill({json:air}));
  await page.route('https://archive-api.open-meteo.com/**',route=>{
   const url=new URL(route.request().url()),start=Date.parse(url.searchParams.get('start_date')+'T00:00:00Z')/1000,end=Date.parse(url.searchParams.get('end_date')+'T00:00:00Z')/1000;
   const time=Array.from({length:Math.round((end-start)/86400)+1},(_,i)=>start+i*86400);
   return route.fulfill({json:{timezone:zone,daily:{time,precipitation_sum:time.map(()=>12.3),temperature_2m_max:time.map(()=>44),temperature_2m_min:time.map(()=>-12)}}});
  });
  await page.goto(process.env.WEATHER_TEST_URL||'http://127.0.0.1:8000',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('#overview').getAttribute('aria-busy')==='false');await page.evaluate(()=>document.fonts.ready);
  await page.locator('[data-days="14"]').click();await page.locator('#loadHistory').click();await page.waitForSelector('.history-stats');
  await page.locator('#solarSystem').scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.querySelector('#solarCanvas').dataset.renderer);
  await page.locator('.planet-table-details').evaluate(el=>el.open=true);
  await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important}'});
  const audit=[];
  for(const lang of ['fa','en']){
   if(await page.locator('html').getAttribute('lang')!==lang)await page.locator('#languageButton').click();
   for(const width of widths){
    await page.setViewportSize({width,height:900});await page.evaluate(()=>scrollTo(0,0));
    const failures=await page.evaluate(()=>{
     const result=[];
     if(document.documentElement.scrollWidth>innerWidth+1)result.push(`page: ${document.documentElement.scrollWidth} > ${innerWidth}`);
     const selector='.topbar,.heading-controls,.quick-cities,#localClock,#placeName,#selectedDate,.day-navigation,.selected-time-controls,.forecast-model,.panel-heading,.section-heading,.day-temperatures,.day-rain,.day-detail,.forecast-note,.metric-top,.metric-value,.metric-note,.celestial-detail,.celestial-status,.planet-choice,.planet-info-grid > div,.history-stat,.map-controls,.hero-top,.hero-bottom,.daylight-bottom,.sun-times,.moon-display,.astro-row,.data-strip-actions,.footer';
     for(const el of document.querySelectorAll(selector)){
      if(!el.getClientRects().length)continue;
      if(el.scrollWidth>el.clientWidth+2)result.push(`${el.id||el.className}: ${el.scrollWidth} > ${el.clientWidth}`);
     }
     return result;
    });
    if(failures.length)audit.push({lang,width,failures});
    if(!process.env.RESPONSIVE_AUDIT)assert.deepEqual(failures,[],`${lang} ${width}px`);
    if([300,390,820,1440,2560].includes(width)&&!process.env.RESPONSIVE_AUDIT){
     fs.mkdirSync(path.join(__dirname,'../artifacts'),{recursive:true});
     await page.locator('#forecast').screenshot({path:path.join(__dirname,`../artifacts/forecast-${lang}-${width}.png`),style:'.sidebar,.topbar,.skip-link{visibility:hidden!important}'});
     if(width===300||width===1440){await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(__dirname,`../artifacts/responsive-${lang}-${width}.png`),fullPage:true,style:'.skip-link{visibility:hidden!important}'});}
    }
   }
  }
  if(process.env.RESPONSIVE_AUDIT){console.log(JSON.stringify(audit,null,2));return;}
  await page.setViewportSize({width:300,height:700});
  assert.equal(await page.locator('#forecastGrid').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),2);
  for(const selector of ['#conditions','#air','#astronomy','#solarSystemSection'])await page.locator(selector).screenshot({path:path.join(__dirname,`../artifacts/${selector.slice(1)}-300.png`),style:'.sidebar,.topbar,.skip-link{visibility:hidden!important}'});
  await page.locator('#themeButton').click();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  for(const id of ['calendar','model']){
   await page.locator(`#${id}Trigger`).click();const box=await page.locator(`#${id}Panel`).boundingBox();assert.ok(box.x>=11&&box.x+box.width<=289);await page.keyboard.press('Escape');
  }
  await page.locator('[data-day="3"]').click();assert.equal(await page.locator('.forecast-day.active').getAttribute('data-day'),'3');
  const rainIcon=await page.locator('.forecast-day .day-rain .icon').first().boundingBox();assert.ok(rainIcon.width<=16&&rainIcon.height<=16);
  await page.locator('#dataInfoButton').click();assert.equal(await page.locator('#sourceDialog').isVisible(),true);
  assert.equal(await page.locator('#sourceDialog').evaluate(e=>e.scrollWidth<=e.clientWidth+1),true);await page.keyboard.press('Escape');
  for(const height of [400,600]){
   await page.setViewportSize({width:900,height});await page.evaluate(()=>scrollTo(0,0));
   assert.equal(await page.locator('.sidebar').evaluate(el=>el.scrollHeight>el.clientHeight?getComputedStyle(el).overflowY==='auto':true),true);
   const top=await page.locator('.topbar').boundingBox();assert.ok(top.height<height/3);
  }
  assert.deepEqual(errors,[]);console.log(`PASS full dashboard at ${widths.length} widths from 300 to 3840 px in both languages, including populated air/history/cities and expanded planetary table`);
  console.log('PASS 300 px calendar, model list, forecast selection, rain icons, source dialog and short landscape navigation');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
