# 💸 DinDin - Gerenciador Financeiro com IA

![Badge Concluído](https://img.shields.io/badge/Status-Concluído-green)
![Badge React Native](https://img.shields.io/badge/Mobile-React%20Native-blue)
![Badge Node](https://img.shields.io/badge/Backend-Node.js-green)
![Badge Python](https://img.shields.io/badge/AI-Python-yellow)

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



## 🧑‍💻 Autor

David Nunes
