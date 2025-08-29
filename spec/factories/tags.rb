FactoryBot.define do
  factory :tag do
    name { Faker::Hobby.activity }

    trait :with_tasks do
      after(:create) do |tag|
        create_list(:task, 2, tags: [ tag ])
      end
    end

    # Named factory
    factory :tag_with_tasks, traits: [ :with_tasks ]
  end
end
