class AddPositionToTasks < ActiveRecord::Migration[8.0]
  def change
    add_column :tasks, :position, :integer, default: 0
    add_index :tasks, :position
    
    # Define posições para tarefas existentes
    reversible do |dir|
      dir.up do
        Task.reset_column_information
        Task.find_each.with_index do |task, index|
          task.update_column(:position, index)
        end
      end
    end
  end
end
