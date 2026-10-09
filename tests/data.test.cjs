const test=require('node:test');
const assert=require('node:assert/strict');
const D=require('../weather-data.js');

test('missing values stay missing, including Fahrenheit conversions and aggregates',()=>{
 for(const value of [null,undefined,NaN,Infinity,'12']) {assert.equal(D.finite(value),false);assert.equal(D.temperature(value,'F'),null);}
 assert.equal(D.temperature(0,'F'),32);assert.equal(D.temperature(-40,'F'),-40);
 assert.equal(D.summary([null,undefined],'sum'),null);
 assert.equal(D.summary([null,0,2.5],'sum'),2.5);
 assert.equal(D.summary([-8,null,0],'min'),-8);
});
test('date keys use the selected city rather than the browser time zone',()=>{
 const epoch=Date.parse('2026-10-08T21:00:00Z')/1000;
 assert.equal(D.dateKey(epoch,'Asia/Tehran'),'2026-10-09');
 assert.equal(D.dateKey(epoch,'America/New_York'),'2026-10-08');
 assert.equal(D.dateKey(epoch,'Pacific/Auckland'),'2026-10-09');
});
test('hourly lookup finds the correct current interval and rejects expired data',()=>{
 const hours=[10000,13600,17200];
 assert.equal(D.hourIndex(hours,9999),-1);assert.equal(D.hourIndex(hours,10000),0);
 assert.equal(D.hourIndex(hours,13599),0);assert.equal(D.hourIndex(hours,13600),1);
 assert.equal(D.hourIndex(hours,20799),2);assert.equal(D.hourIndex(hours,20800),-1);
 assert.equal(D.hourIndex([],10000),-1);
});
test('historical intervals are inclusive and end seven local calendar days ago',()=>{
 const epoch=Date.parse('2026-01-01T22:00:00Z')/1000;
 assert.deepEqual(D.historicalRange(30,'Asia/Tehran',epoch),{start:'2025-11-27',end:'2025-12-26'});
 assert.deepEqual(D.historicalRange(1,'America/New_York',epoch),{start:'2025-12-25',end:'2025-12-25'});
 const leap=Date.parse('2024-03-07T12:00:00Z')/1000;
 assert.deepEqual(D.historicalRange(2,'UTC',leap),{start:'2024-02-28',end:'2024-02-29'});
});
test('US AQI categories respect all boundary values and never classify missing data as good',()=>{
 assert.deepEqual([0,50,51,100,101,150,151,200,201,300,301,500].map(D.aqiCategory),[0,0,1,1,2,2,3,3,4,4,5,5]);
 assert.equal(D.aqiCategory(null),-1);assert.equal(D.aqiCategory(-1),-1);
});
test('coordinates restored from storage must be real numeric coordinates',()=>{
 assert.equal(D.validPlace({name:'Tehran',lat:35.6,lon:51.3}),true);
 for(const place of [null,{}, {name:'X',lat:91,lon:0},{name:'X',lat:0,lon:181},{name:'X',lat:'35',lon:0}])assert.equal(D.validPlace(place),false);
});
test('forecast request uses epoch times and explicit units without requesting invented observations',()=>{
 const url=new URL(D.forecastURL({name:'Tehran',lat:35.6892,lon:51.389}));
 assert.equal(url.searchParams.get('forecast_days'),'14');assert.equal(url.searchParams.get('timeformat'),'unixtime');
 assert.equal(url.searchParams.get('timezone'),'auto');assert.equal(url.searchParams.get('wind_speed_unit'),'kmh');
 assert.ok(url.searchParams.get('current').includes('pressure_msl'));assert.ok(url.searchParams.get('hourly').includes('uv_index'));
});
