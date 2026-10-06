const ESTADOS=[
 ['Todos','Todos os estados'],
 ['SP','São Paulo'],
 ['RJ','Rio de Janeiro'],
 ['MG','Minas Gerais'],
 ['BA','Bahia'],
 ['PR','Paraná'],
 ['RS','Rio Grande do Sul'],
 ['PA','Pará'],
 ['SC','Santa Catarina']
];
const PRODUTOS_POR_PAGINA=8;
const parametrosIniciais=new URLSearchParams(location.search);
let estado=parametrosIniciais.get('estado')||(
 parametrosIniciais.get('cat')==='Times de SP'?'SP':
 parametrosIniciais.get('cat')==='Times do RJ'?'RJ':'Todos'
);
let busca='';
let pagina=1;
let temporizadorBusca;
let requisicaoAtual=0;

$('heroShirts').innerHTML=CAMISAS_DESTAQUE.map(camisa).join('');

$('buscaUsuario').addEventListener('submit',evento=>{
 evento.preventDefault();
 const campo=$('usuarioIdBusca');
 const usuarioId=Number(campo.value);
 if(!Number.isInteger(usuarioId)||usuarioId<1){
  campo.setCustomValidity('Digite um ID de usuário válido.');
  campo.reportValidity();
  return;
 }
 campo.setCustomValidity('');
 location.href=`/usuarios/${usuarioId}`;
});

function desenharCategorias(){
 $('chips').innerHTML=ESTADOS.map(([sigla,nome])=>
  `<button class="chip" aria-pressed="${sigla===estado}" data-estado="${sigla}">${escaparHtml(nome)}</button>`
 ).join('');
}

function desenharProdutos(produtos){
 $('grid').innerHTML=produtos.length?produtos.map(produto=>`
  <article class="card">
   <a class="pic" href="/produto/${Number(produto.id)}" aria-label="Ver ${escaparHtml(produto.titulo)}">${foto(produto)}</a>
   <div class="info">
     <small>${escaparHtml(produto.estado)} · ${escaparHtml(produto.categoria||'Série A 2026')}</small>
    <h3><a href="/produto/${Number(produto.id)}">${escaparHtml(produto.titulo)}</a></h3>
    <span class="sel">Vendido por <a href="/usuarios/${Number(produto.usuario_id)}">${escaparHtml(produto.vendedor_nome)}</a></span>
     <small>ID ${Number(produto.id)} · Estoque: ${Number(produto.estoque)}</small>
     <div class="price">${R(Number(produto.preco))}</div>
     <button class="add" data-id="${Number(produto.id)}" ${Number(produto.estoque)<=0?'disabled':''}>${Number(produto.estoque)>0?'Adicionar ao carrinho':'Sem estoque'}</button>
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
 if(estado!=='Todos')parametros.set('estado',estado);
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
 const botao=evento.target.closest('[data-estado]');
 if(!botao)return;
 estado=botao.dataset.estado;
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
