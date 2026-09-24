const SS_LANG_KEY='swasthyasetu_lang';
const SS_LANGS=['en','hi','mr'];
const SS_LANG_NAMES={en:'English',hi:'हिंदी',mr:'मराठी'};
const SS_NAV=[
['index.html','⌂','Dashboard','डैशबोर्ड','डॅशबोर्ड'],['awaaz-sahayak.html','🎙','Voice Assistant (Book Token)','आवाज़ सहायक (टोकन बनाएं)','आवाज सहाय्यक (टोकन बनवा)'],['triage.html','✚','AI Symptom Check','AI लक्षण जांच','AI लक्षण तपासणी'],['facility-finder.html','⌖','Find Facility','सुविधा खोजें','सुविधा शोधा'],['my-health-history.html','📋','My Health History','मेरा स्वास्थ्य इतिहास','माझा आरोग्य इतिहास'],['teleconsult.html','◉','Teleconsult','टेली-कंसल्ट','टेली-कन्सल्ट'],['referral.html','↗','Referrals','रेफरल','रेफरल'],['medicine-diagnostics.html','⚕','Medicine & Labs','दवा व जांच','औषध व तपासणी'],['asha-dashboard.html','♟','ASHA / Frontline','आशा / फ्रंटलाइन','आशा / फ्रंटलाइन'],['doctor-dashboard.html','⚕','Doctor Command Center','डॉक्टर कमांड सेंटर','डॉक्टर कमांड सेंटर'],['traffic-police-dashboard.html','🚨','Traffic Police Desk','ट्रैफिक पुलिस डेस्क','ट्रॅफिक पोलीस डेस्क'],['government-dashboard.html','▣','Government Command Center','सरकारी कमांड सेंटर','सरकारी कमांड सेंटर'],['schemes.html','▣','Govt. Schemes','सरकारी योजनाएं','सरकारी योजना']];
const SS_LOGO=`<div class="brand-icon">✚</div>`;
function ssLang(){const l=localStorage.getItem(SS_LANG_KEY);return SS_LANGS.includes(l)?l:'en'}
function ssApplyLanguage(){const l=ssLang();document.documentElement.lang=l;document.querySelectorAll('[data-en]').forEach(e=>{const v=e.getAttribute('data-'+l);if(v!==null&&v!=='')e.textContent=v;else{const ev=e.getAttribute('data-en');if(ev!==null)e.textContent=ev}});document.querySelectorAll('[data-en-placeholder]').forEach(e=>{const v=e.getAttribute('data-'+l+'-placeholder');if(v!==null&&v!=='')e.placeholder=v;else{const ev=e.getAttribute('data-en-placeholder');if(ev!==null)e.placeholder=ev}});const b=document.getElementById('langBtn');if(b){const next=SS_LANGS[(SS_LANGS.indexOf(l)+1)%SS_LANGS.length];b.textContent=SS_LANG_NAMES[next];b.setAttribute('aria-label','Switch language to '+SS_LANG_NAMES[next])}}
function ssToggleLanguage(){const cur=ssLang();const next=SS_LANGS[(SS_LANGS.indexOf(cur)+1)%SS_LANGS.length];localStorage.setItem(SS_LANG_KEY,next);ssApplyLanguage()}
function ssShell(active){
 const nav=SS_NAV.map(([href,ico,en,hi,mr])=>`<a href="${href}" class="${active===href?'active':''}"><span class="ico">${ico}</span><span data-en="${en}" data-hi="${hi}" data-mr="${mr}">${en}</span></a>`).join('');
 document.body.innerHTML=`<div class="app"><aside class="sidebar" id="sidebar"><a class="brand" href="index.html">${SS_LOGO}<span><b class="brand-name"><span class="swasthya-white">Swasthya</span> <span class="setu-original">Setu</span></b><small>SIH26133</small></span></a><div class="nav-title" data-en="Main Navigation" data-hi="मुख्य नेविगेशन" data-mr="मुख्य नेव्हिगेशन">Main Navigation</div><nav class="nav">${nav}</nav><div class="nav-title" data-en="Emergency" data-hi="आपातकाल" data-mr="आणीबाणी">Emergency</div><nav class="nav"><a href="emergency-network/index.html"><span class="ico">🛡</span><span data-en="Emergency Network" data-hi="आपातकालीन नेटवर्क" data-mr="आणीबाणी नेटवर्क">Emergency Network</span></a></nav><div class="side-status"><span class="dot"></span><div><b style="font-size:12px" data-en="System Status" data-hi="सिस्टम स्थिति" data-mr="प्रणाली स्थिती">System Status</b><small style="display:block;color:#7BE0B3;margin-top:3px;font-size:10px" data-en="All Systems Operational" data-hi="सभी सिस्टम सक्रिय" data-mr="सर्व प्रणाली सुरू">All Systems Operational</small></div></div></aside><div class="shell-overlay" id="shellOverlay"></div><main class="main"><header class="topbar"><button class="menu" id="menuBtn" aria-label="Open navigation">☰</button><div class="search"><input id="globalSearch" data-en-placeholder="Search facilities, services, patients..." data-hi-placeholder="सुविधा, सेवा, मरीज खोजें..." data-mr-placeholder="सुविधा, सेवा, रुग्ण शोधा..." placeholder="Search facilities, services, patients..."></div><div class="top-spacer"></div><span class="demo-ribbon" title="All operational values shown in this prototype are simulated for demonstration">DEMO DATA • SIMULATED</span><div class="location">📍 Jamshedpur, Jharkhand<small data-en="Demo location" data-hi="डेमो लोकेशन" data-mr="डेमो स्थान">Demo location</small></div><span class="demo-ribbon" style="margin-right:6px">ROLE: ${sessionStorage.getItem("ssRole")||"Demo User"}</span><button id="langBtn" class="lang" onclick="ssToggleLanguage()">हिंदी</button><a class="sos" href="emergency-network/sos.html">✚ <span data-en="Emergency SOS" data-hi="आपातकालीन SOS" data-mr="आणीबाणी SOS">Emergency SOS</span></a><a class="sos" style="background:#0E9E88;margin-left:8px" href="tel:108" title="Call national ambulance helpline">📞 <span data-en="Ambulance: 108" data-hi="एम्बुलेंस: 108" data-mr="रुग्णवाहिका: 108">Ambulance: 108</span></a></header><div class="content" id="pageContent"></div><footer class="footer">© 2026 SwasthyaSetu · SIH26133 Rural Public Healthcare Prototype</footer></main></div><div class="toast" id="toast"></div><div class="emergency-dock" aria-label="Emergency quick access"><a href="emergency-network/sos.html">🚨 Emergency SOS</a><a class="secondary" href="emergency-network/ambulance.html">🚑 Find Ambulance</a><a class="secondary" href="tel:108" style="font-weight:800">📞 Ambulance Helpline: 108</a><small>Demo prototype • simulated data</small></div>`;
 const menu=document.getElementById('menuBtn'),side=document.getElementById('sidebar'),overlay=document.getElementById('shellOverlay');const close=()=>{side.classList.remove('open');overlay.classList.remove('show')};menu?.addEventListener('click',()=>{side.classList.toggle('open');overlay.classList.toggle('show')});overlay?.addEventListener('click',close);side?.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
 document.getElementById('globalSearch').addEventListener('keydown',e=>{if(e.key!=='Enter')return;const q=e.target.value.toLowerCase();if(q.includes('facility')||q.includes('hospital'))location.href='facility-finder.html';else if(q.includes('referral'))location.href='referral.html';else if(q.includes('asha'))location.href='asha-dashboard.html';else if(q.includes('symptom'))location.href='triage.html';else if(q.includes('medicine')||q.includes('diagnostic')||q.includes('lab'))location.href='medicine-diagnostics.html';else if(q.includes('teleconsult')||q.includes('video'))location.href='teleconsult.html';else if(q.includes('doctor'))location.href='doctor-dashboard.html';else if(q.includes('traffic')||q.includes('accident'))location.href='traffic-police-dashboard.html';else if(q.includes('government')||q.includes('govt'))location.href='government-dashboard.html';else ssToast(ssLang()==='hi'?'खोज परिणाम उपलब्ध नहीं है':'No matching page found','', '');});
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
 ssShell=function(active){oldShell(active); addVoiceAssistant(); enhanceSearch(); maybeAutoGreet();};

 // ---- language-aware speech helpers ----
 const SR_LANG_MAP={en:'en-IN',hi:'hi-IN',mr:'mr-IN'};
 function speak(text, onDone){
  const MIN_READ_MS=1600; // guarantee the panel text is visible this long even if TTS produces no audio at all
  let ttsDone=false, minTimeDone=false, spoken=false;
  function tryFinish(){ if(ttsDone && minTimeDone && onDone) onDone(); }
  setTimeout(()=>{ minTimeDone=true; tryFinish(); }, MIN_READ_MS);
  if(!('speechSynthesis'in window)){ ttsDone=true; tryFinish(); return; }
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.rate=0.95;
  const wantLang=SR_LANG_MAP[ssLang()]||'en-IN';
  const finish=()=>{ if(ttsDone)return; ttsDone=true; tryFinish(); };
  u.onend=finish; u.onerror=finish;
  // Safety net: some browsers/OS voice setups never fire onend/onerror at all
  // (e.g. the requested language has zero installed voices and Chrome just stays silent).
  setTimeout(finish, Math.max(4000, text.length*90));
  function doSpeak(){
   if(spoken) return; spoken=true;
   try{ speechSynthesis.resume(); }catch(e){} // Chrome/Android bug: synth can get stuck "paused" (e.g. after tab was backgrounded) and silently never speak again until resume() is called
   const voices=speechSynthesis.getVoices();
   const v=voices.find(v=>v.lang===wantLang) || voices.find(v=>v.lang && v.lang.toLowerCase().startsWith(ssLang()));
   // If the exact regional voice (hi-IN/mr-IN/en-IN) isn't installed on this machine, Chrome can
   // silently produce NO audio at all rather than falling back — so fall back ourselves to a
   // near-universally available voice instead of forcing a locale that may not exist here.
   if(v){ u.voice=v; u.lang=v.lang; } else { u.lang='en-US'; }
   window.__ssLastVoiceCount = voices.length; // for on-page diagnostics if audio is silent
   speechSynthesis.speak(u);
   setTimeout(()=>{ try{ speechSynthesis.resume(); }catch(e){} }, 60); // some Android/Chrome builds need a resume right after queuing too, or the utterance never actually plays
  }
  if(speechSynthesis.getVoices().length===0){
   // Chrome loads the voice list asynchronously on first use; without waiting for it,
   // voice-matching above would always miss and speech could fail silently.
   speechSynthesis.addEventListener('voiceschanged', doSpeak, {once:true});
   setTimeout(doSpeak, 300); // in case voiceschanged never fires on this browser
  } else {
   doSpeak();
  }
 }

 // Chrome/Android bug workaround: if speechSynthesis is mid-utterance it can silently
 // freeze (looks "stuck speaking" forever with no audio) unless nudged with resume().
 setInterval(()=>{ try{ if('speechSynthesis'in window && speechSynthesis.speaking) speechSynthesis.resume(); }catch(e){} }, 4000);

 const T={ // trilingual UI strings for the assistant panel
  greetFirst:{en:"Welcome to SwasthyaSetu. Tap the microphone and say what you need — like, open ambulance, or, symptom check.",
    hi:"स्वस्थ्यसेतु में आपका स्वागत है। माइक बटन दबाएं और बोलें — जैसे, एम्बुलेंस खोलो, या, लक्षण जांच।",
    mr:"स्वस्थ्यसेतुमध्ये आपले स्वागत आहे. मायक्रोफोन दाबा आणि बोला — जसे, रुग्णवाहिका उघडा, किंवा, लक्षण तपासणी."},
  ask:{en:"What can I help you with?",hi:"मैं आपकी क्या मदद कर सकता हूँ?",mr:"मी तुम्हाला कशी मदत करू शकतो?"},
  listening:{en:"Listening…",hi:"सुन रहा हूँ…",mr:"ऐकत आहे…"},
  noSupport:{en:"Voice recognition is not supported in this browser. Please use Chrome/Edge and allow microphone access.",
    hi:"इस ब्राउज़र में वॉइस पहचान समर्थित नहीं है। कृपया Chrome/Edge इस्तेमाल करें और माइक्रोफ़ोन की अनुमति दें।",
    mr:"या ब्राउझरमध्ये आवाज ओळख समर्थित नाही. कृपया Chrome/Edge वापरा आणि मायक्रोफोन परवानगी द्या."},
  micFail:{en:"Microphone access was unavailable. You can still use the search bar.",
    hi:"माइक्रोफ़ोन उपलब्ध नहीं हुआ। आप सर्च बार का उपयोग कर सकते हैं।",
    mr:"मायक्रोफोन उपलब्ध झाला नाही. तुम्ही सर्च बार वापरू शकता."},
  timeout:{en:"Didn't hear anything. Tap the mic and speak right after it turns on.",
   hi:"कुछ सुनाई नहीं दिया। माइक दबाने के तुरंत बाद बोलें।",
   mr:"काही ऐकू आले नाही. मायक्रोफोन दाबल्यानंतर लगेच बोला."},
  notAllowed:{en:"Microphone permission is blocked. Please allow microphone access for this site in your browser settings.",
   hi:"माइक्रोफ़ोन की अनुमति ब्लॉक है। कृपया ब्राउज़र सेटिंग्स में इस साइट के लिए माइक्रोफ़ोन एक्सेस दें।",
   mr:"मायक्रोफोन परवानगी अवरोधित आहे. कृपया ब्राउझर सेटिंग्जमध्ये या साइटसाठी मायक्रोफोन प्रवेश द्या."},
  networkErr:{en:"Voice recognition needs an internet connection. Please check your connection and try again.",
   hi:"वॉइस पहचान के लिए इंटरनेट ज़रूरी है। कृपया अपना कनेक्शन जांचें और फिर से कोशिश करें।",
   mr:"आवाज ओळखण्यासाठी इंटरनेट आवश्यक आहे. कृपया कनेक्शन तपासा आणि पुन्हा प्रयत्न करा."},
  notUnderstood:{en:"Sorry, I didn't get that. Try: book token, open ambulance, find hospital, my history, symptom check, referral, ASHA tasks, teleconsult, schemes, or emergency SOS.",
    hi:"माफ़ कीजिए, समझ नहीं आया। कोशिश करें: टोकन बनाओ, एम्बुलेंस खोलो, अस्पताल खोजो, मेरा इतिहास, लक्षण जांच, रेफरल, आशा कार्य, टेली-कंसल्ट, योजनाएं, या इमरजेंसी SOS।",
    mr:"माफ करा, समजले नाही. करून पहा: टोकन बनवा, रुग्णवाहिका उघडा, रुग्णालय शोधा, माझा इतिहास, लक्षण तपासणी, रेफरल, आशा कामे, टेली-कन्सल्ट, योजना, किंवा इमर्जन्सी SOS."},
  youSaid:{en:"You said: ",hi:"आपने कहा: ",mr:"तुम्ही म्हणालात: "},
 };
 function tr(key){if(!T[key])return '';return T[key][ssLang()]||T[key].en||'';}

 function addVoiceAssistant(){
  if(document.getElementById('ssVoiceBtn'))return;
  const wrap=document.createElement('div');wrap.innerHTML=`<button id="ssVoiceBtn" aria-label="Open AI voice assistant" title="Ask SwasthyaSetu AI">🎙️ <span>AI Assist</span></button><div id="ssVoicePanel" class="ss-voice-panel" aria-live="polite"><b>🤖 SwasthyaSetu AI Assistant</b><small>Bolke poora app khol sakte hain — "ambulance kholo", "referral", "health record", "ASHA", "teleconsult", "schemes", "emergency SOS"</small><div id="ssVoiceText">${tr('ask')}</div><button id="ssVoiceStart" class="btn red btn-sm">🎤 Start Talking</button> <button id="ssVoiceTest" class="btn btn-sm" style="background:#eef2f4;color:#222">🔊 Test sound</button><div id="ssVoiceDiag" style="font-size:10.5px;color:#8296A2;margin-top:6px"></div></div>`;
  document.body.appendChild(wrap);
  document.getElementById('ssVoiceBtn').onclick=()=>{
   const panel=document.getElementById('ssVoicePanel');
   const wasOpen=panel.classList.contains('show');
   panel.classList.toggle('show');
   if(!wasOpen){ document.getElementById('ssVoiceText').textContent=tr('ask'); speak(tr('ask')); }
  };
  document.getElementById('ssVoiceStart').onclick=startVoice;
  document.getElementById('ssVoiceTest').onclick=()=>{
   const diag=document.getElementById('ssVoiceDiag');
   const supported='speechSynthesis'in window;
   diag.textContent = supported ? 'Checking voices...' : 'This browser has no speech support at all - try Chrome.';
   if(!supported) return;
   speak('Testing, one two three. Agar yeh sunai de raha hai to awaaz theek hai.', ()=>{
    const n = window.__ssLastVoiceCount ?? speechSynthesis.getVoices().length;
    diag.textContent = 'Voices available: ' + n + '. ' + (n===0 ? 'Zero voices = no Text-to-Speech installed - enable Google Text-to-Speech (Android) or try Chrome desktop with internet. Also check media volume / silent mode.' : 'If you still heard nothing, check media volume / silent mode.');
   });
  };
 }

 // Speak a one-time welcome the moment the app opens (per browser tab session),
 // so a non-reading (anpad) user discovers the voice feature without needing to read anything.
 function maybeAutoGreet(){
  if(sessionStorage.getItem('ssVoiceGreeted'))return;
  sessionStorage.setItem('ssVoiceGreeted','1');
  setTimeout(()=>{
   const out=document.getElementById('ssVoiceText'); if(out) out.textContent=tr('greetFirst');
   speak(tr('greetFirst'));
  }, 700); // slight delay so voices list has time to load in some browsers
 }

 // Every page + feature in the app, reachable by voice, in English/Hindi/Marathi keywords.
 // Order matters: more specific phrases are checked before generic ones.
 const ROUTES=[
  {test:/token|टोकन|book.*(hospital|token)|(hospital|अस्पताल|रुग्णालय).*book|voice assist|आवाज़ सहायक|आवाज सहाय्यक/,
   msg:{en:'Opening the voice assistant to find a hospital and book your token.',hi:'अस्पताल खोजने और टोकन बनाने के लिए आवाज़ सहायक खोल रहा हूँ।',mr:'रुग्णालय शोधण्यासाठी आणि टोकन बनवण्यासाठी आवाज सहाय्यक उघडत आहे.'}, go:'awaaz-sahayak.html'},
  {test:/ambulance|एम्बुलेंस|रुग्णवाहिका/,
   msg:{en:'Opening ambulance tracking.',hi:'एम्बुलेंस ट्रैकिंग खोल रहा हूँ।',mr:'रुग्णवाहिका ट्रॅकिंग उघडत आहे.'}, go:'emergency-network/ambulance.html'},
  {test:/\bsos\b|emergency(?! network)|आपातकाल(?! नेटवर्क)|आणीबाणी(?! नेटवर्क)/,
   msg:{en:'Opening Emergency SOS.',hi:'इमरजेंसी SOS खोल रहा हूँ।',mr:'इमर्जन्सी SOS उघडत आहे.'}, go:'emergency-network/sos.html'},
  {test:/icu|bed|बेड|आयसीयू|बिछाना/,
   msg:{en:'Opening bed availability.',hi:'बेड उपलब्धता खोल रहा हूँ।',mr:'बेड उपलब्धता उघडत आहे.'}, go:'emergency-network/icu-beds.html'},
  {test:/doctor availability|doctor|डॉक्टर/,
   msg:{en:'Opening doctor availability.',hi:'डॉक्टर उपलब्धता खोल रहा हूँ।',mr:'डॉक्टर उपलब्धता उघडत आहे.'}, go:'emergency-network/doctor-availability.html'},
  {test:/hospital dashboard|अस्पताल डैशबोर्ड/,
   msg:{en:'Opening hospital dashboard.',hi:'अस्पताल डैशबोर्ड खोल रहा हूँ।',mr:'रुग्णालय डॅशबोर्ड उघडत आहे.'}, go:'emergency-network/hospital-dashboard.html'},
  {test:/facility dashboard|सुविधा डैशबोर्ड/,
   msg:{en:'Opening facility dashboard.',hi:'सुविधा डैशबोर्ड खोल रहा हूँ।',mr:'सुविधा डॅशबोर्ड उघडत आहे.'}, go:'facility-dashboard.html'},
  {test:/find (facility|hospital)|hospital|facility|सुविधा खोज|सुविधा शोध|अस्पताल खोज|रुग्णालय शोध|अस्पताल|रुग्णालय/,
   msg:{en:'Opening facility finder.',hi:'सुविधा खोज खोल रहा हूँ।',mr:'सुविधा शोध उघडत आहे.'}, go:'facility-finder.html'},
  {test:/emergency network|आपातकालीन नेटवर्क|आणीबाणी नेटवर्क/,
   msg:{en:'Opening the emergency network.',hi:'आपातकालीन नेटवर्क खोल रहा हूँ।',mr:'आणीबाणी नेटवर्क उघडत आहे.'}, go:'emergency-network/index.html'},
  {test:/qr/,
   msg:{en:'Opening the QR network page.',hi:'QR नेटवर्क पेज खोल रहा हूँ।',mr:'QR नेटवर्क पेज उघडत आहे.'}, go:'emergency-network/qr-network.html'},
  {test:/alert/,
   msg:{en:'Opening alerts.',hi:'अलर्ट खोल रहा हूँ।',mr:'अलर्ट उघडत आहे.'}, go:'emergency-network/alerts.html'},
  {test:/severity/,
   msg:{en:'Opening severity overview.',hi:'गंभीरता विवरण खोल रहा हूँ।',mr:'तीव्रता तपशील उघडत आहे.'}, go:'emergency-network/severity.html'},
  {test:/symptom|severity check|triage|लक्षण|तपासणी/,
   msg:{en:'Opening symptom severity check.',hi:'लक्षण जांच खोल रहा हूँ।',mr:'लक्षण तपासणी उघडत आहे.'}, go:'triage.html'},
  {test:/referral|रेफरल/,
   msg:{en:'Opening referrals.',hi:'रेफरल खोल रहा हूँ।',mr:'रेफरल उघडत आहे.'}, go:'referral.html'},
  {test:/my history|my report|blood test|x-?ray|prescription|pdf|मेरा इतिहास|मेरी हिस्ट्री|इतिहास|मेरा रिकॉर्ड|रिपोर्ट|ब्लड टेस्ट|माझा इतिहास|अहवाल/,
   msg:{en:'Opening your medical history.',hi:'आपका मेडिकल इतिहास खोल रहा हूँ।',mr:'तुमचा वैद्यकीय इतिहास उघडत आहे.'}, go:'my-health-history.html'},
  {test:/health record|record|रिकॉर्ड|नोंद/,
   msg:{en:'Opening health record.',hi:'स्वास्थ्य रिकॉर्ड खोल रहा हूँ।',mr:'आरोग्य नोंद उघडत आहे.'}, go:'health-record.html'},
  {test:/asha|आशा/,
   msg:{en:'Opening the ASHA / frontline dashboard.',hi:'आशा / फ्रंटलाइन डैशबोर्ड खोल रहा हूँ।',mr:'आशा / फ्रंटलाइन डॅशबोर्ड उघडत आहे.'}, go:'asha-dashboard.html'},
  {test:/teleconsult|तेली|टेली/,
   msg:{en:'Opening teleconsult.',hi:'टेली-कंसल्ट खोल रहा हूँ।',mr:'टेली-कन्सल्ट उघडत आहे.'}, go:'teleconsult.html'},
  {test:/scheme|योजना/,
   msg:{en:'Opening government schemes.',hi:'सरकारी योजनाएं खोल रहा हूँ।',mr:'सरकारी योजना उघडत आहे.'}, go:'schemes.html'},
  {test:/medicine|diagnostic|दवा|औषध/,
   msg:{en:'Opening medicine and diagnostics.',hi:'दवा व जांच खोल रहा हूँ।',mr:'औषध व तपासणी उघडत आहे.'}, go:'medicine-diagnostics.html'},
  {test:/care navigation|navigate/,
   msg:{en:'Opening care navigation.',hi:'केयर नेविगेशन खोल रहा हूँ।',mr:'केअर नेव्हिगेशन उघडत आहे.'}, go:'care-navigation.html'},
  {test:/ai assistant|assistant/,
   msg:{en:'Opening the AI assistant page.',hi:'AI सहायक पेज खोल रहा हूँ।',mr:'AI सहाय्यक पेज उघडत आहे.'}, go:'ai-assistant.html'},
  {test:/login|logout|sign/,
   msg:{en:'Opening login.',hi:'लॉगिन खोल रहा हूँ।',mr:'लॉगिन उघडत आहे.'}, go:'login.html'},
  {test:/home|dashboard|डैशबोर्ड|डॅशबोर्ड|घर|\bghar\b/,
   msg:{en:'Opening the home dashboard.',hi:'होम डैशबोर्ड खोल रहा हूँ।',mr:'होम डॅशबोर्ड उघडत आहे.'}, go:'index.html'},
 ];

 function reply(q){
  q=(q||'').toLowerCase();
  const hit=ROUTES.find(r=>r.test.test(q));
  const msg = hit ? (hit.msg[ssLang()]||hit.msg.en) : tr('notUnderstood');
  const out=document.getElementById('ssVoiceText'); if(out)out.textContent=msg;
  speak(msg, ()=>{ if(hit) location.href=hit.go; });
 }

 function startVoice(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  const out=document.getElementById('ssVoiceText');
  if(!SR){ if(out) out.textContent=tr('noSupport'); return; }
  const r=new SR();
  r.lang=SR_LANG_MAP[ssLang()]||'en-IN'; r.interimResults=false; r.maxAlternatives=1;
  if(out) out.textContent=tr('listening');
  let gotResult=false;
  r.onresult=e=>{
   gotResult=true;
   const q=e.results[0][0].transcript;
   if(out) out.textContent=tr('youSaid')+q;
   reply(q);
  };
  r.onerror=(e)=>{
   gotResult=true; // suppress the generic onend timeout message; we show a specific one here
   if(!out)return;
   if(e.error==='not-allowed'||e.error==='service-not-allowed') out.textContent=tr('notAllowed');
   else if(e.error==='network') out.textContent=tr('networkErr');
   else if(e.error==='no-speech') out.textContent=tr('timeout');
   else out.textContent=tr('micFail');
  };
  // Chrome auto-stops recognition after a few seconds of silence with no error event at all.
  // Without this, the panel is stuck on "Listening…" forever and it looks like the mic just died.
  r.onend=()=>{ if(!gotResult && out) out.textContent=tr('timeout'); };
  r.start();
 }

 function enhanceSearch(){const inp=document.getElementById('globalSearch');if(!inp)return;inp.setAttribute('list','ssDemoSearches');const dl=document.createElement('datalist');dl.id='ssDemoSearches';['Sanjeevani General Hospital — 42 beds — DEMO','City Care Hospital — ICU 8 — DEMO','Dr. Priya Sharma — General Medicine — DEMO','Ambulance JH01-AMB-2214 — En Route — DEMO','Ayushman Bharat / PM-JAY — DEMO guidance'].forEach(x=>{let o=document.createElement('option');o.value=x;dl.appendChild(o)});document.body.appendChild(dl);inp.addEventListener('input',()=>{const q=inp.value.toLowerCase();if(q.length>2){if(q.includes('ambulance'))ssToast('DEMO RESULT: JH01-AMB-2214 • 9 min ETA');else if(q.includes('hospital'))ssToast('DEMO RESULT: Sanjeevani General Hospital • 42 beds');else if(q.includes('doctor'))ssToast('DEMO RESULT: Dr. Priya Sharma • Available today');else if(q.includes('bed')||q.includes('icu'))ssToast('DEMO RESULT: ICU beds available • simulated');}});}
})();

// ---------- Offline support: install prompt cache + connectivity banner ----------
(function(){
  // Register the service worker so the whole app shell (pages, styles, scripts)
  // gets cached and keeps working with zero internet after the first visit.
  // Silently does nothing on file:// or unsupported browsers — no error shown,
  // since the app already works fine locally without it in that case.
  if (!document.querySelector('link[rel="manifest"]')) {
    const link = document.createElement('link');
    link.rel = 'manifest'; link.href = 'manifest.json';
    document.head.appendChild(link);
    const theme = document.createElement('meta');
    theme.name = 'theme-color'; theme.content = '#063b4c';
    document.head.appendChild(theme);
  }
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
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
    const l = (typeof ssLang === 'function') ? ssLang() : 'en';
    el.textContent = l === 'hi' ? '📴 आप ऑफ़लाइन हैं — लक्षण जांच, टोकन, इतिहास व अधिकतर सुविधाएं फिर भी काम करेंगी'
      : l === 'mr' ? '📴 तुम्ही ऑफलाइन आहात — लक्षण तपासणी, टोकन, इतिहास व बहुतांश वैशिष्ट्ये तरीही काम करतील'
      : '📴 You are offline — Symptom Check, Token, History and most features still work';
    el.style.display = 'block';
  }
  window.addEventListener('online', ssUpdateOfflineBanner);
  window.addEventListener('offline', ssUpdateOfflineBanner);
  document.addEventListener('DOMContentLoaded', ssUpdateOfflineBanner);
  // ssShell rebuilds document.body.innerHTML on every page load, which would wipe
  // out the banner element — re-check shortly after so it re-appears if still offline.
  setTimeout(ssUpdateOfflineBanner, 300);
})();
