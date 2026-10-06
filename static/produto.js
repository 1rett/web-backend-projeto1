const main=$('produto');
const produtoId=Number(main.dataset.produtoId);

async function carregarProduto(){
 main.innerHTML='<p class="vazio">Carregando produto...</p>';
 try{
  const resposta=await fetch(`/api/produtos/${produtoId}`);
   const produto=await lerRespostaJson(resposta);
  produtosAtuais=[produto];
  document.title=`${produto.titulo} – Arquibancada`;
  main.innerHTML=`<a class="back" href="/">← Voltar para a loja</a>
   <div class="prod"><div class="pic">${foto(produto)}</div>
   <div><small>${escaparHtml(produto.categoria||'Sem categoria')}</small><h1>${escaparHtml(produto.titulo)}</h1><div class="price">${R(Number(produto.preco))}</div><small>ou 6x de ${R(Number(produto.preco)/6)} sem juros</small>
   <ul><li>${escaparHtml(produto.descricao||'Sem descrição.')}</li><li>Vendido por <a href="/usuarios/${Number(produto.usuario_id)}">${escaparHtml(produto.vendedor_nome)}</a></li></ul>
   <button class="add cta" id="add" style="border:0;width:100%">Adicionar ao carrinho</button></div></div>`;
  $('add').addEventListener('click',()=>adicionar(produto.id));
 }catch(erro){
  if(erro.status===404){
   main.innerHTML='<div class="box"><h1>Produto não encontrado</h1><p class="sub">Volte à loja e escolha um produto disponível.</p><a class="cta" href="/">Ver produtos</a></div>';
   return;
  }
  console.error('Falha ao consultar o produto na API:',erro);
  main.innerHTML='<div class="box"><h1>Erro ao carregar produto</h1><p class="sub">Verifique se o servidor e o MySQL estão funcionando.</p><a class="cta" href="/">Voltar para a loja</a></div>';
 }
}

carregarProduto();
