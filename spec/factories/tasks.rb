FactoryBot.define do
  factory :task do
    title { Faker::Lorem.sentence(word_count: 3) }
    description { Faker::Lorem.paragraph }
    completed { false }
    important { false }
    color { [ 'blue', 'yellow', 'green', 'orange', 'pink' ].sample }

    trait :completed do
      completed { true }
    end

    trait :important do
      important { true }
    end

    trait :with_tags do
      after(:create) do |task|
        create_list(:tag, 2, tasks: [ task ])
      end
    end

    # Named factories
    factory :completed_task, traits: [ :completed ]
    factory :important_task, traits: [ :important ]
    factory :task_with_tags, traits: [ :with_tags ]
  end
end
