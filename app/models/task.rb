class Task < ApplicationRecord
    validates :description, presence: true

    has_rich_text :description
    has_many :task_tags, dependent: :destroy
    has_many :tags, through: :task_tags

    # Scope para ordenação por posição
    scope :ordered, -> { order(:position, :created_at) }

    # Callback para definir posição padrão para novas tarefas
    before_create :set_default_position

    def tag_list=(names)
        self.tags = names.split(",").map do |n|
            Tag.where(name: n.strip).first_or_create!
        end
    end

    def tag_list
        self.tags.map(&:name).join(", ")
    end

    def post_it_color
        color_to_use = self.color.presence || 'blue'
        "post-it-color--#{color_to_use}"
    end

    # Método para atualizar posição e reordenar outras tarefas
    def update_position!(new_position)
        old_position = self.position
        
        if new_position != old_position
            if new_position > old_position
                # Movendo para baixo: decrementa posições entre old_position+1 e new_position
                Task.where(position: (old_position + 1)..new_position).update_all("position = position - 1")
            else
                # Movendo para cima: incrementa posições entre new_position e old_position-1
                Task.where(position: new_position..(old_position - 1)).update_all("position = position + 1")
            end
            
            self.update_column(:position, new_position)
        end
    end

    private

    def set_default_position
        # Define a posição como o próximo número disponível (no topo da lista)
        max_position = Task.maximum(:position) || -1
        self.position = max_position + 1
    end
end
