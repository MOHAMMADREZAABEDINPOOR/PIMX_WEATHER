/* Astronomy Engine calculations. Civil day boundaries are supplied in UTC epochs. */
(function(root){
  'use strict';
  const A=typeof module!=='undefined'&&module.exports?require('astronomy-engine'):root.Astronomy;
  const AU_KM=149597870.7;
  const planets=[
    {key:'Mercury',name:'mercury',au:.387,radius:1.2,orbit:13,color:'#a59b86',period:87.969},
    {key:'Venus',name:'venus',au:.723,radius:1.8,orbit:21,color:'#e7c78a',period:224.701},
    {key:'Earth',name:'earth',au:1,radius:2,orbit:30,color:'#5caae9',period:365.256},
    {key:'Mars',name:'mars',au:1.524,radius:1.5,orbit:40,color:'#d88662',period:686.980},
    {key:'Jupiter',name:'jupiter',au:5.203,radius:4.4,orbit:59,color:'#d9b28b',period:4332.589},
    {key:'Saturn',name:'saturn',au:9.537,radius:3.7,orbit:79,color:'#e9d5a4',period:10759.22},
    {key:'Uranus',name:'uranus',au:19.191,radius:2.8,orbit:99,color:'#80dae0',period:30685.4},
    {key:'Neptune',name:'neptune',au:30.069,radius:2.7,orbit:119,color:'#547deb',period:60189}
  ];
  const date=epoch=>new Date(epoch*1000);
  function horizontal(body,epoch,observer){
    const eq=A.Equator(body,date(epoch),observer,true,true);
    return A.Horizon(date(epoch),observer,eq.ra,eq.dec,'normal');
  }
  function eventEpoch(event){return event?event.date.getTime()/1000:null;}
  const dayCache=new Map();
  function events(body,start,end,observer){
    const limit=(end-start)/86400;
    const rise=eventEpoch(A.SearchRiseSet(body,observer,1,date(start),limit));
    const set=eventEpoch(A.SearchRiseSet(body,observer,-1,date(start),limit));
    const within=value=>value!==null&&value>=start&&value<end?value:null;
    const transitions=[{at:within(rise),above:true},{at:within(set),above:false}].filter(e=>e.at!==null).sort((a,b)=>a.at-b.at);
    let above=horizontal(body,start+1,observer).altitude>0,position=start,duration=0;
    for(const event of transitions){if(above)duration+=event.at-position;above=event.above;position=event.at;}
    if(above)duration+=end-position;
    const transit=A.SearchHourAngle(body,observer,0,date(start));
    const noon=eventEpoch(transit.time);
    const samples=Array.from({length:49},(_,i)=>{const at=start+(end-start)*i/48;return {at,altitude:horizontal(body,at,observer).altitude};});
    return {rise:within(rise),set:within(set),duration,noon:within(noon),maxAltitude:noon<end?transit.hor.altitude:Math.max(...samples.map(s=>s.altitude)),samples};
  }
  function dayEvents(start,end,lat,lon){
    const key=`${start}/${end}/${lat}/${lon}`;
    if(dayCache.has(key))return dayCache.get(key);
    const observer=new A.Observer(lat,lon,0);
    const result={sun:events('Sun',start,end,observer),moon:events('Moon',start,end,observer)};
    if(dayCache.size>50)dayCache.clear();dayCache.set(key,result);return result;
  }
  function positions(epoch){
    const when=date(epoch);
    return planets.map(p=>{
      const vector=A.Ecliptic(A.HelioVector(p.key,when)).vec;
      return {...p,x:vector.x,y:vector.y,z:vector.z,distance:Math.hypot(vector.x,vector.y,vector.z)};
    });
  }
  function snapshot(epoch,start,end,lat,lon){
    const when=date(epoch),observer=new A.Observer(lat,lon,0),daily=dayEvents(start,end,lat,lon);
    const moonLight=A.Illumination('Moon',when),phase=A.MoonPhase(when)/360;
    const newMoon=eventEpoch(A.SearchMoonPhase(0,when,-40));
    const geoMoon=A.Ecliptic(A.GeoVector('Moon',when,true)).vec;
    const bodies=positions(epoch).map(p=>({...p,horizon:p.key==='Earth'?null:horizontal(p.key,epoch,observer)}));
    return {
      epoch,start,end,
      sun:{...daily.sun,...horizontal('Sun',epoch,observer),distance:A.GeoVector('Sun',when,true).Length()*AU_KM},
      moon:{...daily.moon,...horizontal('Moon',epoch,observer),phase,illumination:moonLight.phase_fraction,age:newMoon===null?null:(epoch-newMoon)/86400,distance:moonLight.geo_dist*AU_KM,vector:{x:geoMoon.x,y:geoMoon.y,z:geoMoon.z}},
      planets:bodies
    };
  }
  const api={AU_KM,planets,horizontal,positions,dayEvents,snapshot};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SkyData=api;
})(typeof globalThis!=='undefined'?globalThis:this);
