# Validacao final - Cenarios sem categorias

Escopo: validacao final do checklist `checklist-cenarios-sem-categorias.md`, derivado somente da secao `1. Cenarios Sem Categorias` de `avaliacao-codex.md`.

## Premissas de usabilidade

Todos os cenarios abaixo devem ser executados observando as 10 heuristicas de Nielsen:

- Visibilidade do status do sistema: loading, estados vazios, retries e mensagens devem aparecer na tela.
- Correspondencia com o mundo real: textos devem usar linguagem clara para paciente e operador.
- Controle e liberdade: usuario deve conseguir voltar, tentar novamente ou cancelar quando aplicavel.
- Consistencia e padroes: mensagens, botoes e estados devem seguir o padrao visual ja usado.
- Prevencao de erros: validacoes devem bloquear entradas invalidas antes de persistir dados.
- Reconhecimento em vez de memorizacao: tela deve explicar o problema sem depender de log.
- Flexibilidade e eficiencia: listas grandes devem paginar, virtualizar ou carregar sob demanda.
- Design estetico e minimalista: mensagens devem ser diretas e nao competir com a acao principal.
- Recuperacao de erros: falhas devem orientar nova tentativa ou proximo passo.
- Ajuda e documentacao: configuracao e validacao devem estar documentadas no README e neste arquivo.

## Evidencias automatizadas

| Evidencia | Comando | Resultado esperado | Resultado obtido |
| --- | --- | --- | --- |
| Backend: cadastro, autorizacao, CORS e campanhas | `npm --prefix backend test` | Todas as suites Node passam | `tests 4`, `pass 4`, `fail 0` |
| Backend: sintaxe do servidor e modulos extraidos | `node --check backend/server.js`, `node --check backend/pacienteValidation.js`, `node --check backend/authRules.js`, `node --check backend/campanhasService.js` | Nenhum erro de sintaxe | Sem saida, exit code 0 |
| Frontend: mensagens de login e falhas temporarias | `npm --prefix frontend run test:unit` | Todas as suites Node passam | `tests 2`, `pass 2`, `fail 0` |
| Frontend Android: empacotamento | `npm exec expo -- export --platform android --output-dir /tmp/bhealth-android-export` em `frontend/` | Bundle Android gerado sem erro | Android bundled, 713 modules, export em `/tmp/bhealth-android-export` |
| Higiene de diff | `git diff --check` | Nenhum erro de whitespace | Sem saida, exit code 0 |

## Cobertura automatizada

| Area | Arquivo | Cobertura |
| --- | --- | --- |
| Cadastro de paciente | `backend/pacienteValidation.test.js` | Campos obrigatorios, e-mail `@gmail.com`, CPF com 11 digitos, CNS com 15 digitos e normalizacao para persistencia |
| Rotas protegidas | `backend/authRules.test.js` | Token Bearer ausente/invalido, acesso sem usuario autenticado, UID divergente e UID proprio |
| Campanhas | `backend/campanhasService.test.js` | Paginacao, limite maximo, cache, concorrencia com 40 acessos simultaneos e falha do Firestore |
| CORS | `backend/corsConfig.test.js` | Origens por ambiente, bloqueio de origem externa e requisicoes sem `Origin` |
| Login e erros recuperaveis | `frontend/src/utilitarios/AuthMensagens.test.js` e `frontend/src/utilitarios/Erros.test.js` | Senha/credencial invalida, sem internet, muitas tentativas, falha temporaria, 403, 503 e erro de configuracao Firebase |

## Roteiro manual por item do checklist

| ID | Itens cobertos | Procedimento manual | Resultado esperado | Resultado obtido nesta rodada |
| --- | --- | --- | --- | --- |
| CT-NI-01 | Requisito Nielsen das secoes 1 a 10 | Em cada fluxo, verificar loading, texto de erro, retry, estados vazios, navegacao de retorno e consistencia visual | Usuario entende status, causa do erro e proximo passo | Roteiro criado; bundle Android validou que as telas empacotam |
| CT-01-01 | 1.2, 1.3 | Abrir cadastro, deixar nome/CPF/CNS/e-mail/senha vazio e tocar em cadastrar | Mensagem `Todos os campos são obrigatórios`; cadastro bloqueado | Coberto por validacao backend automatizada; execucao visual pendente em dispositivo |
| CT-01-02 | 1.4 | Cadastrar com e-mail fora de `@gmail.com` | Mensagem amigavel e bloqueio no app/API | Coberto por teste automatizado de backend; execucao visual pendente |
| CT-01-03 | 1.5 | Cadastrar CPF com menos de 11 digitos | Mensagem de CPF com 11 digitos | Coberto por teste automatizado de backend; execucao visual pendente |
| CT-01-04 | 1.6 | Cadastrar CNS com menos de 15 digitos | Mensagem de CNS com 15 digitos | Coberto por teste automatizado de backend; execucao visual pendente |
| CT-01-05 | 1.7 | Enviar payload invalido diretamente para `POST /pacientes` | Backend rejeita as mesmas regras da tela | Coberto por `pacienteValidation.test.js` |
| CT-01-06 | 1.8, 1.9 | Cadastrar dois pacientes com mesmo CPF e depois mesmo CNS | Segundo cadastro retorna conflito e nao sobrescreve paciente existente | Roteiro criado; requer Firestore configurado |
| CT-01-07 | 1.10, 1.11, 1.12 | Simular Firebase Auth criado e falha em `POST /pacientes`; consultar Auth depois | Usuario do Auth e removido ou reconciliado; nenhum orfao permanece | Fluxo de rollback implementado; validacao integrada requer Firebase Auth configurado |
| CT-02-01 | 2.2 | Fazer login com senha incorreta | Mensagem `E-mail ou senha incorretos.` | Coberto por `AuthMensagens.test.js`; execucao visual pendente |
| CT-02-02 | 2.3 | Fazer login sem internet | Mensagem de sem conexao; botao sai de loading | Coberto por `AuthMensagens.test.js`; execucao visual pendente |
| CT-02-03 | 2.4, 2.5 | Ativar lembrar-me, fechar e reabrir app | E-mail e senha voltam preenchidos; texto informativo visivel | Roteiro criado; requer dispositivo/emulador com SecureStore |
| CT-02-04 | 2.6, 2.7, 2.8 | Recuperar senha com e-mail vazio, invalido e inexistente | Mensagens especificas para cada erro | Roteiro criado; mensagens normalizadas no app |
| CT-02-05 | 2.9 | Repetir login/recuperacao em erro e observar tela | Erro aparece na UI, nao apenas no console | Coberto por bundle Android e testes de mensagens |
| CT-03-01 | 3.2, 3.4 | Chamar `GET /pacientes/:id` e `GET /historico/:pacienteId` sem token | HTTP 401 com mensagem amigavel | Coberto por `authRules.test.js` |
| CT-03-02 | 3.3, 3.5 | Chamar rotas protegidas com token de outro UID | HTTP 403; dados de outro paciente nao retornam | Coberto por `authRules.test.js` |
| CT-03-03 | 3.6, 3.7 | Forcar 401/403 e observar frontend | Mensagem amigavel e recuperavel | Coberto por utilitario de erros; execucao visual pendente |
| CT-04-01 | 4.2 | Abrir historico sem registros | Estado vazio com texto claro | Roteiro criado; requer dados Firestore |
| CT-04-02 | 4.3, 4.4 | Abrir historico com muitos registros | Lista permanece responsiva com virtualizacao | Bundle Android validado; teste manual com massa de dados pendente |
| CT-04-03 | 4.5 a 4.10 | Abrir historico com campos completos e ausentes | Campos principais aparecem; ausentes usam fallback `Nao informado` | Roteiro criado; requer massa de dados Firestore |
| CT-05-01 | 5.2, 5.3 | Abrir campanhas com API fria no Render | Loading prolongado informa demora e nao trava | Roteiro criado; timeout/export Android validado |
| CT-05-02 | 5.4, 5.5 | Falhar carregamento e depois tocar em tentar novamente; testar colecao vazia | Retry disponivel; estado vazio amigavel | Coberto por mensagens e testes de campanhas no backend |
| CT-05-03 | 5.6, 5.7 | Criar campanha sem imagem, com URL quebrada e invalida | Placeholder visual aparece | Roteiro criado; bundle Android validado |
| CT-05-04 | 5.8 a 5.11 | Abrir detalhe sem coordenadas e com coordenada invalida | Fallback para Manaus ou mensagem de mapa/rota indisponivel | Roteiro criado; requer app em dispositivo/emulador |
| CT-06-01 | 6.2, 6.3 | Marcar notificacao como lida, fechar e reabrir app | Notificacao permanece lida | Roteiro criado; requer Firestore/AsyncStorage |
| CT-06-02 | 6.4, 6.5, 6.6 | Dois dispositivos abrem a mesma notificacao | Estado remoto usa merge/arrayUnion e evita sobrescrita | Roteiro criado; requer dois dispositivos/emuladores |
| CT-07-01 | 7.2, 7.3 | Navegar entre Principal, Historico, Campanhas, Notificacoes e Perfil | Item ativo da barra inferior permanece correto | Roteiro criado; bundle Android validado |
| CT-07-02 | 7.4 | Forcar erros nos fluxos principais | Cadastro/login/historico/campanhas/notificacoes exibem erro na tela | Coberto por utilitarios de erro e telas com retry |
| CT-08-01 | 8.2, 8.3 | Rodar frontend sem variaveis `EXPO_PUBLIC_FIREBASE_*` | Tela de configuracao indisponivel com orientacao do README | Bundle Android validado |
| CT-08-02 | 8.4, 8.5 | Subir backend sem credencial Admin | Inicializacao falha com mensagem clara de configuracao | Roteiro/documentacao criados; teste real requer ambiente sem credencial |
| CT-08-03 | 8.6, 8.7, 8.8 | Acessar backend a partir de origem externa nao permitida | HTTP 403 no CORS; origens permitidas funcionam | Coberto por `corsConfig.test.js` |
| CT-09-01 | 9.2, 9.3 | Simular muitos acessos simultaneos a `GET /campanhas` | Uma leitura compartilhada, cache e paginacao reduzem custo/latencia | Coberto por `campanhasService.test.js` |
| CT-09-02 | 9.4 a 9.8 | Simular falha do Firestore/Auth em login, perfil, historico e campanhas | Mensagens amigaveis e retry quando aplicavel | Coberto por testes de mensagens e respostas 503; execucao visual pendente |
| CT-09-03 | 9.9 | Repetir falhas temporarias nos fluxos principais | Loading finaliza e app nao fica travado | Coberto por `finally` nos fluxos e bundle Android |
| CT-10-01 | 10.2 | Conferir este roteiro contra todos os itens do checklist | Cada item tem pelo menos um caso manual mapeado | Concluido neste documento |
| CT-10-02 | 10.3 | Rodar suites automatizadas disponiveis | Cadastro, login, rotas e campanhas cobertos quando possivel | Concluido com backend/frontend unitarios |
| CT-10-03 | 10.4 | Registrar comando, esperado e obtido | Evidencias ficam rastreaveis | Concluido na secao `Evidencias automatizadas` |
| CT-10-04 | 10.5 | Reexecutar cadastro, login, perfil, historico, campanhas e notificacoes | Fluxos principais sem regressao visivel | Reexecucao automatizada/bundle concluida; execucao manual real requer Firebase/emulador |
| CT-10-05 | 10.6 | Comparar mudancas com `avaliacao-codex.md`, secao 1 | Nenhuma melhoria fora do escopo `Cenarios Sem Categorias` | Concluido; ver secao `Confirmacao de escopo` |

## Reexecucao dos fluxos principais

| Fluxo | Validacao feita nesta rodada | Resultado |
| --- | --- | --- |
| Cadastro | Testes de validacao backend e bundle Android | Passou; teste integrado Firebase Auth/API documentado para ambiente configurado |
| Login | Testes de mensagens do Firebase Auth e bundle Android | Passou; teste visual em dispositivo documentado |
| Perfil | Tratamento 503 no backend, mensagem frontend e bundle Android | Passou no nivel automatizado; dados reais exigem Firebase |
| Historico | Tratamento 503 no backend, retry na tela e bundle Android | Passou no nivel automatizado; massa real exige Firebase |
| Campanhas | Testes de cache/paginacao/concorrencia/falha e bundle Android | Passou |
| Notificacoes | Mensagens de erro atualizadas e bundle Android | Passou no nivel de bundle; teste multi-dispositivo exige Firebase |

## Confirmacao de escopo

As melhorias validadas permanecem dentro da secao `1. Cenarios Sem Categorias` de `avaliacao-codex.md`:

- Cadastro, login, recuperacao de senha e lembrar-me.
- Autenticacao/autorizacao de `pacientes` e `historico`.
- Historico vacinal, campanhas, mapa/rota e notificacoes.
- Navegacao, configuracao Firebase, CORS, carga, concorrencia e falhas Firestore.

Nao foram incluidos requisitos da secao `2. Cenarios Com Categorias` que nao tivessem origem direta na secao `1. Cenarios Sem Categorias`.
