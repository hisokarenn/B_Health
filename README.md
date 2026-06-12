`✨ Servidor Ligado`

# <img width="50" height="50" alt="LOGOpng (2)" src="https://github.com/user-attachments/assets/224ce150-7512-4de7-9d5b-a5675c4e3828" /> B Health - Carteira de Vacinação Digital
  Projeto de um aplicativo de carteira de vacinação digital (B Health) funcional. O sistema permite o cadastro de pacientes, autenticação (login), visualização do histórico de vacinas e campanhas de saúde ativas.
<br>
<br>

## 📝 Arquitetura e Tecnologias

### **Frontend (Mobile):**
- [React Native](https://reactnative.dev/) (gerenciado pelo [Expo](https://expo.dev/))
- [Axios](https://axios-http.com/) (para comunicação com a API)

### **Backend (API):**
- [Node.js](https://nodejs.org/en) com [Express.js](https://expressjs.com/pt-br/)
- PostgreSQL](https://www.postgresql.org/)

### **Hospedagem (Nuvem):**
- **API (Backend):** Hospedado no [Render](https://render.com/).
- **Banco de Dados:** Firebase Firestore.
<br>

---
## 🏁 Guia de Instalação e Execução (Desenvolvimento)

Para rodar este projeto localmente (para fins teste do frontend), você só precisa rodar o aplicativo React Native, pois o backend e o banco de dados já estão na nuvem.

### Pré-requisitos

* [Node.js](https://nodejs.org/en/) (v18+ recomendado)
* [Git](https://git-scm.com/)
* **Expo Go** (aplicativo instalado no seu celular Android ou iOS)
<br>


## ⚙️ Configuração do Backend (API)

O backend já está hospedado no Render para uso do aplicativo publicado. Para rodar a API localmente, configure as credenciais do Firebase Admin antes de iniciar o servidor.

1. Navegue até a pasta do backend:
```bash
cd backend
```

2. Crie o arquivo de ambiente local:
```bash
cp .env.example .env
```

3. Forneça a conta de serviço do Firebase Admin por uma das opções abaixo:

- Desenvolvimento local: baixe a chave JSON no console do Firebase e salve como `backend/serviceAccountKey.json`.
- Caminho customizado: defina `FIREBASE_SERVICE_ACCOUNT_PATH` no `.env`.
- Produção: configure `FIREBASE_SERVICE_ACCOUNT_JSON` como variável secreta com o JSON completo da conta de serviço, ou use `GOOGLE_APPLICATION_CREDENTIALS` apontando para um arquivo válido.

O arquivo `serviceAccountKey.json` não deve ser versionado. Se nenhuma credencial for encontrada, a API interrompe a inicialização com uma mensagem de configuração clara.

4. Configure o CORS conforme o ambiente:
```bash
CORS_ALLOWED_ORIGINS=http://localhost:19006,http://localhost:8081,http://localhost:3000
```

Em produção, preencha `CORS_ALLOWED_ORIGINS` apenas com as origens autorizadas. Requisições mobile, scripts e health checks sem cabeçalho `Origin` continuam permitidos; origens externas não listadas recebem `403`.
<br>
<br>

## ✨ Configuração do Frontend (Aplicativo)

Esta é a única parte que é preciso rodar para testar o aplicativo.

1. Clone o repositório (develop)
```bash
git clone --branch develop https://github.com/hisokarenn/B_Health.git
```

2. Navegue até a pasta do frontend
```bash
cd frontend
```

3. Instale as dependências
```bash
npm install
```

4. Crie o arquivo de ambiente do Expo:
```bash
cp .env.example .env
```

5. Preencha as variáveis `EXPO_PUBLIC_FIREBASE_*` com as configurações públicas do app web no Firebase. Essas variáveis substituem o antigo arquivo local `frontend/src/services/firebaseConfig.js` com chaves fixas.

Se as variáveis obrigatórias estiverem ausentes, o aplicativo mostra uma tela de erro de configuração em vez de falhar silenciosamente.

6. Inicie o Metro Bundler (servidor do Expo)
```bash
npm start
```
Escaneie o QR Code que aparece no terminal com o aplicativo Expo Go no seu celular. O aplicativo agora usará a API hospedada no Render.

(Nota: O Render esta no plano gratuito, a primeira inicialização da API pode demorar ~50 segundos para "acordar".)
<br>
<br>

## 👥 Autores
Este projeto foi desenvolvido por:
- Aila Karoline Santana Moreira
- Gustavo de Oliveira Pena
- Karen Vitória Rodrigues Pereira
- Sabrina Martins Bezerra
<br>

## ⚖️ Licença ![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
Este projeto está licenciado sob a Licença MIT.
