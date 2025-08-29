import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static values = { taskId: Number }

  connect() {
    this.element.style.cursor = 'pointer'
    this.isDragging = false
    this.clickTimer = null
  }

  mouseDown(event) {
    // Se clicou em elemento interativo, não faz nada
    if (this.isInteractiveElement(event.target)) {
      return
    }

    this.isDragging = false
    this.startX = event.clientX
    this.startY = event.clientY

    // Timer para detectar se é um clique rápido
    this.clickTimer = setTimeout(() => {
      this.clickTimer = null
    }, 200)
  }

  mouseMove(event) {
    if (this.clickTimer) {
      const deltaX = Math.abs(event.clientX - this.startX)
      const deltaY = Math.abs(event.clientY - this.startY)
      
      // Se moveu mais que 5px, considera como drag
      if (deltaX > 5 || deltaY > 5) {
        this.isDragging = true
        clearTimeout(this.clickTimer)
        this.clickTimer = null
      }
    }
  }

  mouseUp(event) {
    // Se clicou em elemento interativo, não faz nada
    if (this.isInteractiveElement(event.target)) {
      return
    }

    // Se não estava arrastando e foi um clique rápido, abre o modal
    if (!this.isDragging && this.clickTimer) {
      this.openModal()
    }

    this.isDragging = false
    if (this.clickTimer) {
      clearTimeout(this.clickTimer)
      this.clickTimer = null
    }
  }

  click(event) {
    console.log('Click event triggered', event.target)
    
    // Se clicou em elemento interativo, não faz nada
    if (this.isInteractiveElement(event.target)) {
      console.log('Clicked on interactive element, ignoring')
      return
    }

    // Previne o comportamento padrão se estava arrastando
    if (this.isDragging) {
      console.log('Was dragging, preventing click')
      event.preventDefault()
      event.stopPropagation()
      return
    }

    console.log('Opening modal for task', this.taskIdValue)
    // Abre o modal para cliques normais
    this.openModal()
  }

  async openModal() {
    const modal = document.getElementById('task-modal')
    const modalBody = document.getElementById('task-modal-body')
    
    if (modal && modalBody) {
      try {
        // Mostra o modal com loading
        modalBody.innerHTML = '<div class="modal-loading">⏳ Carregando...</div>'
        modal.style.display = 'block'
        document.body.style.overflow = 'hidden'
        
        // Busca o conteúdo da tarefa
        const response = await fetch(`/tasks/${this.taskIdValue}`, {
          headers: {
            'Accept': 'application/json'
          }
        })
        
        if (response.ok) {
          const task = await response.json()
          this.renderTaskContent(task, modalBody)
        } else {
          modalBody.innerHTML = '<div class="modal-error">❌ Erro ao carregar tarefa</div>'
        }
      } catch (error) {
        console.error('Error loading task:', error)
        modalBody.innerHTML = '<div class="modal-error">❌ Erro ao carregar tarefa</div>'
      }
    } else {
      console.error('Modal ou modal body não encontrado', { modal, modalBody })
    }
  }

  renderTaskContent(task, container) {
    const completedClass = task.completed ? 'completed' : ''
    const importantIcon = task.important ? '⭐' : '☆'
    const tagsHtml = task.tags?.map(tag => `<span class="tag tag--warning">${tag.name}</span>`).join('') || ''
    
    container.innerHTML = `
      <div class="modal-task-content ${completedClass}">
        <div class="modal-task-header">
          <h2 class="modal-task-title">${task.title || 'Sem título'}</h2>
          <div class="modal-task-meta">
            <span class="modal-importance" data-important="${task.important}">
              ${importantIcon} ${task.important ? 'Importante' : 'Normal'}
            </span>
            <span class="modal-status" data-completed="${task.completed}">
              ${task.completed ? '✅ Concluída' : '⏳ Pendente'}
            </span>
          </div>
        </div>
        
        ${task.description ? `
          <div class="modal-task-description">
            <h4>📝 Descrição:</h4>
            <div class="description-content">${task.description}</div>
          </div>
        ` : ''}
        
        ${tagsHtml ? `
          <div class="modal-task-tags">
            <h4>🏷️ Tags:</h4>
            <div class="tags-list">${tagsHtml}</div>
          </div>
        ` : ''}
        
        <div class="modal-task-info">
          <div class="info-item">
            <strong>📅 Criada em:</strong> ${new Date(task.created_at).toLocaleDateString('pt-BR')}
          </div>
          ${task.updated_at !== task.created_at ? `
            <div class="info-item">
              <strong>📝 Atualizada em:</strong> ${new Date(task.updated_at).toLocaleDateString('pt-BR')}
            </div>
          ` : ''}
        </div>
        
        <div class="modal-actions">
          <button class="modal-btn modal-btn--edit" onclick="window.location.href='/tasks/${task.id}/edit'">
            ✏️ Editar
          </button>
          <button class="modal-btn modal-btn--close" onclick="window.closeTaskModal()">
            👍 Fechar
          </button>
        </div>
      </div>
    `
  }

  isInteractiveElement(element) {
    // Lista de elementos e classes que são interativos
    const interactiveSelectors = [
      'button',
      'input', 
      'select',
      'textarea',
      'a',
      '.checkbox',
      '.icon-star-wrapper',
      '.icon-trash-wrapper',
      'form'
    ]

    // Verifica se o elemento ou seus pais são interativos
    let current = element
    while (current && current !== this.element) {
      const tagName = current.tagName?.toLowerCase()
      const className = current.className || ''

      // Verifica tag
      if (interactiveSelectors.includes(tagName)) {
        return true
      }

      // Verifica classes
      for (const selector of interactiveSelectors) {
        if (selector.startsWith('.') && className.includes(selector.slice(1))) {
          return true
        }
      }

      current = current.parentElement
    }

    return false
  }
}
