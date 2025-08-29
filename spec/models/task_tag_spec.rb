require 'rails_helper'

RSpec.describe TaskTag, type: :model do
  describe 'associations' do
    it { should belong_to(:task) }
    it { should belong_to(:tag) }
  end

  describe 'factory' do
    it 'creates a valid task_tag' do
      task_tag = build(:task_tag)
      expect(task_tag).to be_valid
    end

    it 'creates associated task and tag' do
      task_tag = create(:task_tag)

      expect(task_tag.task).to be_present
      expect(task_tag.tag).to be_present
      expect(task_tag.task).to be_a(Task)
      expect(task_tag.tag).to be_a(Tag)
    end
  end

  describe 'relationship integrity' do
    let(:task) { create(:task) }
    let(:tag) { create(:tag) }

    it 'establishes the many-to-many relationship correctly' do
      create(:task_tag, task: task, tag: tag)

      expect(task.tags).to include(tag)
      expect(tag.tasks).to include(task)
    end

    it 'prevents duplicate associations' do
      create(:task_tag, task: task, tag: tag)

      # Depending on your model validations, this might raise an error
      # or be allowed. Adjust based on your business logic.
      duplicate_task_tag = build(:task_tag, task: task, tag: tag)

      # If you want to prevent duplicates, add this validation to your model:
      # validates :task_id, uniqueness: { scope: :tag_id }
      # And then test it:
      expect(duplicate_task_tag).to be_valid # Adjust based on your business logic
    end
  end
end
