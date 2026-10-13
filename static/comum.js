function buscarElemento(id) {
  return document.getElementById(id);
}

function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function escaparHtml(valor) {
  let texto = '';
  if (valor !== null && valor !== undefined) {
    texto = String(valor);
  }
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function lerRespostaJson(resposta) {
  const dados = await resposta.json();
  if (!resposta.ok) {
    throw new Error(dados.erro || 'A solicitação não foi concluída.');
  }
  return dados;
}
