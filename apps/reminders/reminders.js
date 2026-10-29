/* reminders.js: tampilan, sheet, dan alarm. Butuh reminders.data.js dimuat lebih dulu */
const $=s=>document.querySelector(s);
const SVG={
  today:'<svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/></svg>',
  sched:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/></svg>',
  all:'<svg viewBox="0 0 24 24"><path d="M4 13l3-7h10l3 7v5a1 1 0 01-1 1H5a1 1 0 01-1-1z"/><path d="M4 13h5a3 3 0 006 0h5"/></svg>',
  flag:'<svg viewBox="0 0 24 24"><path d="M6 21V4M6 5h11l-2 4 2 4H6"/></svg>',
  done:'<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  list:'<svg viewBox="0 0 24 24"><path d="M9 7h10M9 12h10M9 17h10M5 7h.01M5 12h.01M5 17h.01"/></svg>'
};
let cur=null,showDone=false,editing=null,tick=0;
function render(){
  const v=$('#view');
  if(!cur){
    const open=S.items.filter(i=>!i.done);
    let h=`<div class="top"><span></span><button class="pill glass" id="doneToggle">${S.items.filter(i=>i.done).length?'Selesai ('+S.items.filter(i=>i.done).length+')':'Selesai'}</button></div><h1>Pengingat</h1><div class="grid">`;
    SMART.forEach(s=>{h+=`<button class="tile glass" data-open="${s.id}"><div class="row"><div class="ico" style="background:${s.c}">${SVG[s.id]}</div><span class="count">${S.items.filter(s.f).length}</span></div><span class="name">${s.name}</span></button>`});
    h+=`</div><h2>Daftarku</h2><div class="lists glass">`;
    h+=S.lists.map(l=>`<button class="lrow" data-open="${l.id}"><div class="ico" style="background:${l.c}">${SVG.list}</div><span class="t">${esc(l.name)}</span><span class="n">${open.filter(i=>i.list===l.id).length}</span></button>`).join('');
    v.innerHTML=h+'</div>';
    $('#doneToggle').onclick=()=>{cur='done';render()};
    v.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{cur=b.dataset.open;showDone=false;render();v.scrollTop=0});
    return;
  }
  let name,c,items,custom=false;
  const sm=SMART.find(s=>s.id===cur),lst=S.lists.find(l=>l.id===cur);
  if(cur==='done'){name='Selesai';c='#8e8e93';items=S.items.filter(i=>i.done)}
  else if(sm){name=sm.name;c=sm.c;items=S.items.filter(sm.f)}
  else if(lst){name=lst.name;c=lst.c;custom=true;items=S.items.filter(i=>i.list===lst.id&&!i.done)}
  else{cur=null;return render()}
  items.sort((a,b)=>(a.due||'9')<(b.due||'9')?-1:1);
  const dn=custom?S.items.filter(i=>i.list===lst.id&&i.done):[];
  document.documentElement.style.setProperty('--accent',c);
  let h=`<div class="top"><button class="pill glass" id="back">‹ Daftar</button>${custom?'<button class="pill glass" id="editL">Ubah</button>':''}</div><h1 style="color:${c}">${esc(name)}</h1>`;
  h+=items.length?`<div class="items glass">${items.map(row).join('')}</div>`:`<div class="empty glass" style="border-radius:26px">Belum ada pengingat.<br>Ketuk “Pengingat Baru” untuk menambah.</div>`;
  if(dn.length){h+=`<div class="ghead"><h2>Selesai (${dn.length})</h2><button class="pill" id="showD" style="padding:6px 10px;background:none">${showDone?'Sembunyikan':'Tampilkan'}</button></div>`;
    if(showDone)h+=`<div class="items glass">${dn.map(row).join('')}</div>`}
  v.innerHTML=h;
  $('#back').onclick=()=>{cur=null;document.documentElement.style.setProperty('--accent','#0a84ff');render()};
  if($('#editL'))$('#editL').onclick=()=>listSheet(lst);
  if($('#showD'))$('#showD').onclick=()=>{showDone=!showDone;render()};
  v.querySelectorAll('.chk').forEach(b=>b.onclick=()=>{const it=S.items.find(i=>i.id===b.dataset.id);it.done=!it.done;save();b.parentElement.classList.toggle('done',it.done);setTimeout(render,320)});
  v.querySelectorAll('.body').forEach(b=>b.onclick=()=>itemSheet(S.items.find(i=>i.id===b.dataset.id)));
}
function row(i){
  const l=S.lists.find(x=>x.id===i.list);
  const meta=[fmt(i.due),(cur!==i.list&&l)?l.name:''].filter(Boolean).join(' · ');
  return `<div class="it ${i.done?'done':''}"><button class="chk" data-id="${i.id}" aria-label="Tandai selesai">${SVG.done}</button>
  <div class="body" data-id="${i.id}"><div class="ttl">${i.flag?'<span class="flag">⚑ </span>':''}${esc(i.title)}</div>
  ${i.notes?`<div class="meta">${esc(i.notes)}</div>`:''}${meta?`<div class="meta ${isLate(i)?'late':''}">${esc(meta)}</div>`:''}</div></div>`;
}
/* sheet */
function openSheet(html){const s=$('#sheet');s.innerHTML=html;$('#scrim').classList.add('on');requestAnimationFrame(()=>s.classList.add('on'))}
function closeSheet(){$('#sheet').classList.remove('on');$('#scrim').classList.remove('on');editing=null}
$('#scrim').onclick=closeSheet;
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet()});
function itemSheet(it){
  const isNew=!it;editing=it;
  const defList=(S.lists.find(l=>l.id===cur)||S.lists.find(l=>l.id===S.last)||S.lists[0]).id;
  const d=it||{title:'',notes:'',due:'',flag:false,list:defList,hasDate:false};
  const dv=d.due?d.due.slice(0,10):'',tv=d.due&&d.due.length>10?d.due.slice(11,16):'';
  const todayStr=cur==='today'&&isNew?new Date().toLocaleDateString('sv'):'';
  openSheet(`<div class="hd"><button class="pill" id="cx">Batal</button><b>${isNew?'Pengingat Baru':'Detail'}</b><button class="pill go" id="ok" ${d.title?'':'disabled'}>${isNew?'Tambah':'Simpan'}</button></div>
  <div class="card"><input type="text" id="fT" placeholder="Judul" value="${esc(d.title)}"><textarea id="fN" placeholder="Catatan">${esc(d.notes||'')}</textarea></div>
  <div class="card"><div class="f"><span>Tanggal</span><input type="date" id="fD" value="${dv||todayStr}"></div>
  <div class="f"><span>Waktu</span><input type="time" id="fH" value="${tv}"></div>
  <div class="f"><span>Daftar</span><select id="fL">${S.lists.map(l=>`<option value="${l.id}" ${l.id===d.list?'selected':''}>${esc(l.name)}</option>`).join('')}</select></div>
  <div class="f"><span>Tandai</span><input type="checkbox" class="sw" id="fF" ${d.flag?'checked':''}></div></div>
  ${isNew?'':'<button class="del glass" id="rm">Hapus Pengingat</button>'}`);
  const t=$('#fT');t.oninput=()=>$('#ok').disabled=!t.value.trim();
  if(isNew)setTimeout(()=>t.focus(),350);
  t.onkeydown=e=>{if(e.key==='Enter'&&t.value.trim())$('#ok').click()};
  $('#cx').onclick=closeSheet;
  $('#ok').onclick=()=>{
    const date=$('#fD').value,time=$('#fH').value;
    const o={title:t.value.trim(),notes:$('#fN').value.trim(),flag:$('#fF').checked,list:$('#fL').value,due:date?(time?date+'T'+time:date):'',notified:false};
    if(isNew){S.items.push({id:uid(),done:false,...o})}else Object.assign(it,o);
    S.last=o.list;save();closeSheet();render();
    if(o.due.length>10&&'Notification' in window&&Notification.permission==='default')Notification.requestPermission();
  };
  if(!isNew)$('#rm').onclick=()=>{S.items=S.items.filter(i=>i!==it);save();closeSheet();render()};
}
function listSheet(l){
  const isNew=!l;let col=l?l.c:COLORS[4];
  openSheet(`<div class="hd"><button class="pill" id="cx">Batal</button><b>${isNew?'Daftar Baru':'Ubah Daftar'}</b><button class="pill go" id="ok" ${l?'':'disabled'}>Selesai</button></div>
  <div class="card"><input type="text" id="fT" placeholder="Nama daftar" value="${l?esc(l.name):''}"><div class="colors">${COLORS.map(c=>`<button data-c="${c}" style="background:${c}" class="${c===col?'sel':''}" aria-label="Warna"></button>`).join('')}</div></div>
  ${isNew||S.lists.length<2?'':'<button class="del glass" id="rm">Hapus Daftar</button>'}`);
  const t=$('#fT');t.oninput=()=>$('#ok').disabled=!t.value.trim();if(isNew)setTimeout(()=>t.focus(),350);
  t.onkeydown=e=>{if(e.key==='Enter'&&t.value.trim())$('#ok').click()};
  document.querySelectorAll('.colors button').forEach(b=>b.onclick=()=>{col=b.dataset.c;document.querySelectorAll('.colors button').forEach(x=>x.classList.toggle('sel',x===b))});
  $('#cx').onclick=closeSheet;
  $('#ok').onclick=()=>{if(isNew)S.lists.push({id:uid(),name:t.value.trim(),c:col});else{l.name=t.value.trim();l.c=col}save();closeSheet();render()};
  if($('#rm'))$('#rm').onclick=()=>{if(!confirm('Hapus daftar ini beserta semua pengingatnya?'))return;S.items=S.items.filter(i=>i.list!==l.id);S.lists=S.lists.filter(x=>x!==l);cur=null;document.documentElement.style.setProperty('--accent','#0a84ff');save();closeSheet();render()};
}
$('#addR').onclick=()=>itemSheet(null);
$('#addL').onclick=()=>listSheet(null);
/* alarm */
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),4500)}
function check(){
  const now=new Date();let ch=false;
  S.items.forEach(i=>{
    if(!i.done&&i.due&&i.due.length>10&&!i.notified&&new Date(i.due)<=now){
      i.notified=true;ch=true;toast('⏰ '+i.title);
      try{if('Notif' in window&&Notification.permission==='granted')Notif.show({ title: 'Pengingat', body: i.title })}catch(e){}
    }
  });
  if(ch){save();if(!$('#sheet').classList.contains('on'))render()}
}
setInterval(check,15000);check();
render();