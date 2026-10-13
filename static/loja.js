const produtosPorPagina = 8;
let termoBusca = '';
let estadoSelecionado = '';
let paginaAtual = 1;

function iniciarLoja() {
  const parametros = new URLSearchParams(window.location.search);
  termoBusca = parametros.get('busca') || '';
  estadoSelecionado = parametros.get('estado') || '';

  buscarElemento('busca').value = termoBusca;
  buscarElemento('estado').value = estadoSelecionado;

  buscarElemento('buscaUsuario').addEventListener('submit', abrirPerfilPesquisado);
  buscarElemento('buscaProdutos').addEventListener('submit', pesquisarProdutos);
  buscarElemento('paginacao').addEventListener('click', mudarPagina);

  carregarProdutos();
}

async function abrirPerfilPesquisado(evento) {
  evento.preventDefault();
  const termo = buscarElemento('nomeUsuarioBusca').value.trim();
  const resultados = buscarElemento('resultadosUsuarios');
  if (!termo) {
    resultados.textContent = 'Digite um nome ou ID para pesquisar.';
    return;
  }

  if (/^\d+$/.test(termo)) {
    window.location.href = '/usuarios/' + Number(termo);
    return;
  }

  resultados.textContent = 'Buscando usuários...';
  try {
    const resposta = await fetch('/api/usuarios/busca/' + encodeURIComponent(termo));
    const resultado = await lerRespostaJson(resposta);
    if (resultado.usuarios.length === 0) {
      resultados.textContent = 'Nenhum usuário encontrado.';
      return;
    }

    resultados.innerHTML = '<ul>' + resultado.usuarios.map((usuario) =>
      '<li><a href="/usuarios/' + Number(usuario.id) + '">' + escaparHtml(usuario.nome) +
      ' (perfil)</a></li>'
    ).join('') + '</ul>';
  } catch (erro) {
    console.error('Erro ao buscar usuários:', erro);
    resultados.textContent = 'Não foi possível buscar usuários. Confira o servidor e o MySQL.';
  }
}

function pesquisarProdutos(evento) {
  evento.preventDefault();
  termoBusca = buscarElemento('busca').value.trim();
  estadoSelecionado = buscarElemento('estado').value;
  paginaAtual = 1;
  carregarProdutos();
}

async function carregarProdutos() {
  const parametros = new URLSearchParams();
  parametros.set('pagina', paginaAtual);
  parametros.set('por_pagina', produtosPorPagina);
  if (estadoSelecionado) {
    parametros.set('estado', estadoSelecionado);
  }

  let rota = '/api/produtos';
  if (termoBusca) {
    rota = '/api/produtos/busca/' + encodeURIComponent(termoBusca);
  }

  buscarElemento('grid').textContent = 'Carregando camisas...';
  buscarElemento('paginacao').replaceChildren();

  try {
    const resposta = await fetch(rota + '?' + parametros.toString());
    const resultado = await lerRespostaJson(resposta);
    mostrarProdutos(resultado.produtos);
    mostrarPaginacao(resultado);
  } catch (erro) {
    console.error('Erro ao carregar camisas:', erro);
    buscarElemento('grid').textContent = 'Não foi possível carregar as camisas. Confira o servidor e o MySQL.';
  }
}

function mostrarProdutos(produtos) {
  const grid = buscarElemento('grid');
  if (produtos.length === 0) {
    grid.textContent = 'Nenhuma camisa encontrada.';
    return;
  }

  let html = '';
  for (let i = 0; i < produtos.length; i += 1) {
    const produto = produtos[i];
    html += '<article class="item">';
    html += '<h3><a href="/produto/' + Number(produto.id) + '">' + escaparHtml(produto.titulo) + '</a></h3>';
    html += '<p>' + escaparHtml(produto.descricao || 'Sem descrição.') + '</p>';
    html += '<p>Estado: ' + escaparHtml(produto.estado) + '</p>';
    html += '<p>Preço: ' + formatarPreco(produto.preco) + '</p>';
    html += '<p>Vendedor: <a href="/usuarios/' + Number(produto.usuario_id) + '">' + escaparHtml(produto.vendedor_nome) + '</a></p>';
    html += '</article>';
  }
  grid.innerHTML = html;
}

function mostrarPaginacao(resultado) {
  const paginacao = buscarElemento('paginacao');
  if (resultado.total_paginas < 2) {
    paginacao.textContent = 'Página ' + resultado.pagina + ' de ' + resultado.total_paginas;
    return;
  }

  paginacao.innerHTML =
    '<button type="button" data-pagina="' + (paginaAtual - 1) + '" ' + (paginaAtual <= 1 ? 'disabled' : '') + '>Anterior</button>' +
    '<span>Página ' + resultado.pagina + ' de ' + resultado.total_paginas + '</span>' +
    '<button type="button" data-pagina="' + (paginaAtual + 1) + '" ' + (paginaAtual >= resultado.total_paginas ? 'disabled' : '') + '>Próxima</button>';
}

function mudarPagina(evento) {
  const botao = evento.target.closest('[data-pagina]');
  if (!botao || botao.disabled) {
    return;
  }
  paginaAtual = Number(botao.dataset.pagina);
  carregarProdutos();
}

iniciarLoja();
