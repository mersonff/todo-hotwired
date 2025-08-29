RSpec.configure do |config|
  config.include FactoryBot::Syntax::Methods

  config.before(:suite) do
    FactoryBot.definition_file_paths = [ Rails.root.join('spec', 'factories') ]
    FactoryBot.reload
  end
end
