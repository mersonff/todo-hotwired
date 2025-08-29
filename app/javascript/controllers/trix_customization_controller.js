import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['editor']

  connect() {
    // Aguarda o Trix estar completamente carregado
    this.element.addEventListener('trix-initialize', this.setupCustomizations.bind(this))
    
    // Se já está inicializado, aplica as customizações
    if (this.element.editor) {
      this.setupCustomizations()
    }
  }

  setupCustomizations() {
    this.translateTrixToolbar()
    this.customizeIcons()
    this.setupPlaceholder()
  }

  translateTrixToolbar() {
    const toolbar = this.element.previousElementSibling
    if (!toolbar || !toolbar.classList.contains('trix-toolbar')) {
      return
    }

    const buttons = toolbar.querySelectorAll('.trix-button')
    
    const translations = {
      'Bold': 'Negrito 🔤',
      'Italic': 'Itálico ◗',
      'Link': 'Link 🔗',
      'Heading 1': 'Título 📋',
      'Quote': 'Citação 💬',
      'Code': 'Código 💻',
      'Bullet List': 'Lista • ',
      'Number List': 'Lista 1.',
      'Decrease Nesting Level': 'Diminuir ⬅️',
      'Increase Nesting Level': 'Aumentar ➡️',
      'Attach Files': 'Anexar 📎',
      'Undo': 'Desfazer ↶',
      'Redo': 'Refazer ↷'
    }
    
    buttons.forEach(button => {
      const currentTitle = button.getAttribute('title')
      if (currentTitle && translations[currentTitle]) {
        button.setAttribute('title', translations[currentTitle])
        button.setAttribute('aria-label', translations[currentTitle])
      }
    })
  }

  customizeIcons() {
    const toolbar = this.element.previousElementSibling
    if (!toolbar || !toolbar.classList.contains('trix-toolbar')) {
      return
    }

    // Customiza ícones com emojis e símbolos
    const iconMappings = {
      'bold': '𝐁',
      'italic': '𝐼',
      'link': '🔗',
      'heading-1': '📋',
      'quote': '❝',
      'code': '⟨⟩',
      'bullet-list': '●',
      'number-list': '➊',
      'outdent': '⇤',
      'indent': '⇥',
      'attach': '📎',
      'undo': '↶',
      'redo': '↷'
    }

    Object.entries(iconMappings).forEach(([className, icon]) => {
      const button = toolbar.querySelector(`.trix-button--icon-${className}`)
      if (button) {
        button.innerHTML = `<span class="custom-trix-icon">${icon}</span>`
      }
    })
  }

  setupPlaceholder() {
    const editor = this.element
    
    if (!editor.hasAttribute('placeholder')) {
      editor.setAttribute('placeholder', 'Digite aqui sua descrição detalhada... ✨')
    }
    
    // Adiciona classe para styling quando tem conteúdo
    editor.addEventListener('trix-change', () => {
      if (editor.editor && editor.editor.getDocument().toString().trim()) {
        editor.classList.add('has-content')
      } else {
        editor.classList.remove('has-content')
      }
    })

    // Estados de foco
    editor.addEventListener('trix-focus', () => {
      editor.classList.add('trix-focused')
    })

    editor.addEventListener('trix-blur', () => {
      editor.classList.remove('trix-focused')
    })
  }
}
