/* reminders.data.js: data, penyimpanan (localStorage), dan helper tanggal */
const COLORS=['#ff3b30','#ff9500','#ffcc00','#30d158','#0a84ff','#bf5af2','#ff2d55'];
const SMART=[
 {id:'today',name:'Hari Ini',c:'#0a84ff',f:i=>!i.done&&i.due&&new Date(i.due)<=endOfDay()},
 {id:'sched',name:'Terjadwal',c:'#ff3b30',f:i=>!i.done&&i.due},
 {id:'all',name:'Semua',c:'#5e5ce6',f:i=>!i.done},
 {id:'flag',name:'Bertanda',c:'#ff9500',f:i=>!i.done&&i.flag}
];
let S;
try{S=JSON.parse(localStorage.getItem('pengingat.v1'))}catch(e){}
if(!S||!S.lists)S={lists:[{id:'l1',name:'Pengingat',c:'#0a84ff'}],items:[],last:'l1'};
const save=()=>{try{localStorage.setItem('pengingat.v1',JSON.stringify(S))}catch(e){}};
const uid=()=>Math.random().toString(36).slice(2,9);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function endOfDay(){const d=new Date();d.setHours(23,59,59,999);return d}
function fmt(due){
  if(!due)return '';
  const d=new Date(due),n=new Date(),t=new Date(n.getFullYear(),n.getMonth(),n.getDate());
  const dd=new Date(d.getFullYear(),d.getMonth(),d.getDate()),diff=Math.round((dd-t)/864e5);
  const jam=d.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'}).replace('.',':');
  const hasTime=due.length>10;
  let day=diff===0?'Hari ini':diff===1?'Besok':diff===-1?'Kemarin':d.toLocaleDateString('id-ID',{weekday:'short',day:'numeric',month:'short'});
  return day+(hasTime?', '+jam:'');
}
const isLate=i=>!i.done&&i.due&&(i.due.length>10?new Date(i.due)<new Date():new Date(i.due)<new Date(new Date().setHours(0,0,0,0)));