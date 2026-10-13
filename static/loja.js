// Guarda os filtros e a página que estão sendo mostrados.
const produtosPorPagina = 8;
let termoBusca = '';
let estadoSelecionado = '';
let paginaAtual = 1;

// Prepara a página inicial e liga os formulários aos seus eventos.
function iniciarLoja() {
  const parametros = new URLSearchParams(window.location.search);
  termoBusca = parametros.get('busca') || '';
  estadoSelecionado = parametros.get('estado') || '';

  buscarElemento('busca').value = termoBusca;
  buscarElemento('estado').value = estadoSelecionado;

  buscarElemento('buscaUsuario').addEventListener('submit', abrirPerfilPesquisado);
  buscarElemento('buscaProdutoId').addEventListener('submit', abrirProdutoPesquisado);
  buscarElemento('buscaProdutos').addEventListener('submit', pesquisarProdutos);
  buscarElemento('paginacao').addEventListener('click', mudarPagina);

  carregarProdutos();
}

// Abre a página de detalhes da camisa informada pelo ID.
function abrirProdutoPesquisado(evento) {
  evento.preventDefault();

  const produtoId = Number(buscarElemento('produtoIdBusca').value);
  if (Number.isInteger(produtoId) && produtoId > 0) {
    window.location.href = '/produto/' + produtoId;
  }
}

// Pesquisa um usuário pelo ID ou pelo nome.
async function abrirPerfilPesquisado(evento) {
  evento.preventDefault();

  const termo = buscarElemento('nomeUsuarioBusca').value.trim();
  const resultados = buscarElemento('resultadosUsuarios');

  if (termo === '') {
    resultados.textContent = 'Digite um nome ou ID para pesquisar.';
    return;
  }

  const usuarioId = Number(termo);
  if (Number.isInteger(usuarioId) && usuarioId > 0) {
    window.location.href = '/usuarios/' + usuarioId;
    return;
  }

  resultados.textContent = 'Buscando usuários...';

  try {
    const resposta = await fetch('/api/usuarios/busca/' + encodeURIComponent(termo));
    const dados = await lerRespostaJson(resposta);

    if (dados.usuarios.length === 0) {
      resultados.textContent = 'Nenhum usuário encontrado.';
      return;
    }

    let listaHtml = '<ul>';
    for (let i = 0; i < dados.usuarios.length; i += 1) {
      const usuario = dados.usuarios[i];
      listaHtml += '<li>';
      listaHtml += '<a href="/usuarios/' + Number(usuario.id) + '">';
      listaHtml += escaparHtml(usuario.nome) + ' (perfil)';
      listaHtml += '</a>';
      listaHtml += '</li>';
    }
    listaHtml += '</ul>';

    resultados.innerHTML = listaHtml;
  } catch (erro) {
    console.error('Erro ao buscar usuários:', erro);
    resultados.textContent = 'Não foi possível buscar usuários. Confira o servidor e o MySQL.';
  }
}

// Lê os filtros do formulário e volta para a primeira página.
function pesquisarProdutos(evento) {
  evento.preventDefault();

  termoBusca = buscarElemento('busca').value.trim();
  estadoSelecionado = buscarElemento('estado').value;
  paginaAtual = 1;

  carregarProdutos();
}

// Pede os produtos à API usando a busca, o estado e a página atuais.
async function carregarProdutos() {
  const parametros = new URLSearchParams();
  parametros.set('pagina', paginaAtual);
  parametros.set('por_pagina', produtosPorPagina);

  if (estadoSelecionado !== '') {
    parametros.set('estado', estadoSelecionado);
  }

  let endereco = '/api/produtos';
  if (termoBusca !== '') {
    endereco = '/api/produtos/busca/' + encodeURIComponent(termoBusca);
  }

  buscarElemento('grid').textContent = 'Carregando camisas...';
  buscarElemento('paginacao').replaceChildren();

  try {
    const resposta = await fetch(endereco + '?' + parametros.toString());
    const dados = await lerRespostaJson(resposta);

    mostrarProdutos(dados.produtos);
    mostrarPaginacao(dados);
  } catch (erro) {
    console.error('Erro ao carregar camisas:', erro);
    buscarElemento('grid').textContent = 'Não foi possível carregar as camisas. Confira o servidor e o MySQL.';
  }
}

// Cria na página um cartão para cada camisa recebida da API.
function mostrarProdutos(produtos) {
  const grid = buscarElemento('grid');

  if (produtos.length === 0) {
    grid.textContent = 'Nenhuma camisa encontrada.';
    return;
  }

  let listaHtml = '';
  for (let i = 0; i < produtos.length; i += 1) {
    const produto = produtos[i];

    listaHtml += '<article class="item">';
    listaHtml += '<h3><a href="/produto/' + Number(produto.id) + '">';
    listaHtml += escaparHtml(produto.titulo) + '</a></h3>';
    listaHtml += '<p>' + escaparHtml(produto.descricao || 'Sem descrição.') + '</p>';
    listaHtml += '<p>Estado: ' + escaparHtml(produto.estado) + '</p>';
    listaHtml += '<p>Preço: ' + formatarPreco(produto.preco) + '</p>';
    listaHtml += '<p>Vendedor: <a href="/usuarios/' + Number(produto.usuario_id) + '">';
    listaHtml += escaparHtml(produto.vendedor_nome) + '</a></p>';
    listaHtml += '</article>';
  }

  grid.innerHTML = listaHtml;
}

// Mostra a página atual e os botões de navegação, quando necessários.
function mostrarPaginacao(dados) {
  const paginacao = buscarElemento('paginacao');

  if (dados.total_paginas === 0) {
    paginacao.textContent = '';
    return;
  }

  if (dados.total_paginas === 1) {
    paginacao.textContent = 'Página 1 de 1';
    return;
  }

  let botaoAnterior = '<button type="button" data-pagina="' + (paginaAtual - 1) + '"';
  if (paginaAtual === 1) {
    botaoAnterior += ' disabled';
  }
  botaoAnterior += '>Anterior</button>';

  let botaoProxima = '<button type="button" data-pagina="' + (paginaAtual + 1) + '"';
  if (paginaAtual === dados.total_paginas) {
    botaoProxima += ' disabled';
  }
  botaoProxima += '>Próxima</button>';

  paginacao.innerHTML = botaoAnterior +
    '<span>Página ' + dados.pagina + ' de ' + dados.total_paginas + '</span>' +
    botaoProxima;
}

// Descobre qual botão de página foi clicado e carrega os novos produtos.
function mudarPagina(evento) {
  const botao = evento.target.closest('[data-pagina]');

  if (botao === null || botao.disabled) {
    return;
  }

  paginaAtual = Number(botao.dataset.pagina);
  carregarProdutos();
}

iniciarLoja();
