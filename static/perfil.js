const usuarioId = Number(buscarElemento('perfil').dataset.usuarioId);

async function carregarPerfil() {
  try {
    const resposta = await fetch('/api/usuarios/' + usuarioId);
    const usuario = await lerRespostaJson(resposta);
    document.title = 'Perfil de ' + usuario.nome + ' | Arquibancada';
    mostrarPerfil(usuario);
  } catch (erro) {
    buscarElemento('perfil').textContent = erro.message === 'Usuário não encontrado.'
      ? 'Usuário não encontrado.'
      : 'Não foi possível carregar o usuário. Confira o servidor e o MySQL.';
  }
}

function mostrarPerfil(usuario) {
  let produtosHtml = '';
  if (usuario.produtos.length === 0) {
    produtosHtml = '<p>Este usuário ainda não publicou camisas.</p>';
  } else {
    produtosHtml = '<ul>';
    for (let i = 0; i < usuario.produtos.length; i += 1) {
      const produto = usuario.produtos[i];
      produtosHtml += '<li><a href="/produto/' + Number(produto.id) + '">' + escaparHtml(produto.titulo) + '</a>';
      produtosHtml += ' — ' + formatarPreco(produto.preco) + '</li>';
    }
    produtosHtml += '</ul>';
  }

  buscarElemento('perfil').innerHTML =
    '<p><a href="/">Voltar para a loja</a></p>' +
    '<h1>' + escaparHtml(usuario.nome) + '</h1>' +
    '<p>ID do usuário: ' + Number(usuario.id) + '</p>' +
    '<p>E-mail: ' + escaparHtml(usuario.email) + '</p>' +
    '<h2>Camisas deste usuário</h2>' + produtosHtml;
}

carregarPerfil();
