const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const D=require('../weather-data.js');
const base=D.localEpoch('2026-10-20',0,'Asia/Tehran');
const hours=Array.from({length:336},(_,i)=>base+i*3600);
const days=Array.from({length:14},(_,i)=>base+i*86400);
const raw={timezone:'Asia/Tehran',latitude:35.6892,longitude:51.389,elevation:1200,current:{time:base+43200,temperature_2m:24,weather_code:0,is_day:1},hourly:{time:hours,temperature_2m:hours.map((_,i)=>20+i%24),weather_code:hours.map(()=>0),is_day:hours.map(()=>1)},daily:{time:days,weather_code:days.map(()=>0),temperature_2m_max:days.map(()=>31),temperature_2m_min:days.map(()=>15)}};
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.platform==='win32'?{channel:'chrome'}:{})});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],requests=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>localStorage.setItem('pimx.weather.lang','"en"'));
  await page.route('https://api.open-meteo.com/**',route=>{const url=new URL(route.request().url());requests.push(url);const count=Number(url.searchParams.get('forecast_days'));return route.fulfill({json:{...raw,daily:Object.fromEntries(Object.entries(raw.daily).map(([key,values])=>[key,values.slice(0,count)])),hourly:Object.fromEntries(Object.entries(raw.hourly).map(([key,values])=>[key,values.slice(0,count*24)]))}});});
  await page.route('https://air-quality-api.open-meteo.com/**',route=>route.abort());
  await page.goto(process.env.WEATHER_TEST_URL||'http://127.0.0.1:8000',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!document.querySelector('#calendarTrigger').disabled);
  assert.equal(await page.locator('#datePicker').isVisible(),false);assert.equal(await page.locator('#modelSelect').isVisible(),false);
  await page.locator('#modelTrigger').click();assert.equal(await page.locator('#modelPanel [role=option]').count(),4);
  assert.equal(await page.locator('#modelPanel [aria-selected=true]').getAttribute('data-value'),'best_match');
  await page.keyboard.press('ArrowDown');await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');
  await page.waitForFunction(()=>document.querySelector('#overview').getAttribute('aria-busy')==='false');
  assert.equal(requests.at(-1).searchParams.get('models'),'gfs_global');assert.match(await page.locator('#modelTrigger').innerText(),/GFS/);
  assert.equal(await page.locator('#modelPanel').isVisible(),false);assert.equal(await page.locator('#modelTrigger').evaluate(e=>e===document.activeElement),true);
  console.log('PASS model selection by keyboard updates the actual forecast request and retains focus');
  await page.locator('#calendarTrigger').click();assert.match(await page.locator('.calendar-heading>strong').innerText(),/October 2026/);
  assert.equal(await page.locator('[data-date="2026-10-19"]').isDisabled(),true);
  await page.keyboard.press('ArrowRight');assert.equal(await page.locator('[data-date="2026-10-21"]').evaluate(e=>e===document.activeElement),true);
  await page.keyboard.press('Enter');assert.equal(await page.locator('#datePicker').inputValue(),'2026-10-21');
  assert.equal(await page.locator('#calendarPanel').isVisible(),false);assert.equal(await page.locator('.forecast-day.active').getAttribute('data-day'),'1');
  await page.locator('#calendarTrigger').click();await page.locator('[data-month="1"]').click();
  assert.match(await page.locator('.calendar-heading>strong').innerText(),/November 2026/);
  assert.equal(await page.locator('[data-date="2026-11-03"]').isDisabled(),true);
  await page.locator('[data-date="2026-11-02"]').click();assert.equal(await page.locator('#datePicker').inputValue(),'2026-11-02');
  assert.equal(await page.locator('.forecast-day.active').getAttribute('data-day'),'13');
  console.log('PASS Gregorian calendar, keyboard dates, month navigation and forecast range constraints');
  await page.locator('#languageButton').click();await page.locator('#calendarTrigger').click();
  assert.match(await page.locator('.calendar-heading>strong').innerText(),/آبان/);
  assert.match(await page.locator('[data-date="2026-11-02"]').innerText(),/۱۱/);
  await page.locator('[data-month="-1"]').click();assert.match(await page.locator('.calendar-heading>strong').innerText(),/مهر/);
  await page.locator('[data-date="2026-10-20"]').click();assert.equal(await page.locator('#datePicker').inputValue(),'2026-10-20');
  await page.locator('#calendarTrigger').click();await page.keyboard.press('ArrowLeft');await page.keyboard.press('Enter');
  assert.equal(await page.locator('#datePicker').inputValue(),'2026-10-21');
  console.log('PASS Persian month boundaries and numerals preserve the exact Gregorian API date; RTL keyboard works');
  fs.mkdirSync(path.join(__dirname,'../artifacts'),{recursive:true});
  for(const lang of ['fa','en']){
   if(await page.locator('html').getAttribute('lang')!==lang)await page.locator('#languageButton').click();
   for(const light of [false,true]){
    if(await page.locator('body').evaluate(e=>e.classList.contains('light'))!==light)await page.locator('#themeButton').click();
    for(const width of [1440,390,360]){
     await page.setViewportSize({width,height:900});
     for(const control of ['calendar','model']){
      await page.locator(`#${control}Trigger`).click();
      const bounds=await page.locator(`#${control}Panel`).boundingBox();
      assert.ok(bounds.x>=11&&bounds.x+bounds.width<=width-11);assert.ok(bounds.y>=11&&bounds.y+bounds.height<=889);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
      if(width===1440||width===390)await page.locator(`#${control}Panel`).screenshot({path:path.join(__dirname,`../artifacts/${control}-${lang}-${light?'light':'dark'}-${width}.png`)});
      await page.keyboard.press('Escape');assert.equal(await page.locator(`#${control}Trigger`).evaluate(e=>e===document.activeElement),true);
     }
    }
   }
  }
  await page.locator('#calendarTrigger').click();await page.locator('#themeButton').click();assert.equal(await page.locator('#calendarPanel').isVisible(),false);
  await page.locator('#modelTrigger').click();await page.locator('#modelPanel [data-value="icon_global"]').click();
  await page.waitForFunction(()=>document.querySelector('#overview').getAttribute('aria-busy')==='false');
  assert.equal(requests.at(-1).searchParams.get('forecast_days'),'7');assert.equal(await page.locator('#datePicker').getAttribute('max'),'2026-10-26');
  await page.locator('#calendarTrigger').click();assert.equal(await page.locator('[data-date="2026-10-27"]').isDisabled(),true);await page.keyboard.press('Escape');
  console.log('PASS switching to ICON updates the calendar to the actual seven-day forecast range');
  assert.deepEqual(errors,[]);
  console.log('PASS both pickers fit desktop and mobile, dark/light themes and both languages; Escape and outside clicks close panels');
  console.log('ALL PICKER CHECKS PASSED');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
