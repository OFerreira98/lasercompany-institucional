# Guia de fotos do site Laser & Co

O site já funciona com placeholders elegantes da marca. Assim que tiver as fotos
reais, basta soltá-las nas pastas abaixo com o nome certo, que elas aparecem
automaticamente (não precisa mexer no código).

Formato recomendado: JPG ou WEBP, boa resolução, otimizadas pra web.

---

## 1. Fachadas das unidades  ->  pasta `unidades/`

Nomeie cada foto com o **id da unidade** (está no arquivo `scripts/data.js`).
Exemplos:
- `sp-vmariana.jpg`  (Vila Mariana)
- `rj-ipanema.jpg`   (Ipanema)
- `mg-bh-savassi.jpg`(BH Savassi)

> Hoje a lista tem 70 unidades. Não precisa ter todas de uma vez:
> as que não tiverem foto seguem com o placeholder da marca.

---

## 2. Antes e Depois dos procedimentos  ->  pasta `antes-depois/`

Para cada procedimento, duas fotos com o **id do procedimento** + sufixo:
- `rejuv-facial-4d-antes.jpg`  e  `rejuv-facial-4d-depois.jpg`
- `melasma-antes.jpg`          e  `melasma-depois.jpg`

Depois de adicionar, registrar no `scripts/data.js` dentro do procedimento:
```js
{ id: 'melasma', nome: 'Melasma', sub: '...',
  antes: 'assets/img/antes-depois/melasma-antes.jpg',
  depois: 'assets/img/antes-depois/melasma-depois.jpg' }
```

---

## 3. As 4 máquinas + ultrassom  ->  pasta `maquinas/`

PRECISO destas fotos (não consigo gerá-las). Nomes sugeridos:
- `alexandrite.jpg`
- `nd-yag.jpg`
- `erbium.jpg`
- `q-switched.jpg`
- `ultracel.jpg`  (ultrassom)

---

## 4. Equipe / recepção (página Vagas)  ->  pasta `equipe/`

Fotos das funcionárias uniformizadas, recepção, balcão. Sugestão:
- `recepcao.jpg`  (usada como fundo do topo da página Vagas)
- `time-1.jpg`, `time-2.jpg` ...
