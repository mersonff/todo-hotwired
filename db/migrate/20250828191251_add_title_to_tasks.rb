class AddTitleToTasks < ActiveRecord::Migration[8.0]
  def change
    add_column :tasks, :title, :string
  end
end
