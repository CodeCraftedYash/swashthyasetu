/* Frontend-only demo data layer. No backend/server required. */
(function(){
const KEY='swasthyasetu_demo_data_v1';
const seed={
 facilities:[
  {id:1,name:'Mango PHC',type:'PHC',address:'Mango, Jamshedpur, Jharkhand, India',lat:22.8552,lng:86.2167,distanceKm:3.2,doctors:4,beds:18,services:['Emergency','ANC','OPD'],lastUpdated:'2026-09-20T10:30:00'},
  {id:2,name:'MGM Medical College Hospital',type:'District Hospital',address:'Sakchi, Jamshedpur, Jharkhand, India',lat:22.8060,lng:86.2025,distanceKm:7.8,doctors:19,beds:76,services:['Emergency','ICU','X-Ray','ANC'],lastUpdated:'2026-09-20T10:45:00'},
  {id:3,name:'Parsudih CHC',type:'CHC',address:'Parsudih, Jamshedpur, Jharkhand, India',lat:22.7877,lng:86.2495,distanceKm:11.4,doctors:7,beds:32,services:['Emergency','Lab','Maternal Care'],lastUpdated:'2026-09-20T09:50:00'},
  {id:4,name:'Tata Main Hospital',type:'Tertiary Hospital',address:'C Road, Bistupur, Jamshedpur, Jharkhand, India',lat:22.8080,lng:86.1853,distanceKm:6.1,doctors:38,beds:180,services:['Emergency','ICU','Cardiology','Neurology','X-Ray'],lastUpdated:'2026-09-20T11:05:00'}
 ],
 referrals:[], consultations:[], records:[], ashaTasks:[{id:1,patient:'Sita Devi',village:'Mango',priority:'HIGH',reason:'Pregnancy follow-up'},{id:2,patient:'Ramesh Kumar',village:'Parsudih',priority:'MEDIUM',reason:'Chronic care review'}]
};
function db(){try{return {...seed,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return structuredClone(seed)}}
function save(x){localStorage.setItem(KEY,JSON.stringify(x))}
function id(){return Date.now()}
function result(path,method,body){const d=db(); const [base,query='']=path.split('?'); const q=new URLSearchParams(query);
 if(base==='/dashboard') return {highRisk:3,pendingAshaTasks:d.ashaTasks.length,doctors:19,beds:76};
 if(base==='/facilities'){let fs=d.facilities; if(q.get('type'))fs=fs.filter(x=>x.type===q.get('type')); if(q.get('service')){const s=q.get('service').toLowerCase();fs=fs.filter(x=>x.services.join(' ').toLowerCase().includes(s))} return fs}
 if(base==='/referrals'){
   if(method==='GET')return d.referrals;
   if(method==='POST'){const x={id:id(),...body,status:'Created',chain:[{status:'Created',at:new Date().toISOString()}],onWay:false,treatment:'Pending',createdAt:new Date().toISOString()};d.referrals.unshift(x);save(d);return x}
   if(method==='PATCH'){const x=d.referrals.find(x=>String(x.id)===String(body.id));if(!x)throw new Error('Referral not found'); if(body.status){x.status=body.status;x.chain=x.chain||[];x.chain.push({status:body.status,at:new Date().toISOString()})} if(body.onWay!==undefined)x.onWay=body.onWay; if(body.treatment)x.treatment=body.treatment;save(d);return x}
 }
 if(base==='/consultations'){if(method==='GET')return d.consultations; const x={id:id(),...body,status:'Requested',createdAt:new Date().toISOString()};d.consultations.unshift(x);save(d);return x}
 if(base==='/records'){if(method==='GET')return d.records; const x={id:id(),...body,createdAt:new Date().toISOString()};d.records.unshift(x);save(d);return x}
 if(base==='/asha/tasks'){if(method==='GET')return d.ashaTasks; const x={id:id(),...body,status:'Open'};d.ashaTasks.unshift(x);save(d);return x}
 if(base==='/triage'){const score=Number(body.score||0); return {severity:score>=70?'HIGH':score>=40?'MEDIUM':'LOW',score,patientName:body.patientName,guidance:score>=70?'Seek urgent in-person medical assessment.':score>=40?'Arrange a timely facility visit.':'Monitor symptoms and follow routine guidance.'}}
 throw new Error('Demo route not found: '+base);
}
window.SS_API={request(path,opt={}){return Promise.resolve().then(()=>result(path,(opt.method||'GET').toUpperCase(),opt.body?JSON.parse(opt.body):undefined))},get(p){return this.request(p)},post(p,b){return this.request(p,{method:'POST',body:JSON.stringify(b)})},patch(p,b){return this.request(p,{method:'PATCH',body:JSON.stringify(b)})}};
})();
