let modo='entrar';
const formulario=$('form');
const erro=$('erro');

function atualizarModo(){
 const cadastro=modo==='criar';
 $('campoNome').hidden=!cadastro;
 $('nome').required=cadastro;
 $('titulo').textContent=cadastro?'Criar conta':'Entrar';
 $('descricao').textContent=cadastro?'Crie sua conta para comprar.':'Acesse sua conta para comprar.';
 $('enviar').textContent=cadastro?'Criar conta':'Entrar';
 document.querySelectorAll('.tabs .chip').forEach(botao=>{
  botao.setAttribute('aria-pressed',botao.dataset.m===modo);
 });
 erro.textContent='';
}

document.querySelector('.tabs').addEventListener('click',evento=>{
 const botao=evento.target.closest('[data-m]');
 if(!botao)return;
 modo=botao.dataset.m;
 atualizarModo();
});

formulario.addEventListener('submit',evento=>{
 evento.preventDefault();
 erro.textContent='';
 const nome=$('nome').value.trim();
 const email=$('email').value.trim().toLowerCase();
 if(!/^\S+@\S+\.\S+$/.test(email)){
  erro.textContent='Digite um e-mail válido, como nome@email.com.';
  return;
 }

 try{
  const contas=JSON.parse(localStorage.getItem('contas')||'[]');
  if(!Array.isArray(contas))throw new Error('Os dados de contas salvos estão inválidos.');
  const existente=contas.find(conta=>conta.email===email);
  let usuario;
  if(modo==='entrar'){
   if(!existente){
    erro.textContent='E-mail não cadastrado neste navegador. Use "Sou novo aqui" para criar a conta.';
    return;
   }
   usuario=existente;
  }else{
   if(nome.length<2){
    erro.textContent='Digite seu nome completo.';
    return;
   }
   if(existente){
    erro.textContent='Este e-mail já está cadastrado. Use "Já tenho conta".';
    return;
   }
   usuario={id:Date.now(),nome,email};
   localStorage.setItem('contas',JSON.stringify([...contas,usuario]));
  }
  localStorage.setItem('usuario',JSON.stringify(usuario));
  location.href='/';
 }catch(falha){
  console.error('Não foi possível acessar as contas salvas neste navegador:',falha);
  erro.textContent='Não foi possível salvar ou ler a conta neste navegador.';
 }
});

const usuario=ler('usuario',null);
if(usuario){
 $('titulo').textContent='Olá, '+usuario.nome.split(' ')[0];
 $('descricao').textContent='Você está conectado como '+usuario.email+'.';
 formulario.innerHTML='<button class="cta" type="button" id="sair">Sair da conta</button>';
 document.querySelector('.tabs').hidden=true;
 $('sair').addEventListener('click',()=>{
  try{
   localStorage.removeItem('usuario');
   location.reload();
  }catch(falha){
   console.error('Não foi possível encerrar a sessão local:',falha);
   erro.textContent='Não foi possível sair da conta neste navegador.';
  }
 });
}else{
 atualizarModo();
}
