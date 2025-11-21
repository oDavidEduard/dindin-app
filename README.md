# 💸 DinDin - Gerenciador Financeiro com IA


O **DinDin** é um aplicativo móvel de controle financeiro inteligente. Diferente de planilhas comuns, ele utiliza **Inteligência Artificial** para prever seus gastos futuros, ajudando você a manter suas contas no azul.

---

## 📱 Screenshots



---

## 🚀 Funcionalidades Principais

* **🔐 Autenticação Segura:** Login e Registro com JWT**
* **📊 Dashboard Dinâmico:** Visualização de saldo, últimas despesas e filtro rápido por categorias.
* **🤖 Predição de Gastos (IA):** Um microsserviço em Python que utiliza **Regressão Linear (Scikit-Learn)** para analisar seu histórico e prever quanto você gastará até o fim do mês em cada categoria.
* **🎯 Metas e Orçamentos:** Defina limites de gastos por categoria e acompanhe barras de progresso em tempo real.
* **💡 Insights:** Dicas financeiras rápidas para ajudar na economia.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando uma seguinte estrutura:

### 📱 Frontend (Mobile)
* **React Native**
* **Expo Router**
* **AsyncStorage**

### 🖥️ Backend Principal (API)
* **Node.js** & **Express**
* **Prisma ORM** (Gerenciamento de Banco de Dados)
* **PostgreSQL** (Banco de Dados Relacional - Hospedado na Neon.tech)
* **JWT** (JSON Web Token para segurança)

### 🧠 Microsserviço de IA
* **Python** & **FastAPI**
* **Scikit-Learn & Pandas** (Modelagem de dados e Regressão Linear)

### ☁️ Infraestrutura & Deploy
* **Render:** Hospedagem dos serviços Node.js e Python.
* **Neon.tech:** Hospedagem do Banco PostgreSQL (Serverless).

---

### ⚙️ Como Rodar Localmente

* **Pré-requisitos**

1. Node.js e npm instalados
2. Python 3 instalado
3. Conta na Neon.tech (ou Postgres local)

---

### 1️⃣ Configurando o Backend

```bash

cd dindin-backend
npm install

# Crie um arquivo .env na pasta dindin-backend com:
# DATABASE_URL="sua_string_conexao_postgres"
# JWT_SECRET="seu_segredo_jwt"
# PYTHON_API_URL="[http://127.0.0.1:8000](http://127.0.0.1:8000)"

# Criar as tabelas e popular dados iniciais
npx prisma migrate dev
npx prisma db seed

# Rodar o servidor
npm run dev

```

---

### 2️⃣ Configurar a IA (Python)

```bash

cd ../dindin-ai

pip install -r requirements.txt

# Rodar o servidor
uvicorn main:app --reload --port 8000

```
---

### 3️⃣ Configurar o Frontend

```bash

cd ../dindin-frontend
npm install

# Crie um arquivo constants/api.js apontando para o seu IP local se for testar no celular físico
# export const API_URL = 'http://SEU_IP_LOCAL:3000';

npx expo start

```

---

###🚀 Deploy
* **API Node** - Implementado no Render
* **API Python** - Implementado no Render
* **Database** - Rodando no Neon.tech

## 🧑‍💻 Autor

David Nunes
