require 'rails_helper'

RSpec.describe TasksController, type: :controller do
  describe 'GET #index' do
    let!(:task1) { create(:task, position: 2, created_at: 1.day.ago) }
    let!(:task2) { create(:task, position: 1, created_at: Time.current) }

    it 'returns http success' do
      get :index
      expect(response).to have_http_status(:success)
    end

    it 'assigns @tasks ordered by position' do
      get :index
      expect(assigns(:tasks)).to eq([ task2, task1 ])
    end

    it 'renders the index template' do
      get :index
      expect(response).to render_template(:index)
    end
  end

  describe 'GET #show' do
    let(:task) { create(:task) }

    it 'returns http success' do
      get :show, params: { id: task.id }
      expect(response).to have_http_status(:success)
    end

    it 'assigns the requested task' do
      get :show, params: { id: task.id }
      expect(assigns(:task)).to eq(task)
    end

    it 'renders the show template' do
      get :show, params: { id: task.id }
      expect(response).to render_template(:show)
    end
  end

  describe 'GET #new' do
    it 'returns http success' do
      get :new
      expect(response).to have_http_status(:success)
    end

    it 'assigns a new task' do
      get :new
      expect(assigns(:task)).to be_a_new(Task)
    end

    it 'renders the new template' do
      get :new
      expect(response).to render_template(:new)
    end
  end

  describe 'POST #create' do
    context 'with valid parameters' do
      let(:valid_attributes) do
        {
          title: 'Nova tarefa',
          description: 'Descrição da nova tarefa',
          color: 'blue'
        }
      end

      it 'creates a new task' do
        expect {
          post :create, params: { task: valid_attributes }
        }.to change(Task, :count).by(1)
      end

      it 'redirects to the created task' do
        post :create, params: { task: valid_attributes }
        expect(response).to redirect_to(Task.last)
      end

      it 'sets a success flash message' do
        post :create, params: { task: valid_attributes }
        expect(flash[:notice]).to be_present
      end
    end

    context 'with invalid parameters' do
      let(:invalid_attributes) do
        {
          title: 'Nova tarefa',
          description: '', # Invalid: description is required
          color: 'blue'
        }
      end

      it 'does not create a new task' do
        expect {
          post :create, params: { task: invalid_attributes }
        }.not_to change(Task, :count)
      end

      it 'renders the new template' do
        post :create, params: { task: invalid_attributes }
        expect(response).to render_template(:new)
      end

      it 'returns unprocessable entity status' do
        post :create, params: { task: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'GET #edit' do
    let(:task) { create(:task) }

    it 'returns http success' do
      get :edit, params: { id: task.id }
      expect(response).to have_http_status(:success)
    end

    it 'assigns the requested task' do
      get :edit, params: { id: task.id }
      expect(assigns(:task)).to eq(task)
    end

    it 'renders the edit template' do
      get :edit, params: { id: task.id }
      expect(response).to render_template(:edit)
    end
  end

  describe 'PATCH #update' do
    let(:task) { create(:task) }

    context 'with valid parameters' do
      let(:new_attributes) do
        {
          title: 'Título atualizado',
          description: 'Descrição atualizada',
          color: 'green'
        }
      end

      it 'updates the requested task' do
        patch :update, params: { id: task.id, task: new_attributes }
        task.reload
        expect(task.title).to eq('Título atualizado')
        expect(task.color).to eq('green')
      end

      it 'redirects to the task' do
        patch :update, params: { id: task.id, task: new_attributes }
        expect(response).to redirect_to(tasks_path)
      end

      it 'sets a success flash message' do
        patch :update, params: { id: task.id, task: new_attributes }
        expect(flash[:notice]).to be_present
      end
    end

    context 'with invalid parameters' do
      let(:invalid_attributes) do
        {
          title: 'Título atualizado',
          description: '', # Invalid: description is required
          color: 'green'
        }
      end

      it 'does not update the task' do
        original_title = task.title
        patch :update, params: { id: task.id, task: invalid_attributes }
        task.reload
        expect(task.title).to eq(original_title)
      end

      it 'renders the edit template' do
        patch :update, params: { id: task.id, task: invalid_attributes }
        expect(response).to render_template(:edit)
      end

      it 'returns unprocessable entity status' do
        patch :update, params: { id: task.id, task: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'DELETE #destroy' do
    let!(:task) { create(:task) }

    it 'destroys the requested task' do
      expect {
        delete :destroy, params: { id: task.id }
      }.to change(Task, :count).by(-1)
    end

    it 'redirects to the tasks list' do
      delete :destroy, params: { id: task.id }
      expect(response).to redirect_to(tasks_url)
    end

    it 'sets a success flash message' do
      delete :destroy, params: { id: task.id }
      expect(flash[:notice]).to be_present
    end
  end

  describe 'PATCH #toggle' do
    let(:task) { create(:task, completed: false) }

    it 'toggles the completed status' do
      patch :toggle, params: { id: task.id }
      task.reload
      expect(task.completed).to be true
    end

    it 'redirects to tasks index' do
      patch :toggle, params: { id: task.id }
      expect(response).to redirect_to(tasks_path)
    end
  end

  describe 'PATCH #toggle_importance' do
    let(:task) { create(:task, important: false) }

    it 'toggles the important status' do
      patch :toggle_importance, params: { id: task.id }
      task.reload
      expect(task.important).to be true
    end

    it 'redirects to tasks index' do
      patch :toggle_importance, params: { id: task.id }
      expect(response).to redirect_to(tasks_path)
    end
  end

  describe 'PATCH #update_position' do
    let!(:task1) { create(:task, position: 0) }
    let!(:task2) { create(:task, position: 1) }
    let!(:task3) { create(:task, position: 2) }

    it 'updates the task position' do
      patch :update_position, params: { id: task1.id, position: 2 }
      task1.reload
      expect(task1.position).to eq(2)
    end

    it 'redirects after updating position' do
      patch :update_position, params: { id: task1.id, position: 2 }
      expect(response).to have_http_status(:found)
    end
  end
end
