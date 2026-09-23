const SS_LANG_KEY='swasthyasetu_lang';
const SS_NAV=[
['index.html','⌂','Dashboard','डैशबोर्ड'],['triage.html','✚','Symptom Check','लक्षण जांच'],['ai-assistant.html','🤖','AI Assistant','AI सहायक'],['care-navigation.html','⌘','Care Navigation','केयर नेविगेशन'],['facility-finder.html','⌖','Find Facility','सुविधा खोजें'],['teleconsult.html','◉','Teleconsult','टेली-कंसल्ट'],['referral.html','↗','Referrals','रेफरल'],['health-record.html','▤','Health Records','स्वास्थ्य रिकॉर्ड'],['medicine-diagnostics.html','⚕','Medicine & Labs','दवा व जांच'],['asha-dashboard.html','♟','ASHA / Frontline','आशा / फ्रंटलाइन'],['doctor-dashboard.html','⚕','Doctor Command Center','डॉक्टर कमांड सेंटर'],['traffic-police-dashboard.html','🚨','Traffic Police Desk','ट्रैफिक पुलिस डेस्क'],['government-dashboard.html','▣','Government Command Center','सरकारी कमांड सेंटर'],['facility-dashboard.html','▥','Facility Dashboard','सुविधा डैशबोर्ड'],['schemes.html','▣','Govt. Schemes','सरकारी योजनाएं']];
const SS_LOGO=`<div class="brand-icon">✚</div>`;
function ssLang(){return localStorage.getItem(SS_LANG_KEY)==='hi'?'hi':'en'}
function ssApplyLanguage(){const l=ssLang();document.documentElement.lang=l;document.querySelectorAll('[data-en]').forEach(e=>{const v=e.getAttribute('data-'+l);if(v!==null)e.textContent=v});document.querySelectorAll('[data-en-placeholder]').forEach(e=>{const v=e.getAttribute('data-'+l+'-placeholder');if(v!==null)e.placeholder=v});const b=document.getElementById('langBtn');if(b){b.textContent=l==='en'?'हिंदी':'English';b.setAttribute('aria-label',l==='en'?'Switch to Hindi':'Switch to English')}}
function ssToggleLanguage(){localStorage.setItem(SS_LANG_KEY,ssLang()==='en'?'hi':'en');ssApplyLanguage()}
function ssShell(active){
 const nav=SS_NAV.map(([href,ico,en,hi])=>`<a href="${href}" class="${active===href?'active':''}"><span class="ico">${ico}</span><span data-en="${en}" data-hi="${hi}">${en}</span></a>`).join('');
 document.body.innerHTML=`<div class="app"><aside class="sidebar" id="sidebar"><a class="brand" href="index.html">${SS_LOGO}<span><b class="brand-name"><span class="swasthya-white">Swasthya</span> <span class="setu-original">Setu</span></b><small>SIH26133</small></span></a><div class="nav-title" data-en="Main Navigation" data-hi="मुख्य नेविगेशन">Main Navigation</div><nav class="nav">${nav}</nav><div class="nav-title" data-en="Emergency" data-hi="आपातकाल">Emergency</div><nav class="nav"><a href="emergency-network/index.html"><span class="ico">🛡</span><span data-en="Emergency Network" data-hi="आपातकालीन नेटवर्क">Emergency Network</span></a></nav><div class="side-status"><span class="dot"></span><div><b style="font-size:12px" data-en="System Status" data-hi="सिस्टम स्थिति">System Status</b><small style="display:block;color:#7BE0B3;margin-top:3px;font-size:10px" data-en="All Systems Operational" data-hi="सभी सिस्टम सक्रिय">All Systems Operational</small></div></div></aside><div class="shell-overlay" id="shellOverlay"></div><main class="main"><header class="topbar"><button class="menu" id="menuBtn" aria-label="Open navigation">☰</button><div class="search"><input id="globalSearch" data-en-placeholder="Search facilities, services, patients..." data-hi-placeholder="सुविधा, सेवा, मरीज खोजें..." placeholder="Search facilities, services, patients..."></div><div class="top-spacer"></div><span class="demo-ribbon" title="All operational values shown in this prototype are simulated for demonstration">DEMO DATA • SIMULATED</span><div class="location">📍 Jamshedpur, Jharkhand<small data-en="Demo location" data-hi="डेमो लोकेशन">Demo location</small></div><span class="demo-ribbon" style="margin-right:6px">ROLE: ${sessionStorage.getItem("ssRole")||"Demo User"}</span><button id="langBtn" class="lang" onclick="ssToggleLanguage()">हिंदी</button><a class="sos" href="emergency-network/sos.html">✚ <span data-en="Emergency SOS" data-hi="आपातकालीन SOS">Emergency SOS</span></a></header><div class="content" id="pageContent"></div><footer class="footer">© 2026 SwasthyaSetu · SIH26133 Rural Public Healthcare Prototype</footer></main></div><div class="toast" id="toast"></div><div class="emergency-dock" aria-label="Emergency quick access"><a href="emergency-network/sos.html">🚨 Emergency SOS</a><a class="secondary" href="emergency-network/ambulance.html">🚑 Find Ambulance</a><small>Demo prototype • simulated data</small></div>`;
 const menu=document.getElementById('menuBtn'),side=document.getElementById('sidebar'),overlay=document.getElementById('shellOverlay');const close=()=>{side.classList.remove('open');overlay.classList.remove('show')};menu?.addEventListener('click',()=>{side.classList.toggle('open');overlay.classList.toggle('show')});overlay?.addEventListener('click',close);side?.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
 document.getElementById('globalSearch').addEventListener('keydown',e=>{if(e.key!=='Enter')return;const q=e.target.value.toLowerCase();if(q.includes('facility')||q.includes('hospital'))location.href='facility-finder.html';else if(q.includes('referral'))location.href='referral.html';else if(q.includes('asha'))location.href='asha-dashboard.html';else if(q.includes('doctor'))location.href='doctor-dashboard.html';else if(q.includes('traffic')||q.includes('accident'))location.href='traffic-police-dashboard.html';else if(q.includes('government')||q.includes('govt'))location.href='government-dashboard.html';else if(q.includes('symptom'))location.href='triage.html';else ssToast(ssLang()==='hi'?'खोज परिणाम उपलब्ध नहीं है':'No matching page found','', '');});
 ssApplyLanguage();
 document.body.classList.add('projector-ready');
}
function ssPage(active,html){ssShell(active);document.getElementById('pageContent').innerHTML=html;ssApplyLanguage();ssBindNavigation()}
function ssBindNavigation(){
 document.querySelectorAll('a[href]').forEach(a=>{
  if(a.dataset.ssBound==='1')return; a.dataset.ssBound='1';
  a.addEventListener('click',e=>{
   if(a.getAttribute('href') && a.getAttribute('href')!=='#') { e.stopPropagation(); }
  },true);
 });
 document.querySelectorAll('[data-route]').forEach(el=>{
  if(el.dataset.ssRouteBound==='1')return; el.dataset.ssRouteBound='1';
  el.addEventListener('click',()=>{ window.location.assign(el.dataset.route); });
  el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();window.location.assign(el.dataset.route)}});
 });
}
function ssToast(msg){const t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000)}
function ssEsc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}

// SIH demo voice assistant (browser speech APIs; no data leaves the browser by this demo code)
(function(){
 const oldShell=ssShell;
 ssShell=function(active){oldShell(active); addVoiceAssistant(); enhanceSearch();};
 function addVoiceAssistant(){
  if(document.getElementById('ssVoiceBtn'))return;
  const wrap=document.createElement('div');wrap.innerHTML=`<button id="ssVoiceBtn" aria-label="Open AI voice assistant" title="Ask SwasthyaSetu AI">🎙️ <span>AI Assist</span></button><div id="ssVoicePanel" class="ss-voice-panel" aria-live="polite"><b>🤖 SwasthyaSetu AI Assistant</b><small>Demo AI • Try: “find ambulance”, “show hospitals”, “open symptom check”</small><div id="ssVoiceText">What can I help you with?</div><button id="ssVoiceStart" class="btn red btn-sm">🎤 Start Talking</button></div>`;
  document.body.appendChild(wrap);
  document.getElementById('ssVoiceBtn').onclick=()=>{
   const panel=document.getElementById('ssVoicePanel');
   const wasOpen=panel.classList.contains('show');
   panel.classList.toggle('show');
   if(!wasOpen) greetAssistant();
  };
  document.getElementById('ssVoiceStart').onclick=startVoice;
 }
 function greetAssistant(){
  const greeting='What can I help you with?';
  const out=document.getElementById('ssVoiceText');
  if(out) out.textContent=greeting;
  if('speechSynthesis'in window){
   speechSynthesis.cancel();
   const u=new SpeechSynthesisUtterance(greeting);
   u.rate=1;
   speechSynthesis.speak(u);
  }
 }
 function reply(q){q=(q||'').toLowerCase();let msg='I can help you find services and navigate the demo.';let go=null;
  if(/ambulance|emergency|sos/.test(q)){msg='Opening ambulance tracking. Demo ambulance movement is simulated.';go='emergency-network/ambulance.html'}
  else if(/hospital|facility/.test(q)){msg='Opening hospital and facility search.';go='facility-finder.html'}
  else if(/doctor/.test(q)){msg='Opening doctor availability.';go='emergency-network/doctor-availability.html'}
  else if(/bed|icu/.test(q)){msg='Opening bed availability.';go='emergency-network/icu-beds.html'}
  else if(/symptom|severity|triage/.test(q)){msg='Opening symptom severity check.';go='triage.html'}
  else if(/scheme/.test(q)){msg='Opening government schemes.';go='schemes.html'};
  const out=document.getElementById('ssVoiceText');if(out)out.textContent=msg;
  if('speechSynthesis'in window){speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(msg));}
  if(go)setTimeout(()=>location.href=go,900);
 }
 function startVoice(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){document.getElementById('ssVoiceText').textContent='Voice recognition is not supported in this browser. Please use Chrome/Edge and allow microphone access.';return;}const r=new SR();r.lang='en-IN';r.interimResults=false;r.maxAlternatives=1;document.getElementById('ssVoiceText').textContent='Listening…';r.onresult=e=>{const q=e.results[0][0].transcript;document.getElementById('ssVoiceText').textContent='You said: '+q;reply(q)};r.onerror=()=>document.getElementById('ssVoiceText').textContent='Microphone access was unavailable. You can still use the search bar.';r.start();}
 function enhanceSearch(){const inp=document.getElementById('globalSearch');if(!inp)return;inp.setAttribute('list','ssDemoSearches');const dl=document.createElement('datalist');dl.id='ssDemoSearches';['Sanjeevani General Hospital — 42 beds — DEMO','City Care Hospital — ICU 8 — DEMO','Dr. Priya Sharma — General Medicine — DEMO','Ambulance JH01-AMB-2214 — En Route — DEMO','Ayushman Bharat / PM-JAY — DEMO guidance'].forEach(x=>{let o=document.createElement('option');o.value=x;dl.appendChild(o)});document.body.appendChild(dl);inp.addEventListener('input',()=>{const q=inp.value.toLowerCase();if(q.length>2){if(q.includes('ambulance'))ssToast('DEMO RESULT: JH01-AMB-2214 • 9 min ETA');else if(q.includes('hospital'))ssToast('DEMO RESULT: Sanjeevani General Hospital • 42 beds');else if(q.includes('doctor'))ssToast('DEMO RESULT: Dr. Priya Sharma • Available today');else if(q.includes('bed')||q.includes('icu'))ssToast('DEMO RESULT: ICU beds available • simulated');}});}
})();
