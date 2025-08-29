# frozen_string_literal: true

namespace :lint do
  desc "Run all linters"
  task all: %i[ruby javascript css security quality]

  desc "Run RuboCop for Ruby files"
  task :ruby do
    puts "🔍 Running RuboCop..."
    system("bundle exec rubocop") || exit(1)
  end

  desc "Run ESLint for JavaScript files"
  task :javascript do
    puts "🔍 Running ESLint..."
    system("npm run lint:js") || exit(1)
  end

  desc "Run Stylelint for CSS files"
  task :css do
    puts "🔍 Running Stylelint..."
    system("npm run lint:css") || exit(1)
  end

  desc "Run security analysis with Brakeman"
  task :security do
    puts "🔒 Running Brakeman security analysis..."
    system("bundle exec brakeman -q") || exit(1)
  end

  desc "Run code quality analysis"
  task :quality do
    puts "📊 Running code quality analysis..."
    puts "  - Reek (code smells)..."
    system("bundle exec reek app/")
    puts "  - Flay (structural similarities)..."
    system("bundle exec flay app/")
    puts "  - Flog (complexity)..."
    system("bundle exec flog app/")
  end

  namespace :fix do
    desc "Auto-fix all linting issues where possible"
    task all: %i[ruby javascript css]

    desc "Auto-fix RuboCop issues"
    task :ruby do
      puts "🔧 Auto-fixing RuboCop issues..."
      system("bundle exec rubocop -A")
    end

    desc "Auto-fix ESLint issues"
    task :javascript do
      puts "🔧 Auto-fixing ESLint issues..."
      system("npm run lint:js:fix")
    end

    desc "Auto-fix Stylelint issues"
    task :css do
      puts "🔧 Auto-fixing Stylelint issues..."
      system("npm run lint:css:fix")
    end
  end
end

# Alias for convenience
task lint: "lint:all"
