const produtoId = Number(buscarElemento('produto').dataset.produtoId);

async function carregarProduto() {
  try {
    const resposta = await fetch('/api/produtos/' + produtoId);
    const produto = await lerRespostaJson(resposta);
    document.title = produto.titulo + ' | Arquibancada';
    mostrarProduto(produto);
  } catch (erro) {
    buscarElemento('produto').textContent = erro.message === 'Produto não encontrado.'
      ? 'Camisa não encontrada.'
      : 'Não foi possível carregar a camisa. Confira o servidor e o MySQL.';
  }
}

function mostrarProduto(produto) {
  buscarElemento('produto').innerHTML =
    '<p><a href="/">Voltar para a lista de camisas</a></p>' +
    '<article class="item">' +
    '<h1>' + escaparHtml(produto.titulo) + '</h1>' +
    '<p>' + escaparHtml(produto.descricao || 'Sem descrição.') + '</p>' +
    '<p>Estado: ' + escaparHtml(produto.estado) + '</p>' +
    '<p>Preço: ' + formatarPreco(produto.preco) + '</p>' +
    '<p>Vendedor: <a href="/usuarios/' + Number(produto.usuario_id) + '">' + escaparHtml(produto.vendedor_nome) + '</a></p>' +
    '</article>';
}

carregarProduto();
