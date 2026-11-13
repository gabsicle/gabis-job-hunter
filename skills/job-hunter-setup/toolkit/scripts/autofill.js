// AUTOFILL for Gabis Job Hunter. First paste  window.__P = <contents of _Playbook/profile.json>;  then this whole file into the browser's javascript tool.
// Fills empty text fields it recognises from the profile (walks shadow DOM). Never touches passwords, user names,
// bank or ID fields, files, checkboxes, radios or dropdowns. Output: what it filled, then a numbered todo list of
// everything still open. Fields stay in window.__F[n] for follow-up (snippet 13: sv / so).
// Dry run (reads only, fills nothing): put  window.__DRY=1;  in front of the pasted code.
(()=>{
const J=window.__P;if(!J||!J.personal)return 'Set window.__P = <profile.json contents> first';const pe=J.personal,st=J.standard||{},cur=(J.roles||[])[0]||{};
const P={first:pe.first||'',last:pe.last||'',full:((pe.first||'')+' '+(pe.last||'')).trim(),email:pe.email||'',phone:pe.phone||'',local:pe.phone_local||'',street:pe.street||'',zip:pe.postcode||'',city:pe.city||'',linkedin:pe.linkedin||'',company:cur.company||'',title:cur.title||'',salary:st.salary_text||'',salaryNum:String(st.salary_number||''),start:(st.start_date||'').split('-').reverse().join('.'),startIso:st.start_date||''};
const R=[[/confirm.{0,12}mail|mail.{0,12}(confirm|best.tig|wiederhol)/i,'email'],[/first.?name|vorname|given.?name|^nombre|pr.nom/i,'first'],[/last.?name|nachname|surname|family.?name|apellido/i,'last'],[/full.?name|^name\b|vollst.ndiger name|vor- und nachname|legal name/i,'full'],[/e-?mail|correo/i,'email'],[/phone|telefon|mobil|handy|tel.fono|rufnummer/i,'phone'],[/linkedin/i,'linkedin'],[/street|stra(ss|ß)e|address line|anschrift|^adresse|direcci/i,'street'],[/zip|postal|postleitzahl|\bplz\b/i,'zip'],[/\bcity\b|stadt|wohnort|\bort\b|ciudad|current location/i,'city'],[/current (company|employer)|aktuelle[rs]? (arbeitgeber|unternehmen)|compa..a actual|^company$|^unternehmen$/i,'company'],[/(current|job).{0,10}title|aktuelle position|jobtitel|cargo actual|berufsbezeichnung/i,'title'],[/salary|gehalt|verg.tung|compensation|salari/i,'salary'],[/start date|earliest|eintritt|verf.gbar ab|available from|fr.hest|starttermin/i,'start']];
const NEVER=/passw|kennwort|user.?name|benutzer|login|captcha|otp|verification code|iban|\bcard\b|kreditkarte|konto|ssn|steuer-?id|ausweis|passport|reisepass/i;
const SKIP=/currency|w.hrung|referr|empfohlen|country code|vorwahl|extension|website|portfolio|github|twitter|xing/i;
const all=[];const walk=r=>r.querySelectorAll('*').forEach(e=>{if(/^(INPUT|SELECT|TEXTAREA)$/.test(e.tagName)&&!/^(hidden|submit|button|image|reset)$/.test(e.type))all.push(e);if(e.shadowRoot)walk(e.shadowRoot);if(e.tagName==='IFRAME'){try{if(e.contentDocument)walk(e.contentDocument)}catch(x){}}});walk(document);
const vis=e=>{const b=e.getBoundingClientRect();return b.width>0&&b.height>0};
const inner=e=>e.tagName==='INPUT'&&!/^(checkbox|radio)$/.test(e.type)&&(e.getAttribute('aria-hidden')==='true'||e.tabIndex<0);
const F=window.__F=all.filter(e=>e.type==='file'||(vis(e)&&!inner(e)));
const txt=e=>((e&&e.innerText)||'').trim().replace(/\s+/g,' ');
if(!F.length){const b=[...document.querySelectorAll('a,button')].filter(x=>/bewerb|apply|solicit|postul/i.test(x.innerText||'')).slice(0,4).map(x=>(x.innerText||'').trim().slice(0,30)+'>'+(x.getAttribute('href')||'button').slice(0,70));const f=[...document.querySelectorAll('iframe')].map(x=>{try{return new URL(x.src,location.href).hostname}catch(e){return ''}}).filter(Boolean);return ('NO FORM FIELDS ON THIS PAGE. apply links: '+b.join(' | ')+' || frames (open the form frame directly): '+f.join(', ')).replace(/[=&?]/g,'').slice(0,900)}
const lab=i=>{let l=i.labels&&i.labels.length?txt(i.labels[0]):'';
 if(!l){const id=(i.getAttribute('aria-labelledby')||'').split(' ')[0];const r=i.getRootNode();if(id&&r.getElementById)l=txt(r.getElementById(id))}
 if(!l)l=i.getAttribute('aria-label')||i.placeholder||'';
 if(!l){let e=i;for(let k=0;k<4&&!l;k++){e=e.parentElement||e.getRootNode().host;if(!e)break;const t=txt(e);if(t.length>2&&t.length<140)l=t}}
 return (l||i.name||i.id||'').slice(0,70)};
const sv=(el,v)=>{el.focus();Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,v);['input','change','blur'].forEach(e=>el.dispatchEvent(new Event(e,{bubbles:true,composed:true})))};
const done=[],todo=[],seen=new Set();let login=false;const DRY=!!window.__DRY;
F.forEach((i,n)=>{const L=lab(i),t=(i.type||'').toLowerCase(),tag=i.tagName;const req=(i.required||i.getAttribute('aria-required')==='true'||/[*✱]/.test(L))?'*':'';
 const keys=[L,i.name||'',i.id||'',i.getAttribute('autocomplete')||''];const hit=re=>keys.some(k=>re.test(k));
 if(t==='password'){login=true;return}
 if(t==='file'){const g=i.closest('[role=group],fieldset');let gl='';if(g){const id=(g.getAttribute('aria-labelledby')||'').split(' ')[0];gl=id?txt(i.getRootNode().getElementById(id)):txt(g.querySelector('legend'))}todo.push(n+':'+(gl||L).slice(0,40)+' #'+(i.id||i.name||'')+'[file'+((req||/[*✱]/.test(gl))?'*':'')+']');return}
 if(t==='checkbox'){if(!i.checked)todo.push(n+':'+L.slice(0,50)+'[checkbox'+req+']');return}
 if(t==='radio'){const g=i.name||L;if(seen.has(g))return;seen.add(g);if(!F.some(x=>x.type==='radio'&&x.name===i.name&&x.checked)){const box=i.closest('fieldset,[role=radiogroup],[role=group]');todo.push(n+':'+(box?txt(box.querySelector('legend')||box).slice(0,60):L)+'[radio'+req+']')}return}
 if(tag==='SELECT'){if(i.selectedIndex<=0)todo.push(n+':'+L+'[sel '+[...i.options].slice(1,6).map(o=>o.text.trim().slice(0,16)).join('/')+req+']');return}
 if(i.value)return;
 const pick=i.getAttribute('role')==='combobox'||i.getAttribute('aria-autocomplete')||i.getAttribute('list');
 let k=null;const K=keys.join(' ');
 if(tag==='INPUT'&&!NEVER.test(K)&&!SKIP.test(K)&&!i.readOnly&&!i.disabled&&/^(text|email|tel|url|number|search|date|)$/.test(t)){for(const [re,key] of R){if(hit(re)){k=key;break}}}
 if(k&&!pick){let v=P[k];
  if(k==='phone'){const p=F[n-1];if(p&&(p.tagName==='SELECT'||p.getAttribute('role')==='combobox')&&/country|land|code|vorwahl|region/i.test(lab(p)+' '+(p.name||'')))v=P.local}
  if(k==='salary'&&(t==='number'||/numeric|decimal/.test(i.inputMode||'')))v=P.salaryNum;
  if(k==='start'){if(t==='date')v=P.startIso;else if(/pick|mm|dd|yyyy|tt|jjjj/i.test(i.placeholder||''))v=null}
  if(v){if(DRY)done.push(k+'<'+L.slice(0,22)+'>');else{sv(i,v);done.push(k)}return}}
 if(NEVER.test(K))return;
 todo.push(n+':'+L+'['+(tag==='TEXTAREA'?'textarea':t||'text')+(pick?' pick':'')+req+']')});
const human=!!document.querySelector('iframe[src*=captcha],iframe[src*=turnstile],.h-captcha,.g-recaptcha,[data-sitekey],frc-captcha,.frc-captcha,.cf-turnstile,iframe[src*=cloudflare]');
return ((login?'LOGIN OR ACCOUNT FORM: stop and hand to the candidate. ':'')+(human?'Human check on page (may be invisible; hand off if it blocks). ':'')+(DRY?'DRY RUN, nothing filled. would fill ':'filled ')+done.length+': '+done.join(', ')+' || todo '+todo.length+': '+todo.join(' | ')).replace(/[=&?]/g,'').slice(0,2600)})()
