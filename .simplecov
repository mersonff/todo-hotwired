# SimpleCov configuration
SimpleCov.configure do
  # Add filters for files we don't want to include in coverage
  add_filter '/spec/'
  add_filter '/config/'
  add_filter '/vendor/'
  add_filter '/db/'
  add_filter '/bin/'
  add_filter '/script/'
  add_filter '/tmp/'
  add_filter '/log/'
  add_filter '/public/'
  add_filter '/coverage/'

  # Group files by type for better reporting
  add_group 'Models', 'app/models'
  add_group 'Controllers', 'app/controllers'
  add_group 'Helpers', 'app/helpers'
  add_group 'Mailers', 'app/mailers'
  add_group 'Jobs', 'app/jobs'
  add_group 'JavaScript', 'app/javascript'

  # Set minimum coverage thresholds (adjusted for unit tests only)
  minimum_coverage 60  # More realistic for unit tests
  # refuse_coverage_drop  # Commented out for initial setup

  # Enable branch coverage (Ruby 2.5+)
  enable_coverage :branch if Gem::Version.new(RUBY_VERSION) >= Gem::Version.new('2.5')

  # Output formats
  formatter SimpleCov::Formatter::MultiFormatter.new([
    SimpleCov::Formatter::HTMLFormatter
  ])
end
