// ===== Dados (mesma estrutura do banco marketplace_db) =====
const BASE=[
 {id:1,titulo:'Camisa Palmeiras',descricao:'Camisa de futebol do Palmeiras.',preco:249.9,categoria:'Times de SP',imagem_url:'https://example.com/palmeiras.jpg',usuario_id:1,cor:'#0b7a3b',cor2:'#ffffff',bg:'#e0f3e8'},
 {id:2,titulo:'Camisa Corinthians',descricao:'Camisa de futebol do Corinthians.',preco:249.9,categoria:'Times de SP',imagem_url:'https://example.com/corinthians.jpg',usuario_id:1,cor:'#ffffff',cor2:'#111111',bg:'#e6e8ee'},
 {id:3,titulo:'Camisa São Paulo',descricao:'Camisa de futebol do São Paulo.',preco:249.9,categoria:'Times de SP',imagem_url:'https://example.com/sao-paulo.jpg',usuario_id:1,cor:'#ffffff',cor2:'#e30613',bg:'#fde5e7'},
 {id:4,titulo:'Camisa Santos',descricao:'Camisa de futebol do Santos.',preco:249.9,categoria:'Times de SP',imagem_url:'https://example.com/santos.jpg',usuario_id:1,cor:'#ffffff',cor2:'#111111',bg:'#e6e8ee'},
 {id:5,titulo:'Camisa Flamengo',descricao:'Camisa de futebol do Flamengo.',preco:249.9,categoria:'Times do RJ',imagem_url:'https://example.com/flamengo.jpg',usuario_id:2,cor:'#d4121a',cor2:'#111111',lis:'h',bg:'#fde5e7'},
 {id:6,titulo:'Camisa Vasco',descricao:'Camisa de futebol do Vasco.',preco:249.9,categoria:'Times do RJ',imagem_url:'https://example.com/vasco.jpg',usuario_id:2,cor:'#111111',cor2:'#ffffff',bg:'#e6e8ee'},
 {id:7,titulo:'Camisa Fluminense',descricao:'Camisa de futebol do Fluminense.',preco:249.9,categoria:'Times do RJ',imagem_url:'https://example.com/fluminense.jpg',usuario_id:2,cor:'#7a0f2e',cor2:'#0a6b3a',lis:'v',bg:'#f1e3e8'},
 {id:8,titulo:'Camisa Botafogo',descricao:'Camisa de futebol do Botafogo.',preco:249.9,categoria:'Times do RJ',imagem_url:'https://example.com/botafogo.jpg',usuario_id:2,cor:'#111111',cor2:'#ffffff',lis:'v',bg:'#e6e8ee'}
];
const R=v=>v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const $=id=>document.getElementById(id);
const ler=(k,v)=>{try{return JSON.parse(localStorage.getItem(k))??v}catch(e){return v}};
const gravar=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const P=BASE;
const vendedor=p=>'Vendedor';
const CATEGORIAS=[...new Set(P.map(p=>p.categoria))];
let usuarioAtual=null;

// Camisa desenhada em SVG (aparece quando a imagem_url não carrega)
function camisa(p){
 const body='M30 20 L50 10 Q70 24 90 10 L110 20 L132 50 L112 62 L104 52 L104 128 L36 128 L36 52 L28 62 L8 50 Z';
 let x='';
 if(p.lis){const n=p.lis==='v'?7:8;for(let i=1;i<n;i+=2)x+=p.lis==='v'?`<rect x="${8+i*18}" y="0" width="18" height="150"/>`:`<rect x="0" y="${10+i*15}" width="150" height="15"/>`}
 return `<svg viewBox="0 0 140 150" role="img" aria-label="${p.titulo}"><defs><clipPath id="c${p.id}"><path d="${body}"/></clipPath></defs>
 <path d="${body}" fill="${p.cor}" stroke="rgba(0,0,0,.25)" stroke-width="1.5"/><g clip-path="url(#c${p.id})" fill="${p.cor2}">${x}</g>
 <path d="M50 10 Q70 24 90 10" fill="none" stroke="${p.cor2}" stroke-width="5"/><path d="M8 50 L28 62 M132 50 L112 62" stroke="${p.cor2}" stroke-width="5"/></svg>`;
}
const foto=p=>camisa(p)+(p.imagem_url?`<img src="${p.imagem_url}" alt="${p.titulo}" onerror="this.remove()">`:'');

// ===== Carrinho =====
let cart=ler('carrinho',[]);
function adicionar(id){
 const p=P.find(x=>x.id==id),f=cart.find(i=>i.id===p.id);
 f?f.q++:cart.push({id:p.id,n:p.titulo,p:p.preco,q:1});
 gravar('carrinho',cart);desenharCarrinho();toast('Adicionado: '+p.titulo);
}
function desenharCarrinho(){
 $('count').textContent=cart.reduce((a,i)=>a+i.q,0);
 $('items').innerHTML=cart.length?cart.map((i,k)=>`<div class="it"><b>${i.n}</b><span>${R(i.p*i.q)}</span><small>${R(i.p)} cada</small>
 <div class="q"><button data-k="${k}" data-d="-1" aria-label="Diminuir">−</button>${i.q}<button data-k="${k}" data-d="1" aria-label="Aumentar">+</button></div></div>`).join(''):'<p class="empty">Seu carrinho está vazio. Escolha uma camisa para começar.</p>';
 $('total').textContent=R(cart.reduce((a,i)=>a+i.p*i.q,0));
}
function toast(m){const t=$('toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('on'),2200)}
function abrir(v){$('drawer').classList.toggle('open',v);$('veil').classList.toggle('on',v)}

// ===== Cabeçalho e rodapé iguais em todas as páginas =====
function montarLayout(){
 usuarioAtual=ler('usuario',null);
 document.body.insertAdjacentHTML('afterbegin',`<div class="top">Frete grátis em compras acima de <b>R$ 299</b> · Pague em até 6x sem juros</div>
 <header><div class="wrap"><a class="logo" href="/">ARQUIBANCADA<span>.</span></a>
 <nav><a class="link hide" href="/">Início</a><a class="link hide" href="/?cat=Times%20de%20SP#loja">Times de SP</a><a class="link hide" href="/?cat=Times%20do%20RJ#loja">Times do RJ</a>
 <a class="link" id="conta" href="/login">${usuarioAtual?'Olá, '+usuarioAtual.nome.split(' ')[0]:'Entrar'}</a>
 <button class="cartbtn" id="openCart" aria-label="Abrir carrinho">Carrinho<b id="count">0</b></button></nav></div></header>`);
 document.body.insertAdjacentHTML('beforeend',`<footer><div class="wrap"><div class="fcols">
 <div><span class="logo">ARQUIBANCADA.</span><p>O marketplace de camisas de futebol: compre direto de quem vende.</p></div>
 <div><h4>Categorias</h4><a href="/?cat=Times%20de%20SP#loja">Times de SP</a><a href="/?cat=Times%20do%20RJ#loja">Times do RJ</a></div>
 <div><h4>Ajuda</h4><p>Trocas em até 30 dias</p><p>contato@arquibancada.com</p></div></div>
 <div class="copy">© 2026 Arquibancada · Projeto acadêmico, marketplace fictício.</div></div></footer>
 <div class="veil" id="veil"></div>
 <aside class="drawer" id="drawer" aria-label="Carrinho"><div class="dh"><h2>Seu carrinho</h2><button id="closeCart" aria-label="Fechar carrinho" style="font-size:30px">×</button></div>
 <div class="items" id="items"></div><div class="df"><div class="tot"><span>Total</span><span id="total">R$ 0,00</span></div><button class="cta" id="checkout">Finalizar compra</button></div></aside>
 <div class="toast" id="toast" role="status"></div>`);
 $('openCart').onclick=()=>abrir(true);$('closeCart').onclick=()=>abrir(false);$('veil').onclick=()=>abrir(false);
 $('items').onclick=e=>{const k=e.target.dataset.k;if(k===undefined)return;cart[k].q+=+e.target.dataset.d;if(cart[k].q<1)cart.splice(k,1);gravar('carrinho',cart);desenharCarrinho()};
 $('checkout').onclick=()=>{
  if(!cart.length)return toast('Adicione uma camisa antes de finalizar');
  if(!ler('usuario',null)){toast('Entre na sua conta para finalizar');return setTimeout(()=>location.href='/login',1200)}
  cart=[];gravar('carrinho',cart);desenharCarrinho();abrir(false);toast('Pedido realizado com sucesso!')};
 document.addEventListener('keydown',e=>{if(e.key==='Escape')abrir(false)});
 desenharCarrinho();
}
montarLayout();
