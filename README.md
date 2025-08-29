# 📋 Todo Rails - Sistema de Gerenciamento de Tarefas

![Rails](https://img.shields.io/badge/Rails-8.0.2-red.svg)
![Ruby](https://img.shields.io/badge/Ruby-3.3.0-red.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue.svg)
![Hotwire](https://img.shields.io/badge/Hotwire-Turbo%20%26%20Stimulus-orange.svg)

Um sistema moderno e interativo de gerenciamento de tarefas construído com **Rails 8**, **Hotwire Turbo**, **Stimulus** e uma interface inspirada no **Trello**. Inclui funcionalidades avançadas como drag & drop, filtros dinâmicos, modal de visualização e um sistema completo de linting para qualidade de código.

## ✨ Principais Funcionalidades

### 🎯 Gerenciamento de Tarefas
- **CRUD Completo**: Criar, visualizar, editar e excluir tarefas
- **Rich Text Editor**: Descrições com formatação usando ActionText + Trix
- **Sistema de Tags**: Organização por categorias personalizáveis
- **Cores Personalizadas**: Post-its coloridos (azul, amarelo, verde, laranja, rosa)
- **Marcação de Importância**: Sistema de estrelas para priorização
- **Status de Conclusão**: Checkbox interativo para marcar tarefas concluídas

### 🎪 Interface Interativa (Estilo Trello)
- **Drag & Drop**: Reordenação de tarefas por arrastar e soltar
- **Modal de Visualização**: Clique em qualquer lugar do card para ver detalhes
- **Animações Fluidas**: Feedback visual em todas as interações
- **Design Responsivo**: Interface adaptável para desktop e mobile

### 🔍 Filtragem e Organização
- **Filtros Dinâmicos**:
  - 📋 Todas as tarefas
  - ⏳ Apenas pendentes
  - ✅ Apenas concluídas
  - ⭐ Apenas importantes

- **Ordenação Flexível**:
  - 🔢 Por posição (drag & drop)
  - 📅 Por data de criação
  - 🔤 Por título (alfabética)
  - ⭐ Por importância

- **Visualização Adaptável**:
  - 🔹 Grade pequena
  - 🔸 Grade média
  - 🔶 Grade grande

### 🚀 Tecnologias Modernas
- **Hotwire Turbo**: Navegação instantânea sem recarregar a página
- **Stimulus Controllers**: JavaScript organizado e reativo
- **SortableJS**: Drag & drop profissional
- **ActionText**: Editor de texto rico integrado
- **CSS Grid/Flexbox**: Layout moderno e responsivo

## 🛠️ Tecnologias Utilizadas

### Backend
- **Ruby** 3.3.0
- **Rails** 8.0.2+
- **PostgreSQL** como banco de dados
- **ActionText** para rich text
- **Puma** como servidor web

### Frontend
- **Hotwire Turbo** para SPA-like experience
- **Stimulus** para JavaScript reativo
- **CSS moderno** com variáveis e animações
- **SortableJS** para drag & drop
- **Trix Editor** para edição de texto

### Qualidade de Código
- **RuboCop** (Ruby linting + performance + minitest)
- **ESLint** (JavaScript linting)
- **Stylelint** (CSS linting)
- **Brakeman** (segurança)
- **Reek** (code smells)
- **Flay** (duplicação de código)
- **Flog** (complexidade)
- **Pre-commit hooks** automatizados

## 🚀 Instalação

### Pré-requisitos
- Ruby 3.3.0+
- Rails 8.0.2+
- PostgreSQL
- Node.js e npm
- Git

### 1. Clone o repositório
```bash
git clone https://github.com/mersonff/todo-hotwired.git
cd todo-rails
```

### 2. Instale as dependências
```bash
# Dependências Ruby
bundle install

# Dependências JavaScript
npm install
```

### 3. Configure o banco de dados
```bash
# Crie e configure o banco
rails db:create
rails db:migrate
rails db:seed
```

### 4. Configure as variáveis de ambiente
```bash
# Copie o arquivo de exemplo (se existir)
cp .env.example .env

# Configure suas credenciais do banco de dados
# Edite o arquivo config/database.yml conforme necessário
```

### 5. Inicie o servidor
```bash
# Inicie todos os serviços
bin/dev

# Ou manualmente:
rails server  # Backend
npm run build:css  # CSS (se necessário)
```

Acesse: `http://localhost:3000`

## 📚 Como Usar

### Criando Tarefas
1. Use o formulário no topo da página
2. Adicione título e descrição (com formatação rich text)
3. Escolha uma cor para o post-it
4. Adicione tags para organização
5. Clique em "Adicionar"

### Organizando Tarefas
- **Arrastar e Soltar**: Reorganize as tarefas arrastando os cards
- **Filtros**: Use os botões de filtro para ver categorias específicas
- **Ordenação**: Ordene por posição, data, título ou importância
- **Visualização**: Ajuste o tamanho dos cards (pequeno/médio/grande)

### Interagindo com Tarefas
- **Clique no card**: Abre modal com detalhes completos
- **Checkbox**: Marca/desmarca como concluída
- **Estrela**: Marca/desmarca como importante
- **Botão editar**: Abre formulário de edição
- **Botão excluir**: Remove a tarefa (com confirmação)

## 🧪 Testes

```bash
# Execute todos os testes
rails test

# Testes do sistema (browser)
rails test:system

# Testes específicos
rails test test/controllers/
rails test test/models/
```

## 🔍 Qualidade de Código

### Executar todos os linters
```bash
rake lint:all
```

### Corrigir automaticamente
```bash
rake lint:fix:all
```

### Análises específicas
```bash
# Ruby (RuboCop)
rake lint:ruby

# JavaScript (ESLint)
rake lint:javascript
npm run lint:js

# CSS (Stylelint)
rake lint:css
npm run lint:css

# Segurança (Brakeman)
rake lint:security

# Qualidade (Reek, Flay, Flog)
rake lint:quality
```

### Scripts npm disponíveis
```bash
npm run lint          # Lint JS + CSS
npm run lint:fix       # Fix JS + CSS
npm run security       # Audit de segurança
npm run quality        # Análise de qualidade
```

## 📁 Estrutura do Projeto

```
├── app/
│   ├── controllers/
│   │   └── tasks_controller.rb      # CRUD de tarefas
│   ├── models/
│   │   ├── task.rb                  # Model principal
│   │   ├── tag.rb                   # Sistema de tags
│   │   └── task_tag.rb              # Relacionamento N:N
│   ├── views/
│   │   └── tasks/                   # Templates das tarefas
│   ├── javascript/
│   │   └── controllers/             # Stimulus controllers
│   │       ├── sortable_list_controller.js    # Drag & drop
│   │       ├── task_filters_controller.js     # Filtros
│   │       ├── task_card_controller.js        # Modal e interações
│   │       └── ...
│   └── assets/
│       └── stylesheets/
│           ├── application.css      # Estilos principais
│           └── rabisco.css          # Design personalizado
├── config/
│   ├── routes.rb                    # Rotas da aplicação
│   └── database.yml                 # Configuração do banco
├── db/
│   └── migrate/                     # Migrações do banco
├── test/                            # Suíte de testes
├── lib/
│   └── tasks/
│       └── lint.rake                # Tasks de linting
├── .rubocop.yml                     # Configuração RuboCop
├── .eslintrc.json                   # Configuração ESLint
├── .stylelintrc.json                # Configuração Stylelint
├── .reek.yml                        # Configuração Reek
├── package.json                     # Dependências npm
└── Gemfile                          # Dependências Ruby
```

## 🚀 Deploy

### Heroku
```bash
# Adicione o buildpack do Node.js
heroku buildpacks:add heroku/nodejs
heroku buildpacks:add heroku/ruby

# Configure as variáveis de ambiente
heroku config:set RAILS_MASTER_KEY=sua_chave_aqui

# Deploy
git push heroku main
heroku run rails db:migrate
```

### Docker (se configurado)
```bash
# Build da imagem
docker build -t todo-rails .

# Execute o container
docker run -p 3000:3000 todo-rails
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Execute os linters (`rake lint:all`)
4. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
5. Push para a branch (`git push origin feature/nova-funcionalidade`)
6. Abra um Pull Request

### Padrões de Código
- Execute `rake lint:all` antes de commitar
- Mantenha cobertura de testes acima de 80%
- Siga as convenções do Rails
- Use Stimulus para JavaScript
- Mantenha o CSS organizado e responsivo

## 📝 Roadmap

- [ ] **Sistema de usuários** (autenticação)
- [ ] **Colaboração** (tarefas compartilhadas)
- [ ] **Notificações** (lembretes e prazos)
- [ ] **Dark mode** (tema escuro)
- [ ] **PWA** (Progressive Web App)
- [ ] **API REST** completa
- [ ] **Busca avançada** (ElasticSearch)
- [ ] **Dashboard** com métricas
- [ ] **Integração** com calendários
- [ ] **Export/Import** (JSON, CSV)

## 🐛 Problemas Conhecidos

- Em desenvolvimento: nenhum problema crítico conhecido
- Para reportar bugs, abra uma [issue](https://github.com/mersonff/todo-hotwired/issues)

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

**Merson FF**
- GitHub: [@mersonff](https://github.com/mersonff)
- Email: contato@mersonff.dev (se disponível)

## 🙏 Agradecimentos

- **Ruby on Rails** team pelo framework incrível
- **Hotwire** team pela revolução no frontend Rails
- **SortableJS** pela biblioteca de drag & drop
- **Trello** pela inspiração de UX/UI
- Comunidade Rails pela constante inovação

---

⭐ **Se este projeto foi útil para você, considere dar uma estrela!**
