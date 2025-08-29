require 'capybara/cucumber'

# Configuração do Capybara - rack_test para simplicidade
Capybara.default_driver = :rack_test
Capybara.javascript_driver = :rack_test

# Para E2E completo com JavaScript, descomente as linhas abaixo
# Capybara.register_driver :headless_chrome do |app|
#   options = Selenium::WebDriver::Chrome::Options.new(args: %w[--headless --disable-gpu])
#   Capybara::Selenium::Driver.new(app, browser: :chrome, options: options)
# end
# Capybara.default_driver = :headless_chrome

# Steps para navegação
Dado('que eu acesso a página inicial') do
  visit root_path
end

# Steps para verificar conteúdo da página
Então('eu devo ver o título {string}') do |titulo|
  expect(page).to have_content(titulo)
end

Então('eu devo ver um formulário para criar nova tarefa') do
  expect(page).to have_field('Título da Tarefa')
  expect(page).to have_content('Descrição')
  expect(page).to have_button('Adicionar')
end

Então('eu devo ver {string} na lista de tarefas') do |texto|
  expect(page).to have_content(texto)
end

Então('eu não devo ver {string} na lista de tarefas') do |texto|
  expect(page).not_to have_content(texto)
end

Então('eu devo ver a mensagem {string}') do |mensagem|
  expect(page).to have_content(mensagem)
end

# Steps para interagir com formulários
Quando('eu preencho o campo {string} com {string}') do |campo, valor|
  fill_in campo, with: valor
end

Então('eu devo ver erros de validação') do
  expect(page).to have_content('Opa, rabisco inválido!')
end

Quando('eu clico no botão {string}') do |botao|
  click_button botao
end

# Steps para criar dados de teste
Dado('que existe uma tarefa {string}') do |titulo|
  FactoryBot.create(:task, title: titulo)
end

Dado('que existem as seguintes tarefas:') do |table|
  table.hashes.each do |row|
    attributes = {
      title: row['título'],
      completed: row['concluída'] == 'true',
      important: row['importante'] == 'true'
    }
    FactoryBot.create(:task, attributes)
  end
end

# Steps para ações específicas com tarefas
Quando('eu clico no checkbox da tarefa {string}') do |titulo|
  tarefa = Task.find_by(title: titulo)
  check "task_completed_#{tarefa.id}"
end

Quando('eu clico no botão {string} da tarefa {string}') do |acao, titulo|
  tarefa = Task.find_by(title: titulo)

  case acao
  when 'Marcar como importante'
    within "#task_#{tarefa.id}" do
      click_link 'Importante'
    end
  end
end

Quando('eu clico no link {string} da tarefa {string}') do |acao, titulo|
  tarefa = Task.find_by(title: titulo)

  case acao
  when 'Editar'
    within "#task_#{tarefa.id}" do
      click_link 'Editar'
    end
  when 'Excluir'
    within "#task_#{tarefa.id}" do
      click_link 'Excluir'
    end
  end
end

Quando('eu confirmo a exclusão') do
  # Para links com data-confirm, o Selenium automaticamente aceita o confirm
  # Se necessário, podemos adicionar lógica específica aqui
end

# Steps para verificar estados das tarefas (removidos para evitar conflitos)
# Moved to complete_task_steps.rb

# Steps para filtros
Quando('eu clico no link {string}') do |link_text|
  case link_text
  when 'Pendentes'
    click_link 'Pendentes'
  when 'Concluídas'
    click_link 'Concluídas'
  when 'Importantes'
    click_link 'Importantes'
  else
    click_link link_text
  end
end
