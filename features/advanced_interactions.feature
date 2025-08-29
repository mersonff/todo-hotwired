# language: pt
Funcionalidade: Filtros e Interações Avançadas
  Como usuário do sistema de tarefas
  Eu quero filtrar e interagir com tarefas de forma avançada
  Para ter melhor controle sobre minhas atividades

  Cenário: Validar formulário vazio
    Dado que eu acesso a página inicial
    Quando eu clico no botão "Adicionar"
    Então eu devo ver erros de validação
    E eu devo ver a mensagem "Descrição não pode ficar em branco"

  Cenário: Contador de tarefas é atualizado
    Dado que eu acesso a página inicial
    Então eu devo ver "0 tarefas" no contador
    Quando eu crio uma tarefa com título "Nova tarefa" e descrição "Descrição"
    Então eu devo ver "1 tarefa" no contador

  Cenário: Múltiplas tarefas são exibidas
    Dado que existem tarefas com diferentes status:
      | título       | concluída | importante |
      | Tarefa 1     | false     | false      |
      | Tarefa 2     | true      | false      |
      | Tarefa 3     | false     | true       |
      | Tarefa 4     | true      | true       |
    Então eu devo ver "4 tarefas" no contador
    E eu devo ver "Tarefa 1" na lista de tarefas
    E eu devo ver "Tarefa 2" na lista de tarefas
    E eu devo ver "Tarefa 3" na lista de tarefas
    E eu devo ver "Tarefa 4" na lista de tarefas

  Cenário: Estado das tarefas é persistido
    Dado que existe uma tarefa "Teste persistência"
    Quando eu marco a tarefa "Teste persistência" como concluída
    E eu marco a tarefa "Teste persistência" como importante
    Então a tarefa deve estar marcada como concluída
    E a tarefa deve estar marcada como importante

  Cenário: Edição preserva outros campos
    Dado que existem tarefas com diferentes status:
      | título          | concluída | importante |
      | Tarefa original | true      | true       |
    Quando eu edito a tarefa "Tarefa original" para "Tarefa editada"
    Então eu devo ver "Tarefa editada" na lista de tarefas
    E eu não devo ver "Tarefa original" na lista de tarefas
