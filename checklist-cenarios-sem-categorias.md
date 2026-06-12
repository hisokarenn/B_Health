# Checklist - Melhorias dos Cenários Sem Categorias

Escopo: checklist derivado somente da seção `1. Cenários Sem Categorias` do arquivo `avaliação-codex.md`.

Requisito obrigatório global: ao desenvolver qualquer seção deste checklist, aplicar e validar todas as premissas de Nielsen, considerando as 10 heurísticas de usabilidade: visibilidade do status do sistema; correspondência entre sistema e mundo real; controle e liberdade do usuário; consistência e padrões; prevenção de erros; reconhecimento em vez de memorização; flexibilidade e eficiência de uso; design estético e minimalista; ajuda para reconhecer, diagnosticar e recuperar erros; ajuda e documentação.

## 1. Cadastro de paciente

- [x] Requisito obrigatório: desenvolver esta seção seguindo todas as premissas de Nielsen.
- [x] Garantir validacao de campos obrigatorios no cadastro: nome, CPF, CNS, e-mail e senha.
- [x] Exibir a mensagem esperada quando houver campo vazio: `Todos os campos são obrigatórios`.
- [x] Bloquear cadastro com e-mail fora do dominio `@gmail.com`.
- [x] Bloquear cadastro com CPF com menos de 11 digitos.
- [x] Bloquear cadastro com CNS com menos de 15 digitos.
- [x] Validar as mesmas regras tambem no backend, nao apenas na tela.
- [x] Bloquear cadastro de dois pacientes com o mesmo CPF.
- [x] Bloquear cadastro de dois pacientes com o mesmo CNS.
- [x] Criar tratamento de compensacao quando o Firebase Auth criar o usuario, mas o `POST /pacientes` falhar.
- [x] Definir se a compensacao sera rollback do usuario no Firebase Auth ou fluxo de reconciliacao posterior.
- [ ] Validar que nao fica usuario orfao no Firebase Auth apos falha no cadastro do paciente. Pendente de teste integrado com Firebase Auth e API em ambiente configurado.

## 2. Login e recuperacao de senha

- [x] Requisito obrigatório: desenvolver esta seção seguindo todas as premissas de Nielsen.
- [x] Exibir erro amigavel ao tentar login com senha incorreta.
- [x] Exibir erro amigavel ao tentar login sem internet.
- [ ] Validar o comportamento do `lembrar-me` ao fechar e reabrir o app. Pendente de teste manual em dispositivo/emulador com SecureStore.
- [x] Garantir que e-mail e senha voltem preenchidos quando `lembrar-me` estiver ativado.
- [x] Tratar recuperacao de senha com e-mail vazio.
- [x] Tratar recuperacao de senha com e-mail invalido.
- [x] Tratar recuperacao de senha com e-mail inexistente.
- [x] Padronizar mensagens de erro de login e recuperacao para nao depender apenas de log no console.

## 3. Autenticacao e autorizacao de rotas

- [x] Requisito obrigatório: desenvolver esta seção seguindo todas as premissas de Nielsen.
- [x] Proteger `GET /pacientes/:id` com autenticacao.
- [x] Impedir que um paciente acesse dados de outro UID em `GET /pacientes/:id`.
- [x] Proteger `GET /historico/:pacienteId` com autenticacao.
- [x] Impedir acesso ao historico vacinal sem usuario autenticado.
- [x] Retornar respostas adequadas para falhas de autenticacao e autorizacao, como `401` ou `403`.
- [x] Garantir que o frontend mostre mensagem amigavel quando o acesso for negado.

## 4. Historico vacinal

- [x] Requisito obrigatório: desenvolver esta seção seguindo todas as premissas de Nielsen.
- [x] Exibir estado vazio quando o paciente nao tiver registros de historico.
- [x] Validar tela de historico com muitos registros de vacina.
- [x] Definir limite, paginacao, ordenacao ou virtualizacao para listas grandes, se necessario.
- [x] Validar exibicao do campo `nome_vacina`.
- [x] Validar exibicao do campo `dose`.
- [x] Validar exibicao do campo `data_aplicacao`.
- [x] Validar exibicao do campo `lote`.
- [x] Validar exibicao do campo `profissional_responsavel`.
- [x] Definir fallback visual para campos ausentes ou incompletos no historico.

## 5. Campanhas

- [x] Requisito obrigatório: desenvolver esta seção seguindo todas as premissas de Nielsen.
- [x] Tratar abertura de campanhas quando a API no Render estiver fria e demorar cerca de 50 segundos.
- [x] Exibir loading adequado durante demora prolongada da API.
- [x] Permitir nova tentativa quando o carregamento de campanhas falhar.
- [x] Exibir estado vazio quando a colecao de campanhas estiver vazia.
- [x] Corrigir tratamento de imagem quebrada em campanha.
- [x] Usar placeholder quando a imagem da campanha estiver ausente, quebrada ou invalida.
- [x] Validar detalhe de campanha sem latitude/longitude.
- [x] Aplicar fallback para Manaus quando latitude/longitude estiverem ausentes.
- [x] Validar campanha com coordenada invalida antes de montar mapa ou WebView.
- [x] Exibir mensagem amigavel quando o mapa ou rota nao puderem ser carregados.

## 6. Notificacoes

- [x] Requisito obrigatório: desenvolver esta seção seguindo todas as premissas de Nielsen.
- [x] Garantir que marcar notificacao como lida persista apos fechar e reabrir o app.
- [x] Validar reabertura do app com notificacoes ja lidas.
- [ ] Testar dois dispositivos abrindo a mesma notificacao. Pendente de teste manual em dois dispositivos/emuladores com Firestore configurado.
- [x] Evitar sobrescrita de estado de leitura em acessos concorrentes.
- [x] Definir armazenamento confiavel para notificacoes lidas quando houver uso em multiplos dispositivos.

## 7. Navegacao e interface

- [ ] Requisito obrigatório: desenvolver esta seção seguindo todas as premissas de Nielsen.
- [ ] Corrigir destaque da barra inferior para o item `Principal`.
- [ ] Validar que o item ativo permanece correto ao navegar entre telas.
- [ ] Garantir que erros de cadastro, login, historico, campanhas e notificacoes aparecam para o usuario, nao apenas no console.

## 8. Configuracao e inicializacao

- [ ] Requisito obrigatório: desenvolver esta seção seguindo todas as premissas de Nielsen.
- [ ] Tratar ausencia de `frontend/src/services/firebaseConfig.js` com erro claro de configuracao.
- [ ] Documentar como criar ou fornecer `firebaseConfig.js` no ambiente local.
- [ ] Tratar ausencia de `backend/serviceAccountKey.json` com erro claro na inicializacao do backend.
- [ ] Documentar como fornecer credenciais do Firebase Admin no ambiente local e em producao.
- [ ] Revisar CORS aberto.
- [ ] Restringir origens permitidas no CORS conforme ambiente.
- [ ] Validar tentativa de acesso ao backend a partir de origem externa nao autorizada.

## 9. Carga, concorrencia e resiliencia

- [ ] Requisito obrigatório: desenvolver esta seção seguindo todas as premissas de Nielsen.
- [ ] Testar muitos acessos simultaneos a `GET /campanhas`.
- [ ] Definir estrategia para reduzir custo e latencia em `GET /campanhas`, como cache, paginacao ou filtros.
- [ ] Simular falha do Firestore durante login.
- [ ] Simular falha do Firestore durante carregamento de perfil.
- [ ] Simular falha do Firestore durante carregamento de historico.
- [ ] Simular falha do Firestore durante carregamento de campanhas.
- [ ] Garantir mensagens amigaveis para falhas do Firestore.
- [ ] Garantir que falhas temporarias nao deixem o app em estado travado.

## 10. Validacao final

- [ ] Requisito obrigatório: desenvolver esta seção seguindo todas as premissas de Nielsen.
- [ ] Criar casos de teste manuais para cada item deste checklist.
- [ ] Automatizar testes de validacao de cadastro, login, rotas protegidas e campanhas quando possivel.
- [ ] Registrar evidencias dos testes com cenario, resultado esperado e resultado obtido.
- [ ] Reexecutar os fluxos principais apos cada correcao: cadastro, login, perfil, historico, campanhas e notificacoes.
- [ ] Confirmar que nenhuma melhoria aplicada depende de sugestoes fora da secao `1. Cenarios Sem Categorias`.
