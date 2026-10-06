// Imagens ilustrativas do banner; os produtos da loja vêm da API.
const CAMISAS_DESTAQUE=[
 {id:'destaque-verde',titulo:'Camisa verde',cor:'#0b7a3b',cor2:'#ffffff'},
 {id:'destaque-branca',titulo:'Camisa branca',cor:'#ffffff',cor2:'#111111'},
 {id:'destaque-vermelha',titulo:'Camisa vermelha',cor:'#d4121a',cor2:'#111111'}
];
const R=v=>v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const $=id=>document.getElementById(id);
const ler=(k,v)=>{try{return JSON.parse(localStorage.getItem(k))??v}catch(e){return v}};
const gravar=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const escaparHtml=valor=>String(valor??'').replace(/[&<>"']/g,caractere=>({
 '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[caractere]));
async function lerRespostaJson(resposta){
 const tipo=resposta.headers.get('content-type')||'';
 if(!tipo.includes('application/json')){
  throw new Error(`A API respondeu com HTTP ${resposta.status}, mas não retornou JSON.`);
 }
 const dados=await resposta.json();
 if(!resposta.ok){
  const erro=new Error(dados.erro||`Resposta HTTP ${resposta.status}`);
  erro.status=resposta.status;
  throw erro;
 }
 return dados;
}
let produtosAtuais=[];
let usuarioAtual=null;

// Camisa desenhada em SVG (aparece quando a imagem_url não carrega)
function camisa(p){
 const body='M30 20 L50 10 Q70 24 90 10 L110 20 L132 50 L112 62 L104 52 L104 128 L36 128 L36 52 L28 62 L8 50 Z';
 const corCandidata=p.cor_principal||p.cor;
 const corSecundariaCandidata=p.cor_secundaria||p.cor2;
 const cor=/^#[0-9a-f]{6}$/i.test(corCandidata||'')?corCandidata:'#0b7a3b';
 const cor2=/^#[0-9a-f]{6}$/i.test(corSecundariaCandidata||'')?corSecundariaCandidata:'#ffffff';
 const padrao=['v','h'].includes(p.padrao)?p.padrao:(['v','h'].includes(p.lis)?p.lis:'');
 let x='';
 if(padrao){const n=padrao==='v'?7:8;for(let i=1;i<n;i+=2)x+=padrao==='v'?`<rect x="${8+i*18}" y="0" width="18" height="150"/>`:`<rect x="0" y="${10+i*15}" width="150" height="15"/>`}
 const id=String(p.codigo||p.id).replace(/[^a-zA-Z0-9_-]/g,'');
 return `<svg viewBox="0 0 140 150" role="img" aria-label="${escaparHtml(p.titulo)}"><defs><clipPath id="c${id}"><path d="${body}"/></clipPath></defs>
 <path d="${body}" fill="${cor}" stroke="rgba(0,0,0,.25)" stroke-width="1.5"/><g clip-path="url(#c${id})" fill="${cor2}">${x}</g>
 <path d="M50 10 Q70 24 90 10" fill="none" stroke="${cor2}" stroke-width="5"/><path d="M8 50 L28 62 M132 50 L112 62" stroke="${cor2}" stroke-width="5"/></svg>`;
}
const foto=p=>{
 const imagem=typeof p.imagem_url==='string'&&/^https?:\/\//i.test(p.imagem_url)
  ?`<img src="${escaparHtml(p.imagem_url)}" alt="${escaparHtml(p.titulo)}" onerror="this.remove()">`
  :'';
 return camisa(p)+imagem;
};

// ===== Carrinho =====
let cart=ler('carrinho',[]);
function adicionar(id){
 const p=produtosAtuais.find(x=>x.id===Number(id));
 if(!p)return toast('Não foi possível encontrar esse produto.');
 const estoque=Number(p.estoque)||0;
 if(estoque<=0)return toast('Esse produto está sem estoque.');
 const f=cart.find(i=>i.id===p.id);
 if(f&&f.q>=estoque)return toast('Você já colocou todo o estoque disponível no carrinho.');
 if(f){
  f.q++;
  f.estoque=estoque;
 }else{
  cart.push({id:p.id,n:p.titulo,p:p.preco,q:1,estoque});
 }
 gravar('carrinho',cart);desenharCarrinho();toast('Adicionado: '+p.titulo);
}
function desenharCarrinho(){
 $('count').textContent=cart.reduce((a,i)=>a+i.q,0);
 $('items').innerHTML=cart.length?cart.map((i,k)=>`<div class="it"><b>${escaparHtml(i.n)}</b><span>${R(i.p*i.q)}</span><small>${R(i.p)} cada</small>
 <div class="q"><button data-k="${k}" data-d="-1" aria-label="Diminuir">−</button>${i.q}<button data-k="${k}" data-d="1" aria-label="Aumentar">+</button></div></div>`).join(''):'<p class="empty">Seu carrinho está vazio. Escolha uma camisa para começar.</p>';
 $('total').textContent=R(cart.reduce((a,i)=>a+i.p*i.q,0));
}
function toast(m){const t=$('toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('on'),2200)}
function abrir(v){$('drawer').classList.toggle('open',v);$('veil').classList.toggle('on',v)}

async function carregarUsuarioAutenticado(){
 try{
  const resposta=await fetch('/api/auth/me');
  const resultado=await lerRespostaJson(resposta);
  usuarioAtual=resultado.usuario||(
   ler('usuario',null)?.demonstracao?ler('usuario',null):null
  );
  $('conta').textContent=usuarioAtual
   ?'Olá, '+escaparHtml(usuarioAtual.nome.split(' ')[0])
   :'Entrar';
 }catch(erro){
  console.error('Falha ao verificar o usuário conectado:',erro);
 }
}

// ===== Cabeçalho e rodapé iguais em todas as páginas =====
function montarLayout(){
 usuarioAtual=ler('usuario',null);
 document.body.insertAdjacentHTML('afterbegin',`<div class="top">Frete grátis em compras acima de <b>R$ 299</b> · Pague em até 6x sem juros</div>
 <header><div class="wrap"><a class="logo" href="/">ARQUIBANCADA<span>.</span></a>
 <nav><a class="link hide" href="/">Início</a><a class="link hide" href="/?cat=Times%20de%20SP#loja">Times de SP</a><a class="link hide" href="/?cat=Times%20do%20RJ#loja">Times do RJ</a>
 <a class="link" id="conta" href="/login">${usuarioAtual?'Olá, '+escaparHtml(usuarioAtual.nome.split(' ')[0]):'Entrar'}</a>
 <button class="cartbtn" id="openCart" aria-label="Abrir carrinho">Carrinho<b id="count">0</b></button></nav></div></header>`);
 document.body.insertAdjacentHTML('beforeend',`<footer><div class="wrap"><div class="fcols">
 <div><span class="logo">ARQUIBANCADA.</span><p>O marketplace de camisas de futebol: compre direto de quem vende.</p></div>
 <div><h4>Estados</h4><a href="/?estado=SP#loja">São Paulo</a><a href="/?estado=RJ#loja">Rio de Janeiro</a><a href="/?estado=MG#loja">Minas Gerais</a><a href="/?estado=BA#loja">Bahia</a><a href="/?estado=PR#loja">Paraná</a><a href="/?estado=RS#loja">Rio Grande do Sul</a><a href="/?estado=PA#loja">Pará</a><a href="/?estado=SC#loja">Santa Catarina</a></div>
 <div><h4>Ajuda</h4><p>Trocas em até 30 dias</p><p>contato@arquibancada.com</p></div></div>
 <div class="copy">© 2026 Arquibancada · Projeto acadêmico, marketplace fictício.</div></div></footer>
 <div class="veil" id="veil"></div>
 <aside class="drawer" id="drawer" aria-label="Carrinho"><div class="dh"><h2>Seu carrinho</h2><button id="closeCart" aria-label="Fechar carrinho" style="font-size:30px">×</button></div>
 <div class="items" id="items"></div><div class="df"><div class="tot"><span>Total</span><span id="total">R$ 0,00</span></div><button class="cta" id="checkout">Finalizar compra</button></div></aside>
 <div class="toast" id="toast" role="status"></div>`);
 $('openCart').onclick=()=>abrir(true);$('closeCart').onclick=()=>abrir(false);$('veil').onclick=()=>abrir(false);
 $('items').onclick=e=>{
  const k=e.target.dataset.k;
  if(k===undefined)return;
  const diferenca=Number(e.target.dataset.d);
  if(diferenca>0&&Number.isFinite(Number(cart[k].estoque))&&cart[k].q>=cart[k].estoque){
   return toast('Você já colocou todo o estoque disponível no carrinho.');
  }
  cart[k].q+=diferenca;
  if(cart[k].q<1)cart.splice(k,1);
  gravar('carrinho',cart);
  desenharCarrinho();
 };
 $('checkout').onclick=async()=>{
  if(!cart.length)return toast('Adicione uma camisa antes de finalizar');
  await carregarUsuarioAutenticado();
  if(!usuarioAtual){toast('Entre na sua conta para finalizar');return setTimeout(()=>location.href='/login',1200)}
  cart=[];gravar('carrinho',cart);desenharCarrinho();abrir(false);toast('Pedido realizado com sucesso!')};
 document.addEventListener('keydown',e=>{if(e.key==='Escape')abrir(false)});
 desenharCarrinho();
}
montarLayout();
carregarUsuarioAutenticado();
