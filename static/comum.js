const $ = id => document.getElementById(id);
const R = valor => Number(valor).toLocaleString('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

const ler = (chave, valorPadrao) => {
  try {
    return JSON.parse(localStorage.getItem(chave)) ?? valorPadrao;
  } catch {
    return valorPadrao;
  }
};

const gravar = (chave, valor) => {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    // O navegador pode bloquear o armazenamento local.
  }
};

const escaparHtml = valor => String(valor ?? '').replace(/[&<>"']/g, caractere => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[caractere]));

async function lerRespostaJson(resposta) {
  const dados = await resposta.json();
  if (!resposta.ok) {
    const erro = new Error(dados.erro || `Erro HTTP ${resposta.status}`);
    erro.status = resposta.status;
    throw erro;
  }
  return dados;
}
