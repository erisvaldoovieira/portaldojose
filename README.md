# Portal do José

Site estático em HTML, CSS e JavaScript. Não exige instalação de dependências nem etapa de build.

## Prévia local

Execute na raiz do projeto:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Acesse http://127.0.0.1:8765. Para publicar na hospedagem existente, envie `index.html`, `styles.css`, `script.js` e a pasta `assets/`.

## Conteúdo

- Candidato a deputado federal pelo RJ, PSB, número 4000.
- As seis propostas em `index.html` resumem os compromissos publicados em https://queroapoiar.com.br/professorjose, consultados em 07/09/2026. Cada card contém um link para a fonte. Atualize a data da consulta ao revisar o conteúdo.
- Site de referência: https://professorjose2026.com.br/.
- Notícias e comentários do YouTube não devem ser apresentados automaticamente como propostas de campanha.
- Não publicar CNPJ, redes sociais ou estatísticas sem dados confirmados.

## Vídeos

`script.js` consulta o feed do canal por meio do rss2json, com limite de oito segundos. Exibe até três vídeos com IDs e URLs validados. Títulos são inseridos como texto, sem HTML externo. O cache opcional em `localStorage` mantém os últimos vídeos recebidos e é identificado como conteúdo salvo quando a atualização falha. Sem JavaScript, cache ou serviço disponível, permanece o link direto ao canal.

## Visual e acessibilidade

Layout adaptável, menu com botão acessível e fechamento por Escape, link para pular navegação, foco visível e rolagem e transições reduzidas conforme a preferência do dispositivo. A animação da imagem principal inicia automaticamente e permanece ativa, inclusive no modo de movimento reduzido, conforme a configuração solicitada para o portal. Imagens WebP otimizadas; os arquivos originais foram preservados. Metadados básicos Open Graph e favicon configurados. Ao definir o domínio final, complementar URL canônica e imagem social com URLs absolutas desse domínio.
