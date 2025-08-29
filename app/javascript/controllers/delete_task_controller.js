import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="delete-task"
export default class extends Controller {
  static values = { url: String }

  delete(event) {
    event.preventDefault()
    
    const deleteUrl = event.currentTarget.getAttribute('href')
    const taskElement = event.currentTarget.closest('.todo-item')
    
    // Mostra o modal de confirmação
    window.showDeleteConfirmation(deleteUrl, taskElement)
  }
}

// Função global para mostrar o modal
window.showDeleteConfirmation = function(deleteUrl, taskElement) {
  const modal = document.querySelector('.confirmation-modal')
  if (!modal) {
    console.error('Modal de confirmação não encontrado')
    return
  }

  // Armazena as informações globalmente
  window.pendingDelete = {
    url: deleteUrl,
    element: taskElement
  }

  modal.style.display = 'flex'
  document.body.style.overflow = 'hidden'
  
  setTimeout(() => {
    modal.classList.add('show')
  }, 10)
}

// Função global para esconder o modal
window.hideDeleteConfirmation = function() {
  const modal = document.querySelector('.confirmation-modal')
  if (!modal) return
  
  modal.classList.remove('show')
  document.body.style.overflow = 'auto'
  
  setTimeout(() => {
    modal.style.display = 'none'
  }, 300)
}

// Função global para confirmar a exclusão
window.confirmDelete = function() {
  if (!window.pendingDelete) return
  
  window.hideDeleteConfirmation()
  
  // Cria a explosão de rabiscos
  createScribbleExplosion(window.pendingDelete.element)
  
  // Aguarda a animação e executa a exclusão
  setTimeout(() => {
    performDelete(window.pendingDelete.url)
  }, 800)
}

// Função para criar a explosão de partículas
function createScribbleExplosion(taskElement) {
  const rect = taskElement.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  // Adiciona classe de explosão ao elemento
  taskElement.classList.add('exploding')

  // Cria partículas rabiscadas
  for (let i = 0; i < 12; i++) {
    createScribbleParticle(centerX, centerY, i)
  }
}

function createScribbleParticle(centerX, centerY, index) {
  const particle = document.createElement('div')
  particle.className = 'scribble-particle'
  
  // Diferentes formas rabiscadas
  const scribbles = ['~', '∿', '≈', '⌇', '∽', '◊', '※', '✦', '✧', '❋', '⚡', '✗']
  particle.textContent = scribbles[index % scribbles.length]
  
  particle.style.position = 'fixed'
  particle.style.left = centerX + 'px'
  particle.style.top = centerY + 'px'
  particle.style.pointerEvents = 'none'
  particle.style.zIndex = '1000'
  particle.style.fontSize = '20px'
  particle.style.color = '#312F2F'
  particle.style.fontWeight = 'bold'
  
  document.body.appendChild(particle)

  // Anima a partícula
  const angle = (index * 30) * Math.PI / 180
  const distance = 100 + Math.random() * 50
  const endX = centerX + Math.cos(angle) * distance
  const endY = centerY + Math.sin(angle) * distance

  particle.animate([
    { 
      transform: 'translate(-50%, -50%) scale(1) rotate(0deg)',
      opacity: 1
    },
    { 
      transform: `translate(${endX - centerX}px, ${endY - centerY}px) scale(0.5) rotate(${Math.random() * 360}deg)`,
      opacity: 0
    }
  ], {
    duration: 800,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  }).onfinish = () => {
    particle.remove()
  }
}

// Função para executar a exclusão
function performDelete(deleteUrl) {
  fetch(deleteUrl, {
    method: 'DELETE',
    headers: {
      'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content,
      'Accept': 'text/vnd.turbo-stream.html'
    }
  }).then(response => {
    if (response.ok) {
      return response.text()
    }
  }).then(html => {
    if (html) {
      Turbo.renderStreamMessage(html)
    }
  }).catch(error => {
    console.error('Erro ao excluir tarefa:', error)
    // Remove visualmente mesmo se houver erro
    if (window.pendingDelete && window.pendingDelete.element) {
      window.pendingDelete.element.remove()
    }
  }).finally(() => {
    window.pendingDelete = null
  })
}
