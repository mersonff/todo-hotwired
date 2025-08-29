class AddImportantToTasks < ActiveRecord::Migration[8.0]
  def change
    add_column :tasks, :important, :boolean
  end
end
