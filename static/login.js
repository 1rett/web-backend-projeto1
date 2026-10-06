let modo='entrar';
const formulario=$('form');
const erro=$('erro');
const EMAILS_PREDEFINIDOS=[
 'rafaelrett@gmail.com',
 'geovaniklocher@gmail.com',
 'willianwatanabe@gmail.com',
 'neymarjr@gmail.com'
];

function atualizarModo(){
 const cadastro=modo==='criar';
 $('campoNome').hidden=!cadastro;
 $('nome').required=cadastro;
 $('campoSenha').hidden=cadastro;
 $('senha').required=!cadastro;
 $('titulo').textContent=cadastro?'Criar conta de demonstração':'Entrar';
 $('descricao').textContent=cadastro
  ?'Esta conta é fictícia e ficará somente neste navegador.'
  :'Use o e-mail e a senha temporária de um dos quatro usuários do catálogo.';
 $('enviar').textContent=cadastro?'Criar demonstração':'Entrar';
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

formulario.addEventListener('submit',async evento=>{
 evento.preventDefault();
 erro.textContent='';
 $('enviar').disabled=true;
 const email=$('email').value.trim().toLowerCase();

 try{
  if(modo==='criar'){
   const nome=$('nome').value.trim();
   if(nome.length<2){
    erro.textContent='Digite seu nome para criar a conta demonstrativa.';
    return;
   }
   if(EMAILS_PREDEFINIDOS.includes(email)){
    erro.textContent='Esse e-mail pertence a uma conta fixa do catálogo; use a opção "Já tenho conta".';
    return;
   }
   const contas=JSON.parse(localStorage.getItem('contas')||'[]');
   if(!Array.isArray(contas))throw new Error('A lista de contas locais está inválida.');
   if(contas.some(conta=>conta.email===email)){
    erro.textContent='Este e-mail já tem uma conta demonstrativa neste navegador.';
    return;
   }
   const usuario={id:Date.now(),nome,email,demonstracao:true};
   localStorage.setItem('contas',JSON.stringify([...contas,usuario]));
   localStorage.setItem('usuario',JSON.stringify(usuario));
   location.href='/';
   return;
  }

  const resposta=await fetch('/api/auth/login',{
   method:'POST',
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify({email,senha:$('senha').value})
  });
  const resultado=await lerRespostaJson(resposta);
  gravar('usuario',resultado.usuario);
  location.href='/';
 }catch(falha){
  if(falha.status===401){
   erro.textContent='E-mail ou senha incorretos. Contas demonstrativas locais não podem entrar por este formulário.';
  }else if(modo==='criar'){
   console.error('Falha ao salvar a conta demonstrativa no navegador:',falha);
   erro.textContent='Não foi possível salvar os dados demonstrativos neste navegador.';
  }else{
   console.error('Falha ao entrar na conta:',falha);
   erro.textContent='Não foi possível entrar. Verifique se o servidor e o MySQL estão funcionando.';
  }
 }finally{
  $('enviar').disabled=false;
 }
});

async function carregarSessao(){
 try{
  const resposta=await fetch('/api/auth/me');
  const resultado=await lerRespostaJson(resposta);
  const usuario=resultado.usuario||(
   ler('usuario',null)?.demonstracao?ler('usuario',null):null
  );
  if(!usuario){
   atualizarModo();
   return;
  }

  $('titulo').textContent=`Olá, ${usuario.nome.split(' ')[0]}`;
  $('descricao').textContent=usuario.demonstracao
   ?`Conta fictícia local: ${usuario.email}. Ela não é um usuário do banco.`
   :`Você está conectado como ${usuario.email}.`;
  formulario.innerHTML='<button class="cta" type="button" id="sair">Sair da conta</button>';
  document.querySelector('.tabs').hidden=true;
  $('sair').addEventListener('click',async()=>{
   $('sair').disabled=true;
   try{
    if(usuario.demonstracao){
     localStorage.removeItem('usuario');
    }else{
     const logout=await fetch('/api/auth/logout',{method:'POST'});
     await lerRespostaJson(logout);
     localStorage.removeItem('usuario');
    }
    location.reload();
   }catch(falha){
    console.error('Falha ao encerrar sessão:',falha);
    erro.textContent='Não foi possível sair. Tente novamente.';
    $('sair').disabled=false;
   }
  });
 }catch(falha){
  console.error('Falha ao consultar a sessão:',falha);
  erro.textContent='Não foi possível verificar a sessão. Verifique o servidor e o MySQL.';
 }
}

carregarSessao();
