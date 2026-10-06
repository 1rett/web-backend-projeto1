const usuarioId = Number($('perfil').dataset.usuarioId);

async function carregarPerfil() {
  try {
    const resposta = await fetch(`/api/usuarios/${usuarioId}`);
    const usuario = await lerRespostaJson(resposta);

    document.title = `Perfil de ${usuario.nome} | Arquibancada`;
    const listaProdutos = usuario.produtos.length
      ? `<ul>${usuario.produtos.map(produto => `
          <li>
            <a href="/produto/${Number(produto.id)}">${escaparHtml(produto.titulo)}</a>
            — ${R(produto.preco)} — estoque: ${Number(produto.estoque)}
          </li>
        `).join('')}</ul>`
      : '<p>Este usuário ainda não publicou camisas.</p>';

    $('perfil').innerHTML = `
      <p><a href="/">Voltar para a loja</a></p>
      <h1>${escaparHtml(usuario.nome)}</h1>
      <p>ID do usuário: ${Number(usuario.id)}</p>
      <p>E-mail: ${escaparHtml(usuario.email)}</p>
      <h2>Camisas deste usuário</h2>
      ${listaProdutos}
    `;
  } catch (erro) {
    $('perfil').textContent = erro.status === 404
      ? 'Usuário não encontrado.'
      : 'Não foi possível carregar o usuário. Confira o servidor e o MySQL.';
  }
}

carregarPerfil();
