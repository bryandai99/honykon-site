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
const catalogGrid=document.querySelector('.catalog-grid');
const groupOrder=['control','sprinkler','valve','drip','piping'];
const groupLabels={sprinkler:'噴頭噴嘴',valve:'電磁閥',drip:'滴灌管',control:'智慧控制器',piping:'管材與配件'};
const brandRank={rainbird_sprinkler:0,rainbird_valve:0,rainbird_drip:0,sprinkler:1,valve:1,drip:1,toro_sprinkler:2,toro_valve:2,toro_drip:2,control:3,piping:4};
if(catalogGrid){
 const ordered=[...catalogCards].sort((a,b)=>{
  const groupDiff=groupOrder.indexOf(a.dataset.category)-groupOrder.indexOf(b.dataset.category);
  if(groupDiff!==0)return groupDiff;
  return (brandRank[a.dataset.product]??9)-(brandRank[b.dataset.product]??9);
 });
 catalogGrid.replaceChildren();
 let previousGroup='';
 ordered.forEach((card,index)=>{
  const group=card.dataset.category;
  if(group!==previousGroup){
   const heading=document.createElement('h3');
   heading.className='catalog-group-title';
   heading.dataset.groupHeading=group;
   heading.textContent=groupLabels[group]||group;
   catalogGrid.appendChild(heading);
   previousGroup=group;
  }
  const indexLabel=card.querySelector('.catalog-top>span');
  if(indexLabel)indexLabel.textContent=String(index+1).padStart(2,'0')+' / '+group.toUpperCase();
  catalogGrid.appendChild(card);
 });
}

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
 document.querySelectorAll('[data-group-heading]').forEach(heading=>{
  heading.hidden=filter!=='all'&&heading.dataset.groupHeading!==filter;
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
  specs:[["噴灑半徑","4.9–14.0 m"],["流量範圍","1.2–53.8 L/min"],["建議工作壓力","約 1.7–4.8 bar（25–70 PSI）"],["可調角度","50°–360°"],["進水口徑","3/4 吋"],["噴嘴選擇","多種標準及低仰角噴嘴"],["彈出高度","依 PGP-00／04／06／12 型式不同"],["保固","原廠標示 5 年"]],
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
  specs:[["管徑","16 mm"],["滴頭流量","1.4、2.2 或 3.8 L/h（依型號）"],["滴頭間距","30 或 50 cm（依型號）"],["工作壓力範圍","1.0–3.5 bar"],["過濾需求","最低 120 mesh（約 125 μm）"],["產品特性","壓力補償滴頭；CV 型具止回／防排空功能"],["常見型號編碼","PLD-22／PLD-38，搭配間距與捲長選項"],["保固","原廠標示 5 年"]],
  note:"以上依 Hunter PLD 16 mm 型錄資料整理。不同年份／地區型錄的流量與間距選項可能不同，訂貨前請依實際料號核對。",
  url:"https://www.hunterindustries.com/sites/default/files/Hunter_Catalog_EM.pdf",source:"Hunter 官方產品型錄（PLD 16 mm）"
 },
 piping:{
  brand:"TORO",name:"Toro Pro-Loc Tape Coupling 滴灌帶直通接頭",model:"FTC800",
  intro:"Pro-Loc 系列滴灌帶接頭，FTC800 為 1 吋滴灌帶用直通接頭，適合滴灌帶連接。",
  specs:[["原廠型號","FTC800"],["接頭型式","Coupling（直通接頭）"],["側 1 規格","1 吋 Tape"],["側 2 規格","1 吋 Tape"],["適用管材","Drip Tape（滴灌帶）"],["產品特點","粗牙旋帽密封、易握持安裝、低外型設計"]],
  note:"此頁為 FTC800 單一接頭型號規格；Toro Pro-Loc 另有不同管帶尺寸與接頭形式，請勿將 FTC800 規格套用至其他型號。",
  url:"https://www.toro.com/en/product/FTC800",source:"Toro FTC800 官方產品頁"
 },
 rainbird_sprinkler:{brand:"RAIN BIRD",name:"Rain Bird 5004 Professional Grade Rotor",model:"5004（5000 Series）",intro:"齒輪驅動式地埋旋轉噴頭，適用草坪及中型景觀區域；射程及流量依噴嘴與工作壓力而變化。",specs:[["噴灑半徑","約 7.6–15.2 m（25–50 ft）"],["工作壓力","1.7–4.5 bar（25–65 psi）"],["流量範圍","約 4.2–36.6 L/min（依噴嘴）"],["可調角度","40°–360°"],["進水口徑","3/4 吋 NPT 內牙，底部進水"],["彈出高度","約 10.2 cm（4 吋）"],["降雨強度","約 5–26 mm/h（依噴嘴及間距）"]],note:"射程、流量及降雨強度受噴嘴、壓力及配置影響，設計時應依原廠噴嘴性能表選型。",url:"https://www.rainbird.com/products/5004-professional-grade-rotor-info",source:"Rain Bird 5004 官方產品規格"},
 toro_sprinkler:{brand:"TORO",name:"Toro 570Z Series 地埋式散射噴頭",model:"570Z／570ZLP（不同彈出高度及選配型式）",intro:"適用小至中型景觀區域。噴頭本體需搭配適當噴嘴；不同選配型式規格不可混用。",specs:[["噴灑半徑","約 0.6–7.9 m（2–26 ft）"],["流量範圍","約 0.2–17.0 L/min（依噴嘴）"],["建議操作壓力","約 1.7–3.4 bar（25–50 PSI）"],["壓力調節型式","部分型式具 riser 內建壓力調節器，可維持約 2.1 bar（30 PSI）出水壓力"],["進水口徑","1/2 吋 NPT 內牙"],["彈出高度","2、3、4、6、12 吋"],["選配功能","止回閥（最高約 3 m 高差，依型式）；側進水型"],["保固","570Z／570ZLP 一般型原廠資料標示 2 年；其他型式依原廠條件"]],note:"PR、PRX、XF、COM 等選配型式可能改變壓力、流量或止回功能，採購時須核對完整型號。",url:"https://www.toro.com/en/product/570Z-Series",source:"Toro 570Z 官方產品規格"},
 rainbird_valve:{brand:"RAIN BIRD",name:"Rain Bird 100-DV／100-DVF 電磁閥",model:"100-DV（無流量控制）／100-DVF（含流量控制），1 吋",intro:"常閉式膜片電磁閥，用於自動灌溉分區控制；DVF 型具手動流量控制功能。",specs:[["口徑／接頭","1 吋 NPT 內牙 × 內牙（另有其他接頭版本）"],["流量範圍","約 0.75–151 L/min（0.2–40 GPM；依型號及壓損）"],["操作壓力","1.0–10.4 bar（15–150 psi）"],["線圈電源","24 VAC，50/60 Hz"],["線圈電流","啟動 0.30 A；保持 0.23 A（100-DV）"],["線圈電阻","約 38 Ω"],["尺寸（100-DV）","約高 11.4 × 長 11.1 × 寬 8.4 cm"],["低流量／滴灌","低流量或滴灌用途，原廠要求上游加裝 200 mesh 過濾器"]],note:"100-DV 與 100-DVF 主要差異為是否具流量控制。低流量及景觀滴灌用途需依原廠建議設置 200 mesh 上游過濾，並檢核實際閥門壓損。",url:"https://www.rainbird.com/products/dvdvf-series",source:"Rain Bird DV／DVF 官方產品規格"},
 toro_valve:{brand:"TORO",name:"Toro 252 Series 商用灌溉電磁閥",model:"252 Series，以下列 1 吋電磁型為例",intro:"商用灌溉用閥，提供直通及角式配置，並具手動流量控制；另有 1½ 吋、2 吋型式。",specs:[["可選口徑","1、1½、2 吋；NPT／BSP 依型式"],["1 吋建議流量","18.9–94.6 L/min（5–25 GPM）"],["操作壓力","約 1.3–10.3 bar（20–150 psi）"],["線圈電源","24 VAC，50/60 Hz"],["線圈電流","啟動 0.30 A（7.2 VA）；保持 0.20 A（4.8 VA）"],["1 吋外型尺寸","約高 17.1 × 寬 11.4 cm"],["閥體配置","Globe／Angle；具手動流量控制"],["耐壓安全值","51.7 bar（750 psi）爆破壓力安全額定值"]],note:"流量表採 Toro 252 系列 1 吋建議範圍，不應套用至 1½ 吋或 2 吋型號。",url:"https://www.toro.com/en/product/252-Series-Valves",source:"Toro 252 Series 官方產品頁及規格表"},
 rainbird_drip:{brand:"RAIN BIRD",name:"Rain Bird XFD On-Surface Dripline",model:"XFD／XFDP／XFDPS 系列，16 mm 地表滴灌管",intro:"壓力補償式滴灌管，適用地被、密植植栽及綠籬；依流量、間距、顏色及捲長選擇料號。",specs:[["外徑","約 16.1 mm"],["內徑","約 13.6 mm"],["管壁厚度","約 1.2 mm"],["滴頭流量","2.3 或 3.5 L/h（0.6／0.9 GPH）"],["滴頭間距","30.5 或 45.7 cm（12／18 吋）"],["操作壓力","約 0.58–4.1 bar（8.5–60 psi）"],["過濾需求","120 mesh"],["常見捲長","約 30.5、76.2、152.4 m（100、250、500 ft）"]],note:"XFD 為地表滴灌系列；若埋設於地下，需依原廠建議搭配空氣／真空洩壓閥組及適用型號。",url:"https://www.rainbird.com/products/xfd-surface-dripline",source:"Rain Bird XFD 官方產品規格"},
 toro_drip:{brand:"TORO",name:"Toro DL2000 Subsurface Dripline",model:"DL2000 壓力補償地下滴灌管",intro:"具 ROOTGUARD 根系入侵防護的壓力補償滴灌管，可地下埋設或地表安裝後覆蓋，將水直接供應至根域。",specs:[["公稱尺寸","5/8 吋；外徑約 18 mm、內徑約 16 mm"],["管壁厚度","約 1.0 mm（0.045 吋）"],["滴頭流量","約 1.9 或 3.8 L/h（0.5／1.0 GPH）"],["滴頭間距","30.5 或 45.7 cm（12／18 吋）"],["工作壓力","請依實際 DL2000 料號及原廠設計指南確認"],["過濾需求","120 mesh"],["捲長","約 31、150、305 m（100、500、1,000 ft）"],["產品特性","壓力補償、自清洗滴頭、ROOTGUARD 根系防護"],["保固","根系入侵防護 7 年；管材 5 年按比例保固（依原廠條件）"]],note:"DL2000 為 Toro 地下滴灌產品，與地表 Drip In 系列不同。埋設深度、側向間距、沖洗端及排氣／洩壓配置應依場地土壤與原廠設計指南確認。",url:"https://www.toro.com/en/product/DL2000-Series-Subsurface-Dripline",source:"Toro DL2000 官方產品規格"},
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


/* Independent portfolio photo carousels: rotate each 3-photo group every 30 seconds */
document.querySelectorAll('.portfolio-image[data-carousel]').forEach(gallery=>{
 const slides=[...gallery.querySelectorAll('img')];
 if(!slides.length)return;
 let current=0;
 slides.forEach((slide,index)=>slide.classList.toggle('is-active',index===0));
 gallery.classList.add('is-ready');
 if(slides.length<2||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 window.setInterval(()=>{
  slides[current].classList.remove('is-active');
  current=(current+1)%slides.length;
  slides[current].classList.add('is-active');
 },30000);
});
