• Analisei o origin/develop atualizado no commit d602dfd4454ca7e6f306f06bc86d47df1bcc4b32. Observação importante: o backend não está separado em controllers/services/models; as rotas e regras estão concentradas em backend/server.js. Os “modelos” reais são inferidos pelas coleções Firestore: pacientes, historico e campanhas.

  Fontes principais no repositório: backend/server.js, backend/firebase.js, frontend/src/services/authService.js, telas de Cadastro, Login, Historico, Campanhas, CampanhaDetalhe, Notificacoes, Perfil e App.js.

  Casos de Uso Identificados

  Cadastro de paciente via Firebase Auth + API /pacientes; login e recuperação de senha via Firebase Auth; armazenamento de credenciais com SecureStore; consulta de perfil por /pacientes/:id; consulta de histórico vacinal por /historico/:pacienteId; listagem e detalhe de campanhas por /campanhas e /campanhas/:id; notificações de novas campanhas por leitura direta da coleção Firestore
  campanhas; navegação entre início, menu, carteira, campanhas, notificações e perfil.

  1. Cenários Sem Categorias

  Tentar cadastrar paciente sem nome, CPF, CNS, e-mail ou senha e validar se a tela exibe “Todos os campos são obrigatórios”. 
  Cadastrar com e-mail que não termina em @gmail.com. Cadastrar CPF com menos de 11 dígitos. 
  Cadastrar CNS com menos de 15 dígitos. Cadastrar dois pacientes com o mesmo CPF. 
  Cadastrar dois pacientes com o mesmo CNS, já que o backend só consulta CPF duplicado. 
  Simular criação bem-sucedida no Firebase Auth e falha no POST /pacientes, verificando se fica usuário órfão no Firebase. 
  Fazer login com senha incorreta. 
  Fazer login sem internet. Usar “lembrar-me” e validar se e-mail e senha voltam preenchidos. 
  Testar recuperação de senha com e-mail vazio, e-mail inválido e e-mail inexistente. 
  Acessar /pacientes/:id com UID de outro paciente. Acessar /
  historico/:pacienteId sem estar autenticado. 
  Consultar histórico sem registros e validar mensagem vazia. 
  Consultar histórico com muitos registros de vacina. 
  Validar campos nome_vacina, dose, data_aplicacao, lote e profissional_responsavel. 
  Abrir campanhas quando a API está fria no Render e demora cerca de 50 segundos. 
  Abrir campanhas com coleção Firestore vazia. Validar imagem quebrada em campanha. 
  Abrir detalhe de campanha sem latitude/longitude e verificar fallback para Manaus. Inserir campanha com coordenada inválida e testar WebView/Google Maps. 
  Marcar notificação como lida e reabrir o app. 
  Testar concorrência com dois dispositivos abrindo a mesma notificação. Validar se a barra inferior destaca corretamente o item “Principal”. Testar app sem firebaseConfig.js. 
  Subir backend sem serviceAccountKey.json. Testar CORS aberto a partir de origem externa. 
  Testar carga com muitos acessos simultâneos a /campanhas. 
  Testar falha do Firestore durante login, perfil, histórico e campanhas. 
  Validar se o app mostra erro amigável ou apenas log no console.

  2. Cenários Com Categorias

  Funcional

  Validar o cadastro completo do paciente: CadastroScreen.handleCadastro exige campos obrigatórios, e-mail Gmail, CPF com 11 dígitos e CNS com 15 dígitos; em seguida authService.cadastrarPaciente cria usuário no Firebase Auth e chama POST /pacientes. No backend, a rota /pacientes (https://github.com/hisokarenn/B_Health/blob/d602dfd4454ca7e6f306f06bc86d47df1bcc4b32/backend/server.js#L17) gra
  va na coleção pacientes usando doc(uid) e bloqueia CPF duplicado com where('cpf', '==', cpf).

  Testar inconsistência transacional: se createUserWithEmailAndPassword funcionar, mas o axios.post('/pacientes') falhar, o paciente fica criado no Firebase Auth sem documento correspondente na coleção pacientes. Esse fluxo está em authService.js (https://github.com/hisokarenn/B_Health/blob/d602dfd4454ca7e6f306f06bc86d47df1bcc4b32/frontend/src/services/authService.js#L32).

  Validar consulta de perfil por GET /pacientes/:id (https://github.com/hisokarenn/B_Health/blob/d602dfd4454ca7e6f306f06bc86d47df1bcc4b32/backend/server.js#L48), incluindo paciente existente, inexistente e documento sem cpf ou cns. A tela PerfilScreen exibe CPF/CNS e ainda mostra “Status da Conta: Ativa / Verificada” de forma fixa.

  Validar carteira vacinal por GET /historico/:pacienteId (https://github.com/hisokarenn/B_Health/blob/d602dfd4454ca7e6f306f06bc86d47df1bcc4b32/backend/server.js#L70), que consulta a coleção historico por pacienteId. A tela espera campos como nome_vacina, dose, data_aplicacao, nome_unidade, profissional_responsavel e lote.

  Validar listagem de campanhas por GET /campanhas (https://github.com/hisokarenn/B_Health/blob/d602dfd4454ca7e6f306f06bc86d47df1bcc4b32/backend/server.js#L98). Há um defeito funcional rastreável: quando não existem campanhas, o backend retorna camapnhas: [] com erro de digitação, enquanto o frontend espera response.data.campanhas.

  Validar detalhe de campanha por GET /campanhas/:id (https://github.com/hisokarenn/B_Health/blob/d602dfd4454ca7e6f306f06bc86d47df1bcc4b32/backend/server.js#L110) e pela tela CampanhaDetalheScreen, que renderiza horário, período, público-alvo, endereço, mapa e botão “Traçar Rota no GPS”.

  Segurança

  Testar acesso indevido direto às rotas /pacientes/:id e /historico/:pacienteId: o backend não valida token Firebase, não tem middleware de autenticação/autorização e aceita qualquer id ou pacienteId recebido na URL.

  Testar exposição de dados pessoais: a coleção pacientes contém nome, cpf, cns e email; a rota /pacientes/:id retorna esses dados sem verificar se o solicitante é o dono do UID.

  Testar CORS aberto: o backend usa app.use(cors()) (https://github.com/hisokarenn/B_Health/blob/d602dfd4454ca7e6f306f06bc86d47df1bcc4b32/backend/server.js#L10) sem restrição de origem.

  Testar armazenamento de credenciais: Seguranca.js salva login_email e login_senha no expo-secure-store. Mesmo sendo armazenamento seguro do dispositivo, o cenário deve avaliar risco de guardar senha reutilizável em vez de token/sessão revogável.

  Testar injeção/entrada maliciosa em campanhas: CampanhaDetalheScreen monta HTML para WebView com maps.google.com/maps?q=${lat},${lng}. Campanhas com latitude/longitude inválidas ou manipuladas devem ser testadas contra quebra da WebView e abertura indevida de URLs.

  Testar acesso direto ao Firestore pelo frontend: App.js, MenuScreen e NotificacoesScreen importam db de firebaseConfig e leem collection(db, "campanhas"), desviando da API Express. A segurança depende fortemente das regras Firestore.

  Usabilidade

  Validar mensagens de erro no cadastro: campos obrigatórios, CPF inválido, CNS inválido, senha fraca e e-mail já usado. A tela usa Alert.alert, então o teste deve confirmar clareza e consistência das mensagens.

  Validar login com campos vazios e credenciais inválidas. LoginScreen mostra “E-mail e senha são obrigatórios” e authService.realizarLogin normaliza erros do Firebase para “E-mail ou senha incorretos”.

  Validar estados de loading: botão de login/cadastro fica desativado com ActivityIndicator; histórico e campanhas exibem “Buscando histórico...” ou “Buscando informações...”.

  Validar navegação: App.js troca telas por currentScreen e só exibe BottomNav quando pacienteInfo existe. Testar tentativa de abrir histórico sem paciente autenticado, que retorna “Erro: Usuário não autenticado.”

  Validar defeito visual na barra inferior: BottomNav compara active === "home", mas a tela real é "menu", então o item “Principal” pode nunca ficar ativo. Também há string inválida no backgroundColor: " 'rgba(15, 34, 86, 0.97)".

  Performance / Desempenho

  Medir tempo de resposta de /campanhas, que faz db.collection('campanhas').get() sem paginação, filtro ou ordenação. Com muitas campanhas, a rota tende a crescer linearmente.

  Medir /historico/:pacienteId, que faz where('pacienteId', '==', pacienteId) na coleção historico. O teste deve verificar tempo com muitos registros por paciente e muitos registros globais.

  Medir impacto de chamadas repetidas a collection(db, "campanhas"): App.js chama checarNotificacoes em mudanças de tela, MenuScreen também consulta campanhas, e NotificacoesScreen consulta novamente para listar não lidas.

  Medir primeira abertura da API hospedada no Render. O README informa que no plano gratuito a primeira inicialização pode demorar cerca de 50 segundos.

  Carga e Concorrência

  Executar dois cadastros simultâneos com o mesmo CPF. O backend faz consulta de CPF e depois grava o documento, mas não usa transação Firestore; há risco de corrida entre where('cpf') e doc(uid).set().

  Executar múltiplas leituras simultâneas de /campanhas e notificações. Como a listagem busca a coleção inteira, carga alta pode consumir quota Firestore e degradar tempo de resposta.

  Testar dois dispositivos do mesmo usuário abrindo notificações ao mesmo tempo. NotificacoesScreen lê @notificacoes_lidas, adiciona ID e grava de volta no AsyncStorage; atualizações concorrentes podem sobrescrever leituras anteriores.

  Testar muitos acessos simultâneos ao histórico do mesmo paciente e de pacientes diferentes para observar latência, limites do Firestore e comportamento da UI com refresh.

  Configuração

  Validar ausência de frontend/src/services/firebaseConfig.js: os arquivos authService.js, App.js, MenuScreen e NotificacoesScreen importam esse módulo, mas ele não aparece na árvore do branch develop. Sem ele, o frontend não compila.

  Validar ausência ou erro em backend/serviceAccountKey.json: backend/firebase.js faz require("./serviceAccountKey.json"). Sem esse arquivo no ambiente, a API falha na inicialização.

  Validar .env: backend/config.js tenta carregar .env e registra erro grave se não conseguir. Testar ambiente local, Render e variáveis ausentes.

  Validar URL fixa da API: authService.js usa https://b-health-app-api.onrender.com. Testar ambientes dev/homologação/produção, pois não há configuração por variável no frontend.

  Validar dependências: backend usa Express 5, Firebase Admin, dotenv, cors e multer, mas o script test apenas retorna erro. Isso limita automação de QA.

  Recuperação

  Simular Firestore fora do ar durante POST /pacientes, /pacientes/:id, /historico/:pacienteId e /campanhas. O backend retorna 500 genérico; o teste deve verificar se o frontend mostra mensagem útil e se não perde estado.

  Simular falha depois de criar usuário no Firebase Auth e antes de gravar em pacientes. O produto precisa de recuperação ou reconciliação, pois hoje não há rollback.

  Simular falha ao carregar campanhas: CampanhasScreen mostra “Não foi possível carregar as campanhas. Verifique sua conexão.” Validar se o usuário consegue tentar novamente sem reiniciar o app.

  Simular imagem de campanha indisponível. CampanhasScreen usa placeholder quando imagem_url falta; o teste deve cobrir URL quebrada, URL lenta e imagem inválida.

  Simular erro ao abrir GPS/Maps. CampanhaDetalheScreen chama Linking.openURL(url) sem tratamento de falha; validar comportamento quando não há app de mapas ou permissão.

  Contingência

  Validar plano operacional quando a carteira vacinal não carrega: HistoricoScreen exibe aviso “Mantenha sua carteira sempre atualizada” e orienta visitar UBS. O cenário deve verificar se essa mensagem aparece quando o histórico vem vazio ou a API falha.

  Validar contingência para indisponibilidade da API Render: como o frontend depende da API para perfil, histórico e campanhas, testar se ainda é possível acessar informações estáticas de ajuda, “Fale conosco” e “Importância da Vacina” no MenuScreen.

  Validar uso de canais alternativos: o modal “Fale Conosco” traz telefone, e-mail e endereço. Em falhas persistentes de backend, esse conteúdo funciona como fallback operacional mínimo.

  Validar contingência para campanhas: se /campanhas falhar, mas o Firestore direto ainda estiver acessível, notificações podem continuar vindo por collection(db, "campanhas"); isso deve ser testado porque cria dois caminhos operacionais diferentes para o mesmo domínio.

  Validar contingência de recuperação de senha: solicitarRecuperacaoSenha usa sendPasswordResetEmail do Firebase. Testar se o usuário consegue recuperar acesso sem suporte manual quando esquece a senha.