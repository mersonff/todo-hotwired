require 'rails_helper'

RSpec.describe Tag, type: :model do
  describe 'associations' do
    it { should have_many(:task_tags) }
    it { should have_many(:tasks).through(:task_tags) }
  end

  describe 'validations' do
    subject { build(:tag) }

    # Adiciona validação de uniqueness se necessário
    # it { should validate_uniqueness_of(:name) }
  end

  describe 'factory' do
    it 'creates a valid tag' do
      tag = build(:tag)
      expect(tag).to be_valid
    end

    it 'creates a tag with tasks' do
      tag = create(:tag_with_tasks)
      expect(tag.tasks.count).to eq(2)
    end
  end

  describe 'association behavior' do
    let(:tag) { create(:tag) }
    let(:task1) { create(:task) }
    let(:task2) { create(:task) }

    it 'can be associated with multiple tasks' do
      tag.tasks << [ task1, task2 ]

      expect(tag.tasks.count).to eq(2)
      expect(tag.tasks).to include(task1, task2)
    end

    it 'allows tasks to be removed' do
      tag.tasks << [ task1, task2 ]
      tag.tasks.delete(task1)

      expect(tag.tasks.count).to eq(1)
      expect(tag.tasks).to include(task2)
      expect(tag.tasks).not_to include(task1)
    end
  end
end
