const CATEGORIAS=['Todos','Times de SP','Times do RJ'];
const PRODUTOS_POR_PAGINA=8;
let categoria=new URLSearchParams(location.search).get('cat')||'Todos';
let busca='';
let pagina=1;
let temporizadorBusca;
let requisicaoAtual=0;

$('heroShirts').innerHTML=CAMISAS_DESTAQUE.map(camisa).join('');

function desenharCategorias(){
 $('chips').innerHTML=CATEGORIAS.map(item=>
  `<button class="chip" aria-pressed="${item===categoria}" data-categoria="${escaparHtml(item)}">${escaparHtml(item)}</button>`
 ).join('');
}

function desenharProdutos(produtos){
 $('grid').innerHTML=produtos.length?produtos.map(produto=>`
  <article class="card">
   <a class="pic" href="/produto/${Number(produto.id)}" aria-label="Ver ${escaparHtml(produto.titulo)}">${foto(produto)}</a>
   <div class="info">
    <small>${escaparHtml(produto.categoria||'Sem categoria')}</small>
    <h3><a href="/produto/${Number(produto.id)}">${escaparHtml(produto.titulo)}</a></h3>
    <span class="sel">Vendido por <a href="/usuarios/${Number(produto.usuario_id)}">${escaparHtml(produto.vendedor_nome)}</a></span>
    <div class="price">${R(Number(produto.preco))}</div>
    <button class="add" data-id="${Number(produto.id)}">Adicionar ao carrinho</button>
   </div>
  </article>`
 ).join(''):'<p class="vazio">Nenhum produto encontrado. Tente outro termo ou categoria.</p>';
}

function desenharPaginacao(resultado){
 const total=resultado.total_paginas;
 $('paginacao').innerHTML=total>1?`
  <button class="chip" data-pagina="${pagina-1}" ${pagina<=1?'disabled':''}>Anterior</button>
  <span>Página ${resultado.pagina} de ${total}</span>
  <button class="chip" data-pagina="${pagina+1}" ${pagina>=total?'disabled':''}>Próxima</button>`
  :'';
}

async function carregarProdutos(){
 const requisicao=++requisicaoAtual;
 const parametros=new URLSearchParams({
  busca,
  pagina:String(pagina),
  por_pagina:String(PRODUTOS_POR_PAGINA)
 });
 if(categoria!=='Todos')parametros.set('categoria',categoria);
 $('grid').innerHTML='<p class="vazio">Carregando produtos...</p>';
 $('paginacao').replaceChildren();

 try{
  const resposta=await fetch(`/api/produtos?${parametros}`);
  if(requisicao!==requisicaoAtual)return;
  const resultado=await lerRespostaJson(resposta);
  produtosAtuais=resultado.produtos;
  desenharProdutos(produtosAtuais);
  desenharPaginacao(resultado);
 }catch(erro){
  if(requisicao!==requisicaoAtual)return;
  console.error('Falha ao consultar os produtos na API:',erro);
  produtosAtuais=[];
  $('grid').innerHTML='<p class="vazio">Não foi possível carregar os produtos. Verifique se o servidor e o MySQL estão funcionando.</p>';
 }
}

$('chips').addEventListener('click',evento=>{
 const botao=evento.target.closest('[data-categoria]');
 if(!botao)return;
 categoria=botao.dataset.categoria;
 pagina=1;
 desenharCategorias();
 carregarProdutos();
});

$('busca').addEventListener('input',evento=>{
 busca=evento.target.value.trim();
 pagina=1;
 clearTimeout(temporizadorBusca);
 temporizadorBusca=setTimeout(carregarProdutos,250);
});

$('paginacao').addEventListener('click',evento=>{
 const botao=evento.target.closest('[data-pagina]');
 if(!botao||botao.disabled)return;
 pagina=Number(botao.dataset.pagina);
 carregarProdutos();
 $('loja').scrollIntoView({behavior:'smooth'});
});

$('grid').addEventListener('click',evento=>{
 const botao=evento.target.closest('[data-id]');
 if(botao)adicionar(botao.dataset.id);
});

desenharCategorias();
carregarProdutos();
