const perfil=$('perfil');
const perfilId=Number(perfil.dataset.usuarioId);

async function carregarPerfil(){
 try{
  const resposta=await fetch(`/api/usuarios/${perfilId}`);
   const resultado=await lerRespostaJson(resposta);

  document.title=`${resultado.nome} – Arquibancada`;
  produtosAtuais=resultado.produtos;
  perfil.innerHTML=`<a class="back" href="/">← Voltar para a loja</a>
   <h1>${escaparHtml(resultado.nome)}</h1>
   <p class="sub2">${escaparHtml(resultado.email)}</p>
   <h2>Produtos publicados</h2>
   <div class="grid">${resultado.produtos.length?resultado.produtos.map(produto=>`
    <article class="card">
     <a class="pic" href="/produto/${Number(produto.id)}" aria-label="Ver ${escaparHtml(produto.titulo)}">${foto(produto)}</a>
     <div class="info"><small>${escaparHtml(produto.estado)} · ${escaparHtml(produto.categoria||'Série A 2026')}</small>
      <h3><a href="/produto/${Number(produto.id)}">${escaparHtml(produto.titulo)}</a></h3>
      <small>ID ${Number(produto.id)} · Estoque: ${Number(produto.estoque)}</small>
      <div class="price">${R(Number(produto.preco))}</div>
      <button class="add" data-id="${Number(produto.id)}" ${Number(produto.estoque)<=0?'disabled':''}>${Number(produto.estoque)>0?'Adicionar ao carrinho':'Sem estoque'}</button>
     </div>
    </article>`).join(''):'<p class="vazio">Este usuário ainda não publicou produtos.</p>'}</div>`;
  perfil.addEventListener('click',evento=>{
   const botao=evento.target.closest('[data-id]');
   if(botao)adicionar(botao.dataset.id);
  });
 }catch(erro){
  if(erro.status===404){
   perfil.innerHTML='<p class="vazio">Usuário não encontrado.</p>';
   return;
  }
  console.error('Falha ao consultar o perfil na API:',erro);
  perfil.innerHTML='<p class="vazio">Não foi possível carregar o perfil. Verifique se o servidor e o MySQL estão funcionando.</p>';
 }
}

carregarPerfil();
