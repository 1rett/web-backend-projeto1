const produtoId = Number($('produto').dataset.produtoId);

async function carregarProduto() {
  try {
    const resposta = await fetch(`/api/produtos/${produtoId}`);
    const produto = await lerRespostaJson(resposta);

    document.title = `${produto.titulo} | Arquibancada`;
    $('produto').innerHTML = `
      <p><a href="/">Voltar para a lista de camisas</a></p>
      <article class="item">
        <h1>${escaparHtml(produto.titulo)}</h1>
        <p>${escaparHtml(produto.descricao || 'Sem descrição.')}</p>
        <p>Estado: ${escaparHtml(produto.estado)}</p>
        <p>Preço: ${R(produto.preco)}</p>
        <p>Estoque: ${Number(produto.estoque)}</p>
        <p>Vendedor: <a href="/usuarios/${Number(produto.usuario_id)}">${escaparHtml(produto.vendedor_nome)}</a></p>
      </article>
    `;
  } catch (erro) {
    $('produto').textContent = erro.status === 404
      ? 'Camisa não encontrada.'
      : 'Não foi possível carregar a camisa. Confira o servidor e o MySQL.';
  }
}

carregarProduto();
