/* Custom pickers keep the existing forecast inputs as their source of truth. */
window.WeatherControls = (() => {
  const dayMs = 86400000;
  const keyOf = date => date.toISOString().slice(0, 10);
  const fromKey = key => new Date(`${key}T12:00:00Z`);
  const shift = (date, days) => new Date(date.getTime() + days * dayMs);

  function create({t, icon}) {
    const dateInput = document.getElementById('datePicker');
    const modelInput = document.getElementById('modelSelect');
    const panels = {};
    let active = null, month = null, focusedDay = null, signature = '', today = '';
    const lang = () => document.documentElement.lang;
    const locale = () => lang() === 'fa' ? 'fa-IR' : 'en-GB';
    const calendar = () => lang() === 'fa' ? 'persian' : 'gregory';
    const format = (date, options) => new Intl.DateTimeFormat(locale(), {calendar: calendar(), timeZone: 'UTC', ...options}).format(date);
    const number = value => new Intl.NumberFormat(locale()).format(value);
    const parts = date => Object.fromEntries(new Intl.DateTimeFormat('en-GB', {calendar: calendar(), numberingSystem:'latn', timeZone:'UTC', year:'numeric',month:'numeric',day:'numeric'}).formatToParts(date).filter(p => ['year','month','day'].includes(p.type)).map(p => [p.type,Number(p.value)]));
    const startMonth = date => shift(date, 1 - parts(date).day);
    const nextMonth = date => startMonth(shift(date, 40));
    const previousMonth = date => startMonth(shift(date, -1));
    const allowed = key => !dateInput.disabled && key >= dateInput.min && key <= dateInput.max;

    function setup(name, input, role) {
      const wrapper = document.createElement('div');wrapper.className = 'picker-wrapper';
      input.before(wrapper);wrapper.append(input);input.hidden = true;
      const trigger = document.createElement('button');trigger.type = 'button';trigger.id = `${name}Trigger`;trigger.className = `picker-trigger ${name}-trigger`;
      trigger.setAttribute('aria-haspopup',role);trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-controls',`${name}Panel`);wrapper.append(trigger);
      const panel = document.createElement('div');panel.id = `${name}Panel`;panel.className = `picker-panel ${name}-panel`;panel.hidden = true;panel.setAttribute('role',role);document.body.append(panel);
      trigger.addEventListener('click',() => active === name ? close(true) : open(name));
      trigger.addEventListener('keydown',event => {if(['ArrowDown','ArrowUp'].includes(event.key)){event.preventDefault();open(name);}});
      panels[name] = {trigger,panel};
      return panels[name];
    }
    const date = setup('calendar',dateInput,'dialog');
    const model = setup('model',modelInput,'listbox');

    function position() {
      if(!active)return;
      const {trigger,panel} = panels[active], box = trigger.getBoundingClientRect();
      if(box.bottom < 0 || box.top > innerHeight){close();return;}
      const width = Math.min(active === 'calendar' ? 316 : 288,innerWidth - 24);
      panel.style.width = `${width}px`;
      const left = document.documentElement.dir === 'rtl' ? box.right - width : box.left;
      panel.style.left = `${Math.max(12,Math.min(left,innerWidth - width - 12))}px`;
      panel.style.maxHeight = `${Math.max(180,innerHeight - 24)}px`;
      const height = panel.getBoundingClientRect().height;
      const below = box.bottom + 10;
      panel.style.top = `${Math.max(12,below + height <= innerHeight - 12 ? below : box.top - height - 10)}px`;
    }
    function close(restore = false) {
      if(!active)return;
      const {trigger,panel} = panels[active];active = null;panel.hidden = true;trigger.setAttribute('aria-expanded','false');
      if(restore)trigger.focus({preventScroll:true});
    }
    function open(name) {
      if(panels[name].trigger.disabled)return;
      close();active = name;
      if(name === 'calendar'){
        focusedDay = dateInput.value;month = startMonth(fromKey(focusedDay));renderCalendar();
      }else renderModels();
      const {trigger,panel} = panels[name];panel.hidden = false;trigger.setAttribute('aria-expanded','true');position();
      const focus = name === 'calendar' ? panel.querySelector('[tabindex="0"]') : panel.querySelector('[aria-selected="true"]');
      focus?.focus({preventScroll:true});
    }
    function pickDate(key) {
      if(!allowed(key))return;
      dateInput.value = key;close(true);dateInput.dispatchEvent(new Event('change',{bubbles:true}));
    }
    function renderCalendar() {
      if(!month || !dateInput.min || !dateInput.max)return;
      const startWeek = lang() === 'fa' ? 6 : 1, first = month;
      const next = nextMonth(first), prev = previousMonth(first), gridStart = shift(first,-((first.getUTCDay()-startWeek+7)%7));
      const count = Math.ceil(((first-gridStart)/dayMs+(next-first)/dayMs)/7)*7;
      const names = Array.from({length:7},(_,i) => format(shift(new Date('2026-10-04T12:00:00Z'),(startWeek+i)%7),{weekday:'short'}));
      date.panel.setAttribute('aria-label',t('pickDate'));
      date.panel.innerHTML = `<div class="picker-caption">${icon('calendar')}<span>${t('calendarHeading')}</span><span class="calendar-type">${t(lang()==='fa'?'persianCalendar':'gregorianCalendar')}</span></div><div class="calendar-heading"><strong aria-live="polite">${format(first,{month:'long',year:'numeric'})}</strong><div class="calendar-navigation"><button type="button" data-month="-1" aria-label="${t('previousMonth')}" ${(keyOf(shift(first,-1))<dateInput.min)?'disabled':''}>${icon('arrow')}</button><button type="button" data-month="1" aria-label="${t('nextMonth')}" ${keyOf(next)>dateInput.max?'disabled':''}>${icon('arrow')}</button></div></div><div class="calendar-weekdays">${names.map(name=>`<span>${name}</span>`).join('')}</div><div class="calendar-days" role="group" aria-label="${format(first,{month:'long',year:'numeric'})}">${Array.from({length:count},(_,i)=>{
        const value=shift(gridStart,i),key=keyOf(value),selected=key===dateInput.value,outside=value<first||value>=next;
        return `<button type="button" data-date="${key}" class="calendar-day${selected?' selected':''}${key===today?' is-today':''}${outside?' outside-month':''}" aria-label="${format(value,{weekday:'long',year:'numeric',month:'long',day:'numeric'})}" aria-pressed="${selected}" ${key===today?'aria-current="date"':''} tabindex="${key===focusedDay&&allowed(key)?0:-1}" ${allowed(key)?'':'disabled'}><span>${number(parts(value).day)}</span>${key===today?'<i></i>':''}</button>`;
      }).join('')}</div><div class="calendar-footer"><div><span>${t('availableDates')}</span><strong>${format(fromKey(dateInput.min),{month:'short',day:'numeric'})} — ${format(fromKey(dateInput.max),{month:'short',day:'numeric'})}</strong></div><button type="button" class="calendar-today" data-today ${allowed(today)?'':'disabled'}>${t('today')}</button></div>`;
    }
    function renderModels() {
      model.panel.setAttribute('aria-label',t('forecastModel'));
      const descriptions = {best_match:'modelAutoDescription',ecmwf_ifs04:'modelEcmwfDescription',gfs_global:'modelGfsDescription',icon_global:'modelIconDescription'};
      model.panel.innerHTML = `<div class="picker-caption" role="presentation">${icon('globe')}<span>${t('forecastModel')}</span></div>${Array.from(modelInput.options).map(option=>`<button type="button" id="model-option-${option.value}" class="model-option" role="option" data-value="${option.value}" aria-selected="${option.value===modelInput.value}" tabindex="${option.value===modelInput.value?0:-1}"><span class="model-option-icon">${icon(option.value==='best_match'?'spark':'globe')}</span><span class="model-option-copy"><strong>${option.textContent}</strong><small>${t(descriptions[option.value])}</small></span><span class="model-check" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg></span></button>`).join('')}`;
    }
    date.panel.addEventListener('click',event => {
      const day=event.target.closest('[data-date]');if(day){pickDate(day.dataset.date);return;}
      if(event.target.closest('[data-today]')){pickDate(today);return;}
      const move=event.target.closest('[data-month]');if(move&&!move.disabled){month=Number(move.dataset.month)>0?nextMonth(month):previousMonth(month);focusedDay=keyOf(month)<dateInput.min?dateInput.min:keyOf(month);renderCalendar();position();const navigation=date.panel.querySelector(`[data-month="${move.dataset.month}"]`);(navigation&&!navigation.disabled?navigation:date.panel.querySelector('[tabindex="0"]'))?.focus({preventScroll:true});}
    });
    date.panel.addEventListener('keydown',event => {
      const day=event.target.closest('[data-date]');if(!day)return;
      const rtl=document.documentElement.dir==='rtl',d=fromKey(day.dataset.date);
      let target;
      if(event.key==='ArrowRight')target=shift(d,rtl?-1:1);
      if(event.key==='ArrowLeft')target=shift(d,rtl?1:-1);
      if(event.key==='ArrowDown')target=shift(d,7);
      if(event.key==='ArrowUp')target=shift(d,-7);
      const startWeek=lang()==='fa'?6:1,offset=(d.getUTCDay()-startWeek+7)%7;
      if(event.key==='Home')target=shift(d,-offset);
      if(event.key==='End')target=shift(d,6-offset);
      if(event.key==='PageDown')target=nextMonth(startMonth(d));
      if(event.key==='PageUp')target=previousMonth(startMonth(d));
      if(!target)return;event.preventDefault();
      focusedDay=keyOf(target)<dateInput.min?dateInput.min:keyOf(target)>dateInput.max?dateInput.max:keyOf(target);
      month=startMonth(fromKey(focusedDay));renderCalendar();position();date.panel.querySelector(`[data-date="${focusedDay}"]`)?.focus({preventScroll:true});
    });
    model.panel.addEventListener('click',event => {
      const option=event.target.closest('[data-value]');if(!option)return;
      const changed=modelInput.value!==option.dataset.value;modelInput.value=option.dataset.value;close(true);
      if(changed)modelInput.dispatchEvent(new Event('change',{bubbles:true}));
    });
    model.panel.addEventListener('keydown',event => {
      const options=[...model.panel.querySelectorAll('[role="option"]')],index=options.indexOf(document.activeElement);
      let target;
      if(event.key==='ArrowDown')target=(index+1)%options.length;
      if(event.key==='ArrowUp')target=(index-1+options.length)%options.length;
      if(event.key==='Home')target=0;if(event.key==='End')target=options.length-1;
      if(target===undefined)return;event.preventDefault();options.forEach((option,i)=>option.tabIndex=i===target?0:-1);options[target].focus();
    });
    document.addEventListener('keydown',event => {if(active&&event.key==='Escape'){event.preventDefault();close(true);}});
    document.addEventListener('pointerdown',event => {if(active&&!panels[active].panel.contains(event.target)&&!panels[active].trigger.contains(event.target))close();});
    document.addEventListener('focusin',event => {if(active&&!panels[active].panel.contains(event.target)&&!panels[active].trigger.contains(event.target))close();});
    window.addEventListener('resize',position);document.addEventListener('scroll',position,true);
    return {sync(todayKey){
      today=todayKey;date.trigger.disabled=dateInput.disabled;model.trigger.disabled=modelInput.disabled;
      date.trigger.setAttribute('aria-label',t('pickDate'));model.trigger.setAttribute('aria-label',t('forecastModel'));
      date.trigger.innerHTML=`${icon('calendar')}<span>${dateInput.value?format(fromKey(dateInput.value),{day:'numeric',month:'short',year:'numeric'}):t('pickDate')}</span><span class="picker-chevron">⌄</span>`;
      model.trigger.innerHTML=`<span class="model-trigger-dot"></span><span>${modelInput.selectedOptions[0]?.textContent||t('modelBest')}</span><span class="picker-chevron">⌄</span>`;
      const nextSignature=`${lang()}/${dateInput.value}/${dateInput.min}/${dateInput.max}/${modelInput.value}/${today}`;
      if(signature!==nextSignature){signature=nextSignature;if(active)close();}
    },close};
  }
  return {create};
})();
