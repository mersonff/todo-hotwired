FactoryBot.define do
  factory :task_tag do
    association :task
    association :tag
  end
end
