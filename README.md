# Lava Jato do Rafa 🚗💦

Este é o aplicativo **Lava Jato do Rafa**, desenvolvido com **Ionic + Angular**. O aplicativo permite gerenciar serviços de um lava jato, incluindo cadastro de serviços, agenda e histórico.

## 🚀 Tecnologias Utilizadas
- **Ionic Framework** (Frontend)
- **Angular** (Estrutura do projeto)
- **Capacitor** (Integração nativa e banco de dados local)
- **PHP** (Backend)
- **MySQL** (Banco de dados)

## 📁 Estrutura do Projeto
### Frontend (Ionic + Angular)
- **src/app/pages**: Contém as páginas principais (Login, Cadastro, Agenda, Histórico).
- **src/app/services**: Serviços para conectar ao backend e banco de dados local.

### Backend (PHP)
- **api/db.php**: Conexão com o banco de dados MySQL.
- **api/servicos**: Endpoints para CRUD de serviços.

## 🛠️ Funcionalidades
- **Cadastro de Serviços**: Permite adicionar novos serviços com nome, descrição, preço e data.
- **Listagem de Serviços**: Mostra os serviços cadastrados.
- **Gerenciamento Local ou em Servidor**: Suporte a banco de dados local com SQLite ou remoto com MySQL via PHP.

## 📦 Como Rodar o Projeto

### Frontend (Ionic)
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/lavajatodorafa.git
   cd lavajatodorafa
