
/* ---- Consistent voice picker: ALWAYS prefers a female voice; remembers the pick so it never flips between male/female ---- */
window.SS_PICK_VOICE=window.SS_PICK_VOICE||function(voices,wantLang){
 try{
  voices=(voices||[]).filter(v=>v&&v.lang);
  const base=String(wantLang||'en').split('-')[0].toLowerCase();
  const norm=v=>v.lang.replace('_','-').toLowerCase();
  const MALE=/(^|[^a-z])(male|man)([^a-z]|$)|hemant|ravi\b|prabhat|rishi|madhur|manohar|sagar|mohan|david|mark\b|james|george|daniel|\bguy\b|ryan|alex\b|fred\b|bruce|liam|thomas|rocko|eddy|reed|arthur|gordon|aaron|ravi/i;
  const FEMALE=/female|woman|zira|heera|kalpana|swara|neerja|aarohi|hazel|susan|samantha|karen|veena|lekha|priya|raveena|tessa|moira|fiona|serena|aria|jenny|sonia|libby|natasha|emma|sara\b|shruti|kajal|pallavi|google \u0939\u093f\u0928\u094d\u0926\u0940|google hindi|google us english|google uk english female|google \u092e\u0930\u093e\u0920\u0940/i;
  let pool=voices.filter(v=>norm(v).split('-')[0]===base);
  if(!pool.length) pool=voices.filter(v=>norm(v).split('-')[0]==='en'); // no voice for this language at all -> a female English voice
  if(!pool.length) return null;
  let saved=''; try{saved=localStorage.getItem('ss_voice_'+base)||''}catch(e){}
  const score=v=>{let s=0;const n=v.name||'';
   if(FEMALE.test(n))s+=10; if(MALE.test(n)&&!/female/i.test(n))s-=12;
   if(norm(v)===String(wantLang).toLowerCase())s+=3;
   if(/google|microsoft|natural|online/i.test(n))s+=1;
   if(n===saved)s+=6; return s};
  pool.sort((a,b)=>score(b)-score(a)||String(a.name).localeCompare(String(b.name)));
  const pick=pool[0]; try{localStorage.setItem('ss_voice_'+base,pick.name)}catch(e){}
  return pick;
 }catch(e){return null}
};

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


/* ---------------- Nearest-hospital finder (real GPS -> real hospitals) ---------------- */
const RS_KNOWN_FACILITIES=[
 {name:'Tata Main Hospital',address:'C Road, Bistupur, Jamshedpur, Jharkhand',lat:22.8080,lng:86.1853,phone:'+91 657 271 2143'},
 {name:'MGM Medical College Hospital',address:'Sakchi, Jamshedpur, Jharkhand',lat:22.8060,lng:86.2025},
 {name:'Mango PHC',address:'Mango, Jamshedpur, Jharkhand',lat:22.8552,lng:86.2167},
 {name:'Parsudih CHC',address:'Parsudih, Jamshedpur, Jharkhand',lat:22.7877,lng:86.2495},
 {name:'RIMS Emergency & Trauma Centre',address:'Bariatu, Ranchi, Jharkhand',lat:23.3947,lng:85.3815},
 {name:"St. Xavier's Care Hospital",address:'Doranda, Ranchi, Jharkhand',lat:23.3441,lng:85.3096}];
function rsHaversine(a,b,c,d){const R=6371,r=x=>x*Math.PI/180,dl=r(c-a),dn=r(d-b),h=Math.sin(dl/2)**2+Math.cos(r(a))*Math.cos(r(c))*Math.sin(dn/2)**2;return R*2*Math.asin(Math.sqrt(h))}
async function rsOverpass(lat,lng,rad){
 const q='[out:json][timeout:12];(node["amenity"="hospital"](around:'+rad+','+lat+','+lng+');way["amenity"="hospital"](around:'+rad+','+lat+','+lng+');relation["amenity"="hospital"](around:'+rad+','+lat+','+lng+'););out center tags 60;';
 for(const ep of ['https://overpass-api.de/api/interpreter','https://overpass.kumi.systems/api/interpreter']){
  try{const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),9000);
   const res=await fetch(ep,{method:'POST',body:'data='+encodeURIComponent(q),headers:{'Content-Type':'application/x-www-form-urlencoded'},signal:ctl.signal});
   clearTimeout(t);if(!res.ok)continue;const j=await res.json();return j.elements||[];}catch(e){}
 } return null;
}
async function rsFindNearestHospitals(lat,lng,limit){
 limit=limit||4;
 try{if(window.SS_MAPS&&SS_MAPS.hasKey()){const l=await SS_MAPS.findNearestHospitals(lat,lng,{limit});if(l&&l.length)return l.map(h=>({...h,source:'Google Places (live)'}))}}catch(e){}
 for(const rad of [6000,20000,60000]){
  const els=await rsOverpass(lat,lng,rad); if(els===null)break;
  const seen=new Set();
  const list=els.map(e=>{const la=e.lat!=null?e.lat:(e.center&&e.center.lat),lo=e.lon!=null?e.lon:(e.center&&e.center.lon),t=e.tags||{},name=t['name:en']||t.name;
   if(la==null||lo==null||!name)return null;
   return{name,address:[t['addr:street'],t['addr:suburb']||t['addr:city']].filter(Boolean).join(', ')||t['addr:full']||'',lat:la,lng:lo,phone:t.phone||t['contact:phone']||'',emergency:t.emergency==='yes',distanceKm:Math.round(rsHaversine(lat,lng,la,lo)*10)/10,source:'OpenStreetMap (live)'}})
   .filter(Boolean).filter(h=>{const k=h.name.toLowerCase();if(seen.has(k))return false;seen.add(k);return true}).sort((a,b)=>a.distanceKm-b.distanceKm);
  if(list.length)return list.slice(0,limit);
 }
 return RS_KNOWN_FACILITIES.map(h=>({...h,distanceKm:Math.round(rsHaversine(lat,lng,h.lat,h.lng)*10)/10,source:'Built-in facility list (offline)'})).sort((a,b)=>a.distanceKm-b.distanceKm).slice(0,limit);
}
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
const RS_I18N_MR={'Home':'मुख्यपृष्ठ','Emergency SOS':'आणीबाणी SOS','Severity Check':'गंभीरता तपासणी','Hospital Availability':'रुग्णालय उपलब्धता','QR Network':'क्यूआर नेटवर्क','Ambulance Tracking':'रुग्णवाहिका ट्रॅकिंग','Hospital Dashboard':'रुग्णालय डॅशबोर्ड','Doctors':'डॉक्टर','ICU & Beds':'आयसीयू आणि बेड','Alert Dashboard':'अलर्ट डॅशबोर्ड','Responder Login':'रिस्पॉन्डर लॉगिन','Get Help Now':'आत्ता मदत मिळवा','Emergency Care Network':'आणीबाणी सेवा नेटवर्क','Emergency':'आणीबाणी','Search':'शोधा','Open':'उपलब्ध','Busy':'व्यस्त','Full':'भरलेले','Live':'लाइव्ह','available':'उपलब्ध','busy':'व्यस्त','full':'भरलेले','Now':'आत्ता','Tomorrow':'उद्या','Send Emergency SOS':'आणीबाणी SOS पाठवा','Check Hospital Availability':'रुग्णालय उपलब्धता पहा','Doctor Availability':'डॉक्टर उपलब्धता','ICU & Bed Availability':'आयसीयू आणि बेड उपलब्धता','Emergency Alert Dashboard':'आणीबाणी अलर्ट डॅशबोर्ड'};
function rsLang(){const l=localStorage.getItem(RS_LANG_KEY);return ['en','hi','mr'].includes(l)?l:'en'}
function rsSetLanguage(l){if(!['en','hi','mr'].includes(l))return;const ch=l!==rsLang();localStorage.setItem(RS_LANG_KEY,l);try{speechSynthesis.cancel()}catch(e){}if(ch)sessionStorage.setItem('ssLangAnnounce','1');if(ch)location.reload();else rsApplyLanguage()}
function rsToggleLanguage(){const o=['en','hi','mr'];rsSetLanguage(o[(o.indexOf(rsLang())+1)%3])}
function rsTranslateTextNode(node){if(node.nodeType!==Node.TEXT_NODE)return;const raw=node.nodeValue;const t=raw.trim();if(!t)return;if(!node.parentElement||['SCRIPT','STYLE'].includes(node.parentElement.tagName))return; if(!node.__rs_en) node.__rs_en=raw; const lang=rsLang(); if(lang==='en'||(lang==='mr'&&!RS_I18N_MR[t])){node.nodeValue=node.__rs_en;return} let out=(lang==='mr'?RS_I18N_MR:RS_I18N)[t]||t.replace(/^[\s]+|[\s]+$/g,''); if(out!==t){node.nodeValue=raw.replace(t,out)} }
function rsApplyLanguage(){document.documentElement.lang=rsLang();document.querySelectorAll('[data-en]').forEach(e=>{const v=e.getAttribute('data-'+rsLang());if(v!==null)e.textContent=v});document.querySelectorAll('.lang-opt').forEach(b=>{const on=b.dataset.l===rsLang();b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});document.querySelectorAll('body *').forEach(el=>{if(el.children.length===0&&el.tagName!=='SCRIPT'&&el.tagName!=='STYLE'&&el.firstChild)rsTranslateTextNode(el.firstChild)})}
function rsInitShell(activeHref){
 const navHtml=RS_NAV.map(n=>`<a href="${n.href}" class="${n.href===activeHref?'active':''}" data-en="${n.label}" data-hi="${RS_I18N[n.label]||n.label}" data-mr="${RS_I18N_MR[n.label]||n.label}">${n.label}</a>`).join('');
 const topbar=document.createElement('header');topbar.className='topbar';topbar.innerHTML=`<div class="topbar-inner"><a href="index.html" class="brand">${RS_LOGO}<span>SwasthyaSetu<small data-en="Emergency Care Network" data-hi="आपातकालीन देखभाल नेटवर्क">Emergency Care Network</small></span></a><nav class="nav-links">${navHtml}</nav><div class="nav-role"><div class="lang-switch" role="group" aria-label="Language"><button type="button" class="lang-opt" data-l="en" onclick="rsSetLanguage('en')">EN</button><button type="button" class="lang-opt" data-l="hi" onclick="rsSetLanguage('hi')">हिं</button><button type="button" class="lang-opt" data-l="mr" onclick="rsSetLanguage('mr')">मरा</button></div><a href="../index.html" class="btn btn-ghost btn-sm">← <span data-en="Main Dashboard" data-hi="मुख्य डैशबोर्ड">Main Dashboard</span></a><a href="alerts.html" class="btn btn-outline btn-sm">Responder Login</a></div></div>`;
 document.body.prepend(topbar);
 if(activeHref!=='sos.html'){const sos=document.createElement('a');sos.href='sos.html';sos.className='sos-float';sos.innerHTML='<span class="dot"></span> <span data-en="SOS — Get Help Now" data-hi="SOS — अभी सहायता पाएं">SOS — Get Help Now</span>';document.body.appendChild(sos)}
 const stack=document.createElement('div');stack.id='toast-stack';document.body.appendChild(stack);
 const foot=document.createElement('footer');foot.innerHTML='<div class="container"><p data-en="SwasthyaSetu — unified emergency care network prototype. Not a real dispatch service." data-hi="स्वास्थ्यसेतु — एकीकृत आपातकालीन देखभाल नेटवर्क प्रोटोटाइप। यह वास्तविक डिस्पैच सेवा नहीं है।">SwasthyaSetu — unified emergency care network prototype. Not a real dispatch service.</p><p class="mono">Jharkhand Emergency Grid · Demo build</p></div>';document.body.appendChild(foot);
 rsApplyLanguage();
 rsAddVoiceAssistant();
}

/* ---------------- Voice assistant (mirrors the main app's assistant, paths adjusted
   for this emergency-network/ sub-folder so voice control keeps working here too) ---------------- */
function rsAddVoiceAssistant(){
 if(document.getElementById('ssVoiceBtn'))return;
 const SR_LANG_MAP={en:'en-IN',hi:'hi-IN',mr:'mr-IN'};
 function curLang(){const l=localStorage.getItem(RS_LANG_KEY);return ['en','hi','mr'].includes(l)?l:'en';}
 const T={
  greetFirst:{en:"Welcome to the Emergency Network. Tap the microphone and say what you need — like, find ambulance, or, main dashboard.",
   hi:"आपातकालीन नेटवर्क में आपका स्वागत है। माइक बटन दबाएं और बोलें — जैसे, एम्बुलेंस खोजो, या, मुख्य डैशबोर्ड।",
   mr:"आणीबाणी नेटवर्कमध्ये आपले स्वागत आहे. मायक्रोफोन दाबा आणि बोला — जसे, रुग्णवाहिका शोधा, किंवा, मुख्य डॅशबोर्ड."},
  langSet:{en:"Language changed to English. Replies will now be in English.",
   hi:"भाषा हिंदी कर दी गई है। अब जवाब हिंदी में मिलेंगे।",
   mr:"भाषा मराठी केली आहे. आता उत्तरे मराठीत मिळतील."},
  ask:{en:"What can I help you with?",hi:"मैं आपकी क्या मदद कर सकता हूँ?",mr:"मी तुम्हाला कशी मदत करू शकतो?"},
  listening:{en:"Listening…",hi:"सुन रहा हूँ…",mr:"ऐकत आहे…"},
  noSupport:{en:"Voice recognition is not supported in this browser. Please use Chrome/Edge and allow microphone access.",
   hi:"इस ब्राउज़र में वॉइस पहचान समर्थित नहीं है। कृपया Chrome/Edge इस्तेमाल करें और माइक्रोफ़ोन की अनुमति दें।",
   mr:"या ब्राउझरमध्ये आवाज ओळख समर्थित नाही. कृपया Chrome/Edge वापरा आणि मायक्रोफोन परवानगी द्या."},
  micFail:{en:"Microphone access was unavailable. You can still use the menu.",
   hi:"माइक्रोफ़ोन उपलब्ध नहीं हुआ। आप मेनू का उपयोग कर सकते हैं।",
   mr:"मायक्रोफोन उपलब्ध झाला नाही. तुम्ही मेनू वापरू शकता."},
  youSaid:{en:"You said: ",hi:"आपने कहा: ",mr:"तुम्ही म्हणालात: "},
  timeout:{en:"Didn't hear anything. Tap the mic and speak right after it turns on.",
   hi:"कुछ सुनाई नहीं दिया। माइक दबाने के तुरंत बाद बोलें।",
   mr:"काही ऐकू आले नाही. मायक्रोफोन दाबल्यानंतर लगेच बोला."},
  notAllowed:{en:"Microphone permission is blocked. Please allow microphone access for this site in your browser settings.",
   hi:"माइक्रोफ़ोन की अनुमति ब्लॉक है। कृपया ब्राउज़र सेटिंग्स में इस साइट के लिए माइक्रोफ़ोन एक्सेस दें।",
   mr:"मायक्रोफोन परवानगी अवरोधित आहे. कृपया ब्राउझर सेटिंग्जमध्ये या साइटसाठी मायक्रोफोन प्रवेश द्या."},
  networkErr:{en:"Voice recognition needs an internet connection. Please check your connection and try again.",
   hi:"वॉइस पहचान के लिए इंटरनेट ज़रूरी है। कृपया अपना कनेक्शन जांचें और फिर से कोशिश करें।",
   mr:"आवाज ओळखण्यासाठी इंटरनेट आवश्यक आहे. कृपया कनेक्शन तपासा आणि पुन्हा प्रयत्न करा."},
  notUnderstood:{en:"Sorry, I didn't get that. Try: ambulance, hospitals, doctors, ICU beds, SOS, alerts, or main dashboard.",
   hi:"माफ़ कीजिए, समझ नहीं आया। कोशिश करें: एम्बुलेंस, अस्पताल, डॉक्टर, आईसीयू बेड, SOS, अलर्ट, या मुख्य डैशबोर्ड।",
   mr:"माफ करा, समजले नाही. करून पहा: रुग्णवाहिका, रुग्णालय, डॉक्टर, आयसीयू बेड, SOS, अलर्ट, किंवा मुख्य डॅशबोर्ड."},
 };
 function tr(k){if(!T[k])return '';return T[k][curLang()]||T[k].en||'';}
 function speak(text, onDone){
  const MIN_READ_MS=1600;
  let ttsDone=false, minTimeDone=false, spoken=false;
  function tryFinish(){ if(ttsDone && minTimeDone && onDone) onDone(); }
  setTimeout(()=>{ minTimeDone=true; tryFinish(); }, MIN_READ_MS);
  if(!('speechSynthesis'in window)){ ttsDone=true; tryFinish(); return; }
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.rate=0.95;u.pitch=1.08;
  const wantLang=SR_LANG_MAP[curLang()]||'en-IN';
  const finish=()=>{ if(ttsDone)return; ttsDone=true; tryFinish(); };
  u.onend=finish; u.onerror=finish;
  setTimeout(finish, Math.max(4000, text.length*90));
  function doSpeak(){
   if(spoken) return; spoken=true;
   const voices=speechSynthesis.getVoices();
   const v=SS_PICK_VOICE(voices,wantLang);
   if(v){ u.voice=v; u.lang=v.lang; } else { u.lang='en-US'; } const okv=v&&v.lang.toLowerCase().startsWith(curLang());const dg=document.getElementById('ssVoiceDiag');if(dg){dg.textContent=(!okv&&curLang()!=='en')?(curLang()==='hi'?'Hindi':'Marathi')+' voice is not installed on this device, so audio may stay silent (text reply is still shown). Install it in OS speech settings, or use Microsoft Edge.':'';}
   speechSynthesis.speak(u);
  }
  if(speechSynthesis.getVoices().length===0){
   speechSynthesis.addEventListener('voiceschanged', doSpeak, {once:true});
   setTimeout(doSpeak, 300);
  } else {
   doSpeak();
  }
 }
 const ROUTES=[
  {test:/emergency network|network home/, msg:{en:'Opening the emergency network home.',hi:'आपातकालीन नेटवर्क होम खोल रहा हूँ।',mr:'आणीबाणी नेटवर्क होम उघडत आहे.'}, go:'index.html'},
  {test:/ambulance|एम्बुलेंस|रुग्णवाहिका/, msg:{en:'Opening ambulance tracking.',hi:'एम्बुलेंस ट्रैकिंग खोल रहा हूँ।',mr:'रुग्णवाहिका ट्रॅकिंग उघडत आहे.'}, go:'ambulance.html'},
  {test:/\bsos\b|emergency|आपातकाल|आणीबाणी/, msg:{en:'Opening Emergency SOS.',hi:'इमरजेंसी SOS खोल रहा हूँ।',mr:'इमर्जन्सी SOS उघडत आहे.'}, go:'sos.html'},
  {test:/severity|गंभीरता|तीव्रता/, msg:{en:'Opening severity check.',hi:'गंभीरता जांच खोल रहा हूँ।',mr:'तीव्रता तपासणी उघडत आहे.'}, go:'severity.html'},
  {test:/icu|bed|बेड|आयसीयू/, msg:{en:'Opening ICU and bed availability.',hi:'आईसीयू और बेड उपलब्धता खोल रहा हूँ।',mr:'आयसीयू आणि बेड उपलब्धता उघडत आहे.'}, go:'icu-beds.html'},
  {test:/doctor|डॉक्टर/, msg:{en:'Opening doctor availability.',hi:'डॉक्टर उपलब्धता खोल रहा हूँ।',mr:'डॉक्टर उपलब्धता उघडत आहे.'}, go:'doctor-availability.html'},
  {test:/hospital dashboard|अस्पताल डैशबोर्ड/, msg:{en:'Opening hospital dashboard.',hi:'अस्पताल डैशबोर्ड खोल रहा हूँ।',mr:'रुग्णालय डॅशबोर्ड उघडत आहे.'}, go:'hospital-dashboard.html'},
  {test:/hospital|अस्पताल/, msg:{en:'Opening hospital availability.',hi:'अस्पताल उपलब्धता खोल रहा हूँ।',mr:'रुग्णालय उपलब्धता उघडत आहे.'}, go:'hospitals.html'},
  {test:/qr/, msg:{en:'Opening the QR network page.',hi:'QR नेटवर्क पेज खोल रहा हूँ।',mr:'QR नेटवर्क पेज उघडत आहे.'}, go:'qr-network.html'},
  {test:/alert|अलर्ट/, msg:{en:'Opening the alert dashboard.',hi:'अलर्ट डैशबोर्ड खोल रहा हूँ।',mr:'अलर्ट डॅशबोर्ड उघडत आहे.'}, go:'alerts.html'},
  {test:/symptom|triage|लक्षण/, msg:{en:'Opening symptom severity check.',hi:'लक्षण जांच खोल रहा हूँ।',mr:'लक्षण तपासणी उघडत आहे.'}, go:'../triage.html'},
  {test:/referral|रेफरल/, msg:{en:'Opening referrals.',hi:'रेफरल खोल रहा हूँ।',mr:'रेफरल उघडत आहे.'}, go:'../referral.html'},
  {test:/health record|record|रिकॉर्ड|नोंद/, msg:{en:'Opening health record.',hi:'स्वास्थ्य रिकॉर्ड खोल रहा हूँ।',mr:'आरोग्य नोंद उघडत आहे.'}, go:'../health-record.html'},
  {test:/asha|आशा/, msg:{en:'Opening the ASHA dashboard.',hi:'आशा डैशबोर्ड खोल रहा हूँ।',mr:'आशा डॅशबोर्ड उघडत आहे.'}, go:'../asha-dashboard.html'},
  {test:/teleconsult|टेली/, msg:{en:'Opening teleconsult.',hi:'टेली-कंसल्ट खोल रहा हूँ।',mr:'टेली-कन्सल्ट उघडत आहे.'}, go:'../teleconsult.html'},
  {test:/scheme|योजना/, msg:{en:'Opening government schemes.',hi:'सरकारी योजनाएं खोल रहा हूँ।',mr:'सरकारी योजना उघडत आहे.'}, go:'../schemes.html'},
  {test:/facility finder|find (facility|hospital)|सुविधा खोज|सुविधा शोध/, msg:{en:'Opening facility finder.',hi:'सुविधा खोज खोल रहा हूँ।',mr:'सुविधा शोध उघडत आहे.'}, go:'../facility-finder.html'},
  {test:/main dashboard|home|dashboard|मुख्य डैशबोर्ड|घर|डॅशबोर्ड/, msg:{en:'Opening the main SwasthyaSetu dashboard.',hi:'मुख्य स्वास्थ्यसेतु डैशबोर्ड खोल रहा हूँ।',mr:'मुख्य स्वस्थ्यसेतु डॅशबोर्ड उघडत आहे.'}, go:'../index.html'},
 ];
 function reply(q){
  q=(q||'').toLowerCase();
  const hit=ROUTES.find(r=>r.test.test(q));
  const msg=hit?(hit.msg[curLang()]||hit.msg.en):tr('notUnderstood');
  const out=document.getElementById('ssVoiceText'); if(out)out.textContent=msg;
  speak(msg, ()=>{ if(hit) location.href=hit.go; });
 }
 function startVoice(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  const out=document.getElementById('ssVoiceText');
  if(!SR){ if(out)out.textContent=tr('noSupport'); return; }
  // Stop the assistant's own voice before listening, or the mic picks up its own
  // reply through the speaker and misfires / mishears.
  try{ speechSynthesis.cancel(); }catch(e){}
  const beginListening=()=>{
  const r=new SR(); r.lang=SR_LANG_MAP[curLang()]||'en-IN'; r.interimResults=false; r.maxAlternatives=1;
  if(out) out.textContent=tr('listening');
  let gotResult=false;
  r.onresult=e=>{ gotResult=true; const q=e.results[0][0].transcript; if(out)out.textContent=tr('youSaid')+q; reply(q); };
  r.onerror=(e)=>{
   gotResult=true;
   if(!out)return;
   if(e.error==='not-allowed'||e.error==='service-not-allowed') out.textContent=tr('notAllowed');
   else if(e.error==='network') out.textContent=tr('networkErr');
   else if(e.error==='no-speech') out.textContent=tr('timeout');
   else out.textContent=tr('micFail');
  };
  r.onend=()=>{ if(!gotResult && out) out.textContent=tr('timeout'); };
  r.start();
  };
  if(typeof speechSynthesis!=='undefined' && speechSynthesis.speaking){ setTimeout(beginListening,180); } else { beginListening(); }
 }
 const wrap=document.createElement('div');
 wrap.innerHTML=`<button id="ssVoiceBtn" aria-label="Open AI voice assistant" title="Ask SwasthyaSetu AI">🎙️ <span>AI Assist</span></button><div id="ssVoicePanel" class="ss-voice-panel" aria-live="polite"><b>🤖 SwasthyaSetu AI Assistant</b><small>Bolke kholiye — "ambulance", "hospitals", "ICU beds", "SOS", "main dashboard"</small><div id="ssVoiceText">${tr('ask')}</div><button id="ssVoiceStart" class="btn red btn-sm">🎤 Start Talking</button></div>`;
 document.body.appendChild(wrap);
 document.getElementById('ssVoiceBtn').onclick=()=>{
  const panel=document.getElementById('ssVoicePanel');
  const wasOpen=panel.classList.contains('show');
  panel.classList.toggle('show');
  if(!wasOpen){ document.getElementById('ssVoiceText').textContent=tr('ask'); speak(tr('ask')); }
 };
 document.getElementById('ssVoiceStart').onclick=startVoice;
 if(sessionStorage.getItem('ssLangAnnounce')){
  sessionStorage.removeItem('ssLangAnnounce'); sessionStorage.setItem('ssVoiceGreeted','1');
  setTimeout(()=>{ const m=tr('langSet'); const panel=document.getElementById('ssVoicePanel'); if(panel)panel.classList.add('show'); const out=document.getElementById('ssVoiceText'); if(out)out.textContent=m; speak(m); },600);
 } else if(!sessionStorage.getItem('ssVoiceGreeted')){
  sessionStorage.setItem('ssVoiceGreeted','1');
  setTimeout(()=>{ const out=document.getElementById('ssVoiceText'); if(out)out.textContent=tr('greetFirst'); speak(tr('greetFirst')); },700);
 }
}
document.addEventListener('DOMContentLoaded',()=>{rsSeedAlertsIfEmpty();rsApplyLanguage()});

// ---------- Offline support: service worker + connectivity banner ----------
(function(){
  if (!document.querySelector('link[rel="manifest"]')) {
    const link = document.createElement('link');
    link.rel = 'manifest'; link.href = '../manifest.json';
    document.head.appendChild(link);
    const theme = document.createElement('meta');
    theme.name = 'theme-color'; theme.content = '#063b4c';
    document.head.appendChild(theme);
  }
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('../sw.js', { scope: '../' }).catch(() => {});
    });
  }
  function ssOfflineBanner(){
    let el = document.getElementById('ssOfflineBanner');
    if (!el) {
      el = document.createElement('div');
      el.id = 'ssOfflineBanner';
      el.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:10000;background:#D98C00;color:#fff;'+
        'text-align:center;font-size:12.5px;font-weight:700;padding:6px 10px;display:none';
      document.body.appendChild(el);
    }
    return el;
  }
  function ssUpdateOfflineBanner(){
    const el = ssOfflineBanner();
    if (navigator.onLine) { el.style.display = 'none'; return; }
    const l = localStorage.getItem('swasthyasetu_lang') || 'en';
    el.textContent = l === 'hi' ? '📴 आप ऑफ़लाइन हैं — अधिकतर सुविधाएं फिर भी काम करेंगी'
      : l === 'mr' ? '📴 तुम्ही ऑफलाइन आहात — बहुतांश वैशिष्ट्ये तरीही काम करतील'
      : '📴 You are offline — most features still work';
    el.style.display = 'block';
  }
  window.addEventListener('online', ssUpdateOfflineBanner);
  window.addEventListener('offline', ssUpdateOfflineBanner);
  document.addEventListener('DOMContentLoaded', ssUpdateOfflineBanner);
  setTimeout(ssUpdateOfflineBanner, 300);
})();
