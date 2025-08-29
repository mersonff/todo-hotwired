# language: pt
Funcionalidade: Gerenciar Tarefas Completas
  Como usuário do sistema de tarefas
  Eu quero realizar operações completas com tarefas
  Para poder organizar minhas atividades

  Cenário: Criar uma nova tarefa completa
    Dado que eu acesso a página inicial
    Quando eu crio uma tarefa com título "Minha primeira tarefa" e descrição "Descrição detalhada"
    Então eu devo ver "Minha primeira tarefa" na lista de tarefas
    E eu devo ver "1 tarefa" no contador

  Cenário: Marcar tarefa como concluída
    Dado que existe uma tarefa "Estudar Ruby on Rails"
    Quando eu marco a tarefa "Estudar Ruby on Rails" como concluída
    Então a tarefa deve estar marcada como concluída

  Cenário: Marcar tarefa como importante
    Dado que existe uma tarefa "Reunião importante"
    Quando eu marco a tarefa "Reunião importante" como importante
    Então a tarefa deve estar marcada como importante

  Cenário: Editar uma tarefa existente
    Dado que existe uma tarefa "Tarefa antiga"
    Quando eu edito a tarefa "Tarefa antiga" para "Tarefa atualizada"
    Então eu devo ver "Tarefa atualizada" na lista de tarefas
    E eu não devo ver "Tarefa antiga" na lista de tarefas

  Cenário: Excluir uma tarefa
    Dado que existe uma tarefa "Tarefa para excluir"
    Quando eu excluo a tarefa "Tarefa para excluir"
    Então eu devo ver "0 tarefas" no contador
    E eu não devo ver "Tarefa para excluir" na lista de tarefas

  Cenário: Verificar filtros funcionam
    Dado que existem tarefas com diferentes status:
      | título                | concluída | importante |
      | Tarefa pendente       | false     | false      |
      | Tarefa concluída      | true      | false      |
      | Tarefa importante     | false     | true       |
    Então eu devo ver "3 tarefas" no contador

  Cenário: Verificar tarefas são criadas corretamente
    Dado que existem tarefas com diferentes status:
      | título                | concluída | importante |
      | Tarefa concluída      | true      | false      |
      | Outra tarefa concluída| true      | false      |
    Então eu devo ver "2 tarefas" no contador

  Cenário: Verificar tarefas importantes são criadas
    Dado que existem tarefas com diferentes status:
      | título                  | concluída | importante |
      | Tarefa importante       | true      | true       |
      | Outra tarefa importante | false     | true       |
    Então eu devo ver "2 tarefas" no contador
