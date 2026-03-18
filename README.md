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

O backend já está hospedado no Render. Nenhuma ação é necessária para esta parte.
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

4. Inicie o Metro Bundler (servidor do Expo)
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
