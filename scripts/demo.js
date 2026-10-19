(function(){
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)],params=new URLSearchParams(location.search),norm=s=>(s||'').toLowerCase().replace(/ё/g,'е');
const page=location.pathname.split('/').pop()||'index.html';
const matchesKind=(k,t,event)=>{t=norm(t);switch(k){case 'services':return !event;case 'liturgy':return /литурги/.test(t);case 'evening':return /вечер|всенощ|полиеле/.test(t);case 'confession':return /исповед/.test(t);case 'hours':return /часы|утрен/.test(t);case 'memorial':return /панихид|отпеван|лити[яию]/.test(t);case 'baptism':return /крещен/.test(t)&&!/бесед/.test(t);case 'akathist':return /акафист/.test(t);case 'prayer':return /молеб/.test(t);case 'catechesis':return /бесед.*крещ|оглас/.test(t);case 'events':return event;default:return true;}};
window.demoMatchesKind=matchesKind;
if(page.startsWith('schedule')){
 const form=$('.cathedral-filters');if(form){
 const kind=$('[name=kind]',form),priest=$('[name=priest]',form),rows=$$('.cathedral-service'),days=$$('.schedule-day');
 if(params.has('kind'))kind.value=params.get('kind');if(params.has('priest'))priest.value=params.get('priest');
 const filter=()=>{for(const row of rows){const t=row.dataset.demoTitle||$('h4',row)?.textContent||'',isEvent=row.classList.contains('meeting-row'),ps=$$('.service-celebrant a',row).map(a=>a.getAttribute('href'));let priestOk=!priest.value||(priest.value==='bishop'?row.classList.contains('hierarch-service'):ps.some(u=>u.includes(priest.value)))||norm($('.service-celebrant',row)?.textContent).includes(norm(priest.selectedOptions[0]?.textContent));row.hidden=!(matchesKind(kind.value,t,isEvent)&&priestOk);}for(const day of days)day.hidden=!$$('.cathedral-service',day).some(r=>!r.hidden);};
 form.addEventListener('submit',e=>{e.preventDefault();filter();});kind.addEventListener('change',filter);priest.addEventListener('change',filter);filter();
 }
}
if(page==='clergy.html'){
 const form=$('form.filters'),cards=$$('.grid>.card');if(form){const q=$('[name=q]',form),rank=$('[name=rank]',form);q.value=params.get('q')||'';rank.value=params.get('rank')||'';const run=()=>cards.forEach(c=>c.hidden=!(norm(c.textContent).includes(norm(q.value))&&(!rank.value||$('.tag',c)?.textContent===rank.value)));form.addEventListener('submit',e=>{e.preventDefault();run()});q.addEventListener('input',run);rank.addEventListener('change',run);run();}
}
if(page==='news.html'){
 const form=$('form.filters'),cards=$$('.grid>.card'),chips=$$('.tabs a');let category=params.get('category')||'';const q=$('[name=q]',form);q.value=params.get('q')||'';
 const run=()=>{const label=category==='Епархия'?'Митрополия':category;cards.forEach(c=>c.hidden=!((!label||$('.tag',c)?.textContent===label)&&norm(c.textContent).includes(norm(q.value))));chips.forEach(a=>a.classList.toggle('active',(new URL(a.href,location.href).searchParams.get('category')||'')===category));};
 chips.forEach(a=>a.addEventListener('click',e=>{e.preventDefault();category=new URL(a.href,location.href).searchParams.get('category')||'';run();}));form.addEventListener('submit',e=>{e.preventDefault();run()});q.addEventListener('input',run);run();
}
if(page==='search.html'){
 const form=$('form.filters'),input=$('[name=q]',form),holder=document.createElement('section');holder.className='demo-search-results';form.after(holder);input.value=params.get('q')||'';
 const run=()=>{holder.replaceChildren();const q=norm(input.value.trim());if(!q)return;const hits=window.DEMO_SEARCH.filter(x=>x.url!=='search.html'&&norm(x.title+' '+x.text).includes(q));const count=document.createElement('p');count.textContent='Найдено: '+hits.length;holder.append(count);for(const item of hits){const article=document.createElement('article'),title=document.createElement('h3'),a=document.createElement('a'),p=document.createElement('p');article.className='service';article.style.display='block';a.href=item.url;a.textContent=item.title;p.textContent=item.text.slice(0,220)+'…';title.append(a);article.append(title,p);holder.append(article);}};form.addEventListener('submit',e=>{e.preventDefault();run()});run();
}
for(const form of $$('form.filters'))if(!form.classList.contains('cathedral-filters')&&!['clergy.html','news.html','search.html'].includes(page))form.addEventListener('submit',e=>{e.preventDefault();const q=new URLSearchParams(new FormData(form));location.href=page+'?'+q;});
if(page==='notes.html'||page==='donations.html'){const sel=$('#giving-temple');if(sel&&params.has('temple')){sel.value=params.get('temple');sel.dispatchEvent(new Event('change',{bubbles:true}));}}
// Snapshot stays fixed at its export date; no server requests are needed.
})();
