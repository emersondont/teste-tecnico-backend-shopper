# Teste Técnico – Desenvolvimento Web - Shopper
## Etapa 1 – Back-end

Este projeto foi desenvolvido como parte do processo seletivo para a [Shopper](Shopper.com.br) . O objetivo é criar o back-end de um serviço de leitura de imagens, incluindo três endpoints e uma integração com a API do Google Gemini.

### Tecnologias Utilizadas
- Docker
- NodeJs
- TypeScript
- Espress
- Express Validator
- Prisma
- Jest

### Passos para Configuração e Execução
#### 1. Clone o Repositório
```bash
git clone git@github.com:emersondont/teste-tecnico-backend-shopper.git
```

#### 2. Docker
Tenha instalado em sua máquina as seguintes ferramentas:
- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/install/)

#### 3. Variáveis de Ambiente
Antes de executar a aplicação, certifique-se de que o arquivo .env esteja presente na raiz do repositório. Este arquivo deve conter a seguinte variável de ambiente:
```
GEMINI_API_KEY=<chave da API>
```

#### 4. Executando o Projeto
Construa a imagem Docker e inicie os serviços usando docker-compose.
```bash
docker compose up --build -d
```

Agora, seu projeto deve estar rodando no localhost na porta 3000

#### 5. Parando a execução do container
Rode o docker compose down para parar a execução do container.
```bash
docker compose down
```

