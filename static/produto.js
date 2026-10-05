const id=+new URLSearchParams(location.search).get('id'),p=P.find(x=>x.id===id),main=$('produto');
if(!p){main.innerHTML='<div class="box"><h1>Produto não encontrado</h1><p class="sub">Volte à loja e escolha uma camisa da lista.</p><a class="cta" href="index.html">Ver camisas</a></div>'}
else{
 document.title=p.titulo+' – Arquibancada';
 main.innerHTML=`<a class="back" href="index.html">← Voltar para a loja</a>
 <div class="prod"><div class="pic" style="background:${p.bg||'#e6e8ee'}">${foto(p)}</div>
 <div><small>${p.categoria}</small><h1>${p.titulo}</h1><div class="price">${R(p.preco)}</div><small>ou 6x de ${R(p.preco/6)} sem juros</small>
 <ul><li>${p.descricao||'Sem descrição.'}</li><li>Vendido por ${vendedor(p)}</li></ul>
 <button class="add cta" id="add" style="border:0;width:100%">Adicionar ao carrinho</button></div></div>`;
 $('add').onclick=()=>adicionar(p.id);
}
