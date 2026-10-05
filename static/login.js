// Login simulado: a tabela usuarios tem só nome e e-mail, então entramos pelo e-mail
let modo='entrar';const f=$('form'),erro=$('erro');
function modoTela(){const c=modo==='criar';
 $('campoNome').style.display=c?'block':'none';$('titulo').textContent=c?'Criar conta':'Entrar';$('enviar').textContent=c?'Criar conta':'Entrar';
 document.querySelectorAll('.tabs .chip').forEach(b=>b.setAttribute('aria-pressed',b.dataset.m===modo));erro.textContent=''}
document.querySelector('.tabs').onclick=e=>{if(e.target.dataset.m){modo=e.target.dataset.m;modoTela()}};
f.onsubmit=e=>{e.preventDefault();
 const nome=$('nome').value.trim(),email=$('email').value.trim().toLowerCase(),lista=todosUsuarios(),ex=lista.find(u=>u.email===email);
 if(!/^\S+@\S+\.\S+$/.test(email))return erro.textContent='Digite um e-mail válido, como nome@email.com.';
 if(modo==='entrar'){if(!ex)return erro.textContent='E-mail não cadastrado. Use "Sou novo aqui" para criar a conta.';gravar('usuario',ex)}
 else{if(nome.length<2)return erro.textContent='Digite seu nome completo.';if(ex)return erro.textContent='Este e-mail já está cadastrado. Use "Já tenho conta".';
  const n={id:100+lista.length,nome,email};gravar('contas',ler('contas',[]).concat(n));gravar('usuario',n)}
 location.href='index.html'};
const u=ler('usuario',null);
if(u){$('titulo').textContent='Olá, '+u.nome.split(' ')[0];f.innerHTML='<p class="sub">Você está conectado como '+u.email+'.</p><button class="cta" type="button" id="sair">Sair da conta</button>';
 $('sair').onclick=()=>{try{localStorage.removeItem('usuario')}catch(e){}location.reload()};document.querySelector('.tabs').style.display='none'}
else modoTela();
