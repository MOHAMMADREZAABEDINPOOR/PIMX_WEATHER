const test=require('node:test');
const assert=require('node:assert/strict');
const D=require('../weather-data.js');
const Sky=require('../astronomy-data.js');
const epoch=iso=>Date.parse(iso)/1000;

test('a selected future day uses its local noon and its hourly data instead of today',()=>{
 const day0=epoch('2026-10-08T20:30:00Z'),day1=epoch('2026-10-09T20:30:00Z');
 const weather={timezone:'Asia/Tehran',daily:{time:[day0,day1]},hourly:{time:Array.from({length:48},(_,i)=>day0+i*3600)},current:{time:day0+8*3600}};
 const today=D.viewContext(weather,0,null,day0+8*3600);assert.equal(today.live,true);assert.equal(today.hour,8);
 const selected=D.viewContext(weather,1,null,day0+8*3600);assert.equal(selected.live,false);assert.equal(selected.epoch,epoch('2026-10-10T08:30:00Z'));assert.equal(selected.hour,36);
 const manual=D.viewContext(weather,1,18*60,day0+8*3600);assert.equal(manual.epoch,epoch('2026-10-10T14:30:00Z'));assert.equal(manual.hour,42);
});
test('New York DST days contain 23 or 25 real hours; repeated times resolve consistently',()=>{
 const spring=D.dayBounds(epoch('2026-03-08T12:00:00Z'),'America/New_York');assert.equal(spring.end-spring.start,23*3600);
 const fall=D.dayBounds(epoch('2026-11-01T12:00:00Z'),'America/New_York');assert.equal(fall.end-fall.start,25*3600);
 assert.equal(D.localEpoch('2026-03-08',150,'America/New_York'),null);
 assert.equal(D.localEpoch('2026-11-01',90,'America/New_York'),epoch('2026-11-01T05:30:00Z'));
 const hours=Array.from({length:25},(_,i)=>fall.start+i*3600);assert.equal(D.dayIndices(hours,fall.start,'America/New_York').length,25);
});
test('switching dates across UTC midnight selects the city date and its moon phase',()=>{
 const first=D.dayBounds(epoch('2026-10-09T08:30:00Z'),'Asia/Tehran'),second=D.dayBounds(epoch('2026-10-10T08:30:00Z'),'Asia/Tehran');
 const one=Sky.snapshot(epoch('2026-10-09T08:30:00Z'),first.start,first.end,35.6892,51.389);
 const two=Sky.snapshot(epoch('2026-10-10T08:30:00Z'),second.start,second.end,35.6892,51.389);
 assert.notEqual(one.moon.illumination,two.moon.illumination);assert.ok(two.moon.age>one.moon.age);
 assert.notEqual(one.planets[0].x,two.planets[0].x);
 assert.equal(one.planets.length,8);assert.equal(two.epoch,epoch('2026-10-10T08:30:00Z'));
 assert.ok(one.sun.noon>=first.start&&one.sun.noon<first.end);
 assert.ok(one.moon.rise===null||(one.moon.rise>=first.start&&one.moon.rise<first.end));
 assert.ok(one.moon.duration>=0&&one.moon.duration<=first.end-first.start);
 for(const p of one.planets)assert.ok(Math.abs(p.distance-Math.hypot(p.x,p.y,p.z))<1e-12);
});
test('hour selection changes local sun and moon positions and preserves negative altitudes',()=>{
 const bounds=D.dayBounds(epoch('2026-10-09T08:30:00Z'),'Asia/Tehran');
 const noon=Sky.snapshot(epoch('2026-10-09T08:30:00Z'),bounds.start,bounds.end,35.6892,51.389);
 const night=Sky.snapshot(epoch('2026-10-09T20:00:00Z'),bounds.start,bounds.end,35.6892,51.389);
 assert.ok(noon.sun.altitude>40);assert.ok(night.sun.altitude<0);assert.notEqual(noon.moon.altitude,night.moon.altitude);
 assert.ok(noon.moon.distance>350000&&noon.moon.distance<410000);
});
test('polar days do not invent sunrise or sunset events',()=>{
 const bounds=D.dayBounds(epoch('2026-06-21T12:00:00Z'),'Arctic/Longyearbyen');
 const sky=Sky.snapshot(epoch('2026-06-21T12:00:00Z'),bounds.start,bounds.end,78.2232,15.6469);
 assert.equal(sky.sun.rise,null);assert.equal(sky.sun.set,null);assert.equal(sky.sun.duration,bounds.end-bounds.start);
});
test('model selection restores the named models and honours the shorter ICON horizon',()=>{
 const place={lat:35.6892,lon:51.389};
 for(const model of ['ecmwf_ifs04','gfs_global','icon_global']){
  const u=new URL(D.forecastURL(place,model));assert.equal(u.searchParams.get('models'),model);assert.equal(u.searchParams.get('forecast_days'),model==='icon_global'?'7':'14');
 }
});
