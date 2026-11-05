# Weather App — Especificação de Produto

## Overview

Aplicação web responsiva, em pt-BR, para pesquisar cidades e consultar seu clima atual e a previsão diária de cinco dias: hoje e os quatro dias seguintes. A fonte será Open-Meteo, sem API key. Celsius será a unidade inicial, com opção de alternar para Fahrenheit. Não haverá autenticação nem persistência de dados no servidor.

O usuário seleciona manualmente uma cidade nos resultados da busca. As datas da previsão seguem o fuso local retornado para a cidade. Campos meteorológicos opcionais ausentes devem ser indicados como indisponíveis, nunca representados por valores inventados.

## Functional Requirements

- **FR-01 — Buscar e selecionar cidade:** permitir pesquisar por nome e selecionar uma cidade entre os resultados de geocoding.
- **FR-02 — Consultar clima atual:** apresentar, para a cidade selecionada, temperatura e condição meteorológica atuais.
- **FR-03 — Consultar previsão de cinco dias:** apresentar hoje e os quatro dias seguintes, com data, condição e temperaturas mínima e máxima para cada dia disponível.
- **FR-04 — Alternar unidade:** apresentar Celsius por padrão e permitir alternar todas as temperaturas entre Celsius e Fahrenheit sem nova requisição meteorológica.
- **FR-05 — Comunicar estados de consulta:** apresentar estados distinguíveis de carregamento, vazio, sucesso, resposta parcial e erro; permitir nova tentativa após falha recuperável.

## User Stories

- **US-01 (FR-01/02):** Como pessoa que planeja a rotina, quero buscar minha cidade e consultar o clima atual para me preparar antes de sair.
- **US-02 (FR-01/03):** Como pessoa que planeja uma viagem, quero selecionar a cidade de destino e ver a previsão de cinco dias para organizar meus planos.
- **US-03 (FR-01):** Como pessoa que planeja uma viagem, quero distinguir cidades homônimas para consultar o local correto.
- **US-04 (FR-04):** Como pessoa que prefere Fahrenheit, quero alternar a unidade para interpretar as temperaturas sem conversão manual.
- **US-05 (FR-05):** Como pessoa que planeja a rotina, quero receber feedback quando a busca falha ou não encontra resultados para saber como continuar.

## Acceptance Criteria

Os cenários de API devem usar respostas controladas em testes, sem depender da rede pública.

### FR-01 — Busca e seleção

- **AC-01.1** — **Given** uma consulta não vazia e resultados correspondentes, **When** a pessoa envia a busca, **Then** o app apresenta até cinco resultados selecionáveis com nome da cidade e país, e região administrativa quando fornecida.
- **AC-01.2** — **Given** que resultados de geocoding foram apresentados, **When** a pessoa seleciona um, **Then** a cidade selecionada passa a ser o contexto de FR-02 e FR-03.
- **AC-01.3** — **Given** que o campo está vazio ou contém apenas espaços, **When** a pessoa envia a busca, **Then** nenhuma requisição é enviada e o campo continua disponível para edição.
- **AC-01.4** — **Given** uma consulta com acentos, hífen ou apóstrofo, **When** ela é enviada, **Then** os caracteres são preservados na consulta codificada e o resultado é tratado como texto.
- **AC-01.5** — **Given** uma resposta bem-sucedida sem resultados, **When** o app processa a resposta, **Then** mostra o estado “nenhuma cidade encontrada”, preserva a consulta e não apresenta a situação como erro de API.
- **AC-01.6** — **Given** dois resultados com o mesmo nome de cidade, **When** são apresentados, **Then** país e região, quando disponíveis, permitem diferenciá-los antes da seleção.

### FR-02 — Clima atual

- **AC-02.1** — **Given** uma cidade selecionada e uma resposta atual válida, **When** o carregamento termina, **Then** o app mostra o nome da cidade, a temperatura em Celsius e a condição meteorológica em pt-BR.
- **AC-02.2** — **Given** que uma resposta atual não contém temperatura ou código de condição, **When** o app a apresenta, **Then** o campo ausente é marcado como indisponível e não recebe um valor substituto fictício.

### FR-03 — Previsão de cinco dias

- **AC-03.1** — **Given** uma cidade selecionada e dados completos, **When** a previsão é apresentada, **Then** há cinco datas consecutivas, começando pela data atual no fuso local da cidade, com condição, mínima e máxima para cada data.
- **AC-03.2** — **Given** uma resposta parcial ou um dia ausente, **When** a previsão é apresentada, **Then** os dados válidos são mantidos, a lacuna é identificada como indisponível e a interface informa que a previsão está incompleta.
- **AC-03.3** — **Given** uma resposta válida com menos de cinco datas, **When** o app normaliza a previsão, **Then** as datas esperadas continuam identificáveis e dias sem dados são marcados como indisponíveis, sem serem apresentados como previsão completa.

### FR-04 — Unidade de temperatura

- **AC-04.1** — **Given** temperaturas carregadas em Celsius, **When** a pessoa seleciona Fahrenheit, **Then** todos os valores atuais e previstos passam a usar Fahrenheit, são arredondados ao inteiro mais próximo com empates arredondados para longe de zero, e usam o rótulo `°F`; `0 °C` é exibido como `32 °F` e `20 °C` como `68 °F`.
- **AC-04.2** — **Given** temperaturas exibidas em Fahrenheit, **When** a pessoa seleciona Celsius, **Then** os valores Celsius originais e o rótulo `°C` voltam a ser exibidos.
- **AC-04.3** — **Given** dados meteorológicos já carregados, **When** a pessoa alterna a unidade, **Then** nenhuma requisição meteorológica adicional é enviada.
- **AC-04.4** — **Given** a aplicação acabou de iniciar, **When** uma temperatura é apresentada, **Then** ela usa Celsius. A escolha de unidade não é persistida após recarregar a página no escopo inicial.

### FR-05 — Estados de consulta

- **AC-05.1** — **Given** uma requisição pendente, **When** o app aguarda sua conclusão, **Then** um indicador de carregamento é apresentado.
- **AC-05.2** — **Given** erro de rede, resposta inválida, erro HTTP ou timeout, **When** o app processa a falha, **Then** apresenta mensagem de erro em pt-BR e uma ação de nova tentativa, sem declarar os dados antigos como atuais.
- **AC-05.3** — **Given** uma nova consulta iniciada antes de uma anterior terminar, **When** a resposta antiga chega depois da resposta mais recente, **Then** a resposta antiga é ignorada e não substitui os dados da consulta mais recente.

## Traceability

| User Story | Requisitos funcionais | Acceptance Criteria | Requisitos não funcionais relevantes |
|---|---|---|---|
| US-01 — Buscar a cidade da rotina e consultar o clima atual | FR-01, FR-02 | AC-01.1, AC-01.2, AC-01.3, AC-01.5, AC-02.1, AC-02.2, AC-05.1, AC-05.2, AC-05.3 | NFR-01 a NFR-08 |
| US-02 — Selecionar destino e consultar previsão | FR-01, FR-03 | AC-01.1, AC-01.2, AC-01.6, AC-03.1, AC-03.2, AC-03.3, AC-05.1, AC-05.2, AC-05.3 | NFR-01 a NFR-08 |
| US-03 — Distinguir cidades homônimas | FR-01 | AC-01.1, AC-01.2, AC-01.6 | NFR-01, NFR-02, NFR-03, NFR-04, NFR-07, NFR-08 |
| US-04 — Alternar para Fahrenheit | FR-04 | AC-04.1, AC-04.2, AC-04.3, AC-04.4 | NFR-01, NFR-02, NFR-03, NFR-04, NFR-07 |
| US-05 — Receber feedback de busca | FR-01, FR-05 | AC-01.3, AC-01.5, AC-05.1, AC-05.2, AC-05.3 | NFR-01 a NFR-07 |

## Non-Functional Requirements

Os limites quantitativos abaixo são valores iniciais para desenvolvimento e precisam ser validados nas condições de medição do projeto.

- **NFR-01 — Idioma:** textos e mensagens da interface usam pt-BR.
- **NFR-02 — Responsividade:** fluxos principais funcionam a partir de 320 px de largura sem rolagem horizontal.
- **NFR-03 — Acessibilidade:** atender WCAG 2.2 nível AA; todos os controles funcionam por teclado e têm nome acessível.
- **NFR-04 — Feedback de interação:** apresentar feedback visual em até 100 ms após iniciar uma busca.
- **NFR-05 — Renderização:** atualizar a interface em até 500 ms após receber e validar uma resposta da API, excluindo o tempo da rede externa.
- **NFR-06 — Timeout:** cancelar cada requisição externa após 10 segundos e exibir o estado definido em AC-05.2.
- **NFR-07 — Compatibilidade:** suportar as duas versões estáveis mais recentes de Chrome, Edge, Firefox e Safari.
- **NFR-08 — Privacidade:** não exigir conta, não persistir dados no servidor e não solicitar geolocalização no escopo inicial.

## Edge Cases

| Caso | Comportamento esperado |
|---|---|
| Cidade inexistente | Tratar resposta de geocoding vazia conforme AC-01.5; não consultar previsão. |
| Input vazio ou só espaços | Não enviar requisição e manter o campo disponível para correção. |
| Acentos, hífens e apóstrofos | Preservar e codificar caracteres; tratar entrada apenas como texto. |
| Falha de API | Mostrar erro recuperável, diferenciado de busca sem resultados. |
| Timeout | Cancelar a requisição após 10 segundos, encerrar loading e oferecer nova tentativa. |
| Geocoding sem resultados | Mostrar estado vazio, sem classificar como erro de API. |
| Resposta parcial | Exibir dados válidos e marcar campos/dias ausentes; não usar zero como substituto. |
| Respostas fora de ordem | Ignorar resposta de uma consulta que já foi substituída por outra mais recente. |
| Unidade alternada durante carregamento | Usar a unidade selecionada ao apresentar a resposta, sem requisição adicional. |

## Assumptions

- A Open-Meteo oferece os dados necessários sem API key e é aceitável para o uso pretendido; termos e limites de uso precisam ser verificados.
- A pessoa inicia a busca manualmente; geolocalização automática não faz parte do escopo inicial.
- Dados mínimos do clima atual: temperatura e código/condição meteorológica.
- Dados mínimos por dia: data, condição, temperatura mínima e máxima.
- A data de “hoje” é calculada no fuso da cidade retornado pela API.
- Unidade selecionada vale durante a sessão e volta a Celsius após recarregar a página.
- Limites quantitativos de NFR são metas iniciais, sujeitos a confirmação do stakeholder.

## Risks

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Indisponibilidade, latência ou limite de requisições da Open-Meteo. | Média | Alto | Timeout, erro recuperável e nova tentativa manual; verificar termos e limites antes da entrega. |
| Resultado de geocoding corresponde a cidade homônima errada. | Média | Alto | Mostrar país e região quando disponíveis; exigir seleção explícita. |
| Dados incompletos ou desatualizados são confundidos com dados completos. | Média | Alto | Validar resposta e marcar explicitamente campos e dias ausentes. |
| Erro de fuso ou resposta obsoleta mostra a previsão de outro dia/cidade. | Baixa | Alto | Usar fuso fornecido pela API e ignorar respostas substituídas. |
| Problemas de responsividade ou acessibilidade excluem usuários. | Média | Alto | Testes de teclado, acessibilidade e viewports mobile/desktop. |
| Condições de uso do provedor mudam ou não atendem à distribuição planejada. | Baixa | Alto | Revisar termos, atribuição e limites antes de publicar; manter integração isolada. |

## Out of Scope

- Autenticação, contas, sincronização ou persistência de dados no servidor.
- Persistência local de preferências; a unidade volta a Celsius ao reiniciar a sessão.
- Geolocalização automática.
- Favoritos, histórico de buscas persistente e comparação de cidades.
- Previsão horária, mapas, alertas severos, notificações e widgets.
- Uso offline ou apresentação de cache como dado atual.
- Suporte a idiomas além de pt-BR.

## Open Questions

- As metas de 100 ms, 500 ms e 10 segundos estão aprovadas? Qual será o ambiente de medição?
- A política de uso, atribuição e os limites da Open-Meteo atendem ao produto e ao volume esperado?
- Região administrativa deve ser exigida para desambiguar resultados ou cidade + país são suficientes?
- Deve haver armazenamento local da unidade em uma versão futura?
- Quais critérios de disponibilidade/monitoramento são esperados, considerando a dependência externa?
- Há requisitos de retenção de logs técnicos ou telemetria? Se sim, quais limites de privacidade se aplicam?
