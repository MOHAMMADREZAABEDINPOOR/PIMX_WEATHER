/* Renderer only: physical coordinates are computed by astronomy-data.js.
   Textures, body sizes, orbit scales and stars are artistic display elements. */
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

const names={Mercury:'عطارد',Venus:'زهره',Earth:'زمین',Mars:'مریخ',Jupiter:'مشتری',Saturn:'زحل',Uranus:'اورانوس',Neptune:'نپتون',Moon:'ماه',Sun:'خورشید'};
const displayName=(key,lang)=>lang==='fa'?names[key]:key;
function texture(key,color){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256;
  const ctx=canvas.getContext('2d');ctx.fillStyle=color;ctx.fillRect(0,0,512,256);
  if(key==='Earth'){
    ctx.fillStyle='#2978a7';ctx.fillRect(0,0,512,256);
    ctx.fillStyle='#689173';
    const lands=[[[31,49],[81,30],[116,56],[103,88],[74,105],[57,84]],[[118,112],[143,122],[150,171],[126,213],[105,155]],[[219,51],[269,28],[350,36],[390,69],[339,93],[289,80],[282,116],[243,94]],[[244,103],[290,102],[305,142],[270,195],[248,157]],[[390,170],[425,157],[453,180],[442,205],[400,210]]];
    lands.forEach(points=>{ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();});
    ctx.fillStyle='#dce5e3';ctx.fillRect(0,0,512,10);ctx.fillRect(0,244,512,12);
    for(let i=0;i<16;i++){ctx.strokeStyle='#ffffff22';ctx.lineWidth=3+(i%4);ctx.beginPath();ctx.ellipse((i*89)%512,25+(i*47)%200,25+i%8,4+i%5,.2,0,Math.PI*2);ctx.stroke();}
  }else if(['Jupiter','Saturn','Venus','Neptune','Uranus'].includes(key)){
    for(let y=0;y<256;y+=3){const wave=Math.sin(y*.18)+Math.sin(y*.055)*.6;ctx.fillStyle=wave>0?'#ffffff17':'#4930241e';ctx.fillRect(0,y,512,2+(y%7));}
    if(key==='Jupiter'){ctx.fillStyle='#b36749';ctx.beginPath();ctx.ellipse(335,167,39,14,-.1,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#efd1ad66';ctx.lineWidth=4;ctx.stroke();}
    if(key==='Venus'){for(let i=0;i<35;i++){ctx.strokeStyle='#ffe3a914';ctx.lineWidth=8;ctx.beginPath();ctx.ellipse(i*39%512,i*57%256,60,17,.2+i*.13,0,Math.PI*2);ctx.stroke();}}
  }else{
    for(let i=0;i<65;i++){const x=i*137%512,y=i*79%256,r=2+i%12;ctx.fillStyle=i%2?'#272e3628':'#ffffff18';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#171d2920';ctx.lineWidth=2;ctx.stroke();}
  }
  const result=new THREE.CanvasTexture(canvas);result.colorSpace=THREE.SRGBColorSpace;return result;
}
function glowTexture(){
  const canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;const c=canvas.getContext('2d');
  const g=c.createRadialGradient(128,128,0,128,128,128);g.addColorStop(0,'#fff5ca99');g.addColorStop(.18,'#ffd59660');g.addColorStop(.5,'#eaa75917');g.addColorStop(1,'#eaa75900');c.fillStyle=g;c.fillRect(0,0,256,256);return new THREE.CanvasTexture(canvas);
}
const xyz=p=>new THREE.Vector3(p.x*p.orbit/p.au,p.z*p.orbit/p.au,-p.y*p.orbit/p.au);

function fallback({container,labels,onSelect,onZoom,onFallback}){
  container.dataset.renderer='fallback';labels.replaceChildren();let latest=null,lang='fa',selected='Earth';
  function draw(){
    if(!latest)return;
    const planets=latest.planets.map(p=>{const v=xyz(p);return {...p,px:380+v.x*2.55,py:240+v.z*1.15-v.y*.8};});
    container.innerHTML=`<div class="solar-fallback"><svg viewBox="0 0 760 480" role="img" aria-label="Solar system"><defs>${planets.map(p=>`<radialGradient id="fb-${p.key}"><stop stop-color="#fff"/><stop offset=".4" stop-color="${p.color}"/><stop offset="1" stop-color="#18283c"/></radialGradient>`).join('')}<radialGradient id="fb-sun"><stop stop-color="#fff8c9"/><stop offset="1" stop-color="#eab570"/></radialGradient></defs>${planets.map(p=>`<ellipse cx="380" cy="240" rx="${p.orbit*2.55}" ry="${p.orbit*1.15}" fill="none" stroke="#8ca8d5" stroke-opacity=".12"/>`).join('')}<circle cx="380" cy="240" r="22" fill="url(#fb-sun)"/>${planets.map(p=>`<g data-solar-body="${p.key}" style="cursor:pointer"><circle cx="${p.px}" cy="${p.py}" r="${p.radius*2.1}" fill="url(#fb-${p.key})" stroke="${p.key===selected?'#d5f5a0':'none'}"/><text x="${p.px}" y="${p.py-p.radius*2.1-9}" fill="#a8bad2" text-anchor="middle" font-size="11" font-family="Inter,Vazirmatn,sans-serif">${displayName(p.key,lang)}</text></g>`).join('')}</svg></div>`;
  }
  container.addEventListener('click',event=>{const body=event.target.closest('[data-solar-body]');if(body)onSelect(body.dataset.solarBody);});
  onFallback();onZoom(100);
  return {update(sky,key,language){latest=sky;selected=key;lang=language;container.dataset.epoch=String(sky.epoch);draw();},setMotion(){},setVisible(){},zoom(){},reset(){onZoom(100);}};
}
export function createSolarSystem(options){
  const {container,labels,onSelect,onZoom}=options;
  let renderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});}catch{return fallback(options);}
  container.replaceChildren(renderer.domElement);container.dataset.renderer='webgl';
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(43,1,.1,1400);
  const home=new THREE.Vector3(-40,165,220),fittedHome=home.clone();camera.position.copy(home);
  const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.07;controls.enablePan=false;controls.minDistance=45;controls.maxDistance=480;controls.autoRotate=options.motion;controls.autoRotateSpeed=.35;controls.maxPolarAngle=Math.PI*.87;
  scene.add(new THREE.AmbientLight('#b9d2ee',.95));const sunlight=new THREE.PointLight('#fff0cd',1800);scene.add(sunlight);
  const sun=new THREE.Mesh(new THREE.SphereGeometry(6.8,48,32),new THREE.MeshBasicMaterial({map:texture('Sun','#f2c26d')}));scene.add(sun);
  const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture(),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));glow.scale.set(58,58,1);scene.add(glow);
  const stars=new Float32Array(850*3);for(let i=0;i<850;i++){const y=1-i/849*2,angle=i*Math.PI*(3-Math.sqrt(5)),r=Math.sqrt(1-y*y);stars[i*3]=Math.cos(angle)*r*510;stars[i*3+1]=y*510;stars[i*3+2]=Math.sin(angle)*r*510;}
  const starGeometry=new THREE.BufferGeometry();starGeometry.setAttribute('position',new THREE.BufferAttribute(stars,3));scene.add(new THREE.Points(starGeometry,new THREE.PointsMaterial({color:'#c2d3eb',size:.75,transparent:true,opacity:.65,sizeAttenuation:true})));
  const objects=new Map(),orbits=new THREE.Group();scene.add(orbits);
  const moon=new THREE.Mesh(new THREE.SphereGeometry(.9,20,14),new THREE.MeshStandardMaterial({map:texture('Moon','#b3bdc6'),roughness:1}));scene.add(moon);let moonTarget=new THREE.Vector3();
  const halo=new THREE.Mesh(new THREE.TorusGeometry(1,.04,8,64),new THREE.MeshBasicMaterial({color:'#d5f5a0',transparent:true,opacity:.65}));halo.rotation.x=Math.PI/2;scene.add(halo);
  let visible=false,frame=null,latest=null,selected='Earth',lang='fa',initialized=false,lastRender=0,lastZoom=0,orbitYear=null,replacement=null;
  function build(sky){
    for(const p of sky.planets){
      const material=new THREE.MeshStandardMaterial({map:texture(p.key,p.color),roughness:.8,metalness:0});
      const radius=p.radius*1.4,mesh=new THREE.Mesh(new THREE.SphereGeometry(radius,40,28),material);mesh.userData.key=p.key;scene.add(mesh);
      if(p.key==='Saturn'){
        const ring=new THREE.Mesh(new THREE.RingGeometry(radius*1.4,radius*2.35,96),new THREE.MeshStandardMaterial({color:'#c3b48d',side:THREE.DoubleSide,transparent:true,opacity:.6,roughness:1}));ring.rotation.x=Math.PI/2-.47;mesh.add(ring);
      }
      const label=document.createElement('span');label.className='planet-label';labels.append(label);
      objects.set(p.key,{mesh,target:new THREE.Vector3(),label,radius});
    }
  }
  function updateOrbits(sky){
    const year=new Date(sky.epoch*1000).getUTCFullYear();if(orbitYear===year)return;orbitYear=year;
    while(orbits.children.length){const line=orbits.children[0];orbits.remove(line);line.geometry.dispose();line.material.dispose();}
    for(const p of sky.planets){
      const samples=Array.from({length:145},(_,i)=>{
        const when=new Date((sky.epoch+p.period*86400*i/144)*1000),v=window.Astronomy.Ecliptic(window.Astronomy.HelioVector(p.key,when)).vec;
        return xyz({...p,x:v.x,y:v.y,z:v.z});
      });
      const geometry=new THREE.BufferGeometry().setFromPoints(samples),line=new THREE.Line(geometry,new THREE.LineBasicMaterial({color:p.color,transparent:true,opacity:.2}));orbits.add(line);
    }
  }
  function render(now=performance.now()){
    if(!visible||document.hidden){frame=null;return;}
    frame=requestAnimationFrame(render);if(now-lastRender<32)return;lastRender=now;
    for(const item of objects.values())item.mesh.position.lerp(item.target,.18);
    moon.position.lerp(moonTarget,.18);
    const chosen=objects.get(selected);if(chosen){halo.position.copy(chosen.mesh.position);halo.scale.setScalar(chosen.radius*1.65);}
    controls.update();renderer.render(scene,camera);
    for(const [key,item] of objects){
      const point=item.mesh.position.clone();point.y+=item.radius+2;point.project(camera);
      item.label.style.left=`${(point.x+1)/2*container.clientWidth}px`;item.label.style.top=`${(1-point.y)/2*container.clientHeight}px`;
      item.label.hidden=point.z>1||point.z< -1;item.label.classList.toggle('selected',key===selected);
    }
    const zoom=Math.round(fittedHome.length()/camera.position.length()*100);if(zoom!==lastZoom){lastZoom=zoom;onZoom(zoom);}
  }
  function start(){if(!replacement&&visible&&!frame&&!document.hidden)frame=requestAnimationFrame(render);}
  const resize=new ResizeObserver(()=>{const w=container.clientWidth,h=container.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;fittedHome.copy(home).multiplyScalar(Math.max(1,1.18/camera.aspect));camera.position.copy(fittedHome);camera.updateProjectionMatrix();controls.update();start();});resize.observe(container);
  let down=null;renderer.domElement.addEventListener('pointerdown',e=>down={x:e.clientX,y:e.clientY});
  renderer.domElement.addEventListener('pointerup',e=>{
    if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>6)return;
    const box=renderer.domElement.getBoundingClientRect(),pointer=new THREE.Vector2((e.clientX-box.left)/box.width*2-1,-(e.clientY-box.top)/box.height*2+1),ray=new THREE.Raycaster();ray.setFromCamera(pointer,camera);
    const hit=ray.intersectObjects([...objects.values()].map(o=>o.mesh),false)[0];if(hit)onSelect(hit.object.userData.key);
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden){if(frame)cancelAnimationFrame(frame);frame=null;}else start();});
  renderer.domElement.addEventListener('webglcontextlost',event=>{
    event.preventDefault();visible=false;if(frame)cancelAnimationFrame(frame);frame=null;
    resize.disconnect();controls.dispose();
    replacement=fallback(options);if(latest)replacement.update(latest,selected,lang);
  });
  return {
    update(sky,key,language){
      if(replacement){if(sky)replacement.update(sky,key,language);return;}
      if(!sky)return;latest=sky;selected=key;lang=language;if(!objects.size)build(sky);
      for(const p of sky.planets){const item=objects.get(p.key);item.target.copy(xyz(p));if(!initialized)item.mesh.position.copy(item.target);item.label.textContent=displayName(p.key,lang);}
      const earth=objects.get('Earth'),v=sky.moon.vector,length=Math.hypot(v.x,v.y,v.z);
      moonTarget.copy(earth.target).add(new THREE.Vector3(v.x/length*4.5,v.z/length*4.5,-v.y/length*4.5));if(!initialized)moon.position.copy(moonTarget);
      initialized=true;updateOrbits(sky);container.dataset.epoch=String(sky.epoch);start();
    },
    setVisible(value){if(replacement){replacement.setVisible(value);return;}visible=value;if(!visible){if(frame)cancelAnimationFrame(frame);frame=null;}else start();},
    setMotion(value){if(replacement){replacement.setMotion(value);return;}controls.autoRotate=value;start();},
    zoom(factor){if(replacement){replacement.zoom(factor);return;}camera.position.multiplyScalar(1/factor);camera.position.setLength(Math.max(45,Math.min(480,camera.position.length())));controls.update();start();},
    reset(){if(replacement){replacement.reset();return;}camera.position.copy(fittedHome);controls.target.set(0,0,0);controls.update();start();}
  };
}
