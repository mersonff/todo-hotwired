require 'rails_helper'

RSpec.describe Task, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:description) }
  end

  describe 'associations' do
    it { should have_many(:task_tags).dependent(:destroy) }
    it { should have_many(:tags).through(:task_tags) }
    it { should have_rich_text(:description) }
  end

  describe 'scopes' do
    describe '.ordered' do
      let!(:task1) { create(:task, position: 2, created_at: 1.day.ago) }
      let!(:task2) { create(:task, position: 1, created_at: Time.current) }
      let!(:task3) { create(:task, position: 1, created_at: 2.days.ago) }

      it 'orders by position first, then by created_at' do
        expect(Task.ordered).to eq([ task3, task2, task1 ])
      end
    end
  end

  describe 'callbacks' do
    describe 'before_create :set_default_position' do
      context 'when no tasks exist' do
        it 'sets position to 0' do
          task = create(:task)
          expect(task.position).to eq(0)
        end
      end

      context 'when tasks already exist' do
        let!(:existing_task) { create(:task, position: 5) }

        it 'sets position to the next available position' do
          task = create(:task)
          expect(task.position).to eq(6)
        end
      end
    end
  end

  describe '#tag_list=' do
    let(:task) { create(:task) }

    it 'creates tags from comma-separated string' do
      task.tag_list = 'work, personal, urgent'
      task.save!

      expect(task.tags.count).to eq(3)
      expect(task.tags.pluck(:name)).to match_array([ 'work', 'personal', 'urgent' ])
    end

    it 'reuses existing tags' do
      existing_tag = create(:tag, name: 'work')
      task.tag_list = 'work, personal'
      task.save!

      expect(Tag.where(name: 'work').count).to eq(1)
      expect(task.tags).to include(existing_tag)
    end

    it 'handles empty string' do
      task.tag_list = ''
      task.save!

      expect(task.tags.count).to eq(0)
    end
  end

  describe '#tag_list' do
    let(:task) { create(:task) }

    it 'returns comma-separated tag names' do
      tag1 = create(:tag, name: 'work')
      tag2 = create(:tag, name: 'personal')
      task.tags = [ tag1, tag2 ]

      expect(task.tag_list).to eq('work, personal')
    end

    it 'returns empty string when no tags' do
      expect(task.tag_list).to eq('')
    end
  end

  describe '#post_it_color' do
    it 'returns color class with default blue when color is nil' do
      task = create(:task, color: nil)
      expect(task.post_it_color).to eq('post-it-color--blue')
    end

    it 'returns color class with specified color' do
      task = create(:task, color: 'yellow')
      expect(task.post_it_color).to eq('post-it-color--yellow')
    end

    it 'returns color class with default blue when color is empty' do
      task = create(:task, color: '')
      expect(task.post_it_color).to eq('post-it-color--blue')
    end
  end

  describe '#update_position!' do
    let!(:task1) { create(:task, position: 0) }
    let!(:task2) { create(:task, position: 1) }
    let!(:task3) { create(:task, position: 2) }
    let!(:task4) { create(:task, position: 3) }

    context 'moving task to a higher position' do
      it 'updates positions correctly' do
        task1.update_position!(2)

        task1.reload
        task2.reload
        task3.reload
        task4.reload

        expect(task1.position).to eq(2)
        expect(task2.position).to eq(0)
        expect(task3.position).to eq(1)
        expect(task4.position).to eq(3)
      end
    end

    context 'moving task to a lower position' do
      it 'updates positions correctly' do
        task3.update_position!(0)

        task1.reload
        task2.reload
        task3.reload
        task4.reload

        expect(task1.position).to eq(1)
        expect(task2.position).to eq(2)
        expect(task3.position).to eq(0)
        expect(task4.position).to eq(3)
      end
    end

    context 'moving task to same position' do
      it 'does not change positions' do
        original_positions = [ task1, task2, task3, task4 ].map(&:position)

        task2.update_position!(1)

        reloaded_positions = [ task1, task2, task3, task4 ].map { |t| t.reload.position }
        expect(reloaded_positions).to eq(original_positions)
      end
    end
  end

  describe 'factory' do
    it 'creates a valid task' do
      task = build(:task)
      expect(task).to be_valid
    end

    it 'creates a completed task' do
      task = create(:completed_task)
      expect(task.completed).to be true
    end

    it 'creates an important task' do
      task = create(:important_task)
      expect(task.important).to be true
    end

    it 'creates a task with tags' do
      task = create(:task_with_tags)
      expect(task.tags.count).to eq(2)
    end
  end
end
