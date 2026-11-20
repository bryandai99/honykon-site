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

/* Product specification detail dialogs: figures are taken from manufacturer sources */
const productDetails={
 control:{
  brand:"YARDIAN",name:"Yardian 智慧灌溉控制器",model:"Yardian（原始系列；非 Yardian Pro）",
  intro:"以手機 App／網頁管理灌溉分區的智慧控制器。此卡片照片對應 Yardian 原始系列，請勿與 Yardian Pro 規格混用。",
  specs:[["控制分區","8 區、12 區版本"],["電源輸入","100–240 VAC，50–60 Hz"],["閥門輸出","24 VAC，最大 750 mA"],["網路連線","2.4 GHz Wi-Fi，802.11 b/g/n"],["雨感器","支援常開（NO）／常閉（NC）設定"],["外殼設計","防水設計，可室內／室外使用"],["尺寸","約 200 × 200 × 70 mm"],["保固","原廠標示 2 年有限保固"]],
  note:"原廠頁面規格。採購前仍須確認實際供應版本、電源配件、區數與台灣供貨狀況。",
  url:"https://www.yardian.com/products/yardian/",source:"Yardian 官方產品規格"
 },
 sprinkler:{
  brand:"HUNTER",name:"Hunter PGP Ultra 地埋式旋轉噴頭",model:"PGP Ultra（PGP-00／04／06／12 等型式）",
  intro:"適用於草坪及景觀灌溉。噴灑半徑與流量會隨噴嘴、工作壓力及配置改變，選型時需搭配噴嘴表與水力條件。",
  specs:[["噴灑半徑","4.9–14.0 m"],["流量範圍","約 1.2–53.8 L/min"],["建議工作壓力","約 1.7–4.8 bar（25–70 PSI）"],["可調角度","50°–360°"],["進水口徑","3/4 吋"],["噴嘴選擇","多種標準及低仰角噴嘴"],["彈出高度","依 PGP-00／04／06／12 型式不同"],["保固","原廠標示 5 年"]],
  note:"射程與流量為原廠產品系列範圍，不代表任一噴嘴在所有壓力下均可達到。實際設計須依噴嘴型號及壓力查表。",
  url:"https://www.hunterindustries.com/sites/default/files/CA-Cutsheet-PGP-Ultra-EM.pdf",source:"Hunter PGP Ultra 官方規格表"
 },
 valve:{
  brand:"HUNTER",name:"Hunter PGV 灌溉電磁閥",model:"PGV-100G／PGV-101G（1 吋系列代表型號）",
  intro:"用於自動灌溉分區啟閉。PGV 系列另有不同口徑、直通／角式、流量控制及 Jar-Top 等型式；以下列出 1 吋系列資料。",
  specs:[["代表型號","PGV-100G（無流量控制）；PGV-101G（含流量控制）"],["進水口徑","1 吋（25 mm）"],["流量範圍","0.7–150 L/min"],["建議壓力範圍","1.5–10 bar"],["電磁線圈","24 VAC"],["線圈電流（50 Hz）","啟動 370 mA；保持 210 mA"],["尺寸（一般型）","約高 13 × 長 11 × 寬 6 cm"],["保固","原廠標示 2 年"]],
  note:"此處規格限 Hunter PGV 1 吋系列代表型號；不同口徑、接頭形式及線圈選項可能不同。流量上限不等於建議設計流量，仍須檢核壓損。",
  url:"https://www.hunterindustries.com/sites/default/files/CA-Cutsheet-1-Inch-PGV-And-PGV-Jar-Top-EM.pdf",source:"Hunter PGV 官方規格表"
 },
 drip:{
  brand:"HUNTER",name:"Hunter PLD Professional Landscape Dripline",model:"PLD 16 mm 壓力補償滴灌管",
  intro:"用於景觀植栽、地被及樹穴等滴灌配置。出水量與滴頭間距依 PLD 子型號選擇。",
  specs:[["管徑","16 mm"],["滴頭流量","2.2 或 3.8 L/h"],["滴頭間距","30 或 50 cm（依型號）"],["工作壓力範圍","1.0–3.5 bar"],["過濾需求","最低 120 mesh（約 125 μm）"],["產品特性","壓力補償滴頭；CV 型具止回／防排空功能"],["常見型號編碼","PLD-22／PLD-38，搭配間距與捲長選項"],["保固","原廠標示 5 年"]],
  note:"以上依 Hunter PLD 16 mm 型錄資料整理。不同年份／地區型錄的流量與間距選項可能不同，訂貨前請依實際料號核對。",
  url:"https://www.hunterindustries.com/sites/default/files/Hunter_Catalog_EM.pdf",source:"Hunter 官方產品型錄（PLD 16 mm）"
 },
 piping:{
  brand:"TORO",name:"Toro Pro-Loc Tape Coupling 滴灌帶直通接頭",model:"FTC800",
  intro:"Pro-Loc 系列滴灌帶接頭，FTC800 為 1 吋滴灌帶用直通接頭，適合滴灌帶連接。",
  specs:[["原廠型號","FTC800"],["接頭型式","Coupling（直通接頭）"],["側 1 規格","1 吋 Tape"],["側 2 規格","1 吋 Tape"],["適用管材","Drip Tape（滴灌帶）"],["產品特點","粗牙旋帽密封、易握持安裝、低外型設計"]],
  note:"此頁為 FTC800 單一接頭型號規格；Toro Pro-Loc 另有不同管帶尺寸與接頭形式，請勿將 FTC800 規格套用至其他型號。",
  url:"https://www.toro.com/en/product/FTC800",source:"Toro FTC800 官方產品頁"
 }
};
const modal=document.getElementById('product-modal');
const detailContent=document.getElementById('product-dialog-content');
let lastProductTrigger=null;
function closeProductModal(){
 if(!modal||modal.hidden)return;
 modal.hidden=true;
 document.body.style.overflow='';
 if(lastProductTrigger)lastProductTrigger.focus();
}
function openProductModal(card){
 const data=productDetails[card.dataset.product];
 if(!data||!modal||!detailContent)return;
 lastProductTrigger=card;
 detailContent.innerHTML='<div class="product-detail-kicker">'+data.brand+'　/　PRODUCT SPECIFICATION</div>'+
  '<h2 id="product-modal-title">'+data.name+'</h2>'+
  '<p class="product-detail-sub"><b>型號：</b>'+data.model+'<br>'+data.intro+'</p>'+
  '<table class="product-spec-table"><tbody>'+data.specs.map(row=>'<tr><th>'+row[0]+'</th><td>'+row[1]+'</td></tr>').join('')+'</tbody></table>'+
  '<div class="product-detail-note">'+data.note+'</div>'+
  '<div class="product-detail-source">規格來源：<a href="'+data.url+'" target="_blank" rel="noopener">'+data.source+' ↗</a></div>';
 modal.hidden=false;
 document.body.style.overflow='hidden';
 modal.querySelector('.product-modal-close').focus();
}
document.querySelectorAll('.catalog-card[data-product]').forEach(card=>{
 card.addEventListener('click',()=>openProductModal(card));
 card.addEventListener('keydown',event=>{
  if(event.key==='Enter'||event.key===' '){event.preventDefault();openProductModal(card);}
 });
});
if(modal){
 modal.querySelectorAll('[data-modal-close]').forEach(el=>el.addEventListener('click',closeProductModal));
 document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&!modal.hidden)closeProductModal();
 });
}
