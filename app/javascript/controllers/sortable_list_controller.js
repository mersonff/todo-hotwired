import { Controller } from '@hotwired/stimulus'
import Sortable from 'sortablejs'

// Connects to data-controller="sortable-list"
export default class extends Controller {
  connect() {
    console.log('Sortable controller connected!')
    
    this.sortable = Sortable.create(this.element, {
      animation: 400,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      ghostClass: 'task-ghost',
      chosenClass: 'task-chosen',
      dragClass: 'task-drag',
      // Remover handle para permitir drag em qualquer lugar do card
      filter: '.checkbox, .icon-star-wrapper, .icon-trash-wrapper, button, form, input, a', // Elementos que não devem iniciar drag
      preventOnFilter: false,
      delay: 150, // Pequeno delay para distinguir entre click e drag
      delayOnTouchStart: true,
      onStart: (event) => {
        console.log('Drag started!', event)
        this.onDragStart(event)
      },
      onEnd: (event) => {
        console.log('Drag ended!', event)
        this.onDragEnd(event)
      },
      onMove: (event) => {
        this.onDragMove(event)
      }
    })
  }

  disconnect() {
    console.log('Sortable controller disconnected!')
    if (this.sortable) {
      this.sortable.destroy()
    }
  }

  onDragStart(event) {
    const item = event.item
    
    // Vibração no móvel (se suportado)
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
    
    // Adiciona classes para animação
    item.classList.add('dragging')
    document.body.classList.add('is-dragging')
    
    // Adiciona rotação e escala
    item.style.transform = 'scale(1.05) rotate(5deg)'
    item.style.zIndex = '1000'
  }

  onDragEnd(event) {
    const item = event.item
    
    // Vibração de confirmação no móvel
    if (navigator.vibrate && event.oldIndex !== event.newIndex) {
      navigator.vibrate([30, 20, 30])
    }
    
    // Remove classes e estilos
    item.classList.remove('dragging')
    document.body.classList.remove('is-dragging')
    item.style.transform = ''
    item.style.zIndex = ''
    
    // Adiciona animação de "pouso"
    this.addLandingAnimation(item)
    
    // Se a posição mudou, atualiza no servidor
    if (event.oldIndex !== event.newIndex) {
      this.updateTaskPosition(event.item, event.newIndex)
    }
  }

  onDragMove(event) {
    const related = event.related
    if (related) {
      // Adiciona efeito visual no item de destino
      related.classList.add('drop-target')
      related.style.transform = 'scale(1.02) rotate(-2deg)'
      
      setTimeout(() => {
        related.classList.remove('drop-target')
        related.style.transform = ''
      }, 300)
    }
  }

  addLandingAnimation(item) {
    item.classList.add('landing-effect')
    
    // Cria burst de partículas no pouso
    this.createLandingBurst(item)
    
    setTimeout(() => {
      item.classList.remove('landing-effect')
    }, 600)
  }

  createLandingBurst(item) {
    const rect = item.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    // Cria 8 partículas em burst
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        this.createBurstParticle(centerX, centerY, i)
      }, i * 25)
    }
  }

  createBurstParticle(centerX, centerY, index) {
    const particle = document.createElement('div')
    particle.className = 'burst-particle'
    particle.textContent = ['✨', '⭐', '💫', '✦'][index % 4]
    
    particle.style.position = 'fixed'
    particle.style.left = centerX + 'px'
    particle.style.top = centerY + 'px'
    particle.style.pointerEvents = 'none'
    particle.style.zIndex = '1001'
    particle.style.fontSize = '16px'
    
    document.body.appendChild(particle)
    
    const angle = (index * 45) * Math.PI / 180
    const distance = 60
    
    particle.animate([
      { 
        opacity: 1,
        transform: 'translate(-50%, -50%) scale(0.5)'
      },
      { 
        opacity: 1,
        transform: `translate(${Math.cos(angle) * distance - 50}%, ${Math.sin(angle) * distance - 50}%) scale(1)`
      },
      { 
        opacity: 0,
        transform: `translate(${Math.cos(angle) * distance - 50}%, ${Math.sin(angle) * distance - 50}%) scale(0.3)`
      }
    ], {
      duration: 600,
      easing: 'ease-out'
    }).onfinish = () => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle)
      }
    }
  }

  updateTaskPosition(taskElement, newPosition) {
    console.log('Updating position for:', taskElement, 'to position:', newPosition)
    
    // Extrai o ID da tarefa do elemento
    const taskId = this.extractTaskId(taskElement)
    console.log('Task ID:', taskId)
    
    if (!taskId) {
      console.error('Could not extract task ID')
      return
    }

    // Envia a atualização para o servidor
    fetch(`/tasks/${taskId}/update_position`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        position: newPosition
      })
    }).then(response => {
      console.log('Response:', response)
      if (response.ok) {
        console.log('Position updated successfully!')
        this.showSuccessFeedback(taskElement)
      } else {
        console.error('Erro ao atualizar posição da tarefa')
        this.showErrorFeedback(taskElement)
      }
    }).catch(error => {
      console.error('Erro na requisição:', error)
      this.showErrorFeedback(taskElement)
    })
  }

  extractTaskId(element) {
    // Primeiro tenta o data-task-id que agora está diretamente no <li>
    const taskId = element.dataset.taskId
    if (taskId) {
      console.log('Found task ID from data attribute:', taskId)
      return taskId
    }
    
    // Fallback: procura por turbo-frame
    const turboFrame = element.querySelector('turbo-frame') || element.closest('turbo-frame')
    if (turboFrame) {
      const id = turboFrame.id
      console.log('Turbo frame ID:', id)
      const match = id.match(/task_(\d+)/)
      return match ? match[1] : null
    }
    
    console.error('Could not find task ID in element:', element)
    return null
  }

  showSuccessFeedback(element) {
    element.classList.add('position-updated')
    console.log('Success feedback shown')
    
    setTimeout(() => {
      element.classList.remove('position-updated')
    }, 1000)
  }

  showErrorFeedback(element) {
    element.classList.add('position-error')
    console.log('Error feedback shown')
    
    setTimeout(() => {
      element.classList.remove('position-error')
    }, 2000)
  }
}

// Rastreamento global do mouse
document.addEventListener('mousemove', (e) => {
  window.lastMouseX = e.clientX
  window.lastMouseY = e.clientY
})

// Inicializa posição do mouse
window.lastMouseX = window.innerWidth / 2
window.lastMouseY = window.innerHeight / 2
