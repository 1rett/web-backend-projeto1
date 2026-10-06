let modo = 'entrar';
const formulario = $('form');
const erro = $('erro');
const descricao = $('descricao');

function atualizarModo() {
 const cadastro = modo === 'criar';
 $('campoNome').hidden = !cadastro;
 $('nome').required = cadastro;
 $('senha').autocomplete = cadastro ? 'new-password' : 'current-password';
 $('senha').setAttribute('minlength', cadastro ? '8' : '1');
 $('titulo').textContent = cadastro ? 'Criar conta' : 'Entrar';
 descricao.textContent = cadastro
  ? 'Crie sua conta para comprar.'
  : 'Acesse sua conta para comprar.';
 $('enviar').textContent = cadastro ? 'Criar conta' : 'Entrar';
 document.querySelectorAll('.tabs .chip').forEach(botao => {
  botao.setAttribute('aria-pressed', botao.dataset.m === modo);
 });
 erro.textContent = '';
}

document.querySelector('.tabs').addEventListener('click', evento => {
 const botao = evento.target.closest('[data-m]');
 if (!botao) return;
 modo = botao.dataset.m;
 atualizarModo();
});

formulario.addEventListener('submit', async evento => {
 evento.preventDefault();
 erro.textContent = '';
 $('enviar').disabled = true;

 const dados = {
  email: $('email').value.trim(),
  senha: $('senha').value
 };
 if (modo === 'criar') dados.nome = $('nome').value.trim();

 try {
  const resposta = await fetch(`/api/auth/${modo === 'criar' ? 'register' : 'login'}`, {
   method: 'POST',
   headers: {'Content-Type': 'application/json'},
   body: JSON.stringify(dados)
  });
  const resultado = await resposta.json();
  if (!resposta.ok) {
   erro.textContent = resultado.erro || 'Não foi possível acessar sua conta.';
   return;
  }
  location.href = '/';
 } catch (falha) {
  console.error('Falha ao comunicar com o servidor de autenticação:', falha);
  erro.textContent = 'Não foi possível conectar ao servidor. Tente novamente.';
 } finally {
  $('enviar').disabled = false;
 }
});

async function mostrarSessaoAtual() {
 try {
  const resposta = await fetch('/api/auth/me');
  if (!resposta.ok) throw new Error(`Resposta HTTP ${resposta.status}`);
  const resultado = await resposta.json();
  if (!resultado.usuario) {
   atualizarModo();
   return;
  }

  $('titulo').textContent = `Olá, ${resultado.usuario.nome.split(' ')[0]}`;
  descricao.textContent = `Você está conectado como ${resultado.usuario.email}.`;
  formulario.innerHTML = '<button class="cta" type="button" id="sair">Sair da conta</button>';
  document.querySelector('.tabs').hidden = true;
  $('sair').addEventListener('click', async () => {
   $('sair').disabled = true;
   try {
    const respostaLogout = await fetch('/api/auth/logout', {method: 'POST'});
    if (!respostaLogout.ok) throw new Error(`Resposta HTTP ${respostaLogout.status}`);
    location.reload();
   } catch (falha) {
    console.error('Falha ao encerrar sessão:', falha);
    erro.textContent = 'Não foi possível sair da conta. Tente novamente.';
    $('sair').disabled = false;
   }
  });
 } catch (falha) {
  console.error('Falha ao consultar sessão:', falha);
  erro.textContent = 'Não foi possível verificar sua sessão. Atualize a página e tente novamente.';
 }
}

mostrarSessaoAtual();
