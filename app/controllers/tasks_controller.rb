class TasksController < ApplicationController
  before_action :set_task, only: %i[ show edit update destroy toggle toggle_importance update_position ]

  # GET /tasks or /tasks.json
  def index
    @tasks = Task.ordered
  end

  # GET /tasks/1 or /tasks/1.json
  def show
    respond_to do |format|
      format.html # Mantém a view HTML normal
      format.json {
        render json: {
          id: @task.id,
          title: @task.title,
          description: @task.description.to_s,
          completed: @task.completed,
          important: @task.important,
          created_at: @task.created_at,
          updated_at: @task.updated_at,
          tags: @task.tags.map { |tag| { id: tag.id, name: tag.name } }
        }
      }
    end
  end

  # GET /tasks/new
  def new
    @task = Task.new
  end

  # GET /tasks/1/edit
  def edit
  end

  def toggle
    @task.update(completed: !@task.completed)
    respond_to do |format|
        format.turbo_stream
        format.html { redirect_to tasks_url }
    end
  end

  def toggle_importance
    @task.update(important: !@task.important)
    respond_to do |format|
        format.turbo_stream
        format.html { redirect_to tasks_url }
    end
  end

  def update_position
    new_position = params[:position].to_i
    @task.update_position!(new_position)

    respond_to do |format|
      format.json { render json: { status: "success", position: new_position } }
      format.html { redirect_to tasks_url }
    end
  end

  # POST /tasks or /tasks.json
  def create
    @task = Task.new(task_params)

    respond_to do |format|
      if @task.save
        # Para formato turbo_stream, retorna o template normal que vai incluir o toast
        format.turbo_stream do
          @toast_message = "✨ Tarefa \"#{@task.title}\" adicionada com sucesso!"
          @toast_type = "success"
          render :create
        end
        format.html { redirect_to task_url(@task), notice: "Task was successfully created." }
        format.json { render :show, status: :created, location: @task }
      else
        format.turbo_stream { render turbo_stream: turbo_stream.replace("new_task", partial: "tasks/form", locals: { task: @task }) }
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @task.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /tasks/1 or /tasks/1.json
  def update
    respond_to do |format|
      if @task.update(task_params)
        flash[:notice] = "✨ Tarefa \"#{@task.title}\" atualizada com sucesso!"
        
        format.turbo_stream do
          redirect_to tasks_path, status: :see_other
        end
        format.html { 
          redirect_to tasks_path, status: :see_other 
        }
        format.json { render :show, status: :ok, location: @task }
      else
        format.turbo_stream { render :edit, status: :unprocessable_entity }
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @task.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /tasks/1 or /tasks/1.json
  def destroy
    @task.destroy!

    respond_to do |format|
      format.turbo_stream { render turbo_stream: turbo_stream.remove(@task) }
      format.html { redirect_to tasks_url, notice: "Task was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_task
      @task = Task.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def task_params
      params.require(:task).permit(:title, :description, :tag_list, :color)
    end
end
