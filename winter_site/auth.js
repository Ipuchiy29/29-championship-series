(async()=>{
const login=document.getElementById('loginOpen'),logout=document.getElementById('logoutOpen'),admin=document.getElementById('adminOpen'),dlg=document.getElementById('loginDialog');
async function status(){try{const r=await fetch('/api/session');const x=await r.json();admin.hidden=!x.admin;logout.hidden=!x.admin;login.hidden=!!x.admin}catch(e){admin.hidden=true;logout.hidden=true;login.hidden=false}}
login.onclick=()=>dlg.showModal();document.getElementById('loginCancel').onclick=()=>dlg.close();
document.getElementById('loginForm').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);const r=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:f.get('username'),password:f.get('password')})});if(r.ok){dlg.close();e.target.reset();document.getElementById('loginError').textContent='';await status()}else document.getElementById('loginError').textContent='Неверные данные для входа'};
logout.onclick=async()=>{await fetch('/api/logout',{method:'POST'});await status()};await status();
})();