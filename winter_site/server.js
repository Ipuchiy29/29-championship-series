'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=__dirname, port=Number(process.env.PORT||3000), user=process.env.ADMIN_USER,pass=process.env.ADMIN_PASSWORD;
if(!user||!pass||pass.length<12){console.error('Set ADMIN_USER and ADMIN_PASSWORD (at least 12 characters)');process.exit(1)}
const secret=crypto.randomBytes(32),sessions=new Map(),dataFile=path.join(root,'server-data.json');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'};
function json(res,code,obj){res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(obj))}
function body(req){return new Promise((resolve,reject)=>{let s='';req.on('data',c=>{s+=c;if(s.length>1000000){reject(Error('Too large'));req.destroy()}});req.on('end',()=>{try{resolve(JSON.parse(s))}catch(e){reject(e)}});req.on('error',reject)})}
function auth(req){const token=(req.headers.cookie||'').match(/(?:^|;\s*)session=([a-f0-9]+)/)?.[1];return token&&sessions.get(token)>Date.now()?token:null}
const sameOrigin=req=>{const origin=req.headers.origin;if(!origin)return true;try{return new URL(origin).host===req.headers.host}catch{return false}};
http.createServer(async(req,res)=>{const u=new URL(req.url,'http://localhost');try{
if(u.pathname.startsWith('/api/')){
if(req.method==='GET'&&u.pathname==='/api/session')return json(res,200,{admin:!!auth(req)});
if(req.method==='POST'&&u.pathname==='/api/login'){
if(!sameOrigin(req))return json(res,403,{error:'origin'});
const b=await body(req);const ok=typeof b.username==='string'&&typeof b.password==='string'&&crypto.timingSafeEqual(crypto.createHash('sha256').update(b.username+'\0'+b.password).digest(),crypto.createHash('sha256').update(user+'\0'+pass).digest());
if(!ok)return json(res,401,{error:'Invalid credentials'});
const token=crypto.randomBytes(32).toString('hex');sessions.set(token,Date.now()+86400000);res.setHeader('Set-Cookie',`session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=86400${process.env.COOKIE_SECURE==='true'?' ; Secure':''}`);return json(res,200,{ok:true});}
if(req.method==='POST'&&u.pathname==='/api/logout'){const token=auth(req);if(token)sessions.delete(token);res.setHeader('Set-Cookie','session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');return json(res,200,{ok:true})}
if(req.method==='GET'&&u.pathname==='/api/data'){if(!fs.existsSync(dataFile))return json(res,404,{error:'Not initialized'});return json(res,200,JSON.parse(fs.readFileSync(dataFile,'utf8')))}
if(req.method==='PUT'&&u.pathname==='/api/data'){if(!sameOrigin(req)||!auth(req))return json(res,403,{error:'Forbidden'});const d=await body(req);if(!d||!d.groups||!Array.isArray(d.groups.A)||!Array.isArray(d.groups.B)||!Array.isArray(d.matches))return json(res,400,{error:'Invalid data'});const tmp=dataFile+'.tmp';fs.writeFileSync(tmp,JSON.stringify(d,null,2));fs.renameSync(tmp,dataFile);return json(res,200,{ok:true})}
return json(res,404,{error:'Not found'})}
if(req.method!=='GET'&&req.method!=='HEAD')return json(res,405,{error:'Method not allowed'});
let file=path.resolve(root,'.'+decodeURIComponent(u.pathname==='/'?'/index.html':u.pathname));if(!file.startsWith(root+path.sep))return json(res,403,{error:'Forbidden'});
if(path.basename(file)==='server-data.json'||path.basename(file).startsWith('.'))return json(res,403,{error:'Forbidden'});
fs.readFile(file,(err,b)=>{if(err){res.writeHead(404);return res.end('Not found')}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:b)})
}catch(e){json(res,400,{error:'Bad request'})}
}).listen(port,'0.0.0.0',()=>console.log('29 Championship Series listening on '+port));
