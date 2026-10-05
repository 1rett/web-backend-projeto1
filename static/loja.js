// Página inicial: busca + filtro por categoria
let cat=new URLSearchParams(location.search).get('cat')||'Todos',busca='';
$('heroShirts').innerHTML=[BASE[0],BASE[4],BASE[2]].map(camisa).join('');
function chips(){$('chips').innerHTML=['Todos',...CATEGORIAS].map(c=>`<button class="chip" aria-pressed="${c===cat}" data-c="${c}">${c}</button>`).join('')}
function grade(){
 const l=P.filter(p=>(cat==='Todos'||p.categoria===cat)&&p.titulo.toLowerCase().includes(busca));
 $('grid').innerHTML=l.length?l.map(p=>`<article class="card"><a class="pic" href="produto.html?id=${p.id}" style="background:${p.bg||'#e6e8ee'}" aria-label="Ver ${p.titulo}">${foto(p)}</a>
 <div class="info"><small>${p.categoria}</small><h3><a href="produto.html?id=${p.id}">${p.titulo}</a></h3>
 <span class="sel">Vendido por ${vendedor(p)}</span><div class="price">${R(p.preco)}</div>
 <button class="add" data-id="${p.id}">Adicionar ao carrinho</button></div></article>`).join(''):'<p class="vazio">Nenhuma camisa encontrada. Tente outro nome ou categoria.</p>'}
$('chips').onclick=e=>{const c=e.target.dataset.c;if(c){cat=c;chips();grade()}};
$('busca').oninput=e=>{busca=e.target.value.toLowerCase().trim();grade()};
$('grid').onclick=e=>{if(e.target.classList.contains('add'))adicionar(e.target.dataset.id)};
chips();grade();
