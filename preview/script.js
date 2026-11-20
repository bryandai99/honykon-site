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
const groupLabels={sprinkler:'隱藏式噴頭',valve:'電磁閥',drip:'滴灌管',control:'智慧控制器',piping:'管材與配件'};
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

const filterNames={all:'全部產品',control:'控制器',sprinkler:'隱藏式噴頭',valve:'電磁閥',drip:'滴灌微噴',piping:'管材配件'};
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
 hunter_miniclik:{
  brand:"HUNTER",name:"Hunter Mini-Clik 雨水感知器",model:"MINI-CLIK（有線型）",
  intro:"有線式雨水感知器，降雨達到設定門檻時中斷自動灌溉控制器的排程；雨水感知器乾燥復位後，控制器恢復正常排程。適用於支援常開／常閉雨感輸入的灌溉控制器。",
  specs:[["感測設定範圍","約 3–19 mm（1/8–3/4 吋）降雨量可調"],["感測／控制方式","雨量感測後以開關接點中斷灌溉控制"],["接線","有線型，附約 7.5 m、雙芯 UL 認證電纜"],["開關額定","24 VAC，3 A（Hunter 產品頁列示）"],["相容性","支援常開（NO）或常閉（NC）雨感輸入的多數灌溉控制器"],["安裝","附鋁合金安裝支架；可另選排水溝固定配件"],["保固","原廠標示 5 年"]],
  note:"本卡採用 MINI-CLIK 有線型作為雨水感知器代表型號。Hunter 另有 WM-CLIK 無線型；有線／無線版本的配件與規格不同，採購前須確認控制器端子及現場佈線。產品照片來源：Hunter Industries（Photo courtesy of Hunter Industries）。",
  url:"https://www.hunterirrigation.com/irrigation-product/sensors/mini-clikr-sensor",source:"Hunter Mini-Clik 官方產品頁及規格"
 },
 yiu_a113w:{
  brand:"育材 YIU TSAY",name:"WiFi 澆水定時器",model:"A113W（電池版／插電版／太陽能充電款）",
  intro:"水龍頭式自動澆水定時器，內部以球閥控制水路；可使用手機 App 設定澆水排程，也保留機身旋鈕操作。此產品是水龍頭端球閥定時器，並非 24 VAC 多區電磁閥控制器。",
  specs:[["控制方式","2.4 GHz Wi-Fi App 遠端管理；機身旋鈕操作；最多 6 組 App 排程，另有 1 組旋鈕簡易設定"],["閥門／輸出","內建球閥直接啟閉水路；非外接 24 VAC 電磁閥輸出"],["電池版電源","2 顆 AA 鹼性電池；原廠建議勿使用充電電池及碳鋅電池"],["插電版電源","外接變壓器供電；原廠標示變壓器線長約 135 cm，可另裝鹼性電池作備援"],["太陽能款電源","太陽能充電板為主要供電，內含 LiFePO4 蓄電池；供電不足時自動切換鹼性電池備援"],["Wi-Fi 規格","IEEE 802.11 b/g/n，2.4 GHz；需在 Wi-Fi 環境下使用遠端功能"],["離線操作","無 Wi-Fi 時可使用機身旋鈕；A113W 配對時亦可選手機直連設定，但無遠端監控及多人管理"],["連線頻率","可設定每 1、2、4 或 24 小時連線一次；太陽能供電時每分鐘連線，備援電池模式每小時連線"],["雨天停水","Wi-Fi 機出廠標配雨天停水器"],["建議水壓","原廠建議約 0.2–3 kg/cm²；勿超過 5 kg/cm²"],["保固","原廠保固 1 年"]],
  note:"電池版續航依連線頻率、使用環境及電池品質而異；原廠頁面不同段落對續航描述有不同條件，故不在此承諾固定使用月數。插電版變壓器請避免戶外淋雨。供電與連線頻率依所選版本確認。",
  url:"https://www.yiu.com.tw/product.php?gid=14c0bac9-687b-11ec-b05f-d094665befc6",source:"育材模型官方產品頁（A113W）"
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
 kingtech_47_03_dn100:{
  brand:"寶閥精密工業 KINGTECH",name:"4 吋 47 型不鏽鋼持壓、背壓閥",model:"47-03／DN100（4 吋法蘭型；不鏽鋼閥體選項）",
  intro:"Pilot 液壓控制隔膜閥，可作持壓閥或背壓閥使用。當閥門入口壓力超過 Pilot 設定值時，閥門開啟釋放壓力；壓力降低後緩慢關閉。這是持壓／背壓控制閥，不是一般彈簧式安全洩壓閥。",
  specs:[["產品型式","47-03 持壓、背壓閥"],["公稱口徑","DN100（4 吋）"],["閥體材質","球墨鑄鐵／不鏽鋼可選；本卡選列不鏽鋼閥體版本"],["連接方式","法蘭連接"],["法蘭規格","10K、16K、PN16、150LB"],["DN100 外形尺寸","L = 307 mm；H = 137 mm"],["DN100 重量","約 18 kg（原廠尺寸表）"],["Pilot 調壓範圍","1–4 bar 或 3–9 bar"],["適用介質／溫度","水；0–100°C"],["配管件材質","銅／不鏽鋼；依訂購配置"],["隔膜材質","NBR"]],
  note:"重要：原廠將此產品定義為持壓／背壓閥，透過 Pilot 控制上游壓力，不應直接視為一般安全洩壓閥。訂購時需確認閥體不鏽鋼材質牌號、壓力等級、法蘭標準、工作壓力及 Pilot 調壓範圍；原廠頁面未在此處明確列出不鏽鋼牌號。",
  url:"https://www.kingtech-sb.com/product/47%E5%9E%8B%E6%8C%81%E5%A3%93%E3%80%81%E8%83%8C%E5%A3%93%E9%96%A5/",source:"寶閥精密工業官方產品頁－47型持壓、背壓閥"
 },
 lianfu_lingen_6in:{
  brand:"良福企業",name:"6 吋林根不銹鋼濾水管",model:"6 吋標準型（V 型線捲線式）",
  intro:"林根 V 型線捲線式濾水管，主要用於深水井、環保觀測井、溫泉井及開挖降水工程。此品項為濾水管／集水管，不是灌溉系統常用的砂石或網式過濾器。",
  specs:[["公稱口徑","6 吋標準型"],["圓條直徑／數量","4.5 mm／28 條"],["梯線尺寸","寬 2.5 mm × 高 3.5 mm"],["管內徑","148.0 mm"],["管總長／有效長度","400 cm／388 cm"],["接頭長度","上端 120 mm；下端 60 mm"],["接頭固定環","40 mm"],["接頭外徑／厚度","165.2 mm／4.5 mm"],["材質說明","良福網站列有林根不銹鋼濾水管工程實績；本規格表未逐項標示鋼種，SUS304 等級須依報價及材質證明確認"]],
  note:"以上尺寸取自良福企業 6 吋標準型材料規格。網站亦列有 8 吋、10 吋及其他尺寸；實際開口率、線距與出水量需依設計條件另行核算。用途為井用濾水／集水，不應誤認為灌溉管線的 6 吋過濾器。",
  url:"https://www.lianfu-tw.com/tech03.php",source:"良福企業－林根濾水管材料規格"
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
 rainbird_valve:{brand:"RAIN BIRD",name:"Rain Bird 100-DV／100-DVF 電磁閥",model:"100-DV（無流量控制）／100-DVF（含流量控制），1 吋",intro:"常閉式膜片電磁閥，用於自動灌溉分區控制；DVF 型具手動流量控制功能。",specs:[["口徑／接頭","1 吋 NPT 內牙 × 內牙（另有其他接頭版本）"],["流量範圍","約 0.75–151 L/min（0.2–40 GPM；依型號及壓損）"],["操作壓力","1.0–10.4 bar（15–150 psi）"],["線圈電源","24 VAC，50/60 Hz"],["線圈電流","啟動 0.45 A；保持 0.25 A（原廠 DV／DVF 系列規格）"],["線圈電阻","約 38 Ω"],["尺寸（100-DV）","約高 11.4 × 長 11.1 × 寬 8.4 cm"],["低流量／滴灌","低流量或滴灌用途，原廠要求上游加裝 200 mesh 過濾器"]],note:"100-DV 與 100-DVF 主要差異為是否具流量控制。低流量及景觀滴灌用途需依原廠建議設置 200 mesh 上游過濾，並檢核實際閥門壓損。",url:"https://www.rainbird.com/products/dvdvf-series",source:"Rain Bird DV／DVF 官方產品規格"},
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
