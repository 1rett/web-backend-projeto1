const produtosPorPagina = 8;
const parametros = new URLSearchParams(location.search);
let busca = parametros.get('busca') || '';
let estado = parametros.get('estado') || '';
let pagina = 1;

$('busca').value = busca;
$('estado').value = estado;

$('buscaUsuario').addEventListener('submit', evento => {
  evento.preventDefault();
  const usuarioId = Number($('usuarioIdBusca').value);
  if (Number.isInteger(usuarioId) && usuarioId > 0) {
    location.href = `/usuarios/${usuarioId}`;
  }
});

$('buscaProdutos').addEventListener('submit', evento => {
  evento.preventDefault();
  busca = $('busca').value.trim();
  estado = $('estado').value;
  pagina = 1;
  carregarProdutos();
});

async function carregarProdutos() {
  const parametrosBusca = new URLSearchParams({
    busca,
    pagina: String(pagina),
    por_pagina: String(produtosPorPagina)
  });
  if (estado) parametrosBusca.set('estado', estado);

  $('grid').textContent = 'Carregando camisas...';
  $('paginacao').replaceChildren();

  try {
    const rota = busca
      ? `/api/produtos/busca/${encodeURIComponent(busca)}?${parametrosBusca}`
      : `/api/produtos?${parametrosBusca}`;
    const resposta = await fetch(rota);
    const resultado = await lerRespostaJson(resposta);
    mostrarProdutos(resultado.produtos);
    mostrarPaginacao(resultado);
  } catch (erro) {
    console.error('Erro ao carregar camisas:', erro);
    $('grid').textContent = 'Não foi possível carregar as camisas. Confira o servidor e o MySQL.';
  }
}

function mostrarProdutos(produtos) {
  if (!produtos.length) {
    $('grid').textContent = 'Nenhuma camisa encontrada.';
    return;
  }

  $('grid').innerHTML = produtos.map(produto => `
    <article class="item">
      <h3><a href="/produto/${Number(produto.id)}">${escaparHtml(produto.titulo)}</a></h3>
      <p>${escaparHtml(produto.descricao || 'Sem descrição.')}</p>
      <p>Estado: ${escaparHtml(produto.estado)}</p>
      <p>Preço: ${R(produto.preco)} | Estoque: ${Number(produto.estoque)}</p>
      <p>Vendedor: <a href="/usuarios/${Number(produto.usuario_id)}">${escaparHtml(produto.vendedor_nome)}</a></p>
    </article>
  `).join('');
}

function mostrarPaginacao(resultado) {
  if (resultado.total_paginas < 2) return;

  $('paginacao').innerHTML = `
    <button type="button" data-pagina="${pagina - 1}" ${pagina <= 1 ? 'disabled' : ''}>Anterior</button>
    <span>Página ${resultado.pagina} de ${resultado.total_paginas}</span>
    <button type="button" data-pagina="${pagina + 1}" ${pagina >= resultado.total_paginas ? 'disabled' : ''}>Próxima</button>
  `;
}

$('paginacao').addEventListener('click', evento => {
  const botao = evento.target.closest('[data-pagina]');
  if (!botao || botao.disabled) return;
  pagina = Number(botao.dataset.pagina);
  carregarProdutos();
});

carregarProdutos();
