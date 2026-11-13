// EASY APPLY RUNNER for Gabis Job Hunter (LinkedIn, mode B - only when the user asks).
// Use only in a browser where LinkedIn is signed in as the user. Paste _Playbook/runner_config.js first, then this file
// (LinkedIn CSP blocks eval, so paste the code itself). Set window.__LOC = '<job location from the job page>' before each run.
// await window.__ea() fills and stops at review ("READY"). window.__AUTO=1 submits only when every question was answered by a rule.
// Saved LinkedIn answers are accepted only for contact fields; every substantive question needs a rule from the user's
// profile (runner_config.js), otherwise it is listed as UNKNOWN and nothing is sent.
window.__ea=async()=>{
const AUTO=!!window.__AUTO,sleep=ms=>new Promise(r=>setTimeout(r,ms)),T=s=>(s||'').replace(/\s+/g,' ').trim();
const DL=()=>[...document.querySelectorAll('[role=dialog],dialog,[aria-modal=true]')];
const dlg=()=>{const a=DL();return a.filter(d=>d.querySelector('input,select,textarea')).pop()||a.sort((x,y)=>y.innerText.length-x.innerText.length)[0]};
const BTN=re=>[...document.querySelectorAll('[role=dialog] button,dialog button,[aria-modal=true] button')].find(b=>re.test(T(b.getAttribute('aria-label')||b.innerText)));
const rlab=x=>{let p=x,t='';for(let k=0;k<8&&!t;k++){p=p.parentElement;if(!p)break;t=T(p.innerText)}return t};
const sv=(e,v)=>{e.focus();const P=e.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(P,'value').set.call(e,v);['input','change','blur'].forEach(t=>e.dispatchEvent(new Event(t,{bubbles:true})))};
const qOf=e=>{if(e.type==='radio'){const fs=e.closest('fieldset');const lg=fs&&fs.querySelector('legend');return T(lg?lg.innerText:(e.getAttribute('aria-label')||''))}let l=e.labels&&e.labels[0]?e.labels[0].innerText:(e.getAttribute('aria-label')||'');if(!T(l)){const id=(e.getAttribute('aria-labelledby')||'').split(' ')[0];if(id&&document.getElementById(id))l=document.getElementById(id).innerText}return T(l)};
const CONTACT=/phone|telefon|handy|mobil|e-?mail|\bcity\b|stadt|wohnort|address|adresse|linkedin|vorname|nachname|first name|last name/i;
const C=window.__JH;if(!C)return 'Paste runner_config.js first (window.__JH missing)';
const RX=s=>s?new RegExp(s,'i'):null,NEV=/$^/,S=C.salary||{},ST=C.start||{};
const ABROAD=RX(C.visa)||NEV,NV=!!C.needVisaDefault;
const YRS=s=>{const m=s.match(/(?:experience|erfahrung)[^:?]*?(?:\bwith\b|\bin\b|\busing\b|\bmit\b|im bereich|in der|in dieser|\bim\b|\bals\b|\bbei\b|:)\s*([^?]+)/);let t=T(m?m[1]:'').replace(/^(the|a|an|einer|einem|der|die|das)\s+/,'');if(!t){const b=s.match(/years of ([a-z][a-z &\/-]{2,40}?) (?:work |professional )?experience/)||s.match(/([a-zäöüß-]{3,})erfahrung/);if(b&&!/^(work|professional|relevant|total|berufs|praxis|arbeits)$/.test(b[1]))t=b[1]}
 if(t&&C.yearsUnknown&&RX(C.yearsUnknown).test(t))return null;
 if(!t||/^(you have|do you have|haben sie|hast du|bringen sie mit|total|insgesamt|overall|work|berufserfahrung|professional|relevant)\b/.test(t))return /lead|führ|team|direct report/.test(s)?null:(C.total||null);
 for(const [re,n] of (C.years||[]))if(new RegExp(re,'i').test(t))return n;
 return null};
const YN=s=>{
 if(/previously (worked|applied)|worked for .{0,40} before|bereits .{0,30}(beschäftigt|gearbeitet|beworben)/.test(s))return null;
 if(/sponsor|visa|visum|(arbeitserlaubnis|work permit|arbeitsgenehmigung).{0,40}(benötig|need|requir)/.test(s))return (NV||ABROAD.test(s))?'Y':'N';
 if(/authori[sz]ed|legally|work permit|arbeitserlaubnis|berechtigt.{0,40}arbeiten|right to work|eligible to work|arbeitsgenehmigung/.test(s))return (NV||ABROAD.test(s))?'N':'Y';
 if(C.unknown&&RX(C.unknown).test(s))return null;
 if(/commut|pendeln|relocat|umzug|umziehen|willing to move|on-?site|vor ort|hybrid|office|büro/.test(s)){if(!window.__LOC||!C.commute)return null;return RX(C.commute).test(window.__LOC)?'Y':null}
 if(/travel|reise/.test(s))return C.travel||null;
 if(C.langNo&&RX(C.langNo).test(s)&&/language|sprache|speak|sprechen|kenntnisse|fluent|fließend|native|mutter/.test(s))return 'N';
 if(C.no&&RX(C.no).test(s))return 'N';
 if(C.langYes&&RX(C.langYes).test(s)&&/language|sprache|speak|sprechen|kenntnisse|fluent|fließend/.test(s)&&!/native|mutter/.test(s))return 'Y';
 if(/full.?time|vollzeit/.test(s))return C.fullTime||null;
 if(C.yes&&RX(C.yes).test(s))return 'Y';
 return null};
const PICK=(opts,res)=>{for(const re of res){if(!re)continue;const o=opts.find(o=>re.test(o));if(o)return o}return null};
const LVL=(s,opts)=>{for(const [re,lv] of (C.levels||[]))if(new RegExp(re,'i').test(s))return PICK(opts,lv.map(RX));return null};
const SAL=/salary|gehalt|compensation|vergütung|pay expectation|einkommen/;
const NUMF=(e,t)=>t==='number'||/numeric|decimal/.test(e.inputMode||'')||(e.maxLength>0&&e.maxLength<42);
const answer=(e,q,opts)=>{const s=q.toLowerCase(),t=(e.type||'').toLowerCase(),sel=e.tagName==='SELECT'||t==='radio';
 for(const [re,v] of (window.__MAN||[])){if(re.test(q)){if(!opts.length&&typeof v==='string')return v;if(opts.length){const o=opts.find(o=>(v instanceof RegExp?v:new RegExp('^'+v,'i')).test(o));if(o)return o}}}
 if(SAL.test(s)&&/zeitraum|period|basis/.test(s)&&sel)return PICK(opts,[/jährlich|annual|yearly|per year/i]);
 if(SAL.test(s)&&/währung|currency/.test(s)&&sel)return PICK(opts,[RX(C.currency||'eur')]);
 if(SAL.test(s)){if(sel)return PICK(opts,[RX(S.band)]);const mon=/monat|monthly|per month/.test(s);if(mon)return NUMF(e,t)?(S.monthNum?String(S.monthNum):null):(S.monthText||null);return NUMF(e,t)?(S.num?String(S.num):null):(S.text||null)}
 if(/notice|kündigungsfrist/.test(s)&&!sel&&t!=='number')return ST.notice||null;
 if(/(start|anfangen|beginnen|eintritt|available|verfügbar)/.test(s)&&sel)return PICK(opts,[RX(ST.within)]);
 if(/start|eintritt|available from|verfügbar ab|earliest|frühest|anfangen/.test(s)&&!sel){if(e.getAttribute('data-testid')==='date-picker-input'||/mm\/dd/i.test(e.placeholder||''))return ST.mmdd||null;if(/dd\.mm\.yy\b|tt\.mm\.jj\b/i.test(s))return ST.short||null;if(t==='number')return null;return ST.text||null}
 if(/arbeitserlaubnis|work permit|aufenthalt|residence permit/.test(s)&&sel&&!opts.every(o=>/^(ja|nein|yes|no)$/i.test(o)))return PICK(opts,[RX(C.permit)]);
 if(/nationalit|staatsbürger|citizenship/.test(s)&&sel)return PICK(opts,[RX(C.nationality)]);
 if(/vollzeit|full.?time/.test(s)&&sel&&opts.some(o=>/vollzeit|full/i.test(o))&&!opts.every(o=>/^(ja|nein|yes|no)$/i.test(o)))return C.fullTime==='Y'?PICK(opts,[/vollzeit|full/i]):null;
 if(/hear about|erfahren|aufmerksam|source|quelle/.test(s))return sel?PICK(opts,[RX(C.source||'linkedin')]):(C.source||'LinkedIn');
 if(/linkedin/.test(s)&&!sel)return C.linkedin||null;
 if(/phone|telefon|handy|mobil|rufnummer/.test(s)&&!sel)return C.phone||null;
 if(/\bcity\b|stadt|wohnort|current location|place of residence/.test(s)&&!sel&&!/standort kommt|which location|preferred location/.test(s))return C.city||null;
 if(/disab|behinder|gleichstell/.test(s))return PICK(opts,[/nein, ich möchte keinen/i,/keine angabe|prefer not|don.t wish|do not wish|möchte keine angaben|i don.t want/i]);
 if(/gender|geschlecht|pronoun|anrede/.test(s)){if(!e.required&&e.getAttribute('aria-required')!=='true'&&!/\*/.test(q))return '';return PICK(opts,[RX(C.gender)])}
 if(/year|jahre/.test(s)&&!/years ago|jahren? her/.test(s)){const y=YRS(s);if(y===null||y===undefined)return null;if(sel){return opts.find(o=>{const n=o.match(/(\d+)\s*(?:-|–|bis|to)\s*(\d+)/);if(n)return y>=+n[1]&&y<=+n[2];const p=o.match(/(\d+)\s*\+|mehr als (\d+)|more than (\d+)|over (\d+)|über (\d+)/i);if(p){const k=+(p[1]||p[2]||p[3]||p[4]||p[5]);return y>=k}const z=o.match(/^(\d+)$/);return z&&+z[1]===y})||null}return String(y)}
 if(opts.length){const lv=LVL(s,opts);if(lv)return lv;const yn=YN(s);if(yn)return PICK(opts,[yn==='Y'?/^(yes|ja|y)\b/i:/^(no|nein|n)\b/i]);return null}
 return null};
const log=[],unk=[];let status='',page=0,salRetry=false;
if(!DL().some(d=>d.querySelector('input,select,textarea'))){const btn=[...document.querySelectorAll('button')].find(x=>/Easy Apply to this job|Einfach bewerben/i.test(x.getAttribute('aria-label')||''));if(!btn){const m=document.body.innerText.match(/Applied [^\n]{0,25}|Application submitted|No longer accepting applications|Apply on company website/);return 'NO EASY APPLY: '+(m?m[0]:'button missing')}btn.click();await sleep(3000)}
for(page=0;page<14;page++){const d=dlg();if(!d){status='dialog closed';break}const head=T(d.innerText).slice(0,160);
 const rr=[...d.querySelectorAll('input[type=radio]')].filter(r=>/\.pdf|\.docx?/i.test(rlab(r)));
 if(rr.length){const RES=RX(C.resume)||NEV;const want=rr.find(r=>RES.test(rlab(r))&&!/Cover/i.test(rlab(r)));if(want&&!want.checked){(want.labels&&want.labels[0]?want.labels[0]:want).click();await sleep(700)}const cur=rr.find(r=>r.checked);if(!cur||!RES.test(rlab(cur))){unk.push('resume not selectable');break}}
 const loc=[...d.querySelectorAll('input')].find(x=>/city or location/i.test(x.placeholder||'')&&!x.value);if(loc&&C.city){sv(loc,C.city);await sleep(1800);const CO=RX(C.cityOption)||NEV;const o=[...document.querySelectorAll('[role=option]')].find(x=>CO.test(x.innerText));if(o){o.click();await sleep(500)}}
 const F=[...d.querySelectorAll('input,select,textarea')].filter(e=>e.type!=='hidden'&&e.type!=='file'&&!(e.type==='radio'&&/\.pdf|\.docx?/i.test(rlab(e))));const seen=new Set();
 for(const e of F){const t=(e.type||'').toLowerCase();const q=qOf(e);
  if(t==='checkbox'){const l=rlab(e);if(/follow|top choice|folgen/i.test(l))continue;const req=e.required||e.getAttribute('aria-required')==='true'||/\*/.test(l)||/\*/.test(q);if(!e.checked&&/consent|datenschutz|privacy|einwillig|zustimm|stimme|agree|akzeptier|terms|bestätige|agb/i.test(l+' '+q)&&req){(e.labels&&e.labels[0]?e.labels[0]:e).click();log.push('consent ticked')}else if(!e.checked&&req)unk.push('checkbox: '+(q||l).slice(0,90));continue}
  if(t==='radio'){const g0=F.filter(x=>x.type==='radio'&&x.name===e.name);let qq=q;if(!qq){let c=e.closest('fieldset')||e.parentElement;for(let k=0;k<5&&c&&T(c.innerText).length<20;k++)c=c.parentElement;qq=T(c?c.innerText:'').slice(0,200)}if(seen.has(e.name||qq))continue;seen.add(e.name||qq);const g=e.name?g0:F.filter(x=>x.type==='radio'&&qOf(x)===q);const opts=g.map(x=>rlab(x));const pre=g.find(x=>x.checked);let a=null;if(/agb|datenschutz|privacy|terms|nutzungsbedingungen|einwilligung|consent/i.test(qq)&&opts.length<=2)a=PICK(opts,[/^(ja|yes|ich stimme zu|i agree)/i]);else a=answer(e,qq,opts);if(a===null){unk.push(qq.slice(0,120)+' ['+opts.join('/').slice(0,60)+']'+(pre?' saved:'+rlab(pre).slice(0,10):''));continue}const x=g[opts.indexOf(a)];if(!x.checked)x.click();log.push(qq.slice(0,60)+'='+a.slice(0,14));continue}
  if(!q)continue;
  if(e.tagName==='SELECT'){const cur=e.selectedIndex>0?T(e.selectedOptions[0].text):'';if(cur&&/e-?mail|phone|telefon|country code|ländervorwahl/i.test(q))continue;const opts=[...e.options].slice(1).map(o=>T(o.text));const a=answer(e,q,opts);if(a===''){continue}if(a===null){unk.push(q.slice(0,120)+' ['+opts.slice(0,6).join('/').slice(0,70)+']'+(cur?' saved:'+cur.slice(0,14):''));continue}const o=[...e.options].find(o=>T(o.text)===a);e.value=o.value;e.dispatchEvent(new Event('change',{bubbles:true}));log.push(q.slice(0,60)+'='+a.slice(0,20));continue}
  let a=answer(e,q,[]);if(salRetry&&SAL.test(q.toLowerCase()))a=/monat|month/i.test(q)?(S.monthNum?String(S.monthNum):null):(S.num?String(S.num):null);
  if(e.value&&CONTACT.test(q)&&!(a&&/year|jahre/i.test(q)))continue;
  if(e.value&&a===null){unk.push(q.slice(0,110)+' [saved: '+e.value.slice(0,20)+' – no rule]');continue}
  if(e.value&&a!==null&&e.value===a){log.push(q.slice(0,60)+'='+a.slice(0,24));continue}
  const req=e.required||e.getAttribute('aria-required')==='true'||/\*/.test(q);if(a===null||a===''){if(req)unk.push(q.slice(0,120)+' ['+t+(e.maxLength>0?' max'+e.maxLength:'')+']');continue}sv(e,a);log.push(q.slice(0,60)+'='+a.slice(0,24))}
 if(unk.length)break;
 const sb=BTN(/^Submit application|Bewerbung (senden|absenden)/i);
 if(sb){const c=[...document.querySelectorAll('[role=dialog] input[type=checkbox],dialog input[type=checkbox],[aria-modal=true] input[type=checkbox]')].find(c=>/^Follow |folgen/i.test(rlab(c)));if(c&&c.checked){(c.labels&&c.labels[0]?c.labels[0]:c).click();await sleep(300)}
  if(!AUTO){status='READY (review page, not submitted)';break}
  sb.click();await sleep(5000);status=/Application submitted|application was sent|Application sent|Bewerbung (wurde )?gesendet/i.test(document.body.innerText)?'SUBMITTED':'submit clicked, no confirmation';
  const x=BTN(/^(Dismiss|Done|Fertig|Schließen|Close)$/i);if(x)x.click();break}
 const nb=BTN(/^(Next|Review|Continue to next step|Review your application|Weiter|Überprüfen)/i);if(!nb){status='no next button';break}
 nb.click();await sleep(2200);const d2=dlg();if(d2&&T(d2.innerText).slice(0,160)===head){const err=(d2.innerText.match(/(Invalid input|This field is required|Please (enter|make|select)[^\n]{0,40}|Enter a (whole|decimal) number[^\n]{0,30}|Ungültig[^\n]{0,30}|Pflichtfeld[^\n]{0,20}|[^\n]{0,40}required)/g)||[]);
  if(!salRetry&&/Invalid input|whole|decimal/.test(err.join(' '))&&F.some(e=>SAL.test(qOf(e).toLowerCase()))){salRetry=true;page--;log.push('salary numeric');continue}
  unk.push('ERR: '+([...new Set(err)].join('; ')||'page did not advance').slice(0,160));break}}
return (status||'STOPPED p'+page)+' || '+log.join(' ; ')+(unk.length?' || UNKNOWN: '+unk.join(' ## '):'')};
