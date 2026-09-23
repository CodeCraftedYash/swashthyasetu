/* ================= SwasthyaSetu — shared shell, mock data, event bus ================= */

const RS_NAV = [
  { href:'index.html', label:'Home' },
  { href:'sos.html', label:'Emergency SOS' },
  { href:'severity.html', label:'Severity Check' },
  { href:'hospitals.html', label:'Hospital Availability' },
  { href:'qr-network.html', label:'QR Network' },
  { href:'ambulance.html', label:'Ambulance Tracking' },
  { href:'hospital-dashboard.html', label:'Hospital Dashboard' },
  { href:'doctor-availability.html', label:'Doctors' },
  { href:'icu-beds.html', label:'ICU & Beds' },
  { href:'alerts.html', label:'Alert Dashboard' },
];

/* ---------------- Mock data (shared "backend" via localStorage) ---------------- */
const RS_HOSPITALS = [
  { id:'H1', name:'Sanjeevani General Hospital', area:'Lalpur, Ranchi', distanceKm:1.8, level:'Level I Trauma', phone:'+91 651 220 1144',
    beds:{ general:{total:120,occupied:88}, icu:{total:24,occupied:19}, ventilator:{total:10,occupied:6}, pediatric:{total:18,occupied:9} },
    specialties:['Trauma','Cardiology','Neurology','Orthopaedics'], queue:14, avgWait:22, status:'available' },
  { id:'H2', name:'Kolhan Medical College Hospital', area:'Sakchi, Jamshedpur', distanceKm:3.4, level:'Level I Trauma', phone:'+91 657 244 5502',
    beds:{ general:{total:200,occupied:171}, icu:{total:30,occupied:29}, ventilator:{total:14,occupied:13}, pediatric:{total:26,occupied:14} },
    specialties:['Trauma','Burns','Cardiology','ICU'], queue:31, avgWait:47, status:'busy' },
  { id:'H3', name:'RIMS Emergency & Trauma Centre', area:'Bariatu, Ranchi', distanceKm:5.1, level:'Level I Trauma', phone:'+91 651 254 6006',
    beds:{ general:{total:260,occupied:255}, icu:{total:40,occupied:40}, ventilator:{total:18,occupied:18}, pediatric:{total:30,occupied:27} },
    specialties:['Trauma','Neurosurgery','Cardiology','Burns','Paediatrics'], queue:52, avgWait:70, status:'full' },
  { id:'H4', name:'Tata Main Hospital', area:'Northern Town, Jamshedpur', distanceKm:6.7, level:'Level II', phone:'+91 657 271 2143',
    beds:{ general:{total:150,occupied:96}, icu:{total:20,occupied:11}, ventilator:{total:8,occupied:3}, pediatric:{total:16,occupied:6} },
    specialties:['Cardiology','Orthopaedics','General Surgery'], queue:9, avgWait:15, status:'available' },
  { id:'H5', name:"St. Xavier's Care Hospital", area:'Doranda, Ranchi', distanceKm:8.2, level:'Level II', phone:'+91 651 229 3311',
    beds:{ general:{total:90,occupied:52}, icu:{total:14,occupied:8}, ventilator:{total:6,occupied:2}, pediatric:{total:10,occupied:3} },
    specialties:['General Surgery','Gynaecology','Orthopaedics'], queue:6, avgWait:12, status:'available' },
  { id:'H6', name:'Adityapur Community Hospital', area:'Adityapur, Jamshedpur', distanceKm:11.4, level:'Level III', phone:'+91 657 238 7790',
    beds:{ general:{total:60,occupied:41}, icu:{total:8,occupied:6}, ventilator:{total:4,occupied:3}, pediatric:{total:8,occupied:2} },
    specialties:['General Medicine','Orthopaedics'], queue:11, avgWait:20, status:'available' },
];

const RS_DOCTORS = [
  { id:'D1', name:'Dr. A. Verma', dept:'Emergency Medicine', hospital:'H1', status:'available', servingToken:214, nextFreeSlot:'Now' },
  { id:'D2', name:'Dr. S. Kujur', dept:'Cardiology', hospital:'H1', status:'in-surgery', servingToken:208, nextFreeSlot:'12:40 PM' },
  { id:'D3', name:'Dr. R. Mahato', dept:'Orthopaedics', hospital:'H1', status:'available', servingToken:219, nextFreeSlot:'Now' },
  { id:'D4', name:'Dr. P. Iqbal', dept:'Neurology', hospital:'H2', status:'busy', servingToken:301, nextFreeSlot:'1:15 PM' },
  { id:'D5', name:'Dr. M. Toppo', dept:'Paediatrics', hospital:'H2', status:'available', servingToken:296, nextFreeSlot:'Now' },
  { id:'D6', name:'Dr. K. Bose', dept:'General Surgery', hospital:'H4', status:'on-leave', servingToken:null, nextFreeSlot:'Tomorrow, 9:00 AM' },
  { id:'D7', name:'Dr. N. Horo', dept:'Emergency Medicine', hospital:'H5', status:'available', servingToken:118, nextFreeSlot:'Now' },
  { id:'D8', name:'Dr. T. Ansari', dept:'Cardiology', hospital:'H4', status:'available', servingToken:142, nextFreeSlot:'Now' },
];

const RS_AMBULANCES = [
  { id:'JH01-AMB-2214', driver:'Suresh Oraon', phone:'+91 98765 43210', type:'ALS (Advanced Life Support)', base:'Lalpur Station', status:'idle' },
  { id:'JH01-AMB-3387', driver:'Birsa Munda', phone:'+91 98765 11209', type:'BLS (Basic Life Support)', base:'Sakchi Station', status:'idle' },
  { id:'JH05-AMB-0091', driver:'Anjali Devi', phone:'+91 98765 88342', type:'ALS (Advanced Life Support)', base:'Bariatu Station', status:'idle' },
];

/* ---------------- localStorage-backed "live" event bus ---------------- */
const RS_DB_KEY = 'swasthyasetu_alerts_v1';

function rsGetAlerts(){
  try { return JSON.parse(localStorage.getItem(RS_DB_KEY)) || []; } catch(e){ return []; }
}
function rsSaveAlerts(list){
  localStorage.setItem(RS_DB_KEY, JSON.stringify(list));
  // notify other same-page listeners immediately (storage event only fires in OTHER tabs)
  window.dispatchEvent(new CustomEvent('rs-alerts-updated', { detail:list }));
}
function rsAddAlert(alert){
  const list = rsGetAlerts();
  list.unshift(alert);
  rsSaveAlerts(list.slice(0,25));
  return alert;
}
function rsUpdateAlert(id, patch){
  const list = rsGetAlerts().map(a => a.id === id ? {...a, ...patch} : a);
  rsSaveAlerts(list);
}
function rsSeedAlertsIfEmpty(){
  if (rsGetAlerts().length) return;
  rsSaveAlerts([
    { id:'ALT-1042', time: rsNowMinus(6), lat:23.377, lng:85.334, severity:'Critical', note:'Two-vehicle collision, one unconscious', hospital:'Sanjeevani General Hospital', ambulance:'JH01-AMB-2214', status:'Ambulance en route', reporter:'Bystander call' },
    { id:'ALT-1041', time: rsNowMinus(19), lat:22.804, lng:86.203, severity:'Serious', note:'Fall from height, suspected fracture', hospital:'Tata Main Hospital', ambulance:'JH01-AMB-3387', status:'Patient admitted', reporter:'App SOS' },
    { id:'ALT-1040', time: rsNowMinus(41), lat:23.350, lng:85.309, severity:'Moderate', note:'Road-side chest pain, conscious', hospital:"St. Xavier's Care Hospital", ambulance:'—', status:'Resolved', reporter:'App SOS' },
  ]);
}
function rsNowMinus(mins){ return Date.now() - mins*60000; }
function rsTimeAgo(ts){
  const m = Math.round((Date.now()-ts)/60000);
  if (m < 1) return 'just now';
  if (m < 60) return m+' min ago';
  return Math.round(m/60)+' hr ago';
}
function rsId(prefix){ return prefix+'-'+Math.floor(1000+Math.random()*9000); }

/* ---------------- Toast ---------------- */
function rsToast(title, msg, type){
  let stack = document.getElementById('toast-stack');
  if(!stack){
    stack = document.createElement('div');
    stack.id = 'toast-stack';
    document.body.appendChild(stack);
  }
  const el = document.createElement('div');
  el.className = 'toast' + (type ? ' '+type : '');
  el.innerHTML = `<div><b>${title}</b>${msg}</div>`;
  stack.appendChild(el);
  setTimeout(()=>{ el.style.transition='opacity .3s'; el.style.opacity='0'; setTimeout(()=>el.remove(),300); }, 4500);
}

/* ---------------- Unified shell (logo, nav, language, mobile behavior) ---------------- */
const RS_LOGO=`<span class="brand-mark" aria-hidden="true"><svg width="21" height="21" viewBox="0 0 24 24" fill="none"><path d="M12 2.8c5.5 0 9.2 2.2 9.2 6.9 0 5.9-4.9 9.5-9.2 11.5C7.7 19.2 2.8 15.6 2.8 9.7 2.8 5 6.5 2.8 12 2.8Z" fill="white"/><path d="M10.2 6.2h3.6v3.9h3.9v3.6h-3.9v3.9h-3.6v-3.9H6.3v-3.6h3.9V6.2Z" fill="#0E9E88"/></svg></span>`;
const RS_LANG_KEY='swasthyasetu_lang';
const RS_I18N={
 'Home':'होम','Emergency SOS':'आपातकालीन SOS','Severity Check':'गंभीरता जांच','Hospital Availability':'अस्पताल उपलब्धता','QR Network':'क्यूआर नेटवर्क','Ambulance Tracking':'एम्बुलेंस ट्रैकिंग','Hospital Dashboard':'अस्पताल डैशबोर्ड','Doctors':'डॉक्टर','ICU & Beds':'आईसीयू और बेड','Alert Dashboard':'अलर्ट डैशबोर्ड','Responder Login':'रिस्पॉन्डर लॉगिन','Get Help Now':'अभी सहायता पाएं','SwasthyaSetu':'स्वास्थ्यसेतु','Emergency Care Network':'आपातकालीन देखभाल नेटवर्क',
 'Main Navigation':'मुख्य नेविगेशन','Emergency':'आपातकाल','System Status':'सिस्टम स्थिति','All Systems Operational':'सभी सिस्टम सक्रिय','Search':'खोजें','Open':'उपलब्ध','Busy':'व्यस्त','Full':'पूर्ण',
 'Send Emergency SOS':'आपातकालीन SOS भेजें','Check Hospital Availability':'अस्पताल उपलब्धता देखें','Patients & the public':'मरीज और आम जनता','Hospital staff':'अस्पताल स्टाफ','Police & responders':'पुलिस और रिस्पॉन्डर','All modules':'सभी मॉड्यूल','Everything on the grid.':'नेटवर्क पर सब कुछ।',
 'Doctor Availability':'डॉक्टर उपलब्धता','ICU & Bed Availability':'आईसीयू और बेड उपलब्धता','Ambulance Tracking':'एम्बुलेंस ट्रैकिंग','Emergency Alert Dashboard':'आपातकालीन अलर्ट डैशबोर्ड','Live':'लाइव','available':'उपलब्ध','busy':'व्यस्त','full':'पूर्ण','in-surgery':'सर्जरी में','on-leave':'छुट्टी पर','Now':'अभी','Tomorrow':'कल'
};
function rsLang(){return localStorage.getItem(RS_LANG_KEY)==='hi'?'hi':'en'}
function rsToggleLanguage(){localStorage.setItem(RS_LANG_KEY,rsLang()==='en'?'hi':'en');rsApplyLanguage()}
function rsTranslateTextNode(node){if(node.nodeType!==Node.TEXT_NODE)return;const raw=node.nodeValue;const t=raw.trim();if(!t)return;if(!node.parentElement||['SCRIPT','STYLE'].includes(node.parentElement.tagName))return; if(!node.__rs_en) node.__rs_en=raw; const lang=rsLang(); if(lang==='en'){node.nodeValue=node.__rs_en;return} let out=RS_I18N[t]||t.replace(/^[\s]+|[\s]+$/g,''); if(out!==t){node.nodeValue=raw.replace(t,out)} }
function rsApplyLanguage(){document.documentElement.lang=rsLang();document.querySelectorAll('[data-en]').forEach(e=>{const v=e.getAttribute('data-'+rsLang());if(v!==null)e.textContent=v});const btn=document.getElementById('rsLangBtn');if(btn){btn.textContent=rsLang()==='en'?'हिंदी':'English';btn.setAttribute('aria-label',rsLang()==='en'?'Switch to Hindi':'Switch to English')}document.querySelectorAll('body *').forEach(el=>{if(el.children.length===0&&el.tagName!=='SCRIPT'&&el.tagName!=='STYLE'&&el.firstChild)rsTranslateTextNode(el.firstChild)})}
function rsInitShell(activeHref){
 const navHtml=RS_NAV.map(n=>`<a href="${n.href}" class="${n.href===activeHref?'active':''}" data-en="${n.label}" data-hi="${RS_I18N[n.label]||n.label}">${n.label}</a>`).join('');
 const topbar=document.createElement('header');topbar.className='topbar';topbar.innerHTML=`<div class="topbar-inner"><a href="index.html" class="brand">${RS_LOGO}<span>SwasthyaSetu<small data-en="Emergency Care Network" data-hi="आपातकालीन देखभाल नेटवर्क">Emergency Care Network</small></span></a><nav class="nav-links">${navHtml}</nav><div class="nav-role"><button id="rsLangBtn" class="lang-btn" onclick="rsToggleLanguage()">हिंदी</button><a href="../index.html" class="btn btn-ghost btn-sm">← <span data-en="Main Dashboard" data-hi="मुख्य डैशबोर्ड">Main Dashboard</span></a><a href="alerts.html" class="btn btn-outline btn-sm">Responder Login</a></div></div>`;
 document.body.prepend(topbar);
 if(activeHref!=='sos.html'){const sos=document.createElement('a');sos.href='sos.html';sos.className='sos-float';sos.innerHTML='<span class="dot"></span> <span data-en="SOS — Get Help Now" data-hi="SOS — अभी सहायता पाएं">SOS — Get Help Now</span>';document.body.appendChild(sos)}
 const stack=document.createElement('div');stack.id='toast-stack';document.body.appendChild(stack);
 const foot=document.createElement('footer');foot.innerHTML='<div class="container"><p data-en="SwasthyaSetu — unified emergency care network prototype. Not a real dispatch service." data-hi="स्वास्थ्यसेतु — एकीकृत आपातकालीन देखभाल नेटवर्क प्रोटोटाइप। यह वास्तविक डिस्पैच सेवा नहीं है।">SwasthyaSetu — unified emergency care network prototype. Not a real dispatch service.</p><p class="mono">Jharkhand Emergency Grid · Demo build</p></div>';document.body.appendChild(foot);
 rsApplyLanguage();
}
document.addEventListener('DOMContentLoaded',()=>{rsSeedAlertsIfEmpty();rsApplyLanguage()});
