const menu=document.querySelector('.menu');const nav=document.querySelector('.nav nav');if(menu&&nav){menu.addEventListener('click',()=>{const opened=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(opened));menu.textContent=opened?'×':'☰'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰'}));}
const form=document.getElementById('inquiry');if(form){form.addEventListener('submit',e=>{e.preventDefault();const data=new FormData(form);const subject=encodeURIComponent('[滙凱網站詢價] '+data.get('需求類型'));const body=encodeURIComponent([...data.entries()].map(([key,value])=>key+'：'+value).join('\n'));location.href='mailto:sales.honykon@msa.hinet.net?subject='+subject+'&body='+body;});}
/* Catalogue category filters and contextual inquiry links */
document.querySelectorAll('.filter-btn').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('.filter-btn').forEach(item=>item.classList.remove('active'));
 button.classList.add('active');
 const filter=button.dataset.filter;
 document.querySelectorAll('.catalog-card').forEach(card=>{
  card.hidden=filter!=='all'&&card.dataset.category!==filter;
 });
}));
document.querySelectorAll('[data-inquiry]').forEach(link=>link.addEventListener('click',()=>{
 const field=document.querySelector('#inquiry textarea[name="需求內容"]');
 if(field){field.value='詢問項目：'+link.dataset.inquiry+'\n'+field.value; }
}));
