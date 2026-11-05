# Discovery — Weather App

## Resumo Executivo

- O produto será um app web de clima em pt-BR, utilizável em dispositivos móveis e desktop.
- Usuários poderão buscar uma cidade e consultar as condições meteorológicas atuais.
- A previsão cobrirá hoje e os quatro dias seguintes.
- A fonte será Open-Meteo, sem API key; Celsius será o padrão, com alternância para Fahrenheit.
- Não haverá autenticação nem persistência de dados no servidor; a disponibilidade da fonte externa é um risco.

## Contexto

A empresa solicitou uma aplicação de previsão do tempo. O briefing pede busca de cidades, consulta do clima atual, previsão de cinco dias, alternância Celsius/Fahrenheit e uso em dispositivos móveis. A análise identifica requisitos e decisões para orientar a especificação sem iniciar a implementação.

## Requisitos Funcionais

- **RF-D01 — Buscar cidade:** permitir que a pessoa pesquise uma cidade e selecione o local desejado.
- **RF-D02 — Consultar clima atual:** apresentar condições atuais para a cidade selecionada.
- **RF-D03 — Consultar previsão:** apresentar a previsão de hoje e dos quatro dias seguintes.
- **RF-D04 — Alternar unidade:** permitir alternar a temperatura entre Celsius e Fahrenheit.

## Requisitos Não-Funcionais

Os itens abaixo são necessidades identificadas no discovery. Os valores quantitativos são propostas a confirmar na especificação.

- **RNF-D01 — Responsividade:** os fluxos principais devem funcionar em telas móveis e desktop; proposta: sem rolagem horizontal em larguras a partir de 320 px.
- **RNF-D02 — Acessibilidade:** controles devem ser utilizáveis por teclado e leitores de tela; proposta: WCAG 2.2 nível AA.
- **RNF-D03 — Desempenho:** busca e consulta do clima devem fornecer feedback rápido; metas precisam de condições de medição acordadas.
- **RNF-D04 — Resiliência:** falhas da rede ou da fonte devem ser comunicadas sem bloquear a interface.
- **RNF-D05 — Privacidade:** não solicitar dados pessoais ou localização sem necessidade; não haverá autenticação nem persistência no servidor.

## Personas

| Persona | Objetivo principal | Contexto de uso | Métrica de sucesso pessoal |
|---|---|---|---|
| **Pessoa que planeja a rotina** | Ver as condições atuais para se preparar antes de sair. | Principalmente mobile, consulta rápida da própria cidade. | Localiza a cidade e entende o clima atual em até 30 segundos, sem repetir a busca. |
| **Pessoa que planeja uma viagem** | Consultar o tempo no destino para organizar os próximos dias. | Desktop ao planejar e mobile durante a viagem. | Encontra a cidade correta e interpreta a previsão de cinco dias sem confundir datas. |
| **Pessoa que prefere Fahrenheit** | Ler temperaturas numa unidade familiar. | Mobile ou desktop; pode alternar a unidade durante a consulta. | Alterna a unidade e entende todas as temperaturas apresentadas sem conversão manual. |

As métricas são hipóteses para validação com usuários, não metas de produto aprovadas.

## Riscos

| Risco | Tipo | Probabilidade | Impacto | Mitigação proposta |
|---|---|---|---|---|
| Open-Meteo ou a conexão ficam indisponíveis ou lentas. | Técnico | Média | Alto | Tratar timeout e erros; permitir nova tentativa; monitorar limites e condições de uso. |
| A busca apresenta uma cidade homônima incorreta. | Produto/Técnico | Média | Alto | Diferenciar resultados com país e região quando disponíveis; exigir seleção explícita. |
| A previsão é interpretada em datas ou fusos inesperados. | Produto/Técnico | Média | Médio | Definir o significado de cinco dias e usar o fuso local da cidade. |
| Dados parciais ou desatualizados parecem completos e atuais. | Produto/Técnico | Média | Alto | Identificar campos/dias indisponíveis e distinguir falha de resposta vazia. |
| A interface não funciona bem em telas pequenas ou com tecnologia assistiva. | Produto/Técnico | Média | Alto | Validar responsividade, navegação por teclado, nomes acessíveis e contraste. |
| A conversão ou o rótulo de unidade fica inconsistente entre telas. | Técnico | Baixa | Médio | Manter Celsius como valor canônico e testar conversão e apresentação. |

## Perguntas em Aberto

| Pergunta | Impacto se não for respondida |
|---|---|
| Quais campos devem aparecer no clima atual e em cada dia da previsão? | Define o contrato de dados, o layout e os critérios de aceite. |
| Como distinguir cidades homônimas, e quais campos devem ser exibidos quando região ou país faltarem? | Pode levar a pessoa a consultar o local errado. |
| A preferência Fahrenheit deve ser mantida entre sessões no dispositivo? | Afeta o comportamento ao reabrir o app e a necessidade de armazenamento local. |
| Qual política aplicar a limite de requisições e indisponibilidade da Open-Meteo? | Afeta recuperação, frequência de chamadas e expectativas de disponibilidade. |
| Quais navegadores e versões precisam ser suportados? | Define a matriz de compatibilidade e os ambientes de teste. |
| Quais metas de desempenho são aprovadas e em quais condições devem ser medidas? | Sem método e condições, não é possível determinar objetivamente se o app atende à meta. |
| Deve haver geolocalização automática ou a busca será manual? | Pode acrescentar permissões e implicações de privacidade; o briefing só requer busca de cidades. |
| O app deve armazenar cache ou exibir dados anteriores quando estiver offline? | Afeta frescor dos dados, comportamento de falha e complexidade de estado. |

## Suposições

- O produto inicial será uma aplicação web responsiva.
- A busca será iniciada manualmente; geolocalização automática não foi solicitada.
- A fonte meteorológica será externa e poderá falhar independentemente do app.
- Não há requisito de login, conta, favoritos ou sincronização entre dispositivos.
- Celsius é o padrão; persistência local da escolha de unidade não foi decidida.
- Os requisitos não funcionais quantitativos permanecem propostas até aprovação.

## Decisões

| Decisão | Justificativa | Pergunta resolvida |
|---|---|---|
| Fonte: Open-Meteo, sem API key. | Remove a necessidade de cadastro de chave para o uso previsto. | Qual fonte usar e se é necessária uma chave? |
| “Cinco dias” = hoje e os quatro dias seguintes. | Define o período da previsão. | A previsão inclui hoje? |
| Unidade padrão: Celsius. | Define a apresentação inicial das temperaturas. | Qual é a unidade inicial? |
| Sem autenticação e sem persistência de servidor. | Mantém o escopo sem contas nem armazenamento remoto de dados do usuário. | O app exige login ou armazena dados no servidor? |
| Idioma da interface: pt-BR. | Define idioma e localidade do produto. | Qual idioma será usado? |
