# Weather App — Backlog de Tarefas

Tarefas derivadas de [plans/weather-app-plan.md](../plans/weather-app-plan.md) e rastreáveis aos requisitos de [specs/weather-app-spec.md](../specs/weather-app-spec.md). A ordem das entregas segue o fluxo de implementação; dependências diretas estão listadas em cada tarefa.

## Rastreabilidade dos requisitos funcionais

| Requisito da spec | Tarefas de implementação | Tarefas de teste/verificação | Cobertura |
|---|---|---|---|
| **FR-01 — Buscar e selecionar cidade** | T-07, T-09, T-12, T-13, T-14, T-19 | T-23, T-27, T-29, T-34, T-35, T-37 | Coberto: consulta, vazio, seleção explícita e desambiguação. |
| **FR-02 — Consultar clima atual** | T-05, T-08, T-15, T-19 | T-21, T-24, T-30, T-34 | Coberto: temperatura, condição e campos indisponíveis. |
| **FR-03 — Consultar previsão de cinco dias** | T-05, T-06, T-08, T-16, T-19 | T-21, T-22, T-24, T-31, T-34 | Coberto: cinco dias locais, condição, mínimas/máximas e parcialidade. |
| **FR-04 — Alternar unidade** | T-04, T-09, T-17, T-19 | T-20, T-25, T-32, T-36 | Coberto: Celsius inicial, conversão, retorno a Celsius e ausência de nova consulta/persistência. |
| **FR-05 — Comunicar estados de consulta** | T-07, T-08, T-09, T-11, T-12, T-13, T-16, T-19 | T-23 a T-28, T-31, T-35, T-37 | Coberto: loading, vazio, sucesso, parcial, erro, retry e concorrência. |

Todos os requisitos funcionais FR-01 a FR-05 têm tarefas correspondentes. A tabela aponta tarefas de implementação e de verificação; não há requisito funcional sem cobertura planejada.

## Prioridade e tamanho

**Prioridade:** P0 bloqueia a primeira entrega utilizável; P1 completa o MVP e os requisitos de qualidade; P2 valida otimizações e compatibilidade após o primeiro fluxo funcional. P2 não significa remover o requisito do escopo.

**Tamanho relativo:** P (pequeno), M (médio), G (grande), considerando esforço, incerteza e quantidade de comportamento integrado, não apenas arquivos.

| Tarefa | Prioridade | Tamanho |
|---|---|---|
| T-01 | P0 | M |
| T-02 | P1 | P |
| T-03 | P0 | P |
| T-04 | P0 | P |
| T-05 | P0 | P |
| T-06 | P1 | P |
| T-07 | P0 | M |
| T-08 | P0 | M |
| T-09 | P0 | G |
| T-10 | P0 | P |
| T-11 | P0 | P |
| T-12 | P0 | P |
| T-13 | P0 | P |
| T-14 | P0 | M |
| T-15 | P0 | P |
| T-16 | P1 | M |
| T-17 | P1 | P |
| T-18 | P1 | P |
| T-19 | P0 | G |
| T-20 | P0 | P |
| T-21 | P1 | P |
| T-22 | P1 | P |
| T-23 | P0 | M |
| T-24 | P0 | M |
| T-25 | P0 | M |
| T-26 | P0 | P |
| T-27 | P0 | P |
| T-28 | P0 | P |
| T-29 | P0 | M |
| T-30 | P0 | P |
| T-31 | P1 | P |
| T-32 | P1 | P |
| T-33 | P0 | P |
| T-34 | P0 | G |
| T-35 | P1 | P |
| T-36 | P1 | P |
| T-37 | P1 | M |
| T-38 | P1 | M |
| T-39 | P2 | M |
| T-40 | P1 | M |
| T-41 | P0 | P |
| T-42 | P0 | M |

## Sequência sugerida por fatias verticais

1. **Fundação:** T-01 a T-03. Configurações e tipos podem avançar em paralelo; não entregam UI, mas habilitam as fatias seguintes.
2. **Busca e clima atual (primeiro valor visível):** T-04, T-05, T-07 a T-15 e T-19; validar com T-20, T-21, T-23, T-25 a T-30. Entrega busca selecionável, loading/vazio/erro e clima atual da cidade.
3. **Previsão de cinco dias:** T-06, T-16; validar com T-22, T-24 e T-31. A resposta Forecast já vem de T-08; esta fatia torna a previsão visível na tela.
4. **Alternância de unidade:** T-17; validar com T-32 e T-36. O hook de T-09 já guarda a unidade; esta fatia conecta o controle à UI e confirma que não há nova chamada.
5. **Pronto para release:** T-18, T-33 a T-35 e T-37 a T-42; fechar acessibilidade, mobile, erros E2E, performance, navegadores, condições do provedor e gates.

**Ajuste de dependência para antecipar a primeira fatia:** T-19 atualmente depende de T-11 a T-18, o que faz a busca/clima atual esperar previsão, unidade e estilos responsivos. Recomenda-se separar a integração: primeiro conectar T-11 a T-15 em T-19; depois criar uma tarefa pequena de integração para T-16 a T-18 antes dos testes E2E completos. Assim a primeira versão visível não precisa aguardar as fatias de previsão e unidade.

## Entrega 1 — Infraestrutura e tipos

### T-01 — Configurar a base de testes unitários
- **Tipo:** Infra
- **Descrição:** Disponibilizar Vitest, Testing Library e o comando de testes unitários.
- **Critérios de aceite:** `pnpm test -- --run` inicia Vitest sem erro de configuração; dependências de `@testing-library/react` e `@testing-library/user-event` estão declaradas; a configuração Vite existente continua carregando a aplicação.
- **Dependências:** Nenhuma.
- **Arquivos prováveis:** `package.json`, `vite.config.ts`.
- **Requisitos:** Habilitador técnico para executar testes dos AC-01.1 a AC-05.3; sem FR/AC/NFR de produto independente.

### T-02 — Configurar lint, formatação e build
- **Tipo:** Infra
- **Descrição:** Garantir os comandos existentes de lint e build e a configuração Biome.
- **Critérios de aceite:** `pnpm lint` e `pnpm build` terminam com código 0; `pnpm lint` executa Biome usando `biome.json`.
- **Dependências:** Nenhuma.
- **Arquivos prováveis:** `package.json`, `biome.json`.
- **Requisitos:** Habilitador técnico; sem FR/AC/NFR de produto direto.

### T-03 — Definir os tipos do domínio meteorológico
- **Tipo:** Data
- **Descrição:** Declarar os contratos compartilhados de cidade, clima, previsão, unidade e estado da aplicação.
- **Critérios de aceite:** Os tipos incluem `City`, `CurrentWeather`, `ForecastDay`, `WeatherData`, `WeatherViewState`, `Unit`, `SearchStatus`, `WeatherStatus` e `WeatherErrorCode`; campos meteorológicos opcionais aceitam `null`; `pnpm exec tsc --noEmit -p tsconfig.app.json` termina com código 0.
- **Dependências:** T-02.
- **Arquivos prováveis:** `src/types/weather.ts`.
- **Requisitos:** FR-01 a FR-05; modelo de dados da spec.

## Entrega 2 — Funções puras

### T-04 — Implementar conversão de temperatura
- **Tipo:** Data
- **Descrição:** Converter valores canônicos em Celsius para apresentação na unidade selecionada.
- **Critérios de aceite:** Fahrenheit segue $F = C \times 9/5 + 32$; arredonda ao inteiro mais próximo, com empates para longe de zero; valor ausente não vira zero.
- **Dependências:** T-03.
- **Arquivos prováveis:** `src/lib/temperature.ts`.
- **Requisitos:** FR-04, AC-04.1 a AC-04.4.

### T-05 — Implementar mapeamento de códigos WMO
- **Tipo:** Data
- **Descrição:** Mapear códigos meteorológicos para descrições em pt-BR.
- **Critérios de aceite:** Cada código WMO suportado pelo mapeamento retorna descrição em pt-BR; código desconhecido ou ausente retorna o rótulo de indisponibilidade definido para a UI; a função não modifica o código recebido.
- **Dependências:** T-03.
- **Arquivos prováveis:** `src/lib/weather-code.ts`.
- **Requisitos:** FR-02, FR-03; AC-02.1, AC-03.1; NFR-01.

### T-06 — Implementar formatação de datas
- **Tipo:** Data
- **Descrição:** Formatar datas ISO da previsão em pt-BR sem deslocamento acidental de dia.
- **Critérios de aceite:** Para uma entrada ISO `YYYY-MM-DD`, a saída mantém o mesmo dia, mês e ano em pt-BR em UTC e em fusos positivos/negativos; entrada inválida ou ausente retorna o rótulo de indisponibilidade sem lançar exceção.
- **Dependências:** T-03.
- **Arquivos prováveis:** `src/lib/date.ts`.
- **Requisitos:** FR-03, AC-03.1; fuso local da cidade.

## Entrega 3 — Services Open-Meteo

### T-07 — Implementar serviço de geocoding
- **Tipo:** Data
- **Descrição:** Consultar geocoding, validar a resposta e normalizar resultados para `City`.
- **Critérios de aceite:** A URL contém `name` codificado, `count=5`, `language=pt` e `format=json`; cada resultado válido é normalizado com nome, latitude, longitude e país; `results: null`/`[]` retorna lista vazia e campo obrigatório ausente/inválido gera `invalid-response`; HTTP não-2xx, rejeição de rede e timeout geram categorias distintas; a chamada aborta após 10 s e respeita `AbortSignal`.
- **Dependências:** T-03.
- **Arquivos prováveis:** `src/services/geocoding.ts`.
- **Requisitos:** FR-01, FR-05; AC-01.1, AC-01.4, AC-01.5, AC-05.2.

### T-08 — Implementar serviço de previsão
- **Tipo:** Data
- **Descrição:** Consultar Forecast e normalizar clima atual e cinco datas em `WeatherData`.
- **Critérios de aceite:** A URL contém latitude/longitude da cidade, `forecast_days=5`, `timezone=auto`, `temperature_unit=celsius` e os campos `current`/`daily` do plano; a saída contém cinco datas consecutivas iniciando na data local retornada; valores ausentes são `null` e resposta incompleta é marcada parcial; HTTP não-2xx, rede, JSON/formato inválido e timeout são distinguíveis; a chamada aborta após 10 s e respeita `AbortSignal`.
- **Dependências:** T-03.
- **Arquivos prováveis:** `src/services/weather.ts`.
- **Requisitos:** FR-02, FR-03, FR-05; AC-02.2, AC-03.1 a AC-03.3, AC-05.2.

## Entrega 4 — Hook de orquestração

### T-09 — Implementar o hook `useWeather`
- **Tipo:** Data
- **Descrição:** Orquestrar busca, seleção, clima, estados, unidade, cancelamento e retry no reducer local.
- **Critérios de aceite:** O hook expõe `searchStatus` e `weatherStatus` separados; `unit` inicia como `celsius` e permanece apenas em memória; ao iniciar nova busca/clima os dados anteriores ficam `null`; respostas de requisições substituídas não alteram o estado ativo; retry aciona somente a operação que falhou; alterar a unidade atualiza estado sem chamar os services.
- **Dependências:** T-03, T-07, T-08.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`.
- **Requisitos:** FR-01, FR-04, FR-05; AC-05.1 a AC-05.3, AC-04.3.

## Entrega 5 — Componentes e estilos

### T-10 — Definir estilos globais da aplicação
- **Tipo:** UI
- **Descrição:** Preparar a folha global da interface usando Tailwind e o tema previsto no projeto.
- **Critérios de aceite:** A folha declara estilos globais e uma regra `:focus-visible` com indicador visual; não contém regras de negócio nem chamadas/acesso a dados; a aplicação importa esta folha global.
- **Dependências:** T-02.
- **Arquivos prováveis:** `src/styles/index.css`.
- **Requisitos:** NFR-02, NFR-03.

### T-11 — Criar estado visual de carregamento
- **Tipo:** UI
- **Descrição:** Apresentar um indicador semântico durante requisições pendentes.
- **Critérios de aceite:** O indicador renderiza texto em pt-BR, expõe `role="status"` e `aria-live="polite"`, e não faz requisições próprias.
- **Dependências:** T-10.
- **Arquivos prováveis:** `src/components/states/LoadingState.tsx`.
- **Requisitos:** FR-05, AC-05.1; NFR-01, NFR-03.

### T-12 — Criar estado visual vazio
- **Tipo:** UI
- **Descrição:** Comunicar que a busca terminou sem encontrar cidades.
- **Critérios de aceite:** O componente renderiza “Nenhuma cidade encontrada” em pt-BR, não usa `role="alert"` e não altera o texto de busca recebido por props.
- **Dependências:** T-10.
- **Arquivos prováveis:** `src/components/states/EmptyState.tsx`.
- **Requisitos:** FR-01, FR-05; AC-01.5.

### T-13 — Criar estado visual de erro
- **Tipo:** UI
- **Descrição:** Apresentar falha recuperável com ação de retry.
- **Critérios de aceite:** O componente expõe mensagem em pt-BR via `role="alert"`; não renderiza código/status técnico; botão de retry tem nome acessível e chama o callback recebido exatamente uma vez por ativação.
- **Dependências:** T-10.
- **Arquivos prováveis:** `src/components/states/ErrorState.tsx`.
- **Requisitos:** FR-05, AC-05.2; NFR-01, NFR-03.

### T-14 — Criar busca e seleção de cidades
- **Tipo:** UI
- **Descrição:** Implementar campo de busca e apresentação de resultados selecionáveis.
- **Critérios de aceite:** Enter envia a consulta não vazia uma vez e encaminha o texto sem alterá-lo; consulta vazia/só espaços não chama o callback; cada resultado renderiza nome e país, mais região quando presente; campo e opções têm roles/nomes acessíveis; o componente não importa services.
- **Dependências:** T-03, T-10.
- **Arquivos prováveis:** `src/components/CitySearch.tsx`.
- **Requisitos:** FR-01; AC-01.1 a AC-01.4, AC-01.6; NFR-03.

### T-15 — Criar apresentação do clima atual
- **Tipo:** UI
- **Descrição:** Exibir cidade, temperatura e condição meteorológica atuais.
- **Critérios de aceite:** Com props de fixture, o componente renderiza nome da cidade, temperatura com `°C`/`°F` e descrição WMO em pt-BR; para cada campo nulo renderiza “Indisponível”; não importa services.
- **Dependências:** T-03, T-04, T-05, T-10.
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`.
- **Requisitos:** FR-02; AC-02.1, AC-02.2; NFR-01.

### T-16 — Criar apresentação da previsão de cinco dias
- **Tipo:** UI
- **Descrição:** Exibir data, condição e temperaturas mínima/máxima para cada dia.
- **Critérios de aceite:** Com cinco itens de fixture, renderiza cinco datas na ordem recebida, cada uma com condição e mínima/máxima; campo nulo e dia sem dados exibem “Indisponível”; estado parcial exibe aviso de previsão incompleta; não importa services.
- **Dependências:** T-03, T-04, T-05, T-06, T-10.
- **Arquivos prováveis:** `src/components/ForecastList.tsx`.
- **Requisitos:** FR-03; AC-03.1 a AC-03.3.

### T-17 — Criar controle de unidade
- **Tipo:** UI
- **Descrição:** Implementar seleção acessível entre Celsius e Fahrenheit.
- **Critérios de aceite:** Controle com unidade `celsius` ou `fahrenheit` marca exatamente uma opção como selecionada; teclado alterna as opções; cada opção tem nome acessível e a alteração chama o callback uma vez; componente não importa services.
- **Dependências:** T-03, T-10.
- **Arquivos prováveis:** `src/components/UnitToggle.tsx`.
- **Requisitos:** FR-04; AC-04.1 a AC-04.4; NFR-03.

### T-18 — Preparar estilos responsivos dos componentes
- **Tipo:** UI
- **Descrição:** Aplicar regras responsivas aos componentes para evitar larguras fixas incompatíveis com telas estreitas.
- **Critérios de aceite:** Componentes não definem largura mínima superior a 320 px; textos longos podem quebrar linha; controles mantêm foco visível; validação completa de overflow é feita na T-38.
- **Dependências:** T-10 a T-17.
- **Arquivos prováveis:** `src/styles/index.css`.
- **Requisitos:** NFR-02, NFR-03.

## Entrega 6 — Integração da aplicação

### T-19 — Conectar estado e componentes à tela principal
- **Tipo:** UI
- **Descrição:** Ligar `App` ao hook e passar dados/callbacks aos componentes, sem mover regras de serviço para a UI.
- **Critérios de aceite:** Renderização integrada mostra busca, unidade Celsius e estado inicial sem cidade; callbacks de busca/seleção/unidade/retry são conectados às ações correspondentes do hook; código não chama Geolocation nem APIs de armazenamento do navegador.
- **Dependências:** T-09, T-11 a T-18.
- **Arquivos prováveis:** `src/App.tsx`.
- **Requisitos:** FR-01 a FR-05; NFR-08.

## Entrega 7 — Testes unitários e E2E

### T-20 — Testar conversão de unidade Celsius/Fahrenheit
- **Tipo:** Test
- **Descrição:** Cobrir conversões, unidades e regra de arredondamento.
- **Critérios de aceite:** Testes cobrem Celsius/Fahrenheit, negativos, valores ausentes, empates para longe de zero e exemplos `0 °C = 32 °F` e `20 °C = 68 °F`.
- **Dependências:** T-04, T-19.
- **Arquivos prováveis:** `tests/unit/temperature.test.ts`.
- **Requisitos:** AC-04.1 a AC-04.4.

### T-21 — Testar mapeamento WMO
- **Tipo:** Test
- **Descrição:** Verificar códigos meteorológicos conhecidos e casos sem mapeamento.
- **Critérios de aceite:** Testes cobrem códigos conhecidos, desconhecidos e ausentes; descrições estão em pt-BR.
- **Dependências:** T-05, T-19.
- **Arquivos prováveis:** `tests/unit/weather-code.test.ts`.
- **Requisitos:** FR-02, FR-03; AC-02.1, AC-03.1; NFR-01.

### T-22 — Testar formatação de datas
- **Tipo:** Test
- **Descrição:** Verificar apresentação da data da previsão sem mudança de dia por fuso.
- **Critérios de aceite:** Testes cobrem data válida, borda de mudança de dia em UTC e fusos positivos/negativos e entrada inválida.
- **Dependências:** T-06, T-19.
- **Arquivos prováveis:** `tests/unit/date.test.ts`.
- **Requisitos:** AC-03.1.

### T-23 — Testar geocoding com `fetch` mockado
- **Tipo:** Test
- **Descrição:** Testar requisição, normalização e falhas do geocoding com `fetch` mockado.
- **Critérios de aceite:** Asserções verificam query codificada e parâmetros `count=5`, `language=pt`, `format=json`; cobrem resultado com país/região, lista vazia, caracteres especiais, resposta HTTP inválida, JSON inválido, campos obrigatórios inválidos, rede e timeout de 10 s; `fetch` é mockado em todos os casos.
- **Dependências:** T-07, T-19.
- **Arquivos prováveis:** `tests/unit/geocoding.test.ts`.
- **Requisitos:** AC-01.1 a AC-01.6, AC-05.2.

### T-24 — Testar Forecast com `fetch` mockado
- **Tipo:** Test
- **Descrição:** Validar parâmetros, mapeamento e respostas parciais usando `fetch` mockado.
- **Critérios de aceite:** Asserções verificam parâmetros da URL e mapeamento de clima atual; cobrem cinco dias completos, menos de cinco dias, arrays de comprimentos diferentes, valores ausentes, HTTP não-2xx, JSON/estrutura inválidos, rejeição de rede e timeout; `fetch` é mockado em todos os casos.
- **Dependências:** T-08, T-19.
- **Arquivos prováveis:** `tests/unit/weather.test.ts`.
- **Requisitos:** AC-02.1, AC-02.2, AC-03.1 a AC-03.3, AC-05.2.

### T-25 — Testar o hook `useWeather`
- **Tipo:** Test
- **Descrição:** Validar transições, retry e concorrência usando services mockados.
- **Critérios de aceite:** Testes fazem asserts explícitos para cada status de busca e clima; verificam `unit === "celsius"` no estado inicial, dados antigos limpos, chamada de retry no service correto, `AbortSignal` abortado ao substituir consulta, resposta antiga ignorada e nenhuma chamada adicional ao alternar unidade.
- **Dependências:** T-09, T-19.
- **Arquivos prováveis:** `tests/unit/useWeather.test.ts`.
- **Requisitos:** AC-05.1 a AC-05.3; AC-04.3.

### T-26 — Testar componente no estado loading
- **Tipo:** Test
- **Descrição:** Verificar conteúdo e semântica do indicador de loading.
- **Critérios de aceite:** Teste encontra o texto de carregamento em pt-BR por `role="status"` e confirma `aria-live="polite"`.
- **Dependências:** T-11, T-19.
- **Arquivos prováveis:** `tests/unit/components/LoadingState.test.tsx`.
- **Requisitos:** AC-05.1, NFR-01, NFR-03.

### T-27 — Testar componente no estado vazio
- **Tipo:** Test
- **Descrição:** Verificar comunicação de busca sem resultados.
- **Critérios de aceite:** Teste encontra “Nenhuma cidade encontrada”, confirma que a consulta recebida permanece renderizada e que não existe elemento `role="alert"`.
- **Dependências:** T-12, T-19.
- **Arquivos prováveis:** `tests/unit/components/EmptyState.test.tsx`.
- **Requisitos:** AC-01.5.

### T-28 — Testar componente no estado de erro
- **Tipo:** Test
- **Descrição:** Verificar mensagem e callback de nova tentativa.
- **Critérios de aceite:** Teste encontra a mensagem por `role="alert"`, confirma ausência de código/status HTTP e verifica que ativar o botão nomeado de retry chama o mock exatamente uma vez.
- **Dependências:** T-13, T-19.
- **Arquivos prováveis:** `tests/unit/components/ErrorState.test.tsx`.
- **Requisitos:** AC-05.2, NFR-01, NFR-03.

### T-29 — Testar busca e seleção de cidades
- **Tipo:** Test
- **Descrição:** Validar interação de busca e desambiguação dos resultados.
- **Critérios de aceite:** Testes confirmam que Enter encaminha a consulta literal; vazio/só espaços não chama `onSearch`; clique/teclado seleciona o resultado esperado; nome, país e região distinguem duas cidades homônimas; input e resultados são encontrados por role e nome.
- **Dependências:** T-14, T-19.
- **Arquivos prováveis:** `tests/unit/components/CitySearch.test.tsx`.
- **Requisitos:** AC-01.1 a AC-01.4, AC-01.6; NFR-03.

### T-30 — Testar apresentação do clima atual
- **Tipo:** Test
- **Descrição:** Verificar dados completos e indisponíveis no clima atual.
- **Critérios de aceite:** Com fixture conhecida, teste confirma cidade, valor formatado e condição; quando temperatura ou condição é `null`, encontra “Indisponível” e não encontra `0` como substituto.
- **Dependências:** T-15, T-19.
- **Arquivos prováveis:** `tests/unit/components/CurrentWeather.test.tsx`.
- **Requisitos:** AC-02.1, AC-02.2.

### T-31 — Testar apresentação da previsão
- **Tipo:** Test
- **Descrição:** Verificar lista de cinco dias e lacunas de respostas parciais.
- **Critérios de aceite:** Teste confirma exatamente cinco itens ordenados, conteúdo de data/condição/mínima/máxima e rótulo “Indisponível” para campo/dia ausente; fixture parcial produz aviso de incompletude.
- **Dependências:** T-16, T-19.
- **Arquivos prováveis:** `tests/unit/components/ForecastList.test.tsx`.
- **Requisitos:** AC-03.1 a AC-03.3.

### T-32 — Testar controle de unidade
- **Tipo:** Test
- **Descrição:** Verificar seleção de unidade e interação por teclado.
- **Critérios de aceite:** Teste confirma que `celsius` seleciona Celsius e que a opção indicada pelas props fica selecionada; teclado/click alterna o valor e chama o callback com `fahrenheit`/`celsius`; opções têm roles e nomes acessíveis.
- **Dependências:** T-17, T-19.
- **Arquivos prováveis:** `tests/unit/components/UnitToggle.test.tsx`.
- **Requisitos:** AC-04.1 a AC-04.4; NFR-03.

### T-33 — Configurar execução E2E
- **Tipo:** Infra
- **Descrição:** Configurar Playwright e o comando de execução E2E.
- **Critérios de aceite:** `pnpm test:e2e -- --list` termina com código 0 e lista os testes; Playwright inicia a aplicação configurada localmente e a API de route interception está habilitada.
- **Dependências:** T-01, T-19.
- **Arquivos prováveis:** `playwright.config.ts`, `package.json`.
- **Requisitos:** Habilitador de teste para AC-01.1 a AC-05.3; sem FR/AC/NFR de produto independente.

### T-34 — Testar fluxo E2E de busca e clima
- **Tipo:** Test
- **Descrição:** Validar busca, seleção, clima atual e previsão usando respostas controladas.
- **Critérios de aceite:** Em cada viewport (320 px e 1280 px), o teste busca e seleciona uma cidade fixture e verifica nome, temperatura/condição atuais e exatamente cinco itens de previsão; interceptações respondem a todas as chamadas e o teste falha se houver request não interceptado.
- **Dependências:** T-19, T-33.
- **Arquivos prováveis:** `tests/e2e/weather-app.spec.ts`.
- **Requisitos:** AC-01.1, AC-01.2, AC-02.1, AC-03.1; NFR-02.

### T-35 — Testar E2E de vazio e recuperação de erro
- **Tipo:** Test
- **Descrição:** Validar estados sem resultado e retry após falha recuperável.
- **Critérios de aceite:** Fixture de geocoding vazia exibe o estado vazio sem `role="alert"`; fixture de erro exibe `role="alert"`; ativar retry emite uma nova chamada interceptada; nenhuma chamada sai para a rede pública.
- **Dependências:** T-34.
- **Arquivos prováveis:** `tests/e2e/weather-app.spec.ts`.
- **Requisitos:** AC-01.5, AC-05.2.

### T-36 — Testar alternância E2E sem nova consulta
- **Tipo:** Test
- **Descrição:** Confirmar a mudança de todas as temperaturas sem nova chamada meteorológica.
- **Critérios de aceite:** Em carregamento novo/recarregado a unidade exibida é Celsius; após carregar fixture, selecionar Fahrenheit atualiza todos os valores e rótulos `°C` para `°F`; retornar a Celsius restaura valores; contador de chamadas Forecast permanece inalterado nas duas alternâncias.
- **Dependências:** T-34.
- **Arquivos prováveis:** `tests/e2e/weather-app.spec.ts`.
- **Requisitos:** AC-04.1 a AC-04.3.

## Entrega 8 — Hardening e validação final

### T-37 — Testar teclado e semântica no fluxo E2E
- **Tipo:** Test
- **Descrição:** Verificar navegação por teclado e nomes acessíveis nos controles principais.
- **Critérios de aceite:** Teste executa busca via Tab/Enter, seleciona um resultado via teclado, alterna unidade via teclado e ativa retry via teclado; cada controle é localizado por role e nome acessível.
- **Dependências:** T-19, T-33.
- **Arquivos prováveis:** `tests/e2e/weather-app.spec.ts`.
- **Requisitos:** NFR-03; AC-01.1, AC-05.2.

### T-38 — Testar responsividade em viewports
- **Tipo:** Test
- **Descrição:** Verificar overflow e sobreposição na página com resultados do fluxo principal.
- **Critérios de aceite:** Após renderizar resultados de busca e previsão, em viewports de 320 px e 1280 px `document.documentElement.scrollWidth <= document.documentElement.clientWidth` e os bounding boxes dos controles principais não se sobrepõem.
- **Dependências:** T-18, T-34.
- **Arquivos prováveis:** `tests/e2e/weather-app.spec.ts`.
- **Requisitos:** NFR-02.

### T-39 — Medir metas de feedback e renderização
- **Tipo:** Test
- **Descrição:** Verificar as metas de resposta da interface com rede mockada.
- **Critérios de aceite:** Com chamadas interceptadas, o teste mede `performance.now()` desde submit até o estado loading (limite 100 ms) e desde a resposta mockada até conteúdo final renderizado (limite 500 ms); latência externa não é incluída.
- **Dependências:** T-34.
- **Arquivos prováveis:** `tests/e2e/performance.spec.ts`.
- **Requisitos:** NFR-04, NFR-05.

### T-40 — Configurar matriz de navegadores suportados
- **Tipo:** Infra
- **Descrição:** Declarar a matriz de navegadores alvo na configuração E2E e identificar limitações de execução.
- **Critérios de aceite:** A configuração inclui projetos para Chrome/Chromium, Edge (`msedge`), Firefox e WebKit; pipeline/documentação registra versões usadas e qualquer navegador que não pôde ser executado; WebKit não é declarado como teste de Safari nativo.
- **Dependências:** T-33.
- **Arquivos prováveis:** `playwright.config.ts`.
- **Requisitos:** NFR-07.

### T-41 — Revisar condições de uso da Open-Meteo
- **Tipo:** Infra
- **Descrição:** Verificar termos, atribuição e limites do provedor para a distribuição planejada.
- **Critérios de aceite:** Registro no README informa URL/fonte consultada, data da revisão, conclusão sobre termos/atribuição/limites e pendências; busca nos arquivos cliente confirma ausência de API key.
- **Dependências:** T-07, T-08.
- **Arquivos prováveis:** `README.md`.
- **Requisitos:** NFR-08; risco de provedor nas premissas/spec e riscos/trade-offs do plano.

### T-42 — Executar gates finais
- **Tipo:** Infra
- **Descrição:** Executar validações de qualidade após a implementação e registrar falhas remanescentes.
- **Critérios de aceite:** Executar `pnpm lint`, `pnpm build`, `pnpm test -- --run` e `pnpm test:e2e`; registrar o código de saída de cada comando; todos terminam em 0 ou cada falha ambiental inclui comando, erro e bloqueio identificado.
- **Dependências:** T-01 a T-41.
- **Arquivos prováveis:** Nenhum; tarefa de validação do repositório.
- **Requisitos:** Gate técnico para os AC-01.1 a AC-05.3 e NFR-01 a NFR-08; sem requisito de produto independente.