// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

import "trix"
import "@rails/actiontext"

// Global toast function
window.showToast = function(message, type = 'success') {
    const container = document.getElementById('toast-container') || (() => {
        const div = document.createElement('div')
        div.id = 'toast-container'
        div.className = 'toast-container'
        document.body.appendChild(div)
        return div
    })()
    
    const toast = document.createElement('div')
    toast.className = `toast toast--${type}`
    
    const icon = type === 'success' ? '✨' : type === 'error' ? '❌' : 'ℹ️'
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `

    container.appendChild(toast)

    // Mostrar o toast
    setTimeout(() => {
        toast.classList.add('show')
    }, 100)

    // Auto remover após 4 segundos
    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.remove('show')
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove()
                }
            }, 300)
        }
    }, 4000)
}

// Observar quando elementos toast-trigger forem adicionados
document.addEventListener('DOMContentLoaded', function() {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    // Verificar se é um meta tag com toast-data
                    if (node.nodeName === 'META' && node.name === 'toast-data') {
                        const message = node.content
                        const type = node.dataset.type
                        
                        if (message) {
                            showToast(message, type)
                            node.remove() // Remove o meta após usar
                        }
                    }
                    
                    // Buscar dentro do elemento também
                    const metaToast = node.querySelector && node.querySelector('meta[name="toast-data"]')
                    if (metaToast) {
                        const message = metaToast.content
                        const type = metaToast.dataset.type
                        
                        if (message) {
                            showToast(message, type)
                            metaToast.remove()
                        }
                    }
                }
            })
        })
    })
    
    // Observar tanto body quanto head
    observer.observe(document.head, {
        childList: true,
        subtree: true
    })
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    })
})

// Observar eventos Turbo para capturar toast antes do render
document.addEventListener('turbo:before-stream-render', function(event) {
    const streamElement = event.detail.newStream
    if (streamElement) {
        // Se for um append para head, capturar os dados do toast
        if (streamElement.action === 'append' && streamElement.target === 'head') {
            const template = streamElement.templateElement || streamElement.querySelector('template')
            if (template) {
                const metaTag = template.content.querySelector('meta[name="toast-data"]') || template.querySelector('meta[name="toast-data"]')
                if (metaTag) {
                    const message = metaTag.getAttribute('content')
                    const type = metaTag.getAttribute('data-type')
                    
                    if (message) {
                        showToast(message, type)
                        // Prevenir que o meta seja adicionado ao DOM
                        event.preventDefault()
                    }
                }
            }
        }
    }
})

// Fallback: verificar após render
document.addEventListener('turbo:render', function() {
    setTimeout(() => {
        const metaTag = document.querySelector('meta[name="toast-data"]')
        if (metaTag) {
            const message = metaTag.getAttribute('content')
            const type = metaTag.getAttribute('data-type')
            
            if (message) {
                showToast(message, type)
                metaTag.remove()
            }
        }
    }, 100)
})

// Verificar mensagens de toast após carregamento (funciona com Turbo)
function checkFlashMessages() {
    // Flash messages do Rails
    const flashNotice = document.querySelector('meta[name="flash-notice"]')
    const flashAlert = document.querySelector('meta[name="flash-alert"]')
    
    if (flashNotice) {
        showToast(flashNotice.getAttribute('content'), 'success')
        flashNotice.remove()
    }
    
    if (flashAlert) {
        showToast(flashAlert.getAttribute('content'), 'error')
        flashAlert.remove()
    }
    
    // SessionStorage messages (para casos especiais)
    const toastMessage = sessionStorage.getItem('toast_message')
    const toastType = sessionStorage.getItem('toast_type')
    
    if (toastMessage) {
        showToast(toastMessage, toastType || 'success')
        
        // Limpar as mensagens do sessionStorage
        sessionStorage.removeItem('toast_message')
        sessionStorage.removeItem('toast_type')
    }
}

// Verificar mensagens de toast no sessionStorage após redirecionamentos
document.addEventListener('DOMContentLoaded', checkFlashMessages)
document.addEventListener('turbo:load', checkFlashMessages)
