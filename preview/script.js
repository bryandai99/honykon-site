/* Mobile navigation: keyboard and touch friendly */
const menu=document.querySelector('.menu');
const nav=document.querySelector('.nav nav');
if(menu&&nav){
 const closeMenu=()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰';};
 menu.addEventListener('click',()=>{
  const opened=nav.classList.toggle('open');
  menu.setAttribute('aria-expanded',String(opened));
  menu.textContent=opened?'×':'☰';
 });
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
}

/* Product category filters with accessible state and result announcement */
const filterButtons=[...document.querySelectorAll('.filter-btn')];
const catalogCards=[...document.querySelectorAll('.catalog-card')];
const catalogStatus=document.getElementById('catalog-status');
const filterNames={all:'全部產品',control:'控制器',sprinkler:'噴頭噴嘴',valve:'電磁閥',drip:'滴灌微噴',piping:'管材配件'};
filterButtons.forEach(button=>button.addEventListener('click',()=>{
 const filter=button.dataset.filter;
 filterButtons.forEach(item=>{
  const active=item===button;
  item.classList.toggle('active',active);
  item.setAttribute('aria-pressed',String(active));
 });
 let visible=0;
 catalogCards.forEach(card=>{
  const show=filter==='all'||card.dataset.category===filter;
  card.hidden=!show;
  if(show)visible++;
 });
 if(catalogStatus)catalogStatus.textContent='目前顯示「'+filterNames[filter]+'」：'+visible+' 項';
}));

/* Contextual inquiry: product links select product inquiry; project links select engineering inquiry */
document.querySelectorAll('[data-inquiry]').forEach(link=>link.addEventListener('click',()=>{
 const field=document.querySelector('#inquiry textarea[name="需求內容"]');
 const type=document.querySelector('#inquiry select[name="需求類型"]');
 const isEngineering=link.closest('.portfolio-card')!==null||link.closest('.services')!==null;
 if(type)type.value=isEngineering?'灌溉工程／系統規劃':'產品採購／規格詢價';
 if(field){
  const item='詢問項目：'+link.dataset.inquiry;
  if(!field.value.includes(item))field.value=item+'\n'+field.value;
 }
}));

/* Mailto form: keep data local and let the visitor review before sending */
const form=document.getElementById('inquiry');
if(form){
 form.addEventListener('submit',e=>{
  e.preventDefault();
  if(!form.reportValidity())return;
  const data=new FormData(form);
  const subject=encodeURIComponent('[滙凱網站詢價] '+data.get('需求類型'));
  const body=encodeURIComponent([...data.entries()].map(([key,value])=>key+'：'+value).join('\n'));
  const mailto='mailto:sales.honykon@msa.hinet.net?subject='+subject+'&body='+body;
  window.location.href=mailto;
 });
}
